import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 bg-card-dark border-b border-slate-700 h-16 flex items-center justify-between px-6 z-30">
      {/* Left - Greeting */}
      <div className="hidden md:block">
        <h2 className="text-light font-semibold">
          Bem-vindo, <span className="text-primary">{user?.name}</span>
        </h2>
        <p className="text-xs text-slate-400">
          {user?.role === 'admin' ? '👨‍💼 Diretor' : '👤 Membro da Equipe'}
        </p>
      </div>

      {/* Right - User Actions */}
      <div className="flex items-center gap-4">
        {/* User Avatar */}
        <button
          onClick={() => navigate('/perfil')}
          className="flex items-center gap-3 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          )}
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-light">{user?.name}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-red-700/20 rounded-lg text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}
