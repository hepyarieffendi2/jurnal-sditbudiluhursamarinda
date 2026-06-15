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

const dbBI = dbData.subAreas.filter(sa => 
  ['lang_great_lessons', 'lang_spoken', 'lang_word_study', 'lang_grammar', 'lang_analysis', 'lang_write', 'lang_literature'].includes(sa.id)
);

const allDbLevels = [];
dbBI.forEach(sa => {
  if (sa.levels) {
    sa.levels.forEach((l, idx) => {
      allDbLevels.push({
        subAreaId: sa.id,
        subAreaName: sa.name || sa.title,
        label: l.label,
        index: idx,
        levelObj: l
      });
    });
  }
});

const unmatchedDbLevels = new Set(allDbLevels);
const mapped = [];

function findDbMatch(userLvlText) {
  const lower = userLvlText.toLowerCase();
  
  for (const dbLvl of allDbLevels) {
    const dbLabelLower = dbLvl.label.toLowerCase();
    
    // Explicit manual mappings
    if (lower.includes("sandpaper letters") && dbLabelLower.includes("sandpaper") && dbLabelLower.includes("cursive")) {
      return dbLvl;
    }
    if (lower.includes("movable alphabet") && (dbLabelLower.includes("movable alphabet") || dbLabelLower.includes("alphabet bergerak"))) {
      return dbLvl;
    }
    if (lower.includes("sejarah tulisan") && dbLabelLower.includes("sejarah tulisan")) {
      return dbLvl;
    }
    if (lower.includes("kata majemuk") && dbLabelLower.includes("kata majemuk")) {
      return dbLvl;
    }
    if (lower.includes("sinonim") && dbLabelLower.includes("sinonim")) {
      return dbLvl;
    }
    if (lower.includes("antonim") && dbLabelLower.includes("antonim")) {
      return dbLvl;
    }
    if (lower.includes("homonim") && dbLabelLower.includes("homonim")) {
      return dbLvl;
    }
    if (lower.includes("awalan") && dbLabelLower.includes("imbuhan")) {
      return dbLvl;
    }
    if (lower.includes("akhiran") && dbLabelLower.includes("imbuhan")) {
      return dbLvl;
    }
    if (lower.includes("kata benda") && dbLabelLower.includes("kata benda")) {
      return dbLvl;
    }
    if (lower.includes("artikel") && dbLabelLower.includes("kata sandang")) {
      return dbLvl;
    }
    if (lower.includes("kata sifat") && dbLabelLower.includes("kata sifat")) {
      return dbLvl;
    }
    if (lower.includes("kata kerja") && dbLabelLower.includes("kata kerja")) {
      return dbLvl;
    }
    if (lower.includes("preposisi") && dbLabelLower.includes("preposisi")) {
      return dbLvl;
    }
    if (lower.includes("kata keterangan") && dbLabelLower.includes("kata keterangan")) {
      return dbLvl;
    }
    if (lower.includes("kata ganti") && dbLabelLower.includes("kata ganti")) {
      return dbLvl;
    }
    if (lower.includes("konjungsi") && dbLabelLower.includes("kata sambung")) {
      return dbLvl;
    }
    if (lower.includes("interjeksi") && dbLabelLower.includes("kata seru")) {
      return dbLvl;
    }
    // Grammar boxes
    if (lower.includes("kotak tata bahasa 2") && dbLabelLower.includes("grammar box ii")) {
      return dbLvl;
    }
    if (lower.includes("kotak tata bahasa 3") && dbLabelLower.includes("grammar box iii")) {
      return dbLvl;
    }
    if (lower.includes("kotak tata bahasa 4") && dbLabelLower.includes("grammar box iv")) {
      return dbLvl;
    }
    if (lower.includes("kotak tata bahasa 5") && dbLabelLower.includes("grammar box v")) {
      return dbLvl;
    }
    if (lower.includes("kotak tata bahasa 6") && dbLabelLower.includes("grammar box vi")) {
      return dbLvl;
    }
    if (lower.includes("kotak tata bahasa 7") && dbLabelLower.includes("grammar box vii")) {
      return dbLvl;
    }
    if (lower.includes("kotak tata bahasa 8") && dbLabelLower.includes("grammar box viii")) {
      return dbLvl;
    }
    if (lower.includes("kotak tata bahasa 9") && dbLabelLower.includes("grammar box ix")) {
      return dbLvl;
    }
    
    // Sentence analysis
    if (lower.includes("predikat dan subjek") && dbLabelLower.includes("subject & predicate")) {
      return dbLvl;
    }
    if (lower.includes("objek langsung") && dbLabelLower.includes("direct object")) {
      return dbLvl;
    }
    if (lower.includes("keterangan / adverbial") && dbLabelLower.includes("perluasan keterangan")) {
      return dbLvl;
    }
    if (lower.includes("kalimat aktif dan pasif") && dbLabelLower.includes("aktif & pasif")) {
      return dbLvl;
    }
    if (lower.includes("kalimat majemuk") && dbLabelLower.includes("diagramming & struktur sintaksis kompleks")) {
      return dbLvl;
    }
    if (lower.includes("klausa utama dan klausa bawahan") && dbLabelLower.includes("analisis logis anak kalimat")) {
      return dbLvl;
    }
    
    // Literature and writing
    if (lower.includes("unsur intrinsik") && dbLabelLower.includes("analisis karakter & plot")) {
      return dbLvl;
    }
    if (lower.includes("puisi") && dbLabelLower.includes("puisi")) {
      return dbLvl;
    }
    if (lower.includes("gaya bahasa") && dbLabelLower.includes("gaya bahasa")) {
      return dbLvl;
    }
    if (lower.includes("jurnal harian") && dbLabelLower.includes("jurnal refleksi")) {
      return dbLvl;
    }
    if (lower.includes("surat") && dbLabelLower.includes("menulis surat")) {
      return dbLvl;
    }
    if (lower.includes("laporan proyek") && dbLabelLower.includes("laporan penelitian")) {
      return dbLvl;
    }
    if (lower.includes("kreatif") && dbLabelLower.includes("menulis kreatif")) {
      return dbLvl;
    }
  }
  return null;
}

userStructure.forEach(userSa => {
  userSa.levels.forEach(userLvl => {
    const match = findDbMatch(userLvl);
    if (match) {
      unmatchedDbLevels.delete(match);
      mapped.push({
        proposedSubArea: userSa.name,
        proposedLevel: userLvl,
        dbSubArea: match.subAreaName,
        dbLevel: match.label,
        status: "Matched / Reorganized"
      });
    } else {
      mapped.push({
        proposedSubArea: userSa.name,
        proposedLevel: userLvl,
        dbSubArea: "-",
        dbLevel: "-",
        status: "New Level"
      });
    }
  });
});

let report = "";
report += "=== MAPPED PROPOSED LEVELS ===\n\n";
mapped.forEach(item => {
  report += `Proposed Sub-area: ${item.proposedSubArea}\n`;
  report += `Proposed Level:    ${item.proposedLevel}\n`;
  report += `Database Match:    [${item.dbSubArea}] ${item.dbLevel}\n`;
  report += `Status:            ${item.status}\n`;
  report += `------------------------------------------------------------\n`;
});

report += "\n\n=== UNMATCHED/LEFT OUT DATABASE BI LEVELS ===\n\n";
unmatchedDbLevels.forEach(lvl => {
  report += `- Sub-area: ${lvl.subAreaName} (${lvl.subAreaId}) | Level: ${lvl.label}\n`;
});

fs.writeFileSync(path.join(__dirname, 'compare_result.txt'), report, 'utf8');
console.log("Written comparison to scratch/compare_result.txt");
