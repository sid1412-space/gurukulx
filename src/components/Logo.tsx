
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
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z" stroke="none" fill="hsl(var(--primary) / 0.1)" />
    <path d="M12 12m-2 0a2 2 0 104 0 2 2 0 10-4 0" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M5.64 5.64l1.41 1.41" />
    <path d="M16.95 16.95l1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M5.64 18.36l1.41-1.41" />
    <path d="M16.95 7.05l1.41-1.41" />
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
