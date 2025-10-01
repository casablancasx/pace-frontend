import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import Sidebar from './components/Sidebar';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Avaliador from './pages/Avaliadores/avaliador';
import Pautista from './pages/Pautistas/pautista';
import EscalaAvaliadores from './pages/EscalaAvaliadores';
import ImportarPlanilha from './components/ImportarPlanilha';
import Pautas from './pages/Pautas';
import DetalhesPauta from './pages/Pautas/DetalhesPauta';
import Login from './pages/Login/Login';
import './App.css';

const AppContent: React.FC = () => {
  const { currentPage, selectedPautaId } = useNavigation();

  const renderPage = () => {
    switch (currentPage) {
      case 'advogados':
        return (
          <Layout>
            <h1>Advogados</h1>
            <p>Página de advogados será desenvolvida aqui.</p>
          </Layout>
        );
      case 'pautas':
        return <Pautas />;
      case 'detalhes-pauta':
        return <DetalhesPauta pautaId={selectedPautaId || ''} />;
      case 'audiencias':
        return (
          <Layout>
            <h1>Audiências</h1>
            <p>Página de audiências será desenvolvida aqui.</p>
          </Layout>
        );
      case 'pautistas':
        return <Pautista />;
      case 'avaliadores':
        return <Avaliador />;
      case 'importar-planilha':
        return <ImportarPlanilha />;
      case 'pautista':
        return (
          <Layout>
            <h1>Escalar Pautista</h1>
            <p>Página para escalar pautista será desenvolvida aqui.</p>
          </Layout>
        );
      case 'avaliador':
        return (
          <Layout>
            <h1>Escalar Avaliador</h1>
            <p>Página para escalar avaliador será desenvolvida aqui.</p>
          </Layout>
        );
      case 'escala-avaliadores':
        return <EscalaAvaliadores />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar />
      {renderPage()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        } />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
