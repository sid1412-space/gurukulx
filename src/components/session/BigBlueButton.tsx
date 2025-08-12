'use client';

import { useEffect, useState } from 'react';

type BigBlueButtonProps = {
  sessionId: string;
};

// This is a placeholder component.
// A full BigBlueButton integration requires server-side logic 
// to create meetings and generate join URLs.

export default function BigBlueButton({ sessionId }: BigBlueButtonProps) {
  const [joinUrl, setJoinUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, you would make an API call to your server here.
    // The server would use the BigBlueButton API to create a meeting
    // and return a join URL.
    //
    // Example API call (you would need to create this endpoint):
    //
    // fetch(`/api/bbb/join`, { 
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ 
    //     sessionId,
    //     username: 'Student', 
    //     video: false, // As requested, disable video
    //   })
    // })
    // .then(res => res.json())
    // .then(data => setJoinUrl(data.url))
    // .catch(err => setError('Failed to create session.'));

    // For now, we will just show a placeholder message.
    setError('BigBlueButton integration is not complete. Please configure your server to generate join URLs.');
    
  }, [sessionId]);

  if (error) {
    return (
        <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center p-4">
                <h2 className="text-xl font-semibold mb-2">Integration Required</h2>
                <p className="text-muted-foreground">{error}</p>
            </div>
      </div>
    );
  }

  if (!joinUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <p>Creating session...</p>
      </div>
    );
  }

  return (
    <iframe
      src={joinUrl}
      allow="camera; microphone; display-capture"
      className="w-full h-full border-0"
      title="BigBlueButton Session"
    ></iframe>
  );
}
