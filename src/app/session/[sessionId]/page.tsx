
'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';
import { Mic, MicOff, ScreenShare, ScreenShareOff, PhoneOff, GripVertical, MessageSquare, VideoOff, AlertTriangle, Timer, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import type { JitsiAPI } from '@jitsi/react-sdk';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsClient } from '@/hooks/use-is-client';
import { cn } from '@/lib/utils';
import ChatPanel from '@/components/session/ChatPanel';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { tutors } from '@/lib/mock-data';


const JitsiMeetComponent = dynamic(() => import('@/components/session/JitsiMeetComponent'), {
  ssr: false,
});
const Whiteboard = dynamic(() => import('@/components/session/Whiteboard'), {
  ssr: false,
  loading: () => <p>Loading Whiteboard...</p>,
});

type RecordingSupport = 'pending' | 'supported' | 'unsupported';

export default function SessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const { tutorId } = params;
  const { toast } = useToast();

  const [jitsiApi, setJitsiApi] = useState<JitsiAPI | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [jitsiLoadFailed, setJitsiLoadFailed] = useState(false);
  const [recordingSupport, setRecordingSupport] = useState<RecordingSupport>('pending');

  // Session timer and wallet states
  const [sessionDuration, setSessionDuration] = useState(0); // in seconds
  const [walletBalance, setWalletBalance] = useState(12550); // mock initial balance
  const tutor = tutors.find(t => t.id === tutorId);
  const pricePerMinute = tutor ? tutor.price / 60 : 0;


  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const screenStreamRef = useRef<MediaStream | null>(null);


  const isMobile = useIsMobile();
  const isClient = useIsClient();

  const [position, setPosition] = useState({ x: 0, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const controlsRef = useRef<HTMLDivElement>(null);

  // Timer and wallet deduction logic
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    if (sessionDuration > 0 && sessionDuration % 60 === 0) {
      if (walletBalance >= pricePerMinute) {
        setWalletBalance(prev => prev - pricePerMinute);
      } else {
        toast({
          variant: 'destructive',
          title: 'Insufficient Funds',
          description: 'Your wallet balance is too low. The session will now end.',
        });
        hangUp();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionDuration, pricePerMinute]);


  useEffect(() => {
    if (jitsiApi) {
      const onAudioMuteStatusChanged = ({ muted }: { muted: boolean }) => {
        setIsMuted(muted);
      };
      jitsiApi.on('audioMuteStatusChanged', onAudioMuteStatusChanged);

      jitsiApi.on('screenSharingStatusChanged', ({ on }: { on: boolean }) => {
        if (!isMobile) {
            setIsScreenSharing(on);
        }
      });

      return () => {
        jitsiApi.removeListener('audioMuteStatusChanged', onAudioMuteStatusChanged);
        jitsiApi.removeListener('screenSharingStatusChanged', onAudioMuteStatusChanged);
      };
    }
  }, [jitsiApi, isMobile]);


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

  const toggleScreenShare = () => {
     if (isMobile) return;
    jitsiApi?.executeCommand('toggleShareScreen');
  };

  const downloadRecording = () => {
      if (recordedChunksRef.current.length === 0) {
        toast({
            variant: 'destructive',
            title: 'Recording Error',
            description: 'No video was recorded.',
        });
        return;
      }
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `tutorconnect-session-${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      recordedChunksRef.current = [];
      toast({
          title: 'Download Started',
          description: 'Your session recording is downloading.',
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
    }
     if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
    }
    setIsRecording(false);
  };

  const startRecording = async () => {
    if (isRecording || isMobile) return;
    
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getDisplayMedia !== 'function') {
        setRecordingSupport('unsupported');
        console.error("getDisplayMedia is not supported in this browser.");
        return;
    }

    try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: 'tab' } as any,
            audio: true,
        });
        
        screenStreamRef.current = displayStream;

        const audioStream = displayStream.getAudioTracks().length > 0 
            ? new MediaStream(displayStream.getAudioTracks())
            : new MediaStream();

        const combinedStream = new MediaStream([
            ...displayStream.getVideoTracks(),
            ...audioStream.getAudioTracks(),
        ]);

        mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });
        
        recordedChunksRef.current = [];
        
        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunksRef.current.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = downloadRecording;

        mediaRecorderRef.current.start();
        setIsRecording(true);
        toast({
            title: 'Recording Started',
            description: 'Your session is now being recorded.',
        });

        displayStream.getVideoTracks()[0].onended = () => {
            if(mediaRecorderRef.current?.state === 'recording'){
                stopRecording();
                toast({
                    title: 'Recording Stopped',
                    description: 'Sharing has ended.',
                });
            }
        };
        
    } catch (error) {
        console.error("Error starting recording:", error);
        let description = 'Could not start recording. Please try again.';
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
            description = 'Screen recording permission was denied. Please refresh and allow access to continue.';
        }
        toast({
            variant: 'destructive',
            title: 'Recording Failed',
            description,
        });
        setIsRecording(false);
    }
  };

  useEffect(() => {
    if (isClient) {
        if (isMobile) {
            setRecordingSupport('unsupported');
            return;
        }
        const supportsRecording = !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
        if (supportsRecording) {
            setRecordingSupport('supported');
             if (searchParams.get('start_recording') === 'true' && !isRecording) {
                startRecording();
            }
        } else {
            setRecordingSound(false);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, isMobile, searchParams]);

  const hangUp = () => {
    if (isRecording) {
      stopRecording();
    }
    jitsiApi?.executeCommand('hangup');
    router.push('/dashboard');
  };
  
    const handleDragStart = (clientX: number, clientY: number, target: EventTarget) => {
        if ((target as HTMLElement).closest('[data-drag-handle]') === null) {
            return;
        }

        setIsDragging(true);
        dragStartRef.current = {
            x: clientX - position.x,
            y: clientY - position.y,
        };
        if (controlsRef.current) {
            controlsRef.current.style.cursor = 'grabbing';
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        }
    };

    const handleDragMove = (clientX: number, clientY: number) => {
        if (isDragging) {
            const newX = clientX - dragStartRef.current.x;
            const newY = clientY - dragStartRef.current.y;
            setPosition({ x: newX, y: newY });
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        if (controlsRef.current) {
            controlsRef.current.style.cursor = 'default';
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        }
    };

    const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
        handleDragStart(e.clientX, e.clientY, e.target);
    };

    const handleMouseMove = (e: MouseEvent) => {
        handleDragMove(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        handleDragStart(touch.clientX, touch.clientY, e.target);
    };

    const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        handleDragMove(touch.clientX, touch.clientY);
    };


  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  useEffect(() => {
     if (controlsRef.current) {
      const { offsetWidth } = controlsRef.current;
      setPosition(pos => ({ ...pos, x: (window.innerWidth - offsetWidth) / 2 }));
    }
  }, []);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-background">
      {!jitsiLoadFailed && (
        <div className="absolute top-0 left-0 w-full h-full z-0 opacity-100">
          <JitsiMeetComponent onApiReady={handleApiReady} onError={handleJitsiError} isMobile={isMobile} />
        </div>
      )}
      
       {recordingSupport === 'unsupported' && !isMobile && (
         <div className="absolute inset-0 flex items-center justify-center z-10 p-4">
             <Alert variant="destructive" className="max-w-lg">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Screen Recording Not Supported</AlertTitle>
                <AlertDescription>
                   This session requires screen recording, but your browser does not support this feature. Please switch to a modern desktop browser like Chrome or Firefox to continue.
                </AlertDescription>
            </Alert>
         </div>
      )}

      {jitsiLoadFailed && (
         <div className="absolute inset-0 flex items-center justify-center z-10 p-4">
             <Alert variant="destructive" className="max-w-lg">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Video Connection Error</AlertTitle>
                <AlertDescription>
                    The video conferencing service failed to load. This might be due to a network issue or browser incompatibility. Please check your connection and try again, or use a different browser.
                </AlertDescription>
            </Alert>
         </div>
      )}

      {isClient && <Whiteboard />}

      {isClient && <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
      
      <Card className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/20 text-white backdrop-blur-sm border-white/30">
        <div className="p-2 flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Timer className="h-5 w-5"/>
                <span className="font-mono text-lg">{formatDuration(sessionDuration)}</span>
            </div>
            <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <span className="font-mono text-lg">₹{walletBalance.toFixed(2)}</span>
            </div>
        </div>
      </Card>


      <TooltipProvider>
        <div
            ref={controlsRef}
            className="absolute z-20 transition-transform duration-100"
            style={{ 
              left: `${position.x}px`, 
              bottom: `${position.y}px`,
              transform: isDragging ? 'scale(1.05)' : 'scale(1)',
              touchAction: 'none'
             }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            <div className="flex items-center gap-2 p-2 bg-background border rounded-full shadow-lg">
                <div data-drag-handle className="cursor-grab p-1">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={toggleMute} className={cn("rounded-full", isMuted ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "")} disabled={jitsiLoadFailed}>
                            {isMuted ? <MicOff /> : <Mic />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{isMuted ? 'Unmute' : 'Mute'}</p>
                    </TooltipContent>
                </Tooltip>

                {!isMobile && (
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={toggleScreenShare} className={cn("rounded-full", isScreenSharing ? "bg-primary text-primary-foreground" : "")} disabled={jitsiLoadFailed}>
                             {isScreenSharing ? <ScreenShareOff /> : <ScreenShare />}
                          </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                          <p>{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</p>
                      </TooltipContent>
                  </Tooltip>
                )}

                 {!isMobile && isRecording && (
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={stopRecording} className="rounded-full bg-red-500 text-white hover:bg-red-600">
                             <VideoOff />
                          </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                          <p>Stop Recording</p>
                      </TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button variant="outline" size="icon" onClick={() => setIsChatOpen(!isChatOpen)} className={cn("rounded-full", isChatOpen ? "bg-primary text-primary-foreground" : "")}>
                           <MessageSquare />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Chat</p>
                    </TooltipContent>
                </Tooltip>
                
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="destructive" size="icon" onClick={hangUp} className="rounded-full">
                           <PhoneOff />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>End Call</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
       </TooltipProvider>
    </div>
  );
}

    