import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'Admin') {
    // Redirect non-admin to their role-specific dashboard
    const roleRoutes = {
      'Student': '/dashboard/student',
      'Faculty': '/dashboard/faculty'
    };
    return <Navigate to={roleRoutes[user.role] || '/dashboard/student'} />;
  }

  return children;
};

export default PrivateRoute;
