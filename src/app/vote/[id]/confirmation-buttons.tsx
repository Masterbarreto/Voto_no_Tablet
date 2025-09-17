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
                    CONFIRMA
                </>
            )}
        </Button>
    )
}

export default function ConfirmationButtons({ candidateId }: { candidateId: string }) {
  return (
    <div className="w-full pt-4">
      <div className="flex justify-center mb-4">
        <p className="text-sm">
            Aperte a tecla <span className="font-bold text-green-600">VERDE</span> para CONFIRMAR este voto
        </p>
      </div>
      <form action={submitVote} className="w-full space-y-4">
        <input type="hidden" name="candidateId" value={candidateId} />
        <div className="grid grid-cols-2 gap-4">
            <Button asChild size="lg" className="h-16 text-lg font-bold text-white bg-orange-500 hover:bg-orange-600">
                <Link href="/">
                    <X className="mr-2 h-6 w-6" />
                    CORRIGE
                </Link>
            </Button>
            <SubmitButton />
        </div>
      </form>
    </div>
  );
}
