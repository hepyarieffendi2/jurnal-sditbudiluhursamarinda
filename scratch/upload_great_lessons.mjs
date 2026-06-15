import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
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

async function run() {
    const areaData = AREA_SENTRA_CYCLE2.find(a => a.id === 'matematika');
    if (!areaData) {
        console.error("Data matematika tidak ditemukan di file lokal.");
        process.exit(1);
    }
    
    try {
        const docRef = doc(db, 'kurikulum_pusat', 'matematika');
        await setDoc(docRef, areaData);
        console.log("SUKSES: Area matematika berhasil diupload ke Firestore!");
        process.exit(0);
    } catch(e) {
        console.error("Gagal upload:", e);
        process.exit(1);
    }
}
run();
