
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, BookOpen, UserPlus, Hourglass, Banknote } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useIsClient } from '@/hooks/use-is-client';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, collectionGroup,getCountFromServer } from 'firebase/firestore';


export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalTutors: 0,
    activeStudents: 0,
    sessionsThisMonth: 0,
    monthlyRevenue: 0,
  });
  const [actionItemsData, setActionItemsData] = useState({
      pendingPayouts: 0,
      pendingRecharges: 0,
      newApplicants: 0,
  });

  const isClient = useIsClient();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch stats
      const tutorsQuery = query(collection(db, "users"), where("role", "==", "tutor"));
      const studentsQuery = query(collection(db, "users"), where("role", "==", "student"));
      
      const tutorsSnapshot = await getCountFromServer(tutorsQuery);
      const studentsSnapshot = await getCountFromServer(studentsQuery);

      setStats(prev => ({ 
          ...prev, 
          totalTutors: tutorsSnapshot.data().count, 
          activeStudents: studentsSnapshot.data().count 
      }));

      // Fetch action items
      const applicantsQuery = query(collection(db, "users"), where("applicationStatus", "==", "Pending"));
      const rechargeQuery = query(collection(db, "rechargeRequests"), where("status", "==", "pending"));
      const payoutQuery = query(collection(db, "payoutRequests"), where("status", "==", "pending"));

      const applicantsSnapshot = await getCountFromServer(applicantsQuery);
      const rechargeSnapshot = await getCountFromServer(rechargeQuery);
      const payoutSnapshot = await getCountFromServer(payoutQuery);
      
      setActionItemsData({
          newApplicants: applicantsSnapshot.data().count,
          pendingRecharges: rechargeSnapshot.data().count,
          pendingPayouts: payoutSnapshot.data().count,
      });
    };
    
    if (isClient) {
      fetchData();
    }
  }, [isClient]);

  const statCards = [
    { title: 'Total Tutors', value: stats.totalTutors.toLocaleString(), icon: Users },
    { title: 'Active Students', value: stats.activeStudents.toLocaleString(), icon: Users },
    { title: 'Sessions This Month', value: '0', icon: BookOpen },
    { title: 'Monthly Revenue', value: '₹0', icon: DollarSign },
  ];

  const actionItems = [
    { title: 'New Tutor Applicants', value: actionItemsData.newApplicants.toString(), icon: UserPlus, href: '/admin/tutors', isVisible: actionItemsData.newApplicants > 0 },
    { title: 'Pending Payout Requests', value: actionItemsData.pendingPayouts.toString(), icon: Banknote, href: '/admin/finances', isVisible: actionItemsData.pendingPayouts > 0 },
    { title: 'Pending Recharges', value: actionItemsData.pendingRecharges.toString(), icon: Hourglass, href: '/admin/finances', isVisible: actionItemsData.pendingRecharges > 0 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Overview</h1>
        <p className="text-muted-foreground">Key metrics and action items for the GurukulX platform.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
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
           item.isVisible && (
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
