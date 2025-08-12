'use client';

import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { usePathname } from 'next/navigation';

const Whiteboard = dynamic(() => import('@/components/session/Whiteboard'), {
  ssr: false,
  loading: () => <p className="text-center">Loading Whiteboard...</p>
});
const JitsiMeet = dynamic(() => import('@/components/session/JitsiMeet'), {
  ssr: false,
  loading: () => <p className="text-center">Loading Video...</p>
});


export default function SessionPage() {
  const pathname = usePathname();
  const sessionId = pathname.split('/').pop() || 'default-session';
  
  return (
    <div className="h-screen flex flex-col md:flex-row bg-secondary/30 p-4 gap-4">
      {/* Whiteboard Panel */}
      <div className="flex-grow h-1/2 md:h-full md:w-auto">
        <Card className="h-full">
            <Whiteboard />
        </Card>
      </div>
      {/* Video Panel */}
      <div className="h-1/2 md:h-full md:w-[350px] flex-shrink-0">
        <Card className="h-full">
            <JitsiMeet roomName={`TutorConnect-Session-${sessionId}`} />
        </Card>
      </div>
    </div>
  );
}
