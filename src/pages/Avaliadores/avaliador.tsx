import React, { useState } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import Layout from '../../components/Layout';
import CadastroAvaliador from './CadastroAvaliador';
import EdicaoAvaliador from './EdicaoAvaliador';
import DetalhesAvaliador from './DetalhesAvaliador';
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

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

const mockAvaliadores: AvaliadorData[] = [
  {
    avaliadorId: 1,
    nome: "Maria Silva Santos",
    telefone: "(11) 99999-9999",
    email: "maria.santos@email.com",
    setor: "Civil",
    unidade: "1ª Vara Cível",
    sapiensId: 12345,
    quantidadeAudiencias: 45,
    quantidadePautas: 23,
    score: 85,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    avaliadorId: 2,
    nome: "João Carlos Oliveira",
    telefone: "(11) 88888-8888",
    email: "joao.oliveira@email.com",
    setor: "Criminal",
    unidade: "2ª Vara Criminal",
    sapiensId: 12346,
    quantidadeAudiencias: 32,
    quantidadePautas: 18,
    score: 92,
    disponivel: false,
    adicionadoPor: "Admin"
  },
  {
    avaliadorId: 3,
    nome: "Ana Paula Rodrigues",
    telefone: "(11) 77777-7777",
    email: "ana.rodrigues@email.com",
    setor: "Trabalhista",
    unidade: "3ª Vara Trabalhista",
    sapiensId: 12347,
    quantidadeAudiencias: 28,
    quantidadePautas: 15,
    score: 78,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    avaliadorId: 4,
    nome: "Carlos Eduardo Lima",
    telefone: "(11) 66666-6666",
    email: "carlos.lima@email.com",
    setor: "Civil",
    unidade: "4ª Vara Cível",
    sapiensId: 12348,
    quantidadeAudiencias: 38,
    quantidadePautas: 21,
    score: 88,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    avaliadorId: 5,
    nome: "Pedro Henrique Costa",
    telefone: "(11) 55555-5555",
    email: "pedro.costa@email.com",
    setor: "Família",
    unidade: "1ª Vara de Família",
    sapiensId: 12349,
    quantidadeAudiencias: 42,
    quantidadePautas: 19,
    score: 90,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    avaliadorId: 6,
    nome: "Juliana Ferreira Souza",
    telefone: "(11) 44444-4444",
    email: "juliana.souza@email.com",
    setor: "Tributário",
    unidade: "1ª Vara Tributária",
    sapiensId: 12350,
    quantidadeAudiencias: 25,
    quantidadePautas: 12,
    score: 75,
    disponivel: false,
    adicionadoPor: "Admin"
  },
  {
    avaliadorId: 7,
    nome: "Roberto Alves Pereira",
    telefone: "(11) 33333-3333",
    email: "roberto.pereira@email.com",
    setor: "Criminal",
    unidade: "1ª Vara Criminal",
    sapiensId: 12351,
    quantidadeAudiencias: 55,
    quantidadePautas: 28,
    score: 95,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    avaliadorId: 8,
    nome: "Fernanda Lima Barbosa",
    telefone: "(11) 22222-2222",
    email: "fernanda.barbosa@email.com",
    setor: "Civil",
    unidade: "2ª Vara Cível",
    sapiensId: 12352,
    quantidadeAudiencias: 33,
    quantidadePautas: 16,
    score: 82,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    avaliadorId: 9,
    nome: "Alexandre Santos Medeiros",
    telefone: "(11) 11111-1111",
    email: "alexandre.medeiros@email.com",
    setor: "Trabalhista",
    unidade: "1ª Vara Trabalhista",
    sapiensId: 12353,
    quantidadeAudiencias: 40,
    quantidadePautas: 22,
    score: 87,
    disponivel: false,
    adicionadoPor: "Admin"
  },
  {
    avaliadorId: 10,
    nome: "Camila Rodrigues Martins",
    telefone: "(11) 99988-7766",
    email: "camila.martins@email.com",
    setor: "Família",
    unidade: "2ª Vara de Família",
    sapiensId: 12354,
    quantidadeAudiencias: 29,
    quantidadePautas: 14,
    score: 79,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    avaliadorId: 11,
    nome: "Ricardo Oliveira Nunes",
    telefone: "(11) 88877-6655",
    email: "ricardo.nunes@email.com",
    setor: "Tributário",
    unidade: "2ª Vara Tributária",
    sapiensId: 12355,
    quantidadeAudiencias: 36,
    quantidadePautas: 20,
    score: 84,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    avaliadorId: 12,
    nome: "Patrícia Almeida Silva",
    telefone: "(11) 77766-5544",
    email: "patricia.silva@email.com",
    setor: "Civil",
    unidade: "3ª Vara Cível",
    sapiensId: 12356,
    quantidadeAudiencias: 31,
    quantidadePautas: 17,
    score: 81,
    disponivel: false,
    adicionadoPor: "Admin"
  },
  {
    avaliadorId: 13,
    nome: "Marcos Paulo Ferreira",
    telefone: "(11) 66655-4433",
    email: "marcos.ferreira@email.com",
    setor: "Criminal",
    unidade: "3ª Vara Criminal",
    sapiensId: 12357,
    quantidadeAudiencias: 48,
    quantidadePautas: 26,
    score: 93,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    avaliadorId: 14,
    nome: "Luciana Costa Ribeiro",
    telefone: "(11) 55544-3322",
    email: "luciana.ribeiro@email.com",
    setor: "Trabalhista",
    unidade: "2ª Vara Trabalhista",
    sapiensId: 12358,
    quantidadeAudiencias: 37,
    quantidadePautas: 21,
    score: 86,
    disponivel: true,
    adicionadoPor: "Admin"
  },
  {
    avaliadorId: 15,
    nome: "Daniel Souza Carvalho",
    telefone: "(11) 44433-2211",
    email: "daniel.carvalho@email.com",
    setor: "Família",
    unidade: "3ª Vara de Família",
    sapiensId: 12359,
    quantidadeAudiencias: 34,
    quantidadePautas: 18,
    score: 80,
    disponivel: false,
    adicionadoPor: "Admin"
  }
];

const Avaliador: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nome');
  const [currentPage, setCurrentPage] = useState(0); // Página baseada em 0 como no backend
  const [pageSize] = useState(5);
  const [showCadastro, setShowCadastro] = useState(false);
  const [showEdicao, setShowEdicao] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [avaliadorEditando, setAvaliadorEditando] = useState<AvaliadorData | null>(null);
  const [avaliadorSelecionado, setAvaliadorSelecionado] = useState<AvaliadorData | null>(null);
  const [avaliadores, setAvaliadores] = useState<AvaliadorData[]>(mockAvaliadores);
  const [pageResponse, setPageResponse] = useState<PageResponse<AvaliadorData>>({
    content: [],
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0
  });

  // Funções para gerenciar avaliadores
  const handleEditarAvaliador = (avaliador: AvaliadorData) => {
    setAvaliadorEditando(avaliador);
    setShowEdicao(true);
  };

  const handleExcluirAvaliador = (avaliadorId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este avaliador?')) {
      setAvaliadores(prev => prev.filter(a => a.avaliadorId !== avaliadorId));
    }
  };

  const handleVerDetalhes = (avaliador: AvaliadorData) => {
    setAvaliadorSelecionado(avaliador);
    setShowDetalhes(true);
  };

  const handleVoltarDetalhes = () => {
    setShowDetalhes(false);
    setAvaliadorSelecionado(null);
  };

  const handleSalvarEdicao = (avaliadorEditado: AvaliadorData) => {
    setAvaliadores(prev => 
      prev.map(a => a.avaliadorId === avaliadorEditado.avaliadorId ? avaliadorEditado : a)
    );
  };

  // Simulação de dados com estrutura PageResponse
  React.useEffect(() => {
    const filteredAvaliadores = avaliadores.filter(avaliador =>
      avaliador.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedAvaliadores = [...filteredAvaliadores].sort((a, b) => {
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

    const totalElements = sortedAvaliadores.length;
    const totalPages = Math.ceil(totalElements / pageSize);
    const startIndex = currentPage * pageSize;
    const content = sortedAvaliadores.slice(startIndex, startIndex + pageSize);

    setPageResponse({
      content,
      page: currentPage,
      size: pageSize,
      totalElements,
      totalPages
    });
  }, [searchTerm, sortBy, currentPage, pageSize, avaliadores]);

  if (showCadastro) {
    return <CadastroAvaliador onVoltar={() => setShowCadastro(false)} />;
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
            {pageResponse.totalElements} avaliadores
          </span>
        </div>
      </div>
    </Layout>
  );
};

export default Avaliador;
