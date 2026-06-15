const fs = require('fs');
const path = require('path');
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

async function inspectBahasa() {
  try {
    const docRef = doc(db, 'kurikulum_pusat', 'bahasa');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log("bahasa document not found!");
      return;
    }
    const data = docSnap.data();
    
    // Save a backup of the original bahasa document
    const backupPath = path.join(__dirname, 'backup_bahasa.json');
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Saved backup of 'bahasa' to: ${backupPath}`);
    
    console.log(`\nDocument: ${data.name} (${data.id})`);
    data.subAreas.forEach(sa => {
      console.log(`\n========================================`);
      console.log(`Sub-area: ${sa.id} (${sa.title})`);
      if (sa.levels) {
        console.log(`Levels count: ${sa.levels.length}`);
        sa.levels.forEach((l, idx) => {
          console.log(`  ${idx + 1}. [Grades: ${JSON.stringify(l.grades)}] ${l.label}`);
          if (l.presentation) {
            console.log(`     * Tool: ${l.presentation.tool || 'none'}`);
            console.log(`     * Steps: ${l.presentation.steps ? l.presentation.steps.length : 0} steps`);
          }
        });
      } else {
        console.log("  No levels defined.");
      }
    });
  } catch (err) {
    console.error("Error inspecting bahasa:", err);
  }
}

inspectBahasa();
