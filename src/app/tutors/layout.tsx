
'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Mock authentication check
const useAuth = () => {
    // In a real app, this would be a hook that checks a JWT, a session, etc.
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for development

    // This is just to simulate a check that might run on the client
    useEffect(() => {
        // For example, you might check localStorage or a cookie here.
        // For this mock, we'll just keep it simple.
        // To test the redirect, you can manually set this to false.
        // setIsAuthenticated(false);
    }, []);
    
    return { isAuthenticated }; 
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
