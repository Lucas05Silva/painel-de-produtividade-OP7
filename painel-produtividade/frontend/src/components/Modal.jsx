import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`bg-card-dark rounded-lg shadow-xl ${sizes[size]} w-full mx-4 animate-fadeIn`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-light">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
