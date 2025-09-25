
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

// Função para obter o token de autenticação, com cache para evitar chamadas repetidas
export async function getAuthToken(): Promise<string> {
    noStore(); // Para garantir que a função seja reexecutada em cada request
    const authResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@urna.com',
        senha: 'admin123'
      }),
      // O token não deve ser cacheado por muito tempo, mas para a mesma request, pode ser
      cache: 'no-store' 
    });
    
    if (!authResponse.ok) {
      throw new Error('Falha na autenticação do sistema.');
    }
    const authData = await authResponse.json();
    return authData.data.token;
}

// Busca todos os candidatos da eleição ativa
export async function getCandidates(eleicaoId?: string): Promise<Candidate[]> {
  noStore();
  try {
    const token = await getAuthToken();
    
    let url = `${API_URL}/api/v1/candidatos`;
    if (eleicaoId) {
        url += `?eleicao_id=${eleicaoId}`;
    }

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
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
    return [];
  }
}

// Busca um candidato específico pelo número DENTRO de uma eleição
export async function getCandidateByNumero(numero: string, eleicaoId: string): Promise<Candidate | null> {
  noStore();
  try {
    const candidates = await getCandidates(eleicaoId);
    const foundCandidate = candidates.find((c: Candidate) => c.numero === numero);

    if (foundCandidate) {
        return {
            ...foundCandidate,
            foto: foundCandidate.foto_url
        };
    }
    return null;
  } catch (error) {
    console.error(`Erro ao buscar candidato ${numero}:`, error);
    return null;
  }
}
