import { makeAuthPostRequest } from '../utils/authRequest';
import { buildCSRFHeaders } from '../utils/csrf';

// User Management
export const authService = {
  /**
   * Registers a new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} Registered user data
   */
  register: (userData) =>
    makeAuthPostRequest('users', userData, 'Registration'),

  /**
   * Authenticates user and returns JWT tokens
   * @param {object} credentials - { email, password }
   * @returns {Promise<{access: string}>} Access token
   */
  login: (credentials) =>
    makeAuthPostRequest('jwt/create', credentials, 'Login'),

  /**
   * Singleton token refresh with request deduplication
   * @returns {Promise<{access: string}>} New access token
   */
  refreshToken: (() => {
    let pending = null;
    return () => {
      if (pending) return pending;
      pending = makeAuthPostRequest('jwt/refresh', {}, 'Refresh')
        .catch((err) => {
          if (err.message.includes('Refresh token absent')) {
            return {};
          }
          throw err;
        })
        .finally(() => {
          pending = null;
        });
      return pending;
    };
  })(),

  logout: (accessToken) => {
    return fetch(
      `${process.env.REACT_APP_BACKEND_BASE_URL}api/auth/jwt/logout/`,
      {
        method: 'POST',
        credentials: 'include',
        headers: buildCSRFHeaders({ Authorization: `Bearer ${accessToken}` }),
      }
    );
  },
};
