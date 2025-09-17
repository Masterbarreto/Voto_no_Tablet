
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function VotingPage() {
  const [candidateNumber, setCandidateNumber] = useState('');
  const router = useRouter();

  // Esta função simulará a entrada do teclado físico
  useEffect(() => {
    const handlePhysicalKeypad = (event: KeyboardEvent) => {
      if (/[0-9]/.test(event.key) && candidateNumber.length < 2) {
        setCandidateNumber(prev => prev + event.key);
      } else if (event.key === 'Backspace') {
        setCandidateNumber(prev => prev.slice(0, -1));
      } else if (event.key === 'Enter') {
        handleConfirm();
      }
    };
    window.addEventListener('keydown', handlePhysicalKeypad);
    return () => {
      window.removeEventListener('keydown', handlePhysicalKeypad);
    };
  }, [candidateNumber]);
  
  const handleConfirm = () => {
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
                <p>Aperte a tecla <span className="font-bold text-orange-500">LARANJA</span> (Backspace) para CORRIGIR</p>
                <p>Aperte a tecla <span className="font-bold text-green-600">VERDE</span> (Enter) para CONFIRMAR</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
