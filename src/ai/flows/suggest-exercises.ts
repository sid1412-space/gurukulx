'use server';
/**
 * @fileOverview This file contains the logic for suggesting exercises to students based on their questions.
 *
 * - suggestExercises - A function that takes a student's question and returns a list of suggested exercises.
 */

import {ai} from '@/ai/genkit';
import { 
  SuggestExercisesInputSchema,
  SuggestExercisesOutputSchema,
  type SuggestExercisesInput,
  type SuggestExercisesOutput
} from './suggest-exercises-types';

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
