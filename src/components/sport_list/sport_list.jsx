import React, { useState } from 'react';
import { Users, Dumbbell, BoxIcon as Boxing, SpaceIcon as Yoga, BarcodeIcon as Karate, Swords, X } from 'lucide-react';

const members = [
  { id: 1, name: "أليس دوبون", sport: "الأيروبيك", level: "متقدم", age: 28, email: "alice@example.com" },
  { id: 2, name: "بوب مارتن", sport: "الملاكمة", level: "متوسط", age: 35, email: "bob@example.com" },
  { id: 3, name: "تشارلي لوكلير", sport: "اللياقة البدنية", level: "مبتدئ", age: 22, email: "charlie@example.com" },
  { id: 4, name: "ديانا روسو", sport: "التايكوندو", level: "خبير", age: 30, email: "diana@example.com" },
  { id: 5, name: "إتيان تريمبلاي", sport: "الفول كونتاكت", level: "متوسط", age: 27, email: "etienne@example.com" },
  { id: 6, name: "فيونا غانيون", sport: "الأيروبيك", level: "مبتدئ", age: 24, email: "fiona@example.com" },
  { id: 7, name: "جورج بوشار", sport: "الملاكمة", level: "متقدم", age: 32, email: "georges@example.com" },
  { id: 8, name: "هيلين كوتي", sport: "اللياقة البدنية", level: "متوسط", age: 29, email: "helene@example.com" },
  { id: 9, name: "إيفان دوبوا", sport: "التايكوندو", level: "مبتدئ", age: 20, email: "ivan@example.com" },
  { id: 10, name: "جولي لومي", sport: "الفول كونتاكت", level: "خبير", age: 33, email: "julie@example.com" },
];

const sports = [
  { name: "الأيروبيك", icon: Yoga },
  { name: "الملاكمة", icon: Boxing },
  { name: "اللياقة البدنية", icon: Dumbbell },
  { name: "التايكوندو", icon: Karate },
  { name: "الفول كونتاكت", icon: Swords },
];

const SportMembers = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const filteredMembers = selectedSport
    ? members.filter(member => member.sport === selectedSport)
    : [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <div key={member.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div className="flex items-center">
                  <Users className="mr-2 text-blue-500" size={20} />
                  <span className="text-lg">{member.name}</span>
                </div>
                <button 
                  onClick={() => setSelectedMember(member)} 
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  عرض
                </button>
              </div>
            ))}
          </div>
          {filteredMembers.length === 0 && (
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

      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{selectedMember.name}</h3>
              <button onClick={() => setSelectedMember(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-2">
              <p>الرياضة: {selectedMember.sport}</p>
              <p>المستوى: {selectedMember.level}</p>
              <p>العمر: {selectedMember.age} سنة</p>
              <p>البريد الإلكتروني: {selectedMember.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportMembers;
