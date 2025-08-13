
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, DollarSign, Clock, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

const benefits = [
  {
    icon: <DollarSign className="h-10 w-10 text-primary" />,
    title: 'Competitive Earnings',
    description: 'Set your own per-minute rate and get paid for your expertise. We offer low commission rates and timely payouts.',
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: 'Flexible Schedule',
    description: 'Teach whenever you want, from wherever you are. You have complete control over your availability and work hours.',
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: 'Powerful Tools',
    description: 'Our platform provides you with an interactive whiteboard, live chat, and all the tools you need to conduct effective sessions.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Submit Your Application',
    description: 'Fill out our simple signup form with your qualifications and teaching experience. It only takes a few minutes.',
  },
  {
    number: '02',
    title: 'Get Verified',
    description: 'Our team will review your application and credentials. We look for passionate and knowledgeable educators.',
  },
  {
    number: '03',
    title: 'Start Teaching',
    description: 'Once approved, you can set up your profile, mark your availability, and start connecting with students immediately.',
  },
];

export default function BecomeATutorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-secondary/30 py-20 sm:py-32">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-in-from-bottom">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline">
                  Share Your Knowledge. <br />
                  <span className="text-primary">Change a Life.</span>
                </h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                  Join GurukulX as a tutor and connect with students who need your expertise. Enjoy the flexibility of teaching online and earn on your own terms.
                </p>
                <div className="mt-10">
                  <Link href="/signup?role=tutor">
                    <Button size="lg">Apply Now</Button>
                  </Link>
                </div>
              </div>
              <div className="relative animate-fade-in flex items-center justify-center">
                <Image
                  src="https://i.ibb.co/mJ3xYQ4/logo.png"
                  alt="Tutor working on a laptop"
                  width={400}
                  height={400}
                  className="rounded-xl shadow-2xl"
                  data-ai-hint="person laptop"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 sm:py-24">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-headline">
                Why Teach with GurukulX?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We empower our tutors with the best tools and support.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index}>
                  <Card className="h-full text-center hover:shadow-xl transition-shadow duration-300 p-6">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-bold">{benefit.title}</h3>
                    <p className="text-muted-foreground mt-2">{benefit.description}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="bg-secondary/30 py-20 sm:py-24">
            <div className="container mx-auto max-w-4xl px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-headline">A Simple Path to Get Started</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Three easy steps to join our community of expert tutors.</p>
                </div>
                <div className="relative">
                    {/* The connecting line */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
                    
                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="text-center p-4">
                                 <div className="relative inline-block">
                                    <div className="w-16 h-16 bg-background border-2 border-primary rounded-full flex items-center justify-center text-primary font-bold text-2xl mb-4">
                                        {step.number}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>


        {/* CTA Section */}
        <section className="py-20 sm:py-24">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-headline">
              Ready to Make an Impact?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Your application is the first step towards empowering the next generation of learners.
            </p>
            <div className="mt-8">
              <Link href="/signup?role=tutor">
                <Button size="lg" className="text-lg py-6 px-8">
                    Start Your Application
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// Temporary Card component to avoid dependency issues if not present elsewhere
function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  );
}

    