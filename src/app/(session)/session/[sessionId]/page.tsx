
'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef, MouseEvent as ReactMouseEvent } from 'react';
import { Mic, MicOff, ScreenShare, ScreenShareOff, PhoneOff, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import type { JitsiAPI } from '@jitsi/react-sdk';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsClient } from '@/hooks/use-is-client';
import { cn } from '@/lib/utils';

const JitsiMeetComponent = dynamic(() => import('@/components/session/JitsiMeetComponent'), {
  ssr: false,
});
const Whiteboard = dynamic(() => import('@/components/session/Whiteboard'), {
  ssr: false,
  loading: () => <p>Loading Whiteboard...</p>,
});

export default function SessionPage() {
  const router = useRouter();
  const [jitsiApi, setJitsiApi] = useState<JitsiAPI | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
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
    api.executeCommand('toggleVideo');
  };

  const toggleMute = () => {
    jitsiApi?.executeCommand('toggleAudio');
  };

  const toggleScreenShare = () => {
    jitsiApi?.executeCommand('toggleShareScreen');
  };

  const hangUp = () => {
    jitsiApi?.executeCommand('hangup');
    router.push('/dashboard');
  };
  
  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target !== e.currentTarget && (e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsDragging(true);
    dragStartRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
    };
     if (controlsRef.current) {
      controlsRef.current.style.cursor = 'grabbing';
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
        controlsRef.current.style.cursor = 'grab';
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
    <div className="h-screen w-screen relative">
      <div className="hidden">
        <JitsiMeetComponent onApiReady={handleApiReady} />
      </div>

      {isClient && <Whiteboard />}

      <TooltipProvider>
        <div
            ref={controlsRef}
            className="absolute z-20"
            style={{ left: `${position.x}px`, bottom: `${position.y}px` }}
            onMouseDown={handleMouseDown}
        >
            <div className="flex items-center gap-2 p-2 bg-background border rounded-full shadow-lg cursor-grab">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
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
