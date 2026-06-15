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

async function inspectAll() {
  try {
    const docRef = doc(db, 'kurikulum_pusat', 'matematika');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log("Document not found");
      return;
    }
    const data = docSnap.data();
    console.log(`Successfully fetched 'matematika' document. Sub-areas count: ${data.subAreas ? data.subAreas.length : 0}`);
    
    data.subAreas.forEach(sa => {
      console.log(`\nSub-area: ${sa.id} (${sa.title})`);
      if (!sa.levels) return;
      sa.levels.forEach((lvl, lvlIdx) => {
        if (!lvl.presentation || !lvl.presentation.steps) return;
        lvl.presentation.steps.forEach((step, stepIdx) => {
          if (typeof step !== 'string') return;
          // Count occurrences of single quote
          const matches = step.match(/'/g);
          if (matches) {
            // Find if there is an odd number or if it looks like an apostrophe
            console.log(`  Level ${lvlIdx + 1} (${lvl.label}) - Step ${stepIdx + 1}: ${step}`);
          }
        });
      });
    });
  } catch (err) {
    console.error("Error inspecting database:", err);
  }
}

inspectAll();
