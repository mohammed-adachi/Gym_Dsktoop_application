import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, Filter } from 'lucide-react';

const List = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');

  useEffect(() => {
    // Simuler le chargement des clients depuis une API
    const fetchClients = async () => {
      // Remplacer ceci par un vrai appel API lorsque disponible
      const dummyClients = [
        { id: 1, name: 'Alice Dupont', sport: 'Fitness', age: 28, email: 'alice@example.com', phone: '0123456789', membership: 'Gold', lastVisit: '2023-05-15', notes: 'Préfère les cours du matin' },
        { id: 2, name: 'Bob Martin', sport: 'Aérobic', age: 35, email: 'bob@example.com', phone: '0987654321', membership: 'Silver', lastVisit: '2023-05-10', notes: 'A besoin d\'un programme personnalisé' },
        { id: 3, name: 'Charlie Leclerc', sport: 'Taekwondo', age: 22, email: 'charlie@example.com', phone: '0123498765', membership: 'Bronze', lastVisit: '2023-05-18', notes: 'Prépare une compétition' },
        { id: 4, name: 'Diana Rousseau', sport: 'Full Contact', age: 30, email: 'diana@example.com', phone: '0765432198', membership: 'Gold', lastVisit: '2023-05-20', notes: 'Intéressée par le coaching privé' },
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
    // Implémenter la logique pour afficher les détails du client
    console.log('Détails du client:', client);
  };

  const handleDelete = (id) => {
    setClients(clients.filter(client => client.id !== id));
    setFilteredClients(filteredClients.filter(client => client.id !== id));
  };

  const getMembershipColor = (membership) => {
    switch (membership.toLowerCase()) {
      case 'gold': return 'bg-yellow-500 text-white';
      case 'silver': return 'bg-gray-400 text-white';
      case 'bronze': return 'bg-amber-600 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Clients</h1>
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
          <option value="name">Nom</option>
          <option value="id">ID</option>
          <option value="sport">Sport</option>
          <option value="membership">Abonnement</option>
        </select>
        <button className="p-2 border rounded">
          <Search className="h-5 w-5" />
        </button>
        <button className="p-2 border rounded">
          <Filter className="h-5 w-5" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Nom</th>
              <th className="py-3 px-6 text-left">Sport</th>
              <th className="py-3 px-6 text-left">Abonnement</th>
              <th className="py-3 px-6 text-left">Dernière Visite</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredClients.map((client) => (
              <tr key={client.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{client.id}</td>
                <td className="py-3 px-6 text-left">{client.name}</td>
                <td className="py-3 px-6 text-left">{client.sport}</td>
                <td className="py-3 px-6 text-left">
                  <span className={`py-1 px-3 rounded-full text-xs ${getMembershipColor(client.membership)}`}>
                    {client.membership}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">{client.lastVisit}</td>
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => handleViewDetails(client)}
                    className="mr-2 text-blue-600 hover:text-blue-900"
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

