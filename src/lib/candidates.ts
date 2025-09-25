
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

// A função getCandidates busca todos os candidatos da eleição ativa
export async function getCandidates(): Promise<Candidate[]> {
  noStore();
  try {
    // 1. Autenticar para obter o token
    const authResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@urna.com', // Credenciais de serviço
        senha: 'admin123'
      }),
    });
    
    if (!authResponse.ok) {
      throw new Error('Falha na autenticação do sistema para buscar candidatos.');
    }
    const authData = await authResponse.json();
    const token = authData.data.token;
    
    // 2. Buscar candidatos com o token
    const response = await fetch(`${API_URL}/api/urna-votacao/candidatos`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
      // Se a API retornar "Nenhuma eleição ativa", não tratamos como um erro fatal.
      // Apenas retornamos uma lista vazia para a UI lidar com isso.
      if (data.message === 'Nenhuma eleição ativa encontrada') {
        console.warn('Nenhuma eleição ativa encontrada na API.');
        return [];
      }
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error('Falha ao buscar candidatos da API');
    }
    
    if (data.status !== 'sucesso') {
      throw new Error(data.message || 'API retornou um erro ao buscar candidatos.');
    }

    return (data.data || []).map((c: any) => ({
      ...c,
      foto: c.foto_url
    }));
  } catch (error) {
    console.error('Erro detalhado ao buscar candidatos:', error);
    return []; // Retorna um array vazio em caso de qualquer erro
  }
}

// A função getCandidateById busca um candidato específico pelo número
export async function getCandidateById(id: string): Promise<Candidate | undefined> {
  noStore();
  try {
    // Para buscar um candidato específico, não dependemos apenas da eleição ativa.
    // Vamos usar o endpoint geral de candidatos, que é mais robusto.
     const authResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@urna.com',
        senha: 'admin123'
      }),
    });
    if (!authResponse.ok) throw new Error('Falha na autenticação do sistema.');
    const authData = await authResponse.json();
    const token = authData.data.token;

    // Busca na lista completa de candidatos
    const response = await fetch(`${API_URL}/api/v1/candidatos?search=${id}`, {
         headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if(!response.ok) return undefined;

    const data = await response.json();
    
    const foundCandidate = (data.data.candidatos || []).find((c: Candidate) => c.numero === id);

    if (foundCandidate) {
        return {
            ...foundCandidate,
            foto: foundCandidate.foto_url
        };
    }

    return undefined;

  } catch (error) {
    console.error(`Erro ao buscar candidato ${id}:`, error);
    return undefined; // Retorna undefined em caso de erro
  }
}
