
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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


type Tutor = {
  id: string;
  name: string;
  avatar: string;
  subjects: string[];
  bio: string;
  rating: number;
  price: number;
};

type TutorCardProps = {
  tutor: Tutor;
};

export default function TutorCard({ tutor }: TutorCardProps) {
  const router = useRouter();

  const handleContinue = () => {
    router.push(`/session/new-session-${tutor.id}`);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex flex-row items-center gap-4">
          <Link href={`/tutors/${tutor.id}`}>
            <Avatar className="h-16 w-16">
              <AvatarImage src={tutor.avatar} alt={tutor.name} data-ai-hint="person portrait" />
              <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
             <Link href={`/tutors/${tutor.id}`} className="hover:underline">
              <CardTitle>{tutor.name}</CardTitle>
             </Link>
            <div className="flex items-center gap-2 mt-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-muted-foreground font-semibold">{tutor.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {tutor.subjects.map((subject) => (
            <Badge key={subject} variant="secondary">{subject}</Badge>
          ))}
        </div>
        <CardDescription>{tutor.bio}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-xl font-bold text-primary">${tutor.price}<span className="text-sm font-normal text-muted-foreground">/hr</span></p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>Book Session</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Start a new session?</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to start a new tutoring session.
                <br /><br />
                Once you enter the whiteboard, please use the image upload tool (7th icon from the top) to add a picture of your question.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleContinue}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
