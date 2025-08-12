'use client';

import { JitsiMeeting } from '@jitsi/react-sdk';
import { useIsClient } from '@/hooks/use-is-client';

type JitsiMeetProps = {
  roomName: string;
};

export default function JitsiMeet({ roomName }: JitsiMeetProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return <div className="w-full h-full flex items-center justify-center bg-black text-white"><p>Loading session...</p></div>;
  }
  
  return (
    <JitsiMeeting
      roomName={roomName}
      configOverwrite={{
        startWithVideoMuted: true,
        startWithAudioMuted: false,
        disableVideo: true, // This is a custom flag, the correct way is through config and interface
        toolbarButtons: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'e2ee'
        ],
        // Disabling video through the interface config
        // This is a more reliable way
        // Hide the camera button
        toolbarConfig: {
            initialToolbarTimeout: 20000,
            toolbarTimeout: 4000,
            alwaysVisible: false
        },
        constraints: {
            video: {
                height: {
                    ideal: 480,
                    max: 480,
                    min: 240,
                },
            },
        },
        // To truly disable video, we can remove the button
        // and set the channelLastN to 0 to prevent receiving video.
        channelLastN: 0, // No video streams from others
        p2p: {
           enabled: true,
        },
      }}
      interfaceConfigOverwrite={{
        DISABLE_VIDEO_BUTTON: true,
        SHOW_JITSI_WATERMARK: false,
        SHOW_BRAND_WATERMARK: false,
      }}
      getIFrameRef={(iframeRef) => {
        iframeRef.style.height = '100%';
        iframeRef.style.width = '100%';
      }}
      
    />
  );
}
