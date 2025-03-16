// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/config';

export default function PrivateRoute({ children }) {
  return auth.currentUser ? children : <Navigate to="/login" />;
}