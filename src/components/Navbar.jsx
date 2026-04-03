import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const getDashboardLink = () => {
    const roleRoutes = {
      'Student': '/dashboard/student',
      'Faculty': '/dashboard/faculty',
      'Admin': '/dashboard/admin'
    };
    return roleRoutes[user?.role] || '/dashboard/student';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-primary-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-xl font-bold">
            🌱 Sustainable Campus
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to={getDashboardLink()} className="hover:text-primary-200">Dashboard</Link>
            {user.role === 'Student' && (
              <Link to="/resources" className="hover:text-primary-200">My Resources</Link>
            )}
            {user.role === 'Admin' && (
              <Link to="/admin" className="hover:text-primary-200">User Management</Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-primary-800 px-4 py-2 rounded hover:bg-primary-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
