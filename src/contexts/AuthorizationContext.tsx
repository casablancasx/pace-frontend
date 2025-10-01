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
  isLoading: boolean;
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
    // ADMIN não precisa de 'minhas-pautas' pois tem acesso a 'pautas' completo
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
  // Carregar dados do usuário IMEDIATAMENTE na inicialização do estado
  const initialUser = AuthService.getCurrentUser();
  const [userRole, setUserRole] = useState<UserRole | null>(initialUser?.role || null);
  const [userData, setUserData] = useState<UsuarioEntity | null>(initialUser);
  const [isLoading, setIsLoading] = useState(true);
  
  // Verifica se o usuário é um administrador
  const isAdmin = userRole === 'ADMIN';
  
  // Lista de rotas permitidas com base no papel do usuário
  // Se não houver userRole e não estivermos em loading, assumir ADMIN para desenvolvimento
  const allowedRoutes = userRole 
    ? roleRoutes[userRole] 
    : (isLoading ? [] : roleRoutes['ADMIN']); // Fallback para ADMIN durante desenvolvimento
  
  // Monitora mudanças nos dados do usuário (para atualizações futuras)
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setUserData(user);
      setUserRole(user.role);
    } else {
      setUserData(null);
      setUserRole(null);
    }
    setIsLoading(false);
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
    userData,
    isLoading
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