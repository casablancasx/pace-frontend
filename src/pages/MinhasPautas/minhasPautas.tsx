import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Layout from '../../components/Layout';
import { useNavigation } from '../../contexts/NavigationContext';
import AdicionarAnaliseModal from '../Pautas/AdicionarAnaliseModal';
import './minhasPautas.css';

export interface AudienciaResponseDTO {
  numeroProcesso: string;
  hora: string;
  nomeParte: string;
  advogados: string[];
  assunto: string;
  classeJudicial: string;
  prioridade: string;
  analise: string;
}

export interface PautaResponseDTO {
  pautaId: number;
  data: string;
  orgaoJulgador: string;
  turno: string;
  sala: string;
  respostaAnalise: string;
  audiencias: AudienciaResponseDTO[];
}

interface MinhasPautasProps {}



const MinhasPautas: React.FC<MinhasPautasProps> = () => {
  const [pautas, setPautas] = useState<PautaResponseDTO[]>(mockPautas);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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

  const filteredPautas = useMemo(() => {
    return pautas.filter(pauta => {
      const matchesResultado = !filtros.resultadoAnalise || pauta.respostaAnalise === filtros.resultadoAnalise;
      const matchesOrgao = !filtros.orgaoJulgador || pauta.orgaoJulgador.toLowerCase().includes(filtros.orgaoJulgador.toLowerCase());
      const matchesSearch = !filtros.searchTerm || 
        pauta.orgaoJulgador.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
        pauta.audiencias.some(aud => 
          aud.numeroProcesso.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
          aud.nomeParte.toLowerCase().includes(filtros.searchTerm.toLowerCase())
        );
      
      return matchesResultado && matchesOrgao && matchesSearch;
    });
  }, [pautas, filtros]);

  const totalPages = Math.ceil(filteredPautas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPautas = filteredPautas.slice(startIndex, startIndex + itemsPerPage);

  const { navigateToPautaDetails } = useNavigation();
  
  const handleViewPauta = (pauta: PautaResponseDTO) => {
    navigateToPautaDetails(pauta.pautaId.toString());
  };

  const handleFilterChange = (key: string, value: string) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleAddAnalise = (audiencia: AudienciaResponseDTO) => {
    setModalAnalise({
      isOpen: true,
      audiencia: audiencia
    });
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
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          First
        </button>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
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
          <h1 className="page-title">Minhas Pautas</h1>
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
              <option value="COMPARECIMENTO">Comparecimento</option>
              <option value="NAO_COMPARECIMENTO">Não Comparecimento</option>
              <option value="ANALISE_PENDENTE">Análise Pendente</option>
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
                <th>Resposta Análise</th>
                <th>Audiências</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentPautas.map((pauta) => (
                <tr key={pauta.pautaId} className="pauta-row clickable" onClick={() => handleViewPauta(pauta)}>
                  <td>{pauta.data}</td>
                  <td>{pauta.orgaoJulgador}</td>
                  <td>{pauta.turno}</td>
                  <td>
                    <span className={`status-badge ${
                      pauta.respostaAnalise === 'COMPARECER' ? 'comparecer' :
                      pauta.respostaAnalise === 'NÃO COMPARECER' ? 'nao-comparecer' : 'pendente'
                    }`}>
                      {pauta.respostaAnalise}
                    </span>
                  </td>
                  <td>{pauta.audiencias.length}</td>
                  <td>
                    {/* Ações futuras podem ser adicionadas aqui */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentPautas.length === 0 && (
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

export default MinhasPautas;