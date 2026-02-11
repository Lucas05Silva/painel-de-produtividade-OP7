import { BarChart3, FileText, Plus, Trophy, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Minhas Demandas', path: '/demandas' },
    { icon: Plus, label: 'Registrar Nova', path: '/nova-demanda' },
    { icon: Menu, label: 'Kanban', path: '/kanban' },
    { icon: Trophy, label: 'Ranking', path: '/ranking' },
    { icon: User, label: 'Perfil', path: '/perfil' },
    ...(user?.role === 'admin' ? [{ icon: Settings, label: 'Painel Admin', path: '/admin' }] : []),
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-primary text-white p-2 rounded-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-card-dark border-r border-slate-700 transition-all duration-300 z-40 ${
          isOpen ? 'w-64' : 'w-0'
        } overflow-hidden lg:w-64`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-primary">Produtividade</h1>
          <p className="text-xs text-slate-400 mt-1">Sistema de Demandas</p>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 text-light transition-colors group"
            >
              <item.icon size={20} className="text-primary group-hover:text-blue-300" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-dark-bg">
          <p className="text-xs text-slate-400">
            Versão <span className="text-primary font-bold">1.0</span>
          </p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
}
