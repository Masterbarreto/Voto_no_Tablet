
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Keypad from '@/components/keypad';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function VotingPage() {
  const [candidateNumber, setCandidateNumber] = useState('');
  const router = useRouter();

  const handleKeypadPress = (key: string) => {
    if (key === 'LIMPA') {
      setCandidateNumber('');
    } else if (candidateNumber.length < 2) { // Assuming 2 digits for candidate number
      setCandidateNumber(candidateNumber + key);
    }
  };
  
  const handleConfirm = () => {
    // Basic validation, in a real scenario you would check if candidate exists
    if (candidateNumber.length > 0) {
      router.push(`/vote/${candidateNumber}`);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center text-3xl">SEU VOTO PARA</CardTitle>
            <CardDescription className="text-center text-xl">PRESIDENTE</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
                <p>Número:</p>
                <div className="flex gap-2">
                    <Input readOnly value={candidateNumber[0] || ''} className="w-12 h-16 text-4xl text-center font-bold" />
                    <Input readOnly value={candidateNumber[1] || ''} className="w-12 h-16 text-4xl text-center font-bold" />
                </div>
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
                <p>Aperte a tecla <span className="font-bold text-orange-500">LARANJA</span> para CORRIGIR</p>
                <p>Aperte a tecla <span className="font-bold text-green-600">VERDE</span> para CONFIRMAR</p>
            </div>
          </CardContent>
        </Card>
        <Keypad onKeyPress={handleKeypadPress} onConfirm={handleConfirm} />
      </div>
    </main>
  );
}
