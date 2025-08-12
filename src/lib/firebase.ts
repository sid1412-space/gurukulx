
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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
  measurementId: "G-7T5E62S1L5",
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const auth = getAuth(app);

export { app, auth };
