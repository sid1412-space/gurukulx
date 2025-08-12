
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Loader2, KeyRound, Landmark, User } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const profileSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email(),
  bio: z.string().max(500, 'Bio is too long').optional(),
  subjects: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(6, 'New password must be at least 6 characters.'),
});

const payoutSchema = z.object({
  accountHolderName: z.string().min(2, 'Name is required'),
  accountNumber: z.string().min(9, 'Invalid account number'),
  ifscCode: z.string().length(11, 'IFSC code must be 11 characters'),
  upiId: z.string().optional(),
});

export default function TutorSettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = {
    name: 'Dr. Evelyn Reed',
    email: 'tutor@example.com',
    bio: 'PhD in Physics with 10+ years of teaching experience at the university level. I make complex topics easy to understand.',
    subjects: 'Physics, Calculus',
    avatar: 'https://placehold.co/128x128.png'
  };

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: currentUser,
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  });
  
  const payoutForm = useForm<z.infer<typeof payoutSchema>>({
    resolver: zodResolver(payoutSchema),
    defaultValues: {
        accountHolderName: 'Dr. Evelyn Reed',
        accountNumber: '**** **** 1234',
        ifscCode: 'ABCDE012345',
        upiId: 'evelyn.reed@upi'
    }
  });


  function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    console.log(values);
    setTimeout(() => {
      toast({
        title: 'Profile Updated',
        description: 'Your information has been saved successfully.',
      });
      setIsLoading(false);
    }, 1000);
  }

  function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    setIsLoading(true);
    console.log(values);
    setTimeout(() => {
      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
      });
      setIsLoading(false);
      passwordForm.reset();
    }, 1000);
  }
  
  function onPayoutSubmit(values: z.infer<typeof payoutSchema>) {
     setIsLoading(true);
    console.log(values);
    setTimeout(() => {
      toast({
        title: 'Payout Details Updated',
        description: 'Your bank information has been saved.',
      });
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
        <p className="text-muted-foreground">Manage your public profile, account security, and payout information.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User /> Public Profile</CardTitle>
                    <CardDescription>This information will be visible to students.</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} data-ai-hint="person portrait"/>
                        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button type="button" variant="outline">Change Photo</Button>
                    </div>
                    <FormField control={profileForm.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={profileForm.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email Address</FormLabel> <FormControl> <Input type="email" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={profileForm.control} name="subjects" render={({ field }) => ( <FormItem> <FormLabel>Your Subjects</FormLabel> <FormControl> <Input placeholder="e.g., Physics, Calculus" {...field} /> </FormControl><p className="text-sm text-muted-foreground">Separate subjects with commas.</p> <FormMessage /> </FormItem> )}/>
                    <FormField control={profileForm.control} name="bio" render={({ field }) => ( <FormItem> <FormLabel>Bio</FormLabel> <FormControl> <Textarea placeholder="Tell students about your teaching style and experience." className="resize-none" {...field}/> </FormControl> <FormMessage /> </FormItem> )}/>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Profile
                        </Button>
                    </div>
                    </form>
                </Form>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
             <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><KeyRound/> Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                      <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => ( <FormItem> <FormLabel>Current Password</FormLabel> <FormControl> <Input type="password" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                      <FormField control={passwordForm.control} name="newPassword" render={({ field }) => ( <FormItem> <FormLabel>New Password</FormLabel> <FormControl> <Input type="password" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                      <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Password
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
             <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Landmark/> Payout Details</CardTitle>
                  <CardDescription>How you'll get paid.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...payoutForm}>
                    <form onSubmit={payoutForm.handleSubmit(onPayoutSubmit)} className="space-y-4">
                      <FormField control={payoutForm.control} name="accountHolderName" render={({ field }) => ( <FormItem> <FormLabel>Account Holder Name</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                      <FormField control={payoutForm.control} name="accountNumber" render={({ field }) => ( <FormItem> <FormLabel>Account Number</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                      <FormField control={payoutForm.control} name="ifscCode" render={({ field }) => ( <FormItem> <FormLabel>IFSC Code</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                       <FormField control={payoutForm.control} name="upiId" render={({ field }) => ( <FormItem> <FormLabel>UPI ID (Optional)</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                      <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Payout Info
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
        </div>
      </div>
    </div>
  );
}
