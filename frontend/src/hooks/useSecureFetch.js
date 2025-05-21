import { useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';
import { buildRequestHeaders } from '../utils/buildRequestHeaders';
/**
 * useSecureFetch is a custom hook that
 * automatically attaches the access token to requests and
 * attempts to refresh it if a 401 Unauthorized response is detected.
 */
export const useSecureFetch = () => {
  const { accessToken, login, logout } = useContext(AuthContext);

  /**
   * secureFetch wraps the native fetch function.
   * @param {string} url - The endpoint URL.
   * @param {object} [options] - The fetch options.
   * @returns {Promise<Response>} - The fetch response.
   */
  const secureFetch = useMemo(() => {
    return async (url, options = {}) => {
      // Ensure headers exist and add the Authorization header.
      options.headers = buildRequestHeaders({
        headers: options.headers,
        expectedHeaders: ['x-csrftoken', 'authorization'],
        accessToken,
      });

      let response = await fetch(url, options);

      // If the access token is expired and server returns 401,
      // attempt to refresh the token.
      if (response.status === 401) {
        try {
          const data = await authService.refreshToken();
          if (data && data.access) {
            // Updates the context with the new token
            login(data.access);
            // Updates the Authorization header.
            options.headers['Authorization'] = `Bearer ${data.access}`;
            // Retries the request with the updated token.
            response = await fetch(url, options);
          } else {
            logout();
          }
        } catch (error) {
          logout();
          throw new Error('La session a expiré, veuillez vous reconnecter.');
        }
      }
      return response;
    };
  }, [accessToken, login, logout]);

  return secureFetch;
};
