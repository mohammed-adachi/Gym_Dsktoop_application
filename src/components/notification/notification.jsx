import React, { useState, useEffect } from 'react';
import { format, isPast } from 'date-fns';
import { motion } from 'framer-motion';
import { Bell, Calendar, DollarSign, X } from 'lucide-react';
import {invoke} from '@tauri-apps/api/core';

const Notification = () => {
  const [expiredClients, setExpiredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const fetchExpiredClients = async () => {
      try {
        const response = await invoke('get_all_users');
        const users = response.filter(user => {
          const endDate = new Date(user.end_date);
          return isPast(endDate);
        });
        
        const formattedUsers = users.map(user => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          endDate: user.end_date,
          email: user.phone, // Using phone as contact since email isn't in the schema
          phone: user.phone,
          membership: user.sport_type
        }));
        
        setExpiredClients(formattedUsers);
      } catch (error) {
        console.error('Erreur lors de la récupération des clients expirés:', error);
      }
    };

    fetchExpiredClients();
    
    // Rafraîchir toutes les heures
    const interval = setInterval(fetchExpiredClients, 3600000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdatePayment = async (clientId, newStartDate, newEndDate, amount) => {
  const user = {
    id: clientId,
    start_date: newStartDate,
    photo:"photo",
    end_date: newEndDate,
    price: parseFloat(amount),
  };

  try {
    console.log(user);
    await invoke('updat_user', { user }); // Envoyez l'objet `user`
    setExpiredClients(prevClients =>
      prevClients.filter(client => client.id !== clientId)
    );
    setSelectedClient(null);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paiement:', error);
  }
};


  const handlePrintReceipt = (client, startDate, endDate, amount) => {
    const receipt = `
      إيصال دفع
      -----------------
      قاعة الرياضة XYZ
      123 شارع الرياضة، 75000 باريس
      هاتف: 01 23 45 67 89
      -----------------
      العميل: ${client.name}
      الهاتف: ${client.phone}
      نوع الاشتراك: ${client.membership}
      -----------------
      تاريخ الدفع: ${format(new Date(), 'dd/MM/yyyy')}
      فترة الاشتراك:
      من: ${format(new Date(startDate), 'dd/MM/yyyy')}
      إلى: ${format(new Date(endDate), 'dd/MM/yyyy')}
      -----------------
      المبلغ المدفوع: ${amount} €
      -----------------
      شكراً لدفعكم!
      نراكم قريباً في قاعة الرياضة.
    `;

    const receiptWindow = window.open('', '_blank');
    receiptWindow.document.write('<pre>' + receipt + '</pre>');
    receiptWindow.document.close();
    receiptWindow.print();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <Bell className="mr-2" /> إشعارات الدفع المنتهي
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            العملاء ذوو الدفع المنتهي ({expiredClients.length})
          </h2>
          
          {expiredClients.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد اشتراكات منتهية</p>
          ) : (
            <ul className="space-y-3">
              {expiredClients.map(client => (
                <motion.li 
                  key={client.id} 
                  className="flex justify-between items-center bg-red-50 p-3 rounded-lg border border-red-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div>
                    <p className="font-medium text-gray-800">{client.name}</p>
                    <p className="text-sm text-gray-600">
                      Expiré le {format(new Date(client.endDate), 'dd/MM/yyyy')}
                    </p>
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
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          {selectedClient ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
تحديث الدفع                </h2>
                <button 
                  onClick={() => setSelectedClient(null)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="font-medium text-gray-800">{selectedClient.name}</p>
                <p className="text-sm text-gray-600">{selectedClient.phone}</p>
                <p className="text-sm text-gray-600">
                  Abonnement: {selectedClient.membership}
                </p>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const startDate = e.target.startDate.value;
                const endDate = e.target.endDate.value;
                const amount = e.target.amount.value;
                handleUpdatePayment(selectedClient.id, startDate, endDate, amount);
                handlePrintReceipt(selectedClient, startDate, endDate, amount);
              }} className="space-y-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    تاريخ البدء الجديد:
                  </label>
                  <input 
                    type="date" 
                    id="startDate" 
                    name="startDate" 
                    required 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    تاريخ الانتهاء الجديد:
                  </label>
                  <input 
                    type="date" 
                    id="endDate" 
                    name="endDate" 
                    required 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                  />
                </div>
                
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    المبلغ المدفوع (€):
                  </label>
                  <input 
                    type="number" 
                    id="amount" 
                    name="amount" 
                    required 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                    step="0.01" 
                    min="0" 
                  />
                </div>
                
                <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300 ease-in-out flex items-center justify-center">
                  <DollarSign className="mr-2" size={16} />
                  تحديث وطباعة الإيصال
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">
               اختر عميلًا لتحديث دفعه
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Notification;