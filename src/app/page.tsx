
'use client';

import { useRouter } from 'next/navigation';

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 60"
          className="h-24"
        >
          <path
            fill="#F06E0A"
            d="M48.8,33.1c-9.1,0-16.5,7.4-16.5,16.5s7.4,16.5,16.5,16.5s16.5-7.4,16.5-16.5S57.9,33.1,48.8,33.1z M48.8,59.3 c-5.3,0-9.6-4.3-9.6-9.6s4.3-9.6,9.6-9.6s9.6,4.3,9.6,9.6S54.1,59.3,48.8,59.3z"
          />
          <path
            fill="#005594"
            d="M12.9,0v48.1c0,1.3,1.1,2.4,2.4,2.4h22.9V44H19.9V6.7h18.2V0H12.9z"
          />
          <path
            fill="#005594"
            d="M71.7,0v50.5h6.6V0H71.7z"
          />
          <path
            fill="#005594"
            d="M93.2,0v44.2h15.4v6.3H86.6V0H93.2z"
          />
          <path
            fill="#005594"
            d="M117.9,0v48.1c0,1.3,1.1,2.4,2.4,2.4h22.9V44h-20.5V6.7h18.2V0H117.9z"
          />
          <path
            fill="#005594"
            d="M149.2,0v50.5h26.4v-6.6h-19.8V30.1h18.2v-6.6h-18.2V6.7h19.8V0H149.2z"
          />
        </svg>
        <p className="mt-8 text-muted-foreground animate-pulse text-lg">
          Toque para iniciar
        </p>
      </div>
    </main>
  );
}
