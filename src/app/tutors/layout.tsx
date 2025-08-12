
'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useIsClient } from '@/hooks/use-is-client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TutorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isClient = useIsClient();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Assume true to avoid flash

  useEffect(() => {
    if (isClient) {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!loggedIn) {
        setIsAuthenticated(false);
        router.push('/login');
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [isClient, router]);


  if (!isClient || !isAuthenticated) {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <p>Loading...</p>
        </div>
    );
  }
  
  return (
     <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
    </div>
  );
}
