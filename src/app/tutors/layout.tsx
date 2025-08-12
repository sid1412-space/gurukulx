
'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

// Mock authentication check
const useAuth = () => {
    // In a real app, this would be a hook that checks a JWT, a session, etc.
    return { isAuthenticated: false }; 
};

export default function TutorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    // You can render a loading spinner here while redirecting
    return null;
  }
  
  return <>{children}</>;
}
