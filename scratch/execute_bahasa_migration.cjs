const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

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

// New Sub-areas and Levels Structure (AMI Bahasa Indonesia)
const targetSubAreas = [
  {
    id: "lang_great_lessons",
    name: "Sejarah Bahasa / History of Language",
    shortName: "History of Language",
    icon: "BookOpen",
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    levels: [
      { label: "Cerita Agung Keempat: Sejarah Tulisan (The Fourth Great Lesson: The Story of Writing)", defaultGrades: ["K1","K2","K3","K4","K5","K6"] },
      { label: "Eksplorasi Piktogram Prasejarah", defaultGrades: ["K1","K2","K3","K4","K5","K6"] },
      { label: "Eksplorasi Huruf Hieroglif dan Cuneiform", defaultGrades: ["K1","K2","K3","K4","K5","K6"] },
      { label: "Sejarah Penemuan Alfabet", defaultGrades: ["K1","K2","K3","K4","K5","K6"] }
    ]
  },
  {
    id: "lang_reading_foundation",
    name: "Fondasi Membaca Dasar (Transisi Casa) / Reading Foundation",
    shortName: "Reading Foundation",
    icon: "Compass",
    color: "#10B981",
    bgColor: "#ECFDF5",
    levels: [
      { label: "Pengenalan Bunyi Huruf (Sandpaper Letters)", defaultGrades: ["K1","K2"] },
      { label: "Menyusun Kata Bersama Papan Alfabet Bergerak (Movable Alphabet)", defaultGrades: ["K1"] },
      { label: "Seri Merah Muda / Pink Series (Membaca Fonetik Dasar / Suku Kata Terbuka)", defaultGrades: ["K1"] },
      { label: "Seri Biru / Blue Series (Membaca Konsonan Ganda / Suku Kata Tertutup)", defaultGrades: ["K1"] },
      { label: "Seri Hijau / Green Series (Membaca Fonogram / Bunyi Khusus dan Pengecualian)", defaultGrades: ["K1"] }
    ]
  },
  {
    id: "lang_spoken",
    name: "Bahasa Lisan / Spoken Language",
    shortName: "Spoken Language",
    icon: "MessageSquare",
    color: "#AF52DE",
    bgColor: "#F5EBFA",
    levels: [
      { label: "Diskusi Kelompok (Discussion)", defaultGrades: ["K4","K5"] },
      { label: "Laporan Lisan (Oral Reports)", defaultGrades: ["K3"] },
      { label: "Pidato (Speeches / Oratory)", defaultGrades: ["K5","K6"] },
      { label: "Debat (Debates)", defaultGrades: ["K4","K5"] },
      { label: "Pembacaan Puisi & Deklamasi (Poetry Reading)", defaultGrades: ["K2","K3"] },
      { label: "Dialog & Percakapan (Dialogue)", defaultGrades: ["K2","K3"] },
      { label: "Wawancara (Interviews)", defaultGrades: ["K3","K4"] }
    ]
  },
  {
    id: "lang_word_study",
    name: "Studi Kata / Word Study",
    shortName: "Word Study",
    icon: "Layers",
    color: "#F59E0B",
    bgColor: "#FEF3C7",
    levels: [
      { label: "Pengenalan Kata Majemuk (Compound Words)", defaultGrades: ["K2","K3"] },
      { label: "Rumpun Kata (Word Families)", defaultGrades: ["K1","K2"] },
      { label: "Pengenalan Awalan (Prefixes)", defaultGrades: ["K2","K3"] },
      { label: "Pengenalan Akhiran (Suffixes)", defaultGrades: ["K2","K3"] },
      { label: "Pengenalan Tunggal dan Jamak (Singular & Plural)", defaultGrades: ["K1","K2"] },
      { label: "Pengenalan Sinonim (Synonyms)", defaultGrades: ["K2","K3"] },
      { label: "Pengenalan Antonim (Antonyms)", defaultGrades: ["K2","K3"] },
      { label: "Pengenalan Homonim dan Homograf (Homonyms & Homographs)", defaultGrades: ["K3"] },
      { label: "Eksplorasi Etimologi dan Asal-usul Kata (Etymology)", defaultGrades: ["K4","K5"] }
    ]
  },
  {
    id: "lang_grammar",
    name: "Tata Bahasa / Functional Grammar",
    shortName: "Functional Grammar",
    icon: "Hash",
    color: "#EF4444",
    bgColor: "#FEF2F2",
    levels: [
      { label: "Pengenalan Kata Benda (Noun)", defaultGrades: ["K1","K2"] },
      { label: "Pengenalan Artikel (Article)", defaultGrades: ["K1","K2"] },
      { label: "Pengenalan Kata Sifat (Adjective)", defaultGrades: ["K2","K3"] },
      { label: "Pengenalan Kata Kerja (Verb)", defaultGrades: ["K1","K2"] },
      { label: "Pengenalan Preposisi (Preposition)", defaultGrades: ["K3"] },
      { label: "Pengenalan Kata Keterangan (Adverb)", defaultGrades: ["K2","K3"] },
      { label: "Pengenalan Kata Ganti (Pronoun)", defaultGrades: ["K3"] },
      { label: "Pengenalan Konjungsi (Conjunction)", defaultGrades: ["K3"] },
      { label: "Pengenalan Interjeksi (Interjection)", defaultGrades: ["K3"] },
      { label: "Kotak Tata Bahasa 2: Kata Benda dan Artikel (Grammar Box II)", defaultGrades: ["K1","K2"] },
      { label: "Kotak Tata Bahasa 3: Kata Sifat (Grammar Box III)", defaultGrades: ["K1","K2"] },
      { label: "Kotak Tata Bahasa 4: Kata Kerja (Grammar Box IV)", defaultGrades: ["K1","K2"] },
      { label: "Kotak Tata Bahasa 5: Preposisi (Grammar Box V)", defaultGrades: ["K2","K3"] },
      { label: "Kotak Tata Bahasa 6: Kata Keterangan (Grammar Box VI)", defaultGrades: ["K2","K3"] },
      { label: "Kotak Tata Bahasa 7: Kata Ganti (Grammar Box VII)", defaultGrades: ["K2","K3"] },
      { label: "Kotak Tata Bahasa 8: Konjungsi (Grammar Box VIII)", defaultGrades: ["K3"] },
      { label: "Kotak Tata Bahasa 9: Interjeksi (Grammar Box IX)", defaultGrades: ["K3"] },
      { label: "Eksplorasi Waktu Kata Kerja / Lini Masa (Verb Tenses / Timeline of Verb)", defaultGrades: ["K2","K3"] }
    ]
  },
  {
    id: "lang_analysis",
    name: "Analisis Kalimat / Sentence Analysis",
    shortName: "Sentence Analysis",
    icon: "GitBranch",
    color: "#6366F1",
    bgColor: "#EEF2FF",
    levels: [
      { label: "Pengenalan Predikat dan Subjek (Predicate and Subject)", defaultGrades: ["K2","K3"] },
      { label: "Klasifikasi Kata Kerja Transitif dan Intransitif", defaultGrades: ["K3"] },
      { label: "Pengenalan Objek Langsung (Direct Object)", defaultGrades: ["K2","K3"] },
      { label: "Pengenalan Objek Tidak Langsung (Indirect Object)", defaultGrades: ["K3","K4"] },
      { label: "Pengenalan Keterangan / Adverbial (Adverbial Modifiers)", defaultGrades: ["K3"] },
      { label: "Analisis Kalimat Aktif dan Pasif (Active and Passive Voice)", defaultGrades: ["K3"] },
      { label: "Analisis Kalimat Majemuk (Compound Sentences)", defaultGrades: ["K5","K6"] },
      { label: "Analisis Klausa Utama dan Klausa Bawahan (Main and Subordinate Clauses)", defaultGrades: ["K4","K5"] }
    ]
  },
  {
    id: "lang_literature",
    name: "Keterampilan Membaca & Sastra / Reading & Literature",
    shortName: "Reading & Literature",
    icon: "Feather",
    color: "#EC4899",
    bgColor: "#FDF2F8",
    levels: [
      { label: "Aturan Penggunaan Tanda Baca (Punctuation)", defaultGrades: ["K2","K3"] },
      { label: "Aturan Penggunaan Huruf Kapital (Capitalization)", defaultGrades: ["K1","K2"] },
      { label: "Permainan Perintah Membaca (Reading Command Cards)", defaultGrades: ["K1","K2"] },
      { label: "Analisis Unsur Intrinsik Cerita (Tokoh, Latar, Alur, Tema)", defaultGrades: ["K3"] },
      { label: "Pengenalan Majas Dasar / Gaya Bahasa (Figures of Speech)", defaultGrades: ["K3"] }
    ]
  },
  {
    id: "lang_write",
    name: "Komposisi & Ekspresi Tulisan / Written Expression",
    shortName: "Written Expression",
    icon: "PenTool",
    color: "#14B8A6",
    bgColor: "#F0FDFA",
    levels: [
      { label: "Menulis Kalimat dan Paragraf Sederhana (Writing a Paragraph)", defaultGrades: ["K2","K3"] },
      { label: "Menulis Jurnal Harian (Journaling)", defaultGrades: ["K3"] },
      { label: "Menulis Surat Formal dan Informal (Writing a Letter)", defaultGrades: ["K2","K3"] },
      { label: "Menulis Laporan Proyek atau Penelitian (Writing a Research Report)", defaultGrades: ["K3"] },
      { label: "Penulisan Kreatif / Mengarang Cerita Fiksi (Creative Writing)", defaultGrades: ["K2","K3"] }
    ]
  }
];

// Flat DB Level matcher rules
function findDbMatch(userLabel, dbBI) {
  const lower = userLabel.toLowerCase();
  
  for (const sa of dbBI) {
    if (!sa.levels) continue;
    for (const lvl of sa.levels) {
      const dbLabelLower = lvl.label.toLowerCase();
      
      // Explicit rules
      if (lower.includes("sandpaper letters") && dbLabelLower.includes("sandpaper") && dbLabelLower.includes("cursive")) return lvl;
      if (lower.includes("movable alphabet") && (dbLabelLower.includes("movable alphabet") || dbLabelLower.includes("alphabet bergerak"))) return lvl;
      if (lower.includes("sejarah tulisan") && dbLabelLower.includes("sejarah tulisan")) return lvl;
      if (lower.includes("kata majemuk") && dbLabelLower.includes("kata majemuk")) return lvl;
      if (lower.includes("sinonim") && dbLabelLower.includes("sinonim")) return lvl;
      if (lower.includes("antonim") && dbLabelLower.includes("antonim")) return lvl;
      if (lower.includes("homonim") && dbLabelLower.includes("homonim")) return lvl;
      if (lower.includes("awalan") && dbLabelLower.includes("imbuhan")) return lvl;
      if (lower.includes("akhiran") && dbLabelLower.includes("imbuhan")) return lvl;
      if (lower.includes("kata benda") && dbLabelLower.includes("kata benda")) return lvl;
      if (lower.includes("artikel") && dbLabelLower.includes("kata sandang")) return lvl;
      if (lower.includes("kata sifat") && dbLabelLower.includes("kata sifat")) return lvl;
      if (lower.includes("kata kerja") && dbLabelLower.includes("kata kerja")) return lvl;
      if (lower.includes("preposisi") && dbLabelLower.includes("preposisi")) return lvl;
      if (lower.includes("kata keterangan") && dbLabelLower.includes("kata keterangan")) return lvl;
      if (lower.includes("kata ganti") && dbLabelLower.includes("kata ganti")) return lvl;
      if (lower.includes("konjungsi") && dbLabelLower.includes("kata sambung")) return lvl;
      if (lower.includes("interjeksi") && dbLabelLower.includes("kata seru")) return lvl;
      
      if (lower.includes("kotak tata bahasa 2") && dbLabelLower.includes("grammar box ii")) return lvl;
      if (lower.includes("kotak tata bahasa 3") && dbLabelLower.includes("grammar box iii")) return lvl;
      if (lower.includes("kotak tata bahasa 4") && dbLabelLower.includes("grammar box iv")) return lvl;
      if (lower.includes("kotak tata bahasa 5") && dbLabelLower.includes("grammar box v")) return lvl;
      if (lower.includes("kotak tata bahasa 6") && dbLabelLower.includes("grammar box vi")) return lvl;
      if (lower.includes("kotak tata bahasa 7") && dbLabelLower.includes("grammar box vii")) return lvl;
      if (lower.includes("kotak tata bahasa 8") && dbLabelLower.includes("grammar box viii")) return lvl;
      if (lower.includes("kotak tata bahasa 9") && dbLabelLower.includes("grammar box ix")) return lvl;
      
      if (lower.includes("predikat dan subjek") && dbLabelLower.includes("subject & predicate")) return lvl;
      if (lower.includes("transitif dan intransitif") && dbLabelLower.includes("transitive & intransitive")) return lvl;
      if (lower.includes("objek langsung") && dbLabelLower.includes("direct object")) return lvl;
      if (lower.includes("keterangan / adverbial") && dbLabelLower.includes("perluasan keterangan")) return lvl;
      if (lower.includes("kalimat aktif dan pasif") && dbLabelLower.includes("aktif & pasif")) return lvl;
      if (lower.includes("kalimat majemuk") && dbLabelLower.includes("diagramming & struktur sintaksis kompleks")) return lvl;
      if (lower.includes("klausa utama dan klausa bawahan") && dbLabelLower.includes("analisis logis anak kalimat")) return lvl;
      
      if (lower.includes("unsur intrinsik") && dbLabelLower.includes("analisis karakter & plot")) return lvl;
      if (lower.includes("puisi") && dbLabelLower.includes("puisi")) return lvl;
      if (lower.includes("gaya bahasa") && dbLabelLower.includes("gaya bahasa")) return lvl;
      if (lower.includes("jurnal harian") && dbLabelLower.includes("jurnal refleksi")) return lvl;
      if (lower.includes("surat") && dbLabelLower.includes("menulis surat")) return lvl;
      if (lower.includes("laporan proyek") && dbLabelLower.includes("laporan penelitian")) return lvl;
      if (lower.includes("kreatif") && dbLabelLower.includes("menulis kreatif")) return lvl;
      if (lower.includes("tunggal dan jamak") && dbLabelLower.includes("tunggal & jamak")) return lvl;
      if (lower.includes("etimologi") && dbLabelLower.includes("etimologi")) return lvl;
    }
  }
  return null;
}

async function migrateBahasa() {
  try {
    const docRef = doc(db, 'kurikulum_pusat', 'bahasa');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error("Document 'kurikulum_pusat/bahasa' not found!");
      process.exit(1);
    }
    
    const data = docSnap.data();
    
    // Save backup first
    fs.writeFileSync(
      path.join(__dirname, 'backup_bahasa_before_restruct.json'),
      JSON.stringify(data, null, 2),
      'utf8'
    );
    console.log("Saved backup to scratch/backup_bahasa_before_restruct.json");
    
    // Extract Indonesian language sub-areas
    const dbBI = data.subAreas.filter(sa => 
      ['lang_great_lessons', 'lang_spoken', 'lang_word_study', 'lang_grammar', 'lang_analysis', 'lang_write', 'lang_literature'].includes(sa.id)
    );
    
    // Extract English language subareas to keep them untouched
    const englishSubAreas = data.subAreas.filter(sa => 
      ['lang_eng_word_study', 'lang_eng_write', 'lang_eng_literature'].includes(sa.id)
    );
    
    // Create new subAreas list
    const newSubAreas = [];
    
    targetSubAreas.forEach(targetSa => {
      console.log(`Processing subarea: ${targetSa.name} (${targetSa.id})`);
      const levels = targetSa.levels.map(targetLvl => {
        // Find if this level existed in the previous DB
        const match = findDbMatch(targetLvl.label, dbBI);
        const grades = match ? match.grades : targetLvl.defaultGrades;
        
        // Construct clean empty presentation template to avoid UI crash
        const presentation = {
          tool: "",
          toolDisplay: "",
          toolsList: [],
          prerequisites: "",
          directAim: "",
          indirectAim: "",
          error: "",
          steps: [],
          videoUrl: ""
        };
        
        return {
          label: targetLvl.label,
          grades: grades,
          presentation: presentation
        };
      });
      
      newSubAreas.push({
        id: targetSa.id,
        name: targetSa.name,
        shortName: targetSa.shortName,
        icon: targetSa.icon,
        color: targetSa.color,
        bgColor: targetSa.bgColor,
        levels: levels
      });
    });
    
    // Append the untouched English sub-areas
    newSubAreas.push(...englishSubAreas);
    
    // Construct new curriculum document object
    const newDocData = {
      ...data,
      subAreas: newSubAreas
    };
    
    // Save to Firestore
    console.log("Saving new structured document to Firestore...");
    await setDoc(docRef, newDocData);
    console.log("Restructuring successful! All new levels migrated and presentations stripped/initialized.");
    
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrateBahasa();
