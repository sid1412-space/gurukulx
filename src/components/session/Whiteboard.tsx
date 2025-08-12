'use client';
// Note: You need to have @tldraw/tldraw installed in your project.
// The build system should handle this dependency.
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { useIsClient } from '@/hooks/use-is-client';

export default function Whiteboard() {
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <p>Loading Whiteboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Tldraw />
    </div>
  );
}
