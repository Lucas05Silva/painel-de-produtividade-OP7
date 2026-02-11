export function Card({ children, className = '', hover = true }) {
  return (
    <div className={`
      bg-card-dark rounded-lg p-6 shadow-lg
      ${hover ? 'hover:shadow-xl' : ''}
      transition-shadow
      ${className}
    `}>
      {children}
    </div>
  );
}

export default Card;
