import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import './App.css';
import Flood_homepage from './assets/weather_detail'
import Weather_box from './weather_box'
import Notification from './notification';
import Map from './map';
import Homepage from './homepage';
import Flood_page from './flood_page';

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