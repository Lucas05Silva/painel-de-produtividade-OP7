import { useState, useRef } from 'react';
import { Camera, Save, Lock, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function PerfilPage() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulando upload de avatar (em produção seria um multipart upload)
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setLoading(true);
        await updateProfile({ avatar: event.target?.result });
        setSuccess(true);
        setError('');
        setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
        console.error('Erro ao atualizar avatar:', error);
        setError('Erro ao atualizar avatar');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('As senhas não correspondem');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        ...(formData.newPassword && { currentPassword: formData.currentPassword, newPassword: formData.newPassword })
      };
      await updateProfile(updateData);
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplay = () => {
    if (!user?.userType) return 'Colaborador';
    const roleMap = {
      'colaborador': '👤 Colaborador',
      'diretor': '👨‍💼 Diretor/Gestor',
      'adm_supremo': '👑 ADM Supremo'
    };
    return roleMap[user.userType] || 'Colaborador';
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">👤 Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações e preferências</p>
        </div>

        {/* Avatar Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-black font-bold mb-4">Foto de Perfil</h3>
          <div className="flex items-center gap-6">
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-4xl text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <button
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
              >
                <Camera size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-black font-semibold text-lg">{user?.name}</p>
              <p className="text-gray-600 text-sm">{user?.email}</p>
              <p className="text-blue-500 text-sm font-semibold mt-2">
                {getRoleDisplay()}
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <span>✓</span>
            <span>Atualizado com sucesso!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-black font-bold mb-4">Informações Pessoais</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Nome</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Email</label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full bg-gray-100 text-gray-500 border border-gray-300 rounded-lg px-4 py-2 cursor-not-allowed opacity-60"
              />
              <p className="text-xs text-gray-600 mt-1">Email não pode ser alterado</p>
            </div>

            {/* Password Section */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-black font-semibold mb-4 flex items-center gap-2">
                <Lock size={18} /> Alterar Senha
              </h4>

              {/* Current Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">Senha Atual</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Digite sua senha atual"
                  className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 placeholder-gray-400"
                />
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">Nova Senha</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Digite sua nova senha"
                  className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 placeholder-gray-400"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Confirmar Senha</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirme sua nova senha"
                  className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
            >
              <Save size={18} />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
