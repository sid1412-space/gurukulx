'use server';

import { suggestExercises } from '@/ai/flows/suggest-exercises';
import type { SuggestExercisesInput } from '@/ai/flows/suggest-exercises-types';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';


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

// New server action for creating a session request
export async function createSessionRequest(tutorId: string, studentId: string) {
  if (!tutorId || !studentId) {
    return { success: false, error: 'Tutor and student information is required.' };
  }
  try {
    const studentRef = doc(db, 'users', studentId);
    const studentSnap = await getDoc(studentRef);
    const studentName = studentSnap.exists() ? studentSnap.data().name : 'A Student';

    const requestDoc = await addDoc(collection(db, 'sessionRequests'), {
        tutorId: tutorId,
        studentId: studentId,
        studentName: studentName, 
        status: 'pending',
        createdAt: serverTimestamp()
    });

    return { success: true, data: { sessionRequestId: requestDoc.id } };

  } catch (error) {
     console.error('Session request creation failed:', error);
    if (error instanceof Error) {
        return { success: false, error: error.message };
    }
    return { success: false, error: 'Could not create session request.' };
  }
}