// Simple test component to verify routing works
// Can be used temporarily to test /dashboard route

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TestDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Dashboard Route Working!
        </h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded">
            <p className="font-semibold">Current User:</p>
            <p>{user?.name || 'Not logged in'}</p>
          </div>

          <div className="p-4 bg-green-50 rounded">
            <p className="font-semibold">Role:</p>
            <p>{user?.role || 'Unknown'}</p>
          </div>

          <div className="p-4 bg-yellow-50 rounded">
            <p className="font-semibold">Current Path:</p>
            <p>{window.location.pathname}</p>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => navigate('/dashboard/student')}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Go to Student Dashboard
            </button>
            
            <button 
              onClick={() => navigate('/dashboard/faculty')}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Go to Faculty Dashboard
            </button>
            
            <button 
              onClick={() => navigate('/dashboard/admin')}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Go to Admin Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;
