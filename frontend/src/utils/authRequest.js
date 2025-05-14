import { buildCSRFHeaders } from './csrf';

/**
 * Base URL for authentication-related API endpoints
 * @constant {string}
 */
const API_AUTH_URL = `${process.env.REACT_APP_BACKEND_BASE_URL}api/auth/users/`;

/**
 * Handles authentication-related API requests with CSRF protection
 * @private
 * @param {string} endpoint - API endpoint suffix
 * @param {Object} data - Payload to send with the request
 * @param {string} [action='Request'] - Action name for error messages
 * @returns {Promise<Object>} Resolves with parsed JSON response
 * @throws {Error} Throws error with server message or default message
 */
export const makeAuthPostRequest = async (
  endpoint,
  data,
  action = 'Request'
) => {
  if (!endpoint.endsWith('/')) {
    endpoint = endpoint + '/';
  }

  try {
    const response = await fetch(`${API_AUTH_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: buildCSRFHeaders(),
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
