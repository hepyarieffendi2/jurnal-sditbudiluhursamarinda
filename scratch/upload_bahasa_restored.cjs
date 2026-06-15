const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');

const firebaseConfig = {
    apiKey: "AIzaSyAbh1AMSDPXcAlS7hfbo7tlAe14CGfZjuw",
    authDomain: "sditbudiluhursamarinda-cc15a.firebaseapp.com",
    projectId: "sditbudiluhursamarinda-cc15a",
    storageBucket: "sditbudiluhursamarinda-cc15a.firebasestorage.app",
    messagingSenderId: "795444212164",
    appId: "1:795444212164:web:ddf70f43dcb61548df3491",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadRestoredBahasa() {
  try {
    const data = JSON.parse(fs.readFileSync('scratch/bahasa_restored_format.json', 'utf8'));
    const docRef = doc(db, 'kurikulum_pusat', 'bahasa');
    await setDoc(docRef, data);
    console.log("Successfully uploaded restored Bahasa data to Firestore!");
    process.exit(0);
  } catch (err) {
    console.error("Error uploading to database:", err);
    process.exit(1);
  }
}

uploadRestoredBahasa();
