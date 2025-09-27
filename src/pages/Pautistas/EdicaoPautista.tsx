import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Layout from '../../components/Layout';
import type { PautistaData } from './pautista';
import './cadastroPautista.css';

interface EdicaoPautistaForm {
  nome: string;
  telefone: string;
  email: string;
  sapiensId: string;
  disponivel: boolean;
}

interface EdicaoPautistaProps {
  pautista: PautistaData;
  onVoltar: () => void;
  onSalvar: (pautistaEditado: PautistaData) => void;
}

const EdicaoPautista: React.FC<EdicaoPautistaProps> = ({ pautista, onVoltar, onSalvar }) => {
  const [form, setForm] = useState<EdicaoPautistaForm>({
    nome: pautista.nome,
    telefone: pautista.telefone,
    email: pautista.email,
    sapiensId: pautista.sapiensId.toString(),
    disponivel: pautista.disponivel
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
    
    const pautistaEditado: PautistaData = {
      ...pautista,
      nome: form.nome,
      telefone: form.telefone,
      email: form.email,
      sapiensId: parseInt(form.sapiensId),
      disponivel: form.disponivel
    };

    onSalvar(pautistaEditado);
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
      <div className="cadastro-pautista-page">
        <div className="cadastro-header">
          <button onClick={onVoltar} className="voltar-button">
            <ArrowLeft size={20} />
            Voltar
          </button>
          <h1 className="cadastro-title">Editar Pautista</h1>
        </div>

        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="form-section">
            <div className="form-group">
              <label className="form-label" htmlFor="nome">
                Nome Completo
              </label>
              <p className="form-description">
                Nome completo do pautista que será exibido no sistema.
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
                Número de telefone para contato do pautista.
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
                Endereço de email do pautista para comunicações do sistema.
              </p>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="pautista@email.com"
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
                <strong>{pautista.setor}</strong> • {pautista.unidade}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sapiensId">
                ID Sapiens
              </label>
              <p className="form-description">
                Identificador do pautista no sistema Sapiens.
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
                Define se o pautista está disponível para novos trabalhos ou afastado.
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

export default EdicaoPautista;