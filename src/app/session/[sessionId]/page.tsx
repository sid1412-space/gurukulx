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
    <div className="h-[calc(100vh-4rem)] flex flex-row bg-secondary/30">
      {/* Video Panel */}
      <div className="w-[350px] flex-shrink-0 border-r p-4">
        <Card className="h-full">
            <JitsiMeet roomName={sessionId} />
        </Card>
      </div>
      
      {/* Whiteboard Panel */}
      <div className="flex-grow h-full p-4">
        <Card className="h-full">
            <Whiteboard />
        </Card>
      </div>

      {/* Chat Panel */}
      <div className="w-[350px] flex-shrink-0 border-l p-4">
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    Session Chat
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-4">
                <ScrollArea className="flex-grow h-full border rounded-md p-4">
                    {/* Chat messages will go here */}
                    <p className="text-sm text-muted-foreground">Welcome to the session chat!</p>
                </ScrollArea>
                <div className="flex gap-2">
                    <Textarea placeholder="Type your message..." className="resize-none" />
                    <Button>Send</Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
