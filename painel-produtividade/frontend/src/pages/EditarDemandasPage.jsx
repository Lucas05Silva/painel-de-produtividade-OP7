import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
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

export default function EditarDemandasPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [demanda, setDemanda] = useState(null);
  const [formData, setFormData] = useState({
    categoria: '',
    cliente: '',
    descricao: '',
    tempo: '',
    status: ''
  });

  // Carregar dados da demanda
  useEffect(() => {
    const fetchDemanda = async () => {
      try {
        const response = await axios.get(`/api/demandas/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDemanda(response.data);
        setFormData({
          categoria: response.data.categoria,
          cliente: response.data.cliente,
          descricao: response.data.descricao,
          tempo: response.data.tempo,
          status: response.data.status
        });
      } catch (err) {
        setError('Erro ao carregar demanda para edição');
        console.error('Erro ao carregar demanda:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchDemanda();
    }
  }, [id, token]);

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

    setSaving(true);

    try {
      await axios.patch(`/api/demandas/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/demandas');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar demanda');
      console.error('Erro ao atualizar:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando demanda...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (success) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center animate-fadeIn">
            <div className="mb-4 flex justify-center">
              <CheckCircle size={80} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">Demanda Atualizada com Sucesso!</h2>
            <p className="text-gray-600">Redirecionando para minhas demandas...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl space-y-6">
        {/* Header com botão voltar */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/demandas')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Voltar"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Editar Demanda</h1>
            <p className="text-gray-600">Atualize os dados da sua demanda</p>
          </div>
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
                placeholder="Descreva em detalhes a atividade realizada"
                rows="5"
                className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-vertical"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Seja detalhista na descrição para melhor documentação
              </p>
            </div>

            {/* Tempo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Tempo em Minutos *
                </label>
                <input
                  type="number"
                  name="tempo"
                  value={formData.tempo}
                  onChange={handleChange}
                  placeholder="Ex: 60"
                  min="1"
                  className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tempo investido em minutos
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
                <p className="text-xs text-gray-500 mt-1">
                  Defina o status atual da demanda
                </p>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/demandas')}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-black font-semibold rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
