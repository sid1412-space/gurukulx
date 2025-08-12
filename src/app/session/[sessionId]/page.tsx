
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
import { tutors } from '@/lib/mock-data';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { getExerciseSuggestions } from '@/lib/actions';
import { Separator } from '@/components/ui/separator';
import Lobby from '@/components/session/Lobby';

const Whiteboard = dynamic(() => import('@/components/session/Whiteboard'), { ssr: false });
const JitsiMeetComponent = dynamic(() => import('@/components/session/JitsiMeetComponent'), { ssr: false });


export default function SessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const tutorId = searchParams.get('tutorId');
  const userRole = searchParams.get('role'); // 'student' or 'tutor'
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
  const [walletBalance, setWalletBalance] = useState(12550); // mock initial balance
  const tutor = tutors.find(t => t.id === tutorId);
  const pricePerMinute = tutor ? tutor.price : 1; 

  const isClient = useIsClient();

   // Set tutor as busy when session starts
  useEffect(() => {
    if (hasAgreedToTerms && tutorId) {
      localStorage.setItem(`tutor-busy-${tutorId}`, 'true');
      // Notify other tabs that tutor status has changed
      window.dispatchEvent(new Event('storage'));
    }
  }, [hasAgreedToTerms, tutorId]);

  // Timer and wallet deduction logic
  useEffect(() => {
    if (!hasAgreedToTerms) return;

    const timerInterval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [hasAgreedToTerms]);

  useEffect(() => {
    if (!hasAgreedToTerms || !tutor || userRole !== 'student' || sessionDuration === 0) return;

    // Deduct funds every 60 seconds (1 minute)
    if (sessionDuration > 0 && sessionDuration % 60 === 0) {
      setWalletBalance(currentBalance => {
        const newBalance = currentBalance - pricePerMinute;
        
        if (newBalance <= 0) {
            toast({
              variant: 'destructive',
              title: 'Insufficient Funds',
              description: 'Your wallet balance is empty. The session will now end.',
            });
            hangUp();
            return 0;
        }
        
        toast({
            title: 'Charge Applied',
            description: `₹${pricePerMinute.toFixed(2)} deducted for the last minute. New balance: ₹${newBalance.toFixed(2)}`,
        });
        return newBalance;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionDuration]);


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

  const hangUp = () => {
    if (tutorId) {
        localStorage.removeItem(`tutor-busy-${tutorId}`);
        // Notify other tabs that tutor status has changed
        window.dispatchEvent(new Event('storage'));
    }
    jitsiApi?.executeCommand('hangup');
    
    // Redirect based on role to the session history page
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

        // Dispatch a custom event to create shapes on the whiteboard
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
                 <div className="p-2 border rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                        <Wallet className="text-green-600"/>
                        <span className="font-semibold">₹{walletBalance.toFixed(2)}</span>
                    </div>
                </div>
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
