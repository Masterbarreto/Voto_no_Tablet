'use server';

import { generateVotingAdvice } from '@/ai/flows/generate-voting-advice';
import { candidates } from '@/lib/candidates';
import { redirect } from 'next/navigation';
import { z } from 'zod';

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

  const candidateInformation = candidates
    .map((c) => `Candidato: ${c.name}, Partido: ${c.party}.`)
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

  console.log(`VOTO REGISTRADO PARA O CANDIDATO ID: ${candidateId}`);
  // Em uma aplicação real, aqui seria a requisição HTTP para o ESP32.
  // Exemplo:
  // try {
  //   const response = await fetch('http://<ESP32_IP_ADDRESS>/vote', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ candidateId }),
  //   });
  //   if (!response.ok) {
  //     throw new Error('Falha ao comunicar com a urna.');
  //   }
  // } catch (error) {
  //   console.error('Erro ao enviar voto:', error);
  //   // Tratar o erro, talvez mostrando uma mensagem para o usuário.
  //   return;
  // }
  
  redirect('/thank-you');
}
