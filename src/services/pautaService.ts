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
  id: number;
  nome: string;
  uf: string;
}

export interface ListarPautasParams {
  page: number;
  size: number;
  resultadoAnalise?: string;
  uf?: string;
  orgaoJulgador?: string;
  sala?: string;
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
      if (params.uf) {
        queryParams.uf = params.uf;
      }
      if (params.orgaoJulgador) {
        queryParams.orgaoJulgador = params.orgaoJulgador;
      }
      if (params.sala) {
        queryParams.sala = params.sala;
      }

      const response = await api.get<PageResponse<PautaResponseDTO>>('/pautas', {
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
      const response = await api.get<PautaResponseDTO>(`/pautas/${pautaId}`);
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
   * Busca órgãos julgadores por UF e nome
   * @param uf - UF do órgão julgador
   * @param nome - Nome parcial do órgão julgador
   * @returns Promise com lista de órgãos julgadores
   */
  async listarOrgaosJulgadores(
    uf: string,
    nome: string
  ): Promise<OrgaoJulgadorResponse[]> {
    try {
      const response = await api.get<OrgaoJulgadorResponse[]>('/orgao-julgador', {
        params: { uf, nome }
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar órgãos julgadores:', error);
      throw new Error('Erro ao buscar órgãos julgadores.');
    }
  }
}

export default new PautaService();
