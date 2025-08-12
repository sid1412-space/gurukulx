'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Mic, MicOff, ScreenShare, ScreenShareOff, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import type { JitsiAPI } from '@jitsi/react-sdk';
import { useIsMobile } from '@/hooks/use-mobile';

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

  useEffect(() => {
    if (jitsiApi) {
      // Event listener for audio mute status
      const onAudioMuteStatusChanged = ({ muted }: { muted: boolean }) => {
        setIsMuted(muted);
      };
      jitsiApi.on('audioMuteStatusChanged', onAudioMuteStatusChanged);

      // Event listener for screen sharing status
      const onScreenSharingStatusChanged = ({ on }: { on: boolean }) => {
        setIsScreenSharing(on);
      };
      jitsiApi.on('screenSharingStatusChanged', onScreenSharingStatusChanged);

      // Clean up event listeners on component unmount
      return () => {
        jitsiApi.removeListener('audioMuteStatusChanged', onAudioMuteStatusChanged);
        jitsiApi.removeListener('screenSharingStatusChanged', onScreenSharingStatusChanged);
        jitsiApi.dispose();
      };
    }
  }, [jitsiApi]);


  const handleApiReady = (api: JitsiAPI) => {
    setJitsiApi(api);
    // You can execute commands here, for example:
    // api.executeCommand('toggleVideo');
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

  return (
    <div className="h-screen w-screen relative">
      {/* Jitsi is mounted but hidden to provide audio and screen sharing without a visible interface */}
      <div className="hidden">
        <JitsiMeetComponent onApiReady={handleApiReady} />
      </div>

      {/* The whiteboard takes up the entire screen */}
      <Whiteboard />

       {/* Floating Controls Bar */}
      <TooltipProvider>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
            <div className="flex items-center gap-2 p-2 bg-background border rounded-full shadow-lg">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={toggleMute} className={isMuted ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}>
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
                          <Button variant="outline" size="icon" onClick={toggleScreenShare} className={isScreenSharing ? "bg-primary text-primary-foreground" : ""}>
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
                        <Button variant="destructive" size="icon" onClick={hangUp}>
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
