
'use client';

import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, BookOpen, Clock, Briefcase, GraduationCap, Loader2, Wallet } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
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
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useIsClient } from '@/hooks/use-is-client';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { initializeMockData } from '@/lib/mock-data';


export default function TutorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { tutorId } = params;
  const isClient = useIsClient();
  
  const [tutor, setTutor] = useState<any>(null);

  const [isOnline, setIsOnline] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [sessionRequestId, setSessionRequestId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);

   useEffect(() => {
     if (isClient) {
        initializeMockData();
        const users = JSON.parse(localStorage.getItem('userDatabase') || '[]');
        const currentTutor = users.find((u:any) => u.id === tutorId);
        if (currentTutor) {
          setTutor(currentTutor);
          setIsOnline(currentTutor.isOnline !== false);
          setIsBusy(currentTutor.isBusy === true);
        }

        const loggedInUserEmail = localStorage.getItem('loggedInUser');
        const currentUser = users.find((u:any) => u.email === loggedInUserEmail);
        if (currentUser) {
          setWalletBalance(currentUser.walletBalance || 0);
        }
     }
  }, [isClient, tutorId])

  
  useEffect(() => {
    if (!isWaiting || !sessionRequestId) {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        return;
    };

    timeoutRef.current = setTimeout(() => {
        handleCancelRequest(true);
    }, 120000);

    const intervalId = setInterval(() => {
        const requests = JSON.parse(localStorage.getItem('sessionRequests') || '[]');
        const currentRequest = requests.find((r: any) => r.id === sessionRequestId);

        if (currentRequest) {
            if(currentRequest.status === 'accepted') {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setIsWaiting(false);
                router.push(`/session/${currentRequest.sessionId}?tutorId=${tutorId}&role=student`);
                clearInterval(intervalId);
            } else if (currentRequest.status === 'rejected') {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setIsWaiting(false);
                setSessionRequestId(null);
                toast({
                    variant: 'destructive',
                    title: 'Session Rejected',
                    description: `${tutor?.name} is unable to take your session right now.`,
                });
                clearInterval(intervalId);
            }
        }
    }, 2000);


    return () => {
        clearInterval(intervalId);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isWaiting, sessionRequestId, router, tutorId, tutor?.name, toast]);


  const handleRequestSession = async () => {
    if (tutor) {
      const loggedInUserEmail = localStorage.getItem('loggedInUser');
      const users = JSON.parse(localStorage.getItem('userDatabase') || '[]');
      const student = users.find((u:any) => u.email === loggedInUserEmail);

      const requestId = `req_${Math.random().toString(36).substring(2, 11)}`;
      const requests = JSON.parse(localStorage.getItem('sessionRequests') || '[]');
      
      const newRequest = {
        id: requestId,
        tutorId,
        studentName: student?.name || 'A Student', 
        status: 'pending',
      };
      requests.push(newRequest);
      localStorage.setItem('sessionRequests', JSON.stringify(requests));
      setSessionRequestId(requestId);
      setIsWaiting(true);
    }
  };
  
  const handleCancelRequest = async (isTimeout = false) => {
    if(sessionRequestId) {
        let requests = JSON.parse(localStorage.getItem('sessionRequests') || '[]');
        requests = requests.filter((r:any) => r.id !== sessionRequestId);
        localStorage.setItem('sessionRequests', JSON.stringify(requests));
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsWaiting(false);
    setSessionRequestId(null);
    if (isTimeout) {
        toast({
            variant: 'destructive',
            title: 'Request Timed Out',
            description: `The tutor did not respond in time. Please try again later.`,
        });
    }
  }


  if (!isClient || !tutor) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8 text-center flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statusText = isBusy ? 'In Session' : (isOnline ? 'Online' : 'Offline');
  const statusColor = isBusy ? 'bg-yellow-500' : (isOnline ? 'bg-green-500' : 'bg-gray-400');
  const hasFunds = walletBalance > 0;

  return (
    <div className="bg-secondary/30">
        <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <Card className="overflow-hidden animate-fade-in">
            <div className="h-32 bg-primary/20" />
            <CardContent className="p-4 sm:p-6 text-center -mt-16">
            <Avatar className="h-32 w-32 mx-auto border-4 border-background shadow-lg">
                <AvatarImage src={tutor.avatar} alt={tutor.name} data-ai-hint="person portrait"/>
                <AvatarFallback className="text-4xl">{tutor.name ? tutor.name.charAt(0).toUpperCase() : 'T'}</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold mt-4 font-headline">{tutor.name}</h1>
            
            {isClient && (
                 <div className="flex items-center justify-center gap-2 mt-2">
                    <div className={cn("h-3 w-3 rounded-full", statusColor)}></div>
                    <span className="text-sm font-semibold text-muted-foreground">{statusText}</span>
                </div>
            )}

            <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-lg">{tutor.rating.toFixed(1)}</span>
                <span>(25 reviews)</span>
            </div>
            
            <div className="mt-6 flex flex-wrap justify-center gap-2">
                {tutor.subjects.map((subject: string) => (
                    <Badge key={subject} variant="secondary" className="text-base px-4 py-1">{subject}</Badge>
                ))}
            </div>
            </CardContent>
            
            <Separator />

            <div className="p-4 sm:p-6 grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <section>
                         <h2 className="text-xl font-bold font-headline mb-2">About Me</h2>
                         <p className="text-muted-foreground whitespace-pre-wrap">{tutor.bio}</p>
                    </section>
                     <Separator />
                    <section>
                        <h2 className="text-xl font-bold font-headline mb-4">Details</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-primary" />
                                <span className="text-muted-foreground"><span className="font-semibold text-foreground">Qualification:</span> {tutor.applicationDetails?.qualification || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-primary" />
                                <span className="text-muted-foreground"><span className="font-semibold text-foreground">Experience:</span> {tutor.applicationDetails?.experience || 'N/A'} years</span>
                            </div>
                             <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                <span className="text-muted-foreground"><span className="font-semibold text-foreground">Sessions:</span> 500+ completed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                <span className="text-muted-foreground"><span className="font-semibold text-foreground">Available:</span> Mon - Fri</span>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="md:col-span-1">
                    <Card className="bg-secondary/50 p-4 sticky top-24">
                        <CardHeader className="p-2 text-center">
                            <CardTitle className="text-4xl font-bold text-primary">₹{tutor.price}<span className="text-xl font-normal text-muted-foreground">/min</span></CardTitle>
                             <CardDescription>All taxes and fees included</CardDescription>
                        </CardHeader>
                        <CardContent className="p-2">
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                     <Button size="lg" className="w-full" disabled={!isOnline || isBusy || !hasFunds}>
                                        {isBusy ? 'In Session' : (isOnline ? (hasFunds ? 'Request Session' : 'Insufficient Funds') : 'Currently Offline')}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Request a new session?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        A request will be sent to {tutor.name}. You will be connected if they accept.
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
                            {!hasFunds && (
                                <p className="text-center text-sm text-destructive mt-2">
                                    Please <Link href="/dashboard/recharge" className="underline font-semibold">recharge</Link> your wallet to continue.
                                </p>
                            )}
                            <Button variant="outline" className="w-full mt-2">Message Tutor</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Card>
        </div>
         <AlertDialog open={isWaiting}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Waiting for Tutor</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your request has been sent to {tutor.name}. Please wait for them to accept. This will time out in 2 minutes.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction variant="destructive" onClick={() => handleCancelRequest(false)}>Cancel Request</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
