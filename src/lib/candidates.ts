
import { unstable_noStore as noStore } from 'next/cache';

export interface Candidate {
  id: string;
  numero: string;
  nome: string;
  partido: string;
  foto_url: string;
  // Renomeando para corresponder à API e padronizando
  foto: string; 
}

const API_URL = 'https://api-urna.onrender.com';

// A função getCandidates busca todos os candidatos da eleição ativa
export async function getCandidates(): Promise<Candidate[]> {
  noStore();
  try {
    // Este endpoint busca os candidatos da eleição que está ativa no momento
    const response = await fetch(`${API_URL}/api/urna-votacao/candidatos`);
    if (!response.ok) {
      throw new Error('Falha ao buscar candidatos da API');
    }
    const data = await response.json();
    // A API retorna um objeto { status, message, data: [...] }
    // Mapeamos para adicionar o campo 'foto' para compatibilidade
    return (data.data || []).map((c: any) => ({
      ...c,
      foto: c.foto_url || `https://picsum.photos/seed/${c.numero}/400/400` // Fallback de imagem
    }));
  } catch (error) {
    console.error('Erro ao buscar candidatos:', error);
    return []; // Retorna um array vazio em caso de erro
  }
}

// A função getCandidateById busca um candidato específico pelo número
export async function getCandidateById(id: string): Promise<Candidate | undefined> {
  noStore();
  try {
    // Buscamos todos os candidatos e filtramos pelo número
    const allCandidates = await getCandidates();
    const candidate = allCandidates.find(c => c.numero === id);
    return candidate;
  } catch (error) {
    console.error(`Erro ao buscar candidato ${id}:`, error);
    return undefined; // Retorna undefined em caso de erro
  }
}
