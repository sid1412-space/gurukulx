
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
import { LayoutDashboard, Settings, Banknote, BookCopy, AlertTriangle } from 'lucide-react';
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
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isTutor = localStorage.getItem('isTutor') === 'true';
    const currentUserEmail = localStorage.getItem('loggedInUser');

    if (loggedIn && isTutor && currentUserEmail) {
        const usersJSON = localStorage.getItem('userDatabase') || '[]';
        const users = JSON.parse(usersJSON);
        const currentUser = users.find((u:any) => u.email === currentUserEmail);
        
        if(currentUser && currentUser.role === 'banned') {
            setIsBanned(true);
            setIsAuthorized(false);
        } else {
            setIsBanned(false);
            setIsAuthorized(true);
        }
    } else {
      router.push('/login');
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isTutor');
    localStorage.removeItem('loggedInUser');
    setIsAuthorized(false);
    setIsBanned(false);
    window.dispatchEvent(new Event("storage"));
    router.push('/');
  }

  if (isBanned) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-center p-4">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold">Account Access Restricted</h1>
            <p className="text-muted-foreground mt-2 max-w-md">
                You have been banned from the platform. For more details, please contact us at <a href="mailto:gurukulxconnect@yahoo.com" className="underline text-primary">gurukulxconnect@yahoo.com</a> for further details.
            </p>
            <Button onClick={handleLogout} className="mt-6">Logout</Button>
        </div>
    )
  }

  if (!isAuthorized) {
     return (
        <div className="flex items-center justify-center h-screen bg-background">
            <p>Redirecting to login...</p>
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
