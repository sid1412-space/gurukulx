
'use client';

import React from 'react';
import '../globals.css';

// This is a specific layout for the signup page that is separate from the main app.
export default function SignUpLayout({
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
