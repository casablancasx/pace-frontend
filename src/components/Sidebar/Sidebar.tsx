import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  Calendar, 
  UserCheck, 
  UserCog,
  Upload,
  ChevronDown,
  ChevronUp,
  HelpCircle, 
  User, 
  Sun, 
  Moon,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '../../contexts/NavigationContext';
import AuthService from '../../services/authService';
import type { SidebarItem } from '../../types';
import type { UsuarioEntity } from '../../types/auth';
import './Sidebar.css';

const sidebarItems: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'advogados', label: 'Advogados', icon: Users },
  { id: 'pautas', label: 'Pautas', icon: FileText },
  { id: 'audiencias', label: 'Audiências', icon: Calendar },
  { id: 'pautistas', label: 'Pautistas', icon: UserCheck },
  { id: 'avaliadores', label: 'Avaliadores', icon: UserCog },
  { id: 'importar-planilha', label: 'Importar Planilha', icon: Upload },
];

const escalarItems = [
  { id: 'escala-avaliadores', label: 'Escala Avaliadores', icon: UserCog },
  { id: 'escala-pautistas', label: 'Escala Pautistas', icon: UserCheck },
];

const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentPage, setCurrentPage } = useNavigation();
  const navigate = useNavigate();
  const [isEscalarOpen, setIsEscalarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState<UsuarioEntity | null>(null);

  // Carregar dados do usuário do localStorage quando o componente for montado
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setUserData(user);
    }
  }, []);

  const handlePageClick = (pageId: string) => {
    setCurrentPage(pageId as any);
  };

  const toggleEscalar = () => {
    setIsEscalarOpen(!isEscalarOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    // Usar o método de logout do AuthService
    AuthService.logout();
    // Redirecionar para a página de login
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <h2 className="sidebar__title">Pace</h2>
      </div>

      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          {/* Item Home */}
          {sidebarItems.slice(0, 1).map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id} className="sidebar__item">
                <button 
                  className={`sidebar__button ${isActive ? 'sidebar__button--active' : ''}`}
                  onClick={() => handlePageClick(item.id)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
          
          {/* Dropdown Escalar */}
          <li className="sidebar__item">
            <button 
              className={`sidebar__button sidebar__button--dropdown ${isEscalarOpen ? 'sidebar__button--open' : ''}`}
              onClick={toggleEscalar}
            >
              <Users size={20} />
              <span>Escalar</span>
              <ChevronDown size={16} />
            </button>
            {isEscalarOpen && (
              <ul className="sidebar__dropdown">
                {escalarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <li key={item.id} className="sidebar__dropdown-item">
                      <button 
                        className={`sidebar__button sidebar__button--sub ${isActive ? 'sidebar__button--active' : ''}`}
                        onClick={() => handlePageClick(item.id)}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
          
          {/* Outros itens */}
          {sidebarItems.slice(1).map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id} className="sidebar__item">
                <button 
                  className={`sidebar__button ${isActive ? 'sidebar__button--active' : ''}`}
                  onClick={() => handlePageClick(item.id)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

     

      <div className="sidebar__footer">
        <button className="sidebar__button">
          <HelpCircle size={20} />
          <span>Support</span>
        </button>
        
        

        <button 
          className="sidebar__button sidebar__theme-toggle"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
        </button>

        <div className="sidebar__user-section" ref={userMenuRef}>
          <button 
            className={`sidebar__user ${isUserMenuOpen ? 'sidebar__user--open' : ''}`}
            onClick={toggleUserMenu}
          >
            <div className="sidebar__user-avatar">
              <User size={20} />
            </div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name-role">
                <span className="sidebar__user-name">
                  {userData?.nome 
                    ? userData.nome.split(' ')[0].toUpperCase() 
                    : 'Usuário'}
                </span>
                {userData?.role && (
                  <span className="sidebar__user-role">- {userData.role}</span>
                )}
              </div>
              <span className="sidebar__user-email">{userData?.email || 'email@agu.gov.br'}</span>
            </div>
            {isUserMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {isUserMenuOpen && (
            <div className="sidebar__user-menu">
              <button 
                className="sidebar__user-menu-item sidebar__user-menu-item--logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;