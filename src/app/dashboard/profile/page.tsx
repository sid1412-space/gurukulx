
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useIsClient } from '@/hooks/use-is-client';
import { Skeleton } from '@/components/ui/skeleton';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email(),
  bio: z.string().max(300, 'Bio is too long').optional(),
  subjects: z.string().optional(),
});

export default function ProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isClient = useIsClient();

  const [currentUser, setCurrentUser] = useState({
    name: '',
    email: '',
    bio: '',
    subjects: '',
    avatar: 'https://placehold.co/128x128.png'
  });
  
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar);


  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: currentUser,
  });

  useEffect(() => {
    if (isClient) {
      const loggedInUserEmail = localStorage.getItem('loggedInUser');
      if (!loggedInUserEmail) return;

      const usersJSON = localStorage.getItem('userDatabase');
      if (usersJSON) {
        const users = JSON.parse(usersJSON);
        const student = users.find((u: any) => u.email === loggedInUserEmail);
        if (student) {
          const studentProfile = {
            name: student.name || '',
            email: student.email,
            bio: student.bio || '',
            subjects: student.subjects || '',
            avatar: student.avatar || 'https://placehold.co/128x128.png',
          };
          setCurrentUser(studentProfile);
          setAvatarPreview(studentProfile.avatar);
          form.reset(studentProfile);
        }
      }
    }
  }, [isClient, form]);

  
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


  function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    
    setTimeout(() => {
      if (isClient) {
        const loggedInUserEmail = localStorage.getItem('loggedInUser');
        if (!loggedInUserEmail) return;

        const usersJSON = localStorage.getItem('userDatabase');
        if (usersJSON) {
          const users = JSON.parse(usersJSON);
          const updatedUsers = users.map((u: any) => {
            if (u.email === loggedInUserEmail) {
              return { ...u, ...values, avatar: avatarPreview };
            }
            return u;
          });
          localStorage.setItem('userDatabase', JSON.stringify(updatedUsers));
          setCurrentUser(prev => ({...prev, ...values, avatar: avatarPreview}));
          window.dispatchEvent(new Event('storage')); // Notify header of name change
        }
      }
      
      toast({
        title: 'Profile Updated',
        description: 'Your information has been saved successfully.',
      });
      setIsLoading(false);
    }, 1000);
  }

  if (!isClient) {
    return (
      <div className="space-y-8 animate-fade-in">
        <header>
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="h-5 w-3/4 mt-2" />
        </header>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-1/4" />
            <Skeleton className="h-5 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <Skeleton className="h-10 w-28 rounded-md" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Manage Your Profile</h1>
        <p className="text-muted-foreground">Keep your personal information up to date.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your photo and personal details here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarPreview} alt={currentUser.name} data-ai-hint="person avatar"/>
                  <AvatarFallback>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <Input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>Change Photo</Button>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} readOnly disabled/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subjects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subjects of Interest / Expertise</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Math, Science, History" {...field} />
                    </FormControl>
                     <p className="text-sm text-muted-foreground">Separate subjects with commas.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
