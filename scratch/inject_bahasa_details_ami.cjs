const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

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

// 18 new levels data
const newLevelsData = {
  "Eksplorasi Piktogram Prasejarah": {
    tool: "Gambar lukisan gua purba (Maros/Lascaux), arang kayu, kertas cokelat tebal",
    toolDisplay: "Gambar lukisan gua purba (Maros/Lascaux), arang kayu, kertas cokelat tebal",
    toolsList: ["Gambar lukisan gua purba (Maros/Lascaux)", "Arang kayu", "Kertas cokelat tebal"],
    prerequisites: "Rasa ingin tahu mendengarkan Cerita Agung Keempat dan kesiapan menggambar bebas.",
    directAim: "Meniru cara berkomunikasi manusia prasejarah dengan melukis simbol/hewan menggunakan batu arang di atas kertas cokelat.",
    indirectAim: "Mengagumi kebesaran Allah yang mengaruniakan akal pikiran bagi manusia sejak awal peradaban untuk berikhtiar mencari cara berkomunikasi.",
    error: "Simbol gambar tidak dapat dipahami maknanya oleh teman kelompok yang bertindak sebagai penebak.",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang sekelompok anak melingkar dan katakan: 'Nak, hari ini kita akan berpura-pura menjadi manusia purba yang hidup di dalam gua. Kita akan merasakan bagaimana cara mereka bertukar pesan menggunakan arang sebelum ada huruf.' [Berkesadaran]",
      "3. Siapkan karpet kerja di lantai dan bentangkan gulungan kertas cokelat kasar di tengah.",
      "4. Guru membawa nampan berisi batu arang dan cetakan lukisan gua Maros/Lascaux ke karpet. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru menunjukkan cetakan gambar gua purba (telapak tangan dan hewan buruan) dan bercerita tentang cara manusia purba mengabadikan kisah mereka. [Bermakna - Memahami]",
      "6. Tunjukkan arang kayu dan minta anak meraba teksturnya yang kasar dan berdebu untuk melatih sensorisnya secara diam (*Economy of Words*). [Bermakna - Memahami]",
      "7. Guru menggambar simbol hewan buruan sederhana secara perlahan di kertas cokelat menggunakan arang untuk mendemonstrasikan kelenturan goresan tangan. [Bermakna - Memahami]",
      "8. Mintalah anak memegang arang dan mencoba meniru coretan garis dasar secara bergantian. [Bermakna - Memahami]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "9. Guru memandu permainan tebak gambar berpasangan secara mandiri: 'Silakan berpasangan dengan temanmu untuk menggambar pesan rahasia tanpa suara menggunakan arang.' [Menyenangkan]",
      "10. Anak menggambar piktogram secara mandiri dan temannya menebak artinya. [Menyenangkan - Kerja Mandiri]",
      "11. Setelah selesai, tuntun anak mencuci tangan dan merapikan sisa arang serta menyapu serpihan debunya: 'Yuk, kita bersihkan karpet kita kembali rapi sebagai bentuk rasa syukur kita kepada Allah.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "12. Lakukan evaluasi recalling bersama setelah area karpet bersih kembali. [Berkesadaran - Merefleksikan]",
      "13. Berikan apresiasi atas usaha, fokus, dan kerja sama anak-anak. [Berkesadaran - Merefleksikan]",
      "14. Recalling Pengalaman: Tanyakan kepada anak tentang perasaan mereka ketika menggambar dengan arang. [Berkesadaran - Merefleksikan]",
      "15. Internalisasi Nilai Islam (QS. Al-Baqarah: 31): Guru menjelaskan: 'Allah mengajarkan nama-nama benda kepada Nabi Adam. Menggambar piktogram adalah ikhtiar akal pikiran manusia ciptaan Allah untuk menandai benda di sekelilingnya.' [Berkesadaran - Merefleksikan]",
      "16. Ajak anak merencanakan satu kebaikan nyata hari ini. [Berkesadaran - Mengaplikasikan]",
      "17. Tutup sesi dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "18. Guru mengucapkan kalimat penutupan: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  },
  "Eksplorasi Huruf Hieroglif dan Cuneiform": {
    tool: "Lempengan tanah liat (clay) datar, stilus kayu (lidi/sumpit tebal), bagan simbol aksara Mesir & Sumeria Kuno",
    toolDisplay: "Lempengan tanah liat (clay) datar, stilus kayu (lidi/sumpit tebal), bagan simbol aksara Mesir & Sumeria Kuno",
    toolsList: ["Lempengan tanah liat (clay) datar", "Stilus kayu (lidi/sumpit tebal)", "Bagan simbol aksara Mesir & Sumeria Kuno"],
    prerequisites: "Tuntas tingkat Eksplorasi Piktogram Prasejarah.",
    directAim: "Menuliskan simbol hieroglif atau huruf paku cuneiform di atas permukaan lempengan tanah liat basah menggunakan stilus.",
    indirectAim: "Mengasah muscular-memory menulis dan kelenturan koordinasi motorik halus tiga jari (tripod grip).",
    error: "Lempengan tanah liat basah retak/patah karena terlalu tipis atau stilus ditekan terlalu dalam.",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang sekelompok kecil anak ke karpet dan katakan: 'Nak, hari ini kita akan berkunjung ke Mesir dan Mesopotamia Kuno. Kita akan menulis di atas tanah liat basah menggunakan stilus kayu.' [Berkesadaran]",
      "3. Siapkan karpet kerja dan bentangkan lembaran plastik alas kerja agar karpet tetap bersih.",
      "4. Guru membawa adonan tanah liat basah, stilus kayu, dan bagan panduan huruf hieroglif/cuneiform ke karpet. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru memipihkan tanah liat basah membentuk lempengan tablet datar berukuran telapak tangan anak secara perlahan. [Bermakna - Memahami]",
      "6. Tunjukkan cara memegang stilus kayu menggunakan tripod grip (pegangan pensil) secara kokoh dan nyaman. [Bermakna - Memahami]",
      "7. Guru menekan stilus secara miring ke atas tanah liat basah membentuk pola garis runcing cuneiform secara tenang (*Economy of Words*). [Bermakna - Memahami]",
      "8. Minta anak memegang lempengan tanah liat untuk merasakan kelenturan dan kelembabannya secara sensorik. [Bermakna - Memahami]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "9. Undang anak mengeksplorasi secara mandiri: 'Silakan pipihkan adonan lempengan tanah liat kalian dan tulislah inisial namamu menggunakan kode huruf kuno cuneiform atau hieroglif.' [Menyenangkan]",
      "10. Anak menulis nama mereka di tanah liat secara mandiri. Guru mengamati tanpa menginterupsi. [Menyenangkan - Kerja Mandiri]",
      "11. Bimbing anak mengemas kembali sisa tanah liat ke wadah tertutup dan merapikan alas plastik: 'Yuk, kita bersihkan area main kita agar selalu rapi.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "12. Lakukan diskusi recalling bersama kelompok setelah area kerja rapi. [Berkesadaran - Merefleksikan]",
      "13. Berikan apresiasi atas ketelitian, fokus, dan kelenturan tangan anak saat menulis. [Berkesadaran - Merefleksikan]",
      "14. Recalling Pengalaman: Tanyakan kepada anak: 'Bagaimana rasanya menekan stilus kayu ke tanah liat basah? Apa perbedaannya dengan menulis di kertas?' [Berkesadaran - Merefleksikan]",
      "15. Internalisasi Nilai Islam (QS. Al-Alaq: 4 & QS. Al-Qalam: 1): Guru menyampaikan: 'Allah bersumpah demi pena dan apa yang dituliskan. Lempengan tanah liat ini adalah bentuk pena sejarah yang Allah izinkan manusia temukan untuk memelihara ilmu.' [Berkesadaran - Merefleksikan]",
      "16. Ajak anak berkomitmen melakukan satu tindakan syukur hari ini. [Berkesadaran - Mengaplikasikan]",
      "17. Tutup dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "18. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  },
  "Sejarah Penemuan Alfabet": {
    tool: "Bagan evolusi alfabet (Hieroglif -> Fenisia -> Yunani -> Latin), peta pelayaran navigasi Fenisia kuno",
    toolDisplay: "Bagan evolusi alfabet (Hieroglif -> Fenisia -> Yunani -> Latin), peta pelayaran navigasi Fenisia kuno",
    toolsList: ["Bagan evolusi alfabet (Hieroglif -> Fenisia -> Yunani -> Latin)", "Peta pelayaran navigasi Fenisia kuno"],
    prerequisites: "Tuntas tingkat Eksplorasi Hieroglif dan Cuneiform.",
    directAim: "Menyusun dan mengurutkan secara kronologis bagan perubahan simbol gambar ke sistem alfabet fonetis Romawi/Latin.",
    indirectAim: "Memahami hubungan perdagangan kuno dalam penyebaran literasi dan keragaman sistem bunyi bahasa.",
    error: "Urutan bagan evolusi waktu/kronologi huruf terbalik (misal: menaruh huruf Yunani sebelum Fenisia).",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang sekelompok anak ke karpet dan katakan: 'Nak, hari ini kita akan membentangkan peta kuno dan melihat bagaimana huruf A, B, C yang kita gunakan hari ini bertumbuh dari lukisan kepala sapi jantan ribuan tahun lalu.' [Berkesadaran]",
      "3. Siapkan karpet kerja utama di lantai.",
      "4. Guru membawa gulungan peta rute perdagangan Fenisia dan satu set kartu bagan evolusi aksara ke karpet. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru membuka peta pelayaran bangsa Fenisia kuno di Laut Mediterania dan menceritakan bagaimana mereka menyebarkan huruf fonetik pertama. [Bermakna - Memahami]",
      "6. Tunjukkan kartu evolusi huruf, misalnya: Huruf 'A' berawal dari gambar kepala sapi jantan (Aleph) dalam Hieroglif Mesir, diputar miring oleh bangsa Fenisia, diputar lagi oleh Yunani, hingga menjadi huruf A Latin tegak. [Bermakna - Memahami]",
      "7. Letakkan kartu-kartu evolusi tersebut secara runtut dari kiri ke kanan di atas karpet secara perlahan tanpa banyak penjelasan verbal (*Economy of Words*). [Bermakna - Memahami]",
      "8. Minta anak meraba kesamaan garis bentuk transisi huruf kuno ke huruf modern. [Bermakna - Memahami]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "9. Undang anak mengeksplorasi secara berkelompok: 'Apakah kalian ingin menyusun garis waktu evolusi huruf ini atau menggambar peta rute perjalanannya?' [Menyenangkan]",
      "10. Anak secara mandiri menyusun bagan evolusi huruf atau menggambar peta penyebarannya. [Menyenangkan - Kerja Mandiri]",
      "11. Bimbing anak menggulung kembali peta dan menyusun kartu ke dalam kotak: 'Yuk, rapikan alas kerja kita agar kelas selalu indah dipandang.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "12. Lakukan diskusi recalling lingkaran setelah merapikan karpet. [Berkesadaran - Merefleksikan]",
      "13. Berikan apresiasi atas antusiasme dan kerja kelompok anak-anak. [Berkesadaran - Merefleksikan]",
      "14. Recalling Pengalaman: Tanyakan: 'Perubahan huruf mana yang menurutmu paling unik bentuknya? Mengapa?' [Berkesadaran - Merefleksikan]",
      "15. Internalisasi Nilai Islam (QS. Ar-Rum: 22): Guru menjelaskan: 'Keberagaman bahasa di dunia adalah salah satu tanda kebesaran Allah. Evolusi alfabet membuktikan bangsa-bangsa di bumi saling bertukar ilmu dan berinteraksi.' [Berkesadaran - Merefleksikan]",
      "16. Ajak anak merencanakan satu kebaikan sebagai wujud syukur atas kemudahan alat tulis modern. [Berkesadaran - Mengaplikasikan]",
      "17. Tutup dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "18. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  },
  "Seri Merah Muda / Pink Series (Membaca Fonetik Dasar / Suku Kata Terbuka)": {
    tool: "Kotak mainan/objek Pink (miniatur benda fonetik dasar suku kata terbuka, e.g. buku, batu, topi, padi), kartu gambar, kartu kata, buklet kata, daftar kata berkode warna merah muda",
    toolDisplay: "Kotak mainan/objek Pink (miniatur benda fonetik dasar suku kata terbuka, e.g. buku, batu, topi, padi), kartu gambar, kartu kata, buklet kata, daftar kata berkode warna merah muda",
    toolsList: ["Kotak mainan/objek Pink (miniatur benda suku kata terbuka)", "Kartu gambar berkode merah muda", "Kartu kata berkode merah muda", "Buklet kata berkode merah muda", "Daftar kata berkode merah muda"],
    prerequisites: "Lancar dalam Sandpaper Letters dan Movable Alphabet.",
    directAim: "Membaca kata dua suku kata terbuka (fonetik dasar) secara mandiri.",
    indirectAim: "Membangun kelancaran membaca mandiri awal dan mempersiapkan transisi membaca kalimat sederhana.",
    error: "Kartu kata tidak dipasangkan secara tepat dengan objek miniatur pendampingnya.",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang anak secara individual ke karpet dan katakan: 'Nak, hari ini kita akan membuka Kotak Merah Muda. Di dalamnya ada banyak benda lucu yang menunggu untuk kamu bacakan namanya.' [Berkesadaran]",
      "3. Siapkan karpet kerja bersih yang halus di lantai.",
      "4. Guru membawa Kotak Objek Pink dan wadah kartu kata pink ke atas karpet. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru membuka kotak dan mengeluarkan miniatur objek satu per satu (misal: topi, buku, batu), sejajarkan secara vertikal di sisi kanan karpet. [Bermakna - Memahami]",
      "6. Ambil satu kartu kata pink, contoh: \"b-u-k-u\". Tunjukkan cara mengeja bunyi fonemnya perlahan: \"b-u... bu... k-u... ku... buku\". [Bermakna - Memahami]",
      "7. Letakkan kartu kata tersebut tepat di sebelah kiri objek buku secara tenang (*Economy of Words*). [Bermakna - Memahami]",
      "8. Ulangi proses ini untuk objek lainnya. Minta anak memegang dan meraba miniatur objek tersebut untuk menjaga fokus sensoriknya. [Bermakna - Memahami]",
      "9. Tahap Asosiasi: Acak kartu kata dan minta anak menaruhnya kembali di samping objek yang tepat: 'Tolong letakkan kartu \"topi\" di samping topinya.' [Bermakna - Memahami]",
      "10. Tahap Recall: Tunjuk salah satu kartu kata secara acak dan tanyakan: 'Apakah nama kata ini?' [Bermakna - Memahami]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "11. Undang anak mencoba mandiri: 'Apakah kamu ingin mencobanya sendiri dengan kotak objek pink ini?' [Menyenangkan]",
      "12. Anak mengeksplorasi membaca kata pink mandiri. Setelah lancar, anak dipandu menyalin kata-kata pink tersebut ke dalam buku garis tiganya menggunakan pensil secara rapi. [Menyenangkan - Kerja Mandiri]",
      "13. Bimbing anak merapikan miniatur ke kotak dan kartunya ke wadah: 'Yuk, kembalikan ke rak agar tersusun rapi kembali.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "14. Lakukan percakapan recalls di karpet. [Berkesadaran - Merefleksikan]",
      "15. Apresiasi keberhasilan membaca dan kerapian tulisan tangan anak di buku garis tiga. [Berkesadaran - Merefleksikan]",
      "16. Recalling Pengalaman: Tanyakan: 'Kata mana yang paling mudah kamu baca tadi? Apa nama benda yang paling kamu sukai di kotak?' [Berkesadaran - Merefleksikan]",
      "17. Internalisasi Nilai Islam (QS. Al-Alaq: 1): Guru menyampaikan: 'Bacalah dengan nama Tuhanmu yang menciptakan. Allah senang sekali jika kita rajin membaca karena membaca adalah pembuka segala pintu ilmu.' [Berkesadaran - Merefleksikan]",
      "18. Ajak anak melakukan komitmen kebaikan kecil hari ini. [Berkesadaran - Mengaplikasikan]",
      "19. Tutup sesi dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "20. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  },
  "Seri Biru / Blue Series (Membaca Konsonan Ganda / Suku Kata Tertutup)": {
    tool: "Kotak mainan/objek Blue (miniatur benda bersuku kata tertutup/konsonan mati, e.g. pensil, kertas, jarum, nanas), kartu kata, kartu gambar, buklet kata berkode warna biru",
    toolDisplay: "Kotak mainan/objek Blue (miniatur benda bersuku kata tertutup/konsonan mati, e.g. pensil, kertas, jarum, nanas), kartu kata, kartu gambar, buklet kata berkode warna biru",
    toolsList: ["Kotak mainan/objek Blue (miniatur benda suku kata tertutup)", "Kartu kata berkode warna biru", "Kartu gambar berkode warna biru", "Buklet kata berkode warna biru"],
    prerequisites: "Tuntas tingkat Seri Merah Muda.",
    directAim: "Membaca kata bersuku kata tertutup (mengandung konsonan mati) secara mandiri.",
    indirectAim: "Meningkatkan stamina membaca kata multi-konsonan dan ketelitian spelling/mengeja.",
    error: "Kartu kata tidak dipasangkan secara tepat dengan objek miniatur pendampingnya.",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang anak secara individual ke karpet dan katakan: 'Nak, hari ini kita naik kelas ke Kotak Biru. Di dalamnya ada banyak benda lucu yang diakhiri bunyi huruf mati.' [Berkesadaran]",
      "3. Siapkan karpet kerja bersih di lantai.",
      "4. Bawa Kotak Objek Blue dan wadah kartu kata biru ke karpet. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru membuka kotak objek biru dan mengeluarkan miniatur objek satu per satu (misal: jarum, nanas, pensil), sejajarkan secara vertikal di sisi kanan karpet. [Bermakna - Memahami]",
      "6. Ambil satu kartu kata biru, contoh: \"j-a-r-u-m\". Eja bunyinya secara perlahan: \"j-a... ja... r-u-m... rum... jarum\". [Bermakna - Memahami]",
      "7. Letakkan kartu kata biru tersebut tepat di samping objek jarum secara tenang (*Economy of Words*). [Bermakna - Memahami]",
      "8. Ulangi proses ini untuk objek lainnya. Minta anak memegang dan meraba miniatur objek tersebut untuk menjaga fokus sensoriknya. [Bermakna - Memahami]",
      "9. Minta anak membaca kartu kata lainnya secara mandiri dan meletakkannya di samping objek yang tepat. [Bermakna - Mengaplikasikan]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "10. Undang anak mencoba secara mandiri: 'Apakah kamu ingin mencocokkan kata biru ini sendiri atau menuliskannya di buku?' [Menyenangkan]",
      "11. Anak mencocokkan kata biru secara mandiri. Setelah selesai mencocokkan, anak menulis kata-kata biru tersebut di buku garis tiga. [Menyenangkan - Kerja Mandiri]",
      "12. Bimbing anak mengembalikan material ke rak penyimpanan: 'Mari kembalikan dengan rapi agar kelas kita selalu tertata indah.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "13. Lakukan percakapan recalls di karpet. [Berkesadaran - Merefleksikan]",
      "14. Apresiasi usaha dan konsentrasi anak dalam mengeja suku kata tertutup. [Berkesadaran - Merefleksikan]",
      "15. Recalling Pengalaman: Tanyakan: 'Benda mana yang paling menantang untuk kamu eja namanya tadi?' [Berkesadaran - Merefleksikan]",
      "16. Internalisasi Nilai Islam (QS. Ar-Rahman: 4): Guru menerangkan: 'Allah mengajarkan manusia pandai berbicara dan menjelaskan (Al-Bayan). Kemampuan mengeja kata kompleks melatih ketepatan lisan kita menyampaikan kebenaran.' [Berkesadaran - Merefleksikan]",
      "17. Ajak anak melakukan komitmen kebaikan kecil hari ini. [Berkesadaran - Mengaplikasikan]",
      "18. Tutup sesi dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "19. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  },
  "Seri Hijau / Green Series (Membaca Fonogram / Bunyi Khusus dan Pengecualian)": {
    tool: "Kartu kata fonogram Green (mengandung gabungan huruf khusus: ng, ny, sy, kh), buklet kata fonogram bergambar hijau, laci fonogram hijau",
    toolDisplay: "Kartu kata fonogram Green (mengandung gabungan huruf khusus: ng, ny, sy, kh), buklet kata fonogram bergambar hijau, laci fonogram hijau",
    toolsList: ["Kartu kata fonogram Green", "Buklet kata fonogram bergambar hijau", "Laci fonogram hijau"],
    prerequisites: "Tuntas tingkat Seri Biru.",
    directAim: "Membaca kata-kata yang mengandung gabungan huruf konsonan khusus (fonogram/digraf) secara tepat.",
    indirectAim: "Mempersiapkan membaca lancar teks keagamaan dan penulisan istilah ilmiah baku.",
    error: "Mengeja bunyi gabungan huruf fonogram secara terpisah (misal: mengeja n-g terpisah, bukan dibaca ng).",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang anak dan katakan: 'Nak, hari ini kita akan melihat bagaimana dua huruf berbeda bersahabat erat untuk membentuk satu bunyi baru di Kotak Hijau.' [Berkesadaran]",
      "3. Siapkan karpet kerja di lantai.",
      "4. Bawa Kotak Fonogram Green berisi kartu kata bersimbol hijau ke karpet. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru meletakkan kartu fonogram \"ng\" (ditulis dengan huruf hijau kontras) di atas karpet. [Bermakna - Memahami]",
      "6. Tunjukkan bahwa huruf \"n\" dan \"g\" bersatu membentuk bunyi baru \"ng\" (seperti pada kata *pisang*, *burung*). [Bermakna - Memahami]",
      "7. Letakkan kartu kata *pi-sang* dan minta anak membacanya perlahan. Eja bagian \"ng\" sebagai satu bunyi kesatuan secara tenang (*Economy of Words*). [Bermakna - Memahami]",
      "8. Lakukan hal yang sama untuk fonogram \"ny\" (*nyanyi*), \"sy\" (*syarat*), dan \"kh\" (*khusus*). [Bermakna - Memahami]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "9. Undang anak mengeksplorasi mandiri: 'Apakah kamu ingin membaca kartu kata hijau ini atau menulis kata-kata fonogram di bukumu?' [Menyenangkan]",
      "10. Anak membaca kartu kata fonogram hijau atau buklet secara mandiri. Anak menyalin kata-kata tersebut di buku garis tiganya. [Menyenangkan - Kerja Mandiri]",
      "11. Bimbing anak mengembalikan kartu-kartu fonogram ke kotaknya secara rapi: 'Mari kembalikan dengan teliti ke rak agar selalu siap digunakan.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "12. Lakukan diskusi recalling bersama anak di karpet. [Berkesadaran - Merefleksikan]",
      "13. Apresiasi keberhasilan anak melafalkan bunyi khusus secara fasih. [Berkesadaran - Merefleksikan]",
      "14. Recalling Pengalaman: Tanyakan: 'Gabungan bunyi mana yang menurutmu paling menyenangkan saat dibunyikan?' [Berkesadaran - Merefleksikan]",
      "15. Internalisasi Nilai Islam (QS. Al-Hujurat: 13): Guru menjelaskan: 'Dua huruf berbeda (*n* dan *g*) bersatu menciptakan bunyi indah (*ng*). Ini melambangkan ukhuwah islamiyah; perbedaan manusia yang bersatu akan menciptakan harmoni dan kekuatan baru yang indah.' [Berkesadaran - Merefleksikan]",
      "16. Ajak anak bersilaturahmi menyapa teman lain dengan ucapan ramah hari ini. [Berkesadaran - Mengaplikasikan]",
      "17. Tutup dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "18. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  },
  "Diskusi Kelompok (Discussion)": {
    tool: "Kartu topik diskusi tematik akhlak/sosial, Bola Bicara (Talking Stick) kelas",
    toolDisplay: "Kartu topik diskusi tematik akhlak/sosial, Bola Bicara (Talking Stick) kelas",
    toolsList: ["Kartu topik diskusi tematik akhlak/sosial", "Bola Bicara (Talking Stick)"],
    prerequisites: "Kemampuan bahasa lisan dasar dan pemahaman kalimat sederhana.",
    directAim: "Mengungkapkan ide/pendapat pribadi secara santun dan bergiliran menggunakan Bola Bicara.",
    indirectAim: "Melatih adab menyimak pembicaraan orang lain, kesabaran (tsabat), dan toleransi pendapat.",
    error: "Menyela pembicaraan teman sebelum bola bicara berpindah tangan atau memonopoli diskusi.",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang sekelompok anak melingkar di lantai dan katakan: 'Nak, hari ini kita akan mendiskusikan topik menarik. Kita akan melatih adab berbicara dan mendengar menggunakan Bola Bicara.' [Berkesadaran]",
      "3. Siapkan karpet bundar di lantai.",
      "4. Bawa Bola Bicara dan kartu topik diskusi ke tengah karpet. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru menjelaskan aturan main: hanya orang yang memegang Bola Bicara yang diperbolehkan berbicara, sementara yang lain menyimak dengan khusyu. [Bermakna - Memahami]",
      "6. Bacakan satu topik diskusi dari kartu, misalnya: \"Cara menjaga kenyamanan kelas kita\". [Bermakna - Memahami]",
      "7. Berikan Bola Bicara kepada salah satu anak, lalu dengarkan penjelasannya secara seksama tanpa menyela (*Economy of Words*). [Bermakna - Memahami]",
      "8. Minta anak tersebut menyerahkan bola kepada teman di sebelahnya untuk bergiliran mengemukakan pendapat. [Bermakna - Mengaplikasikan]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "9. Undang anak berdiskusi secara mandiri: 'Silakan lanjutkan diskusi kelompok ini secara mandiri dipimpin oleh moderator kelompokmu.' [Menyenangkan]",
      "10. Anak berdiskusi mandiri secara tertib bergiliran memegang bola. [Menyenangkan - Kerja Mandiri]",
      "11. Bimbing anak mengembalikan bola bicara dan kartu topik ke laci rak: 'Yuk, kembalikan dengan rapi agar kelas selalu tertata indah.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "12. Lakukan diskusi recalling bersama kelompok setelah merapikan karpet. [Berkesadaran - Merefleksikan]",
      "13. Apresiasi sikap sabar anak-anak yang mendengarkan temannya tanpa menyela. [Berkesadaran - Merefleksikan]",
      "14. Recalling Pengalaman: Tanyakan: 'Bagaimana rasanya menahan diri untuk tidak menyela saat temanmu memegang bola? Apa ide terbaik temanmu tadi?' [Berkesadaran - Merefleksikan]",
      "15. Internalisasi Nilai Islam (QS. Ali Imran: 159): Guru menjelaskan: 'Allah memerintahkan kita untuk selalu bermusyawarah dan berbicara dengan lemah lembut. Syura melatih kita untuk saling menghormati pendapat sesama muslim.' [Berkesadaran - Merefleksikan]",
      "16. Ajak anak berkomitmen untuk menyimak penjelasan guru dan teman dengan baik hari ini. [Berkesadaran - Mengaplikasikan]",
      "17. Tutup dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "18. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  },
  "Laporan Lisan (Oral Reports)": {
    tool: "Peta pikiran (mind map) hasil riset proyek kosmik anak, kartu draf catatan poin presentasi, pointer kayu",
    toolDisplay: "Peta pikiran (mind map) hasil riset proyek kosmik anak, kartu draf catatan poin presentasi, pointer kayu",
    toolsList: ["Peta pikiran (mind map) hasil riset proyek kosmik anak", "Kartu draf catatan poin presentasi", "Pointer kayu"],
    prerequisites: "Menyelesaikan riset proyek kosmik mandiri.",
    directAim: "Mempresentasikan hasil proyek riset kosmik secara lisan di depan audiens menggunakan peta pikiran secara runtut.",
    indirectAim: "Membangun kepercayaan diri berbicara di publik, kontak mata bersahabat, dan penalaran ide sistematis.",
    error: "Membaca draf catatan secara monoton tanpa melakukan kontak mata dengan audiens kelas.",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang anak ke panggung presentasi depan kelas dan katakan: 'Nak, hari ini kamu akan menceritakan temuan riset hebatmu tentang alam semesta kepada teman-teman kelas secara lisan.' [Berkesadaran]",
      "3. Siapkan area panggung kecil atau depan kelas sebagai area presentasi.",
      "4. Bawa mind map proyek dan kartu catatan poin anak ke hadapan kelas. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru mendemonstrasikan adab membuka laporan lisan: mengucapkan salam, memperkenalkan diri dan topik, serta tersenyum ramah. [Bermakna - Memahami]",
      "6. Tunjukkan cara memegang pointer kayu dan menunjuk area peta pikiran secara presisi tanpa membelakangi audiens (*Economy of Words*). [Bermakna - Memahami]",
      "7. Contohkan nada suara yang lantang dan jeda yang cukup saat menerangkan poin riset. [Bermakna - Memahami]",
      "8. Bimbing anak berdiri tegak dengan percaya diri di area panggung. [Bermakna - Memahami]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "9. Undang anak mencoba secara mandiri: 'Silakan sampaikan laporan lisanmu kepada teman-teman secara mandiri.' [Menyenangkan]",
      "10. Anak mempresentasikan laporan lisannya secara mandiri diikuti sesi tanya jawab sederhana dengan audiens. [Menyenangkan - Kerja Mandiri]",
      "11. Gulung kembali peta pikiran dan simpan ke dalam map portofolio: 'Mari rapikan area panggung kita.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "12. Berikan tanggapan balik yang positif kepada anak setelah tampil. [Berkesadaran - Merefleksikan]",
      "13. Apresiasi keberanian, kejelasan suara, dan data riset yang disampaikan anak. [Berkesadaran - Merefleksikan]",
      "14. Recalling Pengalaman: Tanyakan: 'Bagaimana perasaanmu setelah berhasil menyampaikan hasil risetmu secara lisan kepada teman-teman?' [Berkesadaran - Merefleksikan]",
      "15. Internalisasi Nilai Islam (QS. An-Nahl: 125): Guru menyampaikan: 'Serulah ke jalan Tuhanmu dengan hikmah dan penjelasan yang baik. Menyampaikan ilmu yang bermanfaat secara jujur dan jelas adalah bentuk amanah ilmiah.' [Berkesadaran - Merefleksikan]",
      "16. Ajak anak berkomitmen untuk terus berani menyebarkan kebaikan dan kebenaran secara lisan. [Berkesadaran - Mengaplikasikan]",
      "17. Tutup dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "18. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  },
  "Pidato (Speeches / Oratory)": {
    tool: "Podium mini kelas, draf teks pidato orisinal buatan sendiri",
    toolDisplay: "Podium mini kelas, draf teks pidato orisinal buatan sendiri",
    toolsList: ["Podium mini kelas", "Draf teks pidato orisinal buatan sendiri"],
    prerequisites: "Lancar dalam Laporan Lisan dan penulisan paragraf terstruktur.",
    directAim: "Menyampaikan pidato persuasif bertema akhlak mulia menggunakan podium dengan wibawa suara dan gestur tegak.",
    indirectAim: "Kepemimpinan, keterampilan retorika islami, dan syiar dakwah kebaikan lisan.",
    error: "Berbicara terlalu terburu-buru atau volume suara terlalu rendah sehingga pesan tidak terdengar jelas.",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang anak dan katakan: 'Nak, hari ini kita akan belajar bagaimana cara menyampaikan pesan kebaikan akhlak mulia secara tegas dan berwibawa di depan umum seperti para dai.' [Berkesadaran]",
      "3. Siapkan podium mini di depan deretan kursi audiens.",
      "4. Bawa draf pidato tertulis ke area podium. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru menjelaskan struktur pidato formal: Salam pembuka, puji syukur, isi pesan akhlak, dan salam penutup. [Bermakna - Memahami]",
      "6. Tunjukkan teknik olah vokal, pengaturan jeda napas, dan gerak tangan (gestur) yang meyakinkan tanpa berlebihan secara tenang (*Economy of Words*). [Bermakna - Memahami]",
      "7. Guru mencontohkan pembukaan pidato dengan suara lantang dan tatapan menyapu audiens secara ramah. [Bermakna - Memahami]",
      "8. Bimbing anak berdiri di balik podium, memegang draf pidato dengan tangan rileks. [Bermakna - Memahami]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "9. Undang anak mencoba secara mandiri: 'Silakan sampaikan pidatomu di depan kelas secara mandiri.' [Menyenangkan]",
      "10. Anak berpidato secara bergiliran di hadapan teman-temannya yang berperan sebagai audiens tertib. [Menyenangkan - Kerja Mandiri]",
      "11. Kembalikan teks pidato ke map draf pidato siswa: 'Mari rapikan kembali susunan kelas.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "12. Guru dan audiens memberikan masukan membangun dan apresiasi. [Berkesadaran - Merefleksikan]",
      "13. Apresiasi keberanian, wibawa suara, dan adab anak selama berada di podium. [Berkesadaran - Merefleksikan]",
      "14. Recalling Pengalaman: Tanyakan: 'Bagian pesan pidato mana yang paling kamu rasakan saat menyampaikannya?' [Berkesadaran - Merefleksikan]",
      "15. Internalisasi Nilai Islam (QS. Thaha: 25-28): Guru menjelaskan: 'Doa Nabi Musa memohon kelapangan dada dan pelepasan kekakuan lidah agar perkataannya mudah dipahami (Yafqahu Qouli). Pidato melatih kita menyampaikan kebaikan dengan fasih.' [Berkesadaran - Merefleksikan]",
      "16. Ajak anak berkomitmen menyuarakan satu pesan kebaikan dalam interaksi harian hari ini. [Berkesadaran - Mengaplikasikan]",
      "17. Tutup dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "18. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  },
  "Debat (Debates)": {
    tool: "Kartu mosi debat, Palu Sidang Moderator, Stopwatch/Timer",
    toolDisplay: "Kartu mosi debat, Palu Sidang Moderator, Stopwatch/Timer",
    toolsList: ["Kartu mosi debat", "Palu Sidang Moderator", "Stopwatch/Timer"],
    prerequisites: "Lancar dalam Diskusi Kelompok dan Laporan Lisan.",
    directAim: "Mengemukakan argumen pendukung/penolak mosi debat secara logis dan menyanggah lawan dengan santun.",
    indirectAim: "Melatih ketangkasan berpikir taktis, kematangan emosional dalam perbedaan pendapat, dan adab bermusyawarah.",
    error: "Menggunakan argumen personal (ad hominem), memotong pembicaraan lawan sebelum diizinkan moderator.",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang sekelompok anak dan katakan: 'Nak, hari ini kita akan mengadakan debat persahabatan. Kita akan belajar mempertahankan pendapat berdasarkan fakta dengan adab muslim yang mulia.' [Berkesadaran]",
      "3. Susun kursi kelas menjadi tiga kubu: Afirmasi (setuju), Oposisi (menolak), dan Moderator di tengah.",
      "4. Bawa palu sidang, kartu mosi, dan timer ke atas meja moderator. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru menjelaskan tata tertib debat formal: giliran bicara diatur ketat oleh timer dan ketukan palu sidang. [Bermakna - Memahami]",
      "6. Tunjukkan cara menyanggah pendapat lawan dengan sopan, contoh: \"Saya menghargai data dari kubu lawan, namun mari kita lihat dari sudut pandang ini...\" secara tenang (*Economy of Words*). [Bermakna - Memahami]",
      "7. Contohkan ketukan palu sidang tunggal sebagai tanda waktu bicara habis. [Bermakna - Memahami]",
      "8. Bagikan kartu mosi dan beri waktu 3 menit bagi masing-masing kubu untuk merumuskan draf argumen tertulis. [Bermakna - Memahami]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "9. Undang anak mencoba secara mandiri: 'Silakan jalankan debat ini dipimpin oleh moderator terpilih.' [Menyenangkan]",
      "10. Anak melakukan debat secara berkelompok secara mandiri di bawah pengawasan guru. [Menyenangkan - Kerja Mandiri]",
      "11. Ketuk palu tanda debat berakhir dan minta semua anak bersalaman: 'Mari kembalikan posisi meja kursi kelas ke posisi semula.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "12. Lakukan diskusi recalling pasca-debat bersama anak-anak. [Berkesadaran - Merefleksikan]",
      "13. Apresiasi sikap dewasa anak-anak dalam menahan emosi dan saling bersalaman setelah debat usai. [Berkesadaran - Merefleksikan]",
      "14. Recalling Pengalaman: Tanyakan: 'Bagaimana perasaanmu saat argumenmu disanggah oleh teman? Bagaimana kamu mengendalikan emosimu?' [Berkesadaran - Merefleksikan]",
      "15. Internalisasi Nilai Islam (QS. An-Nahl: 125): Guru menjelaskan: 'Allah memerintahkan kita untuk membantah pendapat dengan cara yang terbaik (Jadal Billati Hiya Ahsan). Debat dalam Islam adalah mencari kebenaran bersama, bukan kebanggaan ego.' [Berkesadaran - Merefleksikan]",
      "16. Ajak anak berkomitmen menghargai perbedaan pendapat di kelas tanpa bermusuhan. [Berkesadaran - Mengaplikasikan]",
      "17. Tutup dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "18. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  },
  "Dialog & Percakapan (Dialogue)": {
    tool: "Kartu skenario peran bersosialisasi (Roleplay Cards), boneka tangan (opsional)",
    toolDisplay: "Kartu skenario peran bersosialisasi (Roleplay Cards), boneka tangan (opsional)",
    toolsList: ["Kartu skenario peran bersosialisasi", "Boneka tangan (opsional)"],
    prerequisites: "Kosakata dasar bahasa Indonesia dan pemahaman menyimak lisan.",
    directAim: "Melakukan dialog santun dua arah sesuai kartu skenario adab sosial sehari-hari dengan intonasi lembut.",
    indirectAim: "Membangun empati sosial, sopan santun (adab), dan kelancaran berkomunikasi praktis.",
    error: "Mengabaikan kontak mata dengan teman bicara, memotong dialog, atau menggunakan intonasi tidak sopan.",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang sepasang anak ke karpet dan katakan: 'Nak, hari ini kita akan bermain peran bagaimana cara berbicara dengan adab yang baik saat bertamu ke rumah guru atau meminjam barang teman.' [Berkesadaran]",
      "3. Siapkan karpet kerja bersih.",
      "4. Bawa wadah berisi kartu skenario dialog ke karpet. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru mengambil satu kartu skenario, misalnya: \"Meminta tolong meminjam penghapus\". [Bermakna - Memahami]",
      "6. Guru mencontohkan dialog santun dengan anak: kontak mata bersahabat, suara lembut, menggunakan kata \"tolong\" di awal, dan mengucapkan \"terima kasih\" di akhir secara diam (*Economy of Words*). [Bermakna - Memahami]",
      "7. Minta anak mempraktikkan ekspresi wajah tersenyum saat mengucapkan dialog tersebut. [Bermakna - Memahami]",
      "8. Guru membagikan kartu skenario peran lainnya kepada sepasang anak tersebut. [Bermakna - Memahami]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "9. Undang anak mempraktikkan dialog mandiri: 'Silakan bermain peran dialog bersama temanmu secara bergantian.' [Menyenangkan]",
      "10. Anak memperagakan dialog sosial di karpet secara berpasangan secara mandiri. [Menyenangkan - Kerja Mandiri]",
      "11. Kembalikan kartu skenario ke kotaknya secara rapi: 'Mari kembalikan karpet ke raknya.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "12. Evaluasi singkat bersama anak mengenai adab dialog lisan. [Berkesadaran - Merefleksikan]",
      "13. Apresiasi senyuman, kontak mata, dan kelembutan kata \"tolong/terima kasih\" yang diucapkan anak. [Berkesadaran - Merefleksikan]",
      "14. Recalling Pengalaman: Tanyakan: 'Bagaimana perasaanmu ketika temanmu berbicara dengan kata-kata yang lembut dan penuh adab?' [Berkesadaran - Merefleksikan]",
      "15. Internalisasi Nilai Islam (QS. Luqman: 19): Guru menyampaikan: 'Sederhanakanlah langkahmu dan lunakkanlah suaramu. Berbicara dengan suara yang tenang dan sopan adalah bagian dari keindahan adab seorang muslim.' [Berkesadaran - Merefleksikan]",
      "16. Ajak anak berkomitmen menggunakan kata \"tolong\" dan \"terima kasih\" dalam interaksi sekolah hari ini. [Berkesadaran - Mengaplikasikan]",
      "17. Tutup dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "18. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  },
  "Wawancara (Interviews)": {
    tool: "Lembar daftar pertanyaan wawancara (5W+1H), Papan Dada pencatat data, mikrofon mainan",
    toolDisplay: "Lembar daftar pertanyaan wawancara (5W+1H), Papan Dada pencatat data, mikrofon mainan",
    toolsList: ["Lembar daftar pertanyaan wawancara (5W+1H)", "Papan Dada pencatat data", "Mikrofon mainan"],
    prerequisites: "Lancar Dialog & Percakapan dan mampu menulis kalimat terstruktur.",
    directAim: "Mengajukan pertanyaan lisan secara terstruktur untuk menggali informasi dari narasumber dan mencatat jawabannya.",
    indirectAim: "Melatih keterampilan menyimak aktif (listening), adab bertanya kepada yang lebih tua, dan pengumpulan fakta logis.",
    error: "Pertanyaan melenceng dari topik wawancara atau memotong ucapan narasumber sebelum selesai.",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang anak dan katakan: 'Nak, hari ini kita akan menjadi jurnalis cilik. Kita akan mewawancarai Ustadz untuk mendapatkan info seputar kegiatan ramadhan.' [Berkesadaran]",
      "3. Siapkan area kursi narasumber di kelas.",
      "4. Bawa papan dada pencatat wawancara dan mikrofon mainan ke hadapan anak. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru menjelaskan format pertanyaan wawancara (Apa, Siapa, Di mana, Kapan, Mengapa, Bagaimana). [Bermakna - Memahami]",
      "6. Tunjukkan adab memulai wawancara: meminta izin narasumber secara sopan, memperkenalkan diri, dan mendengarkan jawaban narasumber tanpa memotong pembicaraan (*Economy of Words*). [Bermakna - Memahami]",
      "7. Tunjukkan cara mencatat jawaban narasumber secara cepat dalam bentuk poin-poin ringkas pada papan dada. [Bermakna - Memahami]",
      "8. Bimbing anak melatih ucapan pembuka wawancara: \"Selamat siang Ustadz, bolehkah saya meminta waktunya sebentar untuk...?\" [Bermakna - Memahami]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "9. Undang anak mempraktikkan wawancara mandiri: 'Silakan lakukan wawancara kepada narasumber targetmu secara mandiri.' [Menyenangkan]",
      "10. Anak menemui narasumber (guru/staf sekolah) secara mandiri, melakukan tanya jawab, dan mencatat datanya. [Menyenangkan - Kerja Mandiri]",
      "11. Kumpulkan lembar catatan hasil wawancara ke dalam map portofolio kelas: 'Mari kita rapi-rapi bersama.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "12. Guru mereview hasil wawancara lisan dan tertulis anak. [Berkesadaran - Merefleksikan]",
      "13. Apresiasi ketelitian anak mencatat jawaban narasumber dan kesopanannya saat mewawancarai staf sekolah. [Berkesadaran - Merefleksikan]",
      "14. Recalling Pengalaman: Tanyakan: 'Apa informasi baru yang kamu peroleh dari narasumber tadi? Bagaimana sikap narasumber saat kamu bertanya?' [Berkesadaran - Merefleksikan]",
      "15. Internalisasi Nilai Islam (QS. Al-Hujurat: 6): Guru menjelaskan: 'Mewawancarai dan mencatat jawaban melatih kita melakukan tabayyun (verifikasi informasi) agar berita yang kita sampaikan kelak adalah fakta yang benar dan jujur.' [Berkesadaran - Merefleksikan]",
      "16. Ajak anak berkomitmen selalu memverifikasi berita sebelum membagikannya kepada teman. [Berkesadaran - Mengaplikasikan]",
      "17. Tutup dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "18. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  },
  "Rumpun Kata (Word Families)": {
    tool: "Papan Pohon Rumpun Kata, kartu akar kata dasar (e.g. baca, tulis, sapu), kartu kata turunan berwarna-warni",
    toolDisplay: "Papan Pohon Rumpun Kata, kartu akar kata dasar (e.g. baca, tulis, sapu), kartu kata turunan berwarna-warni",
    toolsList: ["Papan Pohon Rumpun Kata", "Kartu akar kata dasar", "Kartu kata turunan berwarna-warni"],
    prerequisites: "Memahami konsep kata dasar dan imbuhan awalan/akhiran dasar.",
    directAim: "Mengelompokkan kata-kata turunan/jadian berdasarkan kesamaan akar kata dasarnya pada dahan pohon kata.",
    indirectAim: "Morfologi terstruktur, perluasan kosa kata fungsional, dan klasifikasi visual logis.",
    error: "Kartu kata turunan diletakkan pada dahan pohon kata dasar yang salah (misal: \"menyapu\" ditaruh di pohon \"tulis\").",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang anak ke karpet dan katakan: 'Nak, hari ini kita akan menanam Pohon Kata. Kita akan melihat bagaimana satu akar kata dasar yang kecil bisa bertumbuh menjadi pohon kata yang rimbun dengan banyak kata turunan.' [Berkesadaran]",
      "3. Siapkan karpet kerja utama di lantai.",
      "4. Bawa material Pohon Kata dan kartu kata turunan berwarna-warni ke karpet. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru menaruh kartu akar kata dasar \"b-a-c-a\" di bagian akar pohon utama di atas karpet. [Bermakna - Memahami]",
      "6. Ambil kartu kata jadian, misalnya \"membaca\". Tunjukkan cara meletakkannya di dahan pohon kata \"baca\" secara tenang (*Economy of Words*). [Bermakna - Memahami]",
      "7. Ambil kartu kata jadian \"pembaca\", \"bacaan\", \"dibaca\", lalu susun secara vertikal di dahan pohon tersebut. [Bermakna - Memahami]",
      "8. Minta anak mengeja kata turunan tersebut dan mencocokkannya secara visual dengan kata dasar di akar. [Bermakna - Memahami]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "9. Undang anak bermain mandiri: 'Apakah kamu ingin menyusun pohon kata dasarmu sendiri?' [Menyenangkan]",
      "10. Anak menyusun pohon rumpun kata secara mandiri. Setelah tersusun rapi di karpet, anak menggambar pohon kata tersebut di buku kotak dan menuliskan rumpun katanya secara berurutan. [Menyenangkan - Kerja Mandiri]",
      "11. Bimbing anak membereskan pohon kata dan memasukkan kartu kata ke dalam kotak sesuai abjad: 'Yuk, kita kembalikan ke rak agar selalu siap digunakan.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "12. Diskusi recalling kelompok kecil di karpet. [Berkesadaran - Merefleksikan]",
      "13. Apresiasi kerapian gambar pohon kata dan ketepatan pengelompokan kata turunan anak. [Berkesadaran - Merefleksikan]",
      "14. Recalling Pengalaman: Tanyakan: 'Dari satu kata dasar \"baca\" tadi, berapa banyak kata turunan baru yang berhasil kita temukan?' [Berkesadaran - Merefleksikan]",
      "15. Internalisasi Nilai Islam (QS. Ibrahim: 24): Guru menyampaikan: 'Kata yang baik laksana pohon yang baik, akarnya menghujam kuat ke bumi (kata dasar) dan dahannya menjulang ke langit (kata turunan). Kata dasar yang kokoh melahirkan makna luas yang bermanfaat.' [Berkesadaran - Merefleksikan]",
      "16. Ajak anak berkomitmen selalu membiasakan lisan mengucapkan kalimat thayyibah (kata yang baik). [Berkesadaran - Mengaplikasikan]",
      "17. Tutup dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "18. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  },
  "Pengenalan Objek Tidak Langsung (Indirect Object)": {
    tool: "Papan Analisis Kalimat (Sentence Analysis Chart), lingkaran subjek (hitam besar), predikat (merah), objek langsung (hitam sedang), objek tidak langsung (abu-abu sedang), panah pertanyaan",
    toolDisplay: "Papan Analisis Kalimat (Sentence Analysis Chart), lingkaran subjek (hitam besar), predikat (merah), objek langsung (hitam sedang), objek tidak langsung (abu-abu sedang), panah pertanyaan",
    toolsList: ["Papan Analisis Kalimat", "Lingkaran Subjek (Hitam Besar)", "Lingkaran Predikat (Merah)", "Lingkaran Objek Langsung (Hitam Sedang)", "Lingkaran Objek Tidak Langsung (Abu-abu Sedang)", "Panah pertanyaan"],
    prerequisites: "Lancar dalam struktur analisis kalimat S-P-O dasar (Direct Object).",
    directAim: "Menganalisis unsur Objek Tidak Langsung (Indirect Object) dalam kalimat menggunakan lingkaran abu-abu sedang.",
    indirectAim: "Pemahaman sintaksis lanjutan dan logika hubungan relasional subjek dengan penerima manfaat.",
    error: "Lingkaran abu-abu dipasangkan pada kata benda objek penderita langsung (Direct Object).",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang anak ke karpet kerja dan katakan: 'Nak, hari ini kita akan membedah kalimat yang sangat indah. Kita akan melihat bagaimana perbuatan baik subjek mengalirkan manfaat bagi orang lain.' [Berkesadaran]",
      "3. Siapkan karpet kerja utama di lantai.",
      "4. Bawa Papan Analisis Kalimat beserta kotak lingkaran simbol dan kartu kalimat ke atas karpet. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru meletakkan kartu kalimat di atas karpet: \"Ahmad memberikan buah kepada ibunya\". [Bermakna - Memahami]",
      "6. Ajukan pertanyaan predikat: 'Apakah tindakannya?' (memberikan -> letakkan lingkaran merah besar). Ajukan pertanyaan subjek: 'Siapa yang memberikan?' (Ahmad -> letakkan lingkaran hitam besar). [Bermakna - Memahami]",
      "7. Ajukan pertanyaan objek langsung: 'Apa yang diberikan?' (buah -> letakkan lingkaran hitam sedang di samping panah \"Apa?\"). [Bermakna - Memahami]",
      "8. Ajukan pertanyaan objek tidak langsung: 'Kepada siapa buah diberikan?' (kepada ibunya -> letakkan lingkaran abu-abu sedang di samping panah \"Kepada siapa?\") secara tenang (*Economy of Words*). [Bermakna - Memahami]",
      "9. Tunjukkan letak lingkaran abu-abu sebagai penerima manfaat perbuatan subjek. [Bermakna - Memahami]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "10. Undang anak mencoba secara mandiri: 'Silakan pilih kartu kalimat berikutnya dan bedahlah kalimatnya menggunakan simbol lingkaran.' [Menyenangkan]",
      "11. Anak membedah kalimat secara mandiri. Setelah menaruh simbol, anak menuliskan kalimat dan simbol tata bahasa tersebut di buku tulisnya menggunakan pensil warna. [Menyenangkan - Kerja Mandiri]",
      "12. Bimbing anak merapikan lingkaran kayu ke dalam kotaknya masing-masing: 'Mari simpan kembali dengan tertib ke dalam rak.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "13. Lakukan diskusi recalling bersama kelompok kecil tersebut di karpet. [Berkesadaran - Merefleksikan]",
      "14. Apresiasi ketelitian anak membedakan lingkaran hitam sedang (objek langsung) dengan lingkaran abu-abu (objek tidak langsung). [Berkesadaran - Merefleksikan]",
      "15. Recalling Pengalaman: Tanyakan: 'Dalam kalimat tadi, siapa yang menjadi penerima manfaat buah dari Ahmad?' [Berkesadaran - Merefleksikan]",
      "16. Internalisasi Nilai Islam (QS. Al-Isra: 7): Guru menjelaskan: 'Jika kamu berbuat baik, kebaikan itu mengalir untuk dirimu dan orang lain. Objek tidak langsung melambangkan aliran kebaikan dari perbuatan kita kepada sesama.' [Berkesadaran - Merefleksikan]",
      "17. Ajak anak bersyukur dengan berkomitmen memberikan bantuan kecil bagi temannya hari ini. [Berkesadaran - Mengaplikasikan]",
      "18. Tutup dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "19. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  },
  "Aturan Penggunaan Tanda Baca (Punctuation)": {
    tool: "Stempel tanda baca kayu (titik, koma, tanya, seru, kutip), kartu kalimat polos tanpa tanda baca, spidol warna",
    toolDisplay: "Stempel tanda baca kayu (titik, koma, tanya, seru, kutip), kartu kalimat polos tanpa tanda baca, spidol warna",
    toolsList: ["Stempel tanda baca kayu", "Kartu kalimat polos tanpa tanda baca", "Spidol warna"],
    prerequisites: "Lancar membaca buku bacaan tingkat dasar.",
    directAim: "Menempatkan tanda baca secara tepat pada kalimat polos menggunakan stempel tanda baca agar maknanya mudah dipahami.",
    indirectAim: "Melatih ketelitian menulis, kehati-hatian menyampaikan pesan agar tidak disalahpahami pembaca.",
    error: "Kalimat menjadi rancu maknanya atau salah intonasi membaca jika tanda baca tidak diletakkan tepat.",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang sekelompok anak dan katakan: 'Nak, hari ini kita akan bermain peran sebagai penengah kalimat. Kita akan menggunakan Stempel Tanda Baca untuk memberikan rambu-rambu agar kalimat kita nyaman dibaca.' [Berkesadaran]",
      "3. Siapkan karpet kerja bersih di lantai.",
      "4. Bawa kotak stempel tanda baca kayu dan set kartu kalimat polos ke atas karpet. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru membacakan satu kalimat polos tanpa tanda baca dengan datar dan cepat: \"ibubapaahmadpergikepasar\". [Bermakna - Memahami]",
      "6. Tunjukkan stempel tanda koma (,) dan titik (.). Jelaskan fungsinya untuk memberikan jeda dan menghentikan kalimat. [Bermakna - Memahami]",
      "7. Guru menstempel koma di antara \"ibu\" dan \"bapa\", serta titik di akhir kalimat secara tenang (*Economy of Words*). [Bermakna - Memahami]",
      "8. Minta anak membaca ulang kalimat tersebut dengan intonasi jeda yang tepat setelah distempel. [Bermakna - Memahami]",
      "9. Tunjukkan stempel tanda tanya (?) untuk kalimat bertanya dan tanda seru (!) untuk perintah. [Bermakna - Memahami]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "10. Undang anak mencoba secara mandiri: 'Silakan ambil kartu kalimat berikutnya, stempel tanda baca yang tepat, lalu salin ke dalam buku tulismu.' [Menyenangkan]",
      "11. Anak mengerjakan stempel tanda baca secara mandiri dan menyalin kalimatnya. [Menyenangkan - Kerja Mandiri]",
      "12. Bersihkan stempel kayu menggunakan tisu basah dan simpan ke kotaknya: 'Mari rapikan karpet kerja kita.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "13. Guru memeriksa salinan kalimat di buku tulis anak. [Berkesadaran - Merefleksikan]",
      "14. Apresiasi ketelitian anak menaruh tanda baca dan intonasi membacanya yang sudah berirama. [Berkesadaran - Merefleksikan]",
      "15. Recalling Pengalaman: Tanyakan: 'Apa yang terjadi pada cara kita membaca jika kalimat tidak memiliki tanda titik atau koma sama sekali?' [Berkesadaran - Merefleksikan]",
      "16. Internalisasi Nilai Islam (QS. Al-Muzzammil: 4): Guru menerangkan: 'Membaca Al-Qur'an diperintahkan secara perlahan dan berjeda (tartil). Tanda baca membantu lisan kita membaca secara tartil agar maknanya dipahami dengan benar tanpa terburu-buru.' [Berkesadaran - Merefleksikan]",
      "17. Ajak anak berkomitmen membaca buku dengan intonasi tartil hari ini. [Berkesadaran - Mengaplikasikan]",
      "18. Tutup dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "19. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  },
  "Aturan Penggunaan Huruf Kapital (Capitalization)": {
    tool: "Papan koreksi huruf kapital, kartu kalimat berlubang, spidol merah khusus",
    toolDisplay: "Papan koreksi huruf kapital, kartu kalimat berlubang, spidol merah khusus",
    toolsList: ["Papan koreksi huruf kapital", "Kartu kalimat berlubang", "Spidol merah khusus"],
    prerequisites: "Lancar membaca dan mengenal jenis-jenis nama diri (orang, kota, agama).",
    directAim: "Menuliskan huruf kapital pada posisi yang tepat (awal kalimat, nama diri, sebutan nama Allah) pada kartu latihan.",
    indirectAim: "Menghargai tata bahasa baku dan melatih adab penghormatan tertulis terhadap nama diri.",
    error: "Huruf kapital diletakkan di tengah-tengah kata biasa atau melewatkan huruf pertama awal kalimat.",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang sekelompok anak dan katakan: 'Nak, hari ini kita akan belajar tentang adab menuliskan nama. Kita akan menggunakan Spidol Merah untuk memberikan mahkota huruf besar (kapital) pada nama-nama mulia.' [Berkesadaran]",
      "3. Siapkan karpet kerja bersih di lantai.",
      "4. Bawa Papan Koreksi Huruf Kapital dan kartu latihan kalimat berhuruf kecil semua ke karpet. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru menunjukkan kartu kalimat: \"ahmad pergi ke kota samarinda bersama ayah\". [Bermakna - Memahami]",
      "6. Jelaskan aturan emas: Awal kalimat, nama orang, dan nama kota/tempat harus diawali Huruf Besar (Kapital). [Bermakna - Memahami]",
      "7. Guru melingkari huruf 'a' pada \"ahmad\" dan huruf 's' pada \"samarinda\" dengan spidol merah secara perlahan tanpa banyak bicara (*Economy of Words*). [Bermakna - Memahami]",
      "8. Tuliskan kembali bentuk huruf besar 'A' dan 'S' di atas lingkaran tersebut. [Bermakna - Memahami]",
      "9. Minta anak mencari kata nama diri lainnya pada kartu latihan berikutnya. [Bermakna - Memahami]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "10. Undang anak mencoba secara mandiri: 'Silakan temukan huruf yang harus dikapitalisasi pada kartu latihanmu secara mandiri.' [Menyenangkan]",
      "11. Anak mendeteksi dan menulis huruf kapital secara mandiri, lalu menyalin kalimat yang sudah dikoreksi ke buku tulisnya. [Menyenangkan - Kerja Mandiri]",
      "12. Lap papan koreksi dan susun kembali spidol ke dalam kotaknya: 'Mari kembalikan dengan rapi ke rak sentra.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "13. Guru mereview tulisan kalimat anak di buku. [Berkesadaran - Merefleksikan]",
      "14. Apresiasi ketelitian anak memberi huruf kapital pada nama orang dan nama kota. [Berkesadaran - Merefleksikan]",
      "15. Recalling Pengalaman: Tanyakan: 'Mengapa menulis nama orang harus menggunakan huruf besar di awalnya?' [Berkesadaran - Merefleksikan]",
      "16. Internalisasi Nilai Islam (QS. Al-Hujurat: 11): Guru menjelaskan: 'Memanggil orang lain harus dengan panggilan gelar yang baik. Menuliskan nama orang, tempat, atau sebutan nama Allah dengan huruf kapital merupakan wujud adab penghormatan tertulis kita.' [Berkesadaran - Merefleksikan]",
      "17. Ajak anak berkomitmen untuk selalu menuliskan namanya sendiri dan orang lain dengan huruf kapital yang benar mulai hari ini. [Berkesadaran - Mengaplikasikan]",
      "18. Tutup dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "19. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  },
  "Permainan Perintah Membaca (Reading Command Cards)": {
    tool: "Kotak Kartu Perintah Membaca berwarna merah (Command Cards)",
    toolDisplay: "Kotak Kartu Perintah Membaca berwarna merah (Command Cards)",
    toolsList: ["Kotak Kartu Perintah Membaca"],
    prerequisites: "Lancar membaca kata fonetik dasar (Seri Merah Muda & Biru).",
    directAim: "Membaca kartu instruksi perintah secara diam (silent reading) lalu memperagakan aksinya di depan kelas secara tepat.",
    indirectAim: "Pemahaman membaca fungsional komprehensif dan koordinasi gerak motorik aktif.",
    error: "Anak menyuarakan isi perintah secara lisan (membaca nyaring) padahal aturannya adalah membaca diam dan langsung bertindak.",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang anak secara individual/kelompok kecil dan katakan: 'Nak, hari ini kita akan bermain permainan rahasia. Bunda punya kartu merah berisi perintah. Kamu harus membacanya di dalam hati, lalu langsung melakukan perintahnya tanpa mengucapkan sepatah kata pun.' [Berkesadaran]",
      "3. Siapkan karpet kerja bersih.",
      "4. Bawa Kotak Kartu Perintah Membaca ke karpet. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru mengambil satu kartu perintah, membacanya secara diam di dalam hati (gerakan mata tertuju pada kartu, ekspresi fokus). [Bermakna - Memahami]",
      "6. Guru memperagakan aksi dari kartu tersebut secara sunyi: Guru berjalan ke rak buku, mengambil satu buku, dan meletakkannya di atas meja guru secara tenang (*Economy of Words*). [Bermakna - Memahami]",
      "7. Tunjukkan kartu perintah tersebut kepada anak agar ia membaca isinya: \"Ambil satu buku dan letakkan di meja\". [Bermakna - Memahami]",
      "8. Guru berkata: 'Apakah Bunda melakukan perintahnya dengan tepat? Ya, tanpa bersuara.' [Bermakna - Memahami]",
      "9. Berikan kartu perintah berikutnya kepada anak. [Bermakna - Memahami]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "10. Undang anak bermain mandiri: 'Silakan ambil kartu perintah rahasiamu secara mandiri.' [Menyenangkan]",
      "11. Anak mengambil kartu secara bergantian, membaca diam, lalu memperagakan gerakan aksinya di depan kelas secara mandiri sementara teman lainnya mengamati kesesuaian gerakan. [Menyenangkan - Kerja Mandiri]",
      "12. Masukkan kembali kartu perintah ke dalam kotak dan simpan kotak ke rak: 'Mari kita rapi-rapi bersama.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "13. Kumpulkan anak melingkar untuk evaluasi permainan. [Berkesadaran - Merefleksikan]",
      "14. Apresiasi kepatuhan anak menjalankan perintah rahasia secara tertib tanpa bersuara. [Berkesadaran - Merefleksikan]",
      "15. Recalling Pengalaman: Tanyakan: 'Perintah mana yang paling seru untuk kamu peragakan tadi? Mengapa kita tidak boleh membacanya keras-keras?' [Berkesadaran - Merefleksikan]",
      "16. Internalisasi Nilai Islam (QS. Al-A'raf: 204): Guru menjelaskan: 'Mendengarkan dan memperhatikan petunjuk tertulis secara seksama melatih sikap taat (Sami'na wa Atho'na) kita terhadap perintah kebaikan yang diperintahkan Allah dan Rasul-Nya.' [Berkesadaran - Merefleksikan]",
      "17. Ajak anak berkomitmen langsung sigap membantu jika dimintai tolong orang tua atau guru hari ini. [Berkesadaran - Mengaplikasikan]",
      "18. Tutup dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "19. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  },
  "Menulis Kalimat dan Paragraf Sederhana (Writing a Paragraph)": {
    tool: "Papan visual struktur paragraf (Gagasan Utama + Gagasan Penjelas), buku bergaris tiga, pensil warna",
    toolDisplay: "Papan visual struktur paragraf (Gagasan Utama + Gagasan Penjelas), buku bergaris tiga, pensil warna",
    toolsList: ["Papan visual struktur paragraf", "Buku bergaris tiga", "Pensil warna"],
    prerequisites: "Mahir menulis kalimat tunggal secara terstruktur.",
    directAim: "Menyusun satu paragraf sederhana yang terdiri atas satu gagasan utama (kalimat topik) dan minimal dua kalimat penjelas secara koheren.",
    indirectAim: "Melatih alur penalaran ide tertulis, kerapian struktur wacana, dan konsentrasi menulis karangan.",
    error: "Kalimat penjelas yang ditulis tidak mendukung gagasan utama paragraf (tidak koheren).",
    steps: [
      "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
      "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
      "2. Undang anak ke karpet dan katakan: 'Nak, hari ini kita akan membangun rumah paragraf. Kita akan menyusun kalimat utama sebagai fondasi atapnya, dan kalimat penjelas sebagai tiang penyokongnya.' [Berkesadaran]",
      "3. Siapkan karpet kerja bersih di lantai.",
      "4. Bawa papan visual struktur paragraf dan buku bergaris tiga ke atas karpet. [Berkesadaran]",
      "II. PRESENTASI INTI (Langkah Eksplorasi)",
      "5. Guru menunjukkan papan visual struktur paragraf: Kotak atas berisi \"Gagasan Utama\" (merah) dan kotak bawah berisi \"Gagasan Penjelas\" (biru). [Bermakna - Memahami]",
      "6. Guru menulis satu kalimat gagasan utama di kotak atas secara perlahan: \"Kelinci adalah hewan yang lincah\". [Bermakna - Memahami]",
      "7. Jelaskan bahwa kita butuh kalimat penjelas untuk menyokongnya. Tulis kalimat penjelas pertama di kotak bawah: \"Ia melompat ke sana kemari menggunakan kakinya yang kuat\". [Bermakna - Memahami]",
      "8. Tulis kalimat penjelas kedua: \"Ia juga sangat suka berlari kencang di rumput\". Tunjukkan keselarasan hubungan makna antar-kalimat tersebut secara tenang (*Economy of Words*). [Bermakna - Memahami]",
      "9. Gabungkan ketiga kalimat tersebut menjadi satu paragraf utuh di buku bergaris tiga menggunakan pensil. [Bermakna - Memahami]",
      "III. KERJA MANDIRI (Pijakan Saat Main)",
      "10. Undang anak mencoba secara mandiri: 'Silakan pilih satu topik kesukaanmu, tentukan gagasan utamamu, lalu susun paragraf penjelasmu sendiri di bukumu.' [Menyenangkan]",
      "11. Anak menulis paragraf sederhana secara mandiri di buku bergaris tiganya. Guru mendampingi kelurusan ide paragraf. [Menyenangkan - Kerja Mandiri]",
      "12. Rapikan kembali papan struktur paragraf ke dalam rak: 'Yuk, bereskan bersama alat tulis kita.' [Berkesadaran]",
      "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
      "13. Guru membaca hasil paragraf yang ditulis anak secara lisan. [Berkesadaran - Merefleksikan]",
      "14. Apresiasi kerapian struktur paragraf dan keselarasan makna antar-kalimat anak. [Berkesadaran - Merefleksikan]",
      "15. Recalling Pengalaman: Tanyakan: 'Apakah kalimat penjelasmu sudah bercerita mendukung kalimat utamamu tadi? Apa kesulitan merangkai kalimatnya?' [Berkesadaran - Merefleksikan]",
      "16. Internalisasi Nilai Islam (QS. Ibrahim: 24): Guru menerangkan: 'Paragraf yang baik laksana pohon yang rindang. Kalimat utama menyokong kalimat penjelas secara kokoh sehingga melahirkan wacana indah yang teduh dan bermanfaat bagi pembaca.' [Berkesadaran - Merefleksikan]",
      "17. Ajak anak berkomitmen menulis draf karangan pendek bertema kebaikan minggu ini. [Berkesadaran - Mengaplikasikan]",
      "18. Tutup dengan hamdalah bersama: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]",
      "19. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
    ]
  }
};

async function injectBahasaDetails() {
  try {
    console.log("Signing in with temporary admin account...");
    await signInWithEmailAndPassword(auth, "temp_admin@sditbudiluhursamarinda.sch.id", "temp_password_123");
    console.log("Authentication successful!");

    console.log("Fetching current 'bahasa' doc from Firestore...");
    const docRef = doc(db, 'kurikulum_pusat', 'bahasa');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error("Document 'kurikulum_pusat/bahasa' not found!");
      process.exit(1);
    }
    const currentData = docSnap.data();
    
    // Load the backup containing original steps
    console.log("Loading backup data from scratch/backup_bahasa_before_restruct.json...");
    const backupData = JSON.parse(fs.readFileSync('scratch/backup_bahasa_before_restruct.json', 'utf8'));
    const dbBI = backupData.subAreas.filter(sa => 
      ['lang_great_lessons', 'lang_spoken', 'lang_word_study', 'lang_grammar', 'lang_analysis', 'lang_write', 'lang_literature'].includes(sa.id)
    );
    
    // Maintain English sub-areas
    const englishSubAreas = currentData.subAreas.filter(sa => 
      ['lang_eng_word_study', 'lang_eng_write', 'lang_eng_literature'].includes(sa.id)
    );
    
    const newSubAreas = [];
    
    targetSubAreas.forEach(targetSa => {
      console.log(`Processing subarea: ${targetSa.name} (${targetSa.id})`);
      
      const levels = targetSa.levels.map(targetLvl => {
        let matchedPres = null;
        let matchedGrades = targetLvl.defaultGrades;
        
        // Check if it's one of the 18 new levels with custom steps
        const customMatch = newLevelsData[targetLvl.label];
        if (customMatch) {
          console.log(`  [CUSTOM INJECT] ${targetLvl.label}`);
          matchedPres = customMatch;
        } else {
          // Look in backup
          const match = findDbMatch(targetLvl.label, dbBI);
          if (match) {
            console.log(`  [RESTORE MATCH] ${targetLvl.label} -> matched: ${match.label}`);
            matchedGrades = match.grades || targetLvl.defaultGrades;
            
            // Reconstruct presentation object from match
            if (match.presentation) {
              const p = match.presentation;
              matchedPres = {
                tool: p.tool || "",
                toolDisplay: p.toolDisplay || p.tool || "",
                toolsList: p.toolsList || (p.tool ? [p.tool] : []),
                prerequisites: p.prerequisites || "",
                directAim: p.directAim || "",
                indirectAim: p.indirectAim || "",
                error: p.error || "",
                steps: p.steps || [],
                videoUrl: p.videoUrl || ""
              };
            }
          } else {
            console.log(`  [WARNING] No match & no custom steps found for: ${targetLvl.label}`);
          }
        }
        
        // Final fallback template to prevent UI crash
        const presentation = matchedPres || {
          tool: "",
          toolDisplay: "",
          toolsList: [],
          prerequisites: "Telah tuntas materi sebelumnya.",
          directAim: "Mempelajari konsep baru sesuai materi.",
          indirectAim: "Melatih konsentrasi, koordinasi, dan kemandirian.",
          error: "Pengecekan logis mandiri.",
          steps: [
            "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
            "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
            "2. Undang anak ke karpet kerja dan terangkan kegiatannya. [Berkesadaran]",
            "II. PRESENTASI INTI (Langkah Eksplorasi)",
            "3. Latih anak memahami konsep secara perlahan menggunakan material. [Bermakna - Memahami]",
            "III. KERJA MANDIRI (Pijakan Saat Main)",
            "4. Berikan kesempatan anak mencoba mandiri. [Menyenangkan - Kerja Mandiri]",
            "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
            "5. Tutup dengan mengucapkan hamdalah bersama. [Berkesadaran]"
          ],
          videoUrl: ""
        };
        
        return {
          label: targetLvl.label,
          grades: matchedGrades,
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
    
    const finalDocData = {
      ...currentData,
      subAreas: newSubAreas
    };
    
    console.log("Saving complete Bahasa Indonesia curriculum document with details to Firestore...");
    await setDoc(docRef, finalDocData);
    console.log("Success! Firestore collection 'kurikulum_pusat/bahasa' has been fully updated!");
    process.exit(0);
  } catch (err) {
    console.error("Migration injection script failed:", err);
    process.exit(1);
  }
}

injectBahasaDetails();
