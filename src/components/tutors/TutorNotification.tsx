
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
  requestId: string;
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

    const tutorEmail = localStorage.getItem('loggedInUser');
    if (!tutorEmail) return;

    const findAndNotifyRequests = () => {
      // Don't look for new requests if one is already active
      if (activeRequest) return;

      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('session-request-')) {
          try {
            const request: SessionRequest = JSON.parse(localStorage.getItem(key)!);
            
            if (request.tutorId === tutorEmail && request.status === 'pending') {
              setActiveRequest(request);
            }
          } catch (error) {
            console.error('Error parsing session request from localStorage', error);
          }
        }
      });
    };
    
    const interval = setInterval(findAndNotifyRequests, 3000); // Check every 3 seconds
    return () => clearInterval(interval);
  }, [isClient, activeRequest]);

  const handleAccept = () => {
    if (!activeRequest) return;

    const tutorEmail = localStorage.getItem('loggedInUser');
    if (!tutorEmail) return;

    const sessionId = `sess_${Math.random().toString(36).substring(2, 11)}`;
    const updatedRequest: SessionRequest = { ...activeRequest, status: 'accepted', sessionId };
    localStorage.setItem(`session-request-${activeRequest.requestId}`, JSON.stringify(updatedRequest));
    
    // Set tutor as busy
    localStorage.setItem(`tutor-busy-${tutorEmail}`, 'true');
    window.dispatchEvent(new Event('storage'));

    setActiveRequest(null);
    router.push(`/session/${sessionId}?tutorId=${tutorEmail}&role=tutor`);
  };

  const handleReject = () => {
    if (!activeRequest) return;

    const updatedRequest: SessionRequest = { ...activeRequest, status: 'rejected' };
    localStorage.setItem(`session-request-${activeRequest.requestId}`, JSON.stringify(updatedRequest));
    
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
