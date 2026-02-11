import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Produtividade</h1>
          <p className="text-slate-400">Sistema de Controle de Demandas</p>
        </div>

        {/* Form Card */}
        <div className="bg-card-dark rounded-lg p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-light mb-6">Entre em sua conta</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-light mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-dark-bg text-light border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-light mb-2">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-dark-bg text-light border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-light"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Não tem conta?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-primary hover:text-blue-300 font-semibold"
              >
                Criar conta
              </button>
            </p>
          </div>

          {/* Demo Info */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-400 mb-2">Contas de demo:</p>
            <div className="space-y-1 text-xs text-slate-300">
              <p><strong>Admin:</strong> admin@agencia.com / 123456</p>
              <p><strong>Usuário:</strong> usuario@agencia.com / 123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
