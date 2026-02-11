import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await axios.post('/api/auth/register', { name, email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
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
