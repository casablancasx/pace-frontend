import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import ColaboradorAutocomplete from '../../components/Avaliadores/ColaboradorAutocomplete';
import avaliadorService from '../../services/avaliadorService';
import './cadastroAvaliador.css';

interface CadastroAvaliadorForm {
  nome: string;
  telefone: string;
  email: string;
  setor: {
    setorId: number;
    nome: string;
  } | null;
  unidade: {
    unidadeId: number;
    nome: string;
  } | null;
}

interface CadastroAvaliadorProps {
  onVoltar: () => void;
}

const CadastroAvaliador: React.FC<CadastroAvaliadorProps> = ({ onVoltar }) => {
  const [form, setForm] = useState<CadastroAvaliadorForm>({
    nome: '',
    telefone: '',
    email: '',
    setor: null,
    unidade: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
        ...(needsReset ? { setor: null, unidade: null } : {}),
      };
    });
  };

  const handleColaboradorSelect = (lotacao: any) => {
    const nome = lotacao?.colaborador?.usuario?.nome ?? '';
    const email = lotacao?.colaborador?.usuario?.email ?? '';
    
    const unidadeData = lotacao?.setor?.unidade;
    const setorData = lotacao?.setor;

    const unidade = unidadeData?.id ? {
      unidadeId: Number(unidadeData.id),
      nome: unidadeData.nome ?? ''
    } : null;

    const setor = setorData?.id ? {
      setorId: Number(setorData.id),
      nome: setorData.nome ?? ''
    } : null;

    setForm(prev => ({
      ...prev,
      nome,
      email: email || prev.email,
      unidade,
      setor,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!form.nome.trim()) {
      setError('Por favor, selecione um colaborador.');
      return;
    }

    if (!form.email.trim()) {
      setError('Por favor, informe o email.');
      return;
    }

    if (!form.setor || !form.unidade) {
      setError('Por favor, selecione um colaborador válido com setor e unidade.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await avaliadorService.cadastrarAvaliador({
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        disponivel: true,
        setor: form.setor,
        unidade: form.unidade
      });

      setSuccess(true);
      
      // Limpar formulário após 2 segundos e voltar
      setTimeout(() => {
        onVoltar();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar avaliador. Tente novamente.');
    } finally {
      setLoading(false);
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
          <h1 className="cadastro-title">Cadastrar Avaliador</h1>
        </div>

        <form onSubmit={handleSubmit} className="cadastro-form">
          {error && (
            <div className="alert alert-error">
              <XCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <CheckCircle2 size={20} />
              <span>Avaliador cadastrado com sucesso!</span>
            </div>
          )}

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
                Telefone <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>(opcional)</span>
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
                value={form.setor?.nome || ''}
                className="form-input"
                placeholder="Selecione um colaborador para preencher"
                required
                readOnly
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
                value={form.unidade?.nome || ''}
                className="form-input"
                placeholder="Selecione um colaborador para preencher"
                required
                readOnly
              />
            </div>

          </div>

          <div className="form-actions">
            <button type="button" onClick={onVoltar} className="cancel-button" disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar Avaliador'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CadastroAvaliador;