
'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

// Mock authentication check
const useAuth = () => {
    // In a real app, this would be a hook that checks a JWT, a session, etc.
    // Set to true to allow access for layout development.
    return { isAuthenticated: true }; 
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
    // Render a loading spinner or null while the redirect happens
    return null;
  }
  
  return <>{children}</>;
}
