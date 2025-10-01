import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import './AdicionarAnaliseModal.css';

interface AudienciaResponseDTO {
  numeroProcesso: string;
  hora: string;
  nomeParte: string;
  advogados: string[];
  assunto: string;
  classeJudicial: string;
  prioridade: string;
  analise: string;
}

interface AdicionarAnaliseModalProps {
  audiencia: AudienciaResponseDTO;
  isOpen: boolean;
  onClose: () => void;
  onSave: (numeroProcesso: string, analise: string) => void;
}

const AdicionarAnaliseModal: React.FC<AdicionarAnaliseModalProps> = ({
  audiencia,
  isOpen,
  onClose,
  onSave
}) => {
  const [analise, setAnalise] = useState(audiencia.analise || '');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!analise.trim()) {
      alert('Por favor, insira uma análise.');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      onSave(audiencia.numeroProcesso, analise);
      onClose();
    } catch (error) {
      alert('Erro ao salvar análise. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Adicionar Análise</h2>
          <button
            onClick={handleClose}
            className="close-button"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="analise" className="form-label">
              Análise da Audiência
            </label>
            <textarea
              id="analise"
              value={analise}
              onChange={(e) => setAnalise(e.target.value)}
              placeholder="Digite sua análise sobre esta audiência..."
              className="form-textarea"
              rows={6}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={handleClose}
            className="cancel-button"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="save-button"
            disabled={isLoading || !analise.trim()}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={16} />
                Salvar Análise
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdicionarAnaliseModal;