
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, PlusCircle, Wallet, Users } from 'lucide-react';
import Link from 'next/link';
import { useIsClient } from '@/hooks/use-is-client';
import { useEffect, useState, useMemo } from 'react';
import TutorCard from '@/components/tutors/TutorCard';

// Mock student data - in a real app, this would come from a user context or API
const studentData = {
  subjects: ['Physics', 'Calculus'],
};

export default function DashboardPage() {
    const isClient = useIsClient();
    const [allTutors, setAllTutors] = useState<any[]>([]);

    useEffect(() => {
        if (isClient) {
            const usersJSON = localStorage.getItem('userDatabase');
            if (usersJSON) {
                const users = JSON.parse(usersJSON);
                const tutors = users.filter((u: any) => u.role === 'tutor');
                
                const applicantsJSON = localStorage.getItem('tutorApplicants') || '[]';
                const applicants = JSON.parse(applicantsJSON);

                // The 'price' was stored on approval, but let's add mock data for others for display
                const tutorsWithFullData = tutors.map((t: any) => {
                    const applicantData = applicants.find((a:any) => a.email === t.email) || {};
                    return {
                        ...t, // Contains name, email, role, price from approval
                        id: t.email, // Use email as a unique ID
                        avatar: 'https://placehold.co/100x100.png',
                        bio: applicantData.qualification || 'A passionate and experienced tutor.',
                        rating: 4.8 + Math.random() * 0.2, // Randomize rating slightly
                        subjects: applicantData.expertise ? [applicantData.expertise] : ['Subject'], // Use saved subject
                    }
                });
                setAllTutors(tutorsWithFullData);
            }
        }
    }, [isClient]);

    const recommendedTutors = useMemo(() => {
        if (!allTutors.length) return [];
        return allTutors.filter(tutor => 
            studentData.subjects.some(studentSubject => 
                tutor.subjects.includes(studentSubject)
            )
        ).slice(0, 3); // Show top 3 recommendations
    }, [allTutors]);


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

    {isClient && recommendedTutors.length > 0 && (
        <section className="space-y-4">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Recommended Tutors For You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedTutors.map((tutor, index) => (
                    <div
                        key={tutor.id}
                        className="animate-slide-in-from-bottom"
                        style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'backwards',
                        }}
                    >
                        <TutorCard tutor={tutor} />
                    </div>
                ))}
            </div>
        </section>
    )}


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
