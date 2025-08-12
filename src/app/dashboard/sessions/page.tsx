
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
import { BookOpen, Download, Star } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import RatingDialog from '@/components/session/RatingDialog';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';


type Session = { 
  id: string; 
  rating?: number;
  tutorName: string;
  tutorAvatar: string;
  subject: string;
  date: string;
  duration: number;
  cost: number;
  status: 'Completed' | 'Upcoming';
};

export default function SessionHistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [ratingSession, setRatingSession] = useState<Session | null>(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if(!user) return;
    const q = query(collection(db, "sessions"), where("studentUid", "==", user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const sessionList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
        setSessions(sessionList);
    });

    return () => unsubscribe();

  }, [user]);

  const handleOpenRating = (session: Session) => {
    setRatingSession(session);
  };

  const handleCloseRating = () => {
    setRatingSession(null);
  };

  const handleRateSession = (sessionId: string, rating: number, feedback: string) => {
    console.log(`Rating session ${sessionId} with ${rating} stars and feedback: ${feedback}`);
    // Here you would update the session document in Firestore with the rating
    setSessions(prevSessions => 
      prevSessions.map(s => s.id === sessionId ? { ...s, rating: rating } : s)
    );
    setRatingSession(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            My Sessions
        </h1>
        <p className="text-muted-foreground">Review your past tutoring sessions and access transcripts.</p>
      </header>
      
      <Card>
          <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>A complete log of all your completed sessions.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sessions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                                You have no completed sessions.
                            </TableCell>
                        </TableRow>
                    ) : (
                        sessions.map((session) => (
                        <TableRow key={session.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={session.tutorAvatar} alt={session.tutorName} data-ai-hint="person avatar"/>
                                        <AvatarFallback>{session.tutorName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{session.tutorName}</span>
                                </div>
                            </TableCell>
                            <TableCell>{session.subject}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span>{format(new Date(session.date), 'PPP')}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(session.date), { addSuffix: true })}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>{session.duration} min</TableCell>
                            <TableCell>₹{session.cost.toFixed(2)}</TableCell>
                            <TableCell>
                                <Badge variant={session.status === 'Completed' ? 'default' : 'outline'}>
                                    {session.status}
                                </Badge>
                            </TableCell>
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
          userToRate={ratingSession.tutorName}
          userRole="Tutor"
        />
      )}
    </div>
  );
}

    