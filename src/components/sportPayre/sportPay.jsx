import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, BoxIcon as Boxing, SpaceIcon as Yoga, BarcodeIcon as Karate, Swords,Briefcase  , Calendar,CreditCard  , DollarSign, X, Search, Printer, Eye, Edit  } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { isPast, parse, addDays, format } from 'date-fns';
import { motion } from 'framer-motion';
import logo from '../../images/logo.jpg';
import { Save ,
 User, 
  MapPin, Phone, Clock, Award 
} from 'lucide-react';

const sports = [
  { name: "الأيروبيك", icon: Yoga },
  { name: "الملاكمة", icon: Boxing },
  { name: "اللياقة البدنية", icon: Dumbbell },
  { name: "التايكوندو", icon: Karate },
  { name: "الفول كونتاكت", icon: Swords },
  { name: 'كمال الأجسام', icon: Swords }
];

// Ajoutez ces composants en haut de votre fichier
const DetailBox = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center mb-2">
      {icon}
      <span className="text-sm text-gray-600 mr-2">{label}</span>
    </div>
    <p className="font-medium text-gray-900 text-lg">
      {value || 'غير محدد'}
    </p>
  </div>
);

const DetailItem = ({ label, value }) => (
  <div className="flex justify-between py-2">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium text-gray-900">{value || 'غير محدد'}</span>
  </div>
);

// Fonction helper pour vérifier l'état de l'abonnement
const isSubscriptionActive = (endDate) => {
  if (!endDate) return false;
  const date = parseAnyDate(endDate);
  return !isPast(date);
};


const SportPaye = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [expiredClients, setExpiredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    amount: ''
  });
  const [memberToEdit, setMemberToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    date_naissance: '',
    cin: '',
    profession: '',
    adresse: '',
    phone: '',
    sport_type: '',
    price: '',
    start_date: '',
    end_date: '',
    statut: true
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const receiptRef = useRef();

// Ajoutez cette fonction AVANT le composant SportPaye
const parseAnyDate = (dateStr) => {
  if (!dateStr) return new Date();
  
  // Formats de date supportés
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
  
  return new Date(); // Fallback si aucun format ne correspond
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

 const isSubscriptionActive = (endDate) => {
  if (!endDate) return false;
  const date = parseAnyDate(endDate);
  return !isPast(date);
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
      const details = await invoke("get_userID", { id: String(user.id) });
      setSelectedUser(details);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditMember = async (member) => {
    try {
      const memberDetails = await invoke('get_userID', { id: String(member.id) });
      setMemberToEdit(memberDetails);
      setEditFormData({
        id: memberDetails.id,
        first_name: memberDetails.first_name,
        last_name: memberDetails.last_name,
        date_naissance: formatToInputDate(memberDetails.date_naissance),
        cin: memberDetails.cin,
        profession: memberDetails.profession,
        adresse: memberDetails.adresse,
        phone: memberDetails.phone,
        sport_type: memberDetails.sport_type,
        price: memberDetails.price,
        start_date: formatToInputDate(memberDetails.start_date),
        end_date: formatToInputDate(memberDetails.end_date),
        statut: memberDetails.statut
      });
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await invoke('update_all_fieds', {
        oldId: memberToEdit.id,
        newUser: {
          ...editFormData,
          price: parseFloat(editFormData.price) || 0,
          statut: Boolean(editFormData.statut)
        }
      });
      
      fetchExpiredClients();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      if (name === 'start_date') {
        newData.end_date = calculateEndDate(value);
      }
      
      return newData;
    });
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    try {
      await invoke('updat_user', { 
        user: {
          id: selectedClient.id,
          start_date: formData.startDate,
          end_date: formData.endDate,
          date_garde: selectedClient.date_garde,
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
    @page {
      size: A4 portrait;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    body {
      font-family: Calibri, sans-serif;
      padding: 5px;
      width: 230mm;
      height: 130mm;
      margin: 4 auto;
      background-color: #fff;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
    }
    .booody{
    border: 2px solid black;
    }
    .header {
      display: flex;
      margin-bottom: 5px;
      padding-bottom: 0px;
      gap: 5px;
      direction: rtl;
    }
    
    .logo-container {
      flex-shrink: 0;
      position: relative;
      left: -15px
    }
    
    .logo {
      max-width: 100px;
      max-height: 100px;
      border: 2px solid #ddd;
      padding: 2px;
      border-radius: 50%;
    }
    
    .association-name {
      font-size: 40px;
      font-weight: bold;
      margin-bottom: 2px;
      color: #000;
      position: relative;
      left: -100px
    }
    
    .association-name-french {
      font-size: 30px;
      font-weight: bold;
      margin-bottom: 2px;
      color: #000;
      position: relative;
      left: -70px
    }
    
    .address {
      font-size: 20px;
      color: #555;
      margin-bottom: 3px;
      line-height: 1.2;
      position: relative;
      left: -130px
    }
    .section-phone {
      color: #555;
      font-size: 20px;
      margin: 2px 0;
      position: relative;
      left: -210px
    }
    .section-title {
      font-size: 40px;
      position: absolute;
      left: 50%;
      padding: 5px 10px;
      transform: translateX(-50%);
      font-weight: bold;
      margin: -12px 0;
      width: max-content;
    }
    .details{
      position: relative;
      left: -30px
    }
    
    .detail-row {
      margin-bottom: 10px;
      font-size: 12px;
    }
    
    .detail-label {
      font-size: 30px;
      font-weight: bold;
      display: inline-block;
      min-width: 90px;
    }
    
    .detail-value {
      display: inline;
      font-size: 30px;
    }
    
    .amount {
      font-size: 30px;
      font-weight: bold;
    }
    
    .signature {
      margin-top: 10px;
      font-size: 10px;
    }

    @media print {
      body {
        padding: 3;
        margin-top: 2000mm !important;
        width: 210mm !important;
        height: 120mm !important;
      }
      .receipt {
        margin-top: 20mm !important;
      }
      
      .no-print {
        display: none !important;
        position: absolute !important;
        height: 0 !important;
        width: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      
      html, body {
        margin: 0 !important;
        padding: 0 !important;
      }
    }
  </style>
</head>
<body>
<div class="booody">
  <div class="header">
    <div class="logo-container">
      <img src="${logo}" class="logo" alt="Logo Association">
    </div>
    <div class="header-text">
      <div class="association-name">جمعية النصر سابس للرياضة</div>
      <div class="association-name-french">Association EL nasser saiss du Sport</div>
      <div class="address">تجزئه ايمان رقم 1 حي السانيه طريق صفرو - قاس </div>
      <div class="section-phone">الهاتف: 06.67.18.53.51</div>
    </div>
  </div>
  
  <div class="section-title">${client.sport_type}</div>
  
  <div class="details">
    <div class="detail-row">
      <span class="detail-label">الرقــــم :</span>
      <span class="detail-value">${client.id}</span>
    </div>
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
  </div>
  <div class="no-print" style="text-align: center; margin-top: 10px;">
    <button onclick="window.print()" style="
      padding: 8px 15px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
      font-size: 12px;
    ">
      طباعة الإيصال
    </button>
    <button onclick="window.close()" style="
      padding: 8px 15px;
      background: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
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

      {selectedSport ? (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">العملاء المنتهية عضويتهم في {selectedSport}</h2>
            <div className="relative w-64">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="ابحث عن الأعضاء..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          
          {getFilteredClients().length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                {searchTerm ? "لا توجد نتائج مطابقة للبحث" : "لا توجد اشتراكات منتهية"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الرقم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم الكامل</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الميلاد</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الانخراط</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredClients().map(client => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.first_name} {client.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {displayDate(client.date_naissance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {displayDate(client.garde_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleViewDetails(client)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition flex items-center text-xs"
                          >
                            <Eye className="mr-1" size={12} />
                            التفاصيل
                          </button>
                          <button
                            onClick={() => handleEditMember(client)}
                            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition flex items-center text-xs"
                          >
                            <Edit className="mr-1" size={12} />
                            تعديل
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
                            className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition flex items-center text-xs"
                          >
                            <Calendar className="mr-1" size={12} />
                            الاداء
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانخراط</label>
                    <input 
                      type="text" 
                      value={displayDate(selectedClient.garde_date)}
                      readOnly 
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" 
                    />
                  </div>

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

      {/* Modal de visualisation des détails */}
    {isModalOpen && selectedUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <motion.div 
      className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      {/* En-tête avec dégradé de couleur */}
      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
        <h2 className="text-2xl font-bold">تفاصيل العضو</h2>
        <button 
          onClick={() => setIsModalOpen(false)} 
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Colonne de gauche - Photo et infos principales */}
          <div className="md:w-1/3 space-y-6">
            {/* Photo du membre */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              {selectedUser.photo ? (
                <img 
                  src={selectedUser.photo} 
                  alt="صورة العضو"
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}
              
              {/* Nom et statut */}
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedUser.first_name} {selectedUser.last_name}
                </h3>
                <p className="text-gray-600 mt-1">{selectedUser.profession}</p>
                
                <div className="mt-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedUser.statut 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedUser.statut ? 'ملتزم' : 'غير ملتزم'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Carte d'adhésion */}
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-100">
              <h3 className="font-bold text-blue-700 text-lg mb-3 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                معلومات الاشتراك
              </h3>
              <div className="space-y-3">
                <DetailItem label="نوع الرياضة" value={selectedUser.sport_type} />
                <DetailItem label="تاريخ الانخراط" value={displayDate(selectedUser.garde_date)} />
                <DetailItem label="المبلغ الشهري" value={`${selectedUser.price} درهم`} />
              </div>
            </div>
          </div>
          
          {/* Colonne de droite - Détails */}
          <div className="md:w-2/3 space-y-6">
            {/* Informations personnelles */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-500" />
                المعلومات الشخصية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailBox 
                  icon={<CreditCard className="h-5 w-5 text-blue-500" />}
                  label="بطاقة الهوية"
                  value={selectedUser.cin}
                />
                <DetailBox 
                  icon={<Calendar className="h-5 w-5 text-blue-500" />}
                  label="تاريخ الميلاد"
                  value={displayDate(selectedUser.date_naissance)}
                />
                <DetailBox 
                  icon={<Phone className="h-5 w-5 text-blue-500" />}
                  label="الهاتف"
                  value={selectedUser.phone}
                />
                <DetailBox 
                  icon={<Briefcase className="h-5 w-5 text-blue-500" />}
                  label="المهنة"
                  value={selectedUser.profession}
                />
                <DetailBox 
                  icon={<MapPin className="h-5 w-5 text-blue-500" />}
                  label="العنوان"
                  value={selectedUser.adresse}
                />
              </div>
            </div>
            
            {/* Période d'adhésion */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                فترة العضوية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailBox 
                  icon={<Clock className="h-5 w-5 text-blue-500" />}
                  label="حالة الاشتراك"
                  value={isSubscriptionActive(selectedUser.end_date) ? 'نشط' : 'منتهي'}
                />
                <DetailBox 
                  icon={<Calendar className="h-5 w-5 text-blue-500" />}
                  label="تاريخ البدء"
                  value={displayDate(selectedUser.start_date)}
                />
                <DetailBox 
                  icon={<Calendar className="h-5 w-5 text-blue-500" />}
                  label="تاريخ الانتهاء"
                  value={displayDate(selectedUser.end_date)}
                />
                <DetailBox 
                  icon={<DollarSign className="h-5 w-5 text-blue-500" />}
                  label="المبلغ المدفوع"
                  value={`${selectedUser.price} درهم`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
)}

      {/* Modal de modification */}
     {isEditModalOpen && memberToEdit && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <motion.div 
      className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      {/* En-tête avec dégradé de couleur */}
      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
        <h2 className="text-2xl font-bold">تعديل العضو</h2>
        <button 
          onClick={() => setIsEditModalOpen(false)} 
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
        >
          <X size={24} />
        </button>
      </div>
      
      <form onSubmit={handleEditSubmit} className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Colonne de gauche - Photo */}
          <div className="md:w-1/3">
            <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col items-center">
                {editFormData.photo ? (
                  <img 
                    src={editFormData.photo} 
                    alt="صورة العضو"
                    className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-md mb-4"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-md mb-4">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                <label className="cursor-pointer bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
                  <span>تغيير الصورة</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setEditFormData({...editFormData, photo: event.target.result});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            
            {/* Section statut */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-500" />
                حالة العضوية
              </h3>
              <select
                name="statut"
                value={editFormData.statut}
                onChange={(e) => setEditFormData({...editFormData, statut: e.target.value === "true"})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={true}>ملتزم</option>
                <option value={false}>غير ملتزم</option>
              </select>
            </div>
          </div>
          
          {/* Colonne de droite - Formulaire */}
          <div className="md:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ID */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">الرقم</label>
                <input
                  type="text"
                  name="id"
                  value={editFormData.id}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>
              
              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الشخصي</label>
                <input
                  type="text"
                  name="first_name"
                  value={editFormData.first_name}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم العائلي</label>
                <input
                  type="text"
                  name="last_name"
                  value={editFormData.last_name}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              {/* Date de naissance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الميلاد</label>
                <input
                  type="date"
                  name="date_naissance"
                  value={editFormData.date_naissance}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* CIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">بطاقة الهوية</label>
                <input
                  type="text"
                  name="cin"
                  value={editFormData.cin}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Profession */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المهنة</label>
                <input
                  type="text"
                  name="profession"
                  value={editFormData.profession}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Adresse */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                <input
                  type="text"
                  name="adresse"
                  value={editFormData.adresse}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الهاتف</label>
                <input
                  type="tel"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Type de sport */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع الرياضة</label>
                <select
                  name="sport_type"
                  value={editFormData.sport_type}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sports.map(sport => (
                    <option key={sport.name} value={sport.name}>{sport.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Prix */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (درهم)</label>
                <input
                  type="number"
                  name="price"
                  value={editFormData.price}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
              
              {/* Date de début */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانخراط</label>
                <input
                  type="date"
                  name="start_date"
                  value={editFormData.start_date}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Date de fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء</label>
                <input
                  type="date"
                  name="end_date"
                  value={editFormData.end_date}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <Save className="h-5 w-5 mr-2" />
                حفظ التعديلات
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  </div>
)}
    </div>
  );
};

export default SportPaye;