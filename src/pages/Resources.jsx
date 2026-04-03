import { useState, useEffect } from 'react';
import { resourceAPI } from '../services/api';
import { toast } from 'react-toastify';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    electricityUsage: '',
    waterConsumption: '',
    wasteGenerated: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data } = await resourceAPI.getAll();
      setResources(data);
    } catch (error) {
      toast.error('Failed to fetch resources');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await resourceAPI.update(editId, formData);
        toast.success('Resource updated successfully');
        setEditId(null);
      } else {
        await resourceAPI.create(formData);
        toast.success('Resource added successfully');
      }
      setFormData({
        electricityUsage: '',
        waterConsumption: '',
        wasteGenerated: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      });
      fetchResources();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resource) => {
    setFormData({
      electricityUsage: resource.electricityUsage,
      waterConsumption: resource.waterConsumption,
      wasteGenerated: resource.wasteGenerated,
      month: resource.month,
      year: resource.year
    });
    setEditId(resource._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await resourceAPI.delete(id);
      toast.success('Resource deleted');
      fetchResources();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Resource Management</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">{editId ? 'Edit' : 'Add'} Resource Entry</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Electricity (kWh)</label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                value={formData.electricityUsage}
                onChange={(e) => setFormData({ ...formData, electricityUsage: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Water (Liters)</label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                value={formData.waterConsumption}
                onChange={(e) => setFormData({ ...formData, waterConsumption: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Waste (kg)</label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                value={formData.wasteGenerated}
                onChange={(e) => setFormData({ ...formData, wasteGenerated: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input
                type="number"
                required
                min="2020"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : editId ? 'Update' : 'Add'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setFormData({
                      electricityUsage: '',
                      waterConsumption: '',
                      wasteGenerated: '',
                      month: new Date().getMonth() + 1,
                      year: new Date().getFullYear()
                    });
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Electricity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Water</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waste</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resources.map((resource) => (
                <tr key={resource._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{resource.month}/{resource.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{resource.electricityUsage} kWh</td>
                  <td className="px-6 py-4 whitespace-nowrap">{resource.waterConsumption} L</td>
                  <td className="px-6 py-4 whitespace-nowrap">{resource.wasteGenerated} kg</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleEdit(resource)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(resource._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Resources;
