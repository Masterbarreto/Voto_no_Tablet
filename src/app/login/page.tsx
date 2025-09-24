
'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { validateVoter } from '../actions';

const initialState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
        type="submit"
        disabled={pending}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg h-12"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          Verificando...
        </>
      ) : (
        <>
          <Check className="mr-2 h-6 w-6" />
          CONFIRMA
        </>
      )}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(validateVoter, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push('/voting');
    }
  }, [state.success, router]);
  
  // Simula a entrada do teclado físico para o formulário
  useEffect(() => {
    const handlePhysicalKeypad = (event: KeyboardEvent) => {
      const form = event.currentTarget as Window;
      const formElement = document.querySelector('form');
      if (formElement && event.key === 'Enter') {
          // Submete o formulário com a tecla Enter
          formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    };
    window.addEventListener('keydown', handlePhysicalKeypad);
    return () => {
      window.removeEventListener('keydown', handlePhysicalKeypad);
    };
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Identificação do Eleitor</CardTitle>
            <CardDescription>Digite sua matrícula para votar</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction}>
              <Input
                type="text"
                name="matricula"
                placeholder="Digite sua matrícula..."
                className="text-center text-2xl h-14 mb-4 tracking-[.2em]"
                autoFocus
                required
              />
              <SubmitButton />
              {state.message && !state.success && (
                <p className="mt-2 text-sm font-medium text-destructive text-center">{state.message}</p>
              )}
            </form>
             <div className="mt-4 text-sm text-muted-foreground text-center space-y-1">
                <p>Use o teclado para digitar.</p>
                <p>Aperte a tecla <span className="font-bold text-green-600">VERDE</span> (Enter) para CONFIRMAR</p>
                <p>Aperte a tecla <span className="font-bold text-orange-500">LARANJA</span> (Backspace) para CORRIGIR</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
