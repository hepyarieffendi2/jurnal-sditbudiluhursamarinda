import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { writeFileSync } from 'fs';

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

async function inspectStructure() {
  const docSnap = await getDoc(doc(db, 'kurikulum_pusat', 'bahasa'));
  const data = docSnap.data();
  
  console.log('=== TOP-LEVEL FIELDS ===');
  for (const [key, val] of Object.entries(data)) {
    if (key === 'subAreas') {
      console.log(`  ${key}: Array[${val.length}]`);
    } else {
      console.log(`  ${key}: ${JSON.stringify(val)}`);
    }
  }
  
  console.log('\n=== ALL SUB-AREA IDs AND LEVEL LABELS ===');
  data.subAreas.forEach(sub => {
    console.log(`\n[${sub.id}] ${sub.name} — ${sub.levels?.length || 0} levels`);
    sub.levels?.forEach((lvl, i) => {
      console.log(`  ${i+1}. ${lvl.label}`);
    });
  });

  writeFileSync('scratch/bahasa_structure_full.json', JSON.stringify(data, null, 2), 'utf8');
  console.log('\nFull structure saved to scratch/bahasa_structure_full.json');
  
  process.exit(0);
}

inspectStructure().catch(err => { console.error(err); process.exit(1); });
