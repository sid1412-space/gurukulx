
'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef, MouseEvent as ReactMouseEvent } from 'react';
import { Mic, MicOff, ScreenShare, ScreenShareOff, PhoneOff, GripVertical, MessageSquare, Video, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import type { JitsiAPI } from '@jitsi/react-sdk';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsClient } from '@/hooks/use-is-client';
import { cn } from '@/lib/utils';
import ChatPanel from '@/components/session/ChatPanel';
import { useToast } from '@/hooks/use-toast';


const JitsiMeetComponent = dynamic(() => import('@/components/session/JitsiMeetComponent'), {
  ssr: false,
});
const Whiteboard = dynamic(() => import('@/components/session/Whiteboard'), {
  ssr: false,
  loading: () => <p>Loading Whiteboard...</p>,
});

export default function SessionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [jitsiApi, setJitsiApi] = useState<JitsiAPI | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const screenStreamRef = useRef<MediaStream | null>(null);


  const isMobile = useIsMobile();
  const isClient = useIsClient();

  const [position, setPosition] = useState({ x: 0, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const controlsRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (jitsiApi) {
      const onAudioMuteStatusChanged = ({ muted }: { muted: boolean }) => {
        setIsMuted(muted);
      };
      jitsiApi.on('audioMuteStatusChanged', onAudioMuteStatusChanged);

      const onScreenSharingStatusChanged = ({ on }: { on: boolean }) => {
        setIsScreenSharing(on);
      };
      jitsiApi.on('screenSharingStatusChanged', onScreenSharingStatusChanged);

      return () => {
        jitsiApi.removeListener('audioMuteStatusChanged', onAudioMuteStatusChanged);
        jitsiApi.removeListener('screenSharingStatusChanged', onScreenSharingStatusChanged);
      };
    }
  }, [jitsiApi]);


  const handleApiReady = (api: JitsiAPI) => {
    setJitsiApi(api);
    // Video is now off by default based on Jitsi config
  };

  const toggleMute = () => {
    jitsiApi?.executeCommand('toggleAudio');
  };

  const toggleScreenShare = () => {
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
      const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `tutorconnect-session-${new Date().toISOString()}.mp4`;
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
    if (isRecording) return;
    try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true // Capture system audio
        });
        
        screenStreamRef.current = displayStream; // Store stream to stop it later

        // For simplicity, we'll record the screen share audio.
        // A more complex implementation could merge Jitsi's audio track.
        const audioStream = displayStream.getAudioTracks().length > 0 
            ? new MediaStream(displayStream.getAudioTracks())
            : new MediaStream(); // empty stream if no audio

        const combinedStream = new MediaStream([
            ...displayStream.getVideoTracks(),
            ...audioStream.getAudioTracks(),
        ]);

        mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });
        
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

        // Stop recording if the user stops sharing from the browser's native UI
        displayStream.getVideoTracks()[0].onended = () => {
            if(mediaRecorderRef.current?.state === 'recording'){
                stopRecording();
                toast({
                    title: 'Recording Stopped',
                    description: 'Screen sharing ended.',
                });
            }
        };
        
    } catch (error) {
        console.error("Error starting recording:", error);
        toast({
            variant: 'destructive',
            title: 'Recording Failed',
            description: 'Could not start screen recording. Please ensure you have given permission.',
        });
        setIsRecording(false);
    }
  };
  
  const toggleRecording = () => {
      if (isRecording) {
          stopRecording();
      } else {
          startRecording();
      }
  };

  const hangUp = () => {
    if (isRecording) {
      stopRecording();
    }
    jitsiApi?.executeCommand('hangup');
    router.push('/dashboard');
  };
  
  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    // Only allow dragging from the handle
    if ((e.target as HTMLElement).closest('[data-drag-handle]') === null) {
      return;
    }
    
    setIsDragging(true);
    dragStartRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
    };
     if (controlsRef.current) {
      controlsRef.current.style.cursor = 'grabbing';
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (controlsRef.current) {
        controlsRef.current.style.cursor = 'default';
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    // Center the controls horizontally on initial render
     if (controlsRef.current) {
      const { offsetWidth } = controlsRef.current;
      setPosition(pos => ({ ...pos, x: (window.innerWidth - offsetWidth) / 2 }));
    }
  }, []);

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div className="hidden">
        <JitsiMeetComponent onApiReady={handleApiReady} />
      </div>

      {isClient && <Whiteboard />}

      {isClient && <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}


      <TooltipProvider>
        <div
            ref={controlsRef}
            className="absolute z-20"
            style={{ 
              left: `${position.x}px`, 
              bottom: `${position.y}px`,
              touchAction: 'none'
             }}
            onMouseDown={handleMouseDown}
        >
            <div className="flex items-center gap-2 p-2 bg-background border rounded-full shadow-lg">
                <div data-drag-handle className="cursor-grab p-1">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={toggleMute} className={cn("rounded-full", isMuted ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "")}>
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
                          <Button variant="outline" size="icon" onClick={toggleScreenShare} className={cn("rounded-full", isScreenSharing ? "bg-primary text-primary-foreground" : "")}>
                             {isScreenSharing ? <ScreenShareOff /> : <ScreenShare />}
                          </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                          <p>{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</p>
                      </TooltipContent>
                  </Tooltip>
                )}

                {!isMobile && (
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={toggleRecording} className={cn("rounded-full", isRecording ? "bg-red-500 text-white" : "")}>
                             {isRecording ? <VideoOff /> : <Video />}
                          </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                          <p>{isRecording ? 'Stop Recording' : 'Record Session'}</p>
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


    