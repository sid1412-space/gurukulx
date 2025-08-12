
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useIsClient } from '@/hooks/use-is-client';
import TutorNotification from '@/components/tutors/TutorNotification';
import { DollarSign, CalendarCheck } from 'lucide-react';

const TUTOR_ID = 'tutor@example.com'; // Using email as a unique ID

export default function TutorDashboardPage() {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const isClient = useIsClient();
  const [tutorName, setTutorName] = useState('Tutor');

  // Load status and tutor info from localStorage on mount
  useEffect(() => {
    if (isClient) {
      const loggedInUserEmail = localStorage.getItem('loggedInUser');

      const checkStatus = () => {
        const storedStatus = localStorage.getItem(`tutor-status-${loggedInUserEmail}`);
        if (storedStatus) {
          setIsOnline(storedStatus === 'online');
        } else {
          localStorage.setItem(`tutor-status-${loggedInUserEmail}`, 'online');
        }

        const busyStatus = localStorage.getItem(`tutor-busy-${loggedInUserEmail}`) === 'true';
        setIsBusy(busyStatus);
      };
      
      const fetchTutorInfo = () => {
        if(loggedInUserEmail) {
            const usersJSON = localStorage.getItem('userDatabase') || '[]';
            const users = JSON.parse(usersJSON);
            const currentUser = users.find((u:any) => u.email === loggedInUserEmail);
            if(currentUser) {
                setTutorName(currentUser.name);
            }
        }
      };
      
      checkStatus();
      fetchTutorInfo();

      window.addEventListener('storage', checkStatus);

      return () => {
        window.removeEventListener('storage', checkStatus);
      };
    }
  }, [isClient]);

  const handleStatusChange = (online: boolean) => {
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if (!loggedInUserEmail) return;

    setIsOnline(online);
    const newStatus = online ? 'online' : 'offline';
    localStorage.setItem(`tutor-status-${loggedInUserEmail}`, newStatus);
    window.dispatchEvent(new Event('storage')); // Notify other tabs/pages like the search page
    toast({
      title: `You are now ${online ? 'Online' : 'Offline'}`,
      description: online ? 'You will now appear in student search results.' : 'You will be hidden from students.',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome, {tutorName}!</h1>
          <p className="text-muted-foreground">Here's your summary for today.</p>
        </div>
        <div className="flex items-center space-x-2 p-2 border rounded-lg bg-secondary/50">
          <Switch id="online-status" checked={isOnline} onCheckedChange={handleStatusChange} disabled={isBusy} />
          <Label htmlFor="online-status" className="font-semibold">
            {isBusy ? 'Busy (In Session)' : isOnline ? 'Online' : 'Offline'}
          </Label>
        </div>
      </header>
      
      {isClient && <TutorNotification />}

       <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
              <CalendarCheck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">0</div>
            </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">₹0.00</div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
