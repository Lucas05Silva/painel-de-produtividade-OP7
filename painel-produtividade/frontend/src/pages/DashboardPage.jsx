import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [demandas, setDemandas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dados pessoais
        const statsRes = await axios.get('/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(statsRes.data);

        // Se for diretor ou admin, buscar todos os usuários e demandas
        if (user?.userType === 'diretor' || user?.userType === 'adm_supremo') {
          const [usersRes, demandasRes] = await Promise.all([
            axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
            axios.get('/api/admin/demandas', { headers: { Authorization: `Bearer ${token}` } })
          ]);
          setAllUsers(usersRes.data);
          setDemandas(demandasRes.data);
        } else {
          // Colaborador vê apenas suas demandas
          const demandasRes = await axios.get('/api/demandas', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setDemandas(demandasRes.data);
        }
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user?.userType]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const isAdminOrDirector = user?.userType === 'diretor' || user?.userType === 'adm_supremo';
  const tasksByStatus = {
    pendente: demandas.filter(d => d.status === 'Pendente').length,
    andamento: demandas.filter(d => d.status === 'Em andamento').length,
    finalizado: demandas.filter(d => d.status === 'Finalizado').length
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">
            {isAdminOrDirector ? 'Visão Geral da Agência' : 'Seu Dashboard'}
          </h1>
          <p className="text-gray-600">
            {isAdminOrDirector
              ? 'Acompanhe o desempenho de toda a equipe'
              : 'Acompanhe seu progresso e demandas'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Demandas"
            value={demandas.length}
            icon={<BarChart3 size={24} className="text-blue-500" />}
            trend={null}
          />
          <StatCard
            title="Em Andamento"
            value={tasksByStatus.andamento}
            icon={<Clock size={24} className="text-amber-500" />}
            trend={null}
          />
          <StatCard
            title="Finalizadas"
            value={tasksByStatus.finalizado}
            icon={<CheckCircle2 size={24} className="text-green-500" />}
            trend={null}
          />
          <StatCard
            title="Pendentes"
            value={tasksByStatus.pendente}
            icon={<AlertCircle size={24} className="text-red-500" />}
            trend={null}
          />
        </div>

        {/* Demandas por Status */}
        {demandas.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-blue-500" />
              <h2 className="text-2xl font-bold text-black">Demandas Recentes</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-black">Descrição</th>
                    {isAdminOrDirector && <th className="px-4 py-3 text-left font-semibold text-black">Responsável</th>}
                    <th className="px-4 py-3 text-left font-semibold text-black">Categoria</th>
                    <th className="px-4 py-3 text-left font-semibold text-black">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-black">Tempo (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {demandas.slice(0, 10).map((d) => {
                    const user = allUsers.find(u => u.id === d.userId);
                    const statusColor = {
                      'Pendente': 'bg-red-100 text-red-800',
                      'Em andamento': 'bg-amber-100 text-amber-800',
                      'Finalizado': 'bg-green-100 text-green-800'
                    }[d.status] || 'bg-gray-100 text-gray-800';

                    return (
                      <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-black">
                          <div className="font-medium">{d.descricao}</div>
                          <div className="text-xs text-gray-500 mt-1">{d.cliente}</div>
                        </td>
                        {isAdminOrDirector && (
                          <td className="px-4 py-3 text-gray-700">{user?.name || 'N/A'}</td>
                        )}
                        <td className="px-4 py-3 text-gray-700">{d.categoria}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 font-medium">{d.tempo}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {demandas.length > 10 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Mostrando 10 de {demandas.length} demandas
                </p>
              </div>
            )}
          </div>
        )}

        {demandas.length === 0 && (
          <div className="card text-center py-12">
            <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-black mb-2">Nenhuma demanda encontrada</h3>
            <p className="text-gray-600">Crie uma nova demanda para começar</p>
          </div>
        )}

        {/* Info Cards para Diretor/Admin */}
        {isAdminOrDirector && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-bold text-black mb-4">Equipe</h3>
              <p className="text-3xl font-bold text-blue-500 mb-2">{allUsers.length}</p>
              <p className="text-sm text-gray-600">Membros da equipe</p>
            </div>
            <div className="card">
              <h3 className="text-lg font-bold text-black mb-4">Taxa de Conclusão</h3>
              <p className="text-3xl font-bold text-green-500 mb-2">
                {demandas.length > 0 ? Math.round((tasksByStatus.finalizado / demandas.length) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-600">De todas as demandas</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
