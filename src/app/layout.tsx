
'use client';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const isSessionPage = pathname.startsWith('/session');
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isAdminOrDashboard = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

  const showHeaderAndFooter = !isSessionPage && !isAuthPage && !isAdminOrDashboard;

  return (
    <html lang="en" className={cn('!scroll-smooth', inter.variable)}>
      <head>
        <title>TutorConnect</title>
        <meta name="description" content="The future of online tutoring." />
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
