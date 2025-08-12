
'use client';

import { usePathname } from 'next/navigation';
import { JitsiMeeting, type JitsiAPI } from '@jitsi/react-sdk';

interface JitsiMeetComponentProps {
  onApiReady: (api: JitsiAPI) => void;
  onError: (error: any) => void;
  isMobile?: boolean;
}

export default function JitsiMeetComponent({ onApiReady, onError, isMobile }: JitsiMeetComponentProps) {
  const pathname = usePathname();
  const sessionId = pathname.split('/').pop() || `tutorconnect-session-${Math.random().toString(36).substring(2, 15)}`;

  const toolbarButtons = ['camera', 'microphone', 'hangup', 'chat', 'fullscreen', 'tileview'];
  if (!isMobile) {
    toolbarButtons.splice(2, 0, 'desktop'); // Add desktop sharing button for non-mobile
  }


  return (
    <div className="h-full w-full">
      <JitsiMeeting
        roomName={sessionId}
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: true,
          disableAP: true,
          disableSelfView: true,
          disableSelfViewSettings: true,
          prejoinPageEnabled: false,
          p2p: {
            enabled: true,
          },
          desktopSharingSources: ['screen', 'window', 'tab'],
        }}
        interfaceConfigOverwrite={{
          DISABLE_VIDEO_BACKGROUND: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: toolbarButtons,
          SETTINGS_SECTIONS: ['devices'],
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
          iframeRef.allow = 'camera; microphone; display-capture; autoplay;';
        }}
      />
    </div>
  );
}

    
