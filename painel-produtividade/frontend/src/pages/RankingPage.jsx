import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, Medal, User, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function RankingPage() {
  const { token } = useAuth();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('semana');

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get('/api/ranking', {
          headers: { Authorization: `Bearer ${token}` },
          params: { period }
        });
        setRanking(response.data);
      } catch (error) {
        console.error('Erro ao carregar ranking:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, [token, period]);

  const getMedalIcon = (position) => {
    if (position === 1) return <Trophy size={24} className="text-amber-400" />;
    if (position === 2) return <Medal size={24} className="text-gray-400" />;
    if (position === 3) return <Medal size={24} className="text-amber-600" />;
    return null;
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Ranking de Produtividade</h1>
            <p className="text-gray-600">Acompanhe o desempenho da equipe</p>
          </div>

          {/* Period Filter */}
          <div className="flex gap-2">
            {['semana', 'mês', 'ano'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
                  period === p
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Ranking Table */}
        <div className="space-y-3">
          {ranking.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg text-center py-12">
              <p className="text-gray-600">Nenhum dado disponível</p>
            </div>
          ) : (
            ranking.map((user, index) => (
              <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Position */}
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-lg text-black">
                      {getMedalIcon(index + 1) || (
                        <span className={index + 1 <= 3 ? 'text-blue-500' : 'text-gray-600'}>
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <User size={20} className="text-white" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-black font-semibold">{user.name}</h3>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-500">{user.totalTempo}</p>
                    <p className="text-xs text-gray-600">minutos</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Your Position */}
        {ranking.length > 0 && (
          <div className="bg-white border-l-4 border-blue-500 border border-gray-200 rounded-lg p-6">
            <h3 className="text-black font-bold mb-4">📊 Sua Posição no Ranking</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">Posição</p>
                <p className="text-2xl font-bold text-blue-500">#3</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Total</p>
                <p className="text-2xl font-bold text-black">2.540 min</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Diferença</p>
                <p className="text-2xl font-bold text-amber-400">-180 min</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
