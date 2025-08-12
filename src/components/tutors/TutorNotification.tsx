
'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Bell } from 'lucide-react';
import { useIsClient } from '@/hooks/use-is-client';


interface SessionRequest {
  id: string;
  tutorId: string;
  studentName: string;
  status: 'pending' | 'accepted' | 'rejected';
  sessionId?: string;
}

export default function TutorNotification() {
  const { toast } = useToast();
  const router = useRouter();
  const isClient = useIsClient();
  const [activeRequest, setActiveRequest] = useState<SessionRequest | null>(null);

  useEffect(() => {
    if (!isClient) return;

    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if (!loggedInUserEmail) return;

    const users = JSON.parse(localStorage.getItem('userDatabase') || '[]');
    const currentUser = users.find((u:any) => u.email === loggedInUserEmail);
    if (!currentUser) return;

    // Poll localStorage for new requests
    const intervalId = setInterval(() => {
        const requests = JSON.parse(localStorage.getItem('sessionRequests') || '[]');
        const pendingRequest = requests.find((r: SessionRequest) => r.tutorId === currentUser.id && r.status === 'pending');
        setActiveRequest(pendingRequest || null);
    }, 2000); // Check every 2 seconds

    return () => clearInterval(intervalId);
  }, [isClient]);

  const handleAccept = async () => {
    if (!activeRequest) return;

    const sessionId = `sess_${Math.random().toString(36).substring(2, 11)}`;
    let requests = JSON.parse(localStorage.getItem('sessionRequests') || '[]');
    const requestIndex = requests.findIndex((r:any) => r.id === activeRequest.id);

    if (requestIndex !== -1) {
        requests[requestIndex].status = 'accepted';
        requests[requestIndex].sessionId = sessionId;
        localStorage.setItem('sessionRequests', JSON.stringify(requests));
    }
    
    setActiveRequest(null);
    router.push(`/session/${sessionId}?tutorId=${activeRequest.tutorId}&role=tutor`);
  };

  const handleReject = async () => {
    if (!activeRequest) return;
    
    let requests = JSON.parse(localStorage.getItem('sessionRequests') || '[]');
    const requestIndex = requests.findIndex((r:any) => r.id === activeRequest.id);

    if (requestIndex !== -1) {
        requests[requestIndex].status = 'rejected';
        localStorage.setItem('sessionRequests', JSON.stringify(requests));
    }
    
    setActiveRequest(null);

    toast({
        title: 'Request Rejected',
        description: 'You have declined the session request.'
    });
  };

  if (!activeRequest) {
    return (
       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell /> Waiting for Requests</CardTitle>
            <CardDescription>You will be notified here when a student requests a session.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
                <p>No active session requests right now.</p>
            </div>
          </CardContent>
        </Card>
    )
  }

  return (
     <Card className="bg-primary/10 border-primary animate-pulse">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="text-primary"/> New Session Request!</CardTitle>
             <CardDescription>A student is requesting a live session with you now.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="Student" />
                        <AvatarFallback>S</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold text-lg">{activeRequest.studentName}</p>
                        <p className="text-sm text-muted-foreground">Wants to start a session.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleAccept} size="lg">Accept</Button>
                    <Button variant="destructive" onClick={handleReject} size="lg">Reject</Button>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
