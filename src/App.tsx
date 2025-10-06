import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { AuthorizationProvider } from './contexts/AuthorizationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Avaliador from './pages/Avaliadores/avaliador';
import Pautista from './pages/Pautistas/pautista';
import EscalaAvaliadores from './pages/EscalaAvaliadores';
import ImportarPlanilha from './components/ImportarPlanilha';
import Pautas from './pages/Pautas';
import DetalhesPauta from './pages/Pautas/DetalhesPauta';
import MinhasPautas from './pages/MinhasPautas';
import { Advogados, CadastroAdvogado } from './pages/Advogados';
import Login from './pages/Login/Login';
import './App.css';

const AppContent: React.FC = () => {
  const { currentPage, selectedPautaId } = useNavigation();

  const renderPage = () => {
    switch (currentPage) {
      case 'advogados':
        return <Advogados onCadastrarAdvogado={() => window.location.href = "/cadastro-advogado"} />;
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
      case 'minhas-pautas':
        return <MinhasPautas />;
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
      <AuthorizationProvider>
        <NavigationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/advogados" element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            } />
            <Route path="/cadastro-advogado" element={
              <ProtectedRoute>
                <div className="app">
                  <Sidebar />
                  <CadastroAdvogado />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/*" element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            } />
          </Routes>
        </NavigationProvider>
      </AuthorizationProvider>
    </ThemeProvider>
  );
};

export default App;
