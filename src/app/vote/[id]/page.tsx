import { getCandidateById } from '@/lib/candidates';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ConfirmationButtons from './confirmation-buttons';

export default function VoteConfirmationPage({ params }: { params: { id: string } }) {
  const candidate = getCandidateById(params.id);

  if (!candidate) {
    notFound();
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md text-center shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Confirme seu Voto</CardTitle>
          <CardDescription>Verifique os dados do candidato selecionado.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="relative w-64 h-64 rounded-lg overflow-hidden border-4 border-primary shadow-lg">
            <Image
              src={candidate.photoUrl}
              alt={`Foto de ${candidate.name}`}
              fill
              sizes="256px"
              className="object-cover"
              data-ai-hint={candidate.photoHint}
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-extrabold tracking-tight">{candidate.name}</h2>
            <p className="text-xl text-muted-foreground">{candidate.party}</p>
          </div>
          <ConfirmationButtons candidateId={candidate.id} />
        </CardContent>
      </Card>
    </div>
  );
}
