
import { getCandidateById } from '@/lib/candidates';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ConfirmationButtons from './confirmation-buttons';

export default async function VoteConfirmationPage({ params }: { params: { id: string } }) {
  const candidate = await getCandidateById(params.id);

  if (!candidate) {
    // Tela de voto nulo
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md text-center shadow-2xl">
                <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">SEU VOTO PARA</CardTitle>
                <CardDescription>CONFIRMAÇÃO</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <div className="space-y-1">
                        <h2 className="text-6xl font-extrabold tracking-tight">VOTO NULO</h2>
                        <p className="text-muted-foreground">Número inválido</p>
                    </div>
                    <ConfirmationButtons candidateId="NULO" />
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md text-center shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">SEU VOTO PARA</CardTitle>
          <CardDescription>CONFIRMAÇÃO</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="relative w-64 h-64 rounded-lg overflow-hidden border-4 border-primary shadow-lg">
            <Image
              src={candidate.foto}
              alt={`Foto de ${candidate.nome}`}
              fill
              sizes="256px"
              className="object-cover"
              data-ai-hint="person portrait"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-extrabold tracking-tight">{candidate.nome}</h2>
            <p className="text-xl text-muted-foreground">{candidate.partido}</p>
          </div>
          <ConfirmationButtons candidateId={candidate.numero} />
        </CardContent>
      </Card>
    </div>
  );
}
