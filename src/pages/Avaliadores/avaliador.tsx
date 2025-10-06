import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import Layout from '../../components/Layout';
import CadastroAvaliador from './CadastroAvaliador';
import EdicaoAvaliador from './EdicaoAvaliador';
import DetalhesAvaliador from './DetalhesAvaliador';
import avaliadorService from '../../services/avaliadorService';
import type { PageResponse, AvaliadorResponseDTO } from '../../services/avaliadorService';
import './avaliador.css';
import './sweetalert-custom.css';

export type AvaliadorData = AvaliadorResponseDTO;

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

  const handleExcluirAvaliador = (avaliadorId: number) => {
    // Verificar se o ID é válido
    if (!avaliadorId) {
      Swal.fire({
        title: 'Erro!',
        text: 'ID do avaliador não encontrado.',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    Swal.fire({
      title: 'Confirmação',
      text: 'Tem certeza que deseja excluir este avaliador?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          console.log(`Enviando requisição para excluir avaliador ID: ${avaliadorId}`);
          await avaliadorService.deletarAvaliador(avaliadorId);
          
          Swal.fire({
            title: 'Excluído!',
            text: 'O avaliador foi excluído com sucesso.',
            icon: 'success',
            confirmButtonColor: '#3085d6'
          });
          
          // Recarregar a lista de avaliadores
          carregarAvaliadores();
        } catch (error) {
          console.error('Erro ao excluir avaliador:', error);
          Swal.fire({
            title: 'Erro!',
            text: 'Não foi possível excluir o avaliador.',
            icon: 'error',
            confirmButtonColor: '#3085d6'
          });
        } finally {
          setLoading(false);
        }
      }
    });
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
            <div key={avaliador.id} className="avaliador-card" onClick={() => handleVerDetalhes(avaliador)}>
              <div className="avaliador-avatar">
                <div className="avatar-placeholder">
                  {avaliador.nome.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
              </div>
              
              <div className="avaliador-content">
                <div className="avaliador-main-info">
                  <div className="avaliador-details">
                    <span className="avaliador-setor">{avaliador.nome}</span>
                    <span className="separator">•</span>
                    <span className="avaliador-unidade">{avaliador.setor}</span>
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
                      // Verificar e registrar o valor do ID antes de chamar a função
                      console.log('ID do avaliador a ser excluído:', avaliador?.id);
                      if (avaliador && typeof avaliador.id === 'number') {
                        handleExcluirAvaliador(avaliador.id);
                      } else {
                        console.error('ID do avaliador inválido:', avaliador?.id);
                        Swal.fire({
                          title: 'Erro!',
                          text: 'ID do avaliador não encontrado.',
                          icon: 'error'
                        });
                      }
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
