import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyByRP1P2T_-dAIvdklNE1O4j5ZzbLDtIhI",
    authDomain: "career-and-skills-guidance-app.firebaseapp.com",
    projectId: "career-and-skills-guidance-app",
    storageBucket: "career-and-skills-guidance-app.firebasestorage.app",
    messagingSenderId: "950070773198",
    appId: "1:950070773198:web:1d7aee343a06c3867dd79f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
