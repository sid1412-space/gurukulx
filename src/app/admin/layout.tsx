
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
import { Users, DollarSign, LayoutDashboard, Settings } from 'lucide-react';
import Logo from '@/components/Logo';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const adminMenuItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/tutors', label: 'Tutor Management', icon: Users },
  { href: '/admin/students', label: 'Student Management', icon: Users },
  { href: '/admin/finances', label: 'Financials', icon: DollarSign },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const isAdmin = user.email === 'gurukulxconnect@yahoo.com';
          
          if (isAdmin) {
            setIsAuthorized(true);
            // Also update localStorage for consistency if needed by other components
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('isAdmin', 'true');
          } else {
            router.push('/login');
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isTutor');
    localStorage.removeItem('loggedInUser');
    window.dispatchEvent(new Event("storage"));
    router.push('/');
  }

  if (isLoading) {
     return (
        <div className="flex items-center justify-center h-screen bg-background">
            <p>Verifying authorization...</p>
        </div>
    );
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
            <div className='px-2 py-1 text-xs text-muted-foreground font-semibold'>Admin Panel</div>
          <SidebarMenu>
            {adminMenuItems.map((item) => (
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
                <p className="text-sm font-semibold">Admin</p>
                <Avatar>
                    <AvatarImage src="https://i.ibb.co/xqvy59YP/Chat-GPT-Image-Aug-12-2025-11-06-21-PM.png" alt="Admin Avatar" data-ai-hint="person avatar"/>
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
                  <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
