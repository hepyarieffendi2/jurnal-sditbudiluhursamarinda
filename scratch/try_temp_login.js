import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAbh1AMSDPXcAlS7hfbo7tlAe14CGfZjuw",
    authDomain: "sditbudiluhursamarinda-cc15a.firebaseapp.com",
    projectId: "sditbudiluhursamarinda-cc15a",
    storageBucket: "sditbudiluhursamarinda-cc15a.firebasestorage.app",
    messagingSenderId: "795444212164",
    appId: "1:795444212164:web:ddf70f43dcb61548df3491",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testTempLogin() {
  try {
    const cred = await signInWithEmailAndPassword(auth, "temp_admin@sditbudiluhursamarinda.sch.id", "temp_password_123");
    console.log("LOGIN SUCCESSFUL! UID:", cred.user.uid);
  } catch (err) {
    console.error("LOGIN FAILED:", err.code, err.message);
  }
  process.exit(0);
}

testTempLogin();
