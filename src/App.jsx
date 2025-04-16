import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './page/CRUD/Login';
import Register from './page/CRUD/Register';
import './App.css';
import Homepage from './page/homepage';
import Flood_page from './page/flood_page';
import Traffic_page from './page/traffic_page';
import Smart_waste_management_page from './page/smart_waste_management_page';
import PublicAdminModule from '@/page/PublicAdmin'
import { db } from '../config/firebase';
import { getDocs,collection } from 'firebase/firestore';

function App() {
  const[movieList, setMovieList] = useState([]);

  const userCollection = collection(db, "smart_city");
  
  useEffect(() => {
    const List = async () => { 
      try{
        const data = await getDocs(userCollection);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id, 
        }))
        // console.log(filteredData);
      }catch (err) {
        console.error(err);
      }
    }
    List();
    const getList = async () => {
      const data = await getDocs(collection);
    }
    document.documentElement.classList.add('dark')

    console.log('Dark mode enabled:',
      document.documentElement.classList.contains('dark'))
  }, []);

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