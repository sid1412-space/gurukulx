
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, QrCode, UploadCloud, Hourglass } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useIsClient } from '@/hooks/use-is-client';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


const amountSchema = z.object({
  amount: z.coerce.number().min(10, 'Minimum recharge amount is ₹10.'),
});

type Step = 'amount' | 'payment' | 'confirmation' | 'pending';

const predefinedAmounts = [50, 100, 200, 500, 1000];

const qrCodeMapping: { [key: number]: string } = {
  50: 'https://i.ibb.co/p6LNHGJf/100.jpg',
  100: 'https://i.ibb.co/p6LNHGJf/100.jpg',
  200: 'https://i.ibb.co/mCjX1qBS/200.jpg',
  500: 'https://i.ibb.co/7d7MpxCC/500.jpg',
  1000: 'https://i.ibb.co/twttTb7f/1000.jpg',
  default: 'https://i.ibb.co/k2MDtfnR/manual.jpg' // Fallback for custom amounts
};

export default function RechargePage() {
  const [step, setStep] = useState<Step>('amount');
  const [rechargeAmount, setRechargeAmount] = useState(0);
  const { toast } = useToast();
  const isClient = useIsClient();

  const form = useForm<z.infer<typeof amountSchema>>({
    resolver: zodResolver(amountSchema),
    defaultValues: { amount: 50 },
  });

  function onAmountSubmit(values: z.infer<typeof amountSchema>) {
    setRechargeAmount(values.amount);
    setStep('payment');
  }

  const handlePredefinedAmountClick = (amount: number) => {
    setRechargeAmount(amount);
    setStep('payment');
  };
  
  const getQrCode = () => {
    return qrCodeMapping[rechargeAmount] || qrCodeMapping.default;
  }

  const handleFormSubmitted = async () => {
    if (!auth.currentUser) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to make a request.' });
        return;
    }

    try {
        await addDoc(collection(db, "rechargeRequests"), {
            studentId: auth.currentUser.uid,
            studentEmail: auth.currentUser.email,
            amount: rechargeAmount,
            status: 'pending',
            createdAt: serverTimestamp(),
        });
        toast({
            title: 'Request Submitted',
            description: 'Your recharge request has been sent for admin approval.'
        });
        setStep('pending');
    } catch(error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not submit your request.' });
    }
  }

  const renderStep = () => {
    switch (step) {
      case 'amount':
        return (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-medium">Select an Amount</p>
              <div className="grid grid-cols-3 gap-4 mt-2">
                {predefinedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className="h-16 text-lg"
                    onClick={() => handlePredefinedAmountClick(amount)}
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </div>
            <Separator />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onAmountSubmit)} className="space-y-4">
                 <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Or Enter a Custom Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 150" {...field} className="h-12 text-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full">Proceed to Pay</Button>
              </form>
            </Form>
          </div>
        );
      case 'payment':
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-xl font-semibold">Step 2: Complete Your Payment</h2>
            <p className="text-muted-foreground">
              Please pay <span className="font-bold text-primary">₹{rechargeAmount.toFixed(2)}</span> using the QR Code or UPI ID below.
            </p>
            <div className="flex justify-center">
               <img
                    src={getQrCode()}
                    alt={`Payment QR Code for ₹${rechargeAmount}`}
                    width={250}
                    height={250}
                    className="rounded-lg border-4 border-primary p-1 shadow-lg"
                    data-ai-hint="qr code"
                />
            </div>
            <div className="space-y-2">
                <p className="font-semibold">Or use UPI ID:</p>
                <p className="text-lg font-mono p-2 bg-muted rounded-md inline-block">NEUROX@SLC</p>
            </div>
             <Separator />
            <p className="text-sm text-muted-foreground font-semibold">After payment, click the button below to confirm.</p>
            <Button onClick={() => setStep('confirmation')} size="lg" className="w-full">I Have Paid</Button>
          </div>
        );
      case 'confirmation':
        return (
           <div className="space-y-6 text-center">
                <UploadCloud className="h-12 w-12 text-primary mx-auto" />
                <h2 className="text-xl font-semibold">Step 3: Confirm Your Payment</h2>
                <p className="text-muted-foreground">
                    To complete your recharge, please submit the payment screenshot and UTR/Transaction ID in our Google Form.
                </p>
                <p className="text-sm text-destructive font-semibold">Your account will not be credited until you complete this step.</p>
                <Link href="https://forms.gle/Hy5tR6SbseoRWX9S7" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full">Open Confirmation Form</Button>
                </Link>
                <Button variant="outline" onClick={handleFormSubmitted} className="w-full">I have submitted the form</Button>
            </div>
        )
      case 'pending':
        return (
            <div className="space-y-6 text-center">
                <Hourglass className="h-12 w-12 text-primary mx-auto animate-spin" />
                <h2 className="text-xl font-semibold">Recharge Pending Approval</h2>
                <p className="text-muted-foreground">
                   Thank you! We have received your request. Your balance will be updated within 24 hours after we verify the payment.
                </p>
                <Link href="/tutors">
                    <Button size="lg" className="w-full">Find a Tutor</Button>
                </Link>
            </div>
        )
    }
  };

  const getCardTitle = () => {
    switch (step) {
      case 'amount':
        return 'Recharge Your Wallet';
      case 'payment':
        return `Pay ₹${rechargeAmount.toFixed(2)}`;
      case 'confirmation':
        return 'Upload Proof of Payment';
      case 'pending':
        return 'Verification Pending';
    }
  };
  
   const getCardDescription = () => {
    switch (step) {
      case 'amount':
        return 'Select a predefined amount or enter your own.';
      case 'payment':
        return 'Scan the QR code with your payment app.';
      case 'confirmation':
        return 'This is the final step to get your recharge approved.';
      case 'pending':
        return 'You will be notified once your payment is confirmed.';
    }
  };


  return (
     <div className="container mx-auto max-w-2xl py-8 animate-fade-in">
       <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                 {step === 'amount' && <DollarSign className="h-8 w-8 text-primary" />}
                 {step === 'payment' && <QrCode className="h-8 w-8 text-primary" />}
                 {step === 'confirmation' && <UploadCloud className="h-8 w-8 text-primary" />}
                 {step === 'pending' && <Hourglass className="h-8 w-8 text-primary" />}
                {getCardTitle()}
            </CardTitle>
            <CardDescription>{getCardDescription()}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>
    </div>
  );
}
