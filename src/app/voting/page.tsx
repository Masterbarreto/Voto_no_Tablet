
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getCandidates } from '@/lib/candidates';
import type { Candidate } from '@/lib/candidates';
import CandidateCard from '@/components/candidate-card';
import VotingAssistant from '@/components/voting-assistant';
import { Loader2 } from 'lucide-react';

export default function VotingPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadCandidates() {
      setIsLoading(true);
      try {
        const fetchedCandidates = await getCandidates();
        setCandidates(fetchedCandidates);
      } catch (error) {
        console.error("Failed to load candidates:", error);
        // Opcional: mostrar uma mensagem de erro para o usuário
      } finally {
        setIsLoading(false);
      }
    }
    loadCandidates();
  }, []);

  const handleManualVote = () => {
    router.push('/manual-vote');
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary tracking-tight">Eleições 2024</h1>
          <p className="text-muted-foreground text-lg mt-2">Selecione seu candidato para Presidente</p>
        </header>

        <div className="flex justify-center mb-8 gap-4">
            <VotingAssistant />
            <button
                onClick={handleManualVote}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
            >
                Digitar o número
            </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {candidates.map((candidate) => (
              <CandidateCard key={candidate.numero} candidate={candidate} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
