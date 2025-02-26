import React, { useState, useEffect } from 'react';
import { Users, Dumbbell, BoxIcon as Boxing, SpaceIcon as Yoga, BarcodeIcon as Karate, Swords, Bell, Calendar, DollarSign, X } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { format, isPast } from 'date-fns';
import { motion } from 'framer-motion';

const sports = [
  { name: "الأيروبيك", icon: Yoga },
  { name: "الملاكمة", icon: Boxing },
  { name: "اللياقة البدنية", icon: Dumbbell },
  { name: "التايكوندو", icon: Karate },
  { name: "الفول كونتاكت", icon: Swords },
];

const SportPaye = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expiredClients, setExpiredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await invoke('get_all_users');
      setUsers(fetchedUsers);

      // Filtrer les utilisateurs dont la date de fin est expirée
      const expiredUsers = fetchedUsers.filter(user => {
        const endDate = new Date(user.end_date);
        return isPast(endDate);
      });
      setExpiredClients(expiredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleViewDetails = async (user) => {
    try {
      const userId = String(user.id);
      const fetchedUser = await invoke("user_historyId", { id: userId });
      setSelectedUser(fetchedUser);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
    }
  };

  const handleUpdatePayment = async (clientId, newStartDate, newEndDate, amount) => {
    const user = {
      id: clientId,
      start_date: newStartDate,
      end_date: newEndDate,
      price: parseFloat(amount),
    };

    try {
      await invoke('updat_user', { user });
      setExpiredClients(prevClients => prevClients.filter(client => client.id !== clientId));
      setSelectedClient(null);
      fetchUsers(); // Rafraîchir la liste des utilisateurs
    } catch (error) {
      console.error('Erreur lors de la mise à jour du paiement:', error);
    }
  };

  const renderPaymentDetails = () => {
    if (!selectedUser) return null;

    const payments = Array.isArray(selectedUser) ? selectedUser : [selectedUser];
    const totalAmount = payments.length > 0
      ? payments.reduce((sum, payment) => sum + parseFloat(payment.price || 0), 0).toFixed(2)
      : 0;

    return (
      <div className="h-screen 100vh bg-gradient-to-br from-gray-120 to-gray-120 text-white p-3 rounded-xl shadow-2xl w-200">
        {/* Header avec effet de flou */}
        <div className="relative mb-2">
          <h2 className="text-2xl font-bold mb-1 relative z-10 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            تفاصيل الدفع
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded"></div>
        </div>

        {payments.length > 0 ? (
          <div className="space-y-6">
            {payments.map((payment, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-gray-700 px-3 py-1 rounded-full text-xs">دفعة #{index + 1}</div>
                  <div className="text-xl font-bold text-blue-400">{payment.price} <span className="text-xs opacity-70">DH</span></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="space-y-1">
                    <div className="text-gray-400">تاريخ البدء</div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {payment.start_date}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400">تاريخ الانتهاء</div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {payment.end_date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
            <p className="text-gray-300 mb-2">لا توجد مدفوعات مسجلة لهذا المستخدم.</p>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button onClick={() => setIsModalOpen(false)} className="bg-gradient-to-r from-red-500 to-pink-500 px-5 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
            إغلاق
          </button>
        </div>
      </div>
    );
  };

  // Filtrer les utilisateurs expirés pour le sport sélectionné
  const filteredExpiredClients = selectedSport
    ? expiredClients.filter(client => client.sport_type === selectedSport)
    : [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">الأعضاء حسب الرياضة</h1>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {sports.map((sport) => (
          <button
            key={sport.name}
            onClick={() => setSelectedSport(sport.name)}
            className={`flex items-center px-4 py-2 rounded-md ${
              selectedSport === sport.name ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <sport.icon className="mr-2" size={20} />
            {sport.name}
          </button>
        ))}
      </div>

      {selectedSport ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">العملاء ذوو الدفع المنتهي لـ {selectedSport}</h2>
          {filteredExpiredClients.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد اشتراكات منتهية لهذه الرياضة.</p>
          ) : (
            <ul className="space-y-3">
              {filteredExpiredClients.map(client => (
                <motion.li
                  key={client.id}
                  className="flex justify-between items-center bg-red-50 p-3 rounded-lg border border-red-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div>
                    <p className="font-medium text-gray-800">{`${client.first_name} ${client.last_name}`}</p>
                    <p className="text-sm text-gray-600">Expiré le {format(new Date(client.end_date), 'dd/MM/yyyy')}</p>
                    <p className="text-sm text-gray-600">{client.phone}</p>
                  </div>
                  <button
                    onClick={() => setSelectedClient(client)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 ease-in-out flex items-center"
                  >
                    <Calendar className="mr-2" size={16} />
                    تحديث
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">يرجى اختيار رياضة لرؤية العملاء ذوي الدفع المنتهي.</p>
      )}

      {/* Modal pour mettre à jour le paiement */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">تحديث الدفع</h2>
              <button onClick={() => setSelectedClient(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const startDate = e.target.startDate.value;
              const endDate = e.target.endDate.value;
              const amount = e.target.amount.value;
              handleUpdatePayment(selectedClient.id, startDate, endDate, amount);
            }} className="space-y-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">تاريخ البدء الجديد:</label>
                <input type="date" id="startDate" name="startDate" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">تاريخ الانتهاء الجديد:</label>
                <input type="date" id="endDate" name="endDate" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">المبلغ المدفوع (DH):</label>
                <input type="number" id="amount" name="amount" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" step="0.01" min="0" />
              </div>
              <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300 ease-in-out flex items-center justify-center">
                <DollarSign className="mr-2" size={16} />
                تحديث الدفع
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal pour afficher les détails des paiements */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-600 p-2 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            {renderPaymentDetails()}
          </div>
        </div>
      )}
    </div>
  );
};

export default SportPaye;