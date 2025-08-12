
'use client';

import { useParams } from 'next/navigation';
import { tutors } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, BookOpen, Clock, Briefcase, GraduationCap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TutorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { tutorId } = params;

  const tutor = tutors.find((t) => t.id === tutorId);

  const handleBookSession = () => {
    if (tutor) {
      const sessionId = Math.random().toString(36).substring(2, 15);
      router.push(`/session/${sessionId}?tutorId=${tutor.id}&start_recording=true`);
    }
  };

  if (!tutor) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Tutor not found</h1>
        <p className="text-muted-foreground">The tutor you are looking for does not exist.</p>
        <Link href="/tutors">
            <Button variant="link" className="mt-4">Back to tutors</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-secondary/30">
        <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <Card className="overflow-hidden animate-fade-in">
            <div className="h-32 bg-primary/20" />
            <CardContent className="p-4 sm:p-6 text-center -mt-16">
            <Avatar className="h-32 w-32 mx-auto border-4 border-background shadow-lg">
                <AvatarImage src={tutor.avatar} alt={tutor.name} data-ai-hint="person portrait"/>
                <AvatarFallback className="text-4xl">{tutor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold mt-4 font-headline">{tutor.name}</h1>
            <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-lg">{tutor.rating.toFixed(1)}</span>
                <span>(25 reviews)</span>
            </div>
            
            <div className="mt-6 flex flex-wrap justify-center gap-2">
                {tutor.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="text-base px-4 py-1">{subject}</Badge>
                ))}
            </div>
            </CardContent>
            
            <Separator />

            <div className="p-4 sm:p-6 grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <section>
                         <h2 className="text-xl font-bold font-headline mb-2">About Me</h2>
                         <p className="text-muted-foreground whitespace-pre-wrap">{tutor.bio}</p>
                    </section>
                     <Separator />
                    <section>
                        <h2 className="text-xl font-bold font-headline mb-4">Details</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-primary" />
                                <span className="text-muted-foreground"><span className="font-semibold text-foreground">Qualification:</span> PhD in Physics</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-primary" />
                                <span className="text-muted-foreground"><span className="font-semibold text-foreground">Experience:</span> 10+ years</span>
                            </div>
                             <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                <span className="text-muted-foreground"><span className="font-semibold text-foreground">Sessions:</span> 500+ completed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                <span className="text-muted-foreground"><span className="font-semibold text-foreground">Available:</span> Mon - Fri</span>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="md:col-span-1">
                    <Card className="bg-secondary/50 p-4 sticky top-24">
                        <CardHeader className="p-2 text-center">
                            <CardTitle className="text-4xl font-bold text-primary">₹{tutor.price}<span className="text-xl font-normal text-muted-foreground">/hr</span></CardTitle>
                             <CardDescription>All taxes and fees included</CardDescription>
                        </CardHeader>
                        <CardContent className="p-2">
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="lg" className="w-full">Book a Session</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Start a new session?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You are about to start a new tutoring session with {tutor.name}.
                                        Session recording will start automatically.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleBookSession}>
                                        Continue
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button variant="outline" className="w-full mt-2">Message Tutor</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </Card>
        </div>
    </div>
  );
}
