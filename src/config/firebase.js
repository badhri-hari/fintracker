// Importing the required functions from the Firebase npm package.
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Used for authentication purposes.
import { getFirestore } from "firebase/firestore"; // Enables connection to Firestore database.

// The product's Firebase configuration details which allows Firebase to identify the product.
// The contents of the configuration details are hidden as anyone can access the main console otherwise.
const firebaseConfig = {
  apiKey: "AIzaSyAoVJQ7keJQbrZwYN6ya-XlvTZfDJcYTRw",
  authDomain: "fintracker-backup.firebaseapp.com",
  projectId: "fintracker-backup",
  storageBucket: "fintracker-backup.appspot.com",
  messagingSenderId: "167765129914",
  appId: "1:167765129914:web:1f7654348598f2eb7a6083",
  measurementId: "G-XT4X0H6T6Q",
};

// Initializing application in Firebase
const app = initializeApp(firebaseConfig);

// Initializing Firebase's Google authentication provider.
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Initializing the application's Firestore database.
export const db = getFirestore(app);
