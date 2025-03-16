import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PositionForm from './components/PositionForm';
import CandidateForm from './components/CandidateForm';
import PositionList from './components/PositionList';
import CandidateList from './components/CandidateList';
import PositionDetails from './components/PositionDetails';
import CandidateDetails from './components/CandidateDetails';
import RecruitmentDashboard from './components/RecruitmentDashboard';





import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<PositionList />} />
          <Route path="/new-position" element={<PositionForm />} />
          <Route path="/new-candidate" element={<CandidateForm />} />
          <Route path="/list-candidate" element={<CandidateList />} />
          <Route path="/position/:id" element={<PositionDetails />} />
          <Route path="/candidate/:id" element={<CandidateDetails />} />
          <Route path="/dashboard" element={<RecruitmentDashboard />} />

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;