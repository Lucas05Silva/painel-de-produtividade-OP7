import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, Medal, User } from 'lucide-react';
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
    if (position === 1) return <Trophy size={24} className="text-yellow-400" />;
    if (position === 2) return <Medal size={24} className="text-gray-400" />;
    if (position === 3) return <Medal size={24} className="text-orange-600" />;
    return null;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-light mb-2">Ranking de Produtividade</h1>
            <p className="text-slate-400">Acompanhe o desempenho da equipe</p>
          </div>

          {/* Period Filter */}
          <div className="flex gap-2">
            {['semana', 'mês', 'ano'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
                  period === p
                    ? 'bg-primary text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
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
            <div className="card text-center py-12">
              <p className="text-slate-400">Nenhum dado disponível</p>
            </div>
          ) : (
            ranking.map((user, index) => (
              <div key={user.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Position */}
                    <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-lg text-light">
                      {getMedalIcon(index + 1) || (
                        <span className={index + 1 <= 3 ? 'text-primary' : 'text-slate-400'}>
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
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                            <User size={20} className="text-white" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-light font-semibold">{user.name}</h3>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{user.totalTempo}</p>
                    <p className="text-xs text-slate-400">minutos</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Your Position */}
        {ranking.length > 0 && (
          <div className="card border-l-4 border-primary bg-blue-500/5">
            <h3 className="text-light font-bold mb-3">Sua Posição</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Posição</p>
                <p className="text-2xl font-bold text-primary">#3</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-light">2.540 min</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Diferença</p>
                <p className="text-2xl font-bold text-yellow-400">-180 min</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
