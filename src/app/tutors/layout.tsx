
'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Mock authentication check
const useAuth = () => {
    // In a real app, this would be a hook that checks a JWT, a session, etc.
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Default to false to protect route

    // This is just to simulate a check that might run on the client
    useEffect(() => {
        // In a real app, you would have logic here to verify a session or token.
        // For this mock, we'll simulate a logged-out user by default.
        // To test the logged-in state, you would set this to true after a successful login.
        // For instance, you might check a value in localStorage.
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsAuthenticated(loggedIn);
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
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Only redirect if authentication has been checked
    if (isAuthenticated === false) {
      router.push('/login');
    }
     // Finished checking auth status
    setIsChecking(false);

  }, [isAuthenticated, router]);

  // Render a loading state while checking authentication to prevent flashing the page content.
  if (isChecking || !isAuthenticated) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading...</p>
        </div>
    );
  }
  
  return <>{children}</>;
}
