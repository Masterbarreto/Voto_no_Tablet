'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getVotingAdvice } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, Bot, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const initialState = {
  advice: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
          Gerando...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Obter Recomendação
        </>
      )}
    </Button>
  );
}

export default function VotingAssistant() {
  const [state, formAction] = useActionState(getVotingAdvice, initialState);
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.advice || state.error) {
      // Keep dialog open on response
    }
    if (state.advice) {
        // Reset form if successful
        formRef.current?.reset();
    }
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <HelpCircle className="mr-2 h-5 w-5" />
          Precisa de ajuda para decidir?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Bot /> Assistente de Voto
          </DialogTitle>
          <DialogDescription>
            Descreva suas prioridades e o que você busca em um candidato. Nossa IA
            fornecerá uma recomendação não-partidária para te ajudar a decidir.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <Textarea
            name="userPreferences"
            placeholder="Ex: Eu valorizo a educação, o desenvolvimento econômico sustentável e a transparência governamental."
            rows={5}
            required
            minLength={10}
          />
          {state.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}
        
          <DialogFooter className="gap-2">
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Fechar
                </Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
        {state.advice && (
          <Alert className="mt-4">
             <Bot className="h-4 w-4" />
            <AlertTitle>Recomendação</AlertTitle>
            <AlertDescription>
              <p className="whitespace-pre-wrap">{state.advice}</p>
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}
