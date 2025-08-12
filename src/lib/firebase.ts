// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "tutorconnect-bu422",
  appId: "1:777250472770:web:0bd8cdd60ed6addaeabedb",
  storageBucket: "tutorconnect-bu422.firebasestorage.app",
  apiKey: "AIzaSyA1DS-jYNsAXp7JGY4YOBaJryt6aG3obYw",
  authDomain: "tutorconnect-bu422.firebaseapp.com",
  messagingSenderId: "777250472770",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
