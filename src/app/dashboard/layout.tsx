
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
import { User, LayoutDashboard, Settings, BookOpen, ClipboardPen, Wallet } from 'lucide-react';
import Logo from '@/components/Logo';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useIsClient } from '@/hooks/use-is-client';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/recharge', label: 'Recharge Wallet', icon: Wallet },
  { href: '/dashboard/sessions', label: 'My Sessions', icon: BookOpen },
  { href: '/dashboard/practice', label: 'Practice', icon: ClipboardPen },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isClient = useIsClient();
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthorized'>('loading');

  useEffect(() => {
    if (isClient) {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const isTutor = localStorage.getItem('isTutor') === 'true';
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      
      if (loggedIn && !isTutor && !isAdmin) {
        setAuthStatus('authenticated');
      } else {
        // If user is not a student, this layout should not be rendered.
        // Other layouts (tutor/admin) will handle redirection if necessary.
        // If no other layout handles it, they might be redirected to login.
        setAuthStatus('unauthorized');
        if (!loggedIn) {
          router.push('/login');
        }
      }
    }
  }, [isClient, router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isTutor');
    setAuthStatus('unauthorized');
    window.dispatchEvent(new Event("storage"));
    router.push('/');
  }

  if (authStatus !== 'authenticated') {
     return (
        <div className="flex items-center justify-center h-screen bg-background">
            <div className="flex flex-col items-center gap-2">
                 <p className="text-muted-foreground">Loading...</p>
            </div>
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
          <SidebarMenu>
            {menuItems.map((item) => (
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
                <Avatar>
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person avatar" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
