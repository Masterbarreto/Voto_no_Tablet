
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [matricula, setMatricula] = useState('');
  const router = useRouter();

  // Esta função simulará a entrada do teclado físico
  useEffect(() => {
    const handlePhysicalKeypad = (event: KeyboardEvent) => {
      if (/[0-9]/.test(event.key) && matricula.length < 8) {
        setMatricula(prev => prev + event.key);
      } else if (event.key === 'Backspace') {
        setMatricula(prev => prev.slice(0, -1));
      } else if (event.key === 'Enter') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handlePhysicalKeypad);
    return () => {
      window.removeEventListener('keydown', handlePhysicalKeypad);
    };
  }, [matricula]);


  const handleSubmit = () => {
    if (matricula.length > 0) {
        // Em uma aplicação real, haveria uma validação da matrícula
        router.push('/voting');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Identificação do Eleitor</CardTitle>
            <CardDescription>Digite sua matrícula para votar</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              value={matricula}
              readOnly
              placeholder="Aguardando matrícula..."
              className="text-center text-2xl h-14 mb-4 tracking-[.2em]"
              autoFocus
            />
             <div className="text-sm text-muted-foreground text-center space-y-1">
                <p>Aguardando teclado físico...</p>
                <p>Aperte a tecla <span className="font-bold text-green-600">VERDE</span> (Enter) para CONFIRMAR</p>
                <p>Aperte a tecla <span className="font-bold text-orange-500">LARANJA</span> (Backspace) para CORRIGIR</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
