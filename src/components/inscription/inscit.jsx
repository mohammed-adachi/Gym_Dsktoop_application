// import React, { useState } from 'react';
// import { FaCamera, FaDumbbell, FaUserPlus } from 'react-icons/fa';
// import { invoke } from '@tauri-apps/api/core';

// const Inscription = () => {
//   const [formData, setFormData] = useState({
//   id: '',
//   last_name: '',
//   first_name: '',
//   date_naissance: '', 
//   cin: '', 
//   profession: '', 
//   adresse: '', 
//   photo: '', 
//   phone: '', 
//   registration_date:'', 
//   sport_type: '', 
//   price : '', 
//   start_date : '', 
//   end_date  : '',
//   });

//   const [previewImage, setPreviewImage] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result);
//         setFormData(prevState => ({
//           ...prevState,
//           photo: reader.result
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(formData);
//   };

//   return (
//     <div className="overflow-auto h-full bg-zinc-100 pb-6">
//       <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg">
//         {/* En-tête avec effet de gradient */}
//         <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-t-lg p-4">
//           <div className="flex items-center space-x-3">
//             <FaDumbbell className="text-white text-2xl" />
//             <h2 className="text-2xl font-bold text-white">Inscription Membre</h2>
//           </div>
//         </div>

//         {/* Formulaire principal */}
//         <div className="p-6">
//           <div className="flex flex-col md:flex-row justify-between items-center mb-6">
//             <div className="w-full md:w-auto flex flex-col items-center mb-6 md:mb-0">
//               <div className="relative w-32 h-32 mb-3">
//                 {previewImage ? (
//                   <img
//                     src={previewImage}
//                     alt="Aperçu de la photo"
//                     className="w-full h-full object-cover rounded-full border-4 border-red-500 shadow-xl"
//                   />
//                 ) : (
//                   <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center border-4 border-red-500">
//                     <FaCamera className="h-12 w-12 text-gray-400" />
//                   </div>
//                 )}
//               </div>
//               <label
//                 htmlFor="photo-upload"
//                 className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer transition duration-300 ease-in-out flex items-center space-x-2 text-sm"
//               >
//                 <FaCamera className="mr-2" />
//                 <span>Ajouter une photo</span>
//               </label>
//               <input
//                 id="photo-upload"
//                 name="photo"
//                 type="file"
//                 className="hidden"
//                 onChange={handlePhotoChange}
//                 accept="image/*"
//               />
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
//                 />
//               </div>
           
             
//               <div>
//                 <label htmlFor="cin" className="block text-sm font-medium text-gray-700">CIN</label>
//                 <input
//                   type="text"
//                   id="cin"
//                   name="cin"
//                   value={formData.cin}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="typede_sport" className="block text-sm font-medium text-gray-700">Type de sport</label>
//                 <select
//                   id="typede_sport"
//                   name="typede_sport"
//                   value={formData.typede_sport}
//                   onChange={handleChange}
//                   required
//                   className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
//                 >
//                   <option value="">Sélectionnez un sport</option>
//                   <option value="fitness">Fitness</option>
//                   <option value="aerobic">Aérobic</option>
//                   <option value="taekwondo">Taekwondo</option>
//                   <option value="fullcontact">Full Contact</option>
//                   <option value="autre">Autre</option>
//                 </select>
//               </div>
//               <div>
//                 <label htmlFor="profession" className="block text-sm font-medium text-gray-700">Profession</label>
//                 <input
//                   type="text"
//                   id="profession"
//                   name="profession"
//                   value={formData.profession}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
//                 <input
//                   type="tel"
//                   id="phone"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">Adresse</label>
//                 <input
//                   type="text"
//                   id="adresse"
//                   name="adresse"
//                   value={formData.adresse}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end mt-6">
//               <button
//                 type="submit"
//                 className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-full shadow-lg hover:from-red-700 hover:to-red-800 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 text-sm"
//               >
//                 <FaUserPlus className="text-lg" />
//                 <span>Confirmer l'inscription</span>
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Inscription;
import React, { useState } from 'react';
import { FaCamera, FaDumbbell, FaUserPlus } from 'react-icons/fa';
import { invoke } from '@tauri-apps/api/core';

const Inscription = () => {
  const [formData, setFormData] = useState({
    id: 'tyu',
    last_name: '',
    first_name: '',
    date_naissance: '1-1-developer',
    cin: 'developer',
    profession: 'developer',
    adresse: 'developer',
    photo: 'developer',
    phone: 'developer',
    registration_date: 'developer',
    sport_type: 'developer',
    price: 12,
    start_date: 'developer',
    end_date: 'developer',
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prevState) => ({
          ...prevState,
          photo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
console.log(formData);
    try {
      // Appel au backend via invoke
      const result = await invoke('add_new_user', { user: formData });
      console.log('Réponse du backend:', result);
      alert('Inscription réussie !');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert('Une erreur est survenue.');
    }
  };

  return (
    <div className="overflow-auto h-full bg-zinc-100 pb-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-t-lg p-4">
          <div className="flex items-center space-x-3">
            <FaDumbbell className="text-white text-2xl" />
            <h2 className="text-2xl font-bold text-white">Inscription Membre</h2>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Prénom</label>
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
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Nom</label>
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
                <label htmlFor="cin" className="block text-sm font-medium text-gray-700">CIN</label>
                <input
                  type="text"
                  id="cin"
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              {/* Ajoutez les autres champs ici */}
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-full shadow-lg hover:from-red-700 hover:to-red-800 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 text-sm"
              >
                <FaUserPlus className="text-lg" />
                <span>Confirmer l'inscription</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Inscription;
