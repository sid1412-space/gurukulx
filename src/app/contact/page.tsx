
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-headline">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We're here to help. Contact us with any questions or feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6 animate-slide-in-from-bottom">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-primary" />
                  <span>Email Us</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  For support, inquiries, or feedback, please email us.
                </p>
                <Link href="mailto:gurukulxconnect@yahoo.com" className="font-semibold text-primary hover:underline">
                  gurukulxconnect@yahoo.com
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  <span>Our Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Bettiah, Bihar, India
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="animate-slide-in-from-bottom" style={{ animationDelay: '200ms' }}>
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form action="#" method="POST" className="space-y-4">
                  <div>
                    <label htmlFor="name" className="sr-only">Name</label>
                    <Input id="name" name="name" type="text" autoComplete="name" required placeholder="Your Name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <Input id="email" name="email" type="email" autoComplete="email" required placeholder="Your Email" />
                  </div>
                   <div>
                    <label htmlFor="subject" className="sr-only">Subject</label>
                    <Input id="subject" name="subject" type="text" required placeholder="Subject" />
                  </div>
                  <div>
                    <label htmlFor="message" className="sr-only">Message</label>
                    <Textarea id="message" name="message" rows={4} required placeholder="Your Message" />
                  </div>
                  <div>
                    <Button type="submit" className="w-full">Send Message</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
