import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, Filter } from 'lucide-react';

const List = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');

  useEffect(() => {
    // محاكاة تحميل العملاء من API
    const fetchClients = async () => {
      // استبدال هذه البيانات ببيانات حقيقية من API عند توفرها
      const dummyClients = [
        { id: 1, name: 'أليس دوبون', sport: 'اللياقة البدنية', age: 28, email: 'alice@example.com', phone: '0123456789', membership: 'ذهبي', lastVisit: '2023-05-15', notes: 'تفضل الحصص الصباحية' },
        { id: 2, name: 'بوب مارتن', sport: 'الأيروبيك', age: 35, email: 'bob@example.com', phone: '0987654321', membership: 'فضي', lastVisit: '2023-05-10', notes: 'يحتاج إلى برنامج شخصي' },
        { id: 3, name: 'تشارلي لوكلير', sport: 'التايكوندو', age: 22, email: 'charlie@example.com', phone: '0123498765', membership: 'برونزي', lastVisit: '2023-05-18', notes: 'يستعد لمسابقة' },
        { id: 4, name: 'ديانا روسو', sport: 'الفول كونتاكت', age: 30, email: 'diana@example.com', phone: '0765432198', membership: 'ذهبي', lastVisit: '2023-05-20', notes: 'مهتمة بالتدريب الخاص' },
      ];
      setClients(dummyClients);
      setFilteredClients(dummyClients);
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const results = clients.filter(client =>
      client[searchType].toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(results);
  }, [searchTerm, searchType, clients]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleViewDetails = (client) => {
    // تنفيذ المنطق لعرض تفاصيل العميل
    console.log('تفاصيل العميل:', client);
  };

  const handleDelete = (id) => {
    setClients(clients.filter(client => client.id !== id));
    setFilteredClients(filteredClients.filter(client => client.id !== id));
  };

  const getMembershipColor = (membership) => {
    switch (membership.toLowerCase()) {
      case 'ذهبي': return 'bg-yellow-500 text-white';
      case 'فضي': return 'bg-gray-400 text-white';
      case 'برونزي': return 'bg-amber-600 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">قائمة العملاء</h1>
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="البحث..."
          value={searchTerm}
          onChange={handleSearch}
          className="flex-grow p-2 border rounded text-right"
        />
        <select
          value={searchType}
          onChange={handleSearchTypeChange}
          className="p-2 border rounded"
        >
          <option value="name">الاسم</option>
          <option value="id">المعرف</option>
          <option value="sport">الرياضة</option>
          <option value="membership">الاشتراك</option>
        </select>
        <button className="p-2 border rounded">
          <Search className="h-5 w-5" />
        </button>
        <button className="p-2 border rounded">
          <Filter className="h-5 w-5" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-right">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6">المعرف</th>
              <th className="py-3 px-6">الاسم</th>
              <th className="py-3 px-6">الرياضة</th>
              <th className="py-3 px-6">الاشتراك</th>
              <th className="py-3 px-6">آخر زيارة</th>
              <th className="py-3 px-6">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredClients.map((client) => (
              <tr key={client.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 whitespace-nowrap">{client.id}</td>
                <td className="py-3 px-6">{client.name}</td>
                <td className="py-3 px-6">{client.sport}</td>
                <td className="py-3 px-6">
                  <span className={`py-1 px-3 rounded-full text-xs ${getMembershipColor(client.membership)}`}>
                    {client.membership}
                  </span>
                </td>
                <td className="py-3 px-6">{client.lastVisit}</td>
                <td className="py-3 px-6 flex justify-start space-x-2">
                  <button
                    onClick={() => handleViewDetails(client)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default List;

