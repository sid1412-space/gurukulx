import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tutor Session',
  description: 'Live tutoring session.',
};

export default function SessionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen bg-background">
        {children}
    </div>
  );
}
