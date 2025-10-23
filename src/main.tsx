import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import AuthService from './services/authService'

// Expor AuthService globalmente apenas em desenvolvimento para testes
if (import.meta.env.DEV) {
  (window as any).AuthService = AuthService;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
