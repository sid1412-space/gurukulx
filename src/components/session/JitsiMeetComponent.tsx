
'use client';

import { usePathname } from 'next/navigation';
import { JitsiMeeting, type JitsiAPI } from '@jitsi/react-sdk';

interface JitsiMeetComponentProps {
  onApiReady: (api: JitsiAPI) => void;
}

export default function JitsiMeetComponent({ onApiReady }: JitsiMeetComponentProps) {
  const pathname = usePathname();
  const sessionId = pathname.split('/').pop() || `tutorconnect-session-${Math.random().toString(36).substring(2, 15)}`;

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
          TOOLBAR_BUTTONS: [
            'camera',
            'microphone',
            'desktop',
            'hangup',
            'chat',
            'fullscreen',
            'tileview',
          ],
          SETTINGS_SECTIONS: ['devices'],
          SHOW_CHROME_EXTENSION_BANNER: false,
          MOBILE_APP_PROMO: false,
        }}
        onApiReady={onApiReady}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
          iframeRef.allow = 'camera; microphone; display-capture; autoplay;';
        }}
      />
    </div>
  );
}
