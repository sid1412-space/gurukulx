
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import { useIsClient } from '@/hooks/use-is-client';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '/tutors', label: 'Find a Tutor' },
  { href: '/#features', label: 'Features' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTutor, setIsTutor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const isClient = useIsClient();
  const router = useRouter();

  const getDashboardUrl = () => {
    if (isAdmin) return '/admin';
    if (isTutor) return '/tutor/dashboard';
    return '/dashboard';
  }

  useEffect(() => {
    if (isClient) {
      const checkAuth = () => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const tutor = localStorage.getItem('isTutor') === 'true';
        const admin = localStorage.getItem('isAdmin') === 'true';
        setIsAuthenticated(loggedIn);
        setIsTutor(tutor);
        setIsAdmin(admin);
      };

      checkAuth();

      // Listen for storage changes to sync tabs
      window.addEventListener('storage', checkAuth);
      return () => {
        window.removeEventListener('storage', checkAuth);
      };
    }
  }, [isClient]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isTutor');
    localStorage.removeItem('loggedInUser');
    setIsAuthenticated(false);
    setIsTutor(false);
    setIsAdmin(false);
    // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(new Event("storage"));
    router.push('/'); 
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {link.label}
            </Link>
          ))}
           <Link
              href="/signup?role=tutor"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Become a Tutor
            </Link>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          {isClient && isAuthenticated ? (
            <>
              <Link href={getDashboardUrl()}>
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <nav className="flex flex-col items-center gap-4 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-full text-center py-2 transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
             <Link
                href="/signup?role=tutor"
                className="w-full text-center py-2 transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsMenuOpen(false)}
              >
                Become a Tutor
              </Link>
            <div className="flex flex-col w-full gap-2 pt-2 border-t">
               {isClient && isAuthenticated ? (
                  <>
                    <Link href={getDashboardUrl()} className="w-full">
                      <Button className="w-full" variant="ghost" onClick={() => setIsMenuOpen(false)}>Dashboard</Button>
                    </Link>
                    <Button className="w-full" onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="w-full">
                      <Button variant="ghost" className="w-full" onClick={() => setIsMenuOpen(false)}>Log In</Button>
                    </Link>
                    <Link href="/signup" className="w-full">
                      <Button className="w-full" onClick={() => setIsMenuOpen(false)}>Sign Up</Button>
                    </Link>
                  </>
                )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
