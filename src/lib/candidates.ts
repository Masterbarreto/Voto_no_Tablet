
import { unstable_noStore as noStore } from 'next/cache';

export interface Candidate {
  id: string;
  numero: string;
  nome: string;
  partido: string;
  foto_url: string | null;
  foto: string | null; 
}

const API_URL = 'https://api-urna.onrender.com';

async function getAuthToken(): Promise<string> {
    const authResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@urna.com',
        senha: 'admin123'
      }),
      cache: 'force-cache' // O token pode ser cacheado por um tempo
    });
    
    if (!authResponse.ok) {
      throw new Error('Falha na autenticação do sistema.');
    }
    const authData = await authResponse.json();
    return authData.data.token;
}


// A função getCandidates busca todos os candidatos da eleição ativa
export async function getCandidates(): Promise<Candidate[]> {
  noStore();
  try {
    const token = await getAuthToken();
    
    // 2. Buscar candidatos com o token
    const response = await fetch(`${API_URL}/api/v1/candidatos`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Falha ao buscar candidatos da API');
    }

    const data = await response.json();
    
    if (data.status !== 'sucesso') {
      throw new Error(data.message || 'API retornou um erro ao buscar candidatos.');
    }

    return (data.data?.candidatos || []).map((c: any) => ({
      ...c,
      foto: c.foto_url
    }));
  } catch (error) {
    console.error('Erro detalhado ao buscar candidatos:', error);
    return []; // Retorna um array vazio em caso de qualquer erro
  }
}

// A função getCandidateById busca um candidato específico pelo número DENTRO de uma eleição
export async function getCandidateById(numero: string, eleicaoId: string): Promise<Candidate | undefined> {
  noStore();
  try {
    const token = await getAuthToken();

    // Busca na lista de candidatos da eleição específica
    const response = await fetch(`${API_URL}/api/v1/candidatos?eleicao_id=${eleicaoId}`, {
         headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if(!response.ok) return undefined;

    const data = await response.json();
    
    const foundCandidate = (data.data.candidatos || []).find((c: Candidate) => c.numero === numero);

    if (foundCandidate) {
        return {
            ...foundCandidate,
            foto: foundCandidate.foto_url
        };
    }

    return undefined;

  } catch (error) {
    console.error(`Erro ao buscar candidato ${numero}:`, error);
    return undefined; // Retorna undefined em caso de erro
  }
}
