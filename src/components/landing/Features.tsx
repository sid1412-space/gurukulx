import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Edit3, BrainCircuit, Search } from 'lucide-react';

const features = [
  {
    icon: <Video className="h-8 w-8 text-primary" />,
    title: 'Live Video Chat',
    description: 'Engage in seamless, high-quality video sessions with screen sharing capabilities.',
  },
  {
    icon: <Edit3 className="h-8 w-8 text-primary" />,
    title: 'Interactive Whiteboard',
    description: 'Collaborate in real-time on our shared whiteboard for effective problem-solving.',
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'AI Tutoring Tool',
    description: 'Get AI-powered exercise and resource recommendations tailored to your learning needs.',
  },
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: 'Expert Tutors',
    description: 'Find the perfect tutor for any subject with our powerful search and discovery tools.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-secondary/50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-headline">
            A Smarter Way to Learn
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need for a successful tutoring session in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="animate-slide-in-from-bottom" style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'backwards' }}>
              <Card className="h-full text-center hover:shadow-xl hover:-translate-y-2 transition-transform duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
