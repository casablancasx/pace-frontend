import React, { useState } from 'react';
import { ArrowLeft, Phone, Mail, MapPin, Award, User, X } from 'lucide-react';
import Layout from '../../components/Layout';
import type { PautistaData } from './pautista';
import './detalhesPautista.css';

interface DetalhesPautistaProps {
  pautista: PautistaData;
  onVoltar: () => void;
}

interface Afastamento {
  id: number;
  motivo: string;
  dataInicio: string;
  dataFim: string;
  status: 'ativo' | 'finalizado';
}

const DetalhesPautista: React.FC<DetalhesPautistaProps> = ({ pautista, onVoltar }) => {
  const [motivoAfastamento, setMotivoAfastamento] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [afastamentos, setAfastamentos] = useState<Afastamento[]>([
    {
      id: 1,
      motivo: 'Férias',
      dataInicio: '2024-06-01',
      dataFim: '2024-06-15',
      status: 'finalizado',
    },
  ]);

  const handleAdicionarAfastamento = () => {
    if (!motivoAfastamento || !dataInicio) {
      return;
    }

    const novoAfastamento: Afastamento = {
      id: Date.now(),
      motivo: motivoAfastamento,
      dataInicio,
      dataFim: dataFim || '',
      status: dataFim ? 'finalizado' : 'ativo',
    };

    setAfastamentos((prev) => [novoAfastamento, ...prev]);
    setMotivoAfastamento('');
    setDataInicio('');
    setDataFim('');
  };

  return (
    <Layout>
      <div className="detalhes-pautista-page">
        <button className="voltar-button" onClick={onVoltar}>
          <ArrowLeft size={20} />
          Voltar
        </button>
        <div className="detalhes-header">
          <h1 className="detalhes-title">Detalhes Pautista</h1>
        </div>

        <div className="detalhes-content">
          <div className="pautista-profile">
            <div className="profile-avatar">
              <div className="avatar-placeholder-large">
                {pautista.nome
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
            </div>

            <div className="profile-info">
              <h1 className="profile-name">{pautista.nome}</h1>
              <div className="profile-stats">
                <span className="stat-item">{pautista.quantidadeAudiencias} audiências</span>
                <span className="stat-separator">•</span>
                <span className="stat-item">{pautista.quantidadePautas} pautas</span>
                <span className="stat-separator">•</span>
                <span className="stat-item">Score: {pautista.score}</span>
              </div>
              <div className="profile-status">
                <span className={`status-badge ${pautista.disponivel ? 'disponivel' : 'indisponivel'}`}>
                  {pautista.disponivel ? 'Disponível' : 'Afastado'}
                </span>
              </div>
            </div>
          </div>

          <div className="detalhes-grid">
            <div className="detalhes-section">
              <h2 className="section-title">Informações Pessoais</h2>
              <div className="info-grid">
                <div className="info-item">
                  <Phone size={18} />
                  <div>
                    <span className="info-label">Telefone</span>
                    <span className="info-value">{pautista.telefone}</span>
                  </div>
                </div>

                <div className="info-item">
                  <Mail size={18} />
                  <div>
                    <span className="info-label">E-mail</span>
                    <span className="info-value">{pautista.email}</span>
                  </div>
                </div>

                <div className="info-item">
                  <User size={18} />
                  <div>
                    <span className="info-label">Adicionado por</span>
                    <span className="info-value">{pautista.adicionadoPor}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detalhes-section">
              <h2 className="section-title">Informações Profissionais</h2>
              <div className="info-grid">
                <div className="info-item">
                  <MapPin size={18} />
                  <div>
                    <span className="info-label">Setor</span>
                    <span className="info-value">{pautista.setor}</span>
                  </div>
                </div>

                <div className="info-item">
                  <MapPin size={18} />
                  <div>
                    <span className="info-label">Unidade</span>
                    <span className="info-value">{pautista.unidade}</span>
                  </div>
                </div>

                <div className="info-item">
                  <Award size={18} />
                  <div>
                    <span className="info-label">Sapiens ID</span>
                    <span className="info-value">#{pautista.sapiensId}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="afastamentos-section">
            <div className="afastamentos-grid">
              {/* Card do formulário */}
              <div className="afastamento-card">
                <h3 className="card-title">Cadastrar Afastamento</h3>
                <div className="afastamento-form">
                  <div className="form-group">
                    <label className="form-label">Motivo</label>
                    <select
                      className="form-select"
                      value={motivoAfastamento}
                      onChange={(e) => setMotivoAfastamento(e.target.value)}
                    >
                      <option value="">Selecione o motivo</option>
                      <option value="Férias">Férias</option>
                      <option value="Licença Médica">Licença Médica</option>
                      <option value="Licença Maternidade">Licença Maternidade</option>
                      <option value="Suspensão">Suspensão</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Data de Início</label>
                      <input
                        type="date"
                        className="form-input"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Data de Fim</label>
                      <input
                        type="date"
                        className="form-input"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      className="cancel-button"
                      type="button"
                      onClick={() => {
                        setMotivoAfastamento('');
                        setDataInicio('');
                        setDataFim('');
                      }}
                    >
                      <X size={16} />
                      Limpar
                    </button>
                    <button
                      className="submit-button"
                      type="button"
                      onClick={handleAdicionarAfastamento}
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>

              {/* Card da tabela */}
              <div className="afastamento-card">
                <h3 className="card-title">Histórico de Afastamentos</h3>
                {afastamentos.length > 0 ? (
                  <div className="afastamentos-table-container">
                    <table className="afastamentos-table">
                      <thead>
                        <tr>
                          <th>Motivo</th>
                          <th>Data Início</th>
                          <th>Data Fim</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {afastamentos.map((afastamento) => (
                          <tr key={afastamento.id}>
                            <td>{afastamento.motivo}</td>
                            <td>{new Date(afastamento.dataInicio).toLocaleDateString('pt-BR')}</td>
                            <td>
                              {afastamento.dataFim
                                ? new Date(afastamento.dataFim).toLocaleDateString('pt-BR')
                                : '-'}
                            </td>
                            <td>
                              <span className={`status-badge-table ${afastamento.status}`}>
                                {afastamento.status === 'ativo' ? 'Ativo' : 'Finalizado'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>Nenhum afastamento registrado</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetalhesPautista;