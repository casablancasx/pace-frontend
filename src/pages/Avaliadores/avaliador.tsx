import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import Layout from '../../components/Layout';
import CadastroAvaliador from './CadastroAvaliador';
import EdicaoAvaliador from './EdicaoAvaliador';
import DetalhesAvaliador from './DetalhesAvaliador';
import avaliadorService from '../../services/avaliadorService';
import type { PageResponse } from '../../services/avaliadorService';
import './avaliador.css';

export interface AvaliadorData {
  avaliadorId: number;
  nome: string;
  telefone: string;
  email: string;
  setor: string;
  unidade: string;
  sapiensId: number;
  quantidadeAudiencias: number;
  quantidadePautas: number;
  score: number;
  disponivel: boolean;
  adicionadoPor: string;
}

const Avaliador: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nome');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [showCadastro, setShowCadastro] = useState(false);
  const [showEdicao, setShowEdicao] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [avaliadorEditando, setAvaliadorEditando] = useState<AvaliadorData | null>(null);
  const [avaliadorSelecionado, setAvaliadorSelecionado] = useState<AvaliadorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageResponse, setPageResponse] = useState<PageResponse<AvaliadorData>>({
    content: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Carregar avaliadores da API
  const carregarAvaliadores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await avaliadorService.listarAvaliadores(
        currentPage,
        pageSize,
        searchTerm || undefined,
        sortBy
      );

      setPageResponse(response);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar avaliadores');
      console.error('Erro ao carregar avaliadores:', err);
    } finally {
      setLoading(false);
    }
  };

  // Recarregar quando mudar página, busca ou ordenação
  useEffect(() => {
    carregarAvaliadores();
  }, [currentPage, pageSize, searchTerm, sortBy]);

  // Funções para gerenciar avaliadores
  const handleEditarAvaliador = (avaliador: AvaliadorData) => {
    setAvaliadorEditando(avaliador);
    setShowEdicao(true);
  };

  const handleExcluirAvaliador = (_avaliadorId: number) => {
    // TODO: Implementar método de exclusão no serviço
    alert('Funcionalidade de exclusão ainda não implementada');
  };

  const handleVerDetalhes = (avaliador: AvaliadorData) => {
    setAvaliadorSelecionado(avaliador);
    setShowDetalhes(true);
  };

  const handleVoltarDetalhes = () => {
    setShowDetalhes(false);
    setAvaliadorSelecionado(null);
  };

  const handleSalvarEdicao = () => {
    carregarAvaliadores(); // Recarregar lista após edição
  };

  if (showCadastro) {
    return <CadastroAvaliador onVoltar={() => {
      setShowCadastro(false);
      carregarAvaliadores();
    }} />;
  }

  if (showEdicao && avaliadorEditando) {
    return (
      <EdicaoAvaliador 
        avaliador={avaliadorEditando}
        onVoltar={() => {
          setShowEdicao(false);
          setAvaliadorEditando(null);
        }}
        onSalvar={handleSalvarEdicao}
      />
    );
  }

  if (showDetalhes && avaliadorSelecionado) {
    return (
      <DetalhesAvaliador
        avaliador={avaliadorSelecionado}
        onVoltar={handleVoltarDetalhes}
      />
    );
  }

  return (
    <Layout>
      <div className="avaliador-page">
        <h1 className="avaliador-title">Gerenciamento de Avaliadores</h1>
        
        <div className="avaliador-controls">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Pesquisar avaliador por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="nome">Ordenar por nome</option>
            <option value="setor">Ordenar por setor</option>
            <option value="audiencias">Ordenar por audiências</option>
            <option value="pautas">Ordenar por pautas</option>
          </select>
          
          <button 
            className="create-button"
            onClick={() => setShowCadastro(true)}
          >
            Cadastrar Avaliador
          </button>
        </div>

        {loading && (
          <div className="loading-container">
            <p>Carregando avaliadores...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={carregarAvaliadores}>Tentar novamente</button>
          </div>
        )}

        {!loading && !error && pageResponse.content.length === 0 && (
          <div className="empty-state">
            <p>Nenhum avaliador encontrado.</p>
          </div>
        )}

        {!loading && !error && pageResponse.content.length > 0 && (
          <div className="avaliadores-list">
            {pageResponse.content.map((avaliador: AvaliadorData) => (
            <div key={avaliador.avaliadorId} className="avaliador-card" onClick={() => handleVerDetalhes(avaliador)}>
              <div className="avaliador-avatar">
                <div className="avatar-placeholder">
                  {avaliador.nome.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
              </div>
              
              <div className="avaliador-content">
                <div className="avaliador-main-info">
                  <h3 className="avaliador-nome">{avaliador.nome}</h3>
                  <div className="avaliador-details">
                    <span className="avaliador-setor">{avaliador.setor}</span>
                    <span className="separator">•</span>
                    <span className="avaliador-unidade">{avaliador.unidade}</span>
                  </div>
                  <div className="avaliador-stats">
                    <span className="stat-item">{avaliador.quantidadeAudiencias} audiências</span>
                    <span className="separator">•</span>
                    <span className="stat-item">{avaliador.quantidadePautas} pautas</span>
                  </div>
                </div>
              </div>
              
              <div className="avaliador-status">
                <span className={`status-badge ${avaliador.disponivel ? 'disponivel' : 'indisponivel'}`}>
                  {avaliador.disponivel ? 'Disponível' : 'Afastado'}
                </span>
                <div className="actions-container">
                  <button 
                    className="action-button edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditarAvaliador(avaliador);
                    }}
                    title="Editar avaliador"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="action-button delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExcluirAvaliador(avaliador.avaliadorId);
                    }}
                    title="Excluir avaliador"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {!loading && !error && pageResponse.totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
              disabled={pageResponse.page === 0}
              className="pagination-button"
            >
              Anterior
            </button>
            
            <span className="pagination-info">
              Página {pageResponse.page + 1} de {pageResponse.totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageResponse.totalPages - 1))}
              disabled={pageResponse.page >= pageResponse.totalPages - 1}
              className="pagination-button"
            >
              Próxima
            </button>
          </div>
        )}

        {!loading && !error && pageResponse.content.length > 0 && (
          <div className="pagination-summary">
            <span className="pagination-summary-text">
              Mostrando {pageResponse.content.length > 0 ? (pageResponse.page * pageResponse.size) + 1 : 0} até{' '}
              {Math.min((pageResponse.page + 1) * pageResponse.size, pageResponse.totalElements)} de{' '}
              {pageResponse.totalElements} avaliadores
            </span>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Avaliador;
