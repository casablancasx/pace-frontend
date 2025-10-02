import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Layout from '../../components/Layout';
import ColaboradorAutocomplete from '../../components/Avaliadores/ColaboradorAutocomplete';
import './cadastroAvaliador.css';

interface CadastroAvaliadorForm {
  nome: string;
  telefone: string;
  email: string;
  setor: string;
  unidade: string;
  sapiensId: string;
}

interface CadastroAvaliadorProps {
  onVoltar: () => void;
}

const CadastroAvaliador: React.FC<CadastroAvaliadorProps> = ({ onVoltar }) => {
  const [form, setForm] = useState<CadastroAvaliadorForm>({
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

  const handleNomeChange = (valor: string) => {
    setForm(prev => {
      const trimmed = valor.trim();
      const nomeAnterior = prev.nome?.trim() ?? '';
      const needsReset = trimmed === '' || trimmed !== nomeAnterior;

      return {
        ...prev,
        nome: valor,
        ...(needsReset ? { setor: '', unidade: '', sapiensId: '' } : {}),
      };
    });
  };

  const handleColaboradorSelect = (lotacao: any) => {
    const nome = lotacao?.colaborador?.usuario?.nome ?? '';
    const unidade = lotacao?.setor?.unidade?.nome ?? '';
    const setor = lotacao?.setor?.nome ?? '';
    const sapiensId = lotacao?.colaborador?.id ? String(lotacao.colaborador.id) : '';
    const email = lotacao?.colaborador?.usuario?.email ?? '';

    setForm(prev => ({
      ...prev,
      nome,
      unidade,
      setor,
      sapiensId,
      email: email || prev.email,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria a lógica de cadastro
    console.log('Formulário enviado:', form);
  };

  return (
    <Layout>
      <div className="cadastro-avaliador-page">
        <button onClick={onVoltar} className="voltar-button">
          <ArrowLeft size={20} />
          Voltar
        </button>
        <div className="cadastro-header">
          <h1 className="cadastro-title">Cadastrar Avaliador</h1>
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
              <ColaboradorAutocomplete
                value={form.nome}
                onChange={handleNomeChange}
                onSelect={handleColaboradorSelect}
                placeholder="Digite o nome do colaborador"
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
              
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="setor">
                Setor
              </label>
              <p className="form-description">
                Setor de atuação do avaliador no tribunal.
              </p>
              <input
                type="text"
                id="setor"
                name="setor"
                value={form.setor}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Selecione um colaborador para preencher"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="unidade">
                Unidade
              </label>
              <p className="form-description">
                Vara ou unidade específica onde o avaliador atua.
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
                Identificador do avaliador no sistema Sapiens.
              </p>
              <input
                type="text"
                id="sapiensId"
                name="sapiensId"
                value={form.sapiensId}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Será preenchido automaticamente"
                required
                readOnly
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onVoltar} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Cadastrar Avaliador
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CadastroAvaliador;