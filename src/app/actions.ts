
'use server';

import { getCandidates, getAuthToken, getCandidateByNumero } from '@/lib/candidates';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { generateVotingAdvice } from '@/ai/flows/generate-voting-advice';

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
    const token = await getAuthToken();

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
       let message = data.message || 'Matrícula inválida ou eleitor não apto para votar.';
        if (data.data?.eleitor?.ja_votou) {
            message = 'Este eleitor já votou.';
        }
      return { success: false, message: message };
    }
    
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

  const isNullVote = candidateNumero === 'NULO';
  
  try {
    const votePayload = {
      eleitor_matricula: matricula,
      candidato_id: isNullVote ? null : candidateId,
      eleicao_id: eleicaoId,
      voto_nulo: isNullVote,
      voto_branco: false
    };

    const token = await getAuthToken();

    const response = await fetch(`${API_URL}/api/urna-votacao/votos`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(votePayload),
    });

    if (!response.ok) {
       const errorData = await response.json();
       console.error('Falha ao registrar voto na API:', errorData.message || 'Erro desconhecido');
       // Mesmo com erro na API, redirecionamos para evitar que o eleitor fique preso
    }
  } catch (error) {
    console.error('Erro de rede ao enviar voto:', error);
  } finally {
    cookies().delete('voter-data');
    redirect('/thank-you');
  }
}
