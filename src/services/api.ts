import axios from 'axios';

// Obter a URL base da API do arquivo .env
const API_BASE_URL = import.meta.env.VITE_API_URL;

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
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratamento de erros 401 (não autorizado) - apenas loga o erro
    if (error.response && error.response.status === 401) {
      console.warn('Erro 401: Não autorizado');
      // NÃO faz logout automático
    }
    return Promise.reject(error);
  }
);

export default api;