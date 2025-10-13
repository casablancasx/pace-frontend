import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import Layout from '../../components/Layout';
import { useNavigation } from '../../contexts/NavigationContext';
import AdicionarAnaliseModal from './AdicionarAnaliseModal';
import pautaService from '../../services/pautaService';
import type { PautaResponseDTO, AudienciaResponseDTO } from '../../services/pautaService';
import './pautas.css';

interface PautasProps {}

const Pautas: React.FC<PautasProps> = () => {
  const [pautas, setPautas] = useState<PautaResponseDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modalAnalise, setModalAnalise] = useState<{
    isOpen: boolean;
    audiencia: AudienciaResponseDTO | null;
  }>({
    isOpen: false,
    audiencia: null
  });
  

  
  // Filtros
  const [filtros, setFiltros] = useState({
    resultadoAnalise: '',
    uf: '',
    orgaoJulgador: '',
    sala: '',
    assunto: '',
    searchTerm: ''
  });

  const { navigateToPautaDetails } = useNavigation();

  // Função para buscar pautas da API
  const carregarPautas = async () => {
    setIsLoading(true);
    try {
      const response = await pautaService.listarPautas({
        page: currentPage,
        size: itemsPerPage,
        resultadoAnalise: filtros.resultadoAnalise || undefined,
        uf: filtros.uf || undefined,
        orgaoJulgador: filtros.orgaoJulgador || undefined,
        sala: filtros.sala || undefined,
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
    carregarPautas();
  }, [currentPage, itemsPerPage, filtros.resultadoAnalise, filtros.uf, filtros.orgaoJulgador, filtros.sala]);

  // Filtro local para busca de texto (search term)
  const filteredPautas = useMemo(() => {
    if (!filtros.searchTerm) return pautas;
    
    return pautas.filter(pauta => {
      const matchesSearch = 
        pauta.orgaoJulgador.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
        pauta.audiencias.some(aud => 
          aud.numeroProcesso.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
          aud.nomeParte.toLowerCase().includes(filtros.searchTerm.toLowerCase())
        );
      
      return matchesSearch;
    });
  }, [pautas, filtros.searchTerm]);
  
  const handleViewPauta = (pauta: PautaResponseDTO) => {
    navigateToPautaDetails(pauta.pautaId.toString());
  };

  const handleFilterChange = (key: string, value: string) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0); // Volta para a primeira página ao filtrar
  };

  const handleSaveAnalise = (numeroProcesso: string, novaAnalise: string) => {
    setPautas(prev => prev.map(pauta => ({
      ...pauta,
      audiencias: pauta.audiencias.map(aud => 
        aud.numeroProcesso === numeroProcesso 
          ? { ...aud, analise: novaAnalise }
          : aud
      )
    })));
    
    setModalAnalise({
      isOpen: false,
      audiencia: null
    });
  };

  const handleCloseModal = () => {
    setModalAnalise({
      isOpen: false,
      audiencia: null
    });
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
          onClick={() => setCurrentPage(i)}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
        >
          {i + 1}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(0)}
          disabled={currentPage === 0}
          className="pagination-button"
        >
          First
        </button>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 0}
          className="pagination-button"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="pagination-button"
        >
          Next
        </button>
        <button
          onClick={() => setCurrentPage(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
          className="pagination-button"
        >
          Last
        </button>
      </div>
    );
  };

  return (
    <Layout>
      <div className="pautas-page">
        <div className="pautas-header">
          <h1 className="page-title">Pautas</h1>
        </div>

        {/* Filtros */}
        <div className="pautas-filters">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por órgão julgador, processo ou parte..."
              value={filtros.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-grid">
            <select
              value={filtros.resultadoAnalise}
              onChange={(e) => handleFilterChange('resultadoAnalise', e.target.value)}
              className="filter-select"
            >
              <option value="">Resultado da Análise</option>
              <option value="COMPARECER">Comparecer</option>
              <option value="NÃO COMPARECER">Não Comparecer</option>
              <option value="PENDENTE">Pendente</option>
            </select>

            <select
              value={filtros.uf}
              onChange={(e) => handleFilterChange('uf', e.target.value)}
              className="filter-select"
            >
              <option value="">UF</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="MG">Minas Gerais</option>
            </select>

            <input
              type="text"
              placeholder="Órgão Julgador"
              value={filtros.orgaoJulgador}
              onChange={(e) => handleFilterChange('orgaoJulgador', e.target.value)}
              className="filter-input"
            />

            <input
              type="text"
              placeholder="Sala"
              value={filtros.sala}
              onChange={(e) => handleFilterChange('sala', e.target.value)}
              className="filter-input"
            />

            <input
              type="text"
              placeholder="Assunto"
              value={filtros.assunto}
              onChange={(e) => handleFilterChange('assunto', e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        {/* Tabela de Pautas Minimalista */}
        <div className="pautas-table-container">
          <table className="pautas-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Órgão Julgador</th>
                <th>Turno</th>
                <th>Análise Comparecimento</th>
                <th>Audiências</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    Carregando...
                  </td>
                </tr>
              ) : (
                filteredPautas.map((pauta: PautaResponseDTO) => (
                  <tr key={pauta.pautaId} className="pauta-row clickable" onClick={() => handleViewPauta(pauta)}>
                    <td>{pauta.data}</td>
                    <td>{pauta.orgaoJulgador}</td>
                    <td>{pauta.turno}</td>
                    <td>
                      <span className={`status-badge ${
                        pauta.analiseComparecimento === 'COMPARECER' ? 'comparecer' :
                        pauta.analiseComparecimento === 'NÃO COMPARECER' ? 'nao-comparecer' : 'pendente'
                      }`}>
                        {pauta.analiseComparecimento}
                      </span>
                    </td>
                    <td>{pauta.audiencias.length}</td>
                    <td>
                      {/* Ações futuras podem ser adicionadas aqui */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!isLoading && filteredPautas.length === 0 && (
            <div className="empty-state">
              <h3>Nenhuma pauta encontrada</h3>
              <p>Tente ajustar os filtros de busca.</p>
            </div>
          )}
        </div>

        {renderPaginacao()}

        {/* Modal de Adicionar Análise */}
        {modalAnalise.audiencia && (
          <AdicionarAnaliseModal
            audiencia={modalAnalise.audiencia}
            isOpen={modalAnalise.isOpen}
            onClose={handleCloseModal}
            onSave={handleSaveAnalise}
          />
        )}


      </div>
    </Layout>
  );
};

export default Pautas;