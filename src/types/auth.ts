// Enum para papéis de usuário
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  AVALIADOR = 'AVALIADOR',
  PAUTISTA = 'PAUTISTA',
  COORDENADOR = 'COORDENADOR',
}

// Interface para entidade de usuário
export interface UsuarioEntity {
  usuarioId: number;
  nome: string;
  email: string;
  cpf: string;
  role: UserRole;
  setorId?: number;
  unidadeId?: number;
  sapiensId?: number;
  criadoEm: string; // ISO date string
  ultimoAcesso?: string; // ISO date string
}

// Interface para requisição de login
export interface LoginRequestDTO {
  email: string;
  password: string;
}

// Interface para resposta de login
export interface LoginResponseDTO {
  user: UsuarioEntity;
  token: string;
}

// Interface para erros de API
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}