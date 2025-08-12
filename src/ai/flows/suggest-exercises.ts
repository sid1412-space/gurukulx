'use server';
/**
 * @fileOverview This file contains the logic for suggesting exercises to students based on their questions.
 *
 * - suggestExercises - A function that takes a student's question and returns a list of suggested exercises.
 * - SuggestExercisesInput - The input type for the suggestExercises function.
 * - SuggestExercisesOutput - The return type for the suggestExercises function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit/zod';

export const SuggestExercisesInputSchema = z.object({
  question: z.string().describe("The student's question or the topic they need help with."),
});
export type SuggestExercisesInput = z.infer<typeof SuggestExercisesInputSchema>;

export const SuggestExercisesOutputSchema = z.object({
  exercises: z.array(z.object({
    title: z.string().describe('A short, descriptive title for the exercise.'),
    description: z.string().describe('A longer description of the exercise, including the problem to solve.'),
  })).describe('A list of suggested exercises.'),
});
export type SuggestExercisesOutput = z.infer<typeof SuggestExercisesOutputSchema>;

export async function suggestExercises(
  input: SuggestExercisesInput,
): Promise<SuggestExercisesOutput> {
  return await suggestExercisesFlow(input);
}

const prompt = ai.definePrompt({
    name: 'suggestExercisesPrompt',
    input: { schema: SuggestExercisesInputSchema },
    output: { schema: SuggestExercisesOutputSchema },
    prompt: `You are a helpful tutor. A student has asked the following question: "{{question}}".

Based on this question, please suggest 3-5 practice exercises that would help them better understand the topic. The exercises should be relevant to the student's question and cover a range of difficulties.`,
});


const suggestExercisesFlow = ai.defineFlow(
  {
    name: 'suggestExercisesFlow',
    inputSchema: SuggestExercisesInputSchema,
    outputSchema: SuggestExercisesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
