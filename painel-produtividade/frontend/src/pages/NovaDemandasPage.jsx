import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const CATEGORIAS_FIXAS = [
  'Automação & IA',
  'Planejamento',
  'Criação & Design',
  'Suporte & Atendimento',
  'Tráfego Pago'
];

const STATUS_OPTIONS = ['Pendente', 'Em andamento', 'Finalizado'];

export default function NovaDemandasPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    categoria: CATEGORIAS_FIXAS[0],
    cliente: '',
    descricao: '',
    tempo: '',
    status: 'Pendente'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.cliente.trim()) {
      setError('Nome do cliente é obrigatório');
      return;
    }
    if (!formData.descricao.trim()) {
      setError('Descrição é obrigatória');
      return;
    }
    if (!formData.tempo || formData.tempo < 1) {
      setError('Tempo deve ser maior que 0 minutos');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/demandas', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/demandas');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registrar demanda');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center animate-fadeIn">
            <div className="mb-4 flex justify-center">
              <CheckCircle size={80} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">Demanda Registrada com Sucesso!</h2>
            <p className="text-gray-600">Redirecionando para minhas demandas...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">Registrar Nova Demanda</h1>
          <p className="text-gray-600">Preencha os dados para registrar uma nova atividade</p>
        </div>

        {/* Form */}
        <div className="card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Categoria da Demanda *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              >
                {CATEGORIAS_FIXAS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Selecione a categoria que melhor se enquadra na atividade
              </p>
            </div>

            {/* Cliente */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Nome do Cliente / Projeto *
              </label>
              <input
                type="text"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                placeholder="Ex: Empresa ABC, Projeto XYZ"
                className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Descrição da Atividade *
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descreva em detalhes a atividade realizada..."
                rows="5"
                className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                required
              />
            </div>

            {/* Tempo */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Tempo Gasto (minutos) *
              </label>
              <input
                type="number"
                name="tempo"
                value={formData.tempo}
                onChange={handleChange}
                placeholder="Ex: 120"
                min="1"
                max="1440"
                className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Tempo total da atividade em minutos
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Status da Demanda *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registrando...' : 'Registrar Demanda'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/demandas')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-black font-bold py-2.5 rounded-lg transition-colors"
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
