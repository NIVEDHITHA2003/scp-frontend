import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Line, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { toast } from 'react-toastify';
import StatCard from '../components/StatCard';

const FacultyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [filters, setFilters] = useState({ month: '', year: '' });

  useEffect(() => {
    fetchDashboard();
  }, [filters]);

  const fetchDashboard = async () => {
    try {
      const params = {};
      if (filters.month) params.month = filters.month;
      if (filters.year) params.year = filters.year;
      const { data } = await axios.get('/api/dashboard/faculty', { params });
      setDashboardData(data);
    } catch (error) {
      console.error('Faculty dashboard error:', error);
      toast.error('Failed to load dashboard');
      setDashboardData({ campusStats: {}, monthlyTrends: [], resourceDistribution: {} });
    }
  };

  const lineChartData = {
    labels: dashboardData?.monthlyTrends.map(t => `${t._id.month}/${t._id.year}`) || [],
    datasets: [
      { label: 'Electricity (kWh)', data: dashboardData?.monthlyTrends.map(t => t.electricity) || [], borderColor: '#eab308', tension: 0.4 },
      { label: 'Water (L)', data: dashboardData?.monthlyTrends.map(t => t.water) || [], borderColor: '#3b82f6', tension: 0.4 },
      { label: 'Waste (kg)', data: dashboardData?.monthlyTrends.map(t => t.waste) || [], borderColor: '#ef4444', tension: 0.4 }
    ]
  };

  const pieChartData = {
    labels: ['Electricity', 'Water', 'Waste'],
    datasets: [{
      data: [
        dashboardData?.resourceDistribution.electricity || 0,
        dashboardData?.resourceDistribution.water || 0,
        dashboardData?.resourceDistribution.waste || 0
      ],
      backgroundColor: ['#eab308', '#3b82f6', '#ef4444']
    }]
  };

  if (!dashboardData) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Faculty Dashboard</h1>
        <p className="text-gray-600 mb-8">Campus-wide sustainability overview</p>

        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <h3 className="font-semibold mb-3">Filter Data</h3>
          <div className="flex gap-4">
            <select className="px-4 py-2 border rounded-lg" value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })}>
              <option value="">All Months</option>
              {[...Array(12)].map((_, i) => <option key={i} value={i + 1}>Month {i + 1}</option>)}
            </select>
            <input type="number" placeholder="Year" className="px-4 py-2 border rounded-lg" value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} />
            <button onClick={() => setFilters({ month: '', year: '' })} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Clear</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon="⚡" title="Campus Electricity" value={dashboardData.campusStats.totalElectricity} unit="kWh" color="yellow" />
          <StatCard icon="💧" title="Campus Water" value={dashboardData.campusStats.totalWater} unit="L" color="blue" />
          <StatCard icon="♻️" title="Campus Waste" value={dashboardData.campusStats.totalWaste} unit="kg" color="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Monthly Comparison</h2>
            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Resource Distribution</h2>
            <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Campus Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Avg Electricity</p>
              <p className="text-2xl font-bold text-yellow-600">{dashboardData.campusStats.avgElectricity?.toFixed(1) || 0} kWh</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Avg Water</p>
              <p className="text-2xl font-bold text-blue-600">{dashboardData.campusStats.avgWater?.toFixed(1) || 0} L</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Avg Waste</p>
              <p className="text-2xl font-bold text-red-600">{dashboardData.campusStats.avgWaste?.toFixed(1) || 0} kg</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-primary-600">{dashboardData.campusStats.recordCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-blue-800 mb-4">📊 Sustainability Insights</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Campus average electricity usage: {dashboardData.campusStats.avgElectricity?.toFixed(1) || 0} kWh per entry</li>
            <li>• Campus average water consumption: {dashboardData.campusStats.avgWater?.toFixed(1) || 0} L per entry</li>
            <li>• Campus average waste generation: {dashboardData.campusStats.avgWaste?.toFixed(1) || 0} kg per entry</li>
            <li>• Total data entries: {dashboardData.campusStats.recordCount || 0}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
