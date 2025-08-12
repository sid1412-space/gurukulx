
'use client';

import React from 'react';
import '../globals.css';

// This is a specific layout that is separate from the main app.
export default function BecomeATutorLayout({
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
