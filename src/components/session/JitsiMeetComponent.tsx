
'use client';

import { usePathname } from 'next/navigation';
import { JitsiMeeting, type JitsiAPI } from '@jitsi/react-sdk';

interface JitsiMeetComponentProps {
  onApiReady: (api: JitsiAPI) => void;
  onError: (error: any) => void;
}

export default function JitsiMeetComponent({ onApiReady, onError }: JitsiMeetComponentProps) {
  const pathname = usePathname();
  const sessionId = pathname.split('/').pop() || `gurukulx-session-${Math.random().toString(36).substring(7)}`;

  // Correctly defined toolbar buttons
  const toolbarButtons = [
      'microphone',
      'desktop', // Screen sharing
      'chat',
      'hangup',
  ];

  return (
    <div className="h-full w-full">
      <JitsiMeeting
        roomName={sessionId}
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: true, // Video is off by default
          disableAP: true,
          disableSelfView: true,
          disableSelfViewSettings: true,
          prejoinPageEnabled: false,
          p2p: {
            enabled: true,
          },
        }}
        interfaceConfigOverwrite={{
          DISABLE_VIDEO_BACKGROUND: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: toolbarButtons,
          SETTINGS_SECTIONS: ['devices'], // Only show device settings
          SHOW_CHROME_EXTENSION_BANNER: false,
          MOBILE_APP_PROMO: false,
        }}
        onApiReady={onApiReady}
        onReadyToClose={() => {
            // Optional: Handle cleanup or state changes when the meeting is ready to close
        }}
        onFatalError={onError}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
          iframeRef.allow = 'microphone; autoplay; display-capture;'; 
        }}
      />
    </div>
  );
}
