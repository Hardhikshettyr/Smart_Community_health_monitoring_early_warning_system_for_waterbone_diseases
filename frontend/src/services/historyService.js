import httpClient from './httpClient';

export const historyService = {
  async getHistory() {
    const response = await httpClient.get('/history');
    return response.data;
  },

  async getHistoryItem(id) {
    // The backend only exposes a bulk history listing, not a single-item
    // route, so we fetch the full list and find the matching record here.
    const response = await httpClient.get('/history');
    const list = response.data?.history || [];
    return list.find((item) => item._id === id) || null;
  },

  /**
   * Admin-only: fetches prediction history across ALL users.
   * Backend restricts this route to the admin role; a non-admin token
   * will receive a 403 from the server.
   */
  async getAllHistory() {
    const response = await httpClient.get('/history/all');
    return response.data;
  }
};
