import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaCamera, FaDumbbell, FaUserPlus } from 'react-icons/fa';
import { invoke } from '@tauri-apps/api/core';
import Flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Arabic } from 'flatpickr/dist/l10n/ar'; // Localisation en arabe

const Inscription = () => {
  const [formData, setFormData] = useState({
    id: '',
    last_name: '',
    first_name: '',
    date_naissance: '',
    cin: '',
    profession: '',
    adresse: '',
    photo: '',
    phone: '',
    registration_date: '',
    sport_type: '',
    price: 0,
    start_date: '',
    end_date: '',
  });

  const [previewImage, setPreviewImage] = useState(null);

  // Références pour Flatpickr
  const dateNaissanceRef = useRef(null);
  const registrationDateRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  // Initialiser Flatpickr
  useEffect(() => {
    // Configuration de Flatpickr
    const flatpickrOptions = {
      locale: Arabic, // Localisation en arabe
      dateFormat: 'd/m/Y', // Format de date personnalisé
      altInput: true, // Afficher un champ alternatif avec le format personnalisé
      altFormat: 'd/m/Y', // Format affiché à l'utilisateur
    };

    // Appliquer Flatpickr aux champs de date
    Flatpickr(dateNaissanceRef.current, flatpickrOptions);
    Flatpickr(registrationDateRef.current, flatpickrOptions);
    Flatpickr(startDateRef.current, flatpickrOptions);
    Flatpickr(endDateRef.current, flatpickrOptions);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setPreviewImage(result);
        setFormData((prevState) => ({
          ...prevState,
          photo: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const result = await invoke('add_new_user', { user: formData });
      console.log('Réponse du backend:', result);
      alert('تم التسجيل بنجاح !');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert('لقد حدث خطأ.');
    }
  };

  return (
    <div className="overflow-auto h-full bg-zinc-100 pb-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-t-lg p-4">
          <div className="flex items-center space-x-3">
            <FaDumbbell className="text-white text-2xl" />
            <h2 className="text-2xl font-bold text-white">تسجيل الأعضاء</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="w-full md:w-auto flex flex-col md:flex-row items-center mb-6 md:mb-0 space-x-4">
              <div className="relative w-32 h-32 mb-3 md:mb-0">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Aperçu de la photo"
                    className="w-full h-full object-cover rounded-full border-4 border-red-500 shadow-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center border-4 border-red-500">
                    <FaCamera className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <label
                htmlFor="photo-upload"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer transition duration-300 ease-in-out flex items-center space-x-2 text-sm"
              >
                <FaCamera className="mr-2" />
                <span>إضافة صورة</span>
              </label>
              <input
                id="photo-upload"
                name="photo"
                type="file"
                className="hidden"
                onChange={handlePhotoChange}
                accept="image/*"
              />
            </div>

            <div className="w-full md:w-auto">
              <label htmlFor="id" className="block text-xl font-medium text-gray-700 text-right">رقم</label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-xl font-medium text-gray-700"> الاسم العائلي </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-xl font-medium text-gray-700"> الاسم الشخصي</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="date_naissance" className="block text-xl font-medium text-gray-700">تاريخ ازدياد</label>
                <input
                  type="text"
                  id="date_naissance"
                  name="date_naissance"
                  ref={dateNaissanceRef}
                  value={formData.date_naissance}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="cin" className="block text-xl font-medium text-gray-700">بطاقة الهوية </label>
                <input
                  type="text"
                  id="cin"
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="profession" className="block text-xl font-medium text-gray-700">مهنة</label>
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="adresse" className="block text-xl font-medium text-gray-700">عنوان</label>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-xl font-medium text-gray-700">هاتف</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="registration_date" className="block text-xl font-medium text-gray-700">تاريخ التسجيل</label>
                <input
                  type="text"
                  id="registration_date"
                  name="registration_date"
                  ref={registrationDateRef}
                  value={formData.registration_date}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="sport_type" className="block text-xl font-medium text-gray-700">نوع الرياضة</label>
                <select
                  id="sport_type"
                  name="sport_type"
                  value={formData.sport_type}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-xl focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Sélectionnez un sport</option>
                  <option value="الأيروبيك">الأيروبيك</option>
                  <option value="الملاكمة">الملاكمة</option>
                  <option value="اللياقة البدنية">اللياقة البدنية</option>
                  <option value="التايكوندو">التايكوندو</option>
                  <option value="كونتاكت الفول">الفول كونتاكت</option>
                </select>
              </div>
              <div>
                <label htmlFor="price" className="block text-xl font-medium text-gray-700">المبلغ</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="start_date" className="block text-xl font-medium text-gray-700">تاريخ البدء</label>
                <input
                  type="text"
                  id="start_date"
                  name="start_date"
                  ref={startDateRef}
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="end_date" className="block text-xl font-medium text-gray-700">تاريخ الانتهاء</label>
                <input
                  type="text"
                  id="end_date"
                  name="end_date"
                  ref={endDateRef}
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-xl focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-full shadow-lg hover:from-red-700 hover:to-red-800 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 text-sm"
              >
                <FaUserPlus className="text-lg" />
                <span>تأكيد التسجيل</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

Inscription.propTypes = {
  // Vous pouvez ajouter des PropTypes ici si nécessaire
};

export default Inscription;