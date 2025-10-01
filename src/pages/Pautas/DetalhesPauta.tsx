import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Clock, User, AlertCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import AdicionarAnaliseModal from './AdicionarAnaliseModal';
import { useNavigation } from '../../contexts/NavigationContext';
import './detalhesPauta.css';

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
  respostaAnalise: string;
  audiencias: AudienciaResponseDTO[];
}

interface DetalhesPautaProps {
  pautaId: string;
}

const DetalhesPauta: React.FC<DetalhesPautaProps> = ({ pautaId }) => {
  const { navigateBackToPautas } = useNavigation();
  
  // Mock data - Em uma aplicação real, buscaríamos por ID
  const getMockPauta = (id: string): PautaResponseDTO => ({
    pautaId: parseInt(id) || 1,
    data: '2024-01-15',
    orgaoJulgador: 'Segunda Turma Recursal',
    turno: 'Manhã',
    respostaAnalise: 'PENDENTE',
    audiencias: [
      {
        numeroProcesso: '1234567-89.2023.5.03.0001',
        hora: '09:00',
        nomeParte: 'MARIA SILVA',
        advogados: ['Dr. João Santos'],
        assunto: 'Horas extras e adicional noturno',
        classeJudicial: 'Reclamação Trabalhista',
        prioridade: 'normal',
        analise: 'Audiência de conciliação com boas chances de acordo'
      },
      {
        numeroProcesso: '9876543-21.2023.5.03.0002',
        hora: '10:30',
        nomeParte: 'PEDRO OLIVEIRA',
        advogados: ['Dra. Ana Costa'],
        assunto: 'Verbas rescisórias',
        classeJudicial: 'Reclamação Trabalhista',
        prioridade: 'urgente',
        analise: 'Caso complexo - preparar argumentos sobre horas extras'
      },
      {
        numeroProcesso: '5555444-33.2023.5.03.0003',
        hora: '14:00',
        nomeParte: 'CARLOS MENDES',
        advogados: ['Dr. Roberto Lima'],
        assunto: 'Acidente de trabalho',
        classeJudicial: 'Reclamação Trabalhista',
        prioridade: 'normal',
        analise: ''
      }
    ]
  });

  const [pautaAtual, setPautaAtual] = useState<PautaResponseDTO>(getMockPauta(pautaId));
  
  const [modalAnalise, setModalAnalise] = useState<{
    isOpen: boolean;
    audiencia: AudienciaResponseDTO | null;
  }>({
    isOpen: false,
    audiencia: null
  });
  




  const handleAddAnalise = (audiencia: AudienciaResponseDTO) => {
    setModalAnalise({
      isOpen: true,
      audiencia: audiencia
    });
  };

  const handleSaveAnalise = (numeroProcesso: string, novaAnalise: string) => {
    const pautaAtualizada = {
      ...pautaAtual,
      audiencias: pautaAtual.audiencias.map(aud => 
        aud.numeroProcesso === numeroProcesso 
          ? { ...aud, analise: novaAnalise }
          : aud
      )
    };
    
    setPautaAtual(pautaAtualizada);
    
    setModalAnalise({
      isOpen: false,
      audiencia: null
    });
  };

  const handleCloseAnaliseModal = () => {
    setModalAnalise({
      isOpen: false,
      audiencia: null
    });
  };

  return (
    <Layout>
      <div className="detalhes-pauta-page">
        <button onClick={navigateBackToPautas} className="voltar-button">
          <ArrowLeft size={16} />
          Voltar
        </button>
        <div className="detalhes-header">
          <h1 className="page-title">Detalhes da Pauta</h1>
        </div>

        {/* Informações da Pauta */}
        <div className="pauta-info-section">
          <div className="pauta-info-grid">
            <div className="info-item">
              <span className="info-label">Data</span>
              <span className="info-value">{pautaAtual.data}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Turno</span>
              <span className="info-value">{pautaAtual.turno}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Órgão Julgador</span>
              <span className="info-value">{pautaAtual.orgaoJulgador}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Resposta Análise</span>
              <select 
                className={`resposta-select ${
                  pautaAtual.respostaAnalise === 'COMPARECER' ? 'comparecer' :
                  pautaAtual.respostaAnalise === 'NÃO COMPARECER' ? 'nao-comparecer' : 'pendente'
                }`}
                value={pautaAtual.respostaAnalise}
                onChange={(e) => {
                  const novaResposta = e.target.value;
                  setPautaAtual(prev => ({ ...prev, respostaAnalise: novaResposta }));
                }}
              >
                <option value="PENDENTE">PENDENTE</option>
                <option value="COMPARECER">COMPARECER</option>
                <option value="NÃO COMPARECER">NÃO COMPARECER</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Audiências */}
        <div className="audiencias-section">
          <h2 className="section-title">Audiências ({pautaAtual.audiencias.length})</h2>
          
          <div className="audiencias-table-container">
            <table className="audiencias-table">
              <thead>
                <tr>
                  <th>Processo</th>
                  <th>Hora</th>
                  <th>Parte</th>
                  <th>Assunto</th>
                  <th>Classe</th>
                  <th>Prioridade</th>
                  <th>Análise</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pautaAtual.audiencias.map((audiencia, index) => (
                  <tr key={index} className="audiencia-row">
                    <td className="processo-cell">{audiencia.numeroProcesso}</td>
                    <td>
                      <div className="hora-cell">
                        <Clock size={14} />
                        {audiencia.hora}
                      </div>
                    </td>
                    <td>
                      <div className="parte-cell">
                        <User size={14} />
                        {audiencia.nomeParte}
                      </div>
                    </td>
                    <td>{audiencia.assunto}</td>
                    <td>{audiencia.classeJudicial}</td>
                    <td>
                      <span className={`prioridade-badge ${audiencia.prioridade.toLowerCase()}`}>
                        {audiencia.prioridade === 'Urgente' && <AlertCircle size={12} />}
                        {audiencia.prioridade}
                      </span>
                    </td>
                    <td className="analise-cell">
                      {audiencia.analise || (
                        <span className="sem-analise">Sem análise</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleAddAnalise(audiencia)}
                        className="add-analise-button"
                        title="Adicionar/Editar análise"
                      >
                        <Plus size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pautaAtual.audiencias.length === 0 && (
              <div className="empty-audiencias">
                <p>Nenhuma audiência encontrada para esta pauta.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modais */}
        {modalAnalise.audiencia && (
          <AdicionarAnaliseModal
            audiencia={modalAnalise.audiencia}
            isOpen={modalAnalise.isOpen}
            onClose={handleCloseAnaliseModal}
            onSave={handleSaveAnalise}
          />
        )}


      </div>
    </Layout>
  );
};

export default DetalhesPauta;