import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, MapPin, Trash2 } from 'lucide-react';
import Layout from '../../components/Layout';
import './advogados.css';
import advogadoService from '../../services/advogadoService';
import type { AdvogadoResponseDTO, PageResponse } from '../../services/advogadoService';
import Swal from 'sweetalert2';

export interface AdvogadoData {
  id: number;
  nome: string;
  ufs: string[];
  isPrioritario: boolean;
  totalAudiencias?: number; // Campo opcional para manter compatibilidade
}

interface AdvogadosProps {
  onCadastrarAdvogado?: () => void;
  onViewAdvogado?: (advogado: AdvogadoData) => void;
}

// Não usamos mais dados mockados, agora vamos usar a API

const Advogados: React.FC<AdvogadosProps> = ({ onCadastrarAdvogado, onViewAdvogado }) => {
  const [advogadosPage, setAdvogadosPage] = useState<PageResponse<AdvogadoResponseDTO> | null>(null);
  const [advogados, setAdvogados] = useState<AdvogadoData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // API é baseada em 0
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [apenasAdvogadosPrioritarios, setApenasAdvogadosPrioritarios] = useState(false);

  // Efeito para carregar advogados quando a página é montada ou filtros mudam
  useEffect(() => {
    loadAdvogados();
  }, [currentPage, itemsPerPage, apenasAdvogadosPrioritarios]);

  // Carrega lista de advogados
  const loadAdvogados = async () => {
    try {
      setIsLoading(true);
      const result = await advogadoService.listarAdvogados(
        currentPage,
        itemsPerPage,
        apenasAdvogadosPrioritarios
      );
      setAdvogadosPage(result);
      setAdvogados(result.content);
    } catch (error) {
      console.error('Erro ao carregar advogados:', error);
      // Removido popup de erro, apenas log no console
    } finally {
      setIsLoading(false);
    }
  };

  // Filtra advogados pelo termo de busca
  const filteredAdvogados = useMemo(() => {
    if (!searchTerm.trim()) return advogados;
    
    return advogados.filter(advogado =>
      advogado.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (advogado.ufs && advogado.ufs.some(uf => 
        uf.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
  }, [advogados, searchTerm]);

  // Manipula mudança de página na paginação
  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Manipula mudança no filtro de prioritários
  const handlePrioritariosChange = (isPrioritario: boolean) => {
    setApenasAdvogadosPrioritarios(isPrioritario);
    setCurrentPage(0); // Volta para a primeira página
  };

  // Manipula visualização de detalhes de advogado
  const handleViewAdvogado = (advogado: AdvogadoData) => {
    if (onViewAdvogado) {
      onViewAdvogado(advogado);
    }
  };

  // Manipula exclusão de advogado
  const handleDeleteAdvogado = (id: number, nome: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!id) {
      console.error('ID do advogado não fornecido para exclusão');
      return;
    }

    Swal.fire({
      title: 'Confirmar exclusão',
      text: `Deseja realmente excluir o advogado "${nome}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'my-swal'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await advogadoService.deletarAdvogado(id);
          await loadAdvogados();
          
          Swal.fire({
            title: 'Excluído!',
            text: `Advogado ${nome} foi removido com sucesso.`,
            icon: 'success',
            customClass: {
              container: 'my-swal'
            }
          });
        } catch (error) {
          console.error('Erro ao excluir advogado:', error);
          Swal.fire({
            title: 'Erro!',
            text: 'Não foi possível excluir o advogado.',
            icon: 'error',
            customClass: {
              container: 'my-swal'
            }
          });
        }
      }
    });
  };

  // Função de paginação simplificada de acordo com o novo design

  return (
    <Layout>
      <div className="advogados-page">
        <h1 className="advogados-title">Gerenciamento de Advogados</h1>
        
        <div className="advogados-controls">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Pesquisar advogado por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <label className="filter-label">
              <input
                type="checkbox"
                checked={apenasAdvogadosPrioritarios}
                onChange={(e) => handlePrioritariosChange(e.target.checked)}
                className="filter-checkbox"
              />
              <span>Apenas prioritários</span>
            </label>
          </div>
          
          <button
            onClick={onCadastrarAdvogado}
            className="create-button"
          >
            <Plus size={16} />
            Cadastrar Advogado
          </button>
        </div>

        {isLoading && (
          <div className="loading-container">
            <p>Carregando advogados...</p>
          </div>
        )}

        {!isLoading && filteredAdvogados.length === 0 && (
          <div className="empty-state">
            <p>Nenhum advogado encontrado.</p>
          </div>
        )}

        {!isLoading && filteredAdvogados.length > 0 && (
          <div className="advogados-list">
            {filteredAdvogados.map((advogado) => (
              <div key={advogado.id} className="advogado-card" onClick={() => handleViewAdvogado(advogado)}>
                <div className="advogado-avatar">
                  <div className="avatar-placeholder">
                    {advogado.nome.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                </div>
                
                <div className="advogado-content">
                  <div className="advogado-main-info">
                    <div className="advogado-details">
                      <span className="advogado-nome">{advogado.nome}</span>
                    </div>
                    <div className="advogado-ufs">
                      <span className="uf-label">
                        <MapPin size={12} />
                      </span>
                      <span className="uf-list">
                        {advogado.ufs?.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="advogado-status">
                  <span className={`status-badge ${advogado.isPrioritario ? 'prioritario' : 'normal'}`}>
                    {advogado.isPrioritario ? 'Prioritário' : 'Normal'}
                  </span>
                  <div className="actions-container">
                    <button 
                      className="action-button delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAdvogado(advogado.id, advogado.nome, e);
                      }}
                      title="Excluir advogado"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && advogadosPage && advogadosPage.totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handleChangePage(Math.max(currentPage - 1, 0))}
              disabled={currentPage === 0}
              className="pagination-button"
            >
              Anterior
            </button>
            
            <span className="pagination-info">
              Página {currentPage + 1} de {advogadosPage.totalPages}
            </span>
            
            <button
              onClick={() => handleChangePage(Math.min(currentPage + 1, advogadosPage.totalPages - 1))}
              disabled={currentPage >= advogadosPage.totalPages - 1}
              className="pagination-button"
            >
              Próxima
            </button>
          </div>
        )}

        {!isLoading && advogadosPage && advogadosPage.content.length > 0 && (
          <div className="pagination-summary">
            <span className="pagination-summary-text">
              Mostrando {advogadosPage.content.length > 0 ? (advogadosPage.page * advogadosPage.size) + 1 : 0} até{' '}
              {Math.min((advogadosPage.page + 1) * advogadosPage.size, advogadosPage.totalElements)} de{' '}
              {advogadosPage.totalElements} advogados
            </span>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Advogados;
