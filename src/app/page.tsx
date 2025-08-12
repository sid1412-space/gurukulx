import Cta from '@/components/landing/Cta';
import Features from '@/components/landing/Features';
import Hero from '@/components/landing/Hero';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <Cta />
    </div>
  );
}
