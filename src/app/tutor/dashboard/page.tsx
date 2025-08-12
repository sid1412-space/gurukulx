
'use client';

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

export default function TutorDashboardPage() {
  const router = useRouter();
  const dailyStats = [
    { title: "Today's Sessions", value: '4', icon: CalendarCheck },
    { title: "Today's Earnings", value: '₹12,500', icon: DollarSign },
  ];

  const upcomingSessions = [
      { studentName: 'Jane Doe', topic: 'Calculus II', time: '4:00 PM - 5:00 PM', sessionId: 'session-jane-doe' },
      { studentName: 'John Smith', topic: 'Physics', time: '6:00 PM - 7:00 PM', sessionId: 'session-john-smith' },
  ];

  const handleJoinSession = (sessionId: string) => {
    // In a real app, you'd have a specific session ID. We'll simulate it.
    router.push(`/session/${sessionId}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Tutor Dashboard</h1>
            <p className="text-muted-foreground">Here's your summary for today.</p>
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
                                <Button variant="outline">Join Now</Button>
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
                                <AlertDialogAction onClick={() => handleJoinSession(session.sessionId)}>
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
