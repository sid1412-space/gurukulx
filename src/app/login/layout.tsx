
'use client';

import React from 'react';
import '../globals.css';

// This is a specific layout for the login page that is separate from the main app.
export default function LoginLayout({
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
