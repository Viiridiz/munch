// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIWiStFRuHPt3ZZMWimvjmRDE6KW4I2u8",
  authDomain: "munch-a4980.firebaseapp.com",
  projectId: "munch-a4980",
  storageBucket: "munch-a4980.appspot.com",
  messagingSenderId: "702056234898",
  appId: "1:702056234898:web:c51a95f9a5b80690438b4b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize Firestore