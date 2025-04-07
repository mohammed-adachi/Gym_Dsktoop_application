import React, { useState, useEffect } from 'react';
import { Users, Dumbbell, BoxIcon as Boxing, SpaceIcon as Yoga, BarcodeIcon as Karate, Swords, Search, Armchair } from 'lucide-react'
import { invoke } from '@tauri-apps/api/core';
import { X, Calendar, DollarSign } from 'lucide-react';
import logo from '../../images/logo.jpg'; // Chemin relatif correct depuis le composant


const sports = [
  { name: "الأيروبيك", icon: Yoga, color: "bg-purple-500" },
  { name: "الملاكمة", icon: Boxing, color: "bg-red-500" },
  { name: "اللياقة البدنية", icon: Dumbbell, color: "bg-blue-500" },
  { name: "التايكوندو", icon: Karate, color: "bg-green-500" },
  { name: "الفول كونتاكت", icon: Swords, color: "bg-yellow-500" },
  { name: "كمال الأجسام", icon: Armchair, color: "bg-orange-500" }, // Nouveau sport ajouté

];

const SportMembers = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await invoke('get_all_users');
      // Ajouter un numéro unique pour chaque membre
      const usersWithNumbers = fetchedUsers.map((user, index) => ({
        ...user,
        memberNumber: index + 1
      }));
      setUsers(usersWithNumbers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  const handleDeletePayment = async (payment) => {
  try {
    const confirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذه الدفعة؟");
    if (!confirmed) return;
    
    await invoke("delete_payment_history", {
      idUser: payment.id_user,
      startDate: payment.start_date
    });
    
    // Rafraîchir les données
    const updatedPayments = await invoke("user_historyId", { 
      id: selectedUser.userData.id 
    });
    
    setSelectedUser(prev => ({
      ...prev,
      payments: updatedPayments
    }));
    
  } catch (error) {
    console.error("Error deleting payment:", error);
    alert("حدث خطأ أثناء حذف الدفعة");
  }
};

const handleViewDetails = async (user) => {
  try {
    const userId = String(user.id);
    const fetchedUser = await invoke("user_historyId", { id: userId });
    
    // Convertir en tableau si ce n'en est pas un
    const payments = Array.isArray(fetchedUser) ? fetchedUser : [fetchedUser];
    
    // Trier les paiements par date de début (du plus récent au plus ancien)
    const sortedPayments = payments.sort((a, b) => {
      const dateA = new Date(a.start_date || 0);
      const dateB = new Date(b.start_date || 0);
      return dateB - dateA; // Ordre décroissant
    });
    
    setSelectedUser({
      userData: user,
      payments: sortedPayments
    });
    
    setIsModalOpen(true);
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};

  const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`; // Format JJ/MM/AAAA avec chiffres occidentaux
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
};

  const handlePrintPayment = (payment, index) => {
    if (!selectedUser?.userData) return;

    const { userData } = selectedUser;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
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
   
   <div class="section-title">${userData.sport_type}</div>
   
   <div class="details">
     <div class="detail-row">
       <span class="detail-label">الرقــــم :</span>
       <span class="detail-value">${userData.id}</span>
     </div>
     <div class="detail-row">
       <span class="detail-label">الاسم الكامل:</span>
       <span class="detail-value">${userData.first_name} ${userData.last_name}</span>
     </div>
     <div class="detail-row">
       <span class="detail-label">الثمن:</span>
       <span class="detail-value amount">${userData.price} درهم</span>
     </div>
     <div class="detail-row">
       <span class="detail-label">تاريخ الأداء :</span>
       <span class="detail-value">${formatDate(payment.start_date)}</span>
     </div>
     <div class="detail-row">
       <span class="detail-label">وصل الأداء من</span>
       <span class="detail-value">${formatDate(payment.start_date)} إلى ${formatDate(payment.end_date)}</span>
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

    `)
    
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const filteredUsers = users.filter(user => {
    const matchesSport = !selectedSport || user.sport_type === selectedSport;
    const matchesSearch = searchTerm === "" || 
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.id.toString().includes(searchTerm);
    
    return matchesSport && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">إدارة أعضاء النادي الرياضي</h1>
        
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="ابحث بالاسم، رقم الهاتف أو رقم العضو..."
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sport Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button
            onClick={() => setSelectedSport(null)}
            className={`flex items-center px-4 py-2 rounded-full ${!selectedSport ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            <Users className="ml-2" size={18} />
            الكل
          </button>
          
          {sports.map((sport) => (
            <button
              key={sport.name}
              onClick={() => setSelectedSport(sport.name)}
              className={`flex items-center px-4 py-2 rounded-full ${selectedSport === sport.name ? `${sport.color} text-white` : 'bg-gray-200 text-gray-800'}`}
            >
              <sport.icon className="ml-2" size={18} />
              {sport.name}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الهاتف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الرياضة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ التسجيل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</div>
                    <div className="text-sm text-gray-500">{user.adresse}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sports.find(s => s.name === user.sport_type)?.color || 'bg-gray-200'} text-white`}>
                      {user.sport_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.registration_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      التفاصيل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">لا توجد نتائج</h3>
            <p className="mt-1 text-sm text-gray-500">لم يتم العثور على أعضاء مطابقين لبحثك</p>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <DollarSign className="ml-2" size={24} />
                    تفاصيل الدفع
                  </h2>
                  <p className="text-gray-600 mt-1">العضو رقم: {selectedUser.userData.id}</p>
                  <p className="text-gray-600">{selectedUser.userData.first_name} {selectedUser.userData.last_name}</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>
              
            <div className="mt-6 space-y-4">
  {selectedUser.payments.length > 0 ? (
    [...selectedUser.payments]
      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date)) // Tri par date décroissante
      .map((payment, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              دفعة #{selectedUser.payments.length - index} {/* Numéro inverse */}
            </span>
            <span className="text-lg font-bold text-green-600">
              {payment.price} درهم
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">تاريخ البدء</p>
              <p className="flex items-center mt-1">
                <Calendar className="ml-1 text-gray-400" size={16} />
                {formatDate(payment.start_date)}
              </p>
            </div>
            
            <div>
              <p className="text-gray-500">تاريخ الانتهاء</p>
              <p className="flex items-center mt-1">
                <Calendar className="ml-1 text-gray-400" size={16} />
                {formatDate(payment.end_date)}
              </p>
            </div>
          </div>
                      
                     <div className="mt-4 flex justify-end space-x-2">
  <button
    onClick={() => handlePrintPayment(payment, index)}
    className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
    طباعة الإيصال
  </button>
  <button
    onClick={() => handleDeletePayment(payment)}
    className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
  >
    <X className="h-4 w-4 ml-1" />
    حذف الدفعة
  </button>
</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">لا توجد مدفوعات مسجلة لهذا العضو</p>
                  </div>
                )}
              </div>
              
              {selectedUser.payments.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportMembers;