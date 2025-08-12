
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import TutorCard from '@/components/tutors/TutorCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIsClient } from '@/hooks/use-is-client';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const exams = {
  JEE: ['Physics', 'Chemistry', 'Mathematics'],
  NEET: ['Physics', 'Chemistry', 'Biology'],
};

export default function TutorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [allTutors, setAllTutors] = useState<any[]>([]);
  const isClient = useIsClient();

   useEffect(() => {
        if (isClient) {
            const q = query(collection(db, "users"), where("role", "==", "tutor"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const tutorsData = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                    avatar: doc.data().avatar || 'https://placehold.co/100x100.png',
                    bio: doc.data().applicationDetails?.qualification || 'A passionate and experienced tutor.',
                    rating: 4.8 + Math.random() * 0.2, // Keep random rating for demo
                    subjects: doc.data().applicationDetails?.expertise ? [doc.data().applicationDetails.expertise] : ['Subject'],
                }));
                setAllTutors(tutorsData);
            });
            return () => unsubscribe();
        }
    }, [isClient]);

  const handleExamChange = (value: string) => {
    setSelectedExam(value);
    setSelectedSubject('');
  };

  const filteredTutors = useMemo(() => {
    if (!isClient) return [];

    let availableTutors = allTutors.filter(tutor => tutor.isOnline && !tutor.isBusy);

    let filtered = availableTutors;

    if (selectedSubject) {
      filtered = filtered.filter((tutor) =>
        tutor.subjects.includes(selectedSubject)
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (tutor) =>
          tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tutor.subjects.some((s:string) =>
            s.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    return filtered;
  }, [searchQuery, selectedSubject, selectedExam, isClient, allTutors]);

  const subjectsForSelectedExam = selectedExam ? exams[selectedExam as keyof typeof exams] : [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8 text-center animate-fade-in">
        <h1 className="text-4xl font-extrabold tracking-tight font-headline">
          Find Your Perfect Tutor
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Select your exam and subject to connect with an expert.
        </p>
      </header>

      <div className="mb-8 max-w-2xl mx-auto animate-slide-in-from-bottom space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select onValueChange={handleExamChange} value={selectedExam}>
            <SelectTrigger className="h-12 text-lg">
              <SelectValue placeholder="Select Exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JEE">JEE (Engineering)</SelectItem>
              <SelectItem value="NEET">NEET (Medical)</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={setSelectedSubject}
            value={selectedSubject}
            disabled={!selectedExam}
          >
            <SelectTrigger className="h-12 text-lg">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {subjectsForSelectedExam.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Or search for tutors by name..."
            className="pl-10 h-12 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTutors.map((tutor, index) => (
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
       {isClient && filteredTutors.length === 0 && (
          <div className="text-center col-span-full py-12 text-muted-foreground">
            <p>No tutors available for your selection.</p>
            <p>Try adjusting your filters or check back later.</p>
          </div>
        )}
    </div>
  );
}

    