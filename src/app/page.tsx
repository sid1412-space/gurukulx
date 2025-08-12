
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Cta from '@/components/landing/Cta';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
