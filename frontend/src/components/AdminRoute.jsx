import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

export function AdminRoute({ children }) {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}
