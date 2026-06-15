import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

async function verifyReordering() {
  let errors = 0;

  try {
    console.log("Fetching Bahasa document from Firestore...");
    const bahasaSnap = await getDoc(doc(db, 'kurikulum_pusat', 'bahasa'));
    if (!bahasaSnap.exists()) {
      console.error("❌ Bahasa document not found!");
      errors++;
    } else {
      const data = bahasaSnap.data();
      const grammarSub = (data.subAreas || []).find(sa => sa.id === 'lang_grammar');
      if (!grammarSub) {
        console.error("❌ lang_grammar sub-area not found in Bahasa doc!");
        errors++;
      } else {
        const levels = grammarSub.levels || [];
        console.log(`Verifying lang_grammar levels order (${levels.length} levels)...`);
        
        targetGrammarOrder.forEach((expectedLabel, idx) => {
          const actualLabel = levels[idx]?.label;
          if (actualLabel !== expectedLabel) {
            console.error(`❌ Grammar level mismatch at index ${idx}: expected "${expectedLabel}", got "${actualLabel}"`);
            errors++;
          }
        });
        
        if (errors === 0) {
          console.log("✅ Bahasa Grammar levels are ordered correctly!");
        }
      }
    }

    console.log("\nFetching Matematika document from Firestore...");
    const mathSnap = await getDoc(doc(db, 'kurikulum_pusat', 'matematika'));
    if (!mathSnap.exists()) {
      console.error("❌ Matematika document not found!");
      errors++;
    } else {
      const data = mathSnap.data();
      const subAreas = data.subAreas || [];
      console.log(`Verifying Matematika sub-areas order (${subAreas.length} sub-areas)...`);

      targetMathSubAreaOrder.forEach((expectedId, idx) => {
        const actualId = subAreas[idx]?.id;
        if (actualId !== expectedId) {
          console.error(`❌ Math sub-area mismatch at index ${idx}: expected "${expectedId}", got "${actualId}"`);
          errors++;
        }
      });

      const geometrySub = subAreas.find(sa => sa.id === 'math_geometry');
      if (!geometrySub) {
        console.error("❌ math_geometry sub-area not found in Matematika doc!");
        errors++;
      } else {
        const levels = geometrySub.levels || [];
        console.log(`Verifying math_geometry levels order (${levels.length} levels)...`);

        targetGeometryOrder.forEach((expectedLabel, idx) => {
          const actualLabel = levels[idx]?.label;
          if (actualLabel !== expectedLabel) {
            console.error(`❌ Geometry level mismatch at index ${idx}: expected "${expectedLabel}", got "${actualLabel}"`);
            errors++;
          }
        });
      }

      if (errors === 0) {
        console.log("✅ Matematika sub-areas and Geometry levels are ordered correctly!");
      }
    }

    console.log("\n==========================================");
    if (errors === 0) {
      console.log("🎉 VERIFICATION SUCCESS: All Firestore curriculum documents are aligned to AMI standard!");
      process.exit(0);
    } else {
      console.error(`❌ VERIFICATION FAILURE: Found ${errors} alignment errors.`);
      process.exit(1);
    }

  } catch (err) {
    console.error("❌ Verification execution error:", err);
    process.exit(1);
  }
}

verifyReordering();
