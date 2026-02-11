import { useEffect, useState } from 'react';
import axios from 'axios';
import { Filter, Download, Eye } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [allDemandas, setAllDemandas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, demandasRes] = await Promise.all([
          axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/admin/demandas', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setUsers(usersRes.data);
        setAllDemandas(demandasRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados admin:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [token]);

  // Filtrar demandas
  const filteredDemandas = allDemandas.filter(d => {
    if (selectedUser && d.userId !== selectedUser) return false;
    if (filterDate && !new Date(d.data).toDateString().includes(filterDate)) return false;
    if (filterCategory && d.categoria !== filterCategory) return false;
    return true;
  });

  // Calcular estatísticas
  const totalMinutos = filteredDemandas.reduce((acc, d) => acc + d.tempo, 0);
  const totalDemandas = filteredDemandas.length;
  const demandaFinalizadas = filteredDemandas.filter(d => d.status === 'Finalizado').length;

  const categorias = ['Design', 'Copy', 'Tráfego Pago', 'Automação', 'Reunião', 'Suporte', 'Outro'];

  const handleExportCSV = () => {
    const csv = [
      ['Usuário', 'Categoria', 'Cliente', 'Status', 'Tempo (min)', 'Data'],
      ...filteredDemandas.map(d => {
        const user = users.find(u => u.id === d.userId);
        return [user?.name || 'N/A', d.categoria, d.cliente, d.status, d.tempo, d.data];
      })
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'demandas-export.csv';
    a.click();
  };

  if (loading) return <Layout><div>Carregando...</div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-light mb-2">Painel do Diretor</h1>
          <p className="text-slate-400">Visão completa da agência</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">Total de Demandas</p>
            <h3 className="text-3xl font-bold text-light">{totalDemandas}</h3>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">Finalizadas</p>
            <h3 className="text-3xl font-bold text-green-400">{demandaFinalizadas}</h3>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">Total de Minutos</p>
            <h3 className="text-3xl font-bold text-primary">{totalMinutos}</h3>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">Membros</p>
            <h3 className="text-3xl font-bold text-light">{users.length}</h3>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <h3 className="text-light font-bold mb-4 flex items-center gap-2">
            <Filter size={20} /> Filtros
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-light mb-2">Usuário</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full bg-dark-bg text-light border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
              >
                <option value="">Todos</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-light mb-2">Data</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-dark-bg text-light border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light mb-2">Categoria</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-dark-bg text-light border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
              >
                <option value="">Todas</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleExportCSV}
                className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} /> Exportar CSV
              </button>
            </div>
          </div>
        </div>

        {/* Demandas Table */}
        <div className="card overflow-x-auto">
          <h3 className="text-light font-bold mb-4">Demandas Registradas</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Usuário</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Categoria</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Cliente</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Tempo</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemandas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400">
                    Nenhuma demanda encontrada
                  </td>
                </tr>
              ) : (
                filteredDemandas.map(demanda => {
                  const user = users.find(u => u.id === demanda.userId);
                  return (
                    <tr key={demanda.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-3 px-4 text-light">{user?.name}</td>
                      <td className="py-3 px-4 text-light">{demanda.categoria}</td>
                      <td className="py-3 px-4 text-light">{demanda.cliente}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          demanda.status === 'Finalizado'
                            ? 'bg-green-500/20 text-green-300'
                            : demanda.status === 'Em andamento'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {demanda.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-light">{demanda.tempo}m</td>
                      <td className="py-3 px-4 text-slate-400">{new Date(demanda.data).toLocaleDateString()}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
