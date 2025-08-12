'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getExerciseSuggestions } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BrainCircuit, Loader2, BookOpen, AlertCircle, ExternalLink } from 'lucide-react';
import { type SuggestExercisesOutput } from '@/ai/flows/suggest-exercises';
import Link from 'next/link';

const suggestionSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters.'),
  studentLevel: z.enum(['beginner', 'intermediate', 'advanced']),
});

export default function AiTutor() {
  const [suggestions, setSuggestions] = useState<SuggestExercisesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof suggestionSchema>>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      topic: '',
      studentLevel: 'beginner',
    },
  });

  async function onSubmit(values: z.infer<typeof suggestionSchema>) {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    const result = await getExerciseSuggestions(values);

    if (result.success && result.data) {
      setSuggestions(result.data);
    } else {
      setError(result.error || 'An unexpected error occurred.');
    }
    setIsLoading(false);
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          AI Tutor Assistant
        </CardTitle>
        <CardDescription>Get exercise and resource suggestions for your student.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Photosynthesis" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Suggestions
            </Button>
          </form>
        </Form>
        <div className="flex-grow min-h-0">
          <ScrollArea className="h-full">
            <div className="space-y-4 pr-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {suggestions?.exercises && suggestions.exercises.length > 0 && (
                <div className="space-y-4">
                  {suggestions.exercises.map((exercise, index) => (
                    <Card key={index} className="bg-secondary/50">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center justify-between">
                            <span className='flex items-center gap-2'>
                                <BookOpen className="h-4 w-4" />
                                {exercise.title}
                            </span>
                            <Link href={exercise.resourceLink} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon" className='h-7 w-7'>
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">{exercise.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {!isLoading && !error && !suggestions && (
                  <div className="text-center text-muted-foreground pt-10">
                    <p>Suggestions will appear here.</p>
                  </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
