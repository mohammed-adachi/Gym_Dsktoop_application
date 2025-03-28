import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, BoxIcon as Boxing, SpaceIcon as Yoga, BarcodeIcon as Karate, Swords, Calendar, DollarSign, X, Search, Printer } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { isPast, parse, addDays, format } from 'date-fns';
import { motion } from 'framer-motion';
import ReactToPrint from 'react-to-print';
import logo from '../../images/logo.jpg';

const sports = [
  { name: "الأيروبيك", icon: Yoga },
  { name: "الملاكمة", icon: Boxing },
  { name: "اللياقة البدنية", icon: Dumbbell },
  { name: "التايكوندو", icon: Karate },
  { name: "الفول كونتاكت", icon: Swords },
  { name: "كمال الأجسام", icon: Dumbbell },
];

const Receipt = React.forwardRef(({ client, paymentData }, ref) => {
  const formatReceiptDate = (dateStr) => {
    try {
      return format(parse(dateStr, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy');
    } catch {
      return dateStr;
    }
  };

  const printStyles = `
    @media print {
      body * {
        visibility: hidden;
      }
      .receipt-container, .receipt-container * {
        visibility: visible;
      }
      .receipt-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 80mm;
        padding: 10px;
        font-family: Arial, sans-serif;
      }
    }
    .receipt {
      width: 100%;
      border: 1px solid #ddd;
      padding: 15px;
      font-family: Arial, sans-serif;
    }
    .header {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    .logo {
      width: 70px;
      height: 70px;
      margin-left: 10px;
    }
    .header-text {
      text-align: right;
      flex-grow: 1;
    }
    .gym-name {
      margin: 0;
      font-size: 18px;
      font-weight: bold;
    }
    .print-date {
      margin: 5px 0 0;
      font-size: 12px;
      color: #666;
    }
    .content {
      margin: 15px 0;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .label {
      font-weight: bold;
      margin-left: 10px;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      font-style: italic;
      font-size: 12px;
      padding-top: 10px;
      border-top: 1px solid #eee;
    }
  `;

  return (
    <div className="receipt-container">
      <style>{printStyles}</style>
      <div className="receipt" ref={ref}>
        <div className="header">
          <img src={logo} alt="نادي اللياقة البدنية" className="logo" />
          <div className="header-text">
            <h1 className="gym-name">جمعية النصر سايس للرياضة</h1>
            <p className="print-date">تاريخ الطباعة: {new Date().toLocaleDateString("ar-EG")}</p>
          </div>
        </div>
        <div className="content">
          <div className="row">
            <span className="label">رقم العضو:</span>
            <span>{client.id}</span>
          </div>
          <div className="row">
            <span className="label">اسم العضو:</span>
            <span>{client.first_name} {client.last_name}</span>
          </div>
          <div className="row">
            <span className="label">الرياضة:</span>
            <span>{client.sport_type}</span>
          </div>
          <div className="row">
            <span className="label">المبلغ:</span>
            <span>{paymentData.amount} درهم</span>
          </div>
          <div className="row">
            <span className="label">تاريخ البدء:</span>
            <span>{formatReceiptDate(paymentData.startDate)}</span>
          </div>
          <div className="row">
            <span className="label">تاريخ الانتهاء:</span>
            <span>{formatReceiptDate(paymentData.endDate)}</span>
          </div>
        </div>
        <div className="footer">
          شكراً لاختياركم جمعية النصر سايس للرياضة
        </div>
      </div>
    </div>
  );
});

const SportPaye = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [expiredClients, setExpiredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    amount: ''
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const receiptRef = useRef();

  const parseAnyDate = (dateStr) => {
    if (!dateStr) return new Date();
    
    const formats = [
      'dd/MM/yyyy', 'dd-MM-yyyy', 'yyyy/MM/dd', 
      'yyyy-MM-dd', 'MM/dd/yyyy', 'MM-dd-yyyy'
    ];
    
    for (const formatStr of formats) {
      try {
        const parsed = parse(dateStr, formatStr, new Date());
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      } catch (e) {
        continue;
      }
    }
    
    return new Date();
  };

  useEffect(() => {
    fetchExpiredClients();
  }, []);

  const fetchExpiredClients = async () => {
    try {
      const users = await invoke('get_all_users');
      const expired = users.filter(user => {
        return user.end_date && isPast(parseAnyDate(user.end_date));
      });
      setExpiredClients(expired);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const displayDate = (dateStr) => {
    if (!dateStr) return 'غير محدد';
    const date = parseAnyDate(dateStr);
    return format(date, 'dd/MM/yyyy');
  };

  const formatToInputDate = (dateStr) => {
    if (!dateStr) return '';
    const date = parseAnyDate(dateStr);
    return format(date, 'yyyy-MM-dd');
  };

  const calculateEndDate = (startDate) => {
    if (!startDate) return '';
    const date = parse(startDate, 'yyyy-MM-dd', new Date());
    const endDate = addDays(date, 30);
    return format(endDate, 'yyyy-MM-dd');
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      if (name === 'startDate') {
        newData.endDate = calculateEndDate(value);
      }
      
      return newData;
    });
  };

  const getFilteredClients = () => {
    let filtered = expiredClients;
    
    if (selectedSport) {
      filtered = filtered.filter(client => client.sport_type === selectedSport);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        (client.first_name?.toLowerCase().includes(term)) ||
        (client.last_name?.toLowerCase().includes(term)) ||
        (client.phone?.includes(searchTerm)) ||
        (client.id?.includes(searchTerm))
      );
    }
    
    return filtered;
  };

  const handleViewDetails = async (user) => {
    try {
      const details = await invoke("user_historyId", { id: String(user.id) });
      setSelectedUser(details);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    try {
      await invoke('updat_user', { 
        user: {
          id: selectedClient.id,
          start_date: formData.startDate,
          end_date: formData.endDate,
          price: parseFloat(formData.amount)
        } 
      });
      await fetchExpiredClients();
      setPaymentSuccess(true);
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const closePaymentModal = () => {
    setSelectedClient(null);
    setFormData({ startDate: '', endDate: '', amount: '' });
    setPaymentSuccess(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">الأعضاء حسب الرياضة</h1>
      
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {sports.map((sport) => (
          <motion.button
            key={sport.name}
            onClick={() => setSelectedSport(sport.name)}
            className={`flex flex-col items-center justify-center w-32 h-32 rounded-xl shadow-md transition-all ${
              selectedSport === sport.name 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                : 'bg-white text-gray-800 hover:shadow-lg'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <sport.icon className="mb-2" size={28} />
            <span className="font-medium">{sport.name}</span>
          </motion.button>
        ))}
      </div>

      {selectedSport && (
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 right-3 flex items-center pr-3 pointer-events-none">
              <Search className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ابحث باسم العضو أو رقم ..."
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-white shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {selectedSport ? (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">العملاء المنتهية عضويتهم في {selectedSport}</h2>
          
          {getFilteredClients().length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                {searchTerm ? "لا توجد نتائج مطابقة للبحث" : "لا توجد اشتراكات منتهية"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {getFilteredClients().map(client => (
                <motion.div
                  key={client.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg border border-gray-200 hover:border-blue-200 bg-gradient-to-r from-white to-gray-50"
                  whileHover={{ x: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="mb-3 md:mb-0">
                    <h3 className="font-bold text-lg text-gray-800">
                      {client.first_name} {client.last_name}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <span className="text-sm text-gray-600 flex items-center">
                        <Calendar className="mr-1" size={14} />
                        انتهى في {displayDate(client.end_date)}
                      </span>
                      {client.phone && (
                        <span className="text-sm text-gray-600">
                          الهاتف: {client.phone}
                        </span>
                      )}
                      {client.id && (
                        <span className="text-sm text-gray-600">
                          الرقم: {client.id}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 self-end md:self-auto">
                    <button
                      onClick={() => handleViewDetails(client)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center text-sm"
                    >
                      التفاصيل
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClient(client);
                        setFormData({
                          startDate: formatToInputDate(client.end_date),
                          endDate: calculateEndDate(formatToInputDate(client.end_date)),
                          amount: ''
                        });
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center text-sm"
                    >
                      <Calendar className="mr-1" size={14} />
                      تجديد
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">يرجى اختيار رياضة لعرض الأعضاء المنتهية عضويتهم</p>
        </div>
      )}

      {selectedClient && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <motion.div 
      className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {paymentSuccess ? 'تم الدفع بنجاح' : 'تجديد العضوية'}
        </h2>
        <button 
          onClick={closePaymentModal} 
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
        >
          <X size={24} />
        </button>
      </div>
      
      {paymentSuccess ? (
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">تم تجديد العضوية بنجاح</h3>
            <p className="text-gray-500">تم دفع {formData.amount} درهم</p>
          </div>

          <div className="flex justify-center">
            <ReactToPrint
              trigger={() => (
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2">
                  <Printer size={18} />
                  طباعة الإيصال
                </button>
              )}
              content={() => receiptRef.current}
              onAfterPrint={closePaymentModal}
              pageStyle={`
                @page {
                  size: 80mm 200mm;
                  margin: 0;
                }
                @media print {
                  body {
                    padding: 10px;
                    font-size: 14px;
                  }
                }
              `}
            />
          </div>

          <div style={{ display: 'none' }}>
            <Receipt 
              ref={receiptRef} 
              client={selectedClient} 
              paymentData={{
                amount: formData.amount,
                startDate: formData.startDate,
                endDate: formData.endDate
              }} 
            />
          </div>
        </div>
      ) : (
        <form onSubmit={async (e) => {
          const success = await handleUpdatePayment(e);
          if (success) {
            setPaymentSuccess(true);
          }
        }} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البدء</label>
              <input 
                type="date" 
                name="startDate" 
                value={formData.startDate}
                onChange={handleDateChange}
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء</label>
              <input 
                type="date" 
                name="endDate" 
                value={formData.endDate}
                onChange={handleDateChange}
                required 
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" 
              />
              <p className="text-xs text-gray-500 mt-1">سيتم حسابها تلقائياً (+30 يوماً)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (درهم)</label>
              <input 
                type="number" 
                name="amount" 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
                min="0" 
                step="0.01" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex justify-center items-center mt-4 text-lg"
            >
              <DollarSign className="mr-2" size={20} />
              حفظ وطباعة الإيصال
            </button>
          </div>
        </form>
      )}
    </motion.div>
  </div>
)}
    </div>
  );
};

export default SportPaye;