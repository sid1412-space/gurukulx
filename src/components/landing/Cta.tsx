import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Cta() {
  return (
    <section className="bg-background py-20 sm:py-32">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-headline">
          Ready to Start Your Learning Journey?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join thousands of students and tutors on the most advanced tutoring platform.
          Sign up today and take the first step towards academic excellence.
        </p>
        <div className="mt-8">
          <Link href="/signup">
            <Button size="lg">Get Started for Free</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
