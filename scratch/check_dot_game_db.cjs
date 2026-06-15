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

async function checkDotGame() {
  try {
    const docRef = doc(db, 'kurikulum_pusat', 'matematika');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return;
    const currentData = docSnap.data();
    const dotSub = currentData.subAreas.find(sa => sa.id === 'math_dot_game');
    
    if (dotSub) {
      console.log(`Found math_dot_game levels: ${dotSub.levels.length}`);
      console.log(`Level 1 label: ${dotSub.levels[0].label}`);
      console.log(`Level 1 tool: ${dotSub.levels[0].presentation?.tool || 'none'}`);
      console.log(`Level 1 prerequisites: ${dotSub.levels[0].presentation?.prerequisites || 'none'}`);
      console.log(`Level 1 steps count: ${dotSub.levels[0].presentation?.steps?.length || 0}`);
      if (dotSub.levels[0].presentation?.steps?.length > 10) {
        console.log("SUCCESS: Data matches the new updated version!");
      } else {
        console.log("STALE: Data is still the old version.");
      }
    } else {
      console.log("Sub-area math_dot_game not found!");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

checkDotGame();
