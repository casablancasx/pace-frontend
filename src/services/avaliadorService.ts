import type { AxiosResponse } from 'axios';
import api from './api';

export interface SetoRequestDTO {
  setorId: number;
  nome: string;
}

export interface UnidadeRequestDTO {
  unidadeId: number;
  nome: string;
}

export interface AvaliadorRequestDTO {
  nome: string;
  email: string;
  telefone: string | null;
  disponivel: boolean;
  sapiensId: number;
  setor: SetoRequestDTO;
  unidade: UnidadeRequestDTO;
}

export interface AvaliadorResponseDTO {
  avaliadorId: number;
  nome: string;
  email: string;
  telefone: string;
  setor: string;
  unidade: string;
  sapiensId: number;
  quantidadeAudiencias: number;
  quantidadePautas: number;
  score: number;
  disponivel: boolean;
  adicionadoPor: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

class AvaliadorService {
  /**
   * Cadastra um novo avaliador
   * @param avaliador - Dados do avaliador a ser cadastrado
   * @returns Promise com os dados do avaliador cadastrado
   */
  async cadastrarAvaliador(avaliador: AvaliadorRequestDTO): Promise<AxiosResponse<AvaliadorResponseDTO>> {
    try {
      const response = await api.post<AvaliadorResponseDTO>('/avaliador', avaliador);
      return response;
    } catch (error: any) {
      console.error('Erro ao cadastrar avaliador:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Erro ao cadastrar avaliador. Por favor, tente novamente.');
    }
  }

  /**
   * Lista todos os avaliadores com paginação e filtros
   * @param page - Número da página (baseado em 0)
   * @param size - Tamanho da página
   * @param nome - Filtro opcional por nome
   * @param sort - Campo para ordenação (padrão: nome)
   * @returns Promise com a resposta paginada de avaliadores
   */
  async listarAvaliadores(
    page: number = 0,
    size: number = 10,
    nome?: string,
    sort: string = 'nome'
  ): Promise<PageResponse<AvaliadorResponseDTO>> {
    try {
      const params: any = {
        page,
        size,
        sort
      };

      if (nome) {
        params.nome = nome;
      }

      const response = await api.get<PageResponse<AvaliadorResponseDTO>>('/avaliador', {
        params
      });

      return response.data;
    } catch (error: any) {
      console.error('Erro ao listar avaliadores:', error);
      throw new Error('Erro ao carregar lista de avaliadores.');
    }
  }

  /**
   * Busca um avaliador por ID
   * @param id - ID do avaliador
   * @returns Promise com os dados do avaliador
   */
  async buscarAvaliadorPorId(id: number): Promise<AvaliadorResponseDTO> {
    try {
      const response = await api.get<AvaliadorResponseDTO>(`/avaliador/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar avaliador:', error);
      throw new Error('Erro ao carregar dados do avaliador.');
    }
  }

  /**
   * Atualiza um avaliador existente
   * @param id - ID do avaliador
   * @param avaliador - Dados atualizados do avaliador
   * @returns Promise com os dados do avaliador atualizado
   */
  async atualizarAvaliador(id: number, avaliador: AvaliadorRequestDTO): Promise<AvaliadorResponseDTO> {
    try {
      const response = await api.put<AvaliadorResponseDTO>(`/avaliador/${id}`, avaliador);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar avaliador:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Erro ao atualizar avaliador. Por favor, tente novamente.');
    }
  }

  /**
   * Remove um avaliador
   * @param id - ID do avaliador
   * @returns Promise void
   */
  async deletarAvaliador(id: number): Promise<void> {
    try {
      await api.delete(`/avaliador/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar avaliador:', error);
      throw new Error('Erro ao remover avaliador.');
    }
  }
}

export default new AvaliadorService();
