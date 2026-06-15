const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

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

const passwords = [
  "123456",
  "admin123",
  "password",
  "budiluhur",
  "samarinda",
  "sditbudiluhur",
  "adminbudiluhur",
  "kurikulum",
  "kurikulum123",
  "bismillah",
  "bismillah123"
];

async function tryLogins() {
  const email = "admin@sditbudiluhursamarinda.sch.id";
  for (const pw of passwords) {
    try {
      console.log(`Trying ${email} with password: "${pw}"...`);
      const userCred = await signInWithEmailAndPassword(auth, email, pw);
      console.log(`🎉 SUCCESS! Password is: "${pw}"`);
      console.log(`UID: ${userCred.user.uid}`);
      process.exit(0);
    } catch (err) {
      // Failed, continue
    }
  }
  
  // Try guru email too
  const guruEmail = "guru@sditbudiluhursamarinda.sch.id";
  for (const pw of passwords) {
    try {
      console.log(`Trying ${guruEmail} with password: "${pw}"...`);
      const userCred = await signInWithEmailAndPassword(auth, guruEmail, pw);
      console.log(`🎉 SUCCESS! Password is: "${pw}"`);
      console.log(`UID: ${userCred.user.uid}`);
      process.exit(0);
    } catch (err) {
      // Failed, continue
    }
  }
  
  console.log("❌ All login attempts failed.");
  process.exit(1);
}

tryLogins();
