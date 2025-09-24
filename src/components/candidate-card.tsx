
import type { Candidate } from '@/lib/candidates';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Link href={`/vote/${candidate.numero}`} className="group block">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-2xl group-hover:border-primary group-hover:-translate-y-2">
        <CardHeader className="p-0">
          <div className="relative w-full h-56">
            <Image
              src={candidate.foto}
              alt={`Foto de ${candidate.nome}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              data-ai-hint="person portrait"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-6 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-primary">{candidate.nome}</h2>
            <p className="text-muted-foreground mt-1">{candidate.partido}</p>
        </CardContent>
        <CardFooter className="p-4 bg-secondary/30 justify-center">
            <div className="flex items-center text-primary font-semibold">
                <span>Selecionar</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
