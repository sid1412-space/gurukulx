'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Edit3, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-4 p-4 bg-secondary/30">
      <div className="flex-grow h-full lg:h-auto lg:w-3/4">
         <Tabs defaultValue="video" className="h-full w-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="video" className="gap-2">
                    <Video className="h-4 w-4" /> Video Chat
                </TabsTrigger>
                <TabsTrigger value="whiteboard" className="gap-2">
                    <Edit3 className="h-4 w-4" /> Whiteboard
                </TabsTrigger>
            </TabsList>
            <div className="flex-grow relative mt-2">
                <TabsContent value="video" className="w-full h-full absolute top-0 left-0 m-0">
                    <JitsiMeet roomName={sessionId} />
                </TabsContent>
                <TabsContent value="whiteboard" className="w-full h-full absolute top-0 left-0 m-0">
                    <Whiteboard />
                </TabsContent>
            </div>
        </Tabs>
      </div>
      <div className="w-full lg:w-1/4 h-full lg:h-auto">
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
