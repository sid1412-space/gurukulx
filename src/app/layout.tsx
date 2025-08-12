
'use client';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isSessionPage = pathname.startsWith('/session');
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isAdminOrDashboard = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

  const showHeaderAndFooter = !isSessionPage && !isAuthPage && !isAdminOrDashboard;

  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <title>TutorConnect</title>
        <meta name="description" content="The future of online tutoring." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        ></link>
      </head>
       <body className={cn('font-body antialiased bg-background')}>
          <div className="flex flex-col min-h-screen">
            {showHeaderAndFooter && <Header />}
            <main className="flex-grow">{children}</main>
            {showHeaderAndFooter && <Footer />}
          </div>
        <Toaster />
      </body>
    </html>
  );
}
