import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDdB_4nMoiFAHBiVOmdiStc04NEJGq4rb4",
  authDomain: "tutortrackai-spjni.firebaseapp.com",
  projectId: "tutortrackai-spjni",
  storageBucket: "tutortrackai-spjni.firebasestorage.app",
  messagingSenderId: "840717533673",
  appId: "1:840717533673:web:5ab2fa9fe9212167b50b78"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
