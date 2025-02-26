import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, Filter, UserPlus, X, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { User, Calendar, CreditCard, Briefcase, MapPin, Phone, Clock, Award } from 'lucide-react';

// Le composant Modal reste inchangé comme demandé
const Modal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  // Format dates if needed
  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifié";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white">Détails du membre</h2>
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
            {/* Section photo et abonnement */}
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

              {/* Information d'abonnement */}
              <div className="bg-blue-50 rounded-lg p-4 shadow-sm mb-4">
                <h3 className="font-bold text-blue-700 text-lg mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Abonnement
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type de sport:</span>
                    <span className="font-medium">{user.sport_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Prix:</span>
                    <span className="font-medium">{user.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date de début:</span>
                    <span className="font-medium">{formatDate(user.start_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date de fin:</span>
                    <span className="font-medium">{formatDate(user.end_date)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="md:w-2/3">
              <div className="bg-gray-50 rounded-lg p-5 shadow-sm">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Informations personnelles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-500">ID</span>
                    </div>
                    <p className="font-medium">{user.id}</p>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-500">Nom complet</span>
                    </div>
                    <p className="font-medium">{`${user.first_name} ${user.last_name}`}</p>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-500">Date de naissance</span>
                    </div>
                    <p className="font-medium">{user.date_naissance}</p>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-500">CIN</span>
                    </div>
                    <p className="font-medium">{user.cin}</p>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <Briefcase className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-500">Profession</span>
                    </div>
                    <p className="font-medium">{user.profession}</p>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-500">Adresse</span>
                    </div>
                    <p className="font-medium">{user.adresse}</p>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <Phone className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-500">Téléphone</span>
                    </div>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-500">Date d'inscription</span>
                    </div>
                    <p className="font-medium">{user.registration_date}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={onClose}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all duration-200"
                >
                  Fermer
                </button>
              </div>
            </div>
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

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
    if (searchTerm === '') {
      setFilteredUsers(users);
      return;
    }
    
    const results = users.filter(user => {
      // Vérifier si la propriété existe avant de l'utiliser
      if (user[searchType] === undefined) return false;
      
      // Convertir en string pour la recherche
      const fieldValue = String(user[searchType]).toLowerCase();
      return fieldValue.includes(searchTerm.toLowerCase());
    });
    
    setFilteredUsers(results);
  }, [searchTerm, searchType, users]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleViewDetails = async (user) => {
    try {
      // Vérifie que user.id est bien une chaîne
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

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      return;
    }
    
    try {
      setIsLoading(true);
      await invoke('delete_existing_user', { id: id.toString() });
      showNotification('Membre supprimé avec succès', 'success');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('Erreur lors de la suppression du membre', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    // Rediriger vers un formulaire d'ajout serait préférable,
    // mais puisque nous maintenons la même logique :
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
      setIsLoading(true);
      await invoke('add_user', { user: newUser });
      showNotification('Membre ajouté avec succès', 'success');
      fetchUsers(); // Refresh the user list
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

  // Fonction pour vérifier si l'abonnement est actif
  const isSubscriptionActive = (endDate) => {
    if (!endDate) return false;
    return new Date(endDate) > new Date();
  };

  // Formatage de la date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header avec titre et compteur */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Liste des membres</h1>
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm mr-2">
              Total: {users.length} membres
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

      {/* Notification */}
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

      {/* Barre de recherche et filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un membre..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={searchType}
              onChange={handleSearchTypeChange}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="last_name">Nom</option>
              <option value="first_name">Prénom</option>
              <option value="id">ID</option>
              <option value="sport_type">Sport</option>
              <option value="phone">Téléphone</option>
            </select>
            
            <button 
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              title="Filtres avancés"
            >
              <Filter className="h-5 w-5" />
            </button>
            
            <button 
              onClick={handleAddUser} 
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
              title="Ajouter un nouveau membre"
            >
              <UserPlus className="h-5 w-5" />
              <span className="hidden md:inline">Ajouter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Affichage de l'état de chargement */}
      {isLoading && (
        <div className="bg-white p-10 rounded-lg shadow-sm mb-4 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Affichage des erreurs */}
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

      {/* Table des membres */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'Aucun résultat trouvé pour votre recherche.' : 'Aucun membre disponible.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscription</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.registration_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isSubscriptionActive(user.end_date) 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {isSubscriptionActive(user.end_date) 
                            ? 'Actif' 
                            : 'Expiré'}
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

      {/* Le Modal reste inchangé */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={selectedUser} />
    </div>
  );
};

export default List;