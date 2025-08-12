import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, BookOpen, UserPlus } from 'lucide-react';

export default function AdminOverviewPage() {
  const stats = [
    { title: 'Total Tutors', value: '1,250', icon: Users },
    { title: 'Active Students', value: '15,830', icon: Users },
    { title: 'Sessions This Month', value: '5,120', icon: BookOpen },
    { title: 'Monthly Revenue', value: '$85,450', icon: DollarSign },
    { title: 'New Tutor Applicants', value: '42', icon: UserPlus },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Overview</h1>
        <p className="text-muted-foreground">Key metrics for the TutorConnect platform.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
      {/* Additional sections for charts and recent activities can be added here */}
    </div>
  );
}
