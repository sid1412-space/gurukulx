'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

const Whiteboard = dynamic(() => import('@/components/session/Whiteboard'), {
  ssr: false,
  loading: () => <p className="text-center">Loading Whiteboard...</p>
});
const JitsiMeet = dynamic(() => import('@/components/session/JitsiMeet'), {
  ssr: false,
  loading: () => <p className="text-center">Loading Video...</p>
});


export default function SessionPage({ params }: { params: { sessionId: string } }) {
  const { sessionId } = params;
  return (
    <div className="h-screen flex flex-col bg-secondary/30">
      {/* Main Content: Video and Whiteboard */}
      <div className="flex-grow flex flex-row min-h-0">
        {/* Video Panel */}
        <div className="w-[350px] flex-shrink-0 p-4">
          <Card className="h-full">
              <JitsiMeet roomName={sessionId} />
          </Card>
        </div>
        
        {/* Whiteboard Panel */}
        <div className="flex-grow h-full p-4 pl-0">
          <Card className="h-full">
              <Whiteboard />
          </Card>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="h-[200px] flex-shrink-0 border-t p-4 flex flex-col">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            Session Chat
        </h2>
        <div className="flex-grow flex flex-row gap-4 min-h-0">
            <ScrollArea className="flex-grow h-full border rounded-md p-4">
                {/* Chat messages will go here */}
                <p className="text-sm text-muted-foreground">Welcome to the session chat!</p>
            </ScrollArea>
            <div className="flex flex-col gap-2 w-[300px]">
                <Textarea placeholder="Type your message..." className="resize-none flex-grow" />
                <Button>Send</Button>
            </div>
        </div>
      </div>
    </div>
  );
}
