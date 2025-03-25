import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from "./components/header/MainLayout";
import Inscription from "./components/inscription/inscit";
import List from "./components/list/list";
import Notification from "./components/notification/notification"
import App from "./App";
import SportMembers from "./components/sport_list/sport_list";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<App />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/List_de_client" element={<List />} />
        <Route path="/SportMembers" element={<SportMembers />} />
        <Route path="/Notification" element={<Notification />} />
      </Route>
    </Routes>
  </BrowserRouter>
);