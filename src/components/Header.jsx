
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { 
  BriefcaseIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

export default function Header() {
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoadingUser(true);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
      setLoadingUser(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  if (loadingUser) return null;

  return (
    <header className="bg-gradient-to-r from-blue-800 to-indigo-900 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar - Logo y usuario */}
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold text-white">Recruitment</span>
            <span className="text-2xl font-bold text-blue-300">Outcode</span>
          </Link>

          <div className="flex items-center space-x-6">
            {userData ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100/20 text-white font-medium">
                    <span className="text-sm">{userData.firstName[0]}{userData.lastName[0]}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1.5 text-blue-100 hover:text-white transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-1.5 text-blue-100 hover:text-white transition-colors"
              >
                <UserCircleIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Navigation Bar */}
        {userData && (
          <nav className="h-12 border-t border-blue-700/50">
            <div className="flex h-full items-center space-x-8">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-blue-200 hover:text-white py-2 group transition-colors"
              >
                <BriefcaseIcon className="h-5 w-5 group-hover:text-blue-300 transition-colors" />
                <span className="text-sm font-medium">Open Positions</span>
              </Link>
              
              <Link 
                to="/list-candidate" 
                className="flex items-center space-x-2 text-blue-200 hover:text-white py-2 group transition-colors"
              >
                <UserGroupIcon className="h-5 w-5 group-hover:text-blue-300 transition-colors" />
                <span className="text-sm font-medium">Candidates</span>
              </Link>
              
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 text-blue-200 hover:text-white py-2 group transition-colors"
              >
                <ChartBarIcon className="h-5 w-5 group-hover:text-blue-300 transition-colors" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}