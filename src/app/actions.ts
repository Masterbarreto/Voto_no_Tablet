
'use server';

import { generateVotingAdvice } from '@/ai/flows/generate-voting-advice';
import { getCandidates } from '@/lib/candidates';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { cookies } from 'next/headers';

const API_URL = 'https://api-urna.onrender.com';

export async function validateVoter(prevState: any, formData: FormData) {
  const schema = z.object({
    matricula: z.string().min(1, 'Matrícula é obrigatória.'),
  });
  
  const validatedFields = schema.safeParse({
    matricula: formData.get('matricula'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.matricula?.[0]
    };
  }
  
  const { matricula } = validatedFields.data;

  try {
    const authResponse = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@urna.com', senha: 'admin123' }),
    });
    if (!authResponse.ok) {
        return { success: false, message: 'Erro de autenticação interna.' };
    }
    const authData = await authResponse.json();
    const token = authData.data.token;

    const response = await fetch(`${API_URL}/api/v1/eleitores/validar`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ matricula }),
    });
    
    const data = await response.json();

    if (!response.ok || data.status !== 'sucesso' || !data.data.apto_para_votar) {
      return { success: false, message: data.message || 'Matrícula inválida ou eleitor não apto para votar.' };
    }
    
    // Armazenar os dados da sessão em cookies
    cookies().set('voter-data', JSON.stringify({
      matricula: data.data.eleitor.matricula,
      eleicaoId: data.data.eleicao.id
    }), { httpOnly: true, path: '/' });

    revalidatePath('/login');
    return { success: true, message: '' };

  } catch (error) {
    console.error('Validation error:', error);
    return { success: false, message: 'Ocorreu um erro ao validar a matrícula. Tente novamente.' };
  }
}


export async function getVotingAdvice(prevState: any, formData: FormData) {
  const schema = z.object({
    userPreferences: z.string().min(10, 'Por favor, descreva suas preferências com mais detalhes.'),
  });
  
  const validatedFields = schema.safeParse({
    userPreferences: formData.get('userPreferences'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.userPreferences?.[0],
      advice: null,
    };
  }
  
  const userPreferences = validatedFields.data.userPreferences;

  const allCandidates = await getCandidates();
  const candidateInformation = allCandidates
    .map((c) => `Candidato: ${c.nome}, Partido: ${c.partido}.`)
    .join('\n');
  
  try {
    const result = await generateVotingAdvice({
      candidateInformation,
      userPreferences,
    });
    return { error: null, advice: result.advice };
  } catch (error) {
    console.error('Error generating voting advice:', error);
    return { error: 'Ocorreu um erro ao gerar a recomendação. Tente novamente.', advice: null };
  }
}

export async function submitVote(formData: FormData) {
  const candidateId = formData.get('candidateId') as string;
  const candidateNumero = formData.get('candidateNumero') as string;
  
  const voterDataCookie = cookies().get('voter-data');
  if (!voterDataCookie) {
      throw new Error('Sessão do eleitor não encontrada.');
  }
  const voterData = JSON.parse(voterDataCookie.value);
  const { matricula, eleicaoId } = voterData;

  if (!candidateId || !matricula || !eleicaoId) {
    throw new Error('Dados do voto incompletos');
  }

  // Se o voto for nulo, o ID é 'NULO'
  const isNullVote = candidateNumero === 'NULO';
  
  try {
    const votePayload = {
      eleitor_matricula: matricula,
      candidato_id: isNullVote ? null : candidateId,
      eleicao_id: eleicaoId,
      voto_nulo: isNullVote,
      voto_branco: false
    };

    const response = await fetch(`${API_URL}/api/urna-votacao/votos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(votePayload),
    });

    if (!response.ok) {
       console.error('Falha ao registrar voto na API');
       const errorText = await response.text();
       console.error('API Response:', errorText);
    }
  } catch (error) {
    console.error('Erro de rede ao enviar voto:', error);
  } finally {
     // Limpar cookie da sessão de votação
    cookies().delete('voter-data');
    redirect('/thank-you');
  }
}
