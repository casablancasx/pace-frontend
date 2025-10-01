import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css';
import pgfLogo from '../../assets/pgf.svg';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          
          <form className="form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                EMAIL <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="info@agu.gov.br"
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
                />
                <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" className="checkbox" />
                <span className="checkbox-text">Manter-me conectado</span>
              </label>
              <a href="#" className="forgot-password">Esqueceu sua senha?</a>
            </div>

            <button type="submit" className="login-button">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;