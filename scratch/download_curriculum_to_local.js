import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { writeFileSync, readFileSync } from 'fs';
import { AREA_SENTRA_CYCLE2 } from '../src/data/areaSentraCycle2.js';

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

async function downloadCurriculum() {
  try {
    console.log("Fetching all documents from 'kurikulum_pusat' collection...");
    const colRef = collection(db, 'kurikulum_pusat');
    const snapshot = await getDocs(colRef);
    
    const fetchedData = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    console.log(`Fetched ${fetchedData.length} documents.`);

    // Sort to maintain original AREA_SENTRA_CYCLE2 order
    const orderMap = {};
    AREA_SENTRA_CYCLE2.forEach((item, idx) => orderMap[item.id] = idx);
    fetchedData.sort((a, b) => (orderMap[a.id] ?? 99) - (orderMap[b.id] ?? 99));

    // Save a backup of the local areaSentraCycle2.js first
    const localContent = readFileSync('src/data/areaSentraCycle2.js', 'utf8');
    writeFileSync('scratch/backup_local_areaSentraCycle2.js', localContent, 'utf8');
    console.log("Saved backup of local areaSentraCycle2.js to scratch/backup_local_areaSentraCycle2.js");

    // Format and write the new file
    const newContent = `export const AREA_SENTRA_CYCLE2 = ${JSON.stringify(fetchedData, null, 2)};\n`;
    writeFileSync('src/data/areaSentraCycle2.js', newContent, 'utf8');
    console.log("Successfully updated src/data/areaSentraCycle2.js with current Firestore data!");

    process.exit(0);
  } catch (err) {
    console.error("Error downloading curriculum:", err);
    process.exit(1);
  }
}

downloadCurriculum();
