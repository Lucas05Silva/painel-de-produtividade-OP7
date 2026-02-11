export function ProgressBar({ value, max = 100, color = 'primary', showLabel = true }) {
  const percentage = (value / max) * 100;

  const colors = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  };

  return (
    <div className="w-full">
      <div className="bg-slate-700 rounded-full h-3 overflow-hidden">
        <div
          className={`${colors[color]} h-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-slate-400 mt-2">
          {value} / {max}
        </p>
      )}
    </div>
  );
}

export default ProgressBar;
