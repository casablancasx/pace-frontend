import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import './cadastroAdvogado.css';
import advogadoService, { Uf } from '../../services/advogadoService';
import type { AdvogadoRequestDTO } from '../../services/advogadoService';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import TagInput from '../../components/TagInput';

// Mapeamento de siglas de UF para nomes completos
const ufLabels: Record<string, string> = {
  AC: 'Acre',
  AL: 'Alagoas',
  AM: 'Amazonas',
  AP: 'Amapá',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MT: 'Mato Grosso',
  MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais',
  PA: 'Pará',
  PB: 'Paraíba',
  PR: 'Paraná',
  PE: 'Pernambuco',
  PI: 'Piauí',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul',
  RO: 'Rondônia',
  RR: 'Roraima',
  SC: 'Santa Catarina',
  SP: 'São Paulo',
  SE: 'Sergipe',
  TO: 'Tocantins'
};

const getUfLabel = (uf: string): string => {
  return `${uf} - ${ufLabels[uf] || uf}`;
};

interface CadastroAdvogadoForm {
  nome: string;
  ufs: string[];
}

const CadastroAdvogado: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<CadastroAdvogadoForm>({
    nome: '',
    ufs: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lista de todas as UFs
  const allUfs = Object.values(Uf) as Uf[];
  
  // Transforma a lista de UFs em opções para o TagInput
  const ufOptions = allUfs.map(uf => ({
    id: uf,
    label: getUfLabel(uf)
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUfChange = (selectedIds: (number | string)[]) => {
    setForm(prev => ({
      ...prev,
      ufs: selectedIds as string[]
    }));
    
    // Limpa erro quando o usuário seleciona UFs
    if (error && selectedIds.length > 0) {
      setError(null);
    }
  };
  
  const handleCancel = () => {
    navigate('/advogados');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação do formulário
    if (!form.nome.trim()) {
      setError('Por favor, informe o nome do advogado.');
      return;
    }
    
    if (form.ufs.length === 0) {
      setError('Selecione pelo menos uma UF de atuação.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Preparando o payload no formato esperado
    const advogado: AdvogadoRequestDTO = {
      nome: form.nome.trim(),
      ufs: form.ufs as Uf[]
    };
    
    // Log do payload para depuração
    console.log('Enviando dados do advogado:', advogado);
    
    try {
      const response = await advogadoService.cadastrarAdvogadoPrioritario(advogado);
      
      if (response.status === 201) {
        await Swal.fire({
          title: 'Advogado cadastrado!',
          text: `O advogado ${form.nome} foi cadastrado com sucesso como prioritário.`,
          icon: 'success',
          confirmButtonText: 'Voltar para lista',
          buttonsStyling: false,
          customClass: {
            popup: 'avaliador-success-popup',
            title: 'avaliador-success-title',
            htmlContainer: 'avaliador-success-text',
            confirmButton: 'avaliador-success-button',
            icon: 'avaliador-success-icon'
          }
        });
        navigate('/advogados');
        return;
      }
    } catch (error: any) {
      console.error('Erro ao cadastrar advogado:', error);
      setError(error.message || 'Ocorreu um erro ao cadastrar o advogado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="cadastro-avaliador-page">
        <div className="cadastro-header">
          <h1 className="cadastro-title">Cadastrar Advogado Prioritário</h1>
        </div>
        
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">!</span>
            <span className="alert-message">{error}</span>
          </div>
        )}
        
        <form className="cadastro-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nome" className="form-label">Nome completo do advogado</label>
              <p className="form-description">
                Nome completo do advogado que será priorizado.
              </p>
              <input
                type="text"
                id="nome"
                name="nome"
                value={form.nome}
                onChange={handleInputChange}
                placeholder="Ex: Dr. João Silva"
                className="form-input"
                required
              />
            </div>
          
            <div className="form-group form-group-full">
              <TagInput
                label="UFs de atuação"
                placeholder="Busque e selecione as UFs de atuação"
                options={ufOptions}
                selectedIds={form.ufs}
                onChange={handleUfChange}
                className=""
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
              disabled={loading}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Advogado'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CadastroAdvogado;