
'use client';

import React from 'react';
import '../globals.css';

// This is a specific layout for the session page that does not include the main header and footer.
// It ensures that the Jitsi and Whiteboard components can take up the full screen.
export default function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
       <>
          {children}
      </>
  );
}
