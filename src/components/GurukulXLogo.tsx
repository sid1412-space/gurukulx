
import { cn } from '@/lib/utils';

export default function GurukulXLogo({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-8 w-8', className)}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path
        d="M50 5C25.1 5 5 25.1 5 50s20.1 45 45 45 45-20.1 45-45S74.9 5 50 5zM50 85c-19.3 0-35-15.7-35-35s15.7-35 35-35 35 15.7 35 35-15.7 35-35 35z"
        className="text-primary/30"
      />
      <path
        d="M62.5 25h-25C30.6 25 25 30.6 25 37.5v25C25 69.4 30.6 75 37.5 75h25c6.9 0 12.5-5.6 12.5-12.5v-25C75 30.6 69.4 25 62.5 25zM50 59.5c-5.2 0-9.5-4.3-9.5-9.5s4.3-9.5 9.5-9.5 9.5 4.3 9.5 9.5-4.3 9.5-9.5 9.5z"
        className="text-primary"
      />
    </svg>
  );
}
