'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { getExerciseSuggestions } from '@/lib/actions';
import { SuggestExercisesOutput } from '@/ai/flows/suggest-exercises';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


const formSchema = z.object({
  topic: z.string().min(5, 'Please enter a more specific topic.'),
});

export default function PracticePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestExercisesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestions(null);

    const result = await getExerciseSuggestions({ question: values.topic });

    if (result.success && result.data) {
      setSuggestions(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Exercises',
        description: result.error || 'An unexpected error occurred. Please try again.',
      });
    }

    setIsLoading(false);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <Wand2 className="text-primary h-8 w-8" />
          AI Practice Generator
        </h1>
        <p className="text-muted-foreground">
          Enter a topic you want to practice, and our AI will generate custom exercises for you.
        </p>
      </header>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Kinematics, Integration by Parts, Photosynthesis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
             <Card key={i}>
                <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
                </CardHeader>
                <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                </CardContent>
            </Card>
          ))}
        </div>
      )}

      {suggestions && suggestions.exercises.length > 0 && (
         <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Your Practice Problems</h2>
            <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                 {suggestions.exercises.map((exercise, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                           {exercise.title}
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground whitespace-pre-wrap p-4">
                           {exercise.description}
                        </AccordionContent>
                    </AccordionItem>
                 ))}
            </Accordion>
         </div>
      )}

    </div>
  );
}
