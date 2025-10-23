import api from './api';
import type { LoginRequestDTO, LoginResponseDTO, RefreshTokenResponseDTO } from '../types/auth';

export const AUTH_CHANGE_EVENT = 'authChange';

// Classe para gerenciar autenticação
class AuthService {
  // Endpoint para login
  private static readonly LOGIN_URL = '/auth/login';
  // Endpoint para refresh token
  private static readonly REFRESH_TOKEN_URL = '/auth/refresh_token';
  // Intervalo de refresh: 30 minutos em milissegundos
  // Para testes, você pode mudar para 1 minuto: 1 * 60 * 1000
  private static readonly REFRESH_INTERVAL = 28 * 60 * 1000;
  // ID do intervalo de refresh
  private static refreshIntervalId: number | null = null;
  
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
      
      // Inicia o refresh automático do token
      this.startTokenRefresh();
      
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
    // Para o refresh automático do token
    this.stopTokenRefresh();
    
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

  /**
   * Renova o token de autenticação
   * @returns Novo token JWT
   */
  static async refreshToken(): Promise<string> {
    try {
      const currentToken = this.getToken();
      if (!currentToken) {
        throw new Error('Nenhum token disponível para renovar');
      }

      const response = await api.get<RefreshTokenResponseDTO>(this.REFRESH_TOKEN_URL);
      
      console.log('Token renovado com sucesso');
      // Atualiza o token no sessionStorage
      sessionStorage.setItem('auth_token', response.data.token);
      
      return response.data.token;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      // Se falhar o refresh, faz logout
      this.logout();
      throw error;
    }
  }

  /**
   * Inicia o refresh automático do token a cada 30 minutos
   */
  static startTokenRefresh(): void {
    // Para qualquer refresh anterior
    this.stopTokenRefresh();

    // Inicia novo intervalo
    this.refreshIntervalId = window.setInterval(async () => {
      if (this.isAuthenticated()) {
        try {
          await this.refreshToken();
          console.log('Token renovado automaticamente');
        } catch (error) {
          console.error('Falha ao renovar token automaticamente:', error);
        }
      }
    }, this.REFRESH_INTERVAL);
  }

  /**
   * Para o refresh automático do token
   */
  static stopTokenRefresh(): void {
    if (this.refreshIntervalId !== null) {
      clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = null;
    }
  }
}

export default AuthService;