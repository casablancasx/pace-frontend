import axios from 'axios';

// Obter a URL base da API do arquivo .env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9091';

// Criar uma instância do Axios com configurações padrão
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Tempo limite de 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor de requisição - adiciona token a todas as requisições quando disponível
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta - tratamento global de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratamento de erros 401 (não autorizado) - logout automático
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;