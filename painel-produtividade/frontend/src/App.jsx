import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DemandasPage from './pages/DemandasPage';
import NovaDemandasPage from './pages/NovaDemandasPage';
import EditarDemandasPage from './pages/EditarDemandasPage';
import RankingPage from './pages/RankingPage';
import PerfilPage from './pages/PerfilPage';
import AdminPage from './pages/AdminPage';
import KanbanPage from './pages/KanbanPage';
import RelatoriosPage from './pages/RelatoriosPage';
import LoadingScreen from './components/LoadingScreen';

// Componente para rotas protegidas
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? children : <Navigate to="/login" />;
}

// Componente para verificar se é admin ou diretor
function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return user && (user.userType === 'adm_supremo' || user.userType === 'diretor') ? children : <Navigate to="/dashboard" />;
}

// Componente para verificar se é admin supremo
function SuperAdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return user && user.userType === 'adm_supremo' ? children : <Navigate to="/dashboard" />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />

      {/* Rotas protegidas */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/demandas" element={<ProtectedRoute><DemandasPage /></ProtectedRoute>} />
      <Route path="/nova-demanda" element={<ProtectedRoute><NovaDemandasPage /></ProtectedRoute>} />
      <Route path="/demandas/:id/editar" element={<ProtectedRoute><EditarDemandasPage /></ProtectedRoute>} />
      <Route path="/kanban" element={<ProtectedRoute><KanbanPage /></ProtectedRoute>} />
      <Route path="/ranking" element={<ProtectedRoute><RankingPage /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><PerfilPage /></ProtectedRoute>} />
      <Route path="/relatorios" element={<AdminRoute><RelatoriosPage /></AdminRoute>} />
      <Route path="/admin" element={<SuperAdminRoute><AdminPage /></SuperAdminRoute>} />

      {/* Redirecionar raiz */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
