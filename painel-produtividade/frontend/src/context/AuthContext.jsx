import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Configure axios baseURL from Vite env or use relative paths (for dev proxy)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          console.log('[AuthContext.checkAuth] Fetching /api/auth/me com token');
          const response = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('[AuthContext.checkAuth] Success:', response.data);
          setUser(response.data);
        } catch (error) {
          console.error('[AuthContext.checkAuth] Error:', error.response?.status, error.message);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } else {
        console.log('[AuthContext.checkAuth] Sem token');
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    console.log('[AuthContext.login] Iniciando login...');
    const response = await axios.post('/api/auth/login', { email, password });
    console.log('[AuthContext.login] Response:', response.data);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    console.log('[AuthContext.login] Token salvo, atualizando estado...');
    setToken(token);
    setUser(user);
    return response.data;
  };

  const register = async (name, email, password, userType = 'colaborador') => {
    console.log('[AuthContext.register] Iniciando registro...');
    const response = await axios.post('/api/auth/register', { name, email, password, userType });
    console.log('[AuthContext.register] Response:', response.data);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    console.log('[AuthContext.register] Token salvo, atualizando estado...');
    setToken(token);
    setUser(user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const response = await axios.put('/api/auth/profile', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(response.data);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
