
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Separator } from '../ui/separator';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const phoneFormSchema = z.object({
    phoneNumber: z.string().min(10, "Please enter a valid phone number."),
});

const otpFormSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits."),
});


const GoogleIcon = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25C22.56 11.42 22.49 10.62 22.36 9.84H12.27V14.4H18.16C17.88 15.72 17.15 16.85 16.08 17.59V20.31H19.79C21.66 18.59 22.56 15.71 22.56 12.25Z" fill="#4285F4"/>
        <path d="M12.27 23C15.22 23 17.7 22.03 19.31 20.61L16.08 17.59C15.04 18.33 13.78 18.75 12.27 18.75C9.55 18.75 7.23 16.94 6.39 14.4H2.58V17.22C4.34 20.72 8.01 23 12.27 23Z" fill="#34A853"/>
        <path d="M6.39 14.4C6.15 13.68 6.02 12.91 6.02 12.12C6.02 11.33 6.15 10.56 6.39 9.84V7.02H2.58C1.69 8.88 1.13 10.97 1.13 13.25C1.13 15.53 1.69 17.62 2.58 19.48L6.39 14.4Z" fill="#FBBC05"/>
        <path d="M12.27 5.25C13.84 5.25 15.1 5.81 16.01 6.67L19.38 3.3C17.7 1.74 15.22 1 12.27 1C8.01 1 4.34 3.28 2.58 6.78L6.39 9.84C7.23 7.06 9.55 5.25 12.27 5.25Z" fill="#EA4335"/>
    </svg>
);


export default function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleRedirect = async (user: any) => {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    let userData = userDoc.exists() ? userDoc.data() : null;

    if (!userData) {
      // Create a user document if it doesn't exist (for social logins)
      userData = {
        email: user.email,
        name: user.displayName || 'New User',
        role: 'student', // Default role for new sign-ups
      };
      await setDoc(userDocRef, userData);
    }
    
    // Set localStorage items needed for role-based access
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loggedInUser', userData.email);
    localStorage.setItem('isTutor', (userData.role === 'tutor').toString());
    localStorage.setItem('isAdmin', (userData.role === 'admin').toString());
    window.dispatchEvent(new Event('storage'));

    let destination = '/dashboard';
    if (userData.role === 'admin') destination = '/admin';
    if (userData.role === 'tutor') destination = '/tutor/dashboard';
    router.push(destination);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: 'Logged In!', description: 'Redirecting to your dashboard...' });
      await handleRedirect(userCredential.user);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handlePasswordReset = async () => {
    const email = form.getValues('email');
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Email Required',
        description: 'Please enter your email address to reset your password.',
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your inbox for instructions to reset your password.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      toast({ title: 'Logged In with Google!', description: 'Redirecting...' });
      await handleRedirect(result.user);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message,
      });
    }
  };
  
  const setupRecaptcha = () => {
    // This function might be called multiple times, so we need to clear previous instances
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
  }

  const onPhoneSignIn = async () => {
    setIsLoading(true);
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
        const result = await signInWithPhoneNumber(auth, phone, appVerifier);
        setConfirmationResult(result);
        toast({ title: 'OTP Sent!', description: 'Please check your phone for the verification code.' });
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Phone Sign-In Failed',
            description: error.message,
        });
    } finally {
        setIsLoading(false);
    }
  };

  const onOTPSubmit = async () => {
    setIsLoading(true);
    if (!confirmationResult) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please request an OTP first.' });
        setIsLoading(false);
        return;
    }
    try {
        const result = await confirmationResult.confirm(otp);
        toast({ title: 'Logged In!', description: 'Redirecting...' });
        await handleRedirect(result.user);
    } catch(error: any) {
         toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: error.message,
        });
    } finally {
        setIsLoading(false);
        setShowPhoneDialog(false);
    }
  };


  return (
    <>
      <div id="recaptcha-container"></div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                  <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>
                      <button type="button" onClick={handlePasswordReset} className="text-sm font-medium text-primary hover:underline">
                          Forgot password?
                      </button>
                  </div>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log In
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
              <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
              Or continue with
              </span>
          </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={handleGoogleSignIn}>
              <GoogleIcon />
              Google
          </Button>
          <Button variant="outline" onClick={() => setShowPhoneDialog(true)}>
              <Phone className="mr-2" />
              Phone
          </Button>
      </div>
      </Form>
      
       <AlertDialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign In with Phone</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmationResult
                  ? "Enter the 6-digit OTP sent to your phone."
                  : "Please enter your phone number to receive a verification code."
                }
              </AlertDialogDescription>
            </AlertDialogHeader>

            {confirmationResult ? (
                 <div className="space-y-4">
                    <Input
                        type="text"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <Button onClick={onOTPSubmit} disabled={isLoading} className="w-full">
                         {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify OTP
                    </Button>
                 </div>
            ) : (
                <div className="space-y-4">
                    <Input
                        type="tel"
                        placeholder="+91 12345 67890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <Button onClick={onPhoneSignIn} disabled={isLoading} className="w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send OTP
                    </Button>
                </div>
            )}
            
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                  setConfirmationResult(null);
                  setIsLoading(false);
              }}>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </>
  );
}

// Add this to the global window interface
declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
    }
}
