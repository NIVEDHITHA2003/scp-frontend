// Simple test to verify Chart.js is working
import { Line } from 'react-chartjs-2';

const TestChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Test Data',
      data: [10, 20, 30],
      borderColor: '#22c55e'
    }]
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chart.js Test</h1>
      <div className="bg-white p-4 rounded shadow">
        <Line data={data} />
      </div>
      <p className="mt-4 text-green-600">✅ If you see a chart above, Chart.js is working!</p>
    </div>
  );
};

export default TestChart;
