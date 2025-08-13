
'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef }from 'react';
import { Mic, MicOff, PhoneOff, MessageSquare, AlertTriangle, Timer, Wallet, Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import type { JitsiAPI } from '@jitsi/react-sdk';
import { useIsClient } from '@/hooks/use-is-client';
import ChatPanel from '@/components/session/ChatPanel';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { getExerciseSuggestions } from '@/lib/actions';
import { Separator } from '@/components/ui/separator';
import Lobby from '@/components/session/Lobby';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, onSnapshot, addDoc, collection, serverTimestamp, increment } from 'firebase/firestore';


const Whiteboard = dynamic(() => import('@/components/session/Whiteboard'), { ssr: false });
const JitsiMeetComponent = dynamic(() => import('@/components/session/JitsiMeetComponent'), { ssr: false });


export default function SessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const userRole = searchParams.get('role'); // 'student' or 'tutor'
  const tutorId = searchParams.get('tutorId');
  const sessionId = params.sessionId;
  const { toast } = useToast();

  const [jitsiApi, setJitsiApi] = useState<JitsiAPI | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [jitsiLoadFailed, setJitsiLoadFailed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const practiceTopicRef = useRef<HTMLInputElement>(null);

  // Session timer and wallet states
  const [sessionDuration, setSessionDuration] = useState(0); // in seconds
  const [walletBalance, setWalletBalance] = useState(0); 
  const [pricePerMinute, setPricePerMinute] = useState(1);
  const [tutorData, setTutorData] = useState<any>(null);
  const [studentData, setStudentData] = useState<any>(null);


  const isClient = useIsClient();

   // Set tutor as busy when session starts and fetch tutor data
  useEffect(() => {
    const startSession = async () => {
        if (isClient && hasAgreedToTerms && tutorId && auth.currentUser) {
            const tutorRef = doc(db, 'users', tutorId as string);
            const studentRef = doc(db, 'users', auth.currentUser.uid);
            
            // Set tutor busy immediately
            await updateDoc(tutorRef, { isBusy: true });
            
            const [tutorSnap, studentSnap] = await Promise.all([
                getDoc(tutorRef),
                getDoc(studentRef)
            ]);
           
            if (tutorSnap.exists()) {
                const data = tutorSnap.data();
                setTutorData(data);
                setPricePerMinute(data.price || 1);
            }

            if (studentSnap.exists()) {
                setStudentData(studentSnap.data());
            }
        }
    };
    startSession();
  }, [hasAgreedToTerms, isClient, tutorId, auth.currentUser]);

  // Wallet and student data listener
   useEffect(() => {
        if (isClient && userRole === 'student' && auth.currentUser) {
            const studentRef = doc(db, 'users', auth.currentUser.uid);
            const unsubscribe = onSnapshot(studentRef, (doc) => {
                if(doc.exists()){
                    setWalletBalance(doc.data().walletBalance || 0);
                }
            });
            return () => unsubscribe();
        }
    }, [isClient, userRole, auth.currentUser]);

  // Timer and wallet deduction logic
  useEffect(() => {
    if (!hasAgreedToTerms) return;

    const timerInterval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [hasAgreedToTerms]);

  useEffect(() => {
    const deductFunds = async () => {
        if (!hasAgreedToTerms || !pricePerMinute || userRole !== 'student' || sessionDuration === 0 || !auth.currentUser) return;

        // Deduct funds every 60 seconds (1 minute)
        if (sessionDuration > 0 && sessionDuration % 60 === 0) {
            const newBalance = walletBalance - pricePerMinute;
            
            if (newBalance < 0) {
                toast({
                  variant: 'destructive',
                  title: 'Insufficient Funds',
                  description: 'Your wallet balance is empty. The session will now end.',
                });
                hangUp();
            } else {
              const studentRef = doc(db, 'users', auth.currentUser.uid);
              await updateDoc(studentRef, { walletBalance: newBalance });
              toast({
                  title: 'Charge Applied',
                  description: `₹${pricePerMinute.toFixed(2)} deducted. New balance: ₹${newBalance.toFixed(2)}`,
              });
            }
        }
    };
    deductFunds();
  }, [sessionDuration, hasAgreedToTerms, pricePerMinute, userRole, toast, walletBalance]);


  useEffect(() => {
    if (jitsiApi) {
      const onAudioMuteStatusChanged = ({ muted }: { muted: boolean }) => {
        setIsMuted(muted);
      };
      jitsiApi.on('audioMuteStatusChanged', onAudioMuteStatusChanged);

      return () => {
        jitsiApi.removeListener('audioMuteStatusChanged', onAudioMuteStatusChanged);
      };
    }
  }, [jitsiApi]);


  const handleApiReady = (api: JitsiAPI) => {
    setJitsiApi(api);
  };

  const handleJitsiError = (error: any) => {
    console.error('Jitsi fatal error:', error);
    setJitsiLoadFailed(true);
  };


  const toggleMute = () => {
    jitsiApi?.executeCommand('toggleAudio');
  };

  const hangUp = async () => {
     if (isClient && tutorId) {
        const tutorRef = doc(db, 'users', tutorId as string);
        await updateDoc(tutorRef, { isBusy: false });
        
        if (userRole === 'student' && auth.currentUser && tutorData && studentData && sessionDuration > 5) {
            const cost = (sessionDuration / 60) * pricePerMinute;

            await addDoc(collection(db, 'sessions'), {
                studentId: auth.currentUser.uid,
                studentName: studentData.name,
                studentAvatar: studentData.avatar,
                tutorId: tutorId,
                tutorName: tutorData.name,
                tutorAvatar: tutorData.avatar,
                subject: (tutorData.applicationDetails?.expertise || 'General').toString(),
                date: serverTimestamp(),
                duration: sessionDuration,
                cost: cost,
                status: 'Completed',
                sessionId: sessionId,
            });
        }
    }
    jitsiApi?.executeCommand('hangup');
    const destination = userRole === 'tutor' ? '/tutor/sessions' : '/dashboard/sessions';
    router.push(destination);
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleGenerateExercises = async () => {
    const topic = practiceTopicRef.current?.value;
    if (!topic) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please enter a topic.' });
        return;
    }
    setIsGenerating(true);

    const result = await getExerciseSuggestions({ question: topic });

    if (result.success && result.data && result.data.exercises.length > 0) {
        const shapes = result.data.exercises.map((ex, i) => ({
            type: 'text',
            x: 100,
            y: 500 + i * 150,
            props: {
                text: `${ex.title}\n\n${ex.description}`,
                size: 'm',
                w: 400
            }
        }));

        window.dispatchEvent(new CustomEvent('create-shapes', { detail: { shapes } }));

        toast({ title: 'Exercises Added', description: 'Practice problems have been added to the whiteboard.' });
    } else {
        toast({
            variant: 'destructive',
            title: 'Error Generating Exercises',
            description: result.error || 'Could not generate exercises. Please try again.',
        });
    }

    setIsGenerating(false);
  };

  if (!isClient) {
    return null; // Or a loading spinner
  }

  if (!hasAgreedToTerms) {
    return <Lobby onAgree={() => setHasAgreedToTerms(true)} />;
  }

  return (
    <div className="h-screen w-screen bg-background flex flex-col">
       <header className="p-2 border-b bg-background z-20">
         <div className="flex items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                 <div className="p-2 border rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                        <Timer className="text-primary"/>
                        <span>{formatDuration(sessionDuration)}</span>
                    </div>
                </div>
                {userRole === 'student' && (
                 <div className="p-2 border rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                        <Wallet className="text-green-600"/>
                        <span className="font-semibold">₹{walletBalance.toFixed(2)}</span>
                    </div>
                </div>
                )}
            </div>

            <div className="flex items-center gap-1">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleMute}>
                                {isMuted ? <MicOff /> : <Mic />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{isMuted ? 'Unmute' : 'Mute'}</p>
                        </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsChatOpen(prev => !prev)}>
                                <MessageSquare />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Toggle Chat</p>
                        </TooltipContent>
                    </Tooltip>

                    {userRole === 'tutor' && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Wand2 />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Generate Practice Problems</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Enter a topic, and the AI will generate exercises and add them to the whiteboard.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <Input ref={practiceTopicRef} placeholder="e.g., Photosynthesis" />
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleGenerateExercises} disabled={isGenerating}>
                                    {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Generate
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                     <Separator orientation="vertical" className="h-6 mx-2"/>
                    <Button variant="destructive" size="sm" className="rounded-full px-4" onClick={hangUp}>
                        <PhoneOff className="mr-2 h-4 w-4" />
                        End Call
                    </Button>
                </TooltipProvider>
            </div>
         </div>
       </header>
       <main className="flex-grow relative bg-muted/20">
            {jitsiLoadFailed && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
                    <Alert variant="destructive" className="max-w-lg">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Audio Connection Error</AlertTitle>
                        <AlertDescription>
                            The audio service failed to load. Please check your network and try again.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
            
            <div className="absolute inset-0 z-10">
              <Whiteboard />
            </div>

            {/* Jitsi component is hidden but provides the audio stream */}
            <div className="absolute w-0 h-0 opacity-0 pointer-events-none">
                {isClient && !jitsiLoadFailed && (
                    <JitsiMeetComponent onApiReady={handleApiReady} onError={handleJitsiError} />
                )}
            </div>

            {isClient && <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
       </main>
    </div>
  );
}
