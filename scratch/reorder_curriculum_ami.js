import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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
const auth = getAuth(app);
const db = getFirestore(app);

const targetGrammarOrder = [
  "Pengenalan Kata Benda (Noun)",
  "Pengenalan Artikel (Article)",
  "Kotak Tata Bahasa 2: Kata Benda dan Artikel (Grammar Box II)",
  "Pengenalan Kata Sifat (Adjective)",
  "Kotak Tata Bahasa 3: Kata Sifat (Grammar Box III)",
  "Pengenalan Kata Kerja (Verb)",
  "Kotak Tata Bahasa 4: Kata Kerja (Grammar Box IV)",
  "Pengenalan Preposisi (Preposition)",
  "Kotak Tata Bahasa 5: Preposisi (Grammar Box V)",
  "Pengenalan Kata Keterangan (Adverb)",
  "Kotak Tata Bahasa 6: Kata Keterangan (Grammar Box VI)",
  "Pengenalan Kata Ganti (Pronoun)",
  "Kotak Tata Bahasa 7: Kata Ganti (Grammar Box VII)",
  "Pengenalan Konjungsi (Conjunction)",
  "Kotak Tata Bahasa 8: Konjungsi (Grammar Box VIII)",
  "Pengenalan Interjeksi (Interjection)",
  "Kotak Tata Bahasa 9: Interjeksi (Grammar Box IX)",
  "Eksplorasi Waktu Kata Kerja / Lini Masa (Verb Tenses / Timeline of Verb)"
];

const targetMathSubAreaOrder = [
  "math_great_lessons",
  "math_decimal_gb",
  "math_stamp_game",
  "math_dot_game",
  "math_word_problems",
  "math_bead_cabinet",
  "math_memorization",
  "math_bead_frames",
  "math_hierarchical",
  "math_advanced_calculations",
  "math_passage_abstraction",
  "math_number_theory",
  "math_fractions",
  "math_measurement",
  "math_geometry"
];

const targetGeometryOrder = [
  "K1-K3: Bangun Ruang / Geometric Solids",
  "K1-K3: Kabinet Geometri / Geometric Cabinet",
  "K2-K3: Segitiga Konstruktif / Constructive Triangles",
  "K3: Batang Geometri / Geometric Sticks",
  "K2: Studi Garis (Types, Positions, Relations of Lines)",
  "K2-K3: Studi Sudut (Types, Measurement, Protractor)",
  "K3: Studi Segitiga Mendalam (7 Types of Triangles)",
  "K3-K4: Studi Segiempat (Quadrilaterals Nomenclature)",
  "K3-K4: Studi Poligon (Pentagon s.d Decagon Nomenclature)",
  "K4: Studi Lingkaran (Parts & Properties of Circle)",
  "K5-K6: Kekongruenan, Kesebangunan, Kesetaraan (Congruence, Similarity, Equivalence)",
  "K4-K5: Keliling & Luas (Perimeter & Area)",
  "K5-K6: Volume Bangun Ruang (Volume of Solids)"
];

async function reorderCurriculum() {
  try {
    console.log("Signing in with temporary admin account...");
    await signInWithEmailAndPassword(auth, "temp_admin@sditbudiluhursamarinda.sch.id", "temp_password_123");
    console.log("Authentication successful!\n");

    // ==========================================
    // 1. REORDER BAHASA INDONESIA
    // ==========================================
    console.log("=== 1. Reordering Bahasa Indonesia ===");
    const bahasaRef = doc(db, 'kurikulum_pusat', 'bahasa');
    const bahasaSnap = await getDoc(bahasaRef);
    if (!bahasaSnap.exists()) {
      throw new Error("Document 'kurikulum_pusat/bahasa' does not exist!");
    }
    const bahasaData = bahasaSnap.data();
    
    // Save backup locally
    writeFileSync('scratch/backup_bahasa_reorder.json', JSON.stringify(bahasaData, null, 2), 'utf8');
    console.log("Saved local backup of 'bahasa' to scratch/backup_bahasa_reorder.json");

    const subAreasBahasa = bahasaData.subAreas || [];
    const grammarSub = subAreasBahasa.find(sa => sa.id === 'lang_grammar');
    
    if (!grammarSub) {
      throw new Error("Sub-area 'lang_grammar' not found in Bahasa document!");
    }

    console.log(`Current levels count in lang_grammar: ${grammarSub.levels?.length}`);
    
    // Reorder lang_grammar levels
    const reorderedGrammarLevels = [];
    const remainingGrammarLevels = [...(grammarSub.levels || [])];

    targetGrammarOrder.forEach(label => {
      const idx = remainingGrammarLevels.findIndex(lvl => lvl.label === label);
      if (idx !== -1) {
        reorderedGrammarLevels.push(remainingGrammarLevels[idx]);
        remainingGrammarLevels.splice(idx, 1);
      } else {
        console.warn(`WARNING: Target grammar level label "${label}" not found in current document!`);
      }
    });

    if (remainingGrammarLevels.length > 0) {
      console.log(`Appending ${remainingGrammarLevels.length} extra grammar levels that were not in the target order list:`);
      remainingGrammarLevels.forEach(lvl => {
        console.log(`  - ${lvl.label}`);
        reorderedGrammarLevels.push(lvl);
      });
    }

    // Update grammar levels in data structure
    grammarSub.levels = reorderedGrammarLevels;
    console.log(`New levels count in lang_grammar: ${grammarSub.levels.length}`);
    console.log("Level order of lang_grammar successfully updated in-memory.");

    // Save back to Firestore
    await setDoc(bahasaRef, bahasaData);
    console.log("Updated 'kurikulum_pusat/bahasa' document successfully saved in Firestore!\n");


    // ==========================================
    // 2. REORDER MATEMATIKA
    // ==========================================
    console.log("=== 2. Reordering Matematika ===");
    const mathRef = doc(db, 'kurikulum_pusat', 'matematika');
    const mathSnap = await getDoc(mathRef);
    if (!mathSnap.exists()) {
      throw new Error("Document 'kurikulum_pusat/matematika' does not exist!");
    }
    const mathData = mathSnap.data();

    // Save backup locally
    writeFileSync('scratch/backup_matematika_reorder.json', JSON.stringify(mathData, null, 2), 'utf8');
    console.log("Saved local backup of 'matematika' to scratch/backup_matematika_reorder.json");

    const subAreasMath = mathData.subAreas || [];
    console.log(`Current subAreas count in Matematika: ${subAreasMath.length}`);

    // Reorder Matematika sub-areas
    const reorderedMathSubAreas = [];
    const remainingMathSubAreas = [...subAreasMath];

    targetMathSubAreaOrder.forEach(subId => {
      const idx = remainingMathSubAreas.findIndex(sa => sa.id === subId);
      if (idx !== -1) {
        reorderedMathSubAreas.push(remainingMathSubAreas[idx]);
        remainingMathSubAreas.splice(idx, 1);
      } else {
        console.warn(`WARNING: Target math sub-area ID "${subId}" not found in current document!`);
      }
    });

    if (remainingMathSubAreas.length > 0) {
      console.log(`Appending ${remainingMathSubAreas.length} extra math sub-areas that were not in the target order list:`);
      remainingMathSubAreas.forEach(sa => {
        console.log(`  - ${sa.id} (${sa.name})`);
        reorderedMathSubAreas.push(sa);
      });
    }

    mathData.subAreas = reorderedMathSubAreas;
    console.log(`New subAreas order of Matematika set (total ${mathData.subAreas.length} sub-areas).`);

    // Reorder levels inside math_geometry
    const geometrySub = mathData.subAreas.find(sa => sa.id === 'math_geometry');
    if (!geometrySub) {
      throw new Error("Sub-area 'math_geometry' not found in Matematika sub-areas!");
    }

    console.log(`Current levels count in math_geometry: ${geometrySub.levels?.length}`);
    
    const reorderedGeometryLevels = [];
    const remainingGeometryLevels = [...(geometrySub.levels || [])];

    targetGeometryOrder.forEach(label => {
      const idx = remainingGeometryLevels.findIndex(lvl => lvl.label === label);
      if (idx !== -1) {
        reorderedGeometryLevels.push(remainingGeometryLevels[idx]);
        remainingGeometryLevels.splice(idx, 1);
      } else {
        console.warn(`WARNING: Target geometry level label "${label}" not found in current document!`);
      }
    });

    if (remainingGeometryLevels.length > 0) {
      console.log(`Appending ${remainingGeometryLevels.length} extra geometry levels that were not in the target order list:`);
      remainingGeometryLevels.forEach(lvl => {
        console.log(`  - ${lvl.label}`);
        reorderedGeometryLevels.push(lvl);
      });
    }

    geometrySub.levels = reorderedGeometryLevels;
    console.log(`New levels count in math_geometry: ${geometrySub.levels.length}`);
    console.log("Level order of math_geometry successfully updated in-memory.");

    // Save back to Firestore
    await setDoc(mathRef, mathData);
    console.log("Updated 'kurikulum_pusat/matematika' document successfully saved in Firestore!\n");

    console.log("🎉 ALL CURRICULUM REORDERING COMPLETED SUCCESSFULLY!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

reorderCurriculum();
