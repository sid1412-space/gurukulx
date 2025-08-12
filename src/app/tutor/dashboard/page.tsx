
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useIsClient } from '@/hooks/use-is-client';
import TutorNotification from '@/components/tutors/TutorNotification';
import { DollarSign, CalendarCheck } from 'lucide-react';
import { initializeMockData } from '@/lib/mock-data';


export default function TutorDashboardPage() {
  const { toast } = useToast();
  const [tutorData, setTutorData] = useState({
      name: 'Tutor',
      isOnline: true,
      isBusy: false,
      todayEarnings: 0,
      todaySessions: 0,
  });
  const isClient = useIsClient();
  
  useEffect(() => {
    if (isClient) {
        initializeMockData();
        const loggedInUserEmail = localStorage.getItem('loggedInUser');
        if(loggedInUserEmail) {
            const users = JSON.parse(localStorage.getItem('userDatabase') || '[]');
            const currentTutor = users.find((u:any) => u.email === loggedInUserEmail);
            if(currentTutor) {
                setTutorData({
                    name: currentTutor.name || 'Tutor',
                    isOnline: currentTutor.isOnline !== false,
                    isBusy: currentTutor.isBusy === true,
                    todayEarnings: currentTutor.todayEarnings || 0,
                    todaySessions: currentTutor.todaySessions || 0,
                });
            }
        }
    }
  }, [isClient]);

  const handleStatusChange = (online: boolean) => {
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if(!loggedInUserEmail) return;

    const users = JSON.parse(localStorage.getItem('userDatabase') || '[]');
    const userIndex = users.findIndex((u:any) => u.email === loggedInUserEmail);

    if(userIndex !== -1) {
        users[userIndex].isOnline = online;
        localStorage.setItem('userDatabase', JSON.stringify(users));
        setTutorData(prev => ({...prev, isOnline: online}));
        toast({
          title: `You are now ${online ? 'Online' : 'Offline'}`,
          description: online ? 'You will now appear in student search results.' : 'You will be hidden from students.',
        });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome, {tutorData.name}!</h1>
          <p className="text-muted-foreground">Here's your summary for today.</p>
        </div>
        <div className="flex items-center space-x-2 p-2 border rounded-lg bg-secondary/50">
          <Switch id="online-status" checked={tutorData.isOnline} onCheckedChange={handleStatusChange} disabled={tutorData.isBusy} />
          <Label htmlFor="online-status" className="font-semibold">
            {tutorData.isBusy ? 'Busy (In Session)' : tutorData.isOnline ? 'Online' : 'Offline'}
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
              <div className="text-4xl font-bold text-primary">{tutorData.todaySessions}</div>
            </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">₹{tutorData.todayEarnings.toFixed(2)}</div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
