'use client';

import { submitVote } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { X, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg h-16"
            style={{ backgroundColor: '#28a745' }}
            disabled={pending}
            aria-disabled={pending}
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Confirmando...
                </>
            ) : (
                <>
                    <Check className="mr-2 h-6 w-6" />
                    CONFIRMAR
                </>
            )}
        </Button>
    )
}

export default function ConfirmationButtons({ candidateId }: { candidateId: string }) {
  return (
    <form action={submitVote} className="w-full space-y-4 pt-4">
      <input type="hidden" name="candidateId" value={candidateId} />
      <div className="grid grid-cols-2 gap-4">
        <Button asChild size="lg" variant="secondary" className="h-16 text-lg font-bold">
            <Link href="/">
                <X className="mr-2 h-6 w-6" />
                CORRIGIR
            </Link>
        </Button>
        <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg h-16">
            <SubmitButton />
        </Button>
      </div>
    </form>
  );
}
