
'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface TutorNotificationProps {
  tutorId: string;
}

interface SessionRequest {
  requestId: string;
  tutorId: string;
  studentName: string;
  status: 'pending' | 'accepted' | 'rejected';
  sessionId?: string;
}

export default function TutorNotification({ tutorId }: TutorNotificationProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [activeRequests, setActiveRequests] = useState<SessionRequest[]>([]);

  useEffect(() => {
    const findAndNotifyRequests = () => {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('session-request-')) {
          try {
            const request: SessionRequest = JSON.parse(localStorage.getItem(key)!);
            
            // Notify only if it's for this tutor and is pending
            if (request.tutorId === tutorId && request.status === 'pending' && !activeRequests.find(r => r.requestId === request.requestId)) {
              
              const newActiveRequests = [...activeRequests, request];
              setActiveRequests(newActiveRequests);

              toast({
                title: 'New Session Request!',
                description: `${request.studentName} wants to start a session.`,
                duration: Infinity, // Stays until dismissed
                action: (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAccept(request)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(request)}
                    >
                      Reject
                    </Button>
                  </div>
                ),
              });
            }
          } catch (error) {
            console.error('Error parsing session request from localStorage', error);
          }
        }
      });
    };
    
    // Check for requests periodically
    const interval = setInterval(findAndNotifyRequests, 3000);
    return () => clearInterval(interval);
  }, [tutorId, toast, router, activeRequests]);

  const handleAccept = (request: SessionRequest) => {
    const sessionId = `sess_${Math.random().toString(36).substring(2, 11)}`;
    const updatedRequest: SessionRequest = { ...request, status: 'accepted', sessionId };
    localStorage.setItem(`session-request-${request.requestId}`, JSON.stringify(updatedRequest));
    
    // Redirect tutor to the session
    router.push(`/session/${sessionId}?tutorId=${tutorId}&role=tutor`);
  };

  const handleReject = (request: SessionRequest) => {
    const updatedRequest: SessionRequest = { ...request, status: 'rejected' };
    localStorage.setItem(`session-request-${request.requestId}`, JSON.stringify(updatedRequest));

    // Remove from active requests so it doesn't get re-notified
    setActiveRequests(prev => prev.filter(r => r.requestId !== request.requestId));

    // Optional: a self-toast to confirm rejection
    toast({
        title: 'Request Rejected',
        description: 'You have declined the session request.'
    });
  };

  // This component doesn't render anything itself, it just handles notifications.
  return null;
}
