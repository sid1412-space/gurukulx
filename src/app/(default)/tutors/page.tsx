import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import TutorCard from '@/components/tutors/TutorCard';
import { tutors } from '@/lib/mock-data';

export default function TutorsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8 text-center animate-fade-in">
        <h1 className="text-4xl font-extrabold tracking-tight font-headline">Find Your Perfect Tutor</h1>
        <p className="mt-2 text-lg text-muted-foreground">Search by subject, price, or keyword to connect with an expert.</p>
      </header>
      
      <div className="mb-8 max-w-2xl mx-auto animate-slide-in-from-bottom">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for subjects like 'Calculus' or 'Python'..."
            className="pl-10 h-12 text-lg" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tutors.map((tutor, index) => (
          <div key={tutor.id} className="animate-slide-in-from-bottom" style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}>
            <TutorCard tutor={tutor} />
          </div>
        ))}
      </div>
    </div>
  );
}
