import { useEffect, useState } from 'react';
import axios from 'axios';
import { Shield, Users, FileText, BarChart3, Plus, Edit2, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [demandas, setDemandas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: 'colaborador'
  });

  // Apenas ADM Supremo pode acessar
  const isAdminSupremo = user?.userType === 'adm_supremo';

  useEffect(() => {
    if (!isAdminSupremo) return;

    const fetchData = async () => {
      try {
        const [usersRes, demandasRes] = await Promise.all([
          axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/admin/demandas', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setUsers(usersRes.data);
        setDemandas(demandasRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, isAdminSupremo]);

  const handleUpdateUserType = async (userId, newType) => {
    try {
      const response = await axios.put(
        `/api/admin/users/${userId}/type`,
        { userType: newType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(u => u.id === userId ? response.data : u));
      alert('Tipo de usuário atualizado com sucesso');
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao atualizar usuário');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) return;

    try {
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.id !== userId));
      alert('Usuário deletado com sucesso');
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao deletar usuário');
    }
  };

  if (!isAdminSupremo) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Shield size={48} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-black mb-2">Acesso Restrito</h2>
            <p className="text-gray-600">Apenas ADM Supremo pode acessar este painel</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando painel administrativo...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const userTypeColor = {
    'adm_supremo': 'bg-red-100 text-red-800',
    'diretor': 'bg-purple-100 text-purple-800',
    'colaborador': 'bg-blue-100 text-blue-800'
  };

  const userTypeLabel = {
    'adm_supremo': 'ADM Supremo',
    'diretor': 'Diretor/Gestor',
    'colaborador': 'Colaborador'
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-lg">
            <Shield size={24} className="text-red-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-black">Painel de Administração</h1>
            <p className="text-gray-600">Gerenciar usuários e sistema</p>
          </div>
        </div>

        {/* Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900">Painel Restrito</h3>
            <p className="text-sm text-yellow-800 mt-1">
              Você está acessando o painel de controle de sistema. Todas as ações aqui são registradas.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-black'
            }`}
          >
            <Users size={18} className="inline mr-2" />
            Usuários ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('demandas')}
            className={`px-4 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'demandas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-black'
            }`}
          >
            <FileText size={18} className="inline mr-2" />
            Demandas ({demandas.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total de Usuários</p>
                    <h3 className="text-3xl font-bold text-black">{users.length}</h3>
                  </div>
                  <Users size={40} className="text-blue-500 opacity-40" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Colaboradores</p>
                    <h3 className="text-3xl font-bold text-black">
                      {users.filter(u => u.userType === 'colaborador').length}
                    </h3>
                  </div>
                  <Users size={40} className="text-blue-500 opacity-40" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Diretores</p>
                    <h3 className="text-3xl font-bold text-black">
                      {users.filter(u => u.userType === 'diretor').length}
                    </h3>
                  </div>
                  <Users size={40} className="text-purple-500 opacity-40" />
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">Lista de Usuários</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-black">Nome</th>
                      <th className="px-4 py-3 text-left font-semibold text-black">Email</th>
                      <th className="px-4 py-3 text-left font-semibold text-black">Tipo</th>
                      <th className="px-4 py-3 text-left font-semibold text-black">Data</th>
                      <th className="px-4 py-3 text-left font-semibold text-black">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
                                {u.name.charAt(0)}
                              </div>
                            )}
                            <span className="font-medium text-black">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{u.email}</td>
                        <td className="px-4 py-3">
                          <select
                            value={u.userType}
                            onChange={(e) => handleUpdateUserType(u.id, e.target.value)}
                            disabled={u.id === user?.id}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border-0 ${userTypeColor[u.userType]} cursor-pointer`}
                          >
                            <option value="colaborador">{userTypeLabel.colaborador}</option>
                            <option value="diretor">{userTypeLabel.diretor}</option>
                            {u.userType === 'adm_supremo' && (
                              <option value="adm_supremo">{userTypeLabel.adm_supremo}</option>
                            )}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs">
                          {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3">
                          {u.id !== user?.id && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                              title="Deletar usuário"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Demandas Tab */}
        {activeTab === 'demandas' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total</p>
                    <h3 className="text-3xl font-bold text-black">{demandas.length}</h3>
                  </div>
                  <FileText size={40} className="text-blue-500 opacity-40" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Pendentes</p>
                    <h3 className="text-3xl font-bold text-black">
                      {demandas.filter(d => d.status === 'Pendente').length}
                    </h3>
                  </div>
                  <AlertCircle size={40} className="text-red-500 opacity-40" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Em Andamento</p>
                    <h3 className="text-3xl font-bold text-black">
                      {demandas.filter(d => d.status === 'Em andamento').length}
                    </h3>
                  </div>
                  <BarChart3 size={40} className="text-amber-500 opacity-40" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Finalizadas</p>
                    <h3 className="text-3xl font-bold text-black">
                      {demandas.filter(d => d.status === 'Finalizado').length}
                    </h3>
                  </div>
                  <CheckCircle2 size={40} className="text-green-500 opacity-40" />
                </div>
              </div>
            </div>

            {/* Demandas Table */}
            <div className="card overflow-hidden">
              <h2 className="text-2xl font-bold text-black mb-6">Todas as Demandas</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-black">Descrição</th>
                      <th className="px-4 py-3 text-left font-semibold text-black">Responsável</th>
                      <th className="px-4 py-3 text-left font-semibold text-black">Categoria</th>
                      <th className="px-4 py-3 text-left font-semibold text-black">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-black">Tempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demandas.slice(0, 20).map((d) => {
                      const userResponsavel = users.find(u => u.id === d.userId);
                      const statusColor = {
                        'Pendente': 'bg-red-100 text-red-800',
                        'Em andamento': 'bg-amber-100 text-amber-800',
                        'Finalizado': 'bg-green-100 text-green-800'
                      }[d.status] || 'bg-gray-100 text-gray-800';

                      return (
                        <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 text-black font-medium">{d.descricao}</td>
                          <td className="px-4 py-3 text-gray-600">{userResponsavel?.name || 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-600">{d.categoria}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 font-medium">{d.tempo}min</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {demandas.length > 20 && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  Mostrando 20 de {demandas.length} demandas
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
