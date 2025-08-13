
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
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(userData);
            const isTutorRole = ['tutor', 'applicant'].includes(userData.role);

            if (isTutorRole) {
                setIsAuthorized(true);
            } else if (userData.role === 'banned') {
                router.push('/tutor/banned');
            } else {
                router.push('/login');
            }
          } else {
            router.push('/login');
          }
        } catch (error) {
          console.error("Error checking authorization:", error);
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
            <p>Redirecting...</p>
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
                <p className="text-sm font-semibold">{user?.name || 'Tutor'}</p>
                <Avatar>
                    <AvatarImage src={user?.avatar || "https://placehold.co/100x100.png"} alt="Tutor Avatar" data-ai-hint="person avatar"/>
                    <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : 'T'}</AvatarFallback>
                </Avatar>
                  <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
