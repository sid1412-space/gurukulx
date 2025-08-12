'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

export default function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSessionPage = pathname.includes('/session/');

  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className={cn('font-body antialiased bg-background')}>
        <div className="flex flex-col min-h-screen">
          {!isSessionPage && <Header />}
          <main className="flex-grow">{children}</main>
          {!isSessionPage && <Footer />}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
