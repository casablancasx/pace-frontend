import api from './api';
import type { LoginRequestDTO, LoginResponseDTO } from '../types/auth';

export const AUTH_CHANGE_EVENT = 'authChange';

// Classe para gerenciar autenticação
class AuthService {
  // Endpoint para login
  private static readonly LOGIN_URL = '/auth/login';
  
  /**
   * Realiza a autenticação do usuário
   * @param credentials Credenciais de login (email e senha)
   * @returns Resposta com dados do usuário e token JWT
   */
  static async login(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
    try {
      const response = await api.post<LoginResponseDTO>(this.LOGIN_URL, credentials);
  
      
      sessionStorage.setItem('auth_token', response.data.token);
      sessionStorage.setItem('user_data', JSON.stringify(response.data.user));

  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
      
      return response.data;
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      throw error;
    }
  }

  /**
   * Finaliza a sessão do usuário
   */
  static logout(): void {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_data');
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    // Redireciona para a página de login
    window.location.href = '/login';
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns Verdadeiro se o usuário estiver autenticado
   */
  static isAuthenticated(): boolean {
    return !!sessionStorage.getItem('auth_token');
  }

  /**
   * Obtém os dados do usuário autenticado
   * @returns Dados do usuário ou null se não estiver autenticado
   */
  static getCurrentUser() {
    const userStr = sessionStorage.getItem('user_data');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Obtém o token de autenticação
   * @returns Token JWT ou null se não estiver autenticado
   */
  static getToken(): string | null {
    return sessionStorage.getItem('auth_token');
  }
}

export default AuthService;