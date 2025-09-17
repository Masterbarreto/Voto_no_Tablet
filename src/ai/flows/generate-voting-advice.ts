'use server';

/**
 * @fileOverview An AI agent that provides voting advice.
 *
 * - generateVotingAdvice - A function that generates advice for voters.
 * - GenerateVotingAdviceInput - The input type for the generateVotingAdvice function.
 * - GenerateVotingAdviceOutput - The return type for the generateVotingAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVotingAdviceInputSchema = z.object({
  candidateInformation: z
    .string()
    .describe('Information about the candidates, their platforms, and their history.'),
  userPreferences: z
    .string()
    .describe('The user preferences and priorities for this election.'),
});
export type GenerateVotingAdviceInput = z.infer<typeof GenerateVotingAdviceInputSchema>;

const GenerateVotingAdviceOutputSchema = z.object({
  advice: z.string().describe('The voting advice generated for the user.'),
});
export type GenerateVotingAdviceOutput = z.infer<typeof GenerateVotingAdviceOutputSchema>;

export async function generateVotingAdvice(input: GenerateVotingAdviceInput): Promise<GenerateVotingAdviceOutput> {
  return generateVotingAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVotingAdvicePrompt',
  input: {schema: GenerateVotingAdviceInputSchema},
  output: {schema: GenerateVotingAdviceOutputSchema},
  prompt: `You are a non-partisan voting advisor. Analyze the candidate information and user preferences to provide helpful voting advice. Be brief and to the point.

Candidate Information: {{{candidateInformation}}}
User Preferences: {{{userPreferences}}}

Voting Advice:`,
});

const generateVotingAdviceFlow = ai.defineFlow(
  {
    name: 'generateVotingAdviceFlow',
    inputSchema: GenerateVotingAdviceInputSchema,
    outputSchema: GenerateVotingAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
