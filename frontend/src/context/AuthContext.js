import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

/**
 * Authentication context for managing user session state.
 * Provides access token, user data, and authentication methods to child components.
 *
 * @type {React.Context}
 * @property {string|null} accessToken - Current JWT access token
 * @property {Object|null} user - Authenticated user data
 * @property {Function} login - Function to set access token after successful authentication
 * @property {Function} logout - Function to clear authentication state
 * @property {boolean} loading - Loading state during auth initialization
 */
export const AuthContext = createContext({
  accessToken: null,
  user: null,
  login: () => {},
  logout: () => {},
  register: () => {},
  resetPassword: () => {},
});

/**
 * Provider component that manages authentication state and provides it to the application.
 * Handles session persistence and CSRF protection.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.Context.Provider} Authentication context provider
 *
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 *
 * @description
 * Features include:
 * - Session initialization on app load
 * - CSRF token management
 * - Access token refresh handling
 * - Memory-only token storage for security
 * - Loading state during initialization
 */
export const AuthProvider = ({ children }) => {
  // Store in memory to limit exposure to XSS attacks
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null); // Optionally, you can store user details here
  const [loading, setLoading] = useState(false);

  /**
   * Initializes authentication state by attempting to refresh the access token.
   * @private
   * @async
   */
  const initializeAuth = useCallback(async () => {
    if (!localStorage.getItem('wasLoggedIn')) {
      setLoading(false);
      return;
    }
    try {
      const { access } = await authService.refreshToken();
      if (access) {
        setAccessToken(access);
        // TODOs:
        // Eventually update user details if decoded from the token or ask info from the backend
        // const decodedToken = jwt_decode(access);
        // setUser(decodedToken);
        // Optionally, user details can be fetched from the backend using the access token
        // const userDetails = await fetchUserDetails(access);
        // setUser(userDetails);
      } else {
        // If no access, session is not valid
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

  // Initialize CSRF protection and auth state on mount
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

  /**
   * Sets the access token after successful login.
   * @param {string} token - JWT access token
   */
  const login = (token) => {
    setAccessToken(token);
    localStorage.setItem('wasLoggedIn', '1');
  };

  /**
   * Clears authentication state and invalidates session.
   * @async
   */
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
