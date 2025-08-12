'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const BigBlueButton = dynamic(() => import('@/components/session/BigBlueButton'), {
  ssr: false,
  loading: () => <p className="text-center">Loading Session...</p>
});


export default function SessionPage() {
  const pathname = usePathname();
  const sessionId = pathname.split('/').pop() || 'default-session';
  
  return (
    <div className="h-screen w-screen bg-background">
      <BigBlueButton sessionId={sessionId} />
    </div>
  );
}
