import { createContext, useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${token}` }
          };
          const { data } = await axios.get('/api/users/profile', config);
          setUser(data);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/users/register', { name, email, password });
      localStorage.setItem('token', data.token);
      setUser(data);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
