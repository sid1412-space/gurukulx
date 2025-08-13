
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative bg-background overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 py-20 sm:py-32">
        <div className="grid grid-cols-1 items-center">
          <div className="animate-slide-in-from-bottom duration-500 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline">
              <span className="block">Unlock Your Potential with</span>
              <span className="block text-primary">GurukulX</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              GurukulX provides an immersive, one-on-one learning experience with expert tutors and an interactive whiteboard to help you succeed.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link href="/tutors">
                <Button size="lg">Find Your Tutor</Button>
              </Link>
              <Link href="/become-a-tutor">
                <Button size="lg" variant="outline">
                  Become a Tutor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
