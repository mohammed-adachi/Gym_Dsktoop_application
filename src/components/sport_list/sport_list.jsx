// import React, { useState, useEffect } from 'react';
// import { Users, Dumbbell, BoxIcon as Boxing, SpaceIcon as Yoga, BarcodeIcon as Karate, Swords } from 'lucide-react';
// import { invoke } from '@tauri-apps/api/core';

// const sports = [
//   { name: "الأيروبيك", icon: Yoga },
//   { name: "الملاكمة", icon: Boxing },
//   { name: "اللياقة البدنية", icon: Dumbbell },
//   { name: "التايكوندو", icon: Karate },
//   { name: "الفول كونتاكت", icon: Swords },
// ];

// const SportMembers = () => {
//   const [selectedSport, setSelectedSport] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   useEffect(() => {
//     fetchUsers();
//   }, []);
// const handleViewDetails = async (user) => {
//   try {
//     const userId = String(user.id); 
//     console.log("Fetching user with ID:", userId);

//     // Appeler la fonction pour récupérer l'historique des paiements de l'utilisateur
//     const fetchedUser = await invoke("user_historyId", { id: userId });
//     console.log("Fetched user history:", fetchedUser);

//     setSelectedUser(fetchedUser);
//     setIsModalOpen(true); // Ouvrir le modal
//   } catch (error) {
//     console.error("Erreur lors de la récupération de l'utilisateur:", error);
//   }
// };


//   const fetchUsers = async () => {
//     try {
//       const fetchedUsers = await invoke('get_all_users');
//       setUsers(fetchedUsers);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   const filteredUsers = selectedSport
//     ? users.filter(user => user.sport_type === selectedSport)
//     : [];

// const renderPaymentDetails = () => {
//   if (!selectedUser) return null;

//   // Assurer que selectedUser est un tableau de paiements
//   const payments = Array.isArray(selectedUser) ? selectedUser : [];

//   return (
//     <div className="modal-content">
//       <h2 className="text-xl font-semibold mb-4">تفاصيل الدفع</h2>
//       {payments.length > 0 ? (
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-2 px-4 border-b">تاريخ البدء</th>
//               <th className="py-2 px-4 border-b">تاريخ الانتهاء</th>
//               <th className="py-2 px-4 border-b">السعر</th>
//             </tr>
//           </thead>
//           <tbody>
//             {payments.map((payment, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="py-2 px-4 border-b">{payment.start_date}</td>
//                 <td className="py-2 px-4 border-b">{payment.end_date}</td>
//                 <td className="py-2 px-4 border-b">{payment.price} DH</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p className="text-center text-gray-500 mt-4">لا توجد مدفوعات مسجلة لهذا المستخدم.</p>
//       )}
//       <button 
//         onClick={() => setIsModalOpen(false)} 
//         className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//       >
//         إغلاق
//       </button>
//     </div>
//   );
// };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6 text-center">الأعضاء حسب الرياضة</h1>
      
//       <div className="flex flex-wrap justify-center gap-4 mb-8">
//         {sports.map((sport) => (
//           <button
//             key={sport.name}
//             onClick={() => setSelectedSport(sport.name)}
//             className={`flex items-center px-4 py-2 rounded-md ${
//               selectedSport === sport.name
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
//             }`}
//           >
//             <sport.icon className="mr-2" size={20} />
//             {sport.name}
//           </button>
//         ))}
//       </div>

//       {selectedSport && (
//         <div>
//           <h2 className="text-2xl font-semibold mb-4">أعضاء {selectedSport}</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="py-2 px-4 border-b">الاسم</th>
//                   {/* <th className="py-2 px-4 border-b">تاريخ الميلاد</th>
//                   <th className="py-2 px-4 border-b">رقم الهوية</th>
//                   <th className="py-2 px-4 border-b">المهنة</th> */}
//                   <th className="py-2 px-4 border-b">العنوان</th>
//                   <th className="py-2 px-4 border-b">الهاتف</th>
//                   <th className="py-2 px-4 border-b">تاريخ التسجيل</th>
//                   <th className="py-2 px-4 border-b">السعر</th>
//                   <th className="py-2 px-4 border-b">تاريخ البدء</th>
//                   <th className="py-2 px-4 border-b">تاريخ الانتهاء</th>
//                   <th className="py-2 px-4 border-b">الأفعال </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50">
//                     <td className="py-2 px-4 border-b">{`${user.first_name} ${user.last_name}`}</td>
//                     {/* <td className="py-2 px-4 border-b">{user.date_naissance}</td>
//                     <td className="py-2 px-4 border-b">{user.cin}</td> */}
//                     {/* <td className="py-2 px-4 border-b">{user.profession}</td> */}
//                     <td className="py-2 px-4 border-b">{user.adresse}</td>
//                     <td className="py-2 px-4 border-b">{user.phone}</td>
//                     <td className="py-2 px-4 border-b">{user.registration_date}</td>
//                     <td className="py-2 px-4 border-b">{user.price}</td>
//                     <td className="py-2 px-4 border-b">{user.start_date}</td>
//                     <td className="py-2 px-4 border-b">{user.end_date}</td>
//                       <button 
//                         onClick={() => handleViewDetails(user)}
//                         className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                       >
//                         View
//                       </button>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           {filteredUsers.length === 0 && (
//             <p className="text-center text-gray-500 mt-4">
//               لم يتم العثور على أعضاء لهذه الرياضة.
//             </p>
//           )}
//         </div>
//       )}

//       {!selectedSport && (
//         <p className="text-center text-gray-500 mt-4">
//           يرجى اختيار رياضة لرؤية أعضائها.
//         </p>
//       )}
//     </div>
    
//   );

// };

// export default SportMembers;

import React, { useState, useEffect } from 'react';
import { Users, Dumbbell, BoxIcon as Boxing, SpaceIcon as Yoga, BarcodeIcon as Karate, Swords } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { X, Calendar, DollarSign } from 'lucide-react';

const sports = [
  { name: "الأيروبيك", icon: Yoga },
  { name: "الملاكمة", icon: Boxing },
  { name: "اللياقة البدنية", icon: Dumbbell },
  { name: "التايكوندو", icon: Karate },
  { name: "كونتاكت الفول", icon: Swords },
];

const SportMembers = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewDetails = async (user) => {
    try {
      const userId = String(user.id); 
      console.log("Fetching user with ID:", userId);

      // Appeler la fonction pour récupérer l'historique des paiements de l'utilisateur
      const fetchedUser = await invoke("user_historyId", { id: userId });
      console.log("Fetched user history:", fetchedUser);

      setSelectedUser(fetchedUser);
      setIsModalOpen(true); // Ouvrir le modal
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await invoke('get_all_users');
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  // Fonction pour formater la date de manière cohérente
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    // Essayez de parser différentes formes de dates
    const date = new Date(dateString);
    
    // Si la date est invalide
    if (isNaN(date.getTime())) {
      return dateString; // Retourne la chaîne originale si le parsing échoue
    }
    
    // Formater en YYYY-MM-DD pour la cohérence
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Erreur de formatage de date:", error);
    return dateString; // Retourne la chaîne originale en cas d'erreur
  }
};

  const filteredUsers = selectedSport
    ? users.filter(user => user.sport_type === selectedSport)
    : [];

 const renderPaymentDetails = () => {
  if (!selectedUser) return null;

  // Assurer que selectedUser est un tableau de paiements
  const payments = Array.isArray(selectedUser) ? selectedUser : [selectedUser];
  
  // Calculer le montant total
  const totalAmount = payments.length > 0 
    ? payments.reduce((sum, payment) => sum + parseFloat(payment.price || 0), 0).toFixed(2) 
    : 0;

  return (
    <div className= "h-screen 100vh bg-gradient-to-br from-gray-120 to-gray-120 text-white p-3 rounded-xl shadow-2xl w-200">
      {/* Header avec effet de flou */}
      <div className="relative mb-2 ">
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-purple-500 rounded-full opacity-30 blur-2xl"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-500 rounded-full opacity-30 blur-2xl"></div>
        <h2 className="text-2xl font-bold mb-1 relative z-10 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          تفاصيل الدفع
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-5 rounded"></div>
      </div>

      {payments.length > 0 ? (
        <div className="space-y-6">
          {/* Card stylisée pour chaque paiement */}
          {payments.map((payment, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-gray-700 px-3 py-1 rounded-full text-xs">
                  دفعة #{index + 1}
                </div>
                <div className="text-xl font-bold text-blue-400">
                  {payment.price} <span className="text-xs opacity-70">DH</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-1">
                  <div className="text-gray-400">تاريخ البدء</div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {formatDate(payment.start_date)}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-gray-400">تاريخ الانتهاء</div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                     {formatDate(payment.end_date)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Résumé */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <div className="text-gray-400">عدد الدفعات:</div>
              <div>{payments.length}</div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="text-gray-400">المجموع:</div>
              <div className="text-xl font-bold text-purple-400">{totalAmount} DH</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-10 text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-800 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-300 mb-2">لا توجد مدفوعات مسجلة لهذا المستخدم.</p>
          <p className="text-gray-500 text-sm">سيتم عرض سجل الدفعات هنا بمجرد توفره.</p>
        </div>
      )}
      
      {/* Boutons d'action */}
      <div className="mt-6 flex justify-end">
        <button 
          onClick={() => setIsModalOpen(false)} 
          className="bg-gradient-to-r from-red-500 to-pink-500 px-5 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
};

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">الأعضاء حسب الرياضة</h1>
      
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {sports.map((sport) => (
          <button
            key={sport.name}
            onClick={() => setSelectedSport(sport.name)}
            className={`flex items-center px-4 py-2 rounded-md ${
              selectedSport === sport.name
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <sport.icon className="mr-2" size={20} />
            {sport.name}
          </button>
        ))}
      </div>

      {selectedSport && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">أعضاء {selectedSport}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">الاسم</th>
                  <th className="py-2 px-4 border-b">العنوان</th>
                  <th className="py-2 px-4 border-b">الهاتف</th>
                  <th className="py-2 px-4 border-b">تاريخ التسجيل</th>
                  <th className="py-2 px-4 border-b">السعر</th>
                  <th className="py-2 px-4 border-b">تاريخ البدء</th>
                  <th className="py-2 px-4 border-b">تاريخ الانتهاء</th>
                  <th className="py-2 px-4 border-b">الأفعال</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{`${user.first_name} ${user.last_name}`}</td>
                    <td className="py-2 px-4 border-b">{user.adresse}</td>
                    <td className="py-2 px-4 border-b">{user.phone}</td>
                    <td className="py-2 px-4 border-b">{user.registration_date}</td>
                    <td className="py-2 px-4 border-b">{user.price}</td>
                    <td className="py-2 px-4 border-b">{formatDate(user.start_date)}</td>
                    <td className="py-2 px-4 border-b">{formatDate(user.end_date)}</td>
                    <td className="py-2 px-4 border-b">
                      <button 
                        onClick={() => handleViewDetails(user)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        عرض
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              لم يتم العثور على أعضاء لهذه الرياضة.
            </p>
          )}
        </div>
      )}

      {!selectedSport && (
        <p className="text-center text-gray-500 mt-4">
          يرجى اختيار رياضة لرؤية أعضائها.
        </p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
          <div className="bg-gray-600  p-2 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            {renderPaymentDetails()}
          </div>
        </div>
      )}
    </div>
  );
};

export default SportMembers;