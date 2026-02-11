export function StatCard({ icon: Icon, label, value, subtitle, color = 'primary' }) {
  const colors = {
    primary: 'text-primary',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400'
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-light">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <Icon size={40} className={`${colors[color]} opacity-50`} />
        )}
      </div>
    </div>
  );
}

export default StatCard;
