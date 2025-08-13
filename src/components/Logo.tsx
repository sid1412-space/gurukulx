
import Link from 'next/link';
import { cn } from '@/lib/utils';
import GurukulXLogo from './GurukulXLogo';

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <GurukulXLogo />
      <span className="text-xl font-bold text-foreground">GurukulX</span>
    </Link>
  );
}
