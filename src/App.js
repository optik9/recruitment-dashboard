import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PositionForm from './components/PositionForm';
import CandidateForm from './components/CandidateForm';
import PositionList from './components/PositionList';
import CandidateList from './components/CandidateList';
import PositionDetails from './components/PositionDetails';
import CandidateDetails from './components/CandidateDetails';
import RecruitmentDashboard from './components/RecruitmentDashboard';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';

import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
        <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Proteger rutas existentes */}
          <Route path="/" element={
            <PrivateRoute>
              <PositionList /> 
            </PrivateRoute>
              } />

          <Route path="/new-position" element={
            <PrivateRoute>
              <PositionForm />
            </PrivateRoute>
            } />
          <Route path="/new-candidate" element={
            <PrivateRoute>
              <CandidateForm />
              </PrivateRoute>
            } />
          <Route path="/list-candidate" element={
            <PrivateRoute>
            <CandidateList />
            </PrivateRoute>} />
          <Route path="/position/:id" element={
            <PrivateRoute>
            <PositionDetails />
            </PrivateRoute>} />
          <Route path="/candidate/:id" element={
            <PrivateRoute>
            <CandidateDetails />
            </PrivateRoute>} />
          <Route path="/dashboard" element={
            <PrivateRoute>
            <RecruitmentDashboard />
            </PrivateRoute>
          } />

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;