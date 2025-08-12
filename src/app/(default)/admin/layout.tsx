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
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const adminMenuItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/tutors', label: 'Tutor Management', icon: Users },
  { href: '/admin/finances', label: 'Financials', icon: DollarSign },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
                    <AvatarImage src="https://placehold.co/100x100.png" alt="Admin Avatar" data-ai-hint="person avatar"/>
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <Link href="/">
                  <Button variant="ghost">Logout</Button>
                </Link>
            </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
