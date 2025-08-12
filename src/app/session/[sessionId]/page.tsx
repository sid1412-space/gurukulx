'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';

const Whiteboard = dynamic(() => import('@/components/session/Whiteboard'), {
  ssr: false,
  loading: () => <p className="text-center">Loading Whiteboard...</p>
});
const JitsiMeet = dynamic(() => import('@/components/session/JitsiMeet'), {
  ssr: false,
  loading: () => <p className="text-center">Loading Video...</p>
});


export default function SessionPage({ params }: { params: { sessionId: string } }) {
  const { sessionId } = params;
  return (
    <div className="h-screen flex flex-col bg-secondary/30">
      {/* Main Content: Video and Whiteboard */}
      <div className="flex-grow flex flex-row min-h-0 p-4 gap-4">
        {/* Whiteboard Panel */}
        <div className="flex-grow h-full">
          <Card className="h-full">
              <Whiteboard />
          </Card>
        </div>
        {/* Video Panel */}
        <div className="w-[350px] flex-shrink-0">
          <Card className="h-full">
              <JitsiMeet roomName={sessionId} />
          </Card>
        </div>
      </div>
    </div>
  );
}
