
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useIsClient } from '@/hooks/use-is-client';
import TutorNotification from '@/components/tutors/TutorNotification';
import { DollarSign, CalendarCheck, Hourglass, AlertCircle, CheckCircle } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';


export default function TutorDashboardPage() {
  const { toast } = useToast();
  const [tutorData, setTutorData] = useState({
      name: 'Tutor',
      isOnline: true,
      isBusy: false,
      todayEarnings: 0,
      todaySessions: 0,
      applicationStatus: '',
  });
  const isClient = useIsClient();
  
  useEffect(() => {
    const fetchTutorData = async () => {
        if (isClient && auth.currentUser) {
            const tutorRef = doc(db, 'users', auth.currentUser.uid);
            const docSnap = await getDoc(tutorRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setTutorData({
                    name: data.name || 'Tutor',
                    isOnline: data.isOnline !== false,
                    isBusy: data.isBusy === true,
                    todayEarnings: data.todayEarnings || 0,
                    todaySessions: data.todaySessions || 0,
                    applicationStatus: data.applicationStatus || 'Approved', // Default to approved for older accounts
                });
            }
        }
    }
    fetchTutorData();
  }, [isClient]);

  const handleStatusChange = async (online: boolean) => {
    if (!auth.currentUser) return;
    const tutorRef = doc(db, 'users', auth.currentUser.uid);
    
    try {
        await updateDoc(tutorRef, { isOnline: online });
        setTutorData(prev => ({...prev, isOnline: online}));
        toast({
          title: `You are now ${online ? 'Online' : 'Offline'}`,
          description: online ? 'You will now appear in student search results.' : 'You will be hidden from students.',
        });
    } catch(e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update status.' });
    }
  };
  
  if (!isClient) {
    return null; // or a loading skeleton
  }

  // Render a specific view for applicants whose status is not yet 'Approved'
  if (tutorData.applicationStatus !== 'Approved') {
    const isPending = tutorData.applicationStatus === 'Pending';
    const StatusIcon = isPending ? Hourglass : AlertCircle;
    const cardBorder = isPending ? 'border-amber-500' : 'border-destructive';
    const iconColor = isPending ? 'text-amber-500' : 'text-destructive';

    return (
        <div className="space-y-8 animate-fade-in">
             <header>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome, {tutorData.name}!</h1>
                <p className="text-muted-foreground">Here is the current status of your tutor application.</p>
            </header>
            <Card className={`border-2 ${cardBorder}`}>
                <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${iconColor}`}>
                        <StatusIcon className="h-6 w-6"/>
                        Application {tutorData.applicationStatus}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isPending ? (
                        <p className="text-muted-foreground">
                            Your application is currently under review by our team. We will notify you via email once a decision has been made. Thank you for your patience.
                        </p>
                    ) : (
                         <p className="text-muted-foreground">
                            Unfortunately, your application was not approved at this time. For more information, please contact our support team.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
  }


  // The standard dashboard for approved tutors
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
