import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAughD2BEvzdtW0CNJf7BjtJSdkR-OVUUA",
    authDomain: "bilezik-app-baris.firebaseapp.com",
    projectId: "bilezik-app-baris",
    storageBucket: "bilezik-app-baris.firebasestorage.app",
    messagingSenderId: "840780303273",
    appId: "1:840780303273:web:dd3c3eb04f382379d592b8",
    measurementId: "G-XCHMPPJJT4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export default app;
