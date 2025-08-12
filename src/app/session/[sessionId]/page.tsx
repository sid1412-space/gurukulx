'use client';

import dynamic from 'next/dynamic';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarInset } from '@/components/ui/sidebar';

const JitsiMeetComponent = dynamic(() => import('@/components/session/JitsiMeetComponent'), {
  ssr: false,
  loading: () => <p>Loading Session...</p>,
});
const Whiteboard = dynamic(() => import('@/components/session/Whiteboard'), {
  ssr: false,
  loading: () => <p>Loading Whiteboard...</p>,
});


export default function SessionPage() {

  return (
    <div className="h-screen w-screen bg-secondary/30">
    <SidebarProvider>
        <Sidebar collapsible="icon" side="right" className="transition-all duration-300 ease-in-out">
            <SidebarContent className="p-0">
                <JitsiMeetComponent onApiReady={() => {}} />
            </SidebarContent>
        </Sidebar>
        <SidebarInset className="p-0 relative">
            <div className="absolute top-2 right-2 z-10">
                <SidebarTrigger />
            </div>
            <Whiteboard />
        </SidebarInset>
    </SidebarProvider>
    </div>
  );
}
