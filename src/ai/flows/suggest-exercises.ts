// 'use server';

/**
 * @fileOverview AI tool to suggest learning exercises and resources during tutoring sessions.
 *
 * - suggestExercises - A function that suggests exercises and resources.
 * - SuggestExercisesInput - The input type for the suggestExercises function.
 * - SuggestExercisesOutput - The return type for the suggestExercises function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestExercisesInputSchema = z.object({
  topic: z.string().describe('The topic of the tutoring session.'),
  studentLevel: z
    .string()
    .describe('The student\u2019s current level of understanding.'),
});

export type SuggestExercisesInput = z.infer<typeof SuggestExercisesInputSchema>;

const SuggestExercisesOutputSchema = z.object({
  exercises: z.array(
    z.object({
      title: z.string().describe('The title of the exercise.'),
      description: z.string().describe('A brief description of the exercise.'),
      resourceLink: z.string().describe('A link to the resource.'),
    })
  ).describe('A list of suggested exercises and resources.'),
});

export type SuggestExercisesOutput = z.infer<typeof SuggestExercisesOutputSchema>;

export async function suggestExercises(
  input: SuggestExercisesInput
): Promise<SuggestExercisesOutput> {
  return suggestExercisesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestExercisesPrompt',
  input: {schema: SuggestExercisesInputSchema},
  output: {schema: SuggestExercisesOutputSchema},
  prompt: `You are an AI tutoring assistant. Your role is to suggest relevant learning exercises and resources to students during tutoring sessions.

  Consider the student's level of understanding and the topic being covered.

  Topic: {{{topic}}}
  Student Level: {{{studentLevel}}}

  Suggest a list of exercises and resources that will reinforce the student's understanding of the topic. Each object in the array should include the exercise title, a brief description, and a link to the resource.

  Output a JSON object containing an array of exercises and resources:
  `,
});

const suggestExercisesFlow = ai.defineFlow(
  {
    name: 'suggestExercisesFlow',
    inputSchema: SuggestExercisesInputSchema,
    outputSchema: SuggestExercisesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
