import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDRSSW3R0vKsFKnp98GsrtANEIA1hbF5WE",
  authDomain: "estate-ease-328c2.firebaseapp.com",
  projectId: "estate-ease-328c2",
  storageBucket: "estate-ease-328c2.firebasestorage.app",
  messagingSenderId: "828981028481",
  appId: "1:828981028481:web:466b24920046e03fd90f80"
};

// Initialize Firebase App instance synchronously
const app = initializeApp(firebaseConfig);

// Export Auth Context and Providers for OAuth Popup triggers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
