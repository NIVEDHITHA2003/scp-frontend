import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DashboardRedirect = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect based on role
  const roleRoutes = {
    'Student': '/dashboard/student',
    'Faculty': '/dashboard/faculty',
    'Admin': '/dashboard/admin'
  };

  return <Navigate to={roleRoutes[user.role] || '/dashboard/student'} replace />;
};

export default DashboardRedirect;
