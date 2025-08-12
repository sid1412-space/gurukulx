
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import { useIsClient } from '@/hooks/use-is-client';

const navLinks = [
  { href: '/tutors', label: 'Find a Tutor' },
  { href: '/#features', label: 'Features' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsAuthenticated(loggedIn);
    }
  }, [isClient]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
    // Optionally redirect to home or login page
    // window.location.href = '/'; 
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
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Become a Tutor
            </Link>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          {isClient && isAuthenticated ? (
            <>
              <Link href="/dashboard">
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
                href="/dashboard"
                className="w-full text-center py-2 transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsMenuOpen(false)}
              >
                Become a Tutor
              </Link>
            <div className="flex flex-col w-full gap-2 pt-2 border-t">
               {isClient && isAuthenticated ? (
                  <>
                    <Link href="/dashboard" className="w-full">
                      <Button className="w-full" variant="ghost">Dashboard</Button>
                    </Link>
                    <Button className="w-full" onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="w-full">
                      <Button variant="ghost" className="w-full">Log In</Button>
                    </Link>
                    <Link href="/signup" className="w-full">
                      <Button className="w-full">Sign Up</Button>
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
