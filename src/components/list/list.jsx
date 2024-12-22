// import React, { useState, useEffect } from 'react';
// import { Search, Trash2, Eye, Filter } from 'lucide-react';

// const List = () => {
//   const [clients, setClients] = useState([]);
//   const [filteredClients, setFilteredClients] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchType, setSearchType] = useState('name');

//   useEffect(() => {
//     // محاكاة تحميل العملاء من API
//     const fetchClients = async () => {
//       // استبدال هذه البيانات ببيانات حقيقية من API عند توفرها
//       const dummyClients = [
//         { id: 1, name: 'أليس دوبون', sport: 'اللياقة البدنية', age: 28, email: 'alice@example.com', phone: '0123456789', membership: 'ذهبي', lastVisit: '2023-05-15', notes: 'تفضل الحصص الصباحية' },
//         { id: 2, name: 'بوب مارتن', sport: 'الأيروبيك', age: 35, email: 'bob@example.com', phone: '0987654321', membership: 'فضي', lastVisit: '2023-05-10', notes: 'يحتاج إلى برنامج شخصي' },
//         { id: 3, name: 'تشارلي لوكلير', sport: 'التايكوندو', age: 22, email: 'charlie@example.com', phone: '0123498765', membership: 'برونزي', lastVisit: '2023-05-18', notes: 'يستعد لمسابقة' },
//         { id: 4, name: 'ديانا روسو', sport: 'الفول كونتاكت', age: 30, email: 'diana@example.com', phone: '0765432198', membership: 'ذهبي', lastVisit: '2023-05-20', notes: 'مهتمة بالتدريب الخاص' },
//       ];
//       setClients(dummyClients);
//       setFilteredClients(dummyClients);
//     };

//     fetchClients();
//   }, []);

//   useEffect(() => {
//     const results = clients.filter(client =>
//       client[searchType].toString().toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredClients(results);
//   }, [searchTerm, searchType, clients]);

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleSearchTypeChange = (e) => {
//     setSearchType(e.target.value);
//   };

//   const handleViewDetails = (client) => {
//     // تنفيذ المنطق لعرض تفاصيل العميل
//     console.log('تفاصيل العميل:', client);
//   };

//   const handleDelete = (id) => {
//     setClients(clients.filter(client => client.id !== id));
//     setFilteredClients(filteredClients.filter(client => client.id !== id));
//   };

//   const getMembershipColor = (membership) => {
//     switch (membership.toLowerCase()) {
//       case 'ذهبي': return 'bg-yellow-500 text-white';
//       case 'فضي': return 'bg-gray-400 text-white';
//       case 'برونزي': return 'bg-amber-600 text-white';
//       default: return 'bg-blue-500 text-white';
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">قائمة العملاء</h1>
//       <div className="mb-4 flex items-center space-x-2">
//         <input
//           type="text"
//           placeholder="البحث..."
//           value={searchTerm}
//           onChange={handleSearch}
//           className="flex-grow p-2 border rounded text-right"
//         />
//         <select
//           value={searchType}
//           onChange={handleSearchTypeChange}
//           className="p-2 border rounded"
//         >
//           <option value="name">الاسم</option>
//           <option value="id">المعرف</option>
//           <option value="sport">الرياضة</option>
//           <option value="membership">الاشتراك</option>
//         </select>
//         <button className="p-2 border rounded">
//           <Search className="h-5 w-5" />
//         </button>
//         <button className="p-2 border rounded">
//           <Filter className="h-5 w-5" />
//         </button>
//       </div>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white text-right">
//           <thead>
//             <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
//               <th className="py-3 px-6">المعرف</th>
//               <th className="py-3 px-6">الاسم</th>
//               <th className="py-3 px-6">الرياضة</th>
//               <th className="py-3 px-6">الاشتراك</th>
//               <th className="py-3 px-6">آخر زيارة</th>
//               <th className="py-3 px-6">الإجراءات</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-600 text-sm font-light">
//             {filteredClients.map((client) => (
//               <tr key={client.id} className="border-b border-gray-200 hover:bg-gray-100">
//                 <td className="py-3 px-6 whitespace-nowrap">{client.id}</td>
//                 <td className="py-3 px-6">{client.name}</td>
//                 <td className="py-3 px-6">{client.sport}</td>
//                 <td className="py-3 px-6">
//                   <span className={`py-1 px-3 rounded-full text-xs ${getMembershipColor(client.membership)}`}>
//                     {client.membership}
//                   </span>
//                 </td>
//                 <td className="py-3 px-6">{client.lastVisit}</td>
//                 <td className="py-3 px-6 flex justify-start space-x-2">
//                   <button
//                     onClick={() => handleViewDetails(client)}
//                     className="text-blue-600 hover:text-blue-900"
//                   >
//                     <Eye className="h-5 w-5" />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(client.id)}
//                     className="text-red-600 hover:text-red-900"
//                   >
//                     <Trash2 className="h-5 w-5" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };
// export default List;
import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, Filter, UserPlus, X } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

const Modal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold">Détails du membre</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3 pr-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-semibold">ID:</p>
                <p>{user.id}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Nom complet:</p>
                <p>{`${user.first_name} ${user.last_name}`}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Date de naissance:</p>
                <p>{user.date_naissance}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">CIN:</p>
                <p>{user.cin}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Profession:</p>
                <p>{user.profession}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Adresse:</p>
                <p>{user.adresse}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Téléphone:</p>
                <p>{user.phone}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Date d'inscription:</p>
                <p>{user.registration_date}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Type de sport:</p>
                <p>{user.sport_type}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Prix:</p>
                <p>{user.price}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Date de début:</p>
                <p>{user.start_date}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Date de fin:</p>
                <p>{user.end_date}</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/3 mt-6 md:mt-0">
            {user.photo ? (
              <img src={user.photo} alt="Photo du membre" className="w-full h-auto rounded-lg shadow-lg" />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Aucune photo disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const List = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('last_name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await invoke('get_all_users');
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    const results = users.filter(user =>
      user[searchType].toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, searchType, users]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await invoke('delete_existing_user', { id: id.toString()});
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAddUser = async () => {
    const newUser = {
      id: Date.now().toString(),
      last_name: 'Doe',
      first_name: 'John',
      date_naissance: '1990-01-01',
      cin: '123456',
      profession: 'Developer',
      adresse: '123 Main St',
      photo: '',
      phone: '1234567890',
      registration_date: new Date().toISOString().split('T')[0],
      sport_type: 'Fitness',
      price: 100,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    };

    try {
      await invoke('add_user', { user: newUser });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des membres</h1>
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={handleSearch}
          className="flex-grow p-2 border rounded"
        />
        <select
          value={searchType}
          onChange={handleSearchTypeChange}
          className="p-2 border rounded"
        >
          <option value="last_name">Nom</option>
          <option value="first_name">Prénom</option>
          <option value="id">ID</option>
          <option value="sport_type">Sport</option>
        </select>
        <button className="p-2 border rounded">
          <Search className="h-5 w-5" />
        </button>
        <button className="p-2 border rounded">
          <Filter className="h-5 w-5" />
        </button>
        <button onClick={handleAddUser} className="p-2 border rounded bg-green-500 text-white">
          <UserPlus className="h-5 w-5" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6">ID</th>
              <th className="py-3 px-6">Nom</th>
              <th className="py-3 px-6">Sport</th>
              <th className="py-3 px-6">Date d'inscription</th>
              <th className="py-3 px-6">Date de fin</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 whitespace-nowrap">{user.id}</td>
                <td className="py-3 px-6">{`${user.first_name} ${user.last_name}`}</td>
                <td className="py-3 px-6">{user.sport_type}</td>
                <td className="py-3 px-6">{user.registration_date}</td>
                <td className="py-3 px-6">{user.end_date}</td>
                <td className="py-3 px-6 flex justify-start space-x-2">
                  <button
                    onClick={() => handleViewDetails(user)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={selectedUser} />
    </div>
  );
};

export default List;


