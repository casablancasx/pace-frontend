import React, { createContext, useContext, useState } from 'react';

type PageType = 'home' | 'advogados' | 'pautas' | 'audiencias' | 'pautistas' | 'avaliadores' | 'pautista' | 'avaliador' | 'importar-planilha' | 'escala-avaliadores' | 'escala-pautistas' | 'minhas-pautas' | 'detalhes-pauta';

interface NavigationContextData {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  selectedPautaId?: string;
  setSelectedPautaId: (pautaId: string | undefined) => void;
  navigateToPautaDetails: (pautaId: string) => void;
  navigateBackToPautas: () => void;
}

const NavigationContext = createContext<NavigationContextData>({
  currentPage: 'home',
  setCurrentPage: () => {},
  selectedPautaId: undefined,
  setSelectedPautaId: () => {},
  navigateToPautaDetails: () => {},
  navigateBackToPautas: () => {}
});

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedPautaId, setSelectedPautaId] = useState<string | undefined>();

  const navigateToPautaDetails = (pautaId: string) => {
    setSelectedPautaId(pautaId);
    setCurrentPage('detalhes-pauta');
  };

  const navigateBackToPautas = () => {
    setSelectedPautaId(undefined);
    setCurrentPage('pautas');
  };

  return (
    <NavigationContext.Provider value={{ 
      currentPage, 
      setCurrentPage, 
      selectedPautaId, 
      setSelectedPautaId,
      navigateToPautaDetails,
      navigateBackToPautas
    }}>
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