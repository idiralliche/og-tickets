import { buildCSRFHeaders } from '../utils/csrf';

export const activateAccount = async (uid, token) => {
  const url = `${process.env.REACT_APP_BACKEND_BASE_URL}api/auth/users/activation/`;
  const headers = buildCSRFHeaders({ 'Content-Type': 'application/json' });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ uid, token }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Échec de l’activation.');
  }

  return response.json();
};

// Endpoint pour renvoyer le lien d'activation si expiré
export const resendActivation = async (email) => {
  const url = `${process.env.REACT_APP_BACKEND_BASE_URL}api/auth/users/resend_activation/`;
  const headers = buildCSRFHeaders({ 'Content-Type': 'application/json' });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Échec du renvoi du lien.');
  }

  return response.json();
};
