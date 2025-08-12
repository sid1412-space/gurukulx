
import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

const RishiIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5.5 14.5c.6-1.3 1.6-2.4 3-3 .9-.4 1.9-.6 3-1.5.7-.6 1.1-1.4 1.5-2.2" />
    <path d="M12 12c-2 0-3-1-4.5-2S6 8.5 6 7.5s1-2 3-2 4.5 1 6 2c.8.5 1.4 1.2 1.8 2.1.5 1.1.8 2.3.8 3.4 0 1.9-.6 3.8-1.7 5.2-.4.5-.8 1-1.3 1.4" />
    <path d="M12 12c1.5 0 2.5.5 4 1.5s2.5 1.5 4 1.5" />
    <path d="M8.5 14.5c0 1.5.5 2.5 1.5 3.5s2 1.5 3 1.5 2-1 3.5-1.5c1-.3 1.5-.8 1.5-1.5" />
    <path d="M2 18c2 1 4 1 6 1s4-1 6-2" />
    <path d="M20.5 17.5c-2.5.5-5.5.5-8 0" />
  </svg>
);


export default function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <RishiIcon className="h-8 w-8 text-primary" />
      <span className="text-2xl font-bold text-foreground">GurukulX</span>
    </Link>
  );
}
