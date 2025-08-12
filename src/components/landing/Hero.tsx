import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative bg-background overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-from-bottom duration-500">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline">
              <span className="block">Unlock Your Potential with</span>
              <span className="block text-primary">Online Tutoring</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              TutorConnect provides an immersive, one-on-one learning experience with expert tutors and an interactive whiteboard to help you succeed.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/tutors">
                <Button size="lg">Find Your Tutor</Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  Become a Tutor
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative animate-fade-in duration-700">
             <Image
              src="https://placehold.co/600x400.png"
              alt="Online tutoring session"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              data-ai-hint="online learning education"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
