
import Link from 'next/link';
import { Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground text-sm">
              Empowering students and tutors with the best online learning tools.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/tutors" className="text-muted-foreground hover:text-primary transition">Find a Tutor</Link></li>
              <li><Link href="/signup?role=tutor" className="text-muted-foreground hover:text-primary transition">Become a Tutor</Link></li>
              <li><Link href="/#features" className="text-muted-foreground hover:text-primary transition">Features</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition">FAQ</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Twitter"><Twitter className="text-muted-foreground hover:text-primary transition" /></Link>
              <Link href="#" aria-label="Facebook"><Facebook className="text-muted-foreground hover:text-primary transition" /></Link>
              <Link href="#" aria-label="LinkedIn"><Linkedin className="text-muted-foreground hover:text-primary transition" /></Link>
              <Link href="#" aria-label="Instagram"><Instagram className="text-muted-foreground hover:text-primary transition" /></Link>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TutorConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
