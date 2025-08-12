
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, PlusCircle, Wallet, Users } from 'lucide-react';
import Link from 'next/link';
import { useIsClient } from '@/hooks/use-is-client';
import { useEffect, useState, useMemo } from 'react';
import TutorCard from '@/components/tutors/TutorCard';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';


export default function DashboardPage() {
    const isClient = useIsClient();
    const [user] = useAuthState(auth);
    const [allTutors, setAllTutors] = useState<any[]>([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [studentName, setStudentName] = useState('User');

    // Fetch Tutors
    useEffect(() => {
        if (isClient) {
            const fetchTutors = async () => {
                const q = query(collection(db, "users"), where("role", "==", "tutor"));
                const querySnapshot = await getDocs(q);
                const tutorsData = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                    avatar: 'https://placehold.co/100x100.png',
                    bio: doc.data().applicationDetails?.qualification || 'A passionate and experienced tutor.',
                    rating: 4.8 + Math.random() * 0.2, // Keep random rating for demo
                    subjects: doc.data().applicationDetails?.expertise ? [doc.data().applicationDetails.expertise] : ['Subject'],
                }));
                setAllTutors(tutorsData);
            };
            fetchTutors();
        }
    }, [isClient]);

    // Fetch Student data and listen for wallet changes
    useEffect(() => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const unsubscribe = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    const userData = doc.data();
                    setStudentName(userData.name || 'User');
                    setWalletBalance(userData.walletBalance || 0);
                }
            });
            return () => unsubscribe();
        }
    }, [user]);


    const recommendedTutors = useMemo(() => {
        if (!allTutors.length) return [];
        // A simple recommendation logic: filter out non-available tutors and take top 3
         return allTutors.filter(tutor => {
            const isOnline = localStorage.getItem(`tutor-status-${tutor.id}`) !== 'offline';
            const isBusy = localStorage.getItem(`tutor-busy-${tutor.id}`) === 'true';
            return isOnline && !isBusy;
        }).slice(0, 3);
    }, [allTutors]);


  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome back, {studentName}!</h1>
            <p className="text-muted-foreground">Here's a quick overview of your account.</p>
        </div>
         <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-sm text-muted-foreground">Wallet Balance</p>
                <p className="text-2xl font-bold">₹{walletBalance.toFixed(2)}</p>
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
                Available Tutors
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
            <div className="text-center text-muted-foreground py-8">
                <p>You have no recent activity.</p>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}

    