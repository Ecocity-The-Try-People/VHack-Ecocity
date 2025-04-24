import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './page/CRUD/Login';
import Register from './page/CRUD/Register';
import './App.css';
import Homepage from './page/homepage';
import Flood_page from './page/flood_page';
import Traffic_page from './page/traffic_page';
import Smart_waste_management_page from './page/smart_waste_management_page';
import PublicAdminModule from '@/page/PublicAdmin';
import AuthGuard from './hooks/authGuard';
import RoleGuard from './hooks/RoleGuard'; 
import NotFound from './hooks/NotFound';


function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark')

    console.log('Dark mode enabled:',
      document.documentElement.classList.contains('dark'))
  }, [])

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes (require authentication) */}
        <Route path="/homepage" element={
          <AuthGuard>
            <Homepage />
          </AuthGuard>
        } />
        
        <Route path="/traffic" element={
          <AuthGuard>
            <Traffic_page />
          </AuthGuard>
        } />
        
        <Route path="/flood_page" element={
          <AuthGuard>
            <Flood_page />
          </AuthGuard>
        } />
        
        <Route path="/smart_waste_management_page" element={
          <AuthGuard>
            <Smart_waste_management_page />
          </AuthGuard>
        } />
        
        {/* Admin-only route (example with role protection) */}
        <Route path="/admin_page" element={
          <AuthGuard>
            <RoleGuard allowedRoles={['Admin']}>
              <PublicAdminModule />
            </RoleGuard>
          </AuthGuard>
        } />
        
        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;