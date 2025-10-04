import React, { useState, useRef } from 'react';
import type { DragEvent } from 'react';
import { Upload, File, X, CheckCircle2, AlertCircle } from 'lucide-react';
import Layout from '../Layout';
import planilhaService from '../../services/planilhaService';
import './ImportarPlanilha.css';

interface FileUploadProps {
  file: File | null;
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

const ImportarPlanilha: React.FC = () => {
  const [uploadState, setUploadState] = useState<FileUploadProps>({
    file: null,
    status: 'idle',
    progress: 0
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFileTypes = [
    '.xlsx',
    '.xls',
    '.csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv'
  ];

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    // Validate file type
    const isValidType = acceptedFileTypes.some(type => 
      file.type === type || file.name.toLowerCase().endsWith(type.replace('*', ''))
    );

    if (!isValidType) {
      setUploadState({
        file: null,
        status: 'error',
        progress: 0,
        error: 'Tipo de arquivo não suportado. Use apenas arquivos Excel (.xlsx, .xls) ou CSV.'
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadState({
        file: null,
        status: 'error',
        progress: 0,
        error: 'Arquivo muito grande. O tamanho máximo é 10MB.'
      });
      return;
    }

    setUploadState({
      file,
      status: 'idle',
      progress: 0
    });
  };

  const simulateUpload = async () => {
    if (!uploadState.file) return;

    setUploadState(prev => ({ ...prev, status: 'uploading', progress: 0 }));

    try {
      await planilhaService.importarPlanilha(
        uploadState.file,
        (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadState(prev => ({ ...prev, progress: percentCompleted }));
          }
        }
      );

      setUploadState(prev => ({
        ...prev,
        status: 'success',
        progress: 100
      }));
    } catch (error: any) {
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        progress: 0,
        error: error.response?.data?.message || 'Erro ao fazer upload da planilha.'
      }));
    }
  };

  const handleRemoveFile = () => {
    setUploadState({
      file: null,
      status: 'idle',
      progress: 0
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout>
      <div className="importar-planilha-page">
        <div className="importar-header">
          <h1 className="importar-title">Importar Planilha</h1>
          <p className="importar-description">
            Faça upload de planilhas Excel ou CSV para importar dados para o sistema.
          </p>
        </div>

        <div className="upload-container">
          <div 
            className={`upload-zone ${isDragOver ? 'upload-zone--drag-over' : ''} ${uploadState.file ? 'upload-zone--has-file' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFileTypes.join(',')}
              onChange={handleFileInputChange}
              className="upload-input"
              hidden
            />

            {!uploadState.file ? (
              <div className="upload-placeholder">
                <Upload size={48} className="upload-icon" />
                <h3 className="upload-title">Arrastar arquivo ou clique para selecionar</h3>
                <p className="upload-subtitle">
                  Suporte para Excel (.xlsx, .xls) e CSV (máx. 10MB)
                </p>
              </div>
            ) : (
              <div className="file-preview">
                <div className="file-info">
                  <File size={32} className="file-icon" />
                  <div className="file-details">
                    <span className="file-name">{uploadState.file.name}</span>
                    <span className="file-size">{formatFileSize(uploadState.file.size)}</span>
                  </div>
                  <button 
                    className="remove-file-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {uploadState.status === 'uploading' && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${uploadState.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{uploadState.progress}%</span>
                  </div>
                )}

                {uploadState.status === 'success' && (
                  <div className="upload-status upload-status--success">
                    <CheckCircle2 size={20} />
                    <span>Upload concluído com sucesso!</span>
                  </div>
                )}

                {uploadState.status === 'error' && (
                  <div className="upload-status upload-status--error">
                    <AlertCircle size={20} />
                    <span>{uploadState.error}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {uploadState.file && uploadState.status === 'idle' && (
            <div className="upload-actions">
              <button 
                className="upload-button"
                onClick={(e) => {
                  e.stopPropagation();
                  simulateUpload();
                }}
              >
                <Upload size={16} />
                Iniciar Upload
              </button>
              <button 
                className="cancel-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        <div className="upload-info">
          <h3 className="info-title">Formatos suportados:</h3>
          <ul className="info-list">
            <li>Excel (.xlsx, .xls) - Recomendado</li>
            <li>CSV (Comma-Separated Values)</li>
          </ul>

          <h3 className="info-title">Requisitos:</h3>
          <ul className="info-list">
            <li>Tamanho máximo do arquivo: 10MB</li>
            <li>A primeira linha deve conter os cabeçalhos das colunas</li>
            <li>Dados devem estar organizados em linhas e colunas</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ImportarPlanilha;