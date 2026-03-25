const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'aq_token';

export function getStoredToken() {
  return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
}

export function saveSession(token, name) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    if (name) localStorage.setItem('aq_name', name);
  }
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('aq_name');
  }
}

export function getStoredName() {
  return typeof window !== 'undefined' ? localStorage.getItem('aq_name') : null;
}

async function request(path, options = {}) {
  const token = getStoredToken();

  try {
    const response = await fetch(`${API}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
      throw new Error(data?.error || 'Request failed.');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Unable to reach the backend. Make sure it is running on http://localhost:5000.');
    }

    throw error;
  }
}

export const api = {
  signup: (body) => request('/api/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/api/auth/me'),
  getProblems: () => request('/api/problems'),
  getProgress: () => request('/api/progress'),
  complete: (problemId) =>
    request('/api/progress/complete', { method: 'POST', body: JSON.stringify({ problemId }) }),
  leaderboard: () => request('/api/progress/leaderboard'),
};
