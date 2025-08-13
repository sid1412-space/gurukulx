
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="prose dark:prose-invert max-w-none animate-fade-in">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-headline mb-8">
            Privacy Policy
          </h1>

          <p>Last updated: August 13, 2025</p>

          <p>GurukulX ("us", "we", or "our") operates the GurukulX website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Information Collection and Use</h2>
          <p>We collect several different types of information for various purposes to provide and improve our Service to you. This includes, but is not limited to, your name, email address, and usage data.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Use of Data</h2>
          <p>GurukulX uses the collected data for various purposes:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our Service</li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Security of Data</h2>
          <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Service Providers</h2>
          <p>We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us by email: gurukulxconnect@yahoo.com.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
