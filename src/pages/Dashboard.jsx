import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { resourceAPI } from '../services/api';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resourcesRes, analyticsRes] = await Promise.all([
        resourceAPI.getAll(),
        resourceAPI.getAnalytics()
      ]);
      setResources(resourcesRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = () => {
    if (!analytics) return [];
    const suggestions = [];
    
    if (analytics.avgElectricity > 500) {
      suggestions.push('⚡ High electricity usage detected. Consider using energy-efficient appliances.');
    }
    if (analytics.avgWater > 300) {
      suggestions.push('💧 Water consumption is above average. Install water-saving fixtures.');
    }
    if (analytics.avgWaste > 50) {
      suggestions.push('♻️ Waste generation is high. Implement recycling programs.');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('✅ Great job! Your resource usage is within sustainable limits.');
    }
    
    return suggestions;
  };

  const chartData = {
    labels: resources.slice(0, 6).map(r => `${r.month}/${r.year}`),
    datasets: [
      {
        label: 'Electricity (kWh)',
        data: resources.slice(0, 6).map(r => r.electricityUsage),
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
      },
      {
        label: 'Water (L)',
        data: resources.slice(0, 6).map(r => r.waterConsumption),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Waste (kg)',
        data: resources.slice(0, 6).map(r => r.wasteGenerated),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      }
    ]
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
          <p className="text-gray-600">Role: {user?.role}</p>
        </div>

        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">⚡ Avg Electricity</h3>
              <p className="text-3xl font-bold text-yellow-600">{analytics.avgElectricity?.toFixed(1)} kWh</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">💧 Avg Water</h3>
              <p className="text-3xl font-bold text-blue-600">{analytics.avgWater?.toFixed(1)} L</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">♻️ Avg Waste</h3>
              <p className="text-3xl font-bold text-red-600">{analytics.avgWaste?.toFixed(1)} kg</p>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Resource Usage Trends</h2>
          <Line data={chartData} />
        </div>

        <div className="bg-primary-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-primary-800 mb-4">🌱 Sustainability Suggestions</h2>
          <ul className="space-y-2">
            {getSuggestions().map((suggestion, idx) => (
              <li key={idx} className="text-gray-700">{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
