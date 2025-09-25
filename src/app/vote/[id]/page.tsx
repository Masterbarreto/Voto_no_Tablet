
import { getCandidateById } from '@/lib/candidates';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ConfirmationButtons from './confirmation-buttons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function CandidateImage({ candidate }: { candidate: { nome: string; foto: string | null } }) {
  const initial = candidate.nome ? candidate.nome.charAt(0).toUpperCase() : '?';

  return (
    <div className="flex justify-center">
        <Avatar className="w-48 h-48 rounded-lg border-4 border-primary shadow-lg text-6xl md:w-64 md:h-64">
        {candidate.foto && <AvatarImage src={candidate.foto} alt={`Foto de ${candidate.nome}`} className="object-cover" />}
        <AvatarFallback className="bg-muted">
            {initial}
        </AvatarFallback>
        </Avatar>
    </div>
  );
}

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
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary md:text-3xl">SEU VOTO PARA</CardTitle>
          <CardDescription>CONFIRMAÇÃO</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="space-y-4">
             <CandidateImage candidate={candidate} />
              <div className="space-y-1">
                <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">{candidate.nome}</h2>
                <p className="text-lg text-muted-foreground md:text-xl">{candidate.partido}</p>
              </div>
          </div>
          <ConfirmationButtons candidateId={candidate.numero} />
        </CardContent>
      </Card>
    </main>
  );
}
