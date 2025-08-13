
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="prose dark:prose-invert max-w-none animate-fade-in">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-headline mb-8">
            Terms of Service
          </h1>

          <p>Last updated: August 13, 2025</p>
          
          <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the GurukulX website (the "Service") operated by GurukulX ("us", "we", or "our").</p>
          
          <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Accounts</h2>
          <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of GurukulX and its licensors. The Service is protected by copyright, trademark, and other laws of both India and foreign countries.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Termination</h2>
          <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Limitation Of Liability</h2>
          <p>In no event shall GurukulX, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Changes</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at gurukulxconnect@yahoo.com.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
