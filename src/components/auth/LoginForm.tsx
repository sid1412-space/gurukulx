
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

// Pre-defined users for initial setup
const predefinedUsers = [
    { email: 'quotesparkconnect@yahoo.com', role: 'admin' },
    { email: 'tutor@example.com', role: 'tutor' },
    { email: 'student@example.com', role: 'student' }
];

export default function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // On component mount, ensure the userDatabase exists in localStorage
  useEffect(() => {
    try {
        const usersJSON = localStorage.getItem('userDatabase');
        let users = usersJSON ? JSON.parse(usersJSON) : [];
        
        // Add predefined users if they don't already exist
        predefinedUsers.forEach(predefinedUser => {
            if (!users.some((u: any) => u.email === predefinedUser.email)) {
                users.push(predefinedUser);
            }
        });

        localStorage.setItem('userDatabase', JSON.stringify(users));
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
    
    // Mock API call
    setTimeout(() => {
      let userRole = 'student'; // Default role
      let foundUser = false;
      
      try {
        const usersJSON = localStorage.getItem('userDatabase');
        const users = usersJSON ? JSON.parse(usersJSON) : [];
        const user = users.find((u: any) => u.email.toLowerCase() === values.email.toLowerCase());

        if (user) {
            // In a real app, password would be checked here. We'll assume it's correct.
            userRole = user.role;
            foundUser = true;
        } else {
             // If user does not exist, we still log them in as a student.
             // This is for demonstration purposes.
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
        // Set flags in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        // Clear previous roles to ensure a clean state
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
        }
        
        // Notify other tabs about the login
        window.dispatchEvent(new Event("storage"));

        toast({
          title: 'Logged In!',
          description: `Redirecting to ${roleName} dashboard...`,
        });
        
        // Centralized redirection
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormLabel>Password</FormLabel>
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
    </Form>
  );
}
