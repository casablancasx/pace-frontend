import React, { useState } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import Layout from '../../components/Layout';
import CadastroPautista from './CadastroPautista';
import EdicaoPautista from './EdicaoPautista';
import DetalhesPautista from './DetalhesPautista';
import './pautista.css';

export interface PautistaData {
  pautistaId: number;
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

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

const mockPautistas: PautistaData[] = [
  {
    pautistaId: 1,
    nome: "Carlos Alberto Silva",
    telefone: "(11) 99999-9999",
    email: "carlos.silva@email.com",
    setor: "Civil",
    unidade: "1ª Vara Cível",
    sapiensId: 22345,
    quantidadeAudiencias: 65,
    quantidadePautas: 43,
    score: 88,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    pautistaId: 2,
    nome: "Ana Maria Oliveira",
    telefone: "(11) 88888-8888",
    email: "ana.oliveira@email.com",
    setor: "Criminal",
    unidade: "2ª Vara Criminal",
    sapiensId: 22346,
    quantidadeAudiencias: 52,
    quantidadePautas: 38,
    score: 95,
    disponivel: false,
    adicionadoPor: "Admin"
  },
  {
    pautistaId: 3,
    nome: "Roberto Carlos Pereira",
    telefone: "(11) 77777-7777",
    email: "roberto.pereira@email.com",
    setor: "Trabalhista",
    unidade: "3ª Vara Trabalhista",
    sapiensId: 22347,
    quantidadeAudiencias: 48,
    quantidadePautas: 35,
    score: 81,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    pautistaId: 4,
    nome: "Mariana Santos Lima",
    telefone: "(11) 66666-6666",
    email: "mariana.lima@email.com",
    setor: "Civil",
    unidade: "4ª Vara Cível",
    sapiensId: 22348,
    quantidadeAudiencias: 58,
    quantidadePautas: 41,
    score: 91,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    pautistaId: 5,
    nome: "João Paulo Costa",
    telefone: "(11) 55555-5555",
    email: "joao.costa@email.com",
    setor: "Família",
    unidade: "1ª Vara de Família",
    sapiensId: 22349,
    quantidadeAudiencias: 62,
    quantidadePautas: 39,
    score: 93,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    pautistaId: 6,
    nome: "Patricia Fernandes Souza",
    telefone: "(11) 44444-4444",
    email: "patricia.souza@email.com",
    setor: "Tributário",
    unidade: "1ª Vara Tributária",
    sapiensId: 22350,
    quantidadeAudiencias: 45,
    quantidadePautas: 32,
    score: 78,
    disponivel: false,
    adicionadoPor: "Admin"
  },
  {
    pautistaId: 7,
    nome: "Fernando Alves Santos",
    telefone: "(11) 33333-3333",
    email: "fernando.santos@email.com",
    setor: "Criminal",
    unidade: "1ª Vara Criminal",
    sapiensId: 22351,
    quantidadeAudiencias: 75,
    quantidadePautas: 48,
    score: 98,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    pautistaId: 8,
    nome: "Lucia Helena Barbosa",
    telefone: "(11) 22222-2222",
    email: "lucia.barbosa@email.com",
    setor: "Civil",
    unidade: "2ª Vara Cível",
    sapiensId: 22352,
    quantidadeAudiencias: 53,
    quantidadePautas: 36,
    score: 85,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    pautistaId: 9,
    nome: "Eduardo Santos Medeiros",
    telefone: "(11) 11111-1111",
    email: "eduardo.medeiros@email.com",
    setor: "Trabalhista",
    unidade: "1ª Vara Trabalhista",
    sapiensId: 22353,
    quantidadeAudiencias: 60,
    quantidadePautas: 42,
    score: 90,
    disponivel: false,
    adicionadoPor: "Admin"
  },
  {
    pautistaId: 10,
    nome: "Sandra Rodrigues Martins",
    telefone: "(11) 99988-7766",
    email: "sandra.martins@email.com",
    setor: "Família",
    unidade: "2ª Vara de Família",
    sapiensId: 22354,
    quantidadeAudiencias: 49,
    quantidadePautas: 34,
    score: 82,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    pautistaId: 11,
    nome: "Henrique Oliveira Nunes",
    telefone: "(11) 88877-6655",
    email: "henrique.nunes@email.com",
    setor: "Tributário",
    unidade: "2ª Vara Tributária",
    sapiensId: 22355,
    quantidadeAudiencias: 56,
    quantidadePautas: 40,
    score: 87,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    pautistaId: 12,
    nome: "Cristina Almeida Silva",
    telefone: "(11) 77766-5544",
    email: "cristina.silva@email.com",
    setor: "Civil",
    unidade: "3ª Vara Cível",
    sapiensId: 22356,
    quantidadeAudiencias: 51,
    quantidadePautas: 37,
    score: 84,
    disponivel: false,
    adicionadoPor: "Admin"
  },
  {
    pautistaId: 13,
    nome: "Rafael Paulo Ferreira",
    telefone: "(11) 66655-4433",
    email: "rafael.ferreira@email.com",
    setor: "Criminal",
    unidade: "3ª Vara Criminal",
    sapiensId: 22357,
    quantidadeAudiencias: 68,
    quantidadePautas: 46,
    score: 96,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    pautistaId: 14,
    nome: "Adriana Costa Ribeiro",
    telefone: "(11) 55544-3322",
    email: "adriana.ribeiro@email.com",
    setor: "Trabalhista",
    unidade: "2ª Vara Trabalhista",
    sapiensId: 22358,
    quantidadeAudiencias: 57,
    quantidadePautas: 41,
    score: 89,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    pautistaId: 15,
    nome: "Gustavo Souza Carvalho",
    telefone: "(11) 44433-2211",
    email: "gustavo.carvalho@email.com",
    setor: "Família",
    unidade: "3ª Vara de Família",
    sapiensId: 22359,
    quantidadeAudiencias: 54,
    quantidadePautas: 38,
    score: 83,
    disponivel: false,
    adicionadoPor: "Admin"
  }
];

const Pautista: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nome');
  const [currentPage, setCurrentPage] = useState(0); // Página baseada em 0 como no backend
  const [pageSize] = useState(5);
  const [showCadastro, setShowCadastro] = useState(false);
  const [showEdicao, setShowEdicao] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [pautistaEditando, setPautistaEditando] = useState<PautistaData | null>(null);
  const [pautistaSelecionado, setPautistaSelecionado] = useState<PautistaData | null>(null);
  const [pautistas, setPautistas] = useState<PautistaData[]>(mockPautistas);
  const [pageResponse, setPageResponse] = useState<PageResponse<PautistaData>>({
    content: [],
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0
  });

  // Funções para gerenciar pautistas
  const handleEditarPautista = (pautista: PautistaData) => {
    setPautistaEditando(pautista);
    setShowEdicao(true);
  };

  const handleExcluirPautista = (pautistaId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este pautista?')) {
      setPautistas(prev => prev.filter(p => p.pautistaId !== pautistaId));
    }
  };

  const handleVerDetalhes = (pautista: PautistaData) => {
    setPautistaSelecionado(pautista);
    setShowDetalhes(true);
  };

  const handleVoltarDetalhes = () => {
    setShowDetalhes(false);
    setPautistaSelecionado(null);
  };

  const handleSalvarEdicao = (pautistaEditado: PautistaData) => {
    setPautistas(prev => 
      prev.map(p => p.pautistaId === pautistaEditado.pautistaId ? pautistaEditado : p)
    );
  };

  // Simulação de dados com estrutura PageResponse
  React.useEffect(() => {
    const filteredPautistas = pautistas.filter(pautista =>
      pautista.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedPautistas = [...filteredPautistas].sort((a, b) => {
      switch (sortBy) {
        case 'nome':
          return a.nome.localeCompare(b.nome);
        case 'setor':
          return a.setor.localeCompare(b.setor);
        case 'audiencias':
          return b.quantidadeAudiencias - a.quantidadeAudiencias;
        case 'pautas':
          return b.quantidadePautas - a.quantidadePautas;
        default:
          return 0;
      }
    });

    const totalElements = sortedPautistas.length;
    const totalPages = Math.ceil(totalElements / pageSize);
    const startIndex = currentPage * pageSize;
    const content = sortedPautistas.slice(startIndex, startIndex + pageSize);

    setPageResponse({
      content,
      page: currentPage,
      size: pageSize,
      totalElements,
      totalPages
    });
  }, [searchTerm, sortBy, currentPage, pageSize, pautistas]);

  if (showCadastro) {
    return <CadastroPautista onVoltar={() => setShowCadastro(false)} />;
  }

  if (showEdicao && pautistaEditando) {
    return (
      <EdicaoPautista 
        pautista={pautistaEditando}
        onVoltar={() => {
          setShowEdicao(false);
          setPautistaEditando(null);
        }}
        onSalvar={handleSalvarEdicao}
      />
    );
  }

  if (showDetalhes && pautistaSelecionado) {
    return (
      <DetalhesPautista
        pautista={pautistaSelecionado}
        onVoltar={handleVoltarDetalhes}
      />
    );
  }

  return (
    <Layout>
      <div className="pautista-page">
        <h1 className="pautista-title">Gerenciamento de Pautistas</h1>
        
        <div className="pautista-controls">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Pesquisar pautista por nome..."
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
            Cadastrar Pautista
          </button>
        </div>

        <div className="pautistas-list">
          {pageResponse.content.map((pautista: PautistaData) => (
            <div key={pautista.pautistaId} className="pautista-card" onClick={() => handleVerDetalhes(pautista)}>
              <div className="pautista-avatar">
                <div className="avatar-placeholder">
                  {pautista.nome.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
              </div>
              
              <div className="pautista-content">
                <div className="pautista-main-info">
                  <h3 className="pautista-nome">{pautista.nome}</h3>
                  <div className="pautista-details">
                    <span className="pautista-setor">{pautista.setor}</span>
                    <span className="separator">•</span>
                    <span className="pautista-unidade">{pautista.unidade}</span>
                  </div>
                  <div className="pautista-stats">
                    <span className="stat-item">{pautista.quantidadeAudiencias} audiências</span>
                    <span className="separator">•</span>
                    <span className="stat-item">{pautista.quantidadePautas} pautas</span>
                  </div>
                </div>
              </div>
              
              <div className="pautista-status">
                <span className={`status-badge ${pautista.disponivel ? 'disponivel' : 'indisponivel'}`}>
                  {pautista.disponivel ? 'Disponível' : 'Afastado'}
                </span>
                <div className="actions-container">
                  <button 
                    className="action-button edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditarPautista(pautista);
                    }}
                    title="Editar pautista"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="action-button delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExcluirPautista(pautista.pautistaId);
                    }}
                    title="Excluir pautista"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pageResponse.totalPages > 1 && (
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

        <div className="pagination-summary">
          <span className="pagination-summary-text">
            Mostrando {pageResponse.content.length > 0 ? (pageResponse.page * pageResponse.size) + 1 : 0} até{' '}
            {Math.min((pageResponse.page + 1) * pageResponse.size, pageResponse.totalElements)} de{' '}
            {pageResponse.totalElements} pautistas
          </span>
        </div>
      </div>
    </Layout>
  );
};

export default Pautista;