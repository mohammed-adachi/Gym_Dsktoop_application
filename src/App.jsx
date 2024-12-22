// // import { useState } from "react";
// // import reactLogo from "./assets/react.svg";
// // import { invoke } from "@tauri-apps/api/core";

// // function App() {
// //   const [greetMsg, setGreetMsg] = useState("");
// //   const [name, setName] = useState("");

// //   async function greet() {
// //     // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
// //     setGreetMsg(await invoke("greet", { name }));
// //   }

// //   return (
// //     <main className="container">
// //       <h1>Welcome to Tauri + React + Fassi </h1>

// //       <div className="row">
// //         <a href="https://vitejs.dev" target="_blank">
// //           <img src="/vite.svg" className="logo vite" alt="Vite logo" />
// //         </a>
// //         <a href="https://tauri.app" target="_blank">
// //           <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
// //         </a>
// //         <a href="https://reactjs.org" target="_blank">
// //           <img src={reactLogo} className="logo react" alt="React logo" />
// //         </a>
// //       </div>
// //       <p>Click on the Tauri, Vite, and React logos to learn more.</p>

// //       <form
// //         className="row"
// //         onSubmit={(e) => {
// //           e.preventDefault();
// //           greet();
// //         }}
// //       >
// //         <input
// //           id="greet-input"
// //           onChange={(e) => setName(e.currentTarget.value)}
// //           placeholder="Enter a name..."
// //         />
// //         <button type="submit">Greet</button>
// //       </form>
// //       <p>{greetMsg}</p>
// //     </main>
// //   );
// // }
// //import { useState } from "react";
// //import reactLogo from "./assets/react.svg";
// //import { invoke } from "@tauri-apps/api/core";
// import "./App.css"
// import React, { useState } from 'react';
// import { invoke } from '@tauri-apps/api/core';

// const App = () => { };
// /*  const [name, setName] = useState('');
//   const [greeting, setGreeting] = useState('');
//   const [error, setError] = useState('');

//   const greet = async () => {
//     const newUser = {
//       id: "999999",
//       name,
//       date_naissance: "1990-01-01",
//       cin: "12345678",
//       typede_sport: "football",
//       profession: "developer",
//       phone: "12345678",
//       adresse: "12345678",
//       photo: "12345678",
//       date_inscrit: new Date().toISOString().split('T')[0],

//     };
// console.log(newUser);
//     try {
//       const response = await invoke("add_new_user", { user: newUser });
//       setGreeting(response); // Afficher le message de succès.
//       setError(''); // Réinitialiser les erreurs.
//     } catch (err) {
//       console.error("Erreur :", err);
//       setError("Une erreur s'est produite lors de l'ajout de l'utilisateur.");
//       setGreeting(''); // Réinitialiser le message de succès.
//     }
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h1>Tauri + React</h1>
//       <p>Entrez votre nom pour ajouter un utilisateur :</p>

//       <input
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         placeholder="Votre nom"
//         style={{ padding: '10px', fontSize: '16px', width: '300px' }}
//       />

//       <button
//         onClick={greet}
//         style={{
//           marginLeft: '10px',
//           padding: '10px 20px',
//           fontSize: '16px',
//           cursor: 'pointer',
//         }}
//       >
//         Envoyer
//       </button>

//       {greeting && (
//         <h2 style={{ marginTop: '20px', color: 'green' }}>{greeting}</h2>
//       )}

//       {error && (
//         <h2 style={{ marginTop: '20px', color: 'red' }}>{error}</h2>
//       )}
//     </div>
// */ // );//
// //};//


// export default App;
import './App.css';
import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { FaSpinner } from 'react-icons/fa';

const App = () => {
  // const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const fetchedUsers = await invoke('get_all_users');
  //       setUsers(fetchedUsers);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error('Error fetching users:', err);
  //       setError('Failed to fetch users. Please try again later.');
  //       setLoading(false);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <FaSpinner className="animate-spin text-4xl text-blue-500" />
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="text-center text-red-500 p-4">
  //       <p>{error}</p>
  //     </div>
  //   );
  // }

  // return (
  //   <div className="container mx-auto p-4">
  //     <h1 className="text-2xl font-bold mb-4">User List</h1>
  //     <div className="overflow-x-auto">
  //       <table className="min-w-full bg-white">
  //         <thead className="bg-gray-100">
  //           <tr>
  //             <th className="px-4 py-2">ID</th>
  //             <th className="px-4 py-2">Name</th>
  //             <th className="px-4 py-2">Date of Birth</th>
  //             <th className="px-4 py-2">CIN</th>
  //             <th className="px-4 py-2">Profession</th>
  //             <th className="px-4 py-2">Address</th>
  //             <th className="px-4 py-2">Phone</th>
  //             <th className="px-4 py-2">Registration Date</th>
  //             <th className="px-4 py-2">Sport Type</th>
  //             <th className="px-4 py-2">Price</th>
  //             <th className="px-4 py-2">Start Date</th>
  //             <th className="px-4 py-2">End Date</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {users.map((user) => (
  //             <tr key={user.id} className="border-b">
  //               <td className="px-4 py-2">{user.id}</td>
  //               <td className="px-4 py-2">{`${user.first_name} ${user.last_name}`}</td>
  //               <td className="px-4 py-2">{user.date_naissance}</td>
  //               <td className="px-4 py-2">{user.cin}</td>
  //               <td className="px-4 py-2">{user.profession}</td>
  //               <td className="px-4 py-2">{user.adresse}</td>
  //               <td className="px-4 py-2">{user.phone}</td>
  //               <td className="px-4 py-2">{user.registration_date}</td>
  //               <td className="px-4 py-2">{user.sport_type}</td>
  //               <td className="px-4 py-2">{user.price}</td>
  //               <td className="px-4 py-2">{user.start_date}</td>
  //               <td className="px-4 py-2">{user.end_date}</td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   </div>
  // );
};

export default App;

