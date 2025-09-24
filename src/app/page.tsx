'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SplashScreen() {
  const router = useRouter();

  const handleScreenClick = () => {
    router.push('/login');
  };

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen bg-background cursor-pointer"
      onClick={handleScreenClick}
    >
      <div className="text-center">
        <Image
            src="/senac-logo.svg"
            alt="Logo do Senac"
            width={250}
            height={90}
            className="h-28 w-auto"
            priority
        />
        <p className="mt-8 text-muted-foreground animate-pulse text-lg">
          Toque para iniciar
        </p>
      </div>
    </main>
  );
}
