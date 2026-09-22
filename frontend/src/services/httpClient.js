import axios from 'axios';

const httpClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add bearer token to requests if present
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aquaguard_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format error messages in clean language
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let userMessage = 'An unexpected error occurred while processing your request. Please try again.';

    if (error.response) {
      const data = error.response.data;
      if (data && data.message) {
        userMessage = data.message;
      } else if (data && data.error) {
        userMessage = data.error;
      } else if (error.response.status === 401) {
        userMessage = 'Your session has expired. Please sign in again to continue.';
        localStorage.removeItem('aquaguard_token');
        localStorage.removeItem('aquaguard_user');
      } else if (error.response.status === 403) {
        userMessage = 'You do not have authorization to view or perform this action.';
      } else if (error.response.status === 404) {
        userMessage = 'The requested information could not be found.';
      } else if (error.response.status >= 500) {
        userMessage = 'Our service is currently experiencing high load. Please try again in a few moments.';
      }
    } else if (error.request) {
      userMessage = 'Unable to connect to the safety platform network. Please check your internet connection.';
    }

    return Promise.reject(new Error(userMessage));
  }
);

export default httpClient;
