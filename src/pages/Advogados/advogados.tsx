import React, { useState, useMemo } from 'react';
import { Search, Plus, MapPin, Trash2 } from 'lucide-react';
import Layout from '../../components/Layout';
import './advogados.css';

export interface AdvogadoData {
  advogadoId: number;
  nome: string;
  locaisQueAtua: string[];
  prioritario: boolean;
  totalAudiencias: number;
}

interface AdvogadosProps {
  onCadastrarAdvogado?: () => void;
  onViewAdvogado?: (advogado: AdvogadoData) => void;
}

const mockAdvogados: AdvogadoData[] = [
  {
    advogadoId: 1,
    nome: "Dr. Roberto Silva Santos",
    locaisQueAtua: ["SP", "RJ", "MG"],
    prioritario: true,
    totalAudiencias: 156
  },
  {
    advogadoId: 2,
    nome: "Dra. Maria Fernanda Costa",
    locaisQueAtua: ["SP", "PR"],
    prioritario: false,
    totalAudiencias: 89
  },
  {
    advogadoId: 3,
    nome: "Dr. João Carlos Oliveira",
    locaisQueAtua: ["RJ", "ES"],
    prioritario: true,
    totalAudiencias: 234
  },
  {
    advogadoId: 4,
    nome: "Dra. Ana Paula Rodrigues",
    locaisQueAtua: ["MG", "GO", "DF"],
    prioritario: false,
    totalAudiencias: 67
  },
  {
    advogadoId: 5,
    nome: "Dr. Carlos Eduardo Lima",
    locaisQueAtua: ["SP"],
    prioritario: true,
    totalAudiencias: 198
  },
  {
    advogadoId: 6,
    nome: "Dra. Patricia Mendes",
    locaisQueAtua: ["RJ", "SP"],
    prioritario: false,
    totalAudiencias: 142
  }
];

const Advogados: React.FC<AdvogadosProps> = ({ onCadastrarAdvogado, onViewAdvogado }) => {
  const [advogados, setAdvogados] = useState<AdvogadoData[]>(mockAdvogados);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Sort advogados: prioritários primeiro, depois por nome
  const sortedAdvogados = useMemo(() => {
    return [...advogados].sort((a, b) => {
      if (a.prioritario === b.prioritario) {
        return a.nome.localeCompare(b.nome);
      }
      return b.prioritario ? 1 : -1;
    });
  }, [advogados]);

  const filteredAdvogados = useMemo(() => {
    return sortedAdvogados.filter(advogado =>
      advogado.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advogado.locaisQueAtua.some(local => 
        local.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedAdvogados, searchTerm]);

  const totalPages = Math.ceil(filteredAdvogados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAdvogados = filteredAdvogados.slice(startIndex, endIndex);

  const handleViewAdvogado = (advogado: AdvogadoData) => {
    if (onViewAdvogado) {
      onViewAdvogado(advogado);
    }
  };

  const handleDeleteAdvogado = (advogadoId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir este advogado?')) {
      setAdvogados(prev => prev.filter(adv => adv.advogadoId !== advogadoId));
    }
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
      <div className="advogados-page">
        <div className="advogados-header">
          <h1 className="page-title">Advogados</h1>
          <button
            onClick={onCadastrarAdvogado}
            className="cadastrar-button"
          >
            <Plus size={20} />
            Cadastrar Advogado Prioritário
          </button>
        </div>

        <div className="advogados-filters">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nome ou local de atuação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="advogados-stats">
          <div className="stat-card">
            <span className="stat-number">{advogados.length}</span>
            <span className="stat-label">Total de Advogados</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{advogados.filter(a => a.prioritario).length}</span>
            <span className="stat-label">Prioritários</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{advogados.filter(a => !a.prioritario).length}</span>
            <span className="stat-label">Normais</span>
          </div>
        </div>

        <div className="table-container">
          <table className="advogados-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Locais de Atuação</th>
                <th>Status</th>
                <th>Total Audiências</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentAdvogados.map((advogado) => (
                <tr
                  key={advogado.advogadoId}
                  className="table-row"
                  onClick={() => handleViewAdvogado(advogado)}
                >
                  <td className="advogado-nome">{advogado.nome}</td>
                  <td className="advogado-locais">
                    <div className="locais-container">
                      {advogado.locaisQueAtua.map((local, index) => (
                        <span key={index} className="local-tag">
                          <MapPin size={12} />
                          {local}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="advogado-status">
                    <span className={`status-badge ${advogado.prioritario ? 'prioritario' : 'normal'}`}>
                      {advogado.prioritario ? 'Prioritário' : 'Normal'}
                    </span>
                  </td>
                  <td className="advogado-audiencias">
                    {advogado.totalAudiencias.toLocaleString()}
                  </td>
                  <td className="advogado-actions">
                    <button
                      onClick={(e) => handleDeleteAdvogado(advogado.advogadoId, e)}
                      className="delete-button"
                      title="Excluir advogado"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentAdvogados.length === 0 && (
            <div className="empty-state">
              <h3>Nenhum advogado encontrado</h3>
              <p>Tente ajustar os filtros de busca ou cadastre um novo advogado.</p>
            </div>
          )}
        </div>

        {renderPaginacao()}
      </div>
    </Layout>
  );
};

export default Advogados;
