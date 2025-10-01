import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import pgfLogo from '../../assets/pgf.svg';
import AuthService from '../../services/authService';
import type { LoginRequestDTO } from '../../types/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validação básica
    if (!email.trim()) {
      setErrorMessage('Email é obrigatório');
      return;
    }
    
    if (!password.trim()) {
      setErrorMessage('Senha é obrigatória');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const credentials: LoginRequestDTO = { email, password };
      await AuthService.login(credentials);
      
      // Se lembrar estiver marcado, salvar preferência
      if (rememberMe) {
        localStorage.setItem('remember_email', email);
      } else {
        localStorage.removeItem('remember_email');
      }
      
      // Redirecionar para a página principal após login bem-sucedido
      navigate('/');
      
    } catch (error: any) {
      console.error('Erro no login:', error);
      setErrorMessage(
        error.response?.data?.message || 
        'Falha na autenticação. Verifique suas credenciais e tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={pgfLogo} alt="PGF Logo" className="login-logo" />
      </div>
      <div className="login-right">
        <div className="login-form">
          <h1 className="login-title">Login</h1>
          <p className="login-subtitle">Entre utilizando suas credenciais da rede AGU!</p>
          
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                EMAIL <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="info@agu.gov.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                PASSWORD <span className="required">*</span>
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  className="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkbox-text">Manter-me conectado</span>
              </label>
              <a href="#" className="forgot-password">Esqueceu sua senha?</a>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Carregando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;