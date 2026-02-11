import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Edit2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const categoryColors = {
  'Design': 'bg-purple-500/20 text-purple-300',
  'Copy': 'bg-blue-500/20 text-blue-300',
  'Tráfego Pago': 'bg-red-500/20 text-red-300',
  'Automação': 'bg-green-500/20 text-green-300',
  'Reunião': 'bg-yellow-500/20 text-yellow-300',
  'Suporte': 'bg-pink-500/20 text-pink-300',
  'Outro': 'bg-slate-500/20 text-slate-300'
};

const statusIcons = {
  'Pendente': <AlertCircle size={16} />,
  'Em andamento': <Clock size={16} />,
  'Finalizado': <CheckCircle2 size={16} />
};

const statusColors = {
  'Pendente': 'bg-yellow-500/20 text-yellow-300',
  'Em andamento': 'bg-blue-500/20 text-blue-300',
  'Finalizado': 'bg-green-500/20 text-green-300'
};

export default function DemandasPage() {
  const { token } = useAuth();
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
    if (!confirm('Deseja deletar esta demanda?')) return;
    try {
      await axios.delete(`/api/demandas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDemandas(demandas.filter(d => d.id !== id));
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await axios.patch(`/api/demandas/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDemandas(demandas.map(d => d.id === id ? response.data : d));
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-light mb-2">Minhas Demandas</h1>
          <p className="text-slate-400">Acompanhe seu histórico de atividades</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-light mb-2">Categoria</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-card-dark text-light border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
            >
              <option value="">Todas as categorias</option>
              {Object.keys(categoryColors).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-light mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-card-dark text-light border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
            >
              <option value="">Todos os status</option>
              <option value="Pendente">Pendente</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
        </div>

        {/* Demandas List */}
        <div className="space-y-3">
          {demandas.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-slate-400">Nenhuma demanda encontrada</p>
            </div>
          ) : (
            demandas.map(demanda => (
              <div key={demanda.id} className="card">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[demanda.categoria]}`}>
                        {demanda.categoria}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColors[demanda.status]}`}>
                        {statusIcons[demanda.status]}
                        {demanda.status}
                      </span>
                    </div>
                    <h3 className="text-light font-bold text-lg">{demanda.cliente}</h3>
                    <p className="text-slate-400 text-sm mt-1">{demanda.descricao}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>⏱️ {demanda.tempo} minutos</span>
                      <span>📅 {new Date(demanda.data).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-700 sm:pl-4">
                    {demanda.status !== 'Finalizado' && (
                      <button
                        onClick={() => updateStatus(demanda.id, demanda.status === 'Pendente' ? 'Em andamento' : 'Finalizado')}
                        className="px-3 py-1 bg-green-500/20 text-green-300 rounded text-xs hover:bg-green-500/30"
                      >
                        {demanda.status === 'Pendente' ? 'Iniciar' : 'Finalizar'}
                      </button>
                    )}
                    <button
                      onClick={() => deleteDemanda(demanda.id)}
                      className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-xs hover:bg-red-500/30"
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
