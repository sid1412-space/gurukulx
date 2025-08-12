'use client';

import dynamic from 'next/dynamic';

const JitsiMeet = dynamic(() => import('@/components/session/Liveboard'), {
  ssr: false,
  loading: () => <p>Loading Session...</p>,
});
const Whiteboard = dynamic(() => import('@/components/session/Whiteboard'), {
  ssr: false,
  loading: () => <p>Loading Whiteboard...</p>,
});


export default function SessionPage() {

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-secondary/30">
        <div className="md:w-1/3 w-full h-1/3 md:h-full">
            <JitsiMeet onApiReady={() => {}} />
        </div>
        <div className="md:w-2/3 w-full h-2/3 md:h-full">
            <Whiteboard />
        </div>
    </div>
  );
}
