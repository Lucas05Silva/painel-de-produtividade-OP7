import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function NovaDemandasPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    categoria: 'Design',
    cliente: '',
    descricao: '',
    tempo: '',
    status: 'Pendente'
  });

  const categorias = ['Design', 'Copy', 'Tráfego Pago', 'Automação', 'Reunião', 'Suporte', 'Outro'];
  const statuses = ['Pendente', 'Em andamento', 'Finalizado'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/demandas', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/demandas');
      }, 1500);
    } catch (error) {
      console.error('Erro ao criar demanda:', error);
      alert('Erro ao registrar demanda');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center animate-fadeIn">
            <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-light mb-2">Demanda Registrada!</h2>
            <p className="text-slate-400">Redirecionando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-light mb-2">Registrar Nova Demanda</h1>
          <p className="text-slate-400">Preencha os dados abaixo para registrar uma demanda</p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-light mb-2">Tipo de Demanda *</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full bg-dark-bg text-light border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Cliente */}
            <div>
              <label className="block text-sm font-medium text-light mb-2">Nome do Cliente *</label>
              <input
                type="text"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                placeholder="Ex: Empresa ABC"
                className="w-full bg-dark-bg text-light border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-light mb-2">Descrição da Atividade *</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descreva a atividade realizada..."
                rows="4"
                className="w-full bg-dark-bg text-light border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                required
              />
            </div>

            {/* Tempo */}
            <div>
              <label className="block text-sm font-medium text-light mb-2">Tempo Gasto (minutos) *</label>
              <input
                type="number"
                name="tempo"
                value={formData.tempo}
                onChange={handleChange}
                placeholder="Ex: 120"
                min="1"
                className="w-full bg-dark-bg text-light border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-light mb-2">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-dark-bg text-light border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Registrando...' : 'Registrar Demanda'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/demandas')}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-light font-bold py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
