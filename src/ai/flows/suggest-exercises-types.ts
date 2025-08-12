/**
 * @fileOverview This file contains the type definitions for the suggest-exercises flow.
 *
 * - SuggestExercisesInput - The input type for the suggestExercises function.
 * - SuggestExercisesOutput - The return type for the suggestExercises function.
 * - SuggestExercisesInputSchema - The Zod schema for the input.
 * - SuggestExercisesOutputSchema - The Zod schema for the output.
 */

import {z} from 'zod';

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
