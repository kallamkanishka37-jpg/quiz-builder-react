import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Role-based access: not signed in -> login page; wrong role -> own dashboard
export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />;
  return children;
}
