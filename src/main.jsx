import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from "./components/header/index";
import Inscription from "./components/inscription/inscit";
import List from "./components/list/list";
import Notification from "./components/Notification/notification"
import App from "./App";
import Dashbord from "./page/Dashbord/index";
import { TauriEvent } from "@tauri-apps/api/event";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  <BrowserRouter>
    <Header> </Header>
    <Routes>

      <Route path="/" element={<App />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route path="/List_de_client" element={<List />} />
      <Route path="/Notification" element={<Notification />} />
    </Routes>
  </BrowserRouter>
);
