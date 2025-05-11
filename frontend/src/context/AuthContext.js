import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Store in memory to limit exposure to XSS attacks
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null); // Optionally, you can store user details here
  const [loading, setLoading] = useState(false);

  // Try to refresh the access token when the app loads to restore session if possible
  const initializeAuth = useCallback(async () => {
    if (!localStorage.getItem('wasLoggedIn')) {
      setLoading(false);
      return;
    }
    try {
      const { access } = await authService.refreshToken();
      if (access) {
        setAccessToken(access);
        // Eventually update user details if decoded from the token or ask info from the backend
        // const decodedToken = jwt_decode(access);
        // setUser(decodedToken);
        // Optionally, user details can be fetched from the backend using the access token
        // const userDetails = await fetchUserDetails(access);
        // setUser(userDetails);
      } else {
        // si pas de access, on considère que la session n'est plus valide
        localStorage.removeItem('wasLoggedIn');
      }
    } catch (_) {
      // If refresh fails, the user is not authenticated
      setAccessToken(null);
      localStorage.removeItem('wasLoggedIn');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}api/auth/csrf/`, {
      credentials: 'include',
    })
      .catch(() => {
        /* ignore CSRF error */
      })
      .finally(() => {
        initializeAuth();
      });
  }, [initializeAuth]);

  const login = (token) => {
    setAccessToken(token);
    localStorage.setItem('wasLoggedIn', '1');
  };

  const logout = useCallback(async () => {
    try {
      await authService.logout(accessToken);
    } catch (_) {}
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('wasLoggedIn');
  }, [accessToken]);

  // Expose the access token and authentication functions via context
  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
