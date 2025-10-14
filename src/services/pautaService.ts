import api from './api';

export interface AudienciaResponseDTO {
  numeroProcesso: string;
  hora: string;
  nomeParte: string;
  advogados: string[];
  assunto: string;
  classeJudicial: string;
  isPrioritaria: boolean;
  statusComparecimento: string;
  analise: string;
}

export interface PautaResponseDTO {
  pautaId: number;
  data: string;
  orgaoJulgador: string;
  turno: string;
  analiseComparecimento: string;
  audiencias: AudienciaResponseDTO[];
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface OrgaoJulgadorResponse {
  orgaoJulgadorId: number;
  nome: string;
}

export interface SalaResponse {
  salaId: number;
  sala: string;
}

export interface UfResponse {
  ufId: number;
  sigla: string;
}

export interface AssuntoResponse {
  assuntoId: number;
  assunto: string;
}

export interface ListarPautasParams {
  page: number;
  size: number;
  resultadoAnalise?: string;
  ufId?: number;
  orgaoJulgadorId?: number;
  salaId?: number;
  assuntoId?: number;
}

class PautaService {
  /**
   * Lista as pautas com paginação e filtros
   * @param params - Parâmetros de busca e paginação
   * @returns Promise com a resposta paginada de pautas
   */
  async listarPautas(params: ListarPautasParams): Promise<PageResponse<PautaResponseDTO>> {
    try {
      const queryParams: any = {
        page: params.page,
        size: params.size,
      };

      // Adiciona apenas os filtros que foram fornecidos
      if (params.resultadoAnalise) {
        queryParams.resultadoAnalise = params.resultadoAnalise;
      }
      if (params.ufId) {
        queryParams.ufId = params.ufId;
      }
      if (params.orgaoJulgadorId) {
        queryParams.orgaoJulgadorId = params.orgaoJulgadorId;
      }
      if (params.salaId) {
        queryParams.salaId = params.salaId;
      }
      if (params.assuntoId) {
        queryParams.assuntoId = params.assuntoId;
      }

      const response = await api.get<PageResponse<PautaResponseDTO>>('/pauta', {
        params: queryParams
      });

      return response.data;
    } catch (error: any) {
      console.error('Erro ao listar pautas:', error);
      throw new Error('Erro ao carregar lista de pautas.');
    }
  }

  /**
   * Busca uma pauta específica pelo ID
   * @param pautaId - ID da pauta
   * @returns Promise com os dados da pauta
   */
  async buscarPautaPorId(pautaId: number): Promise<PautaResponseDTO> {
    try {
      const response = await api.get<PautaResponseDTO>(`/pauta/${pautaId}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar pauta:', error);
      throw new Error('Erro ao carregar detalhes da pauta.');
    }
  }

  /**
   * Atualiza a análise de uma audiência
   * @param pautaId - ID da pauta
   * @param numeroProcesso - Número do processo da audiência
   * @param analise - Nova análise
   * @returns Promise void
   */
  async atualizarAnaliseAudiencia(
    pautaId: number,
    numeroProcesso: string,
    analise: string
  ): Promise<void> {
    try {
      await api.patch(`/pautas/${pautaId}/audiencias/${numeroProcesso}/analise`, {
        analise
      });
    } catch (error: any) {
      console.error('Erro ao atualizar análise:', error);
      throw new Error('Erro ao atualizar análise da audiência.');
    }
  }

  /**
   * Busca órgãos julgadores por UF
   * @param ufId - ID da UF
   * @returns Promise com lista de órgãos julgadores
   */
  async listarOrgaosJulgadoresPorUf(
    ufId: number
  ): Promise<OrgaoJulgadorResponse[]> {
    try {
      const response = await api.get<OrgaoJulgadorResponse[]>('/orgao-julgador', {
        params: { ufId }
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar órgãos julgadores:', error);
      throw new Error('Erro ao buscar órgãos julgadores.');
    }
  }

  /**
   * Busca salas por órgão julgador
   * @param orgaoJulgadorId - ID do órgão julgador
   * @returns Promise com lista de salas
   */
  async listarSalasPorOrgaoJulgador(
    orgaoJulgadorId: number
  ): Promise<SalaResponse[]> {
    try {
      const response = await api.get<SalaResponse[]>(`/sala/${orgaoJulgadorId}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar salas:', error);
      throw new Error('Erro ao buscar salas.');
    }
  }

  /**
   * Lista todas as UFs disponíveis
   * @returns Promise com lista de UFs
   */
  async listarUfs(): Promise<UfResponse[]> {
    try {
      const response = await api.get<UfResponse[]>('/uf');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar UFs:', error);
      throw new Error('Erro ao buscar UFs.');
    }
  }

  /**
   * Busca assuntos por nome
   * @param nome - Nome parcial do assunto
   * @returns Promise com lista de assuntos
   */
  async listarAssuntos(nome: string): Promise<AssuntoResponse[]> {
    try {
      const response = await api.get<AssuntoResponse[]>('/assunto', {
        params: { nome }
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar assuntos:', error);
      throw new Error('Erro ao buscar assuntos.');
    }
  }
}

export default new PautaService();
