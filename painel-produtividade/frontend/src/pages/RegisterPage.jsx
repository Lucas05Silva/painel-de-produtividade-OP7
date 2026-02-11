import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não correspondem');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar conta');
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
          <p className="text-slate-400">Criar nova conta</p>
        </div>

        {/* Form Card */}
        <div className="bg-card-dark rounded-lg p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-light mb-6">Registre-se</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-light mb-2">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full bg-dark-bg text-light border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-light mb-2">Confirmar Senha</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-dark-bg text-light border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Já tem conta?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary hover:text-blue-300 font-semibold"
              >
                Faça login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
