export function Badge({ children, color = 'primary', size = 'md' }) {
  const colors = {
    primary: 'bg-blue-500/20 text-blue-300',
    success: 'bg-green-500/20 text-green-300',
    warning: 'bg-yellow-500/20 text-yellow-300',
    danger: 'bg-red-500/20 text-red-300',
    purple: 'bg-purple-500/20 text-purple-300'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span className={`rounded-full font-semibold inline-block ${colors[color]} ${sizes[size]}`}>
      {children}
    </span>
  );
}

export default Badge;
