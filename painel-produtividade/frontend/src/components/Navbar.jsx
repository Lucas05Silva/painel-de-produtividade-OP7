import { LogOut, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import Logo from './Logo';

const userTypeLabels = {
  'adm_supremo': 'ADM Supremo',
  'diretor': 'Diretor/Gestor',
  'colaborador': 'Colaborador'
};

const userTypeColors = {
  'adm_supremo': 'bg-red-100 text-red-800',
  'diretor': 'bg-purple-100 text-purple-800',
  'colaborador': 'bg-blue-100 text-blue-800'
};

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-40 shadow-sm">
      {/* Left - Logo/Title */}
      <div className="flex items-center gap-3">
        <Logo size="sm" showText={false} />
        <div className="hidden sm:block">
          <h2 className="text-lg font-bold text-black">Painel Produtividade</h2>
          <p className="text-xs text-gray-500">OP7 Franchising</p>
        </div>
      </div>

      {/* Right - User Actions */}
      <div className="flex items-center gap-4">
        {/* User Type Badge */}
        {user && (
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${userTypeColors[user.userType] || 'bg-gray-100 text-gray-800'}`}>
            {userTypeLabels[user.userType] || 'Usuário'}
          </span>
        )}

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-black">{user?.name}</p>
            </div>
            <ChevronDown size={16} className="text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 animate-slideDown">
              <button
                onClick={() => {
                  navigate('/perfil');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 flex items-center gap-2"
              >
                <User size={16} />
                Perfil
              </button>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
