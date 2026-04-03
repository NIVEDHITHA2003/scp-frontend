import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { toast } from 'react-toastify';
import StatCard from '../components/StatCard';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [goalForm, setGoalForm] = useState({ targetType: 'energy', targetValue: '', description: '' });

  useEffect(() => {
    fetchDashboard();
    fetchUsers();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get('/api/dashboard/admin');
      setDashboardData(data);
    } catch (error) {
      console.error('Admin dashboard error:', error);
      toast.error('Failed to load dashboard');
      setDashboardData({ summary: {}, usersByRole: [], overallStats: {}, goalProgress: [], recentActivity: [] });
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`/api/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
      fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/goals', goalForm);
      toast.success('Goal created');
      setGoalForm({ targetType: 'energy', targetValue: '', description: '' });
      fetchDashboard();
    } catch (error) {
      toast.error('Failed to create goal');
    }
  };

  const userRoleChart = {
    labels: dashboardData?.usersByRole.map(u => u._id) || [],
    datasets: [{
      label: 'Users by Role',
      data: dashboardData?.usersByRole.map(u => u.count) || [],
      backgroundColor: ['#ef4444', '#3b82f6', '#22c55e']
    }]
  };

  if (!dashboardData) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Full system control and management</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon="👥" title="Total Users" value={dashboardData.summary.totalUsers} unit="" color="primary" />
          <StatCard icon="📊" title="Total Records" value={dashboardData.summary.totalRecords} unit="" color="blue" />
          <StatCard icon="🎯" title="Active Goals" value={dashboardData.summary.totalGoals} unit="" color="yellow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Users by Role</h2>
            <Bar data={userRoleChart} options={{ responsive: true }} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Overall Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                <span className="font-medium">Total Electricity</span>
                <span className="text-xl font-bold text-yellow-600">{dashboardData.overallStats.totalElectricity?.toFixed(1) || 0} kWh</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="font-medium">Total Water</span>
                <span className="text-xl font-bold text-blue-600">{dashboardData.overallStats.totalWater?.toFixed(1) || 0} L</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                <span className="font-medium">Total Waste</span>
                <span className="text-xl font-bold text-red-600">{dashboardData.overallStats.totalWaste?.toFixed(1) || 0} kg</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">User Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map(u => (
                  <tr key={u._id}>
                    <td className="px-6 py-4">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${u.role === 'Admin' ? 'bg-red-100 text-red-800' : u.role === 'Faculty' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDeleteUser(u._id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Set Sustainability Goals</h2>
          <form onSubmit={handleGoalSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select className="px-4 py-2 border rounded-lg" value={goalForm.targetType} onChange={(e) => setGoalForm({ ...goalForm, targetType: e.target.value })}>
              <option value="energy">Energy</option>
              <option value="water">Water</option>
              <option value="waste">Waste</option>
            </select>
            <input type="number" placeholder="Target Value" required className="px-4 py-2 border rounded-lg" value={goalForm.targetValue} onChange={(e) => setGoalForm({ ...goalForm, targetValue: e.target.value })} />
            <input type="text" placeholder="Description" required className="px-4 py-2 border rounded-lg" value={goalForm.description} onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })} />
            <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">Add Goal</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Goal Progress</h2>
          {dashboardData.goalProgress?.map((goal, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="font-medium">{goal.description}</span>
                <span className="text-sm text-gray-600">{goal.percentage?.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-primary-600 h-4 rounded-full" style={{ width: `${Math.min(goal.percentage, 100)}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-2">
            {dashboardData.recentActivity?.slice(0, 5).map((activity, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{activity.userId?.name}</p>
                  <p className="text-sm text-gray-600">{activity.userId?.role} - {activity.month}/{activity.year}</p>
                </div>
                <div className="text-right text-sm">
                  <p>⚡ {activity.electricityUsage} kWh</p>
                  <p>💧 {activity.waterConsumption} L</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
