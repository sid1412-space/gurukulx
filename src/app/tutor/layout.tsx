
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Settings, Banknote, BookCopy } from 'lucide-react';
import Logo from '@/components/Logo';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';

const tutorMenuItems = [
  { href: '/tutor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tutor/payouts', label: 'Payouts', icon: Banknote },
  { href: '/tutor/sessions', label: 'Session History', icon: BookCopy },
  { href: '/tutor/settings', label: 'Settings', icon: Settings },
];

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isTutor = localStorage.getItem('isTutor') === 'true';
    if (loggedIn && isTutor) {
      setAuthStatus('authenticated');
    } else {
      setAuthStatus('unauthenticated');
      router.push('/login');
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isTutor');
    setAuthStatus('unauthenticated');
    window.dispatchEvent(new Event("storage"));
    router.push('/');
  }

  if (authStatus !== 'authenticated') {
     return (
        <div className="flex items-center justify-center h-screen bg-background">
            <p>Loading...</p>
        </div>
    );
  }
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
            <div className='px-2 py-1 text-xs text-muted-foreground font-semibold'>Tutor Panel</div>
          <SidebarMenu>
            {tutorMenuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} className="w-full">
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, side: 'right' }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 flex items-center justify-between border-b">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
                <p className="text-sm font-semibold">Tutor</p>
                <Avatar>
                    <AvatarImage src="https://placehold.co/100x100.png" alt="Tutor Avatar" data-ai-hint="person avatar"/>
                    <AvatarFallback>T</AvatarFallback>
                </Avatar>
                  <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
