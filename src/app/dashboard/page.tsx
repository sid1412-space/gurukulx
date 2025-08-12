
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Calendar, MessageSquare, PlusCircle, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome back, User!</h1>
            <p className="text-muted-foreground">Here's a quick overview of your account.</p>
        </div>
         <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-sm text-muted-foreground">Wallet Balance</p>
                <p className="text-2xl font-bold">₹12550</p>
            </div>
            <Link href="/dashboard/recharge">
                 <Button size="lg" className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Recharge
                </Button>
            </Link>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center text-center bg-secondary/50 border-dashed hover:border-primary hover:bg-secondary transition-colors lg:col-span-3">
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
              <li>Payment of ₹5000 confirmed - Yesterday</li>
              <li>Profile information updated - 2 days ago</li>
            </ul>
          </CardContent>
        </Card>
    </div>
  );
}
