
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookCopy, Download, Users, Star } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import RatingDialog from '@/components/session/RatingDialog';
import { useIsClient } from '@/hooks/use-is-client';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, onSnapshot, doc } from 'firebase/firestore';


type Session = { 
  id: string; 
  rating?: number;
  studentName: string;
  studentAvatar: string;
  subject: string;
  date: any;
  duration: number; // in seconds
  cost: number;
  status: 'Completed' | 'Upcoming';
};


export default function TutorSessionHistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [ratingSession, setRatingSession] = useState<Session | null>(null);
  const isClient = useIsClient();

  useEffect(() => {
    if(isClient && auth.currentUser) {
        const q = query(collection(db, "sessions"), where("tutorId", "==", auth.currentUser.uid));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const sessionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
            setSessions(sessionsData);
        });

        return () => unsubscribe();
    }
  }, [isClient]);

  const handleOpenRating = (session: Session) => {
    setRatingSession(session);
  };

  const handleCloseRating = () => {
    setRatingSession(null);
  };

  const handleRateSession = async (sessionId: string, rating: number, feedback: string) => {
    // In a real app, you might want tutors to rate students too.
    // For now, this just updates the local state for demonstration.
    console.log(`Tutor rated session ${sessionId} with ${rating} stars and feedback: ${feedback}`);
     setSessions(prevSessions => 
      prevSessions.map(s => s.id === sessionId ? { ...s, rating: rating } : s)
    );
    setRatingSession(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <BookCopy className="h-8 w-8 text-primary" />
            Session History
        </h1>
        <p className="text-muted-foreground">Review your past tutoring sessions and earnings.</p>
      </header>
      
      <Card>
          <CardHeader>
              <CardTitle>Completed Sessions</CardTitle>
              <CardDescription>A complete log of all your completed sessions.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Your Earnings</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isClient && sessions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                                You have no completed sessions.
                            </TableCell>
                        </TableRow>
                    ) : (
                        sessions.map((session) => (
                        <TableRow key={session.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={session.studentAvatar} alt="Student Avatar" data-ai-hint="person avatar"/>
                                        <AvatarFallback>{session.studentName ? session.studentName.charAt(0) : 'S'}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{session.studentName}</span>
                                </div>
                            </TableCell>
                            <TableCell>{session.subject}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span>{session.date ? format(session.date.toDate(), 'PPP') : 'N/A'}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {session.date ? formatDistanceToNow(session.date.toDate(), { addSuffix: true }) : ''}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>{Math.round(session.duration / 60)} min</TableCell>
                            <TableCell className="font-semibold text-green-600">₹{(session.cost * 0.85).toFixed(2)}</TableCell>
                            <TableCell className="text-right space-x-1">
                               <Button variant="ghost" size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    Transcript
                               </Button>
                                {session.rating ? (
                                    <div className="inline-flex items-center gap-1 text-sm text-yellow-500">
                                       <Star className="h-4 w-4 fill-current"/> {session.rating}
                                    </div>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => handleOpenRating(session)}>
                                        <Star className="mr-2 h-4 w-4" />
                                        Rate
                                    </Button>
                               )}
                            </TableCell>
                        </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
          </CardContent>
      </Card>
      {ratingSession && (
        <RatingDialog
          isOpen={!!ratingSession}
          onClose={handleCloseRating}
          onSubmit={handleRateSession}
          session={ratingSession}
          userToRate="the student"
          userRole="Student"
        />
      )}
    </div>
  );
}

    