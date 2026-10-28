// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCEIjIF6urGIVLDk1SjPuKYrxhwu5VSoj4",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "clinic-management-system-c98ba.firebaseapp.com",
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    "clinic-management-system-c98ba",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "clinic-management-system-c98ba.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "169871935153",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:169871935153:web:fc55a0b298ccde5fd58490",
};

/*
 * Firebase web configuration is public. Environment variables let each
 * deployment select its Firebase project without editing application code.
 */
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
