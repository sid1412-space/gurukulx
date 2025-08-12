
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useIsClient } from '@/hooks/use-is-client';
import TutorNotification from '@/components/tutors/TutorNotification';
import { DollarSign, CalendarCheck } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, Unsubscribe } from 'firebase/firestore';


export default function TutorDashboardPage() {
  const { toast } = useToast();
  const [user, loading] = useAuthState(auth);
  const isClient = useIsClient();
  
  const [isOnline, setIsOnline] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [tutorName, setTutorName] = useState('Tutor');
  const [todaySessions, setTodaySessions] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);

  // Listen for real-time updates on the tutor's document
  useEffect(() => {
    if (!user) return;
    
    const tutorDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(tutorDocRef, (doc) => {
        if (doc.exists()) {
            const data = doc.data();
            setTutorName(data.name || 'Tutor');
            setIsOnline(data.isOnline !== false); // Default to online if not set
            setIsBusy(data.isBusy === true);
            setTodayEarnings(data.todayEarnings || 0); // Placeholder for now
            setTodaySessions(data.todaySessions || 0); // Placeholder for now
        }
    });

    return () => unsubscribe();
  }, [user]);

  const handleStatusChange = async (online: boolean) => {
    if(!user) return;
    
    const tutorDocRef = doc(db, "users", user.uid);
    try {
        await updateDoc(tutorDocRef, { isOnline: online });
        setIsOnline(online);
        toast({
          title: `You are now ${online ? 'Online' : 'Offline'}`,
          description: online ? 'You will now appear in student search results.' : 'You will be hidden from students.',
        });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not update your status.'
        });
    }
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
              <div className="text-4xl font-bold text-primary">{todaySessions}</div>
            </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">₹{todayEarnings.toFixed(2)}</div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}

    