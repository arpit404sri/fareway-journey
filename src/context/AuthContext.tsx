
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  isSubscribed: boolean;
  trialEndDate: Date;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUserSubscription: (isSubscribed: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: true,
  updateUserSubscription: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would validate credentials against a backend
      // For demo, we'll accept any credentials and create a mock user
      const trialEndDate = new Date();
      trialEndDate.setMonth(trialEndDate.getMonth() + 1);

      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0],
        email,
        isSubscribed: true, // Free for first month
        trialEndDate
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send registration data to a backend
      // For demo, we'll create a mock user
      const trialEndDate = new Date();
      trialEndDate.setMonth(trialEndDate.getMonth() + 1);

      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        isSubscribed: true, // Free for first month
        trialEndDate
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success('Registration successful!');
    } catch (error) {
      console.error('Registration failed', error);
      toast.error('Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  const updateUserSubscription = (isSubscribed: boolean) => {
    if (user) {
      const updatedUser = { ...user, isSubscribed };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUserSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};
