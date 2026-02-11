export function Alert({ type = 'info', title, message, onClose }) {
  const types = {
    info: 'bg-blue-500/20 border border-blue-500/30 text-blue-300',
    success: 'bg-green-500/20 border border-green-500/30 text-green-300',
    warning: 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-300',
    error: 'bg-red-500/20 border border-red-500/30 text-red-300'
  };

  const icons = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠️',
    error: '✕'
  };

  return (
    <div className={`rounded-lg p-4 flex items-start gap-3 ${types[type]}`}>
      <span className="text-xl mt-0.5">{icons[type]}</span>
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {message && <p className="text-sm opacity-90">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-lg hover:opacity-75 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default Alert;
