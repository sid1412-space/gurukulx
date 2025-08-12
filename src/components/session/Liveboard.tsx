'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import JitsiMeet, { type JitsiAPI } from '@jitsi/react-sdk';

interface JitsiMeetComponentProps {
  onApiReady: (api: JitsiAPI) => void;
}

export default function JitsiMeetComponent({ onApiReady }: JitsiMeetComponentProps) {
  const pathname = usePathname();
  const sessionId = pathname.split('/').pop() || `tutorconnect-session-${Math.random().toString(36).substring(2, 15)}`;

  return (
    <div className="h-full w-full">
      <JitsiMeet
        roomName={sessionId}
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: true,
          disableAP: true,
          disableSelfView: true,
          disableSelfViewSettings: true,
          toolbarButtons: [
              'camera', 'microphone', 'desktop', 'fullscreen', 'chat', 'raisehand', 'tileview'
          ],
          videoQuality: {
            preferredCodec: 'H.264',
            maxBitratesVideo: {
              low: 200000,
              standard: 500000,
              high: 1500000,
            },
          },
          // Disable video features
          startVideoMuted: 0,
          prejoinPageEnabled: false,
          p2p: {
            enabled: true,
          },
        }}
        interfaceConfigOverwrite={{
          DISABLE_VIDEO_BACKGROUND: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: [
             'microphone', 'desktop', 'fullscreen', 'chat', 'raisehand', 'tileview', 'hangup'
          ],
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
