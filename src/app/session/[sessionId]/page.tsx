'use client';

import dynamic from 'next/dynamic';

const JitsiMeetComponent = dynamic(() => import('@/components/session/JitsiMeetComponent'), {
  ssr: false,
});
const Whiteboard = dynamic(() => import('@/components/session/Whiteboard'), {
  ssr: false,
  loading: () => <p>Loading Whiteboard...</p>,
});


export default function SessionPage() {

  return (
    <div className="h-screen w-screen">
      {/* Jitsi is mounted but hidden to provide audio and screen sharing without a visible interface */}
      <div className="hidden">
        <JitsiMeetComponent onApiReady={() => {}} />
      </div>

      {/* The whiteboard takes up the entire screen */}
      <Whiteboard />
    </div>
  );
}
