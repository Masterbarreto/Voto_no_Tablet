import { candidates } from '@/lib/candidates';
import CandidateCard from '@/components/candidate-card';
import VotingAssistant from '@/components/voting-assistant';
import { Vote } from 'lucide-react';

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary flex items-center justify-center gap-4">
          <Vote className="w-10 h-10" />
          VotoTablet
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Selecione seu candidato</p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
      
      <footer className="mt-12 text-center">
        <VotingAssistant />
      </footer>
    </main>
  );
}
