import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, X, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const statusList = ['Pendente', 'Em andamento', 'Finalizado'];

const CATEGORIAS_FIXAS = [
  'Automação & IA',
  'Planejamento',
  'Criação & Design',
  'Suporte & Atendimento',
  'Tráfego Pago'
];

const categoryColors = {
  'Automação & IA': 'bg-green-500',
  'Planejamento': 'bg-blue-500',
  'Criação & Design': 'bg-purple-500',
  'Suporte & Atendimento': 'bg-pink-500',
  'Tráfego Pago': 'bg-red-500'
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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">📋 Visualização Kanban</h1>
          <p className="text-gray-600">Arraste as demandas entre os status para atualizá-las</p>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {statusList.map(status => (
            <div
              key={status}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
              className="bg-gray-50 rounded-lg p-4 min-h-[600px] border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors"
            >
              {/* Column Header */}
              <div className="mb-4">
                <h2 className="text-black font-bold text-lg">
                  {status === 'Pendente' && '⏳'} 
                  {status === 'Em andamento' && '⚙️'} 
                  {status === 'Finalizado' && '✅'} 
                  {' '}{status}
                </h2>
                <p className="text-gray-600 text-sm">
                  {demandas[status].length} {demandas[status].length === 1 ? 'tarefa' : 'tarefas'}
                </p>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {demandas[status].length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-sm">Nenhuma tarefa aqui</p>
                  </div>
                ) : (
                  demandas[status].map(demanda => (
                    <div
                      key={demanda.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, status, demanda)}
                      className="bg-white rounded-lg p-4 cursor-move hover:shadow-lg transition-all transform hover:-translate-y-1 border-l-4 border border-gray-200"
                      style={{ borderLeftColor: categoryColors[demanda.categoria] || '#3b82f6' }}
                    >
                      <div className="mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${categoryColors[demanda.categoria] || 'bg-gray-500'}`}>
                          {demanda.categoria || 'Sem categoria'}
                        </span>
                      </div>
                      
                      <h3 className="text-black font-bold text-sm mb-1">{demanda.cliente}</h3>
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">{demanda.descricao}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>⏱️ {demanda.tempo}m</span>
                        <span>{new Date(demanda.data).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm">
            💡 <strong>Dica:</strong> Arraste as tarefas entre as colunas para alterar seu status. Os dados serão salvos automaticamente.
          </p>
        </div>
      </div>
    </Layout>
  );
}
