import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  Calendar, 
  UserCheck, 
  UserCog,
  ChevronDown,
  HelpCircle, 
  User, 
  Sun, 
  Moon 
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '../../contexts/NavigationContext';
import type { SidebarItem } from '../../types';
import './Sidebar.css';

const sidebarItems: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'advogados', label: 'Advogados', icon: Users },
  { id: 'pautas', label: 'Pautas', icon: FileText },
  { id: 'audiencias', label: 'Audiências', icon: Calendar },
  { id: 'pautistas', label: 'Pautistas', icon: UserCheck },
  { id: 'avaliadores', label: 'Avaliadores', icon: UserCog },
];

const escalarItems = [
  { id: 'pautista', label: 'Pautista', icon: UserCheck },
  { id: 'avaliador', label: 'Avaliador', icon: UserCog },
];

const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentPage, setCurrentPage } = useNavigation();
  const [isEscalarOpen, setIsEscalarOpen] = useState(false);

  const handlePageClick = (pageId: string) => {
    setCurrentPage(pageId as any);
  };

  const toggleEscalar = () => {
    setIsEscalarOpen(!isEscalarOpen);
  };

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

        <div className="sidebar__user">
          <div className="sidebar__user-avatar">
            <User size={20} />
          </div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">Erica</span>
            <span className="sidebar__user-email">erica@example.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;