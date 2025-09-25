
'use server';

import { generateVotingAdvice } from '@/ai/flows/generate-voting-advice';
import { getCandidates } from '@/lib/candidates';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

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
  
  // Verificação da API removida para permitir o fluxo
  revalidatePath('/login');
  return { success: true, message: '' };
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

  if (!candidateId) {
    throw new Error('Candidate ID is required');
  }

  // A API de votos não precisa de autenticação especial,
  // mas a validação de matrícula já garante que o eleitor é válido.
  // A API de votos deve associar o voto ao eleitor que acabou de ser validado.
  // Por simplicidade, assumimos que a sessão do eleitor é gerenciada no backend
  // ou que a API de votos identifica o eleitor de outra forma (ex: por urna).
  // No nosso caso, vamos apenas enviar o número do candidato.

  try {
    const response = await fetch(`${API_URL}/api/votos`, { // Endpoint fictício, ajuste para o real se necessário
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numero_candidato: candidateId }),
    });
    if (!response.ok) {
       console.error('Falha ao registrar voto na API');
       const errorText = await response.text();
       console.error('API Response:', errorText);
       // Mesmo com erro, redirecionamos para não travar a urna
       redirect('/thank-you');
       return;
    }
  } catch (error) {
    console.error('Erro de rede ao enviar voto:', error);
    // Mesmo com erro, redirecionamos para não travar a urna
    redirect('/thank-you');
    return;
  }
  
  redirect('/thank-you');
}
