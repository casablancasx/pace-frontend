import React, { useState, useRef, useEffect } from 'react';
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
  User,
  LogOut,
  Folder
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAuthorization } from '../../contexts/AuthorizationContext';
import AuthService from '../../services/authService';
import type { SidebarItem } from '../../types';
import './Sidebar.css';

// Definição de todos os itens do sidebar
const allSidebarItems: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'advogados', label: 'Advogados', icon: Users },
  { id: 'pautas', label: 'Pautas', icon: FileText },
  { id: 'minhas-pautas', label: 'Minhas Pautas', icon: Folder },
  { id: 'audiencias', label: 'Audiências', icon: Calendar },
  { id: 'pautistas', label: 'Pautistas', icon: UserCheck },
  { id: 'avaliadores', label: 'Avaliadores', icon: UserCog },
  { id: 'importar-planilha', label: 'Importar Planilha', icon: Upload },
];

// Definição de todos os itens de escalar
const allEscalarItems: SidebarItem[] = [
  { id: 'escala-avaliadores', label: 'Escala Avaliadores', icon: UserCog },
  { id: 'escala-pautistas', label: 'Escala Pautistas', icon: UserCheck },
];

const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage } = useNavigation();
  const navigate = useNavigate();
  const { allowedRoutes, userData, isLoading } = useAuthorization();
  const [isEscalarOpen, setIsEscalarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Filtrar os itens do sidebar com base nas permissões do usuário
  // Se ainda estiver carregando, mostrar array vazio para evitar flickering
  const sidebarItems = isLoading ? [] : allSidebarItems.filter(item => 
    allowedRoutes.includes(item.id)
  );
  
  // Filtrar os itens de escalar com base nas permissões do usuário
  const escalarItems = isLoading ? [] : allEscalarItems.filter(item => 
    allowedRoutes.includes(item.id)
  );
  
  // Verificar se há itens de escalar disponíveis para o usuário
  const hasEscalarItems = !isLoading && escalarItems.length > 0;

  const handlePageClick = (pageId: string) => {
    setCurrentPage(pageId as any); // Utilizamos 'as any' para evitar problemas de tipagem
    navigate(`/${pageId}`);
  };

  const toggleEscalar = () => {
    setIsEscalarOpen(!isEscalarOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    AuthService.logout();
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
          {/* Loading state */}
          {isLoading && (
            <li className="sidebar__item">
              <div className="sidebar__loading">
                Carregando...
              </div>
            </li>
          )}
          
          {/* Item Home - sempre mostrado primeiro */}
          {!isLoading && sidebarItems.filter(item => item.id === 'home').map((item) => {
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
          
          {/* Dropdown Escalar - apenas se o usuário tiver permissão */}
          {!isLoading && hasEscalarItems && (
            <li className="sidebar__item">
              <button 
                className={`sidebar__button sidebar__button--dropdown ${isEscalarOpen ? 'sidebar__button--open' : ''}`}
                onClick={toggleEscalar}
              >
                <Users size={20} />
                <span>Escalar</span>
                {isEscalarOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
          )}

          {/* Outros itens do sidebar exceto home */}
          {!isLoading && sidebarItems.filter(item => item.id !== 'home').map((item) => {
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