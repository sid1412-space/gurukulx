
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Separator } from '../ui/separator';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';


// Base schema for common fields
const baseSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const exams = {
  JEE: ['Physics', 'Chemistry', 'Mathematics'],
  NEET: ['Physics', 'Chemistry', 'Biology'],
} as const;

const allSubjects = [...new Set([...exams.JEE, ...exams.NEET])] as [string, ...string[]];

// Schema for the student
const studentSchema = baseSchema.extend({
  accountType: z.literal('student'),
});

// Schema for the tutor with additional required fields
const tutorSchema = baseSchema.extend({
  accountType: z.literal('tutor'),
  qualification: z.string().min(2, { message: 'Qualification is required.' }),
  phoneNumber: z.string().min(10, { message: 'A valid phone number is required.' }),
  college: z.string().optional(),
  location: z.string().optional(),
  experience: z.enum(['fresher', '1-2', '3-4', '5+'], { required_error: 'Experience is required.' }),
  exam: z.enum(['JEE', 'NEET'], { required_error: 'Please select an exam category.'}),
  expertise: z.enum(allSubjects, { required_error: 'Please select your primary subject.' }),
});

const formSchema = z.discriminatedUnion('accountType', [
  studentSchema,
  tutorSchema,
]);

const GoogleIcon = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25C22.56 11.42 22.49 10.62 22.36 9.84H12.27V14.4H18.16C17.88 15.72 17.15 16.85 16.08 17.59V20.31H19.79C21.66 18.59 22.56 15.71 22.56 12.25Z" fill="#4285F4"/>
        <path d="M12.27 23C15.22 23 17.7 22.03 19.31 20.61L16.08 17.59C15.04 18.33 13.78 18.75 12.27 18.75C9.55 18.75 7.23 16.94 6.39 14.4H2.58V17.22C4.34 20.72 8.01 23 12.27 23Z" fill="#34A853"/>
        <path d="M6.39 14.4C6.15 13.68 6.02 12.91 6.02 12.12C6.02 11.33 6.15 10.56 6.39 9.84V7.02H2.58C1.69 8.88 1.13 10.97 1.13 13.25C1.13 15.53 1.69 17.62 2.58 19.48L6.39 14.4Z" fill="#FBBC05"/>
        <path d="M12.27 5.25C13.84 5.25 15.1 5.81 16.01 6.67L19.38 3.3C17.7 1.74 15.22 1 12.27 1C8.01 1 4.34 3.28 2.58 6.78L6.39 9.84C7.23 7.06 9.55 5.25 12.27 5.25Z" fill="#EA4335"/>
    </svg>
);


export default function SignUpForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFromUrl = searchParams.get('role') === 'tutor' ? 'tutor' : 'student';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountType: roleFromUrl,
      name: '',
      email: '',
      password: '',
      ...(roleFromUrl === 'tutor' && {
        qualification: '',
        phoneNumber: '',
        experience: undefined,
        exam: undefined,
        expertise: undefined,
        college: '',
        location: '',
      })
    },
  });
  
  useEffect(() => {
    form.reset({
      accountType: roleFromUrl,
      name: '',
      email: '',
      password: '',
      ...(roleFromUrl === 'tutor' && {
        qualification: '',
        phoneNumber: '',
        experience: undefined,
        exam: undefined,
        expertise: undefined,
        college: '',
        location: '',
      })
    });
  }, [roleFromUrl, form]);


  const accountType = form.watch('accountType');
  const selectedExam = form.watch('exam' as 'exam'); 

  const handleSuccessfulSignup = (message: string) => {
    toast({ title: 'Account Created!', description: message });
    setTimeout(() => {
      setIsLoading(false);
      router.push('/login');
    }, 1500);
  };
  
  async function createFirestoreUserDocument(user: User, values: z.infer<typeof formSchema>) {
    const userRef = doc(db, "users", user.uid);
    if (values.accountType === 'student') {
        await setDoc(userRef, {
            uid: user.uid,
            name: values.name,
            email: values.email,
            role: 'student',
            walletBalance: 1000, // Starting balance
            createdAt: new Date().toISOString(),
        });
        handleSuccessfulSignup('Welcome to GurukulX. Please log in.');
    } else if (values.accountType === 'tutor') {
         await setDoc(userRef, {
            uid: user.uid,
            name: values.name,
            email: values.email,
            role: 'student', // Start as student, admin will approve
            walletBalance: 0,
            applicationStatus: 'Pending',
            applicationDetails: {
                qualification: values.qualification,
                phoneNumber: values.phoneNumber,
                experience: values.experience,
                exam: values.exam,
                expertise: values.expertise,
                college: values.college || '',
                location: values.location || '',
            },
            createdAt: new Date().toISOString(),
        });
        handleSuccessfulSignup('Your application is submitted! Please log in to continue.');
    }
  }


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        await createFirestoreUserDocument(userCredential.user, values);
    } catch (error: any) {
         toast({
            variant: 'destructive',
            title: 'Sign Up Error',
            description: error.code === 'auth/email-already-in-use' 
              ? 'This email is already in use. Please log in or use a different email.'
              : error.message,
        });
        setIsLoading(false);
    }
  }
  
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Check if user already exists in Firestore
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            // New user, create document
             await setDoc(userRef, {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                role: 'student',
                walletBalance: 1000,
                createdAt: new Date().toISOString(),
            });
        }
        
        handleSuccessfulSignup('Welcome to GurukulX. Please log in.');

    } catch (error: any) {
         toast({
            variant: 'destructive',
            title: 'Google Sign-Up Failed',
            description: error.message,
        });
        setIsLoading(false);
    }
  }

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="accountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>I am a...</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  const currentValues = form.getValues();
                  if (value === 'student') {
                    form.reset({
                      accountType: 'student',
                      name: currentValues.name,
                      email: currentValues.email,
                      password: currentValues.password,
                    });
                  } else {
                    form.reset({
                      accountType: 'tutor',
                      name: currentValues.name,
                      email: currentValues.email,
                      password: currentValues.password,
                      qualification: '',
                      phoneNumber: '',
                      experience: undefined,
                      exam: undefined,
                      expertise: undefined,
                      college: '',
                      location: '',
                    });
                  }
                }}
                defaultValue={field.value}
              >
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
                    <Input type="tel" placeholder="+91 12345 67890" {...field} />
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
                    <Input placeholder="e.g., Indian Institute of Technology" {...field} />
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
                    <Input placeholder="e.g., New Delhi, India" {...field} />
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
                name="exam"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Exam Category</FormLabel>
                        <Select onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue('expertise', undefined); // Reset subject on exam change
                        }} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an exam category" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="JEE">JEE (Engineering)</SelectItem>
                                <SelectItem value="NEET">NEET (Medical)</SelectItem>
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
                    <FormLabel>Primary Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!selectedExam}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your main subject of expertise" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {(selectedExam ? exams[selectedExam] : []).map(subject => (
                             <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                           ))}
                        </SelectContent>
                    </Select>
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
      
       <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
              <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
              Or sign up with
              </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" onClick={handleGoogleSignUp} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <GoogleIcon />
                Google
            </Button>
        </div>

    </Form>
    </>
  );
}
