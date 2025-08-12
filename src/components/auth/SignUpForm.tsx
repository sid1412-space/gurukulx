'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  accountType: z.enum(['student', 'tutor'], { required_error: 'Please select an account type.'}),
  qualification: z.string().optional(),
  phoneNumber: z.string().optional(),
  college: z.string().optional(),
  location: z.string().optional(),
  experience: z.string().optional(),
  expertise: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.accountType === 'tutor') {
        if (!data.qualification) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['qualification'],
                message: 'Qualification is required for tutors.',
            });
        }
        if (!data.phoneNumber) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['phoneNumber'],
                message: 'Phone number is required for tutors.',
            });
        }
         if (!data.experience) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['experience'],
                message: 'Experience is required for tutors.',
            });
        }
        if (!data.expertise) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['expertise'],
                message: 'Expertise is required for tutors.',
            });
        }
    }
});


export default function SignUpForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      qualification: '',
      phoneNumber: '',
      college: '',
      location: '',
      expertise: '',
    },
  });

  const accountType = form.watch('accountType');

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values);
    // Mock API call
    setTimeout(() => {
      toast({
        title: 'Account Created!',
        description: 'Welcome to TutorConnect. Please log in.',
      });
      setIsLoading(false);
      router.push('/login');
    }, 1500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="accountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>I am a...</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="tutor">Tutor</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
       
        {accountType === 'tutor' && (
           <>
              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Highest Qualification</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., B.Tech in Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1 234 567 890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="college"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., University of Example" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., New York, USA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teaching Experience</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fresher">Fresher</SelectItem>
                          <SelectItem value="1-2">1-2 years</SelectItem>
                          <SelectItem value="3-4">3-4 years</SelectItem>
                          <SelectItem value="5+">5+ years</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="expertise"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Expertise in Subjects</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="e.g., I specialize in advanced calculus and quantum mechanics for JEE preparation."
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
           </>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>
    </Form>
  );
}
