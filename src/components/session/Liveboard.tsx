'use client';

import { useEffect, useRef, useState } from 'react';
import Liveboard from '@liveboard/sdk';
import { useIsClient } from '@/hooks/use-is-client';

export default function LiveboardComponent() {
  const isClient = useIsClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isClient || !containerRef.current) {
      return;
    }
    
    // IMPORTANT: Replace with your actual LiveBoard App ID.
    const appId = process.env.NEXT_PUBLIC_LIVEBOARD_APP_ID || 'YOUR_APP_ID';

    if (appId === 'YOUR_APP_ID') {
        console.error("LiveBoard App ID is not configured. Please set NEXT_PUBLIC_LIVEBOARD_APP_ID in your environment variables.");
        setError("LiveBoard is not configured. Please contact the administrator.");
        return;
    }

    const liveboard = new Liveboard({
      appId,
      user: {
        // IMPORTANT: This JWT should be generated securely on your backend for the current user.
        // It's a critical security measure to authenticate the user for the LiveBoard session.
        // Never generate or expose the secret key on the client side.
        jwt: 'YOUR_USER_JWT',
      },
    });

    const session = liveboard.openSession({
      container: containerRef.current,
      // You can either create a new board or open an existing one by its ID
      board: {
        // id: 'EXISTING_BOARD_ID',
        name: 'New Tutoring Session',
      },
      features: ['whiteboard', 'audio', 'screen-sharing'],
      defaultTools: {
        // Disabling video call as requested
        video: { enabled: false }
      }
    });

    session.on('error', (err: Error) => {
      console.error('Liveboard Session Error:', err);
      setError(`An error occurred: ${err.message}`);
    });
    
    return () => {
      // Clean up the session when the component unmounts
      session.close();
    };
  }, [isClient]);

  if (error) {
    return <div className="h-full w-full flex items-center justify-center text-red-500">{error}</div>;
  }

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
