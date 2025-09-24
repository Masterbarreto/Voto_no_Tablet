
'use server';

import { generateVotingAdvice } from '@/ai/flows/generate-voting-advice';
import { candidates, getCandidates } from '@/lib/candidates';
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
  
  const { matricula } = validatedFields.data;

  try {
    const response = await fetch(`${API_URL}/eleitores/${matricula}`);
    if (response.status === 404) {
      return { success: false, message: 'Eleitor não encontrado.' };
    }
    if (!response.ok) {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Falha ao validar eleitor.' };
    }
    // Sucesso, pode prosseguir
    return { success: true, message: '' };
  } catch (error) {
    console.error('Erro de rede ao validar eleitor:', error);
    return { success: false, message: 'Erro de comunicação com o servidor. Tente novamente.' };
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

  if (!candidateId) {
    throw new Error('Candidate ID is required');
  }

  try {
    const response = await fetch(`${API_URL}/votos`, {
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
