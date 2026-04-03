const StatCard = ({ icon, title, value, unit, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-100 text-primary-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    blue: 'bg-blue-100 text-blue-700',
    red: 'bg-red-100 text-red-700'
  };

  return (
    <div className={`${colors[color]} p-6 rounded-lg shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2">
            {value?.toFixed(1) || 0} <span className="text-lg">{unit}</span>
          </p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
