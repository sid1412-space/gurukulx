import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Maximize, Video, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AiTutor from '@/components/session/AiTutor';

const Whiteboard = dynamic(() => import('@/components/session/Whiteboard'), {
  ssr: false,
  loading: () => <p className="text-center">Loading Whiteboard...</p>
});
const JitsiMeet = dynamic(() => import('@/components/session/JitsiMeet'), {
  ssr: false,
  loading: () => <p className="text-center">Loading Video...</p>
});


export default function SessionPage({ params }: { params: { sessionId: string } }) {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-4 p-4 bg-secondary/30">
      <div className="flex-grow h-full lg:h-auto lg:w-3/4">
        <Card className="h-full flex flex-col">
          <Tabs defaultValue="video" className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
                <TabsList>
                    <TabsTrigger value="video"><Video className="h-4 w-4 mr-2"/>Video</TabsTrigger>
                    <TabsTrigger value="whiteboard"><Edit3 className="h-4 w-4 mr-2"/>Whiteboard</TabsTrigger>
                </TabsList>
                <Button variant="ghost" size="icon">
                    <Maximize className="h-5 w-5"/>
                </Button>
            </CardHeader>
            <CardContent className="flex-grow p-0 relative">
                <TabsContent value="video" className="w-full h-full absolute top-0 left-0 m-0">
                    <JitsiMeet roomName={params.sessionId} />
                </TabsContent>
                <TabsContent value="whiteboard" className="w-full h-full absolute top-0 left-0 m-0">
                    <Whiteboard />
                </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
      <div className="w-full lg:w-1/4 h-full lg:h-auto">
        <AiTutor />
      </div>
    </div>
  );
}
