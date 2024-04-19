import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [id, setId] = useState(null); // This will act as the user ID and seller ID
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedId = localStorage.getItem('id');
    const storedRole = localStorage.getItem('role');
    if (storedToken && storedId) {
      setIsLoggedIn(true);
      setId(parseInt(storedId, 10)); // Convert to integer
      setRole(storedRole);
      setToken(storedToken);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token, id, role } = await response.json();
        localStorage.setItem('token', token);
        localStorage.setItem('id', String(id));
        localStorage.setItem('role', role);
        setIsLoggedIn(true);
        setId(id);
        setRole(role);
        setToken(token);
        return { success: true };
      } else {
        const errorResponse = await handleErrorResponse(response);
        throw new Error(errorResponse);
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setId(null);
    setRole(null);
    setToken(null);
  };

  async function handleErrorResponse(response) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      const errorData = await response.json();
      return errorData.message || 'Failed to log in';
    } else {
      return await response.text() || 'Failed to log in';
    }
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, id, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
