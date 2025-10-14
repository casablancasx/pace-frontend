import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAuthorization } from '../../contexts/AuthorizationContext';
import AssuntoAutocomplete from '../../components/AssuntoAutocomplete';
import pautaService from '../../services/pautaService';
import type { PautaResponseDTO, SalaResponse, UfResponse, OrgaoJulgadorResponse } from '../../services/pautaService';
import './minhasPautas.css';

// Helper para obter classe CSS baseada no valor de análise
const obterClasseAnalise = (valor: string): string => {
  const valorUpper = valor?.toUpperCase().trim();
  if (valorUpper === 'COMPARECIMENTO') return 'comparecer';
  if (valorUpper === 'NAO_COMPARECIMENTO') return 'nao-comparecer';
  return 'pendente';
};

interface MinhasPautasProps {}

const MinhasPautas: React.FC<MinhasPautasProps> = () => {
  const { userData, isAdmin } = useAuthorization();
  const { navigateToPautaDetails } = useNavigation();

  const [pautas, setPautas] = useState<PautaResponseDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [orgaoJulgadorId, setOrgaoJulgadorId] = useState<number | null>(null);
  const [salaId, setSalaId] = useState<number | null>(null);
  const [salas, setSalas] = useState<SalaResponse[]>([]);
  const [loadingSalas, setLoadingSalas] = useState(false);
  const [ufs, setUfs] = useState<UfResponse[]>([]);
  const [loadingUfs, setLoadingUfs] = useState(false);
  const [ufId, setUfId] = useState<number | null>(null);
  const [orgaosJulgadores, setOrgaosJulgadores] = useState<OrgaoJulgadorResponse[]>([]);
  const [loadingOrgaosJulgadores, setLoadingOrgaosJulgadores] = useState(false);
  const [_assuntoId, setAssuntoId] = useState<number | null>(null);
  const [assuntoInputValue, setAssuntoInputValue] = useState('');
  const [prioritarias, setPrioritarias] = useState<boolean | undefined>(undefined);

  // Filtros
  const [filtros, setFiltros] = useState({
    resultadoAnalise: '',
  });

  // Função para buscar pautas da API
  const carregarPautas = async () => {
    setIsLoading(true);
    try {
      // Se não for admin, passa o sapiensId do usuário como avaliadorId
      const avaliadorId = isAdmin ? undefined : userData?.sapiensId;

      const response = await pautaService.listarPautas({
        page: currentPage,
        size: itemsPerPage,
        resultadoAnalise: filtros.resultadoAnalise || undefined,
        ufId: ufId || undefined,
        orgaoJulgadorId: orgaoJulgadorId || undefined,
        salaId: salaId || undefined,
        assuntoId: _assuntoId || undefined,
        prioritarias: prioritarias,
        avaliadorId: avaliadorId,
      });

      setPautas(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Erro ao carregar pautas:', error);
      setPautas([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega pautas quando a página ou filtros mudam
  useEffect(() => {
    if (userData) {
      carregarPautas();
    }
  }, [currentPage, itemsPerPage, filtros.resultadoAnalise, ufId, orgaoJulgadorId, salaId, _assuntoId, prioritarias, userData]);

  // Carrega UFs disponíveis na inicialização
  useEffect(() => {
    const carregarUfs = async () => {
      setLoadingUfs(true);
      try {
        const response = await pautaService.listarUfs();
        setUfs(response);
      } catch (error) {
        console.error('Erro ao carregar UFs:', error);
        setUfs([]);
      } finally {
        setLoadingUfs(false);
      }
    };

    carregarUfs();
  }, []);

  // Carrega Órgãos Julgadores quando UF é selecionada
  useEffect(() => {
    if (!ufId) {
      setOrgaosJulgadores([]);
      setOrgaoJulgadorId(null);
      return;
    }

    const carregarOrgaosJulgadores = async () => {
      setLoadingOrgaosJulgadores(true);
      try {
        const response = await pautaService.listarOrgaosJulgadoresPorUf(ufId);
        setOrgaosJulgadores(response);
      } catch (error) {
        console.error('Erro ao carregar órgãos julgadores:', error);
        setOrgaosJulgadores([]);
      } finally {
        setLoadingOrgaosJulgadores(false);
      }
    };

    carregarOrgaosJulgadores();
  }, [ufId]);

  // Carrega Salas quando Órgão Julgador é selecionado
  useEffect(() => {
    if (!orgaoJulgadorId) {
      setSalas([]);
      setSalaId(null);
      return;
    }

    const carregarSalas = async () => {
      setLoadingSalas(true);
      try {
        const response = await pautaService.listarSalasPorOrgaoJulgador(orgaoJulgadorId);
        setSalas(response);
      } catch (error) {
        console.error('Erro ao carregar salas:', error);
        setSalas([]);
      } finally {
        setLoadingSalas(false);
      }
    };

    carregarSalas();
  }, [orgaoJulgadorId]);

  const handleViewPauta = (pauta: PautaResponseDTO) => {
    navigateToPautaDetails(pauta.pautaId.toString());
  };

  const handleFilterChange = (key: string, value: string) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const renderPaginacao = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
        >
          {i + 1}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(0)}
          disabled={currentPage === 0}
          className="pagination-button"
        >
          Primeira
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="pagination-button"
        >
          Anterior
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="pagination-button"
        >
          Próxima
        </button>
        <button
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
          className="pagination-button"
        >
          Última
        </button>
      </div>
    );
  };

  return (
    <Layout>
      <div className="pautas-page">
        <div className="pautas-header">
          <h1 className="page-title">Minhas Pautas</h1>
          {!isAdmin && userData && (
            <p className="subtitle">Pautas onde você está escalado como avaliador</p>
          )}
        </div>

        {/* Filtros */}
        <div className="pautas-filters">
          <div className="filters-grid">
            <select
              value={filtros.resultadoAnalise}
              onChange={(e) => handleFilterChange('resultadoAnalise', e.target.value)}
              className="filter-select"
            >
              <option value="">Resultado da Análise</option>
              <option value="COMPARECIMENTO">Comparecimento</option>
              <option value="NAO_COMPARECIMENTO">Não Comparecimento</option>
              <option value="ANALISE_PENDENTE">Análise Pendente</option>
            </select>

            <select
              value={ufId || ''}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : null;
                setUfId(value);
                setOrgaoJulgadorId(null);
                setSalaId(null);
                setCurrentPage(0);
              }}
              className="filter-select"
              disabled={loadingUfs}
            >
              <option value="">Selecione a UF</option>
              {ufs.map(uf => (
                <option key={uf.ufId} value={uf.ufId}>{uf.sigla}</option>
              ))}
            </select>

            <select
              value={orgaoJulgadorId || ''}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : null;
                setOrgaoJulgadorId(value);
                setSalaId(null);
                setCurrentPage(0);
              }}
              className="filter-select"
              disabled={!ufId || loadingOrgaosJulgadores}
            >
              <option value="">Selecione o Órgão Julgador</option>
              {orgaosJulgadores.map(orgao => (
                <option key={orgao.orgaoJulgadorId} value={orgao.orgaoJulgadorId}>
                  {orgao.nome}
                </option>
              ))}
            </select>

            <select
              value={salaId || ''}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : null;
                setSalaId(value);
                setCurrentPage(0);
              }}
              className="filter-select"
              disabled={!orgaoJulgadorId || loadingSalas}
            >
              <option value="">Selecione a Sala</option>
              {salas.map(sala => (
                <option key={sala.salaId} value={sala.salaId}>{sala.sala}</option>
              ))}
            </select>

            <AssuntoAutocomplete
              value={assuntoInputValue}
              onChange={(newValue) => {
                setAssuntoInputValue(newValue);
                setCurrentPage(0);
              }}
              onSelect={(assunto) => {
                setAssuntoId(assunto.assuntoId);
                setCurrentPage(0);
              }}
              placeholder="Digite o assunto..."
            />

            <select
              value={prioritarias === undefined ? '' : prioritarias ? 'true' : 'false'}
              onChange={(e) => {
                const value = e.target.value === '' ? undefined : e.target.value === 'true';
                setPrioritarias(value);
                setCurrentPage(0);
              }}
              className="filter-select"
            >
              <option value="">Todas as Pautas</option>
              <option value="true">Prioritárias</option>
              <option value="false">Não Prioritárias</option>
            </select>
          </div>
        </div>

        {/* Tabela de Pautas */}
        <div className="pautas-table-container">
          {isLoading ? (
            <div className="loading-message">Carregando pautas...</div>
          ) : (
            <>
              <table className="pautas-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Órgão Julgador</th>
                    <th>Turno</th>
                    <th>Sala</th>
                    <th>Análise Comparecimento</th>
                    <th>Audiências</th>
                  </tr>
                </thead>
                <tbody>
                  {pautas.map((pauta) => (
                    <tr 
                      key={pauta.pautaId} 
                      className="pauta-row clickable" 
                      onClick={() => handleViewPauta(pauta)}
                    >
                      <td>{pauta.data}</td>
                      <td>{pauta.orgaoJulgador}</td>
                      <td>{pauta.turno}</td>
                      <td>{pauta.sala}</td>
                      <td>
                        <span className={`status-badge ${obterClasseAnalise(pauta.analiseComparecimento)}`}>
                          {pauta.analiseComparecimento || 'ANALISE_PENDENTE'}
                        </span>
                      </td>
                      <td>{pauta.audiencias.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {pautas.length === 0 && (
                <div className="empty-state">
                  <p>Nenhuma pauta encontrada.</p>
                </div>
              )}

              {renderPaginacao()}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MinhasPautas;
