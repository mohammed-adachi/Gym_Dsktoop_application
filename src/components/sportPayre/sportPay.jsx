import React, { useState, useEffect } from 'react';
import { Dumbbell, BoxIcon as Boxing, SpaceIcon as Yoga, BarcodeIcon as Karate, Swords, Calendar, DollarSign, X, Search } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { isPast, parse } from 'date-fns';
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
  const [expiredClients, setExpiredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Parser les dates dd/MM/yyyy
  const parseCustomDate = (dateStr) => {
    if (!dateStr) return new Date();
    return parse(dateStr, 'dd/MM/yyyy', new Date());
  };

  useEffect(() => {
    fetchExpiredClients();
  }, []);

  const fetchExpiredClients = async () => {
    try {
      const users = await invoke('get_all_users');
      const expired = users.filter(user => {
        return user.end_date && isPast(parseCustomDate(user.end_date));
      });
      setExpiredClients(expired);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Filtrer les clients expirés pour le sport sélectionné et la recherche
  const getFilteredClients = () => {
    let filtered = expiredClients;
    
    // Filtre par sport
    if (selectedSport) {
      filtered = filtered.filter(client => client.sport_type === selectedSport);
    }
    
    // Filtre par recherche (nom ou numéro)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        (client.first_name?.toLowerCase().includes(term)) ||
        (client.last_name?.toLowerCase().includes(term)) ||
        (client.phone?.includes(searchTerm)) || // Recherche exacte pour le numéro
        (client.id?.includes(searchTerm)) // Recherche par ID si nécessaire
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

  const handleUpdatePayment = async (id, startDate, endDate, amount) => {
    try {
      await invoke('updat_user', { 
        user: {
          id,
          start_date: startDate,
          end_date: endDate,
          price: parseFloat(amount)
        } 
      });
      fetchExpiredClients();
      setSelectedClient(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">الأعضاء حسب الرياضة</h1>
      
      {/* Boutons des sports */}
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

      {/* Champ de recherche (visible seulement quand un sport est sélectionné) */}
      {selectedSport && (
      <div className="mb-6 relative flex flex-col items-end">
  <div className="absolute inset-y-0 right-2 flex items-center pr-3 pointer-events-none">
    <Search className="text-gray-400" />
  </div>
  <input
    type="text"
    placeholder="ابحث باسم العضو أو رقم ..."
    className="w-1/3 p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <p className="text-xl text-gray-500 mt-1 text-right">
    يمكنك البحث بالاسم أو رقم 
  </p>
</div>

      )}

      {/* Liste des membres expirés */}
      {selectedSport ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">العملاء المنتهية عضويتهم في {selectedSport}</h2>
          
          {getFilteredClients().length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              {searchTerm ? "لا توجد نتائج مطابقة للبحث" : "لا توجد اشتراكات منتهية"}
            </p>
          ) : (
            <ul className="space-y-3">
              {getFilteredClients().map(client => (
                <motion.li
                  key={client.id}
                  className="flex justify-between items-center bg-red-50 p-3 rounded-lg border border-red-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div>
                    <p className="font-medium text-gray-800">{client.first_name} {client.last_name}</p>
                    <p className="text-sm text-gray-600">انتهى في {client.end_date}</p>
                    {client.phone && <p className="text-sm text-gray-600">الهاتف: {client.phone}</p>}
                    {client.id && <p className="text-sm text-gray-600">الرقم: {client.id}</p>}
                  </div>
                  <div className="flex gap-2">
                    
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition flex items-center"
                    >
                      <Calendar className="mr-1" size={16} />
                      تجديد
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">يرجى اختيار رياضة لعرض الأعضاء المنتهية عضويتهم</p>
      )}

      {/* Modal de mise à jour */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">تجديد العضوية</h2>
              <button onClick={() => setSelectedClient(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              handleUpdatePayment(
                selectedClient.id,
                form.startDate.value,
                form.endDate.value,
                form.amount.value
              );
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">تاريخ البدء</label>
                  <input 
                    type="date" 
                    name="startDate" 
                    required 
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">تاريخ الانتهاء</label>
                  <input 
                    type="date" 
                    name="endDate" 
                    required 
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">المبلغ (درهم)</label>
                  <input 
                    type="number" 
                    name="amount" 
                    required 
                    min="0" 
                    step="0.01" 
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 flex justify-center items-center"
                >
                  <DollarSign className="mr-2" size={16} />
                  تأكيد التجديد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal des détails */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-700 p-6 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">تفاصيل العضوية</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              {(Array.isArray(selectedUser) ? selectedUser : [selectedUser]).map((payment, i) => (
                <div key={i} className="bg-gray-600 p-4 rounded-lg">
                  <div className="flex justify-between border-b border-gray-500 pb-2 mb-2">
                    <span>الدفعة #{i+1}</span>
                    <span className="font-bold">{payment.price} درهم</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">من</p>
                      <p>{payment.start_date}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">إلى</p>
                      <p>{payment.end_date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportPaye;