import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import Layout from '../../components/Layout';
import { useNavigation } from '../../contexts/NavigationContext';
import AdicionarAnaliseModal from './AdicionarAnaliseModal';
import AssuntoAutocomplete from '../../components/AssuntoAutocomplete';
import pautaService from '../../services/pautaService';
import type { PautaResponseDTO, AudienciaResponseDTO, SalaResponse, UfResponse, OrgaoJulgadorResponse } from '../../services/pautaService';
import './pautas.css';

interface PautasProps {}

const Pautas: React.FC<PautasProps> = () => {
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
        ufId: ufId || undefined,
        orgaoJulgadorId: orgaoJulgadorId || undefined,
        salaId: salaId || undefined,
        assuntoId: _assuntoId || undefined,
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
  }, [currentPage, itemsPerPage, filtros.resultadoAnalise, ufId, orgaoJulgadorId, salaId, _assuntoId]);

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

  // Carrega órgãos julgadores quando a UF mudar
  useEffect(() => {
    const carregarOrgaosJulgadores = async () => {
      if (!ufId) {
        setOrgaosJulgadores([]);
        setOrgaoJulgadorId(null);
        return;
      }

      setLoadingOrgaosJulgadores(true);
      console.log('Carregando órgãos julgadores para ufId:', ufId);
      try {
        const response = await pautaService.listarOrgaosJulgadoresPorUf(ufId);
        console.log('Órgãos julgadores carregados:', response);
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

  // Carrega salas quando o órgão julgador mudar
  useEffect(() => {
    const carregarSalas = async () => {
      if (!orgaoJulgadorId) {
        setSalas([]);
        setSalaId(null);
        return;
      }

      setLoadingSalas(true);
      console.log('Carregando salas para orgaoJulgadorId:', orgaoJulgadorId);
      try {
        const response = await pautaService.listarSalasPorOrgaoJulgador(orgaoJulgadorId);
        console.log('Salas carregadas:', response);
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
              value={ufId || ''}
              onChange={(e) => {
                const selectedUfId = e.target.value ? Number(e.target.value) : null;
                setUfId(selectedUfId);
                // Encontra a sigla da UF selecionada
                const selectedUf = ufs.find(uf => uf.ufId === selectedUfId);
                handleFilterChange('uf', selectedUf?.sigla || '');
                // Limpa órgão julgador e sala ao mudar UF
                setOrgaoJulgadorId(null);
                setSalaId(null);
                handleFilterChange('orgaoJulgador', '');
                setCurrentPage(0);
              }}
              className="filter-select"
              disabled={loadingUfs}
            >
              <option value="">{loadingUfs ? 'Carregando...' : 'UF'}</option>
              {ufs.map((uf) => (
                <option key={uf.ufId} value={uf.ufId}>
                  {uf.sigla}
                </option>
              ))}
            </select>

            <select
              value={orgaoJulgadorId || ''}
              onChange={(e) => {
                const selectedOrgaoId = e.target.value ? Number(e.target.value) : null;
                setOrgaoJulgadorId(selectedOrgaoId);
                // Atualiza o nome do órgão julgador no filtro para exibição
                const orgaoSelecionado = orgaosJulgadores.find(o => o.orgaoJulgadorId === selectedOrgaoId);
                handleFilterChange('orgaoJulgador', orgaoSelecionado?.nome || '');
                // Limpa sala ao mudar órgão julgador
                setSalaId(null);
                setCurrentPage(0);
              }}
              className="filter-select"
              disabled={!ufId || loadingOrgaosJulgadores}
            >
              <option value="">
                {loadingOrgaosJulgadores ? 'Carregando órgãos...' : 
                 !ufId ? 'Selecione a UF' : 
                 orgaosJulgadores.length === 0 ? 'Nenhum órgão disponível' :
                 'Órgão Julgador'}
              </option>
              {orgaosJulgadores.map((orgao) => (
                <option key={orgao.orgaoJulgadorId} value={orgao.orgaoJulgadorId}>
                  {orgao.nome}
                </option>
              ))}
            </select>

        

            <select
              value={salaId || ''}
              onChange={(e) => {
                const selectedSalaId = e.target.value ? Number(e.target.value) : null;
                setSalaId(selectedSalaId);
                // Atualiza o nome da sala no filtro para exibição
                const salaSelecionada = salas.find(s => s.salaId === selectedSalaId);
                handleFilterChange('sala', salaSelecionada?.sala || '');
              }}
              className="filter-select"
              disabled={!orgaoJulgadorId || loadingSalas}
            >
              <option value="">
                {loadingSalas ? 'Carregando salas...' : 
                 !orgaoJulgadorId ? 'Selecione o órgão julgador' : 
                 salas.length === 0 ? 'Nenhuma sala disponível' :
                 'Sala'}
              </option>
              {salas.map((sala) => (
                <option key={sala.salaId} value={sala.salaId}>
                  {sala.sala}
                </option>
              ))}
            </select>

            <AssuntoAutocomplete
              value={assuntoInputValue}
              onChange={(newValue) => {
                setAssuntoInputValue(newValue);
                // Se o campo foi limpo, remove o filtro de assunto
                if (!newValue || newValue.trim() === '') {
                  setAssuntoId(null);
                  handleFilterChange('assunto', '');
                }
              }}
              onSelect={(assunto) => {
                setAssuntoId(assunto.assuntoId);
                setAssuntoInputValue(assunto.assunto);
                handleFilterChange('assunto', assunto.assunto);
              }}
              placeholder="Digite o assunto"
              minLength={3}
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