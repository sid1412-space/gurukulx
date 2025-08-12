'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const JitsiMeet = dynamic(
  () => import('@/components/session/JitsiMeet'),
  { ssr: false, loading: () => <p>Loading Session...</p> }
);

const Whiteboard = dynamic(
  () => import('@/components/session/Whiteboard'),
  { ssr: false, loading: () => <p>Loading Whiteboard...</p> }
);

export default function SessionPage() {
  const pathname = usePathname();
  const sessionId = pathname.split('/').pop() || 'default-session';
  
  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-secondary/30">
      {/* Video Panel */}
      <div className="md:w-[30%] md:h-full h-[30%] w-full bg-black">
        <JitsiMeet roomName={sessionId} />
      </div>
      {/* Whiteboard Panel */}
      <div className="flex-1 h-[70%] md:h-full w-full">
        <Whiteboard />
      </div>
    </div>
  );
}
