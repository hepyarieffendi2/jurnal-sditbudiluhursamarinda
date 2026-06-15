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

async function verifyMigration() {
  try {
    console.log("Fetching Bahasa document from Firestore for verification...");
    const docRef = doc(db, 'kurikulum_pusat', 'bahasa');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error("Verification failed: Document 'kurikulum_pusat/bahasa' does not exist!");
      process.exit(1);
    }
    
    const data = docSnap.data();
    const subAreas = data.subAreas || [];
    
    console.log(`\nFound ${subAreas.length} sub-areas total.`);
    
    // Core Bahasa Indonesia subareas we expect
    const expectedBI = [
      "lang_great_lessons",
      "lang_reading_foundation",
      "lang_spoken",
      "lang_word_study",
      "lang_grammar",
      "lang_analysis",
      "lang_literature",
      "lang_write"
    ];
    
    // English subareas we expect to remain
    const expectedEN = [
      "lang_eng_word_study",
      "lang_eng_write",
      "lang_eng_literature"
    ];
    
    let errors = 0;
    
    expectedBI.forEach(id => {
      const sa = subAreas.find(s => s.id === id);
      if (!sa) {
        console.error(`❌ Missing expected Bahasa Indonesia subarea: ${id}`);
        errors++;
      } else {
        console.log(`✅ Subarea: ${sa.name} (${sa.id}) - ${sa.levels?.length || 0} levels`);
        // Check levels have empty/safe presentation
        sa.levels.forEach(lvl => {
          if (!lvl.presentation) {
            console.error(`   ❌ Level "${lvl.label}" is missing the presentation object!`);
            errors++;
          } else if (!lvl.presentation.steps || lvl.presentation.steps.length === 0) {
            console.error(`   ❌ Level "${lvl.label}" is missing presentation steps!`);
            errors++;
          } else {
            console.log(`   ✅ Level "${lvl.label}" has ${lvl.presentation.steps.length} steps`);
          }
        });
      }
    });
    
    expectedEN.forEach(id => {
      const sa = subAreas.find(s => s.id === id);
      if (!sa) {
        console.error(`❌ Missing English subarea: ${id}`);
        errors++;
      } else {
        console.log(`✅ (Untouched) English Subarea: ${sa.name || sa.title} (${sa.id}) - ${sa.levels?.length || 0} levels`);
      }
    });
    
    if (errors === 0) {
      console.log("\n🎉 MIGRATION VERIFICATION SUCCESSFUL! No errors found.");
      process.exit(0);
    } else {
      console.error(`\n❌ Verification failed with ${errors} errors.`);
      process.exit(1);
    }
  } catch (err) {
    console.error("Verification script failed:", err);
    process.exit(1);
  }
}

verifyMigration();
