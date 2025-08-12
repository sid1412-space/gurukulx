
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useIsClient } from '@/hooks/use-is-client';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Tutor = {
  id: string;
  name: string;
  avatar: string;
  subjects: string[];
  bio: string;
  rating: number;
  price: number;
};

type TutorCardProps = {
  tutor: Tutor;
};

export default function TutorCard({ tutor }: TutorCardProps) {
  const router = useRouter();
  const isClient = useIsClient();
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [sessionRequestId, setSessionRequestId] = useState<string | null>(null);


  useEffect(() => {
    if (isClient) {
      const checkStatus = () => {
        const onlineStatus = localStorage.getItem(`tutor-status-${tutor.id}`) !== 'offline';
        const busyStatus = localStorage.getItem(`tutor-busy-${tutor.id}`) === 'true';
        setIsOnline(onlineStatus);
        setIsBusy(busyStatus);
      };

      checkStatus();
      
      // Listen for storage events to update status from other tabs
      window.addEventListener('storage', checkStatus);
      return () => {
        window.removeEventListener('storage', checkStatus);
      };
    }
  }, [isClient, tutor.id]);

  useEffect(() => {
    if (!isWaiting || !sessionRequestId) return;

    const interval = setInterval(() => {
        const requestJSON = localStorage.getItem(`session-request-${sessionRequestId}`);
        if(requestJSON) {
            const request = JSON.parse(requestJSON);
            if(request.status === 'accepted') {
                clearInterval(interval);
                setIsWaiting(false);
                router.push(`/session/${request.sessionId}?tutorId=${tutor.id}&role=student`);
            } else if (request.status === 'rejected') {
                clearInterval(interval);
                setIsWaiting(false);
                setSessionRequestId(null);
                toast({
                    variant: 'destructive',
                    title: 'Session Rejected',
                    description: `${tutor.name} is unable to take your session right now.`,
                });
            }
        }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [isWaiting, sessionRequestId, router, tutor.id, tutor.name, toast]);

  const handleRequestSession = () => {
    const requestId = `req_${Math.random().toString(36).substring(2, 11)}`;
    const sessionRequest = {
        requestId,
        tutorId: tutor.id,
        studentName: 'A Student', // In a real app, get this from context/auth
        status: 'pending',
    };
    localStorage.setItem(`session-request-${requestId}`, JSON.stringify(sessionRequest));
    setSessionRequestId(requestId);
    setIsWaiting(true);
  };
  
  const handleCancelRequest = () => {
    if(sessionRequestId) {
        localStorage.removeItem(`session-request-${sessionRequestId}`);
    }
    setIsWaiting(false);
    setSessionRequestId(null);
  }

  const statusText = isBusy ? 'In Session' : (isOnline ? 'Online' : 'Offline');
  const statusColor = isBusy ? 'bg-yellow-500' : (isOnline ? 'bg-green-500' : 'bg-gray-400');

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex flex-row items-start gap-4">
          <Link href={`/tutors/${tutor.id}`}>
            <Avatar className="h-16 w-16">
              <AvatarImage src={tutor.avatar} alt={tutor.name} data-ai-hint="person portrait" />
              <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
             <Link href={`/tutors/${tutor.id}`} className="hover:underline">
              <CardTitle>{tutor.name}</CardTitle>
             </Link>
            <div className="flex items-center gap-2 mt-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-muted-foreground font-semibold">{tutor.rating.toFixed(1)}</span>
            </div>
             {isClient && (
                <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className={cn("h-2.5 w-2.5 rounded-full", statusColor)}></span>
                    <span>{statusText}</span>
                </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {tutor.subjects.map((subject) => (
            <Badge key={subject} variant="secondary">{subject}</Badge>
          ))}
        </div>
        <CardDescription className="line-clamp-3">{tutor.bio}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-xl font-bold text-primary">₹{tutor.price}<span className="text-sm font-normal text-muted-foreground">/min</span></p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={!isOnline || isBusy}>
                {isBusy ? 'In Session' : (isOnline ? 'Request Session' : 'Offline')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Request a new session?</AlertDialogTitle>
              <AlertDialogDescription>
                A request will be sent to the tutor. You will be connected if they accept.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRequestSession}>
                Send Request
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>

      {/* Waiting Dialog */}
       <AlertDialog open={isWaiting}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Waiting for {tutor.name}...</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your request has been sent. Please wait for them to accept.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction variant="destructive" onClick={handleCancelRequest}>Cancel Request</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </Card>
  );
}
