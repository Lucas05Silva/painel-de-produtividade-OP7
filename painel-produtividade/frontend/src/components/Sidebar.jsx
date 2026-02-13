import { BarChart3, FileText, Plus, Trophy, User, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard', roles: ['colaborador', 'diretor', 'adm_supremo'] },
    { icon: FileText, label: 'Minhas Demandas', path: '/demandas', roles: ['colaborador', 'diretor', 'adm_supremo'] },
    { icon: Plus, label: 'Nova Demanda', path: '/nova-demanda', roles: ['colaborador', 'diretor', 'adm_supremo'] },
    { icon: Menu, label: 'Kanban', path: '/kanban', roles: ['colaborador', 'diretor', 'adm_supremo'] },
    { icon: Trophy, label: 'Ranking', path: '/ranking', roles: ['colaborador', 'diretor', 'adm_supremo'] },
    { icon: User, label: 'Perfil', path: '/perfil', roles: ['colaborador', 'diretor', 'adm_supremo'] },
    { icon: FileText, label: 'Relatórios', path: '/relatorios', roles: ['diretor', 'adm_supremo'] },
    { icon: Settings, label: 'Gerenciar Usuários', path: '/admin', roles: ['adm_supremo'] },
    { icon: Settings, label: 'Painel Diretor', path: '/admin', roles: ['diretor'] },
  ];

  const visibleItems = !loading && user ? menuItems.filter(item => item.roles.includes(user.userType)) : [];

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 z-40 lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <Logo size="md" showText={true} />
          <p className="text-xs text-gray-500 mt-2">Sistema de Demandas</p>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <p className="text-xs text-gray-500 ml-2">Carregando...</p>
            </div>
          ) : !user ? (
            <div className="text-center py-8">
              <p className="text-xs text-red-500 font-semibold">⚠️ Usuário não carregado</p>
              <p className="text-xs text-gray-500 mt-2">Tente fazer login novamente</p>
            </div>
          ) : visibleItems.length > 0 ? (
            visibleItems.map((item) => {
              const isActive = window.location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-xs text-orange-500 font-semibold">⚠️ Nenhum menu disponível</p>
              <p className="text-xs text-gray-500 mt-2">Tipo: {user?.userType || 'indefinido'}</p>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-500">Sistema v1.0</p>
          {user && <p className="text-xs text-blue-600 mt-1 truncate font-semibold">{user.email}</p>}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}