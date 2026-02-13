export default function Logo({ size = 'md', showText = false }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  const containerSize = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-2">
      {/* Logo Image - Imagem PNG original */}
      <img 
        src="/assets/logo-op7.png" 
        alt="OP7 Franchising" 
        className={`${containerSize} flex-shrink-0 object-contain`}
      />
    </div>
  );
}
