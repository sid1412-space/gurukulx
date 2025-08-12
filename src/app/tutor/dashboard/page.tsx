
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, DollarSign, BookOpen, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export default function TutorDashboardPage() {
  const dailyStats = [
    { title: "Today's Sessions", value: '4', icon: CalendarCheck },
    { title: "Today's Earnings", value: '₹12,500', icon: DollarSign },
  ];

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
            <CardDescription>You have 2 sessions scheduled for the rest of today.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
                <li className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold">Calculus II with Jane Doe</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4"/> 4:00 PM - 5:00 PM</p>
                    </div>
                    <Button variant="outline">Join Now</Button>
                </li>
                 <li className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold">Physics with John Smith</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4"/> 6:00 PM - 7:00 PM</p>
                    </div>
                    <Button variant="outline">Join Now</Button>
                </li>
            </ul>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/> My Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">View and manage your students.</p>
                    <Button variant="secondary" className="mt-4 w-full">View Students</Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5"/> My Subjects</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Update your teaching subjects.</p>
                    <Button variant="secondary" className="mt-4 w-full">Manage Subjects</Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
