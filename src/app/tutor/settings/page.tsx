
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription as CardDesc, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useRef, useEffect } from 'react';
import { Loader2, KeyRound, Landmark, User } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsClient } from '@/hooks/use-is-client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';


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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isClient = useIsClient();
  const [user, loading] = useAuthState(auth);

  const [currentUser, setCurrentUser] = useState({
    name: '',
    email: '',
    bio: '',
    subjects: '',
    avatar: 'https://placehold.co/128x128.png'
  });
  
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar);

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
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: ''
    }
  });


   useEffect(() => {
    if (isClient && user) {
      const userDocRef = doc(db, "users", user.uid);
      getDoc(userDocRef).then(docSnap => {
          if (docSnap.exists()) {
              const userData = docSnap.data();
              // Profile Info
              const tutorProfile = {
                name: userData.name || '',
                email: userData.email,
                bio: userData.applicationDetails?.qualification || 'PhD in Physics with 10+ years of teaching experience...',
                subjects: userData.applicationDetails?.expertise || 'Physics, Calculus',
                avatar: userData.avatar || 'https://placehold.co/128x128.png',
              };
              setCurrentUser(tutorProfile);
              setAvatarPreview(tutorProfile.avatar);
              profileForm.reset(tutorProfile);

              // Payout Info
              if (userData.payoutDetails) {
                payoutForm.reset(userData.payoutDetails);
              }
          }
      });
    }
  }, [isClient, user, profileForm, payoutForm]);

  
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    if(!user) return;
    setIsLoading(true);
    
    // We need to merge this with the nested applicationDetails in Firestore
    const { subjects, bio, ...restOfValues } = values;
    const updateData = {
        ...restOfValues,
        avatar: avatarPreview,
        'applicationDetails.expertise': subjects,
        'applicationDetails.qualification': bio,
    };

    try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, updateData);
        setCurrentUser(prev => ({...prev, ...values, avatar: avatarPreview}));
        toast({
            title: 'Profile Updated',
            description: 'Your information has been saved successfully.',
        });
    } catch(e) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not update profile.' });
    } finally {
        setIsLoading(false);
    }
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
  
  async function onPayoutSubmit(values: z.infer<typeof payoutSchema>) {
    if (!user) return;
    setIsLoading(true);

    try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { payoutDetails: values });
        toast({
            title: 'Payout Details Updated',
            description: 'Your bank information has been saved.',
        });
    } catch (e) {
        toast({
            variant: 'destructive',
            title: 'Error Saving Details',
            description: 'Could not save your payout information.',
        });
    } finally {
        setIsLoading(false);
    }
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
                    <CardDesc>This information will be visible to students.</CardDesc>
                </CardHeader>
                <CardContent>
                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                           <AvatarImage src={avatarPreview} alt={currentUser.name} data-ai-hint="person portrait"/>
                           <AvatarFallback>{currentUser.name ? currentUser.name.charAt(0) : 'T'}</AvatarFallback>
                        </Avatar>
                        <Input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>Change Photo</Button>
                    </div>
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} readOnly disabled/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="subjects"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Subjects</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Physics, Calculus" {...field} />
                          </FormControl>
                          <FormDescription>Separate subjects with commas.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Tell students about your teaching style and experience." className="resize-none" {...field}/>
                          </FormControl>
                           <FormDescription>This is your qualification that students will see.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                  <CardDesc>How you'll get paid.</CardDesc>
                </CardHeader>
                <CardContent>
                  <Form {...payoutForm}>
                    <form onSubmit={payoutForm.handleSubmit(onPayoutSubmit)} className="space-y-4">
                      <FormField
                        control={payoutForm.control}
                        name="accountHolderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Holder Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={payoutForm.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={payoutForm.control}
                        name="ifscCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IFSC Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={payoutForm.control}
                        name="upiId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>UPI ID (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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

    