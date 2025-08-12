
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <Image 
        src="https://i.ibb.co/xqvy59YP/Chat-GPT-Image-Aug-12-2025-11-06-21-PM.png"
        alt="GurukulX Logo"
        width={32}
        height={32}
        className="h-8 w-8"
      />
      <span className="text-xl font-bold text-foreground">The Future of Tutoring</span>
    </Link>
  );
}
