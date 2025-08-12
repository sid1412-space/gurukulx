
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

  // On component mount, ensure the userDatabase exists in localStorage
  useEffect(() => {
    try {
        const usersJSON = localStorage.getItem('userDatabase');
        if (!usersJSON) {
             const initialUsers = [
                { email: 'quotesparkconnect@yahoo.com', role: 'admin', name: 'Admin User' },
                { email: 'tutor@example.com', role: 'tutor', name: 'Dr. Evelyn Reed' }, 
                { email: 'student@example.com', role: 'student', name: 'Jane Doe' }
            ];
            localStorage.setItem('userDatabase', JSON.stringify(initialUsers));
        }

        const applicantsJSON = localStorage.getItem('tutorApplicants');
        if (!applicantsJSON) {
            localStorage.setItem('tutorApplicants', '[]');
        }

    } catch (error) {
        console.error("Could not initialize user database:", error);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    setTimeout(() => {
      let userRole = '';
      let foundUser = false;
      
      try {
        const usersJSON = localStorage.getItem('userDatabase');
        const users = usersJSON ? JSON.parse(usersJSON) : [];
        const user = users.find((u: any) => u.email.toLowerCase() === values.email.toLowerCase());

        if (user) {
            // In a real app, password would be checked here. We'll assume it's correct.
            userRole = user.role;
            foundUser = true;
        }

      } catch (error) {
          console.error("Error reading from user database:", error);
          toast({
              variant: 'destructive',
              title: 'Login Error',
              description: 'Could not verify credentials. Please try again.',
          });
          setIsLoading(false);
          return;
      }
      
      if (foundUser) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUser', values.email);
        
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isTutor');

        let destination = '/dashboard';
        let roleName = 'Student';

        if (userRole === 'admin') {
            localStorage.setItem('isAdmin', 'true');
            destination = '/admin';
            roleName = 'Admin';
        } else if (userRole === 'tutor') {
            localStorage.setItem('isTutor', 'true');
            destination = '/tutor/dashboard';
            roleName = 'Tutor';
        } else {
             // This branch is for students
             destination = '/dashboard';
             roleName = 'Student';
        }
        
        window.dispatchEvent(new Event("storage"));

        toast({
          title: 'Logged In!',
          description: `Redirecting to ${roleName} dashboard...`,
        });
        
        router.push(destination);
      } else {
         toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Invalid email or password.',
        });
        setIsLoading(false);
      }

    }, 1000);
  }

  return (
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
                    <Link href="#" className="text-sm font-medium text-primary hover:underline">
                        Forgot password?
                    </Link>
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
        <Button variant="outline">
            <GoogleIcon />
            Google
        </Button>
         <Button variant="outline">
            <Phone />
            Phone
        </Button>
     </div>

    </Form>
  );
}
