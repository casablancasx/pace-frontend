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
  telefone: string;
  disponivel: boolean;
  setor: SetoRequestDTO;
  unidade: UnidadeRequestDTO;
}

export interface AvaliadorResponseDTO {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  disponivel: boolean;
  setor: SetoRequestDTO;
  unidade: UnidadeRequestDTO;
}

class AvaliadorService {
  /**
   * Cadastra um novo avaliador
   * @param avaliador - Dados do avaliador a ser cadastrado
   * @returns Promise com os dados do avaliador cadastrado
   */
  async cadastrarAvaliador(avaliador: AvaliadorRequestDTO): Promise<AvaliadorResponseDTO> {
    try {
      const response = await api.post<AvaliadorResponseDTO>('/avaliador', avaliador);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao cadastrar avaliador:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Erro ao cadastrar avaliador. Por favor, tente novamente.');
    }
  }

  /**
   * Lista todos os avaliadores
   * @returns Promise com a lista de avaliadores
   */
  async listarAvaliadores(): Promise<AvaliadorResponseDTO[]> {
    try {
      const response = await api.get<AvaliadorResponseDTO[]>('/avaliador');
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
