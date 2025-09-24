
import { unstable_noStore as noStore } from 'next/cache';

export interface Candidate {
  numero: string;
  nome: string;
  partido: string;
  foto: string;
}

const API_URL = 'https://api-urna.onrender.com';

// A função getCandidates busca todos os candidatos da API
export async function getCandidates(): Promise<Candidate[]> {
  // Evita o cache para sempre termos os dados mais recentes
  noStore();
  try {
    const response = await fetch(`${API_URL}/candidatos`);
    if (!response.ok) {
      throw new Error('Falha ao buscar candidatos da API');
    }
    const data = await response.json();
    // A API retorna um objeto com uma chave 'candidatos'
    return data.candidatos || [];
  } catch (error) {
    console.error('Erro ao buscar candidatos:', error);
    return []; // Retorna um array vazio em caso de erro
  }
}

// A função getCandidateById busca um candidato específico pelo número
export async function getCandidateById(id: string): Promise<Candidate | undefined> {
  // Evita o cache
  noStore();
  try {
    const response = await fetch(`${API_URL}/candidatos/${id}`);
    if (response.status === 404) {
      return undefined; // Candidato não encontrado
    }
    if (!response.ok) {
      throw new Error(`Falha ao buscar candidato ${id}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao buscar candidato ${id}:`, error);
    return undefined; // Retorna undefined em caso de erro
  }
}

// Manter a lista antiga como fallback, caso seja necessário, mas não será usada diretamente.
export const candidates: Candidate[] = [
    {
      numero: '12',
      nome: 'Eleonora Silva',
      partido: 'Partido da Inovação',
      foto: 'https://picsum.photos/seed/1/400/400',
    },
    {
      numero: '25',
      nome: 'Ricardo Mendes',
      partido: 'Aliança Progressista',
      foto: 'https://picsum.photos/seed/2/400/400',
    },
    {
      numero: '31',
      nome: 'Júlia Andrade',
      partido: 'Frente Democrática',
      foto: 'https://picsum.photos/seed/3/400/400',
    },
    {
      numero: '45',
      nome: 'Marcos Batista',
      partido: 'União Nacional',
      foto: 'https://picsum.photos/seed/4/400/400',
    },
  ];
