'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 4000); // Redirect after 4 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl">
        <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto animate-pulse" />
        <h1 className="mt-6 text-4xl font-extrabold text-primary">Voto Confirmado!</h1>
        <p className="mt-2 text-2xl font-bold text-slate-600">FIM</p>
        <p className="mt-8 text-muted-foreground">
          Aguarde, a urna será reiniciada em instantes...
        </p>
      </div>
    </div>
  );
}
