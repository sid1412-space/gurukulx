
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Users, Target, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-secondary/30 py-20 sm:py-24">
          <div className="container mx-auto max-w-5xl px-4 text-center animate-fade-in">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline">
              The Future of Personalized Learning
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
              GurukulX was founded on a simple belief: every student deserves access to high-quality, one-on-one education, regardless of their location. We are building a platform to bridge the gap between eager learners and expert educators.
            </p>
          </div>
        </section>

        {/* Mission and Vision Section */}
        <section id="mission" className="py-20 sm:py-24">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-headline">Our Mission</h2>
                    <p className="mt-2 text-muted-foreground">
                      To empower students by providing accessible, affordable, and effective personalized education. We strive to connect students with expert tutors who can help them achieve their academic goals and unlock their full potential.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Eye className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-headline">Our Vision</h2>
                    <p className="mt-2 text-muted-foreground">
                      To create a global learning community where knowledge knows no boundaries. We envision a future where any student can instantly connect with the right educator, fostering a passion for lifelong learning.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="https://placehold.co/500x500.png"
                  alt="A collage of students and tutors"
                  width={500}
                  height={500}
                  className="rounded-xl shadow-2xl"
                  data-ai-hint="team collaboration"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="bg-secondary/30 py-20 sm:py-24">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-headline">
                Meet the Team
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The passionate individuals dedicated to revolutionizing education.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Image
                    src="https://placehold.co/128x128.png"
                    alt="Founder's photo"
                    width={128}
                    height={128}
                    className="rounded-full mx-auto mb-4"
                    data-ai-hint="person portrait"
                  />
                  <h3 className="text-xl font-bold">Founder Name</h3>
                  <p className="text-primary">Founder & CEO</p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Visionary leader with a passion for education and technology.
                  </p>
                </CardContent>
              </Card>
              {/* Add more team members here if needed */}
               <Card className="text-center">
                <CardContent className="pt-6">
                  <Image
                    src="https://placehold.co/128x128.png"
                    alt="Lead Developer's photo"
                    width={128}
                    height={128}
                    className="rounded-full mx-auto mb-4"
                    data-ai-hint="person portrait"
                  />
                  <h3 className="text-xl font-bold">Developer Name</h3>
                  <p className="text-primary">Lead Developer</p>
                   <p className="text-muted-foreground mt-2 text-sm">
                    Architect of the GurukulX platform, dedicated to creating a seamless user experience.
                  </p>
                </CardContent>
              </Card>
               <Card className="text-center">
                <CardContent className="pt-6">
                  <Image
                    src="https://placehold.co/128x128.png"
                    alt="Community Manager's photo"
                    width={128}
                    height={128}
                    className="rounded-full mx-auto mb-4"
                    data-ai-hint="person portrait"
                  />
                  <h3 className="text-xl font-bold">Manager Name</h3>
                  <p className="text-primary">Community Manager</p>
                   <p className="text-muted-foreground mt-2 text-sm">
                    Dedicated to supporting our community of tutors and students.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
