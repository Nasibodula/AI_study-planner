// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in on app startup
    const initAuth = () => {
      const user = authService.getCurrentUser();
      if (user && authService.getToken()) {
        setCurrentUser(user);
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);
  
  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setCurrentUser(response.user);
    return response;
  };
  
  const register = async (name, email, password) => {
    const response = await authService.register(name, email, password);
    setCurrentUser(response.user);
    return response;
  };
  
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };
  
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};