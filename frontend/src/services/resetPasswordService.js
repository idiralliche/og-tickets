import { makeAuthPostRequest } from '../utils/authRequest';

/**
 * Confirms a password reset with new credentials.
 *
 * @async
 * @function
 * @param {Object} params - Request parameters
 * @param {string} params.uid - User identifier from reset link
 * @param {string} params.token - Security token from reset link
 * @param {string} params.new_password - New password to set
 * @param {string} params.re_new_password - New password confirmation
 * @returns {Promise} A promise resolving to the API response
 * @throws {Error} If the request fails
 * @example
 * await resetPasswordConfirm({
 *   uid: '...',
 *   token: '...',
 *   new_password: 'secure123',
 *   re_new_password: 'secure123'
 * });
 */
export const requestPasswordReset = ({ email }) =>
  makeAuthPostRequest('users/reset_password/', { email }, 'Password reset');

export const resetPasswordConfirm = ({
  uid,
  token,
  new_password,
  re_new_password,
}) =>
  makeAuthPostRequest(
    'users/reset_password_confirm/',
    { uid, token, new_password, re_new_password },
    'Reset password confirm'
  );
