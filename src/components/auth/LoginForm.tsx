
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

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

// Mock user database
const users = [
    { email: 'quotesparkconnect@yahoo.com', role: 'admin' },
    { email: 'tutor@example.com', role: 'tutor' },
    { email: 'student@example.com', role: 'student' }
]

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    // Mock API call
    setTimeout(() => {
      const user = users.find(u => u.email.toLowerCase() === values.email.toLowerCase()) || { role: 'student' }; // Default to student
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('isTutor');

      let destination = '/dashboard';
      let userRole = 'dashboard';

      if (user.role === 'admin') {
          localStorage.setItem('isAdmin', 'true');
          destination = '/admin';
          userRole = 'admin panel';
      } else if (user.role === 'tutor') {
          localStorage.setItem('isTutor', 'true');
          destination = '/tutor/dashboard';
          userRole = 'tutor dashboard';
      }
      
      window.dispatchEvent(new Event("storage"));

      toast({
        title: 'Logged In!',
        description: `Redirecting to your ${userRole}...`,
      });
      
      router.push(destination);

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
