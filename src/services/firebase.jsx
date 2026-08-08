// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEIjIF6urGIVLDk1SjPuKYrxhwu5VSoj4",
  authDomain: "clinic-management-system-c98ba.firebaseapp.com",
  projectId: "clinic-management-system-c98ba",
  storageBucket: "clinic-management-system-c98ba.firebasestorage.app",
  messagingSenderId: "169871935153",
  appId: "1:169871935153:web:fc55a0b298ccde5fd58490"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
