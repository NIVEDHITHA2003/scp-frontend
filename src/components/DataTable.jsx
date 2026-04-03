const DataTable = ({ data, onEdit, onDelete, showActions = true }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-primary-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Period</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Electricity (kWh)</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Water (L)</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Waste (kg)</th>
            {showActions && <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{item.month}/{item.year}</td>
              <td className="px-6 py-4">{item.electricityUsage}</td>
              <td className="px-6 py-4">{item.waterConsumption}</td>
              <td className="px-6 py-4">{item.wasteGenerated}</td>
              {showActions && (
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => onEdit(item)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                  <button onClick={() => onDelete(item._id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
