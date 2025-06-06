import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, UserPlus, X, RefreshCw, AlertTriangle, CheckCircle, Edit, Printer } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { User, Calendar, CreditCard, Briefcase, MapPin, Phone, Clock, Award } from 'lucide-react';

const Modal = ({ isOpen, onClose, user }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch (error) {
      return dateString;
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white">تفاصيل العضو</h2>
            <button 
              onClick={onClose} 
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 md:pr-6">
              <div className="mb-6">
                {user.photo ? (
                  <img 
                    src={user.photo} 
                    alt="Photo du membre" 
                    className="w-full h-auto rounded-lg shadow-md object-cover" 
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-md">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="bg-blue-50 rounded-lg p-4 shadow-sm mb-4">
                <h3 className="font-bold text-blue-700 text-lg mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  الاشتراك
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">نوع الرياضة:</span>
                    <span className="font-medium">{user.sport_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">التأمين:</span>
                    <span className="font-medium">{user.assirance}</span>
                  </div>
                    <div className="flex justify-between">
                    <span className="text-gray-500">تاريخه :</span>
                    <span className="font-medium">{formatDate(user.registration_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">المبلغ:</span>
                    <span className="font-medium">{user.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">تاريخ الانخراط:</span>
                    <span className="font-medium">{user.start_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">تاريخ النهاية:</span>
                    <span className="font-medium">{user.end_date}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="bg-gray-50 rounded-lg p-5 shadow-sm">
                <h3 className="font-bold text-gray-800 text-xl mb-4">معلومات شخصية</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-500">رقم</span>
                    </div>
                    <p className="font-medium">{user.id}</p>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-xl text-gray-500">الاسم الكامل</span>
                    </div>
                    <p className="font-medium">{`${user.first_name} ${user.last_name}`}</p>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-xl text-gray-500">تاريخ الميلاد</span>
                    </div>
                    <p className="font-medium">{user.date_naissance}</p>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-xl text-gray-500">بطاقة تعريف</span>
                    </div>
                    <p className="font-medium">{user.cin}</p>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <Briefcase className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-xl text-gray-500">مهنة</span>
                    </div>
                    <p className="font-medium">{user.profession}</p>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-xl text-gray-500">العنوان</span>
                    </div>
                    <p className="font-medium">{user.adresse}</p>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <Phone className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-xl text-gray-500">الهاتف</span>
                    </div>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-xl text-gray-500">حالة الالتزام</span>
                    </div>
                    <p className="font-medium">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.statut 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.statut ? 'ملتزم' : 'غير ملتزم'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={onClose}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all duration-200"
                >
                  اغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditModal = ({ isOpen, onClose, user, onSubmit }) => {
  const [formData, setFormData] = useState(user);
  const [photoPreview, setPhotoPreview] = useState(user.photo || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'start_date' && value) {
      const startDate = new Date(value);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 30);
      
      const formattedEndDate = endDate.toISOString().split('T')[0];
      
      setFormData(prevState => ({
        ...prevState,
        start_date: value,
        end_date: formattedEndDate
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white">تعديل العضو</h2>
            <button 
              onClick={onClose} 
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">صورة العضو</label>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-24 w-24 rounded-full overflow-hidden bg-gray-200">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-500">
                        <User className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-gray-700">ID</label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">الاسم الشخصي</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-xl font-medium text-gray-700">الاسم العائلي</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="date_naissance" className="block text-sm font-medium text-gray-700">تاريخ الميلاد</label>
                <input
                  type="date"
                  id="date_naissance"
                  name="date_naissance"
                  value={formData.date_naissance}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="cin" className="block text-sm font-medium text-gray-700">بطاقة الهوية</label>
                <input
                  type="text"
                  id="cin"
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="profession" className="block text-sm font-medium text-gray-700">مهنة</label>
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">عنوان</label>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">هاتف</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            
      <div>
                <label htmlFor="registration_date" className="block text-sm font-medium text-gray-700">تاريخه </label>
                <input
                  type="date"
                  id="registration_date"
                  name="registration_date"
                  value={formData.registration_date}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="assirance" className="block text-sm font-medium text-gray-700">تأمين</label>
                <input
                  type="number"
                  id="assirance"
                  name="assirance"
                  value={formData.assirance}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">السعر</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
                <div>
                <label htmlFor="sport_type" className="block text-sm font-medium text-gray-700">نوع الرياضة</label>
                <select
                  id="sport_type"
                  name="sport_type"
                  value={formData.sport_type}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="الأيروبيك">الأيروبيك</option>
                  <option value="الملاكمة">الملاكمة</option>
                  <option value="اللياقة البدنية">اللياقة البدنية</option>
                  <option value="التايكوندو">التايكوندو</option>
                  <option value="الفول كونتاكت">الفول كونتاكت</option>
                  <option value="كمال الأجسام">  كمال الأجسام</option>

                </select>
              </div>
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">تاريخ البدء</label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">تاريخ الانتهاء (يتم حسابه تلقائيا +30 يوم)</label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="statut" className="block text-sm font-medium text-gray-700">حالة الالتزام</label>
                <select
                  id="statut"
                  name="statut"
                  value={formData.statut}
                  onChange={(e) => setFormData({...formData, statut: e.target.value === "true"})}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={true}>ملتزم</option>
                  <option value={false}>غير ملتزم</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all duration-200"
              >
                حفظ التعديلات
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Lists = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSport, setSelectedSport] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedUsers = await invoke('get_all_users');
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Impossible de charger les membres. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let results = users;
    
    // Filtre par statut d'engagement
    if (statusFilter !== 'all') {
      results = results.filter(user => {
        return statusFilter === 'committed' ? user.statut : !user.statut;
      });
    }
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(user => 
        (user.first_name && user.first_name.toLowerCase().includes(term)) ||
        (user.last_name && user.last_name.toLowerCase().includes(term)) ||
        (user.phone && user.phone.includes(searchTerm)) ||
        (user.id && user.id.includes(searchTerm))
      );
    }
    
    setFilteredUsers(results);
  }, [searchTerm, statusFilter, users]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSportFilterChange = (e) => {
    setSelectedSport(e.target.value);
  };

  const isSubscriptionActive = (endDate) => {
    if (!endDate) return false;
    
    try {
      // Nettoyer la date si elle contient du texte
      const cleanedDate = endDate.replace('انتهى في: ', '').trim();
      
      // Convertir DD/MM/YYYY en Date object
      const [day, month, year] = cleanedDate.split('/');
      const dateObj = new Date(`${year}/${month}/${day}`);
      
      // Vérifier si la date est valide et non expirée
      return !isNaN(dateObj.getTime()) && dateObj > new Date();
    } catch (error) {
      console.error('Error parsing date:', error);
      return false;
    }
  };

  const printCommittedMembers = () => {
    const committedMembers = users.filter(user => 
      user.statut && (selectedSport === 'all' || user.sport_type === selectedSport)
    );

    if (committedMembers.length === 0) {
      showNotification('لا يوجد أعضاء ملتزمين للرياضة المحددة', 'info');
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>قائمة الأعضاء الملتزمين - ${selectedSport === 'all' ? 'جميع الرياضات' : selectedSport}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1, h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; }
          .header { display: flex; flex-direction: column; align-items: center; margin-bottom: 20px; }
          .logo { max-width: 100px; height: auto; margin-bottom: 10px; }
          @media print {
            body { padding: 0; margin: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>جمعية النصر سابس للرياضة</h1>
          <h2>قائمة الأعضاء الملتزمين - ${selectedSport === 'all' ? 'جميع الرياضات' : selectedSport}</h2>
          <p>تاريخ الطباعة: ${new Date().toLocaleDateString()}</p>
          <p>عدد الأعضاء: ${committedMembers.length}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>الرقم</th>
              <th>الاسم الكامل</th>
              <th>نوع الرياضة</th>
              <th>الهاتف</th>
              <th>حالة الاشتراك</th>
              <th>تاريخ الانتهاء</th>
            </tr>
          </thead>
          <tbody>
            ${committedMembers.map(user => `
              <tr>
                <td>${user.id}</td>
                <td>${user.first_name} ${user.last_name}</td>
                <td>${user.sport_type}</td>
                <td>${user.phone || 'غير محدد'}</td>
                <td>${isSubscriptionActive(user.end_date) ? 'نشط' : 'منتهي'}</td>
                <td>${user.end_date || 'غير محدد'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px;">
            طباعة
          </button>
          <button onclick="window.close()" style="padding: 10px 15px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px;">
            إغلاق
          </button>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(() => { window.print(); }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleViewDetails = async (user) => {
    try {
      const userId = String(user.id); 
      setIsLoading(true);
      const fetchedUser = await invoke("get_userID", { id: userId });
      setSelectedUser(fetchedUser);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      showNotification(`Erreur: Impossible de récupérer les détails de l'utilisateur`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (user) => {
    setUserToUpdate(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (updatedUser) => {
    try {
      setIsLoading(true);
      
      await invoke('update_all_fieds', {
        oldId: userToUpdate.id,
        newUser: {
          ...updatedUser,
          price: parseFloat(updatedUser.price) || 0,
          assirance: parseFloat(updatedUser.assirance) || 0,
          statut: Boolean(updatedUser.statut)
        }
      });

      showNotification('تم تحديث العضو بنجاح', 'success');
      fetchUsers();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('خطأ أثناء تحديث العضو:', error);
      showNotification(`خطأ أثناء تحديث العضو: ${error}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذا العضو؟")) {
      return;
    }
    
    try {
      setIsLoading(true);
      await invoke('delete_existing_user', { id: id.toString() });
      showNotification('تم حذف العضو بنجاح', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('Erreur lors de la suppression du membre', 'error');
    } finally {
      setIsLoading(false);
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
      statut: true
    };

    try {
      setIsLoading(true);
      await invoke('add_user', { user: newUser });
      showNotification('تمت إضافة العضو بنجاح', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      showNotification('Erreur lors de l\'ajout du membre', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";

    if (typeof dateString === 'string' && dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      if (day && month && year) {
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
      }
    }

    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    } catch (error) {
      console.error("Erreur de formatage de date :", error);
    }

    return dateString || "غير محدد";
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">قائمة الأعضاء</h1>
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm mr-2">
              المجموع: {filteredUsers.length} أعضاء
            </div>
            <button 
              onClick={fetchUsers} 
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Rafraîchir la liste"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div className={`mb-4 p-3 rounded-lg flex items-center ${
          notification.type === 'error' ? 'bg-red-100 text-red-800' : 
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {notification.type === 'error' ? <AlertTriangle className="h-5 w-5 mr-2" /> : 
           notification.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : 
           <div className="h-5 w-5 mr-2" />}
          {notification.message}
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ابحث باسم العضو أو رقم ..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">الكل</option>
              <option value="committed">ملتزم</option>
              <option value="not_committed">غير ملتزم</option>
            </select>

            <select
              value={selectedSport}
              onChange={handleSportFilterChange}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">جميع الرياضات</option>
              <option value="الأيروبيك">الأيروبيك</option>
              <option value="الملاكمة">الملاكمة</option>
              <option value="اللياقة البدنية">اللياقة البدنية</option>
              <option value="التايكوندو">التايكوندو</option>
              <option value="الفول كونتاكت">الفول كونتاكت</option>
              <option value="كمال الأجسام">كمال الأجسام</option>
            </select>
            
            <button 
              onClick={printCommittedMembers}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
              title="طباعة الأعضاء الملتزمين"
            >
              <Printer className="h-5 w-5" />
              <span className="hidden md:inline">طباعة الملتزمين</span>
            </button>

            <button 
              onClick={handleAddUser} 
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
              title="Ajouter un nouveau membre"
            >
              <UserPlus className="h-5 w-5" />
              <span className="hidden md:inline">أضف عضوًا</span>
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white p-10 rounded-lg shadow-sm mb-4 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-sm mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
          <button 
            onClick={fetchUsers}
            className="ml-auto bg-red-200 hover:bg-red-300 py-1 px-3 rounded text-sm"
          >
            Réessayer
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'لم يتم العثور على نتائج لبحثك.' : 'لا يوجد أعضاء متاحين.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">رقم</th>
                    <th scope="col" className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">اسم</th>
                    <th scope="col" className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">نوع الرياضة</th>
                    <th scope="col" className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider"> تاريخ الانخراط</th>
                    <th scope="col" className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">حالة الاشتراك</th>
                    <th scope="col" className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">حالة الالتزام</th>
                    <th scope="col" className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {user.photo ? (
                              <img src={user.photo} alt="" className="h-10 w-10 rounded-full" />
                            ) : (
                              <span className="text-gray-500 text-lg font-medium">
                                {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{`${user.first_name} ${user.last_name}`}</div>
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.sport_type || 'Non défini'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.garde_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isSubscriptionActive(user.end_date) 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {isSubscriptionActive(user.end_date) 
                            ? 'نشيط' 
                            : 'منتهي الصلاحية'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.statut 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.statut ? 'ملتزم' : 'غير ملتزم'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                            title="Voir les détails"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleUpdate(user)}
                            className="text-yellow-600 hover:text-yellow-900 p-1 hover:bg-yellow-50 rounded"
                            title="Modifier le membre"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                            title="Supprimer le membre"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={selectedUser} />
      {isEditModalOpen && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={userToUpdate}
          onSubmit={handleUpdateSubmit}
        />
      )}
    </div>
  );
};

export default Lists;