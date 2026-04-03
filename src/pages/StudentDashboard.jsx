import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { toast } from 'react-toastify';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [formData, setFormData] = useState({
    electricityUsage: '',
    waterConsumption: '',
    wasteGenerated: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get('/api/dashboard/student');
      setDashboardData(data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to load dashboard');
      // Set empty data to prevent infinite loading
      setDashboardData({ stats: {}, resources: [], suggestions: [] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/resources/${editId}`, formData);
        toast.success('Updated successfully');
        setEditId(null);
      } else {
        await axios.post('/api/resources', formData);
        toast.success('Added successfully');
      }
      setFormData({ electricityUsage: '', waterConsumption: '', wasteGenerated: '', month: new Date().getMonth() + 1, year: new Date().getFullYear() });
      fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (item) => {
    setFormData({ electricityUsage: item.electricityUsage, waterConsumption: item.waterConsumption, wasteGenerated: item.wasteGenerated, month: item.month, year: item.year });
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await axios.delete(`/api/resources/${id}`);
      toast.success('Deleted successfully');
      fetchDashboard();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const chartData = {
    labels: dashboardData?.resources.map(r => `${r.month}/${r.year}`) || [],
    datasets: [
      { label: 'Electricity (kWh)', data: dashboardData?.resources.map(r => r.electricityUsage) || [], borderColor: '#eab308', backgroundColor: 'rgba(234, 179, 8, 0.1)' },
      { label: 'Water (L)', data: dashboardData?.resources.map(r => r.waterConsumption) || [], borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' },
      { label: 'Waste (kg)', data: dashboardData?.resources.map(r => r.wasteGenerated) || [], borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }
    ]
  };

  if (!dashboardData) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mb-8">Track your sustainability impact</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon="⚡" title="Total Electricity" value={dashboardData.stats.totalElectricity} unit="kWh" color="yellow" />
          <StatCard icon="💧" title="Total Water" value={dashboardData.stats.totalWater} unit="L" color="blue" />
          <StatCard icon="♻️" title="Total Waste" value={dashboardData.stats.totalWaste} unit="kg" color="red" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">{editId ? 'Edit' : 'Add'} Resource Entry</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="number" placeholder="Electricity (kWh)" required min="0" className="px-4 py-2 border rounded-lg" value={formData.electricityUsage} onChange={(e) => setFormData({ ...formData, electricityUsage: e.target.value })} />
            <input type="number" placeholder="Water (L)" required min="0" className="px-4 py-2 border rounded-lg" value={formData.waterConsumption} onChange={(e) => setFormData({ ...formData, waterConsumption: e.target.value })} />
            <input type="number" placeholder="Waste (kg)" required min="0" className="px-4 py-2 border rounded-lg" value={formData.wasteGenerated} onChange={(e) => setFormData({ ...formData, wasteGenerated: e.target.value })} />
            <select className="px-4 py-2 border rounded-lg" value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })}>
              {[...Array(12)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
            </select>
            <input type="number" min="2020" className="px-4 py-2 border rounded-lg" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
            <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">{editId ? 'Update' : 'Add'}</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">My Records</h2>
          <DataTable data={dashboardData.resources} onEdit={handleEdit} onDelete={handleDelete} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Monthly Trends</h2>
          <Line data={chartData} />
        </div>

        <div className="bg-primary-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-primary-800 mb-4">🌱 Sustainability Suggestions</h2>
          {dashboardData.suggestions.length > 0 ? (
            <ul className="space-y-2">
              {dashboardData.suggestions.map((s, i) => <li key={i} className="text-gray-700">• {s.message}</li>)}
            </ul>
          ) : (
            <p className="text-gray-700">✅ Great job! Your resource usage is within sustainable limits.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
