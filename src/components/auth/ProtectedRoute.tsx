import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para proteger rotas que exigem autenticação.
 * Redireciona para a página de login se o usuário não estiver autenticado.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirecionar para a página de login, salvando a localização atual
    // para poder retornar depois do login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;