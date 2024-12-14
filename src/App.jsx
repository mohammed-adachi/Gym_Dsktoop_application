// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import { invoke } from "@tauri-apps/api/core";

// function App() {
//   const [greetMsg, setGreetMsg] = useState("");
//   const [name, setName] = useState("");

//   async function greet() {
//     // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//     setGreetMsg(await invoke("greet", { name }));
//   }

//   return (
//     <main className="container">
//       <h1>Welcome to Tauri + React + Fassi </h1>

//       <div className="row">
//         <a href="https://vitejs.dev" target="_blank">
//           <img src="/vite.svg" className="logo vite" alt="Vite logo" />
//         </a>
//         <a href="https://tauri.app" target="_blank">
//           <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
//         </a>
//         <a href="https://reactjs.org" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <p>Click on the Tauri, Vite, and React logos to learn more.</p>

//       <form
//         className="row"
//         onSubmit={(e) => {
//           e.preventDefault();
//           greet();
//         }}
//       >
//         <input
//           id="greet-input"
//           onChange={(e) => setName(e.currentTarget.value)}
//           placeholder="Enter a name..."
//         />
//         <button type="submit">Greet</button>
//       </form>
//       <p>{greetMsg}</p>
//     </main>
//   );
// }
//import { useState } from "react";
//import reactLogo from "./assets/react.svg";
//import { invoke } from "@tauri-apps/api/core";
import "./App.css"
import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

const App = () => {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [error, setError] = useState('');

  const greet = async () => {
    const newUser = {
      id: "12345",
      name,
      date_naissance: "1990-01-01",
    };

    try {
      const response = await invoke("add_new_user", { user: newUser });
      setGreeting(response); // Afficher le message de succès.
      setError(''); // Réinitialiser les erreurs.
    } catch (err) {
      console.error("Erreur :", err);
      setError("Une erreur s'est produite lors de l'ajout de l'utilisateur.");
      setGreeting(''); // Réinitialiser le message de succès.
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Tauri + React</h1>
      <p>Entrez votre nom pour ajouter un utilisateur :</p>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Votre nom"
        style={{ padding: '10px', fontSize: '16px', width: '300px' }}
      />

      <button
        onClick={greet}
        style={{
          marginLeft: '10px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Envoyer
      </button>

      {greeting && (
        <h2 style={{ marginTop: '20px', color: 'green' }}>{greeting}</h2>
      )}

      {error && (
        <h2 style={{ marginTop: '20px', color: 'red' }}>{error}</h2>
      )}
    </div>
  );
};

export default App;