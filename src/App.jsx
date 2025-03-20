import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './page/CRUD/Login';
import Register from './page/CRUD/Register';
import './App.css';
import Homepage from './page/homepage';
import Flood_page from './page/flood_page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<Homepage />} />
        {/* <Route path="/traffic" element={<Traffic />} /> */}
        <Route path="/flood_page" element={<Flood_page />} />
      </Routes>
    </Router>
  );
}

export default App;