import React, { useState, useEffect } from 'react';
import { format, isPast, parse, addDays } from 'date-fns';
import { Bell, Calendar, DollarSign, X, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

const Notification = () => {
  const [expiredClients, setExpiredClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour parser les dates au format dd/MM/yyyy
  const parseCustomDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  useEffect(() => {
    const fetchExpiredClients = async () => {
      setIsLoading(true);
      try {
        const response = await invoke('get_all_users');
        const users = response.filter(user => {
          if (!user.end_date) return false;
          const endDate = parseCustomDate(user.end_date);
          return endDate && isPast(endDate);
        });
        
        const formattedUsers = users.map(user => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          endDate: user.end_date,
          startDate: user.start_date,
          phone: user.phone || 'غير متوفر',
          membership: user.sport_type || 'غير محدد',
          price: user.price || 0
        }));
        
        setExpiredClients(formattedUsers);
        setFilteredClients(formattedUsers);

        if (formattedUsers.length > 0) {
          showNotification(`يوجد ${formattedUsers.length} اشتراك منتهي`, 'warning');
        }
      } catch (error) {
        console.error('Error fetching expired clients:', error);
        showNotification('فشل في تحميل بيانات العملاء', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpiredClients();
    const interval = setInterval(fetchExpiredClients, 3600000); // Actualiser toutes les heures
    return () => clearInterval(interval);
  }, []);

  // Fonction de recherche
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredClients(expiredClients);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = expiredClients.filter(client => 
        client.name.toLowerCase().includes(term) ||
        client.phone.includes(searchTerm) ||
        client.id.includes(searchTerm)
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, expiredClients]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleUpdatePayment = async (clientId, newStartDate, newEndDate, amount) => {
    try {
      const user = {
        id: clientId,
        start_date: format(new Date(newStartDate), 'dd/MM/yyyy'),
        end_date: format(new Date(newEndDate), 'dd/MM/yyyy'),
        price: parseFloat(amount)
      };

      await invoke('updat_user', { user });
      
      setExpiredClients(prev => prev.filter(c => c.id !== clientId));
      setFilteredClients(prev => prev.filter(c => c.id !== clientId));
      setSelectedClient(null);
      
      showNotification('تم تحديث الاشتراك بنجاح', 'success');
    } catch (error) {
      console.error('Update error:', error);
      showNotification('فشل في تحديث الاشتراك', 'error');
    }
  };

  const handlePrintReceipt = (client, startDate, endDate, amount) => {
    const receipt = `
      إيصال تجديد اشتراك
      ------------------------
      اسم العضو: ${client.name}
      رقم العضوية: ${client.id}
      نوع الاشتراك: ${client.membership}
      ------------------------
      تاريخ البدء: ${format(new Date(startDate), 'dd/MM/yyyy')}
      تاريخ الانتهاء: ${format(new Date(endDate), 'dd/MM/yyyy')}
      ------------------------
      المبلغ المدفوع: ${amount} درهم
      ------------------------
      تاريخ الطباعة: ${format(new Date(), 'dd/MM/yyyy')}
      شكراً لثقتكم
    `;

    const win = window.open('', '_blank');
    win.document.write(`
      <html dir="rtl">
        <head>
          <title>إيصال الدفع</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            pre { white-space: pre-wrap; font-size: 16px; }
          </style>
        </head>
        <body>
          <pre>${receipt}</pre>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      {/* Notification */}
      {notification && (
        <div className={`mb-4 p-3 rounded-md flex items-center ${
          notification.type === 'error' ? 'bg-red-100 text-red-800' :
          notification.type === 'success' ? 'bg-green-100 text-green-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {notification.type === 'error' ? (
            <AlertTriangle className="mr-2" size={18} />
          ) : (
            <CheckCircle className="mr-2" size={18} />
          )}
          {notification.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 text-white flex items-center">
          <Bell className="mr-2" />
          <h1 className="text-xl font-bold">إدارة الاشتراكات المنتهية</h1>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Liste des clients expirés */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                <AlertTriangle className="mr-2 text-red-500" size={18} />
                الاشتراكات المنتهية ({filteredClients.length})
              </h2>
              
              {/* Barre de recherche */}
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو الرقم..."
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
                <p className="mt-2 text-gray-600">جاري تحميل البيانات...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded">
                {searchTerm ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد اشتراكات منتهية حالياً'}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredClients.map(client => (
                  <div 
                    key={client.id}
                    className="p-3 bg-red-50 rounded-lg border border-red-200 flex justify-between items-center hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                       <p className="text-sm text-gray-600">
                          <span className="font-medium">رقم:</span> {client.id}
                        </p>
                      <p className="font-medium text-gray-800">{client.name}</p>
                      <div className="flex flex-wrap gap-x-4 mt-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">انتهى في:</span> {client.endDate}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">الهاتف:</span> {client.phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">النوع:</span> {client.membership}
                        </p>
                       
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center whitespace-nowrap"
                    >
                      <Calendar size={16} className="mr-1" />
                      تجديد الاشتراك
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulaire de renouvellement */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2 flex items-center">
              {selectedClient ? (
                <>
                  <Calendar className="mr-2 text-blue-500" size={18} />
                  تجديد اشتراك {selectedClient?.name}
                </>
              ) : (
                'اختر عميلاً للتجديد'
              )}
            </h2>

            {selectedClient ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                handleUpdatePayment(
                  selectedClient.id,
                  form.startDate.value,
                  form.endDate.value,
                  form.amount.value
                );
                handlePrintReceipt(
                  selectedClient,
                  form.startDate.value,
                  form.endDate.value,
                  form.amount.value
                );
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">تاريخ البدء</label>
                    <input
                      type="date"
                      name="startDate"
                      required
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      defaultValue={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">تاريخ الانتهاء</label>
                    <input
                      type="date"
                      name="endDate"
                      required
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      defaultValue={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">المبلغ (درهم)</label>
                    <input
                      type="number"
                      name="amount"
                      required
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      defaultValue={selectedClient.price || 300}
                      min="0"
                      step="10"
                    />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex-1 flex items-center justify-center"
                    >
                      <DollarSign size={16} className="mr-1" />
                      حفظ وطباعة الإيصال
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedClient(null)}
                      className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-white rounded">
                {filteredClients.length > 0 ? (
                  'يرجى اختيار عميل من القائمة'
                ) : (
                  'لا توجد اشتراكات منتهية'
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;