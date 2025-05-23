import { getCSRFToken } from './csrf';

/**
 * Builds and validates request headers for secure API requests.
 * @function
 * @param {Object} options - Options for building the request headers.
 * @param {Object} [options.headers={}] - Existing headers to include in the request.
 * @param {Array<string>} [options.expectedHeaders=[]] - Headers expected to be included in the request.
 * @param {string} [options.accessToken] - Access token for authorization.
 * @param {string} [options.contentType='application/json'] - Content type for the request.
 * @returns {Object} The constructed headers object.
 * @throws {Error} If required tokens (accessToken or CSRF token) are missing.
 */
export function buildRequestHeaders({
  headers = {},
  expectedHeaders = [],
  accessToken,
  contentType = 'application/json',
}) {
  // Avoid side effects by creating a copy of the headers object
  const outHeaders = { ...headers };

  // Build a Set of lowercase keys for robust comparison
  const existingHeaders = new Set(
    Object.keys(outHeaders).map((h) => h.toLowerCase())
  );

  // Determine which expected headers are missing
  const missingHeaders = expectedHeaders.filter(
    (header) => !existingHeaders.has(header.toLowerCase())
  );

  // Add Authorization header if missing and access token is provided
  if (
    missingHeaders.includes('authorization') &&
    !(
      outHeaders['Authorization'] &&
      /^Bearer\s+\w+$/.test(outHeaders['Authorization'])
    )
  ) {
    if (!accessToken) {
      throw new Error(
        'Access token manquant : impossible d’effectuer une requête sécurisée.'
      );
    }
    outHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  // Add CSRF token header if missing
  if (missingHeaders.includes('x-csrftoken')) {
    const csrfToken = getCSRFToken();
    if (!csrfToken) {
      throw new Error(
        'CSRF token manquant : impossible d’effectuer une requête sécurisée.'
      );
    }
    outHeaders['X-CSRFToken'] = csrfToken;
  }

  // Add Content-Type header if missing
  if (missingHeaders.includes('content-type')) {
    outHeaders['Content-Type'] = contentType;
  }

  return outHeaders;
}
