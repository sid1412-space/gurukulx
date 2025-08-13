
'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Bell } from 'lucide-react';
import { useIsClient } from '@/hooks/use-is-client';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, Unsubscribe, deleteDoc } from 'firebase/firestore';


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
    if (!isClient || !auth.currentUser) return;
  
    const requestsQuery = query(
        collection(db, 'sessionRequests'),
        where('tutorId', '==', auth.currentUser.uid),
        where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
        if (!snapshot.empty) {
          const requestDoc = snapshot.docs[0];
          // Check if the request is still active before setting it
          if (requestDoc.exists()) {
             setActiveRequest({ id: requestDoc.id, ...requestDoc.data() } as SessionRequest);
          }
        } else {
          setActiveRequest(null);
        }
    });

    return () => unsubscribe();
  }, [isClient, router]);


  const handleAccept = async () => {
    if (!activeRequest || !auth.currentUser) return;

    // Use the guaranteed unique request ID as the session ID
    const sessionId = activeRequest.id;
    const requestRef = doc(db, 'sessionRequests', activeRequest.id);
    const tutorRef = doc(db, 'users', auth.currentUser.uid);
    
    try {
        await updateDoc(tutorRef, { isBusy: true });
        await updateDoc(requestRef, {
            status: 'accepted',
            sessionId: sessionId,
        });
        
        setActiveRequest(null);
        router.push(`/session/${sessionId}?tutorId=${activeRequest.tutorId}&role=tutor`);

    } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not accept the session.'})
    }
  };

  const handleReject = async () => {
    if (!activeRequest) return;
    
    const requestRef = doc(db, 'sessionRequests', activeRequest.id);
    await deleteDoc(requestRef);
    
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
                        <AvatarImage src="https://placehold.co/100x100.png" alt="Student" data-ai-hint="person avatar" />
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
