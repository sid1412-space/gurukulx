
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, BookOpen, UserPlus, Hourglass, Banknote } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useIsClient } from '@/hooks/use-is-client';

export default function AdminOverviewPage() {
  const [pendingPayouts, setPendingPayouts] = useState(0);
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      const storedPayouts = localStorage.getItem('pendingPayoutRequests');
      setPendingPayouts(parseInt(storedPayouts || '0'));
    }
  }, [isClient]);

  const stats = [
    { title: 'Total Tutors', value: '1,250', icon: Users },
    { title: 'Active Students', value: '15,830', icon: Users },
    { title: 'Sessions This Month', value: '5,120', icon: BookOpen },
    { title: 'Monthly Revenue', value: '₹85,450', icon: DollarSign },
  ];

  const actionItems = [
    { title: 'New Tutor Applicants', value: '42', icon: UserPlus, href: '/admin/tutors' },
    { title: 'Pending Payout Requests', value: pendingPayouts.toString(), icon: Banknote, href: '/admin/finances', isVisible: pendingPayouts > 0 },
    { title: 'Pending Recharges', value: '8', icon: Hourglass, href: '#' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Overview</h1>
        <p className="text-muted-foreground">Key metrics and action items for the TutorConnect platform.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
       <div className="grid gap-6 md:grid-cols-2">
         {actionItems.map((item, index) => (
           item.isVisible !== false && (
            <Card key={index} className="hover:shadow-md transition-shadow flex flex-row items-center">
                <CardHeader className="flex-shrink-0">
                    <item.icon className="h-8 w-8 text-primary" />
                </CardHeader>
                <CardContent className="py-4 flex-grow">
                     <p className="text-sm text-muted-foreground">{item.title}</p>
                    <p className="text-3xl font-bold">{item.value}</p>
                </CardContent>
                <div className="pr-6">
                    <Link href={item.href}>
                        <Button variant="outline">View</Button>
                    </Link>
                </div>
            </Card>
           )
         ))}
      </div>

    </div>
  );
}
