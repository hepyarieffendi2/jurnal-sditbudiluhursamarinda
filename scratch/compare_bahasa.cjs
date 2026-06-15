const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, 'backup_bahasa.json');
if (!fs.existsSync(backupPath)) {
  console.log("backup_bahasa.json not found!");
  process.exit(1);
}

const dbData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

// User's proposed structure
const userStructure = [
  {
    name: "Fondasi Membaca Dasar (Transisi Casa)",
    levels: [
      "Pengenalan Bunyi Huruf (Sandpaper Letters)",
      "Menyusun Kata Bersama Papan Alfabet Bergerak (Movable Alphabet)",
      "Seri Merah Muda / Pink Series (Membaca Fonetik Dasar / Suku Kata Terbuka)",
      "Seri Biru / Blue Series (Membaca Konsonan Ganda / Suku Kata Tertutup)",
      "Seri Hijau / Green Series (Membaca Fonogram / Bunyi Khusus dan Pengecualian)"
    ]
  },
  {
    name: "Sejarah Bahasa (History of Language)",
    levels: [
      "Cerita Agung Keempat: Sejarah Tulisan (The Fourth Great Lesson: The Story of Writing)",
      "Eksplorasi Piktogram Prasejarah",
      "Eksplorasi Huruf Hieroglif dan Cuneiform",
      "Sejarah Penemuan Alfabet"
    ]
  },
  {
    name: "Studi Kata (Word Study)",
    levels: [
      "Pengenalan Kata Majemuk (Compound Words)",
      "Rumpun Kata (Word Families)",
      "Pengenalan Awalan (Prefixes)",
      "Pengenalan Akhiran (Suffixes)",
      "Pengenalan Sinonim (Synonyms)",
      "Pengenalan Antonim (Antonyms)",
      "Pengenalan Homonim dan Homograf (Homonyms & Homographs)"
    ]
  },
  {
    name: "Tata Bahasa (Grammar / Parts of Speech)",
    levels: [
      "Pengenalan Kata Benda (Noun)",
      "Pengenalan Artikel (Article)",
      "Pengenalan Kata Sifat (Adjective)",
      "Pengenalan Kata Kerja (Verb)",
      "Pengenalan Preposisi (Preposition)",
      "Pengenalan Kata Keterangan (Adverb)",
      "Pengenalan Kata Ganti (Pronoun)",
      "Pengenalan Konjungsi (Conjunction)",
      "Pengenalan Interjeksi (Interjection)",
      "Kotak Tata Bahasa 2: Kata Benda dan Artikel",
      "Kotak Tata Bahasa 3: Kata Sifat",
      "Kotak Tata Bahasa 4: Kata Kerja",
      "Kotak Tata Bahasa 5: Preposisi",
      "Kotak Tata Bahasa 6: Kata Keterangan",
      "Kotak Tata Bahasa 7: Kata Ganti",
      "Kotak Tata Bahasa 8: Konjungsi",
      "Kotak Tata Bahasa 9: Interjeksi"
    ]
  },
  {
    name: "Analisis Kalimat (Sentence Analysis / Logical Analysis)",
    levels: [
      "Pengenalan Predikat dan Subjek (Predicate and Subject)",
      "Pengenalan Objek Langsung (Direct Object)",
      "Pengenalan Objek Tidak Langsung (Indirect Object)",
      "Pengenalan Keterangan / Adverbial (Adverbial Modifiers)",
      "Analisis Kalimat Aktif dan Pasif (Active and Passive Voice)",
      "Analisis Kalimat Majemuk (Compound Sentences)",
      "Analisis Klausa Utama dan Klausa Bawahan (Main and Subordinate Clauses)"
    ]
  },
  {
    name: "Keterampilan Membaca dan Sastra (Reading & Literature)",
    levels: [
      "Aturan Penggunaan Tanda Baca (Punctuation)",
      "Aturan Penggunaan Huruf Kapital (Capitalization)",
      "Permainan Perintah Membaca (Reading Command Cards)",
      "Analisis Unsur Intrinsik Cerita (Tokoh, Latar, Alur, Tema)",
      "Pengenalan Puisi dan Rima (Poetry)",
      "Pengenalan Majas Dasar / Gaya Bahasa (Figures of Speech)"
    ]
  },
  {
    name: "Komposisi dan Ekspresi Tulisan (Composition & Written Expression)",
    levels: [
      "Menulis Kalimat dan Paragraf Sederhana (Writing a Paragraph)",
      "Menulis Jurnal Harian (Journaling)",
      "Menulis Surat Formal dan Informal (Writing a Letter)",
      "Menulis Laporan Proyek atau Penelitian (Writing a Research Report)",
      "Penulisan Kreatif / Mengarang Cerita Fiksi (Creative Writing)"
    ]
  }
];

console.log("=================== COMPARISON SUMMARY ===================\n");

// We will compare the Indonesian language (BI) components
// Indonesian components in database are:
// - lang_great_lessons
// - lang_spoken
// - lang_word_study
// - lang_grammar
// - lang_analysis
// - lang_write
// - lang_literature

const dbBI = dbData.subAreas.filter(sa => 
  ['lang_great_lessons', 'lang_spoken', 'lang_word_study', 'lang_grammar', 'lang_analysis', 'lang_write', 'lang_literature'].includes(sa.id)
);

console.log("Current Database BI Sub-areas:");
dbBI.forEach(sa => {
  console.log(`- ${sa.name || sa.title} (${sa.id}) - ${sa.levels ? sa.levels.length : 0} levels`);
});

console.log("\nProposed New Sub-areas:");
userStructure.forEach(sa => {
  console.log(`- ${sa.name} - ${sa.levels.length} levels`);
});

console.log("\n=================== DETAILED ANALYSIS ===================\n");

// Print comparison for each proposed subarea
userStructure.forEach(userSa => {
  console.log(`\n--- PROPOSED SUB-AREA: ${userSa.name} ---`);
  
  // Find potential match in DB
  let matchingDbSa = null;
  if (userSa.name.includes("Fondasi Membaca")) {
    // Fondasi Membaca is new, but its items are scattered in lang_word_study / lang_write
  } else if (userSa.name.includes("Sejarah")) {
    matchingDbSa = dbBI.find(sa => sa.id === 'lang_great_lessons');
  } else if (userSa.name.includes("Studi Kata")) {
    matchingDbSa = dbBI.find(sa => sa.id === 'lang_word_study');
  } else if (userSa.name.includes("Tata Bahasa")) {
    matchingDbSa = dbBI.find(sa => sa.id === 'lang_grammar');
  } else if (userSa.name.includes("Analisis Kalimat")) {
    matchingDbSa = dbBI.find(sa => sa.id === 'lang_analysis');
  } else if (userSa.name.includes("Keterampilan Membaca")) {
    matchingDbSa = dbBI.find(sa => sa.id === 'lang_literature');
  } else if (userSa.name.includes("Komposisi")) {
    matchingDbSa = dbBI.find(sa => sa.id === 'lang_write');
  }

  if (matchingDbSa) {
    console.log(`Corresponds to DB Sub-area: "${matchingDbSa.name || matchingDbSa.title}" (${matchingDbSa.id})`);
    
    // Check which levels in user's list exist in matching DB sub-area (by loose name match)
    console.log("  Levels status:");
    userSa.levels.forEach(userLvl => {
      // Look for a level in DB that matches userLvl
      const cleanUserLvl = userLvl.replace(/\(.*?\)/g, "").trim().toLowerCase();
      const match = matchingDbSa.levels.find(dbLvl => {
        const dbLabel = dbLvl.label.toLowerCase();
        return dbLabel.includes(cleanUserLvl) || 
               cleanUserLvl.split(" ").every(word => word.length < 3 || dbLabel.includes(word));
      });
      if (match) {
        console.log(`    [MATCHED] Proposed: "${userLvl}"`);
        console.log(`              Existing DB: "${match.label}"`);
      } else {
        console.log(`    [NEW/MISSING] Proposed: "${userLvl}" (No close match found in this subarea)`);
      }
    });
    
    // Check if there are levels in DB that are NOT in user's list
    console.log("  Existing DB levels NOT explicitly in this proposed sub-area:");
    matchingDbSa.levels.forEach(dbLvl => {
      const dbLabel = dbLvl.label.toLowerCase();
      const match = userSa.levels.find(userLvl => {
        const cleanUserLvl = userLvl.replace(/\(.*?\)/g, "").trim().toLowerCase();
        return dbLabel.includes(cleanUserLvl) || 
               cleanUserLvl.split(" ").every(word => word.length < 3 || dbLabel.includes(word));
      });
      if (!match) {
        console.log(`    [-] "${dbLvl.label}"`);
      }
    });
  } else {
    console.log("This is a NEW Sub-area (or matches items scattered across multiple DB sub-areas)");
    userSa.levels.forEach(userLvl => {
      // Search the entire DB BI for a match
      let foundAnywhere = null;
      for (const sa of dbBI) {
        const cleanUserLvl = userLvl.replace(/\(.*?\)/g, "").trim().toLowerCase();
        const match = sa.levels.find(dbLvl => {
          const dbLabel = dbLvl.label.toLowerCase();
          return dbLabel.includes(cleanUserLvl) || 
                 cleanUserLvl.split(" ").every(word => word.length < 3 || dbLabel.includes(word));
        });
        if (match) {
          foundAnywhere = { saName: sa.name || sa.title, saId: sa.id, label: match.label };
          break;
        }
      }
      if (foundAnywhere) {
        console.log(`    [MOVED] Proposed: "${userLvl}"`);
        console.log(`            Found in DB subarea: "${foundAnywhere.saName}" (${foundAnywhere.saId}) as "${foundAnywhere.label}"`);
      } else {
        console.log(`    [NEW] Proposed: "${userLvl}" (Completely new)`);
      }
    });
  }
});

// Check if any subareas in DB BI are completely ignored
console.log("\n--- DB SUB-AREAS WITH NO DIRECT PROPOSED EQUIVALENT ---");
dbBI.forEach(sa => {
  const isTargeted = ["lang_great_lessons", "lang_word_study", "lang_grammar", "lang_analysis", "lang_literature", "lang_write"].some(id => sa.id === id);
  if (!isTargeted) {
    console.log(`- "${sa.name || sa.title}" (${sa.id})`);
  }
});
