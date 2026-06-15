const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

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

async function checkBahasa() {
  try {
    const docSnap = await getDoc(doc(db, 'kurikulum_pusat', 'bahasa'));
    if (!docSnap.exists()) {
      console.log("bahasa not found!");
      return;
    }
    const data = docSnap.data();
    let bahasaPres = null;
    let bahasaPresName = "";
    if (data.subAreas && data.subAreas.length > 4) { // Let's check grammar
       for (const level of data.subAreas[4].levels || []) { // index 4 is lang_grammar
           if (level.presentation && level.presentation.steps && level.presentation.steps.length > 0) {
               bahasaPres = level.presentation;
               bahasaPresName = level.label;
               break;
           }
       }
    }
    console.log("=== BAHASA FORMAT ===");
    console.log("Name:", bahasaPresName);
    if (bahasaPres) {
      console.log(JSON.stringify(bahasaPres.steps, null, 2).substring(0, 1000) + '...');
    }
    process.exit(0);
  } catch (err) {
    console.error("Error reading database:", err);
    process.exit(1);
  }
}

checkBahasa();
