import React from 'react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <main className="layout">
      <div className="layout__content">
        {children}
      </div>
    </main>
  );
};

export default Layout;