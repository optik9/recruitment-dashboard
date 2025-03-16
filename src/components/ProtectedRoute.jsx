import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { auth } from '../firebase/config';

const ProtectedRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/login', { replace: true });
      } else if (!user.emailVerified) {
        navigate('/verify-email', { replace: true });
      }
    });

    return unsubscribe;
  }, [navigate]);

  return <Outlet />;
};

export default ProtectedRoute;