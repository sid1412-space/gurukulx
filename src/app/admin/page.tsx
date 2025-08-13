
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, DollarSign, BookOpen, UserPlus, Hourglass, Banknote } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useIsClient } from '@/hooks/use-is-client';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, getCountFromServer, Timestamp } from 'firebase/firestore';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, subMonths, startOfMonth } from 'date-fns';

const CHART_MONTHS = 6;

// Helper function to get past months for chart labels
const getPastMonths = () => {
    const months = [];
    for (let i = CHART_MONTHS - 1; i >= 0; i--) {
        months.push(format(subMonths(new Date(), i), 'MMM yyyy'));
    }
    return months;
};


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
  const [chartData, setChartData] = useState({
      revenue: Array(CHART_MONTHS).fill(0).map((_, i) => ({ name: format(subMonths(new Date(), CHART_MONTHS - 1 - i), 'MMM'), total: 0 })),
      signups: Array(CHART_MONTHS).fill(0).map((_, i) => ({ name: format(subMonths(new Date(), CHART_MONTHS - 1 - i), 'MMM'), tutors: 0, students: 0 })),
  });


  const isClient = useIsClient();

  useEffect(() => {
    const fetchData = async () => {
      // --- Fetch main stats ---
      const tutorsQuery = query(collection(db, "users"), where("role", "==", "tutor"));
      const studentsQuery = query(collection(db, "users"), where("role", "==", "student"));
      
      const [tutorsSnapshot, studentsSnapshot] = await Promise.all([
          getCountFromServer(tutorsQuery),
          getCountFromServer(studentsQuery)
      ]);

      // --- Fetch session data for the current month ---
      const now = new Date();
      const currentMonthStart = startOfMonth(now);
      
      const sessionsQuery = query(collection(db, "sessions"), 
        where("date", ">=", Timestamp.fromDate(currentMonthStart))
      );
      const sessionsSnapshot = await getDocs(sessionsQuery);
      
      const sessionsThisMonth = sessionsSnapshot.size;
      const totalCostThisMonth = sessionsSnapshot.docs.reduce((sum, doc) => sum + (doc.data().cost || 0), 0);
      const platformCommission = 0.15; // 15%
      const monthlyRevenue = totalCostThisMonth * platformCommission;

      setStats({ 
          totalTutors: tutorsSnapshot.data().count, 
          activeStudents: studentsSnapshot.data().count,
          sessionsThisMonth: sessionsThisMonth,
          monthlyRevenue: monthlyRevenue,
      });

      // --- Fetch action items ---
      const applicantsQuery = query(collection(db, "users"), where("applicationStatus", "==", "Pending"));
      const rechargeQuery = query(collection(db, "rechargeRequests"), where("status", "==", "pending"));
      const payoutQuery = query(collection(db, "payoutRequests"), where("status", "==", "pending"));

      const [applicantsSnapshot, rechargeSnapshot, payoutSnapshot] = await Promise.all([
         getCountFromServer(applicantsQuery),
         getCountFromServer(rechargeQuery),
         getCountFromServer(payoutQuery)
      ]);
      
      setActionItemsData({
          newApplicants: applicantsSnapshot.data().count,
          pendingRecharges: rechargeSnapshot.data().count,
          pendingPayouts: payoutSnapshot.data().count,
      });

      // --- Fetch Chart Data ---
      const sixMonthsAgo = startOfMonth(subMonths(now, CHART_MONTHS - 1));

      // Revenue data
      const revenueQuery = query(collection(db, "sessions"), where("date", ">=", Timestamp.fromDate(sixMonthsAgo)));
      const revenueSnapshot = await getDocs(revenueQuery);
      const monthlyRevenueData = Array(CHART_MONTHS).fill(0).map((_, i) => ({
          name: format(subMonths(now, i), 'MMM'),
          total: 0
      })).reverse();

      revenueSnapshot.docs.forEach(doc => {
          const session = doc.data();
          const monthIndex = new Date().getMonth() - session.date.toDate().getMonth();
          if (monthIndex >= 0 && monthIndex < CHART_MONTHS) {
              const revenue = (session.cost || 0) * platformCommission;
              monthlyRevenueData[CHART_MONTHS - 1 - monthIndex].total += revenue;
          }
      });

      // Signups data
      const signupsQuery = query(collection(db, "users"), where("createdAt", ">=", sixMonthsAgo.toISOString()));
      const signupsSnapshot = await getDocs(signupsQuery);
      const monthlySignupsData = Array(CHART_MONTHS).fill(0).map((_, i) => ({
          name: format(subMonths(now, i), 'MMM'),
          tutors: 0,
          students: 0
      })).reverse();

      signupsSnapshot.docs.forEach(doc => {
        const user = doc.data();
        const createdAt = new Date(user.createdAt);
        const monthIndex = now.getMonth() - createdAt.getMonth();
        if (monthIndex >= 0 && monthIndex < CHART_MONTHS) {
            const dataIndex = CHART_MONTHS - 1 - monthIndex;
            if (user.role === 'tutor' || user.role === 'applicant') {
                monthlySignupsData[dataIndex].tutors += 1;
            } else if (user.role === 'student') {
                 monthlySignupsData[dataIndex].students += 1;
            }
        }
      });
      
      setChartData({ revenue: monthlyRevenueData, signups: monthlySignupsData });
    };
    
    if (isClient) {
      fetchData();
    }
  }, [isClient]);

  const statCards = [
    { title: 'Total Tutors', value: stats.totalTutors.toLocaleString(), icon: Users },
    { title: 'Active Students', value: stats.activeStudents.toLocaleString(), icon: Users },
    { title: 'Sessions This Month', value: stats.sessionsThisMonth.toLocaleString(), icon: BookOpen },
    { title: 'Monthly Revenue', value: `₹${stats.monthlyRevenue.toFixed(2)}`, icon: DollarSign },
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

      {/* Action Items */}
      <div className="grid gap-6 md:grid-cols-2">
         {actionItems.filter(item => item.isVisible).length > 0 ? (
            actionItems.map((item, index) => (
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
            ))
         ) : (
             <Card className="md:col-span-2 text-center">
                 <CardContent className="py-8">
                     <p className="text-muted-foreground">No pending action items. Great job!</p>
                 </CardContent>
             </Card>
         )}
      </div>
      
      {/* Stat Cards */}
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
      
      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue from the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.revenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`}/>
                        <Tooltip />
                        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
             <CardHeader>
                <CardTitle>New User Signups</CardTitle>
                <CardDescription>New students and tutors from the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.signups}>
                        <CartesianGrid strokeDasharray="3 3" />
                         <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                        <Tooltip />
                        <Line type="monotone" dataKey="students" stroke="hsl(var(--primary))" strokeWidth={2} name="Students"/>
                        <Line type="monotone" dataKey="tutors" stroke="hsl(var(--secondary-foreground))" strokeWidth={2} name="Tutors"/>
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
