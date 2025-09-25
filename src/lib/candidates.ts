
import { unstable_noStore as noStore } from 'next/cache';

export interface Candidate {
  id: string;
  numero: string;
  nome: string;
  partido: string;
  foto_url: string;
  foto: string; 
}

const API_URL = 'https://api-urna.onrender.com';

// A função getCandidates busca todos os candidatos da eleição ativa
export async function getCandidates(): Promise<Candidate[]> {
  noStore();
  try {
    // 1. Autenticar para obter o token (se necessário para este endpoint)
    // Muitas APIs de urna pública não exigem token para listar candidatos,
    // mas se a sua exigir, o fluxo seria este.
    // Vamos assumir que, por enquanto, ele é público, mas se falhar,
    // precisaremos adicionar a lógica de login aqui.
    
    const response = await fetch(`${API_URL}/api/urna-votacao/candidatos`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error('Falha ao buscar candidatos da API');
    }

    const data = await response.json();
    
    if (data.status !== 'sucesso') {
      throw new Error(data.message || 'API retornou um erro ao buscar candidatos.');
    }

    return (data.data || []).map((c: any) => ({
      ...c,
      foto: c.foto_url || `https://picsum.photos/seed/${c.numero}/400/400`
    }));
  } catch (error) {
    console.error('Erro detalhado ao buscar candidatos:', error);
    return []; // Retorna um array vazio em caso de erro
  }
}

// A função getCandidateById busca um candidato específico pelo número
export async function getCandidateById(id: string): Promise<Candidate | undefined> {
  noStore();
  try {
    const allCandidates = await getCandidates();
    const candidate = allCandidates.find(c => c.numero === id);
    return candidate;
  } catch (error) {
    console.error(`Erro ao buscar candidato ${id}:`, error);
    return undefined; // Retorna undefined em caso de erro
  }
}
