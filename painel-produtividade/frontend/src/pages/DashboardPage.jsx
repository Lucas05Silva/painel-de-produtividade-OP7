import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Target, Trophy, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <Layout><div>Carregando...</div></Layout>;

  const stats_data = stats || {
    totalToday: 0,
    totalWeek: 0,
    productivity: 0,
    averageProductivity: 0,
    ranking: 0,
    weeklyData: [
      { day: 'Seg', hours: 4 },
      { day: 'Ter', hours: 6 },
      { day: 'Qua', hours: 5 },
      { day: 'Qui', hours: 7 },
      { day: 'Sex', hours: 6 },
    ],
    byCategory: {
      Design: 240,
      Copy: 180,
      'Tráfego Pago': 300,
      Automação: 120,
      Reunião: 90,
      Suporte: 60,
      Outro: 30
    }
  };

  const isAboveAverage = stats_data.productivity > stats_data.averageProductivity;
  const metaProgress = Math.min((stats_data.totalToday / 480) * 100, 100);

  // Dados do gráfico de linha
  const chartData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
    datasets: [
      {
        label: 'Horas Trabalhadas',
        data: stats_data.weeklyData?.map(d => d.hours) || [0, 0, 0, 0, 0],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-light mb-2">Dashboard</h1>
          <p className="text-slate-400">Visão geral da sua produtividade</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Demandas Hoje */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Demandas Hoje</p>
                <h3 className="text-3xl font-bold text-light">{stats_data.totalToday}</h3>
                <p className="text-xs text-slate-500 mt-1">minutos trabalhados</p>
              </div>
              <BarChart3 size={40} className="text-primary opacity-50" />
            </div>
          </div>

          {/* Demandas Semana */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Demandas Semana</p>
                <h3 className="text-3xl font-bold text-light">{stats_data.totalWeek}</h3>
                <p className="text-xs text-slate-500 mt-1">total semanal</p>
              </div>
              <TrendingUp size={40} className="text-primary opacity-50" />
            </div>
          </div>

          {/* Produtividade */}
          <div className={`card ${isAboveAverage ? 'border-l-4 border-green-500' : 'border-l-4 border-blue-400'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Produtividade</p>
                <h3 className="text-3xl font-bold text-light">{stats_data.productivity}%</h3>
                <p className={`text-xs mt-1 ${isAboveAverage ? 'text-green-400' : 'text-blue-300'}`}>
                  {isAboveAverage ? '↑ Acima da média' : '→ Na média'}
                </p>
              </div>
              <Target size={40} className={isAboveAverage ? 'text-green-500' : 'text-blue-400'} className="opacity-50" />
            </div>
          </div>

          {/* Ranking */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Posição</p>
                <h3 className="text-3xl font-bold text-primary">#{stats_data.ranking}</h3>
                <p className="text-xs text-slate-500 mt-1">no ranking semanal</p>
              </div>
              <Trophy size={40} className="text-yellow-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Alert Alert */}
        {!isAboveAverage && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-blue-400 mt-0.5" />
            <div>
              <p className="text-blue-300 font-semibold">Meta Diária</p>
              <p className="text-blue-300/80 text-sm">Você registrou {stats_data.totalToday} minutos. Meta: 480 minutos (8 horas)</p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-light font-semibold">Progresso da Meta</h3>
            <span className="text-primary text-sm">{metaProgress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-blue-400 h-full transition-all duration-500"
              style={{ width: `${metaProgress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">{stats_data.totalToday} / 480 minutos</p>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Gráfico Semanal */}
          <div className="xl:col-span-2 card">
            <h3 className="text-light font-bold mb-4">Produtividade Semanal</h3>
            <Line data={chartData} options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: 'rgba(100, 116, 139, 0.1)' },
                  ticks: { color: '#94a3b8' }
                },
                x: {
                  grid: { color: 'rgba(100, 116, 139, 0.1)' },
                  ticks: { color: '#94a3b8' }
                }
              }
            }} />
          </div>

          {/* Demandas por Tipo */}
          <div className="card">
            <h3 className="text-light font-bold mb-4">Por Tipo</h3>
            <div className="space-y-3">
              {Object.entries(stats_data.byCategory).map(([type, value]) => (
                <div key={type}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{type}</span>
                    <span className="text-primary font-semibold">{value}m</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${(value / 300) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
