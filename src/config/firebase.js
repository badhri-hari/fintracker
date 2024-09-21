// Importing the required functions from the Firebase npm package.
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Used for authentication purposes.
import { getFirestore } from "firebase/firestore"; // Enables connection to Firestore database.

// The product's Firebase configuration details which allows Firebase to identify the product.
// The contents of the configuration details are hidden as anyone can access the main console otherwise.
const firebaseConfig = {
  apiKey: "AIzaSyAfKVdXENFlmr-4TLn_KRSx33UlphJvDb4",
  authDomain: "fintracker-cs-ia.firebaseapp.com",
  projectId: "fintracker-cs-ia",
  storageBucket: "fintracker-cs-ia.appspot.com",
  messagingSenderId: "79161361996",
  appId: "1:79161361996:web:45c7ee0bd342a0cff316e9",
  measurementId: "G-2Z1F9L83R9",
};

// Initializing application in Firebase
const app = initializeApp(firebaseConfig);

// Initializing Firebase's Google authentication provider.
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Initializing the application's Firestore database.
export const db = getFirestore(app);
