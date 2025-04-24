// components/RoleGuard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

/**
 * Role Guard Component
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to protect
 * @param {string[]} props.allowedRoles - Array of allowed roles (e.g., ['admin', 'moderator'])
 * @param {string} [props.redirectPath='/'] - Path to redirect if role check fails
 */
const RoleGuard = ({ children, allowedRoles, redirectPath = '/' }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        // Get user document from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userRole = userData.role || 'user'; // Default role if not specified
          
          // Check if user has any of the allowed roles
          if (allowedRoles.includes(userRole)) {
            setIsAuthorized(true);
          } else {
            navigate(redirectPath);
          }
        } else {
          navigate(redirectPath);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        navigate(redirectPath);
      }
    };

    checkRole();
  }, [navigate, allowedRoles, redirectPath]);

  return isAuthorized ? children : null;
};

export default RoleGuard;