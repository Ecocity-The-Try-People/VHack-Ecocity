import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './page/CRUD/Login';
import Register from './page/CRUD/Register';
import './App.css';
import Homepage from './page/homepage';
import Flood_page from './page/flood_page';
import Traffic_page from './page/traffic_page';
import Smart_waste_management_page from './page/smart_waste_management_page';
import PublicAdminModule from '@/pages/PublicAdmin'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/traffic" element={<Traffic_page />} />
        <Route path="/flood_page" element={<Flood_page />} />
        <Route path="/smart_waste_management_page" element={<Smart_waste_management_page />} />
        <Route path="/admin_page" element={<PublicAdminModule />} />
      </Routes>
    </Router>
  );

}

export default App;