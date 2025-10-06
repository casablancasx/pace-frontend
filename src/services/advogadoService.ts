import type { AxiosResponse } from 'axios';
import api from './api';

// Enumeração de UFs
export const Uf = {
  AC: "AC",
  AL: "AL",
  AM: "AM",
  AP: "AP",
  BA: "BA",
  CE: "CE",
  DF: "DF",
  ES: "ES",
  GO: "GO",
  MA: "MA",
  MG: "MG",
  MS: "MS",
  MT: "MT",
  PA: "PA",
  PB: "PB",
  PE: "PE",
  PI: "PI",
  PR: "PR",
  RJ: "RJ",
  RN: "RN",
  RO: "RO",
  RR: "RR",
  RS: "RS",
  SC: "SC",
  SE: "SE",
  SP: "SP",
  TO: "TO"
} as const;

export type Uf = typeof Uf[keyof typeof Uf];

export interface AdvogadoRequestDTO {
  nome: string;
  ufs: Uf[];
}

export interface AdvogadoResponseDTO {
  id: number;
  nome: string;
  ufs: Uf[];
  isPrioritario: boolean;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

class AdvogadoService {
  /**
   * Lista os advogados com paginação e filtros
   * @param page - Número da página (baseado em 0)
   * @param size - Tamanho da página
   * @param prioritarios - Filtrar apenas advogados prioritários
   * @returns Promise com a resposta paginada de advogados
   */
  async listarAdvogados(
    page: number = 0,
    size: number = 10,
    prioritarios: boolean = false
  ): Promise<PageResponse<AdvogadoResponseDTO>> {
    try {
      const params = {
        page,
        size,
        prioritarios
      };

      const response = await api.get<PageResponse<AdvogadoResponseDTO>>('/advogado', {
        params
      });

      return response.data;
    } catch (error: any) {
      console.error('Erro ao listar advogados:', error);
      throw new Error('Erro ao carregar lista de advogados.');
    }
  }

  /**
   * Cadastra um novo advogado prioritário
   * @param advogado - Dados do advogado a ser cadastrado
   * @returns Promise com os dados do advogado cadastrado
   */
  async cadastrarAdvogadoPrioritario(advogado: AdvogadoRequestDTO): Promise<AxiosResponse<AdvogadoResponseDTO>> {
    try {
      const response = await api.post<AdvogadoResponseDTO>('/advogado', advogado);
      return response;
    } catch (error: any) {
      console.error('Erro ao cadastrar advogado:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Erro ao cadastrar advogado prioritário. Por favor, tente novamente.');
    }
  }

  /**
   * Remove um advogado prioritário
   * @param id - ID do advogado
   * @returns Promise void
   */
  async deletarAdvogado(id: number): Promise<void> {
    if (!id) {
      throw new Error('ID do advogado não fornecido ou inválido.');
    }
    try {
      await api.delete(`/advogado/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar advogado:', error);
      throw new Error('Erro ao remover advogado prioritário.');
    }
  }
}

export default new AdvogadoService();