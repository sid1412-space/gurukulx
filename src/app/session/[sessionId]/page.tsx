'use client';

import dynamic from 'next/dynamic';

const Liveboard = dynamic(
  () => import('@/components/session/Liveboard'),
  { ssr: false, loading: () => <p>Loading Liveboard...</p> }
);

export default function SessionPage() {
  return (
    <div className="h-screen w-screen bg-secondary/30">
        <Liveboard />
    </div>
  );
}
