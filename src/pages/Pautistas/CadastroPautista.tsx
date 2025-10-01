import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Layout from '../../components/Layout';
import './cadastroPautista.css';

interface CadastroPautistaForm {
  nome: string;
  telefone: string;
  email: string;
  setor: string;
  unidade: string;
  sapiensId: string;
}

interface CadastroPautistaProps {
  onVoltar: () => void;
}

const CadastroPautista: React.FC<CadastroPautistaProps> = ({ onVoltar }) => {
  const [form, setForm] = useState<CadastroPautistaForm>({
    nome: '',
    telefone: '',
    email: '',
    setor: '',
    unidade: '',
    sapiensId: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria a lógica de cadastro
    console.log('Formulário enviado:', form);
  };

  return (
    <Layout>
      <div className="cadastro-pautista-page">
        <button onClick={onVoltar} className="voltar-button">
          <ArrowLeft size={20} />
          Voltar
        </button>
        <div className="cadastro-header">
          <h1 className="cadastro-title">Cadastrar Pautista</h1>
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
              
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="setor">
                Setor
              </label>
              <p className="form-description">
                Setor de atuação do pautista no tribunal.
              </p>
              <select
                id="setor"
                name="setor"
                value={form.setor}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Selecione o setor</option>
                <option value="Civil">Civil</option>
                <option value="Criminal">Criminal</option>
                <option value="Trabalhista">Trabalhista</option>
                <option value="Família">Família</option>
                <option value="Tributário">Tributário</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="unidade">
                Unidade
              </label>
              <p className="form-description">
                Vara ou unidade específica onde o pautista atua.
              </p>
              <input
                type="text"
                id="unidade"
                name="unidade"
                value={form.unidade}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ex: 1ª Vara Cível"
                required
              />
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
          </div>

          <div className="form-actions">
            <button type="button" onClick={onVoltar} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Cadastrar Pautista
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CadastroPautista;