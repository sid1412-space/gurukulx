
'use client';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={cn('!scroll-smooth', inter.variable)}>
      <head>
        <title>TutorConnect</title>
        <meta name="description" content="The future of online tutoring." />
      </head>
       <body className={cn('font-body antialiased bg-background')}>
          {children}
          <Toaster />
      </body>
    </html>
  );
}
