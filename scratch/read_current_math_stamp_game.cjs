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

async function checkDb() {
  try {
    const docRef = doc(db, 'kurikulum_pusat', 'matematika');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log("Document not found!");
      return;
    }
    const currentData = docSnap.data();
    const stampSub = currentData.subAreas.find(sa => sa.id === 'math_stamp_game');
    if (stampSub) {
      console.log(`Found math_stamp_game levels: ${stampSub.levels.length}`);
      console.log(`First level label: ${stampSub.levels[0].label}`);
      console.log(`First level prerequisites: ${stampSub.levels[0].presentation?.prerequisites || 'none'}`);
      console.log(`First level steps count: ${stampSub.levels[0].presentation?.steps?.length || 0}`);
      
      const firstLevelSteps = stampSub.levels[0].presentation?.steps || [];
      console.log("Steps snippet from Firestore:");
      firstLevelSteps.slice(0, 10).forEach((s, i) => console.log(`  ${i+1}. ${s}`));
    } else {
      console.log("Sub-area math_stamp_game not found!");
    }
  } catch (err) {
    console.error("Error checking Firestore:", err);
  }
}

checkDb();
