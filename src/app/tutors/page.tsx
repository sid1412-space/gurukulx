
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import TutorCard from '@/components/tutors/TutorCard';
import { tutors } from '@/lib/mock-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIsClient } from '@/hooks/use-is-client';


const exams = {
  JEE: ['Physics', 'Chemistry', 'Mathematics'],
  NEET: ['Physics', 'Chemistry', 'Biology'],
};

export default function TutorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  // Force re-render when tutor status changes in another tab
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const isClient = useIsClient();

  useEffect(() => {
    const handleStorageChange = () => {
      setUpdateTrigger(Math.random());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleExamChange = (value: string) => {
    setSelectedExam(value);
    setSelectedSubject(''); // Reset subject when exam changes
  };

  const filteredTutors = useMemo(() => {
    if (!isClient) return [];

    let availableTutors = tutors.filter(tutor => {
      const isOnline = localStorage.getItem(`tutor-status-${tutor.id}`) === 'online';
      const isBusy = localStorage.getItem(`tutor-busy-${tutor.id}`) === 'true';
      // For demo, if status is not set, assume online.
      const hasSetStatus = localStorage.getItem(`tutor-status-${tutor.id}`);
      return (isOnline || !hasSetStatus) && !isBusy;
    });

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
          tutor.subjects.some((s) =>
            s.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    return filtered;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedSubject, updateTrigger, isClient]);

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
              <SelectItem value="JEE">JEE</SelectItem>
              <SelectItem value="NEET">NEET</SelectItem>
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
       {filteredTutors.length === 0 && (
          <div className="text-center col-span-full py-12 text-muted-foreground">
            <p>No tutors found for your selection.</p>
            <p>Try adjusting your filters or check back later.</p>
          </div>
        )}
    </div>
  );
}

    