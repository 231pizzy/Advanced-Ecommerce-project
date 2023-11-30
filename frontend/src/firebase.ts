// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "shopeazy-3ace4.firebaseapp.com",
  projectId: "shopeazy-3ace4",
  storageBucket: "shopeazy-3ace4.appspot.com",
  messagingSenderId: "980045332541",
  appId: "1:980045332541:web:86668324d40129c4922a54",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
