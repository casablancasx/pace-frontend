import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Layout from '../../components/Layout';
import type { AvaliadorData } from './avaliador';
import './cadastroAvaliador.css';

interface EdicaoAvaliadorForm {
  nome: string;
  telefone: string;
  email: string;
  sapiensId: string;
  disponivel: boolean;
}

interface EdicaoAvaliadorProps {
  avaliador: AvaliadorData;
  onVoltar: () => void;
  onSalvar: (avaliadorEditado: AvaliadorData) => void;
}

const EdicaoAvaliador: React.FC<EdicaoAvaliadorProps> = ({ avaliador, onVoltar, onSalvar }) => {
  const [form, setForm] = useState<EdicaoAvaliadorForm>({
    nome: avaliador.nome,
    telefone: avaliador.telefone,
    email: avaliador.email,
    sapiensId: avaliador.sapiensId.toString(),
    disponivel: avaliador.disponivel
  });

  const [showEmailPublic, setShowEmailPublic] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const avaliadorEditado: AvaliadorData = {
      ...avaliador,
      nome: form.nome,
      telefone: form.telefone,
      email: form.email,
      sapiensId: parseInt(form.sapiensId),
      disponivel: form.disponivel
    };

    onSalvar(avaliadorEditado);
    onVoltar();
  };

  const getStatusOptions = () => {
    if (form.disponivel) {
      return [
        { value: true, label: 'Disponível' },
        { value: false, label: 'Afastado' }
      ];
    } else {
      return [
        { value: false, label: 'Afastado' },
        { value: true, label: 'Disponível' }
      ];
    }
  };

  return (
    <Layout>
      <div className="cadastro-avaliador-page">
        <button onClick={onVoltar} className="voltar-button">
          <ArrowLeft size={20} />
          Voltar
        </button>
        <div className="cadastro-header">
          <h1 className="cadastro-title">Editar Avaliador</h1>
        </div>

        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="form-section">
            <div className="form-group">
              <label className="form-label" htmlFor="nome">
                Nome Completo
              </label>
              <p className="form-description">
                Nome completo do avaliador que será exibido no sistema.
              </p>
              <input
                type="text"
                id="nome"
                name="nome"
                value={form.nome}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Digite o nome completo"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="telefone">
                Telefone
              </label>
              <p className="form-description">
                Número de telefone para contato do avaliador.
              </p>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={form.telefone}
                onChange={handleInputChange}
                className="form-input"
                placeholder="(11) 99999-9999"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <p className="form-description">
                Endereço de email do avaliador para comunicações do sistema.
              </p>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="avaliador@email.com"
                required
              />
              
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="showEmailPublic"
                  checked={showEmailPublic}
                  onChange={(e) => setShowEmailPublic(e.target.checked)}
                  className="form-checkbox"
                />
                <label htmlFor="showEmailPublic" className="checkbox-label">
                  Mostrar email no perfil público
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Setor / Unidade
              </label>
              <p className="form-description">
                Setor e unidade não podem ser alterados após o cadastro.
              </p>
              <div className="readonly-field">
                <strong>{avaliador.setor}</strong> • {avaliador.unidade}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sapiensId">
                ID Sapiens
              </label>
              <p className="form-description">
                Identificador do avaliador no sistema Sapiens.
              </p>
              <input
                type="number"
                id="sapiensId"
                name="sapiensId"
                value={form.sapiensId}
                onChange={handleInputChange}
                className="form-input"
                placeholder="123456"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="disponivel">
                Status de Disponibilidade
              </label>
              <p className="form-description">
                Define se o avaliador está disponível para novos trabalhos ou afastado.
              </p>
              <select
                id="disponivel"
                name="disponivel"
                value={form.disponivel.toString()}
                onChange={(e) => setForm(prev => ({ ...prev, disponivel: e.target.value === 'true' }))}
                className="form-select"
                required
              >
                {getStatusOptions().map(option => (
                  <option key={option.value.toString()} value={option.value.toString()}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onVoltar} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EdicaoAvaliador;