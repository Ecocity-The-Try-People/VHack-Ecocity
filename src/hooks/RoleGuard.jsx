// components/RoleGuard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const RoleGuard = ({ children, allowedRoles, redirectPath = '/' }) => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userRole = userData.role || 'user';
          
          if (allowedRoles.includes(userRole)) {
            setAuthChecked(true);
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
    });

    return () => unsubscribe();
  }, [navigate, allowedRoles, redirectPath]);

  return authChecked ? children : null;
};

export default RoleGuard;