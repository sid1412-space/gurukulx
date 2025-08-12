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
      {/* Video Panel */}
      <div className="w-full h-[30vh] md:w-[30%] md:h-full flex-shrink-0">
        <Card className="h-full">
          <JitsiMeet roomName={`TutorConnect-Session-${sessionId}`} />
        </Card>
      </div>

      {/* Whiteboard Panel */}
      <div className="w-full h-[calc(70vh-2rem)] md:w-[70%] md:h-full flex-grow">
        <Card className="h-full">
          <Whiteboard />
        </Card>
      </div>
    </div>
  );
}
