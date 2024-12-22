import React, { useState, useEffect } from 'react';
import { Users, Dumbbell, BoxIcon as Boxing, SpaceIcon as Yoga, BarcodeIcon as Karate, Swords } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

const sports = [
  { name: "الأيروبيك", icon: Yoga },
  { name: "الملاكمة", icon: Boxing },
  { name: "اللياقة البدنية", icon: Dumbbell },
  { name: "التايكوندو", icon: Karate },
  { name: "الفول كونتاكت", icon: Swords },
];

const SportMembers = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await invoke('get_all_users');
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filteredUsers = selectedSport
    ? users.filter(user => user.sport_type === selectedSport)
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
                  <th className="py-2 px-4 border-b">تاريخ الميلاد</th>
                  <th className="py-2 px-4 border-b">رقم الهوية</th>
                  <th className="py-2 px-4 border-b">المهنة</th>
                  <th className="py-2 px-4 border-b">العنوان</th>
                  <th className="py-2 px-4 border-b">الهاتف</th>
                  <th className="py-2 px-4 border-b">تاريخ التسجيل</th>
                  <th className="py-2 px-4 border-b">السعر</th>
                  <th className="py-2 px-4 border-b">تاريخ البدء</th>
                  <th className="py-2 px-4 border-b">تاريخ الانتهاء</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{`${user.first_name} ${user.last_name}`}</td>
                    <td className="py-2 px-4 border-b">{user.date_naissance}</td>
                    <td className="py-2 px-4 border-b">{user.cin}</td>
                    <td className="py-2 px-4 border-b">{user.profession}</td>
                    <td className="py-2 px-4 border-b">{user.adresse}</td>
                    <td className="py-2 px-4 border-b">{user.phone}</td>
                    <td className="py-2 px-4 border-b">{user.registration_date}</td>
                    <td className="py-2 px-4 border-b">{user.price}</td>
                    <td className="py-2 px-4 border-b">{user.start_date}</td>
                    <td className="py-2 px-4 border-b">{user.end_date}</td>
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
    </div>
  );
};

export default SportMembers;

