// components/AuthGuard.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';

const AuthGuard = ({ children, redirectPath = '/login' }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user?.uid) {
        navigate(redirectPath);
      }
    });

    return () => unsubscribe();
  }, [navigate, redirectPath]);

  return children;
};

export default AuthGuard;