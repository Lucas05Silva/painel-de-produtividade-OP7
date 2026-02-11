import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, X } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const statusList = ['Pendente', 'Em andamento', 'Finalizado'];

const categoryColors = {
  'Design': 'bg-purple-500',
  'Copy': 'bg-blue-500',
  'Tráfego Pago': 'bg-red-500',
  'Automação': 'bg-green-500',
  'Reunião': 'bg-yellow-500',
  'Suporte': 'bg-pink-500',
  'Outro': 'bg-slate-500'
};

export default function KanbanPage() {
  const { token } = useAuth();
  const [demandas, setDemandas] = useState({
    'Pendente': [],
    'Em andamento': [],
    'Finalizado': []
  });
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        const response = await axios.get('/api/demandas', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const grouped = {
          'Pendente': [],
          'Em andamento': [],
          'Finalizado': []
        };
        
        response.data.forEach(demanda => {
          grouped[demanda.status].push(demanda);
        });
        
        setDemandas(grouped);
      } catch (error) {
        console.error('Erro ao carregar demandas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDemandas();
  }, [token]);

  const handleDragStart = (e, status, demanda) => {
    setDraggedItem({ status, demanda });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { status, demanda } = draggedItem;
    if (status === newStatus) {
      setDraggedItem(null);
      return;
    }

    try {
      await axios.patch(`/api/demandas/${demanda.id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDemandas(prev => ({
        ...prev,
        [status]: prev[status].filter(d => d.id !== demanda.id),
        [newStatus]: [{ ...demanda, status: newStatus }, ...prev[newStatus]]
      }));
    } catch (error) {
      console.error('Erro ao atualizar demanda:', error);
    } finally {
      setDraggedItem(null);
    }
  };

  if (loading) return <Layout><div>Carregando...</div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-light mb-2">Visualização Kanban</h1>
          <p className="text-slate-400">Arraste as demandas entre os status</p>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {statusList.map(status => (
            <div
              key={status}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
              className="bg-card-dark rounded-lg p-4 min-h-[600px] border-2 border-dashed border-slate-700 hover:border-primary transition-colors"
            >
              {/* Column Header */}
              <div className="mb-4">
                <h2 className="text-light font-bold text-lg">{status}</h2>
                <p className="text-slate-400 text-sm">
                  {demandas[status].length} {demandas[status].length === 1 ? 'tarefa' : 'tarefas'}
                </p>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {demandas[status].length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-500 text-sm">Nenhuma tarefa aqui</p>
                  </div>
                ) : (
                  demandas[status].map(demanda => (
                    <div
                      key={demanda.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, status, demanda)}
                      className="bg-dark-bg rounded-lg p-4 cursor-move hover:shadow-lg transition-all transform hover:-translate-y-1 border-l-4"
                      style={{ borderLeftColor: categoryColors[demanda.categoria] || '#6366f1' }}
                    >
                      <div className="mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${categoryColors[demanda.categoria]}`}>
                          {demanda.categoria}
                        </span>
                      </div>
                      
                      <h3 className="text-light font-bold text-sm mb-1">{demanda.cliente}</h3>
                      <p className="text-slate-400 text-xs mb-3 line-clamp-2">{demanda.descricao}</p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>⏱️ {demanda.tempo}m</span>
                        <span>{new Date(demanda.data).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            💡 <strong>Dica:</strong> Arraste as tarefas entre os colunas para alterar seu status. Os dados serão salvos automaticamente.
          </p>
        </div>
      </div>
    </Layout>
  );
}
