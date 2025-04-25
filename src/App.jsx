import HomePage from './pages/HomePage';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ComplaintFormPage from './pages/ComplaintFormPage';
import ComplaintDetailPage from './pages/ComplaintDetailPage';
import ProfilePage from './pages/ProfilePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/submit-complaint" element={<ComplaintFormPage />} />
        <Route path="/complaint/:id" element={<ComplaintDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
