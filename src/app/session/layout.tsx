'use client';

import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

export default function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className={cn('font-body antialiased bg-background h-full')}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
