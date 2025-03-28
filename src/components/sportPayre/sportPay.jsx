import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, BoxIcon as Boxing, SpaceIcon as Yoga, BarcodeIcon as Karate, Swords, Calendar, DollarSign, X, Search, Printer } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { isPast, parse, addDays, format } from 'date-fns';
import { motion } from 'framer-motion';
import logo from '../../images/logo.jpg'; // Chemin relatif correct depuis le composant


const sports = [
  { name: "الأيروبيك", icon: Yoga },
  { name: "الملاكمة", icon: Boxing },
  { name: "اللياقة البدنية", icon: Dumbbell },
  { name: "التايكوندو", icon: Karate },
  { name: "الفول كونتاكت", icon: Swords },
  { name: 'كمال الأجسام', icon: Swords }
];


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
      fetchExpiredClients();
      setPaymentSuccess(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const closePaymentModal = () => {
    setSelectedClient(null);
    setFormData({ startDate: '', endDate: '', amount: '' });
    setPaymentSuccess(false);
  };

const generateReceiptContent = (client, formData) => {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>إيصال الدفع</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 10px;
      max-width: 500px;
      margin: 0 auto;
      background-color: #fff;
    }
    .header {
      display: flex;
      margin-bottom: 0px;
      padding-bottom: 0px;
      gap: 10px;
    }
    .logo-container {
      flex-shrink: 0;
    }
    .logo {
      max-width: 80px;
      max-height: 80px;
      border: 1px solid #ddd;
      padding: 2px;
    }
    .header-text {
      flex-grow: 1;
      text-align: right;
    }
    .association-name {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 5px;
      color: #000;
    }
    .association-name-french {
      font-size: 14px;
      color: #333;
      margin-bottom: 5px;
    }
    .address {
      font-size: 12px;
      color: #555;
      margin-bottom: 5px;
      line-height: 1.4;
    }
    .section {
      margin-bottom: 0px;
    }
    .section-title {
      font-weight: bold;
 text-align: center;
      margin-bottom: 8px;
      font-size: 16px;
    }
    .payment-info {
      text-align: center;
      font-size: 14px;
      margin-bottom: 5px;
    }
    .amount {
      
      font-size: 16px;
      color: #000;
    }
    .details {
     
    }
    .detail-row {
      margin-bottom: 10px;
    }
    .detail-label {
      font-weight: bold;
      display: inline-block;
      min-width: 120px;
    }
    .detail-value {
      display: inline;
      margin-right: 10px;
    }
    .signature {
      margin-top: 30px;
      text-align: left;
      font-size: 12px;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 10px;
      color: #666;
    }

    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none;
      }
      @page {
        size: auto;
        margin: 5mm;
      }
      .details {
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-container">
      <img src="${logo}" class="logo" alt="Logo Association">
    </div>
    <div class="header-text">
      <div class="association-name">جمعية النصر سابس للرياضة</div>
      <div class="association-name-french">Association EL nasser saiss du Sport</div>
      <div class="address">تجزئه ايمان رقم 1 حي السانيه طريق صفرو - قاس الهاتف: 06.67.18.53.51</div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">${client.sport_type}</div>
  </div>
  
  <div class="details">
    <span class="detail-label">الرقــــم :</span>
    <span class="detail-value">${client.id}</span>
    <div class="detail-row">
      <span class="detail-label">الاسم الكامل:</span>
      <span class="detail-value">${client.first_name} ${client.last_name}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">الثمن:</span>
      <span class="detail-value amount">${client.price} درهم</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">تاريخ الأداء :</span>
      <span class="detail-value">${displayDate(formData.startDate)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">وصل الأداء من</span>
      <span class="detail-value">${displayDate(formData.startDate)} إلى ${displayDate(formData.endDate)}</span>
    </div>
  </div>
  
  <!-- Contenu à ne pas imprimer -->
  <div class="no-print" style="text-align: center; margin-top: 20px;">
    <button onclick="window.print()" style="
      padding: 10px 20px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
    ">
      طباعة الإيصال
    </button>
    <button onclick="window.close()" style="
      padding: 10px 20px;
      background: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    ">
      إغلاق
    </button>
  </div>
</body>
</html>


  `;
};

const previewReceipt = (client, formData) => {
  const receiptWindow = window.open('', '_blank');
  receiptWindow.document.write(generateReceiptContent(client, formData));
  receiptWindow.document.close();
};
  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">الأعضاء حسب الرياضة</h1>
      
      {/* Cartes des sports */}
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

      {/* Modal de renouvellement */}
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
      <button
        onClick={closePaymentModal}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        إغلاق
      </button>
    </div>
  </div>
            ) : (
              <form onSubmit={handleUpdatePayment} className="p-6">
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
    
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => previewReceipt(selectedClient, formData)}
        className="flex-1 py-3 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-all flex justify-center items-center"
      >
        <Printer className="mr-2" size={18} />
        معاينة الإيصال
      </button>
      <button 
        type="submit" 
        className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex justify-center items-center"
      >
        <DollarSign className="mr-2" size={18} />
        تأكيد الدفع
      </button>
    </div>
  </div>
</form>
            )}
          </motion.div>
        </div>
      )}

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <motion.div 
            className="bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
              <h2 className="text-xl font-bold text-white">تفاصيل العضوية</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4 space-y-3">
              {(Array.isArray(selectedUser) ? selectedUser : [selectedUser]).map((payment, i) => (
                <div key={i} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-3">
                    <span className="text-gray-300">الدفعة #{i+1}</span>
                    <span className="font-bold text-lg text-green-400">{payment.price} درهم</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-600 p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">من</p>
                      <p className="font-medium">{displayDate(payment.start_date)}</p>
                    </div>
                    <div className="bg-gray-600 p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">إلى</p>
                      <p className="font-medium">{displayDate(payment.end_date)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SportPaye;