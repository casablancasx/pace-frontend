import React, { useState } from 'react';
import { Calendar, Users, MapPin } from 'lucide-react';
import Layout from '../../components/Layout';
import TagInput from '../../components/TagInput';
import AudienciasPendentes from '../../components/AudienciasPendentes';
import './EscalaAvaliadores.css';

interface EscalaAvaliadorForm {
  setorOrigemId: string;
  especieTarefaId: string;
  dataInicio: string;
  dataFim: string;
  uf: string;
  orgaoJulgadorIds: (number | string)[];
  avaliadorIds: (number | string)[];
}



// Mock data for dropdowns and tags
const ufs = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

const orgaosJulgadores = [
  { id: 1, label: '1ª Vara Cível de São Paulo' },
  { id: 2, label: '2ª Vara Cível de São Paulo' },
  { id: 3, label: '1ª Vara Criminal de São Paulo' },
  { id: 4, label: '2ª Vara Criminal de São Paulo' },
  { id: 5, label: '1ª Vara da Família de São Paulo' },
  { id: 6, label: '2ª Vara da Família de São Paulo' },
  { id: 7, label: '1ª Vara do Trabalho de São Paulo' },
  { id: 8, label: '2ª Vara do Trabalho de São Paulo' },
  { id: 9, label: '1ª Vara Federal de São Paulo' },
  { id: 10, label: '2ª Vara Federal de São Paulo' },
  { id: 11, label: '1ª Vara Cível do Rio de Janeiro' },
  { id: 12, label: '2ª Vara Cível do Rio de Janeiro' },
  { id: 13, label: '1ª Vara Criminal do Rio de Janeiro' },
  { id: 14, label: '2ª Vara Criminal do Rio de Janeiro' },
  { id: 15, label: '1ª Vara da Família do Rio de Janeiro' }
];

const avaliadores = [
  { id: 1, label: 'Maria Silva Santos' },
  { id: 2, label: 'João Carlos Oliveira' },
  { id: 3, label: 'Ana Paula Costa' },
  { id: 4, label: 'Pedro Miguel Silva' },
  { id: 5, label: 'Carla Fernandes' },
  { id: 6, label: 'Roberto Santos' },
  { id: 7, label: 'Juliana Pereira' },
  { id: 8, label: 'Fernando Almeida' },
  { id: 9, label: 'Patrícia Lima' },
  { id: 10, label: 'Ricardo Machado' },
  { id: 11, label: 'Camila Rodrigues' },
  { id: 12, label: 'Diego Martins' },
  { id: 13, label: 'Luciana Torres' },
  { id: 14, label: 'Marcos Vieira' },
  { id: 15, label: 'Beatriz Souza' }
];

const EscalaAvaliadores: React.FC = () => {
  const [form, setForm] = useState<EscalaAvaliadorForm>({
    setorOrigemId: '',
    especieTarefaId: '',
    dataInicio: '',
    dataFim: '',
    uf: '',
    orgaoJulgadorIds: [],
    avaliadorIds: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrgaoJulgadorChange = (selectedIds: (number | string)[]) => {
    setForm(prev => ({
      ...prev,
      orgaoJulgadorIds: selectedIds
    }));
  };

  const handleAvaliadorChange = (selectedIds: (number | string)[]) => {
    setForm(prev => ({
      ...prev,
      avaliadorIds: selectedIds
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Aqui seria a lógica de envio para a API
      console.log('Dados da escala:', form);
      
      // Simulação de delay da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Avaliadores escalados com sucesso!');
      
      // Reset form
      setForm({
        setorOrigemId: '',
        especieTarefaId: '',
        dataInicio: '',
        dataFim: '',
        uf: '',
        orgaoJulgadorIds: [],
        avaliadorIds: []
      });
      
    } catch (error) {
      console.error('Erro ao escalar avaliadores:', error);
      alert('Erro ao escalar avaliadores. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      form.setorOrigemId.trim() &&
      form.especieTarefaId.trim() &&
      form.dataInicio &&
      form.dataFim &&
      form.uf &&
      form.orgaoJulgadorIds.length > 0 &&
      form.avaliadorIds.length > 0
    );
  };

  return (
    <Layout>
      <div className="escala-avaliadores-page">
        <div className="escala-header">
          <h1 className="escala-title">Escala para Avaliador</h1>
        </div>

        <form onSubmit={handleSubmit} className="escala-form">
            <div className="form-grid">
              {/* Setor Origem */}
              <div className="form-group">
                <label htmlFor="setorOrigemId" className="form-label">
                  Setor Origem
                </label>
                <input
                  type="text"
                  id="setorOrigemId"
                  name="setorOrigemId"
                  value={form.setorOrigemId}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Digite o setor de origem"
                  required
                />
              </div>

              {/* Espécie Tarefa */}
              <div className="form-group">
                <label htmlFor="especieTarefaId" className="form-label">
                  Espécie Tarefa
                </label>
                <input
                  type="text"
                  id="especieTarefaId"
                  name="especieTarefaId"
                  value={form.especieTarefaId}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Digite a espécie da tarefa"
                  required
                />
              </div>

              {/* Data Início */}
              <div className="form-group">
                <label htmlFor="dataInicio" className="form-label">
                  <Calendar size={16} />
                  Data Início
                </label>
                <input
                  type="date"
                  id="dataInicio"
                  name="dataInicio"
                  value={form.dataInicio}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              {/* Data Fim */}
              <div className="form-group">
                <label htmlFor="dataFim" className="form-label">
                  <Calendar size={16} />
                  Data Fim
                </label>
                <input
                  type="date"
                  id="dataFim"
                  name="dataFim"
                  value={form.dataFim}
                  onChange={handleInputChange}
                  className="form-input"
                  min={form.dataInicio}
                  required
                />
              </div>

              {/* UF */}
              <div className="form-group">
                <label htmlFor="uf" className="form-label">
                  <MapPin size={16} />
                  UF
                </label>
                <select
                  id="uf"
                  name="uf"
                  value={form.uf}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Selecione o estado</option>
                  {ufs.map(uf => (
                    <option key={uf.value} value={uf.value}>
                      {uf.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Órgão Julgador - TagInput */}
            <TagInput
              label="Órgão Julgador"
              placeholder="Busque e selecione os órgãos julgadores"
              options={orgaosJulgadores}
              selectedIds={form.orgaoJulgadorIds}
              onChange={handleOrgaoJulgadorChange}
              className="form-group-full"
            />

            {/* Avaliadores - TagInput */}
            <TagInput
              label="Avaliadores"
              placeholder="Busque e selecione os avaliadores"
              options={avaliadores}
              selectedIds={form.avaliadorIds}
              onChange={handleAvaliadorChange}
              className="form-group-full"
            />

            {/* Botão de Submit */}
            <div className="form-actions">
              <button
                type="submit"
                className="escalar-button"
                disabled={!isFormValid() || isSubmitting}
              >
                <Users size={20} />
                {isSubmitting ? 'Escalando...' : 'Escalar Avaliadores'}
              </button>
            </div>
          </form>

          {/* Seção de Audiências Pendentes */}
          <AudienciasPendentes />
      </div>
    </Layout>
  );
};

export default EscalaAvaliadores;