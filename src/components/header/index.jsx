import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUser, FaBell, FaClipboardList, FaChartLine } from "react-icons/fa";
import Inscription from "../inscription/inscit";
import List from "../list/list";
import Notification from "../Notification/notification";

const Header = () => {
    const [activePage, setActivePage] = useState("Accueil"); // Gérer la page active
    const location = useLocation();

    const menuItems = [
        { key: "Accueil", label: "Accueil", icon: <FaHome /> },
        { key: "Dashboard", label: "Dashboard", icon: <FaChartLine /> },
        { key: "Inscription", label: "Inscription", icon: <FaUser /> },
        { key: "Liste de clients", label: "Liste de clients", icon: <FaClipboardList /> },
        { key: "Notification", label: "Notification", icon: <FaBell /> },
    ];

    // Rendu dynamique basé sur la page active
    const renderContent = () => {
        switch (activePage) {
            case "Inscription":
                return <Inscription />;
            case "Liste de clients":
                return <List />;
            case "Notification":
                return <Notification />;
            default:
                return <h1 className="text-center text-2xl font-bold mt-10">Bienvenue dans GYM App!</h1>;
        }
    };

    return (
        <div className="flex h-screen">
            {/* Barre latérale */}
            <div
                className={`bg-blue-600 text-white flex flex-col p-4 transition-all duration-300 ${
                    true ? "w-64" : "w-20"
                }`}
            >
                {/* En-tête de la barre latérale */}
                <div className="text-2xl font-bold text-center mb-6">GYM App</div>

                {/* Menu de la barre latérale */}
                <nav className="flex flex-col space-y-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActivePage(item.key)}
                            className={`flex items-center space-x-3 p-2 rounded-lg transition ${
                                activePage === item.key
                                    ? "bg-white text-blue-600"
                                    : "hover:bg-blue-50"
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 flex flex-col bg-gray-100">
                {/* En-tête */}
                <header className="bg-white shadow-md p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Tableau de Bord</h1>
                    <div className="flex items-center space-x-4">
                        <span>Bienvenue, Utilisateur!</span>
                    </div>
                </header>
                <main className="p-4 flex-1">{renderContent()}</main>
            </div>
        </div>
    );
};

export default Header;
