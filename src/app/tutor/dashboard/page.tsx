
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, DollarSign, Clock } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useIsClient } from '@/hooks/use-is-client';

const TUTOR_ID = '1'; // Corresponds to Dr. Evelyn Reed in mock data

export default function TutorDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const isClient = useIsClient();

  // Load status from localStorage on mount
  useEffect(() => {
    if (isClient) {
        const storedStatus = localStorage.getItem(`tutor-status-${TUTOR_ID}`);
        if (storedStatus) {
        setIsOnline(storedStatus === 'online');
        } else {
        // Default to online if no status is set
        localStorage.setItem(`tutor-status-${TUTOR_ID}`, 'online');
        }

        const busyStatus = localStorage.getItem(`tutor-busy-${TUTOR_ID}`) === 'true';
        setIsBusy(busyStatus);
        
        const handleStorageChange = () => {
            const updatedBusyStatus = localStorage.getItem(`tutor-busy-${TUTOR_ID}`) === 'true';
            setIsBusy(updatedBusyStatus);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }
  }, [isClient]);

  const dailyStats = [
    { title: "Today's Sessions", value: '4', icon: CalendarCheck },
    { title: "Today's Earnings", value: '₹12,500', icon: DollarSign },
  ];

  const upcomingSessions = [
      { studentName: 'Jane Doe', topic: 'Calculus II', time: '4:00 PM - 5:00 PM' },
      { studentName: 'John Smith', topic: 'Physics', time: '6:00 PM - 7:00 PM' },
  ];

  const handleJoinSession = (studentName: string) => {
    const sessionId = Math.random().toString(36).substring(2, 15);
    router.push(`/session/${sessionId}?tutorId=${TUTOR_ID}&role=tutor`);
  };

  const handleStatusChange = (online: boolean) => {
    setIsOnline(online);
    const newStatus = online ? 'online' : 'offline';
    localStorage.setItem(`tutor-status-${TUTOR_ID}`, newStatus);
    window.dispatchEvent(new Event('storage')); // Notify other tabs
    toast({
        title: `You are now ${online ? 'Online' : 'Offline'}`,
        description: online ? 'You will now appear in search results.' : 'You will be hidden from students.'
    });
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Tutor Dashboard</h1>
            <p className="text-muted-foreground">Here's your summary for today.</p>
        </div>
         <div className="flex items-center space-x-2 p-2 border rounded-lg bg-secondary/50">
          <Switch id="online-status" checked={isOnline} onCheckedChange={handleStatusChange} disabled={isBusy} />
          <Label htmlFor="online-status" className="font-semibold">
            {isBusy ? 'Busy' : (isOnline ? 'Online' : 'Offline')}
          </Label>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {dailyStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

       <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>You have {upcomingSessions.length} sessions scheduled for the rest of today.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
                {upcomingSessions.map((session, index) => (
                    <li key={index} className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold">{session.topic} with {session.studentName}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4"/> {session.time}</p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" disabled={isBusy}>
                                    {isBusy ? 'In Session' : 'Join Now'}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Start Session?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You are about to start your session with {session.studentName}.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleJoinSession(session.studentName)}>
                                    Continue
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </li>
                ))}
            </ul>
          </CardContent>
        </Card>
    </div>
  );
}

    