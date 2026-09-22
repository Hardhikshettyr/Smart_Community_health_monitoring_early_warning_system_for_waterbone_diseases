import httpClient from './httpClient';

export const authService = {
  async register(email, password, role = 'user') {
    const response = await httpClient.post('/auth/register', { email, password, role });
    return response.data;
  },

  async verifyOtp(email, otp) {
    const response = await httpClient.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  async login(email, password) {
    const response = await httpClient.post('/auth/login', { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('aquaguard_token', response.data.token);
      localStorage.setItem('aquaguard_user', JSON.stringify(response.data.user || { email, role: 'user' }));
    }
    return response.data;
  },

  async getProfile() {
    // The backend does not expose a dedicated profile endpoint; the JWT
    // returned at login already carries the authoritative user identity,
    // and the user object is cached locally at login/register time. We
    // return that cached copy here so existing callers (e.g. session
    // verification on app load) keep working without an extra request.
    const cachedUser = this.getCurrentUser();
    return cachedUser ? { user: cachedUser } : null;
  },

  logout() {
    localStorage.removeItem('aquaguard_token');
    localStorage.removeItem('aquaguard_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('aquaguard_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('aquaguard_token');
  }
};
