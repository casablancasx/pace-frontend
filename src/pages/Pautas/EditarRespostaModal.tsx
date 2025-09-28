import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import './EditarRespostaModal.css';

interface PautaResponseDTO {
  pautaId: number;
  data: string;
  orgaoJulgador: string;
  turno: string;
  respostaAnalise: string;
  audiencias: any[];
}

interface EditarRespostaModalProps {
  pauta: PautaResponseDTO;
  isOpen: boolean;
  onClose: () => void;
  onSave: (pautaId: number, novaResposta: string) => void;
}

const EditarRespostaModal: React.FC<EditarRespostaModalProps> = ({
  pauta,
  isOpen,
  onClose,
  onSave
}) => {
  const [respostaSelecionada, setRespostaSelecionada] = useState(pauta.respostaAnalise);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (respostaSelecionada === pauta.respostaAnalise) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      onSave(pauta.pautaId, respostaSelecionada);
      onClose();
    } catch (error) {
      alert('Erro ao salvar resposta. Tente novamente.');
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
          <h2>Alterar Resposta da Análise</h2>
          <button
            onClick={handleClose}
            className="close-button"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="pauta-info">
            <div className="info-row">
              <strong>Data:</strong> {pauta.data}
            </div>
            <div className="info-row">
              <strong>Órgão Julgador:</strong> {pauta.orgaoJulgador}
            </div>
            <div className="info-row">
              <strong>Turno:</strong> {pauta.turno}
            </div>
            <div className="info-row">
              <strong>Audiências:</strong> {pauta.audiencias.length}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Resposta da Análise
            </label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="resposta"
                  value="COMPARECER"
                  checked={respostaSelecionada === 'COMPARECER'}
                  onChange={(e) => setRespostaSelecionada(e.target.value)}
                  disabled={isLoading}
                />
                <span className="radio-custom"></span>
                <span className="radio-label comparecer">COMPARECER</span>
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  name="resposta"
                  value="NÃO COMPARECER"
                  checked={respostaSelecionada === 'NÃO COMPARECER'}
                  onChange={(e) => setRespostaSelecionada(e.target.value)}
                  disabled={isLoading}
                />
                <span className="radio-custom"></span>
                <span className="radio-label nao-comparecer">NÃO COMPARECER</span>
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  name="resposta"
                  value="PENDENTE"
                  checked={respostaSelecionada === 'PENDENTE'}
                  onChange={(e) => setRespostaSelecionada(e.target.value)}
                  disabled={isLoading}
                />
                <span className="radio-custom"></span>
                <span className="radio-label pendente">PENDENTE</span>
              </label>
            </div>
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
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={16} />
                Salvar Alteração
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarRespostaModal;