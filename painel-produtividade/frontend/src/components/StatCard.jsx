import React from 'react';

export function StatCard({ icon, title, label, value, subtitle, color = 'primary' }) {
  const colors = {
    primary: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-amber-500',
    danger: 'text-red-500'
  };

  const labelText = label || title;

  const renderIcon = () => {
    if (!icon) return null;
    // If a React element was passed (e.g. <BarChart3 />), render it directly
    if (React.isValidElement(icon)) return icon;
    // Otherwise assume it's a component and render with props
    const IconComponent = icon;
    return <IconComponent size={40} className={`${colors[color]} opacity-40`} />;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{labelText}</p>
          <h3 className="text-3xl font-bold text-black">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {renderIcon()}
      </div>
    </div>
  );
}

export default StatCard;
