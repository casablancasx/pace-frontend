import React, { createContext, useContext, useState } from 'react';

type PageType = 'home' | 'advogados' | 'pautas' | 'audiencias' | 'pautistas' | 'avaliadores' | 'pautista' | 'avaliador' | 'importar-planilha';

interface NavigationContextData {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
}

const NavigationContext = createContext<NavigationContextData>({} as NavigationContextData);

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  return (
    <NavigationContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextData => {
  const context = useContext(NavigationContext);
  
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  
  return context;
};