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
          // Enable screen sharing
          desktopSharingSources: ['screen', 'window', 'tab'],
        }}
        interfaceConfigOverwrite={{
          DISABLE_VIDEO_BACKGROUND: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          // We hide the toolbar as we have a custom one
          TOOLBAR_BUTTONS: [],
          TOOLBAR_ALWAYS_VISIBLE: false,
        }}
        onApiReady={onApiReady}
        getIFrameRef={(iframe) => {
            if (iframe) {
                iframe.style.height = '100%';
                iframe.style.width = '100%';
            }
        }}
      />
    </div>
  );
}
