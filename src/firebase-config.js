import { initializeApp } from 'firebase/app';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAbh1AMSDPXcAlS7hfbo7tlAe14CGfZjuw",
    authDomain: "sditbudiluhursamarinda-cc15a.firebaseapp.com",
    projectId: "sditbudiluhursamarinda-cc15a",
    storageBucket: "sditbudiluhursamarinda-cc15a.firebasestorage.app",
    messagingSenderId: "795444212164",
    appId: "1:795444212164:web:ddf70f43dcb61548df3491",
    measurementId: "G-TSZ3710KZ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);

let firestoreInstance;
try {
    firestoreInstance = initializeFirestore(app, {
        experimentalForceLongPolling: true,
    });
} catch (e) {
    firestoreInstance = getFirestore(app);
}

export const db = firestoreInstance;
export const storage = getStorage(app);

export default app;
