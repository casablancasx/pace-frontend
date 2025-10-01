import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import AuthService from '../services/authService';
import type { UsuarioEntity, UserRole } from '../types/auth';

// Interface para o contexto de autorização
interface AuthorizationContextType {
  userRole: UserRole | null;
  isAdmin: boolean;
  hasPermission: (permission: string) => boolean;
  allowedRoutes: string[];
  userData: UsuarioEntity | null;
}

// Criar o contexto
const AuthorizationContext = createContext<AuthorizationContextType | undefined>(undefined);

// Permissões para cada papel
const rolePermissions: Record<UserRole, string[]> = {
  ADMIN: ['*'], // * significa todas as permissões
  USER: ['home', 'minhas-pautas'],
  AVALIADOR: ['home', 'audiencias', 'minhas-pautas'],
  PAUTISTA: ['home', 'pautas', 'minhas-pautas'],
  COORDENADOR: ['home', 'pautas', 'advogados', 'audiencias', 'minhas-pautas'],
};

// Rotas permitidas para cada papel
const roleRoutes: Record<UserRole, string[]> = {
  ADMIN: [
    'home', 
    'advogados', 
    'pautas', 
    'audiencias', 
    'pautistas', 
    'avaliadores',
    'importar-planilha',
    'escala-avaliadores',
    'escala-pautistas',
    'minhas-pautas',
  ],
  USER: ['home', 'minhas-pautas'],
  AVALIADOR: ['home', 'audiencias', 'minhas-pautas'],
  PAUTISTA: ['home', 'pautas', 'minhas-pautas'],
  COORDENADOR: ['home', 'pautas', 'advogados', 'audiencias', 'pautistas', 'minhas-pautas'],
};

// Props para o provider
interface AuthorizationProviderProps {
  children: ReactNode;
}

// Provider do contexto
export const AuthorizationProvider: React.FC<AuthorizationProviderProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userData, setUserData] = useState<UsuarioEntity | null>(null);
  
  // Verifica se o usuário é um administrador
  const isAdmin = userRole === 'ADMIN';
  
  // Lista de rotas permitidas com base no papel do usuário
  const allowedRoutes = userRole ? roleRoutes[userRole] : ['login'];
  
  // Carrega os dados do usuário quando o componente é montado
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setUserData(user);
      setUserRole(user.role);
    }
  }, []);
  
  // Função para verificar se o usuário tem uma permissão específica
  const hasPermission = (permission: string) => {
    if (!userRole) return false;
    const permissions = rolePermissions[userRole];
    return permissions.includes('*') || permissions.includes(permission);
  };
  
  const value = {
    userRole,
    isAdmin,
    hasPermission,
    allowedRoutes,
    userData
  };
  
  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useAuthorization = () => {
  const context = useContext(AuthorizationContext);
  if (context === undefined) {
    throw new Error('useAuthorization must be used within an AuthorizationProvider');
  }
  return context;
};