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

async function checkFormats() {
  try {
    const mathDoc = await getDoc(doc(db, 'kurikulum_pusat', 'math'));
    const bahasaDoc = await getDoc(doc(db, 'kurikulum_pusat', 'bahasa'));

    if (!mathDoc.exists() || !bahasaDoc.exists()) {
      console.log("Docs not found");
      return;
    }

    const mathData = mathDoc.data();
    const bahasaData = bahasaDoc.data();

    let beadGamePres = null;
    let stampGamePres = null;
    
    // Find bead game in math
    for (const sub of mathData.subAreas) {
      for (const level of sub.levels || []) {
        if (level.label.toLowerCase().includes('bead game') || level.label.toLowerCase().includes('permainan manik')) {
          beadGamePres = level.presentation;
        }
        if (level.label.toLowerCase().includes('stamp game') || level.label.toLowerCase().includes('permainan perangko')) {
          stampGamePres = level.presentation;
        }
      }
    }

    let bahasaPres = null;
    let bahasaPresName = "";
    if (bahasaData.subAreas && bahasaData.subAreas.length > 2) {
       for (const level of bahasaData.subAreas[2].levels || []) {
           if (level.presentation && level.presentation.steps && level.presentation.steps.length > 0) {
               bahasaPres = level.presentation;
               bahasaPresName = level.label;
               break;
           }
       }
    }

    console.log("=== BEAD GAME FORMAT ===");
    if (beadGamePres) {
      console.log(JSON.stringify(beadGamePres.steps, null, 2).substring(0, 500) + '...');
    } else {
      console.log("Bead game not found");
    }

    console.log("\n=== STAMP GAME FORMAT ===");
    if (stampGamePres) {
      console.log(JSON.stringify(stampGamePres.steps, null, 2).substring(0, 500) + '...');
    } else {
       console.log("Stamp game not found");
    }

    console.log("\n=== BAHASA PRESENTATION FORMAT ===");
    if (bahasaPres) {
      console.log("Name:", bahasaPresName);
      console.log(JSON.stringify(bahasaPres.steps, null, 2).substring(0, 1000) + '...');
    } else {
      console.log("Bahasa pres not found");
    }

  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

checkFormats();
