
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Separator } from '../ui/separator';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { mockUsers, initializeMockData } from '@/lib/mock-data';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleRedirect = (user: any) => {
    initializeMockData();
    const users = JSON.parse(localStorage.getItem('userDatabase') || '[]');
    const loggedInUser = users.find((u: any) => u.email === user.email);

    let destination = '/dashboard'; // Default for students
    
    if (loggedInUser) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUser', loggedInUser.email);
        localStorage.setItem('isTutor', (loggedInUser.role === 'tutor').toString());
        localStorage.setItem('isAdmin', (loggedInUser.role === 'admin').toString());

        if(loggedInUser.role === 'admin') destination = '/admin';
        if(loggedInUser.role === 'tutor') destination = '/tutor/dashboard';
    } else {
         // This case handles new Google sign-ins that aren't in our mock DB
        const newUser = {
            id: `user_${Math.random().toString(36).substring(2, 9)}`,
            email: user.email,
            name: user.displayName || "New User",
            password: "social_login",
            role: "student",
            walletBalance: 1000
        };
        users.push(newUser);
        localStorage.setItem('userDatabase', JSON.stringify(users));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUser', newUser.email);
        localStorage.setItem('isTutor', 'false');
        localStorage.setItem('isAdmin', 'false');
    }

    // This makes sure other tabs know about the login status change
    window.dispatchEvent(new Event("storage"));
    router.push(destination);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: 'Logged In!', description: 'Redirecting to your dashboard...' });
      handleRedirect(userCredential.user);
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
      handleRedirect(result.user);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message,
      });
    }
  };

  return (
    <>
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

      <div className="grid grid-cols-1 gap-2">
          <Button variant="outline" onClick={handleGoogleSignIn}>
              <GoogleIcon />
              Google
          </Button>
      </div>
      </Form>
    </>
  );
}
