import api from './api';
import type { AxiosProgressEvent } from 'axios';

export interface PlanilhaResponseDTO {
  message: string;
  file: string;
  user: string;
  hash: string;
  totalAudiencias: number;
}

export interface UploadProgressCallback {
  (progressEvent: AxiosProgressEvent): void;
}

class PlanilhaService {
  /**
   * Importa uma planilha para o backend
   * @param file - Arquivo da planilha a ser importado
   * @param onUploadProgress - Callback opcional para acompanhar o progresso do upload
   * @returns Promise com a resposta do servidor
   */
  async importarPlanilha(
    file: File,
    onUploadProgress?: UploadProgressCallback
  ): Promise<PlanilhaResponseDTO> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<PlanilhaResponseDTO>(
      '/planilha/importar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onUploadProgress,
      }
    );

    return response.data;
  }
}

export default new PlanilhaService();
