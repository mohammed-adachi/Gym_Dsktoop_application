import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Bell, Calendar, DollarSign, Printer, X } from 'lucide-react';

const Notification = () => {
  const [expiredClients, setExpiredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const fetchExpiredClients = async () => {
      const dummyExpiredClients = [
        { id: 1, name: 'Alice Dupont', endDate: '2023-05-01', email: 'alice@example.com', phone: '0123456789', membership: 'Gold' },
        { id: 2, name: 'Bob Martin', endDate: '2023-05-10', email: 'bob@example.com', phone: '0987654321', membership: 'Silver' },
        { id: 3, name: 'Charlie Leclerc', endDate: '2023-05-15', email: 'charlie@example.com', phone: '0123498765', membership: 'Bronze' },
      ];
      setExpiredClients(dummyExpiredClients);
    };

    fetchExpiredClients();
  }, []);

  const handleUpdatePayment = async (clientId, newStartDate, newEndDate, amount) => {
    console.log(`Mise à jour du paiement pour le client ${clientId}`);
    console.log(`Nouvelle date de début: ${newStartDate}`);
    console.log(`Nouvelle date de fin: ${newEndDate}`);
    console.log(`Montant payé: ${amount}`);

    setExpiredClients(prevClients =>
      prevClients.filter(client => client.id !== clientId)
    );
    setSelectedClient(null);
  };

  const handlePrintReceipt = (client, startDate, endDate, amount) => {
    const receipt = `
      Reçu de Paiement
      -----------------
      Salle de Sport XYZ
      123 Rue du Sport, 75000 Paris
      Tél: 01 23 45 67 89
      -----------------
      Client: ${client.name}
      Email: ${client.email}
      Téléphone: ${client.phone}
      Type d'abonnement: ${client.membership}
      -----------------
      Date de paiement: ${format(new Date(), 'dd/MM/yyyy')}
      Période d'abonnement:
      Du: ${format(new Date(startDate), 'dd/MM/yyyy')}
      Au: ${format(new Date(endDate), 'dd/MM/yyyy')}
      -----------------
      Montant payé: ${amount} €
      -----------------
      Merci de votre paiement!
      À bientôt dans notre salle de sport.
    `;
    const receiptWindow = window.open('', '_blank');
    receiptWindow.document.write('<pre>' + receipt + '</pre>');
    receiptWindow.document.close();
    receiptWindow.print();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <Bell className="mr-2" /> Notifications de Paiement Expiré
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Clients avec paiement expiré</h2>
          <ul className="space-y-3">
            {expiredClients.map(client => (
              <motion.li 
                key={client.id} 
                className="flex justify-between items-center bg-red-50 p-3 rounded-lg border border-red-200"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div>
                  <p className="font-medium text-gray-800">{client.name}</p>
                  <p className="text-sm text-gray-600">Expiré le {format(new Date(client.endDate), 'dd/MM/yyyy')}</p>
                </div>
                <button
                  onClick={() => setSelectedClient(client)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 ease-in-out flex items-center"
                >
                  <Calendar className="mr-2" size={16} />
                  Mettre à jour
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          {selectedClient ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Mettre à jour le paiement</h2>
                <button onClick={() => setSelectedClient(null)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="mb-4">
                <p className="font-medium text-gray-800">{selectedClient.name}</p>
                <p className="text-sm text-gray-600">{selectedClient.email}</p>
                <p className="text-sm text-gray-600">{selectedClient.phone}</p>
                <p className="text-sm text-gray-600">Abonnement: {selectedClient.membership}</p>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const startDate = e.target.startDate.value;
                const endDate = e.target.endDate.value;
                const amount = e.target.amount.value;
                handleUpdatePayment(selectedClient.id, startDate, endDate, amount);
                handlePrintReceipt(selectedClient, startDate, endDate, amount);
              }} className="space-y-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Nouvelle date de début:</label>
                  <input type="date" id="startDate" name="startDate" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Nouvelle date de fin:</label>
                  <input type="date" id="endDate" name="endDate" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                </div>
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Montant payé (€):</label>
                  <input type="number" id="amount" name="amount" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" step="0.01" min="0" />
                </div>
                <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300 ease-in-out flex items-center justify-center">
                  <DollarSign className="mr-2" size={16} />
                  Mettre à jour et Imprimer Reçu
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">Sélectionnez un client pour mettre à jour son paiement</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Notification;

