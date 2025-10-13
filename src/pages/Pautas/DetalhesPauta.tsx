import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Clock, User, AlertCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import AdicionarAnaliseModal from './AdicionarAnaliseModal';
import { useNavigation } from '../../contexts/NavigationContext';
import pautaService from '../../services/pautaService';
import type { PautaResponseDTO, AudienciaResponseDTO } from '../../services/pautaService';
import './detalhesPauta.css';

interface DetalhesPautaProps {
  pautaId: string;
}

const DetalhesPauta: React.FC<DetalhesPautaProps> = ({ pautaId }) => {
  const { navigateBackToPautas } = useNavigation();
  
  const [pautaAtual, setPautaAtual] = useState<PautaResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [modalAnalise, setModalAnalise] = useState<{
    isOpen: boolean;
    audiencia: AudienciaResponseDTO | null;
  }>({
    isOpen: false,
    audiencia: null
  });

  // Carregar detalhes da pauta
  useEffect(() => {
    const carregarPauta = async () => {
      setIsLoading(true);
      try {
        const data = await pautaService.buscarPautaPorId(Number(pautaId));
        setPautaAtual(data);
      } catch (error) {
        console.error('Erro ao carregar detalhes da pauta:', error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarPauta();
  }, [pautaId]);
  




  const handleAddAnalise = (audiencia: AudienciaResponseDTO) => {
    setModalAnalise({
      isOpen: true,
      audiencia: audiencia
    });
  };

  const handleSaveAnalise = (numeroProcesso: string, novaAnalise: string) => {
    if (!pautaAtual) return;
    
    const pautaAtualizada: PautaResponseDTO = {
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

  if (isLoading) {
    return (
      <Layout>
        <div className="detalhes-pauta-page">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Carregando...
          </div>
        </div>
      </Layout>
    );
  }

  if (!pautaAtual) {
    return (
      <Layout>
        <div className="detalhes-pauta-page">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Pauta não encontrada.
          </div>
        </div>
      </Layout>
    );
  }

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
              <span className="info-label">Análise Comparecimento</span>
              <select 
                className={`resposta-select ${
                  pautaAtual.analiseComparecimento === 'COMPARECER' ? 'comparecer' :
                  pautaAtual.analiseComparecimento === 'NÃO COMPARECER' ? 'nao-comparecer' : 'pendente'
                }`}
                value={pautaAtual.analiseComparecimento}
                onChange={(e) => {
                  const novaResposta = e.target.value;
                  if (!pautaAtual) return;
                  setPautaAtual({ ...pautaAtual, analiseComparecimento: novaResposta });
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
                      <span className={`prioridade-badge ${audiencia.isPrioritaria ? 'urgente' : 'normal'}`}>
                        {audiencia.isPrioritaria && <AlertCircle size={12} />}
                        {audiencia.isPrioritaria ? 'Prioritária' : 'Normal'}
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