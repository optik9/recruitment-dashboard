
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
//import Header from './components/Header';
import PositionForm from './components/PositionForm';
import CandidateForm from './components/CandidateForm';
import PositionList from './components/PositionList';
import CandidateList from './components/CandidateList';
import PositionDetails from './components/PositionDetails';
import CandidateDetails from './components/CandidateDetails';
import RecruitmentDashboard from './components/RecruitmentDashboard';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <HelmetProvider>
    <Router>
      <Routes>
       
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/list-position" element={
          <ProtectedRoute>
            <PositionList />  
          </ProtectedRoute>} />

          <Route path="/new-position" element={
          <ProtectedRoute>
            <PositionForm />
          </ProtectedRoute>} />

          <Route path="/new-candidate" element={
          <ProtectedRoute>
            <CandidateForm />
          </ProtectedRoute>} />

          <Route path="/list-candidate" element={
          <ProtectedRoute>
            <CandidateList />
          </ProtectedRoute>} />

          <Route path="/position/:id" element={
          <ProtectedRoute>
            <PositionDetails />
          </ProtectedRoute>} />

          <Route path="/candidate/:id" element={
          <ProtectedRoute>
            <CandidateDetails />
          </ProtectedRoute>} />

          <Route path="/dashboard" element={
          <ProtectedRoute>
            <RecruitmentDashboard />
          </ProtectedRoute>} />

       
      </Routes>
    </Router>
    </HelmetProvider>
  );
};

export default App;



     




