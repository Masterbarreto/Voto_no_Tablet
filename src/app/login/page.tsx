
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Keypad from '@/components/keypad';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [matricula, setMatricula] = useState('');
  const router = useRouter();

  const handleKeypadPress = (key: string) => {
    if (key === 'LIMPA') {
      setMatricula('');
    } else if (matricula.length < 8) {
      setMatricula(matricula + key);
    }
  };

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
              placeholder="Matrícula"
              className="text-center text-2xl h-14 mb-4"
            />
             <div className="text-sm text-muted-foreground">
                <p>Aperte a tecla <span className="font-bold text-green-600">VERDE</span> para CONFIRMAR</p>
            </div>
          </CardContent>
        </Card>
        <Keypad onKeyPress={handleKeypadPress} onConfirm={handleSubmit} />
      </div>
    </main>
  );
}
