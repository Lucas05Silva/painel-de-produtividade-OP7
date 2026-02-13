import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Edit2, CheckCircle2, Clock, AlertCircle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const CATEGORIAS_FIXAS = [
  'Automação & IA',
  'Planejamento',
  'Criação & Design',
  'Suporte & Atendimento',
  'Tráfego Pago'
];

const categoryColors = {
  'Automação & IA': 'bg-green-100 text-green-800',
  'Planejamento': 'bg-blue-100 text-blue-800',
  'Criação & Design': 'bg-purple-100 text-purple-800',
  'Suporte & Atendimento': 'bg-pink-100 text-pink-800',
  'Tráfego Pago': 'bg-red-100 text-red-800'
};

const statusColors = {
  'Pendente': 'bg-red-100 text-red-800',
  'Em andamento': 'bg-amber-100 text-amber-800',
  'Finalizado': 'bg-green-100 text-green-800'
};

const statusIcons = {
  'Pendente': <AlertCircle size={16} />,
  'Em andamento': <Clock size={16} />,
  'Finalizado': <CheckCircle2 size={16} />
};

export default function DemandasPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [demandas, setDemandas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        const response = await axios.get('/api/demandas', {
          headers: { Authorization: `Bearer ${token}` },
          params: { categoria: filterCategory, status: filterStatus }
        });
        setDemandas(response.data);
      } catch (error) {
        console.error('Erro ao carregar demandas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDemandas();
  }, [token, filterCategory, filterStatus]);

  const deleteDemanda = async (id) => {
    if (!window.confirm('Deseja deletar esta demanda?')) return;
    try {
      await axios.delete(`/api/demandas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDemandas(demandas.filter(d => d.id !== id));
    } catch (error) {
      alert('Erro ao deletar demanda');
    }
  };

  const updateStatus = async (id, currentStatus) => {
    const statusOrder = ['Pendente', 'Em andamento', 'Finalizado'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const newStatus = statusOrder[currentIndex + 1];

    if (!newStatus) return;

    try {
      const response = await axios.patch(`/api/demandas/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDemandas(demandas.map(d => d.id === id ? response.data : d));
    } catch (error) {
      alert('Erro ao atualizar demanda');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando demandas...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">Minhas Demandas</h1>
          <p className="text-gray-600">Acompanhe seu histórico de atividades e tarefas</p>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-blue-500" />
            <h3 className="text-lg font-bold text-black">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Categoria</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Todas as categorias</option>
                {CATEGORIAS_FIXAS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Todos os status</option>
                <option value="Pendente">Pendente</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterCategory('');
                  setFilterStatus('');
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-black font-medium py-2.5 rounded-lg transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <p className="text-gray-600 text-sm mb-1">Total de Demandas</p>
            <h3 className="text-3xl font-bold text-black">{demandas.length}</h3>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm mb-1">Em Andamento</p>
            <h3 className="text-3xl font-bold text-amber-600">
              {demandas.filter(d => d.status === 'Em andamento').length}
            </h3>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm mb-1">Finalizadas</p>
            <h3 className="text-3xl font-bold text-green-600">
              {demandas.filter(d => d.status === 'Finalizado').length}
            </h3>
          </div>
        </div>

        {/* Demandas List */}
        <div className="space-y-4">
          {demandas.length === 0 ? (
            <div className="card text-center py-16">
              <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-gray-600 mb-2">Nenhuma demanda encontrada</p>
              <p className="text-sm text-gray-500">Ajuste seus filtros ou crie uma nova demanda</p>
            </div>
          ) : (
            demandas.map(demanda => (
              <div key={demanda.id} className="card hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[demanda.categoria]}`}>
                        {demanda.categoria}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColors[demanda.status]}`}>
                        {statusIcons[demanda.status]}
                        {demanda.status}
                      </span>
                    </div>

                    <h3 className="text-black font-bold text-lg mb-1">{demanda.cliente}</h3>
                    <p className="text-gray-600 text-sm mb-3">{demanda.descricao}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>⏱️ {demanda.tempo} minutos</span>
                      <span>📅 {new Date(demanda.data).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-gray-200 sm:pl-4">
                    {demanda.status !== 'Finalizado' && (
                      <button
                        onClick={() => updateStatus(demanda.id, demanda.status)}
                        className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        title="Avançar status"
                      >
                        <CheckCircle2 size={14} />
                        {demanda.status === 'Pendente' ? 'Iniciar' : 'Finalizar'}
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/demandas/${demanda.id}/editar`)}
                      className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      title="Editar demanda"
                    >
                      <Edit2 size={14} />
                      Editar
                    </button>
                    <button
                      onClick={() => deleteDemanda(demanda.id)}
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-semibold transition-colors"
                      title="Deletar demanda"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
