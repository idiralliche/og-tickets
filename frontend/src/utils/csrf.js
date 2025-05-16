export function getCSRFToken() {
  const name = 'csrftoken=';
  const cookies = document.cookie.split(';');
  for (let c of cookies) {
    c = c.trim();
    if (c.startsWith(name)) {
      return decodeURIComponent(c.substring(name.length));
    }
  }
  return null;
}

export const buildCSRFHeaders = (
  headers = { 'Content-Type': 'application/json' }
) => {
  const csrfToken = getCSRFToken();
  if (csrfToken) headers['X-CSRFToken'] = csrfToken;
  return headers;
};
