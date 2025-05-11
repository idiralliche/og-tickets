/**
 * Authentication Service
 * Handles all auth-related API calls including:
 * - User registration
 * - Login/logout
 * - JWT token management
 */
import { buildCSRFHeaders } from '../utils/csrf';

const API_AUTH_URL = `${process.env.REACT_APP_BACKEND_BASE_URL}api/auth/`;

/**
 * Makes authenticated POST requests to auth endpoints
 * @param {string} endpoint - API endpoint path
 * @param {object} data - Request payload
 * @param {string} [action='Request'] - Action name for error messages
 * @returns {Promise<object>} Parsed JSON response
 * @throws {Error} With server message or default action-specific message
 */
const makeAuthRequest = async (endpoint, data, action = 'Request') => {
  try {
    const headers = buildCSRFHeaders({ 'Content-Type': 'application/json' });

    const response = await fetch(`${API_AUTH_URL}${endpoint}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.detail || `${action} failed with status ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    // console.error(`Auth Error (${action}):`, error);
    throw error;
  }
};

// User Management
export const authService = {
  /**
   * Registers a new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} Registered user data
   */
  register: (userData) => makeAuthRequest('users/', userData, 'Registration'),

  /**
   * Authenticates user and returns JWT tokens
   * @param {object} credentials - { email, password }
   * @returns {Promise<{access: string}>} Access token
   */
  login: (credentials) => makeAuthRequest('jwt/create/', credentials, 'Login'),

  /**
   * Singleton token refresh with request deduplication
   * @returns {Promise<{access: string}>} New access token
   */
  refreshToken: (() => {
    let pending = null;
    return () => {
      if (pending) return pending;
      pending = makeAuthRequest('jwt/refresh/', {}, 'Refresh')
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
    const headers = buildCSRFHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return fetch(`${API_AUTH_URL}jwt/logout/`, {
      method: 'POST',
      credentials: 'include',
      headers,
    });
  },
};
