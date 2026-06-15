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

async function findApostrophes() {
  try {
    const docRef = doc(db, 'kurikulum_pusat', 'matematika');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return;
    const currentData = docSnap.data();
    const stampSub = currentData.subAreas.find(sa => sa.id === 'math_stamp_game');
    
    if (stampSub) {
      stampSub.levels.forEach((l, i) => {
        console.log(`\nLEVEL ${i + 1}: ${l.label}`);
        if (l.presentation && l.presentation.steps) {
          l.presentation.steps.forEach((s, stepIdx) => {
            // Find single quotes
            const matches = s.match(/'/g);
            if (matches) {
              console.log(`  Step ${stepIdx + 1}: ${s}`);
            }
          });
        }
      });
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

findApostrophes();
