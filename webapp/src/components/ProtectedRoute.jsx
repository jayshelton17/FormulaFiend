import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  // If user is not logged in, send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but doesn't have the right role, send to unauthorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If all checks pass, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;