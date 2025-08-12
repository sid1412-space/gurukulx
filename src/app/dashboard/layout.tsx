
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
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const isTutor = localStorage.getItem('isTutor') === 'true';
        const isAdmin = localStorage.getItem('isAdmin') === 'true';

        // A student is someone who is logged in but is NOT a tutor and NOT an admin.
        if (loggedIn && !isTutor && !isAdmin) {
            setIsAuthorized(true);
        } else {
            // If the user is not a valid student, redirect to login.
            // This prevents tutors/admins from seeing the student dashboard.
            router.push('/login');
        }
    }
  }, [isClient, router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isTutor');
    setIsAuthorized(false);
    window.dispatchEvent(new Event("storage"));
    router.push('/');
  }

  if (!isAuthorized) {
     return (
        <div className="flex items-center justify-center h-screen bg-background">
            <div className="flex flex-col items-center gap-2">
                 <p className="text-muted-foreground">Redirecting...</p>
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
