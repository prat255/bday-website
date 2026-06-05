import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import JourneyPage from './pages/JourneyPage';
import MessagePage from './pages/MessagePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { JourneyRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/journey"
        element={
          <JourneyRoute>
            <JourneyPage />
          </JourneyRoute>
        }
      />
      <Route
        path="/message"
        element={
          <JourneyRoute>
            <MessagePage />
          </JourneyRoute>
        }
      />
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
