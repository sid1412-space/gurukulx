import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Calendar, MessageSquare, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome back, User!</h1>
        <p className="text-muted-foreground">Here's a quick overview of your account.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Session</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Calculus II with Dr. Reed</div>
            <p className="text-xs text-muted-foreground">Today at 4:00 PM</p>
            <Link href="/session/1" className="mt-4">
                <Button>Join Session</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">From 2 tutors</p>
            <Button variant="outline" className="mt-4">View Messages</Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center bg-secondary/50 border-dashed hover:border-primary hover:bg-secondary transition-colors">
            <CardContent className="p-6">
                <PlusCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <h3 className="font-semibold">Book a new session</h3>
                <p className="text-sm text-muted-foreground mb-4">Find a tutor for any subject</p>
                <Link href="/tutors">
                    <Button>Find a Tutor</Button>
                </Link>
            </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5"/> Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Completed session: Physics with Dr. Reed - Yesterday</li>
              <li>Payment of $75.00 confirmed - Yesterday</li>
              <li>Profile information updated - 2 days ago</li>
            </ul>
          </CardContent>
        </Card>
    </div>
  );
}
