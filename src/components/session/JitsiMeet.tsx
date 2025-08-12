'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

type JitsiMeetProps = {
  roomName: string;
};

export default function JitsiMeet({ roomName }: JitsiMeetProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !jitsiContainerRef.current) {
      return;
    }

    const domain = 'meet.jit.si';
    // Ensure a unique room name for each session
    const uniqueRoomName = `TutorConnect-Session-${roomName}`;
    
    const options = {
      roomName: uniqueRoomName,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        prejoinPageEnabled: false,
        enableWelcomePage: false,
        filmStrip: {
          disableResizable: true,
        }
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        BRAND_WATERMARK_LINK: '',
        TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'desktop', 'hangup', 'tileview', 'chat'
        ],
        SETTINGS_SECTIONS: [
            'devices', 'moderator'
        ],
        VERTICAL_FILMSTRIP: true,
      },
      userInfo: {
        displayName: 'TutorConnect User'
      }
    };

    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    document.head.appendChild(script);

    let api: any = null;

    script.onload = () => {
      if (window.JitsiMeetExternalAPI) {
        api = new window.JitsiMeetExternalAPI(domain, options);
      }
    };

    return () => {
      api?.dispose();
      if(script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [roomName]);

  return <div ref={jitsiContainerRef} className="w-full h-full rounded-lg overflow-hidden" />;
}
