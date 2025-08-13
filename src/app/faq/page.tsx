
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How do I start a session with a tutor?',
    answer: 'Once you find a tutor you like, you can request a session directly from their profile page. If they are online and accept your request, you will be connected to a live session immediately.',
  },
  {
    question: 'What tools are available during a session?',
    answer: 'Each session includes live video/audio chat and an interactive whiteboard. Tutors can also use our AI-powered tool to generate practice problems for you directly on the whiteboard.',
  },
  {
    question: 'How does billing work?',
    answer: 'Our platform uses a pay-per-minute system. Funds are deducted from your wallet based on the tutor\'s per-minute rate. You can recharge your wallet at any time from your dashboard.',
  },
  {
    question: 'Can I become a tutor?',
    answer: 'Yes! We are always looking for passionate experts. You can apply by clicking the "Become a Tutor" link in the header and filling out the application form. Our team will review it and get back to you.',
  },
  {
    question: 'Is my session recorded?',
    answer: 'For quality and safety purposes, sessions may be monitored. We also provide session transcripts so you can review what was discussed at any time.',
  },
];

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-headline">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have a question? We've got answers. If you can't find what you're looking for, feel free to contact us.
          </p>
        </div>

        <div className="animate-slide-in-from-bottom">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground whitespace-pre-wrap p-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
}
