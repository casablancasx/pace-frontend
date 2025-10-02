import axios from 'axios';
import AuthService from './authService';

const SUPER_SAPIENS_BASE_URL = 'https://supersapiensbackend.agu.gov.br';
const LOTACAO_ENDPOINT = '/v1/administrativo/lotacao';

class SuperSapiensService {
  private static readonly client = axios.create({
    baseURL: SUPER_SAPIENS_BASE_URL,
    timeout: 15000,
  });

  static async getColaborador(nome: string) {
    const sanitizedName = nome.trim();

    if (!sanitizedName) {
      return [];
    }

    const token = AuthService.getToken();

    if (!token) {
      throw new Error('Token de autenticação não encontrado.');
    }

    const termos = sanitizedName.split(/\s+/).filter(Boolean);

    const where = {
      andX: termos.map((termo) => ({
        'colaborador.usuario.nome': `like:%${termo.toUpperCase()}%`,
      })),
    };

    const params = new URLSearchParams({
      where: JSON.stringify(where),
      limit: '30',
      offset: '0',
      order: JSON.stringify({}),
      populate: JSON.stringify([
        'colaborador',
        'colaborador.usuario',
        'colaborador.usuario.colaborador',
        'setor',
        'setor.unidade',
      ]),
      context: JSON.stringify({ semAfastamento: true }),
    });

    const response = await this.client.get(LOTACAO_ENDPOINT, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data?.entities ?? [];
  }
}

export default SuperSapiensService;
