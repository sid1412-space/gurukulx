'use server';

import { suggestExercises, type SuggestExercisesInput } from '@/ai/flows/suggest-exercises';

export async function getExerciseSuggestions(input: SuggestExercisesInput) {
  try {
    const result = await suggestExercises(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('AI suggestion failed:', error);
    if (error instanceof Error) {
        return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred while getting suggestions.' };
  }
}
