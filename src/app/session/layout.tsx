
'use client';

import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import '../globals.css';

export default function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
       <>
          {children}
          <Toaster />
      </>
  );
}
