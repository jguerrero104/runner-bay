 // Ensure this is at the top to load environment variables first
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [id, setId] = useState(null); // Change from userID to id
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedId = localStorage.getItem('id'); // Change from userID to id
    if (token && storedId) {
      setIsLoggedIn(true);
      setId(parseInt(storedId, 10)); // Convert to integer
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token, id } = await response.json(); // Change from userID to id
        console.log('Login response:', { token, id });
        localStorage.setItem('token', token);
        localStorage.setItem('id', String(id)); // Change from userID to id, convert to string
        setIsLoggedIn(true);
        setId(id); // Change from setUserID to setId
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
    setIsLoggedIn(false);
    setId(null);
    setToken(null); // Clear the token state
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
    <AuthContext.Provider value={{ isLoggedIn, id, token, login, logout }}> 
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
