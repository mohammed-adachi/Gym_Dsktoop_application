import React, { useState } from 'react';

export default function Inscription() {
  const [formData, setFormData] = useState({
    name: '',
    prenom: '',
    date_naissance: '',
    cin: '',
    typede_sport: '',
    profession: '',
    phone: '',
    adresse: '',
    photo: '',
    dateinscrit: new Date().toISOString().split('T')[0]
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prevState => ({
          ...prevState,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Ici, vous pouvez ajouter la logique pour envoyer les données au serveur
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-4 md:mb-0">Inscription Sportive</h1>
          <div className="w-full md:w-auto flex flex-col items-center">
            <div className="relative w-40 h-40 mb-4">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Aperçu de la photo"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center">
                  <svg className="h-20 w-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              )}
            </div>
            <label
              htmlFor="photo-upload"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition duration-300 ease-in-out"
            >
              Choisir une photo
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
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="date_naissance" className="block text-sm font-medium text-gray-700">Date de naissance</label>
              <input
                type="date"
                id="date_naissance"
                name="date_naissance"
                value={formData.date_naissance}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="typede_sport" className="block text-sm font-medium text-gray-700">Type de sport</label>
              <select
                id="typede_sport"
                name="typede_sport"
                value={formData.typede_sport}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Sélectionnez un sport</option>
                <option value="fitness">Fitness</option>
                <option value="aerobic">Aérobic</option>
                <option value="taekwondo">Taekwondo</option>
                <option value="fullcontact">Full Contact</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-gray-700">Profession</label>
              <input
                type="text"
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">Adresse</label>
              <input
                type="text"
                id="adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-2 text-white font-semibold rounded-md shadow-sm transition duration-150 ease-in-out transform hover:scale-105"
            >
              S'inscrire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

