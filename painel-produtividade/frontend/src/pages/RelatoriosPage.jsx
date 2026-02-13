import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function RelatoriosPage() {
  const { user, token } = useAuth();
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('semana');

  useEffect(() => {
    const fetchRelatorios = async () => {
      try {
        // Buscar dados agregados para relatório
        const res = await axios.get('/api/ranking?period=' + filtro, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRelatorios(res.data);
      } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorios();
  }, [token, filtro]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando relatórios...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const periodos = [
    { value: 'semana', label: 'Esta Semana' },
    { value: 'mês', label: 'Este Mês' },
    { value: 'ano', label: 'Este Ano' }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">Relatórios</h1>
          <p className="text-gray-600">Análise de produtividade e desempenho da equipe</p>
        </div>

        {/* Filtros */}
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <Calendar size={20} className="text-blue-500" />
            <div className="flex gap-3">
              {periodos.map(p => (
                <button
                  key={p.value}
                  onClick={() => setFiltro(p.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filtro === p.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              <Download size={18} />
              Exportar
            </button>
          </div>
        </div>

        {/* Ranking table */}
        {relatorios.length > 0 ? (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={20} className="text-blue-500" />
              <h2 className="text-2xl font-bold text-black">Ranking de Produtividade</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-black">#</th>
                    <th className="px-4 py-3 text-left font-semibold text-black">Nome</th>
                    <th className="px-4 py-3 text-left font-semibold text-black">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-black">Total (min)</th>
                    <th className="px-4 py-3 text-left font-semibold text-black">Horas</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorios.map((user, idx) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700 font-bold">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                      </td>
                      <td className="px-4 py-3 text-black font-medium">{user.name}</td>
                      <td className="px-4 py-3 text-gray-700">{user.email}</td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{user.totalTempo || 0}</td>
                      <td className="px-4 py-3 text-gray-700 font-medium">
                        {Math.round((user.totalTempo || 0) / 60)}h
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card text-center py-12">
            <TrendingUp size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-black mb-2">Sem dados</h3>
            <p className="text-gray-600">Nenhum dado de produtividade encontrado para este período</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
