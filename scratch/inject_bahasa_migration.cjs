const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/pages/CurriculumManager.jsx');
const content = fs.readFileSync(targetFile, 'utf8');

const existingMetadata = {
  "K1-K3: Cerita Besar 4: Sejarah Tulisan / The Story of Writing": {
    "prerequisites": "Kesiapan mendengarkan cerita dan rasa ingin tahu.",
    "directAim": "Memahami sejarah evolusi tulisan dari gambar prasejarah hingga alfabet modern.",
    "indirectAim": "Mensyukuri nikmat tulisan dan literasi sebagai penjaga ilmu.",
    "tool": "Gambar Sejarah Tulisan, Lempengan Tanah Liat",
    "quranVerse": "QS. Al-Alaq: 4",
    "quranMessage": "Allah mengajarkan manusia dengan perantara pena. Tulisan menjaga amanah ilmu."
  },
  "K2-K3: Permainan Tanya Jawab & Logika / Question & Logic Games": {
    "prerequisites": "Kosakata dasar dan pemahaman kalimat sederhana.",
    "directAim": "Menyusun pertanyaan logis untuk menebak objek tersembunyi.",
    "indirectAim": "Melatih berpikir kritis, adab bertanya, dan deduksi logis.",
    "tool": "Mystery Bag, Logic Cards",
    "quranVerse": "QS. Al-Baqarah: 33",
    "quranMessage": "Nabi Muhammad sering bertanya untuk memancing pemahaman sahabat. Bertanya dengan sopan adalah kunci ilmu."
  },
  "K2-K3: Resitasi Puisi & Syiar / Poetry & Nashid": {
    "prerequisites": "Kemampuan membaca lancar dan percaya diri berbicara.",
    "directAim": "Membaca puisi dengan intonasi, ekspresi, dan rima yang indah.",
    "indirectAim": "Melatih estetika suara dan menyampaikan pesan dakwah yang lembut.",
    "tool": "Buku Antologi Puisi, Alat Perkusi",
    "quranVerse": "QS. Asy-Syu’ara: 227",
    "quranMessage": "Penyair yang beriman menggunakan kata-kata indah untuk membela kebenaran dan dakwah."
  },
  "K3: Presentasi Proyek Mandiri / Public Speaking": {
    "prerequisites": "Menyelesaikan satu proyek riset mandiri.",
    "directAim": "Mempresentasikan hasil proyek secara lisan secara terstruktur di depan kelas.",
    "indirectAim": "Percaya diri berbicara di publik, melatih kontak mata, dan struktur pembuka-isi-penutup.",
    "tool": "Papan Proyek, Pointer",
    "quranVerse": "QS. An-Nahl: 125",
    "quranMessage": "Ajaklah manusia ke jalan Allah dengan hikmah dan cara terbaik. Ilmu harus disampaikan dengan amanah."
  },
  "K1: Studi Bunyi Gabungan (Phonograms) / Digraph Study": {
    "prerequisites": "Mengenal bunyi huruf tunggal.",
    "directAim": "Membaca dan menulis gabungan dua huruf konsonan (ng, ny, sy, kh).",
    "indirectAim": "Mempersiapkan membaca kata yang lebih kompleks.",
    "tool": "Kartu Phonogram Sandpaper, Miniatur Objek",
    "quranVerse": "QS. Al-Hujurat: 13",
    "quranMessage": "Dua huruf berbeda bersatu menciptakan bunyi indah, seperti manusia berbeda bersatu dalam ukhuwah."
  },
  "K1-K2: Menulis Tegak Bersambung (Sandpaper Cursive) / Cursive Writing": {
    "prerequisites": "Kelenturan tangan menggunakan Metal Insets.",
    "directAim": "Menulis huruf cursive tanpa terputus secara mengalir.",
    "indirectAim": "Keindahan tulisan tangan (Ihsan) dan koordinasi motorik halus.",
    "tool": "Huruf Raba Cursive, Nampan Garam",
    "quranVerse": "QS. Al-Qalam: 1",
    "quranMessage": "Pena melambangkan penjaga ilmu. Menulis dengan indah adalah wujud rasa syukur atas kelenturan tangan."
  },
  "K2-K3: Studi Imbuhan / Prefix & Suffix": {
    "prerequisites": "Memahami konsep kata dasar.",
    "directAim": "Memahami pengaruh imbuhan (awalan, akhiran) pada perubahan arti kata.",
    "indirectAim": "Melatih kepekaan tata bahasa dan perluasan makna kata.",
    "tool": "Kartu Kata Dasar (Merah), Kartu Imbuhan (Biru)",
    "quranVerse": "QS. Ibrahim: 24",
    "quranMessage": "Kata yang baik seperti pohon yang baik, akarnya kuat (kata dasar) dan cabangnya menjulang (imbuhan)."
  },
  "K1-K2: Tunggal & Jamak / Singular & Plural": {
    "prerequisites": "Mampu membaca kata dasar dan menghitung kuantitas.",
    "directAim": "Membedakan sebutan benda tunggal (satu) dan jamak (banyak).",
    "indirectAim": "Keteraturan mengklasifikasi jumlah benda.",
    "tool": "Objek Miniatur Tunggal/Jamak, Kartu Label",
    "quranVerse": "QS. Ali Imran: 103",
    "quranMessage": "Berjamaah menunjukkan kekuatan persatuan. Dalam Islam, berjamaah mendatangkan berkah yang lebih besar."
  },
  "K2-K3: Sinonim & Antonim / Synonyms & Antonyms": {
    "prerequisites": "Kosakata bahasa Indonesia dasar.",
    "directAim": "Memasangkan kata dengan arti yang mirip (sinonim) atau berlawanan (antonim).",
    "indirectAim": "Memperkaya pilihan kosakata untuk komunikasi yang lebih efektif.",
    "tool": "Kartu Sinonim & Antonim, Papan Pengelompokan",
    "quranVerse": "QS. Yasin: 36",
    "quranMessage": "Allah menciptakan segala sesuatu berpasang-pasangan (antonim) agar kita bersyukur dan seimbang."
  },
  "K2-K3: Kata Majemuk / Compound Words": {
    "prerequisites": "Memahami konsep gabungan kata.",
    "directAim": "Menggabungkan dua kata dasar terpisah menjadi satu kata baru dengan arti yang utuh.",
    "indirectAim": "Melatih logika semantik dan kreativitas kata.",
    "tool": "Kartu Kata Majemuk, Puzzle Kata",
    "quranVerse": "QS. Al-Ma’idah: 2",
    "quranMessage": "Dua kata bersatu membentuk makna baru, mengajarkan kita untuk saling bekerjasama (Ta’awun) dalam kebaikan."
  },
  "K3: Homonim, Homograf, Homofon / Homonyms & Homophones": {
    "prerequisites": "Memahami ejaan dan pembacaan kata dasar.",
    "directAim": "Membedakan kata yang ejaan/bunyinya sama tetapi artinya berbeda berdasarkan konteks.",
    "indirectAim": "Melatih sikap teliti dan Tabayyun (verifikasi) dalam memahami kalimat.",
    "tool": "Kartu Homonim, Label Gambar",
    "quranVerse": "QS. Al-Hujurat: 6",
    "quranMessage": "Memahami konteks kata melatih ketelitian kita untuk selalu memverifikasi (Tabayyun) informasi agar tidak salah paham."
  },
  "K1: English Phonics (Short/Long Vowels & CVC)": {
    "prerequisites": "Mengenal bunyi alfabet fonetis dasar.",
    "directAim": "Identify short and long vowel sounds and compose CVC words in English.",
    "indirectAim": "Build English pronunciation accuracy and early spelling skills.",
    "tool": "English Movable Alphabet, Object Boxes",
    "quranVerse": "QS. Ar-Rum: 22",
    "quranMessage": "Perbedaan bahasa di dunia adalah tanda kebesaran Allah. Mempelajari bunyi bahasa lain meluaskan silaturahim."
  },
  "K1-K2: English Spelling Patterns (Digraphs, Vowel Teams)": {
    "prerequisites": "Memahami kata fonetik CVC dasar.",
    "directAim": "Read and spell English words with digraphs (sh, ch, th) and vowel teams (ee, ea, oa).",
    "indirectAim": "Advance English reading stamina and vocabulary phonetics.",
    "tool": "Green Series Reading Cards, Digraph Folders",
    "quranVerse": "QS. Ar-Rahman: 4",
    "quranMessage": "Allah memberikan kemampuan manusia berbicara dengan fasih. Mengeja dengan baik membantu komunikasi yang jelas."
  },
  "K1-K2: Kata Benda (The Noun - Black Pyramid) / The Noun": {
    "prerequisites": "Mengenal nama benda di lingkungan sekitar.",
    "directAim": "Mengidentifikasi kata benda (Noun) dalam kalimat menggunakan simbol piramida hitam.",
    "indirectAim": "Memahami Noun sebagai dasar/pondasi dalam membangun kalimat.",
    "tool": "Simbol Noun (Piramida Hitam), Kartu Kata",
    "quranVerse": "QS. Al-Baqarah: 31",
    "quranMessage": "Allah mengajarkan nama-nama benda kepada Nabi Adam. Noun melambangkan pondasi pengenal semesta."
  },
  "K1-K2: Kata Kerja (The Verb - Red Sphere) / The Verb": {
    "prerequisites": "Memahami konsep kata benda.",
    "directAim": "Mengidentifikasi kata kerja (Verb) sebagai perwakilan aksi dalam kalimat menggunakan bola merah.",
    "indirectAim": "Memahami energi perbuatan (Amal) dalam struktur kalimat.",
    "tool": "Simbol Verb (Bola Merah), Action Cards",
    "quranVerse": "QS. Al-Kahf: 110",
    "quranMessage": "Kata kerja melambangkan aksi atau perbuatan (Amal). Setiap amal yang baik bernilai ibadah di sisi Allah."
  },
  "K1-K2: Kata Sandang (The Article - Small Light Blue Triangle) / The Article": {
    "prerequisites": "Memahami kata benda.",
    "directAim": "Menggunakan kata sandang (Article) yang tepat di depan kata benda menggunakan segitiga biru muda.",
    "indirectAim": "Melatih presisi bahasa dan adab penyebutan nama.",
    "tool": "Simbol Article (Segitiga Biru Muda)",
    "quranVerse": "QS. Al-Isra’: 70",
    "quranMessage": "Kata sandang membantu kita memuliakan sebutan orang (misalnya Si Ahmad) dengan adab yang baik."
  },
  "K2-K3: Kata Sifat (The Adjective - Medium Dark Blue Triangle) / The Adjective": {
    "prerequisites": "Memahami kata benda dan kata sandang.",
    "directAim": "Menerangkan sifat dari kata benda menggunakan simbol segitiga biru tua.",
    "indirectAim": "Melatih kepekaan visual, sensorik, dan deskripsi kata.",
    "tool": "Simbol Adjective (Segitiga Biru Tua)",
    "quranVerse": "QS. Al-A’raf: 180",
    "quranMessage": "Kata sifat membantu kita menjelaskan kualitas keindahan, sebagaimana Asmaul Husna menggambarkan kesempurnaan sifat Allah."
  },
  "K2-K3: Kata Keterangan (The Adverb - Small Orange Circle) / The Adverb": {
    "prerequisites": "Memahami kata kerja.",
    "directAim": "Menerangkan bagaimana sebuah tindakan dilakukan menggunakan simbol lingkaran oranye kecil.",
    "indirectAim": "Menghubungkan cara beramal yang terbaik (Ihsan) dalam keseharian.",
    "tool": "Simbol Adverb (Lingkaran Oranye Kecil)",
    "quranVerse": "QS. Al-Mulk: 2",
    "quranMessage": "Kata keterangan menjelaskan bagaimana suatu tindakan (Verb) dilakukan. Berusahalah melakukan segala sesuatu dengan cara terbaik (Ihsan)."
  },
  "K3: Preposisi (The Preposition - Green Bridge) / The Preposition": {
    "prerequisites": "Memahami kata benda dan hubungan ruang.",
    "directAim": "Mengidentifikasi kata depan (Preposition) yang menunjukkan posisi antar benda menggunakan jembatan hijau.",
    "indirectAim": "Memahami keteraturan letak dan batasan adil di alam semesta.",
    "tool": "Simbol Preposisi (Jembatan Hijau), Miniatur Boneka & Box",
    "quranVerse": "QS. Al-Hadid: 4",
    "quranMessage": "Preposisi menunjukkan posisi ruang. Di mana pun kita berada (preposisi), Allah selalu mengawasi kita."
  },
  "K3: Kata Ganti (The Pronoun - Large Purple Isosceles Triangle) / The Pronoun": {
    "prerequisites": "Memahami kata benda.",
    "directAim": "Menggantikan nama orang dengan kata ganti (Pronoun) yang tepat menggunakan segitiga ungu besar.",
    "indirectAim": "Melatih adab memanggil orang lain dengan panggilan kehormatan.",
    "tool": "Simbol Pronoun (Segitiga Ungu Besar)",
    "quranVerse": "QS. Al-Hujurat: 11",
    "quranMessage": "Gunakan kata ganti (Pronoun) yang paling sopan ketika berinteraksi, karena memanggil dengan gelar yang baik adalah adab muslim."
  },
  "K3: Kata Sambung (The Conjunction - Pink Bar) / The Conjunction": {
    "prerequisites": "Memahami struktur kalimat sederhana.",
    "directAim": "Menghubungkan kata atau klausa dalam kalimat menggunakan simbol balok merah muda.",
    "indirectAim": "Memahami nilai persatuan dan ukhuwah dalam bahasa.",
    "tool": "Simbol Konjungsi (Balok Pink)",
    "quranVerse": "QS. Al-Anfal: 63",
    "quranMessage": "Kata sambung menyatukan kata-kata terpisah menjadi kalimat yang indah, laksana Ukhuwah yang mempersatukan hati orang beriman."
  },
  "K3: Kata Seru (The Interjection - Gold Flower) / The Interjection": {
    "prerequisites": "Memahami ungkapan perasaan.",
    "directAim": "Mengekspresikan emosi menggunakan kata seru (Interjection) melalui lambang bunga emas.",
    "indirectAim": "Membiasakan lisan dengan Kalimat Thoyyibah dalam merespons kejadian.",
    "tool": "Simbol Interjection (Bunga Emas)",
    "quranVerse": "QS. Ibrahim: 23",
    "quranMessage": "Lidah adalah amanah. Biasakan mengucapkan kata seru yang baik (Kalimat Thoyyibah seperti Subhanallah, Masya Allah) saat terkejut atau gembira."
  },
  "K1-K2: Grammar Box II (Article & Noun)": {
    "prerequisites": "Level 1 (Noun) dan Level 3 (Article).",
    "directAim": "Memasangkan kata sandang dan kata benda secara presisi menggunakan wadah Grammar Box II.",
    "indirectAim": "Melatih klasifikasi warna kartu dan tata cara kerja yang tertib.",
    "tool": "Grammar Box II, Kartu Frasa",
    "quranVerse": "QS. Al-Infitar: 7",
    "quranMessage": "Penyusunan kartu yang teratur melatih ketertiban berpikir, sebagaimana Allah menciptakan fisik manusia dengan susunan yang seimbang."
  },
  "K1-K2: Grammar Box III (Adjective)": {
    "prerequisites": "Grammar Box II dan Level 4 (Adjective).",
    "directAim": "Memahami posisi kata sifat di antara kata sandang dan kata benda dalam frasa menggunakan Grammar Box III.",
    "indirectAim": "Melatih struktur sintaksis frasa nominal bilingual.",
    "tool": "Grammar Box III, Kartu Adjective",
    "quranVerse": "QS. Luqman: 20",
    "quranMessage": "Allah menyempurnakan nikmat-Nya bagi kita. Kata sifat menyempurnakan penjelasan benda agar nampak jelas keindahannya."
  },
  "K1-K2: Grammar Box IV (Verb)": {
    "prerequisites": "Grammar Box III dan Level 2 (Verb).",
    "directAim": "Memahami hubungan subjek (noun) dengan aksi (verb) menggunakan Grammar Box IV.",
    "indirectAim": "Membangun kesadaran struktur kalimat verbal dasar.",
    "tool": "Grammar Box IV, Kartu Verb",
    "quranVerse": "QS. Al-Kahf: 30",
    "quranMessage": "Siapa yang beriman dan beramal shalih (kata kerja aksi), Allah tidak akan menyia-nyiakan pahala perbuatannya."
  },
  "K2-K3: Grammar Box V (Preposition)": {
    "prerequisites": "Grammar Box IV dan Level 6 (Preposition).",
    "directAim": "Menghubungkan posisi kata benda satu dengan lainnya menggunakan preposisi lewat Grammar Box V.",
    "indirectAim": "Melatih ketepatan deskripsi spasial tertulis.",
    "tool": "Grammar Box V, Kartu Preposisi",
    "quranVerse": "QS. Al-Baqarah: 255",
    "quranMessage": "Allah mengetahui apa yang ada di depan mereka dan di belakang mereka. Preposisi menunjukkan batasan tempat dalam pengawasan Allah."
  },
  "K2-K3: Grammar Box VI (Adverb)": {
    "prerequisites": "Grammar Box V dan Level 5 (Adverb).",
    "directAim": "Memasangkan kata keterangan untuk memodifikasi kata kerja menggunakan Grammar Box VI.",
    "indirectAim": "Melatih ketelitian memodifikasi aksi secara tertulis.",
    "tool": "Grammar Box VI, Kartu Adverb",
    "quranVerse": "QS. Al-Ahzab: 21",
    "quranMessage": "Rasulullah adalah teladan terbaik. Kata keterangan mengajari kita bagaimana cara melakukan perbuatan meniru adab Nabi."
  },
  "K2-K3: Grammar Box VII (Pronoun)": {
    "prerequisites": "Grammar Box VI and Level 7 (Pronoun).",
    "directAim": "Mengganti kata benda berulang dalam frasa panjang dengan kata ganti menggunakan Grammar Box VII.",
    "indirectAim": "Melatih koherensi teks dan keefektifan penulisan.",
    "tool": "Grammar Box VII, Kartu Pronoun",
    "quranVerse": "QS. Al-Hujurat: 12",
    "quranMessage": "Gunakan kata ganti yang baik untuk menjaga kehormatan saudara kita. Menghindari pengulangan nama yang tidak perlu adalah bagian dari kesopanan."
  },
  "K3: Grammar Box VIII (Conjunction)": {
    "prerequisites": "Grammar Box VII dan Level 8 (Conjunction).",
    "directAim": "Menggabungkan dua klausa independen menjadi satu kalimat majemuk menggunakan Grammar Box VIII.",
    "indirectAim": "Melatih kemampuan menyusun kalimat majemuk setara.",
    "tool": "Grammar Box VIII, Kartu Konjungsi",
    "quranVerse": "QS. Al-Imran: 103",
    "quranMessage": "Berpegang teguhlah pada tali Allah dan jangan bercerai-berai. Konjungsi menyatukan kalimat yang terpisah."
  },
  "K3: Grammar Box IX (Interjection)": {
    "prerequisites": "Grammar Box VIII dan Level 9 (Interjection).",
    "directAim": "Menyisipkan kata seru ekspresif dalam kalimat dengan format tanda baca yang benar menggunakan Grammar Box IX.",
    "indirectAim": "Melatih penulisan tanda seru dan intonasi ekspresi.",
    "tool": "Grammar Box IX, Kartu Kata Seru",
    "quranVerse": "QS. Al-An’am: 32",
    "quranMessage": "Katakanlah kalimat thoyyibah saat terkejut atau kagum. Setiap ucapan emosi (Interjection) harus diniatkan untuk mengingat Allah."
  },
  "K2-K3: Waktu Kata Kerja / Verb Tenses (Past, Present, Future)": {
    "prerequisites": "Grammar Box IV (Verb).",
    "directAim": "Membedakan bentuk kata kerja berdasarkan dimensi waktu lampau, sekarang, dan masa depan.",
    "indirectAim": "Membangun kesadaran akan pentingnya memanfaatkan waktu hidup.",
    "tool": "Verb Tenses Timeline, Red Spheres",
    "quranVerse": "QS. Al-’Asr: 1-3",
    "quranMessage": "Demi masa, manusia berada dalam kerugian kecuali yang beramal shalih. Tenses waktu melatih kita menghargai setiap detik kehidupan."
  },
  "K2-K3: Dasar Analisis Kalimat / Sentence Analysis (Subject & Predicate)": {
    "prerequisites": "Memahami konsep Noun (Subject) dan Verb (Predicate).",
    "directAim": "Menganalisis dua unsur pokok kalimat (Siapa yang bertindak dan Apa tindakannya) menggunakan lingkaran analisis.",
    "indirectAim": "Membangun logika berpikir sistematis tentang subjek dan aksi.",
    "tool": "Piringan Lingkaran Subjek (Hitam) & Predikat (Merah)",
    "quranVerse": "QS. Al-Qamar: 49",
    "quranMessage": "Segala sesuatu Allah ciptakan dengan ukuran dan aturan yang rapi. Kalimat pun memiliki aturan dasar (Subjek-Predikat)."
  },
  "K2-K3: Struktur Kalimat S-P-O / Sentence Analysis (The Direct Object)": {
    "prerequisites": "Level 1 (Subject & Predicate).",
    "directAim": "Mengidentifikasi objek penderita (Direct Object) yang menerima aksi dari subjek menggunakan lingkaran hitam sedang.",
    "indirectAim": "Menganalisis hubungan sebab-akibat langsung dalam kalimat.",
    "tool": "Sentence Analysis Chart, Lingkaran Objek (Hitam Sedang)",
    "quranVerse": "QS. Al-An’am: 162",
    "quranMessage": "Kalimat SPO menunjukkan sasaran tindakan. Niatkan setiap perbuatan (aksi) kita agar memiliki sasaran kebaikan demi ridha Allah."
  },
  "K3: Kalimat Transitif & Intransitif / Transitive & Intransitive Verbs": {
    "prerequisites": "Level 2 (S-P-O).",
    "directAim": "Membedakan kata kerja yang memerlukan objek langsung (transitif) dan yang tidak memerlukan objek (intransitif).",
    "indirectAim": "Melatih presisi logika kebahasaan tertulis.",
    "tool": "Transitive/Intransitive Sorting Cards",
    "quranVerse": "QS. Fatir: 15",
    "quranMessage": "Kata kerja transitif membutuhkan objek untuk sempurna. Manusia adalah makhluk yang butuh (transitif) kepada Allah yang Maha Kaya."
  },
  "K3: Perluasan Keterangan / Sentence Analysis (Extensions)": {
    "prerequisites": "Level 2 (S-P-O).",
    "directAim": "Menganalisis perluasan keterangan (waktu, tempat, alat) dalam kalimat menggunakan lingkaran-lingkaran kecil berwarna.",
    "indirectAim": "Melatih rincian deskripsi kalimat secara logis.",
    "tool": "Sentence Analysis Extension Arrows & Circles",
    "quranVerse": "QS. Al-Muzzammil: 4",
    "quranMessage": "Membaca Al-Qur’an secara perlahan dan berurutan (tartil) melatih ketelitian kita memperinci setiap informasi dalam kalimat."
  },
  "K3: Kalimat Aktif & Pasif / Active & Passive Voice": {
    "prerequisites": "Level 2 (S-P-O).",
    "directAim": "Mengubah kalimat dari bentuk aktif (subjek melakukan aksi) menjadi pasif (subjek menerima aksi).",
    "indirectAim": "Memahami sudut pandang tindakan dari sisi pelaku maupun penerima.",
    "tool": "Active/Passive Sentence Strips",
    "quranVerse": "QS. Az-Zalzalah: 7-8",
    "quranMessage": "Setiap amal kebaikan (aktif) akan dibalas oleh Allah (pasif) secara adil. Kalimat aktif dan pasif mengajarkan keadilan timbal balik."
  },
  "K3: Analisis Terjemah Al-Quran / Quranic Grammatical Analysis": {
    "prerequisites": "Menguasai dasar analisis kalimat dan kelas kata.",
    "directAim": "Menganalisis kelas kata dan struktur gramatikal sederhana (I’rab dasar) pada terjemahan ayat Al-Qur’an.",
    "indirectAim": "Mendalami pemahaman teks suci secara sistematis.",
    "tool": "Ayat Strips, Grammar Symbols",
    "quranVerse": "QS. Al-Furqan: 32",
    "quranMessage": "Al-Qur’an diturunkan secara bertahap dan sistematis agar meneguhkan hati. Menganalisis kalimat suci mendekatkan kita pada kebenaran."
  },
  "K1: Persiapan Otot & Desain (Metal Insets) / The Metal Insets": {
    "prerequisites": "Kematangan koordinasi mata dan tangan dasar.",
    "directAim": "Menggambar pola garis sejajar dengan pensil di dalam bingkai cetakan logam secara presisi.",
    "indirectAim": "Melatih kekuatan tiga jari (Tripod Grip) dan kelenturan tangan untuk persiapan menulis.",
    "tool": "Metal Insets (Bingkai Logam & Bentuk), Kertas, Pensil Warna",
    "quranVerse": "QS. Al-Qalam: 1",
    "quranMessage": "Demi pena dan apa yang dituliskan. Melatih kekuatan tangan menulis adalah langkah awal menjaga kebaikan tertulis."
  },
  "K1: Menulis Tanpa Pensil (Alphabet Bergerak) / The Movable Alphabet": {
    "prerequisites": "Mengenal bunyi huruf sandpaper.",
    "directAim": "Menyusun huruf-huruf kayu membentuk kata secara fonetis tanpa menggunakan pensil.",
    "indirectAim": "Menerjemahkan ide pikiran dalam bentuk visual tulisan.",
    "tool": "Movable Alphabet Box (Kotak Huruf Kayu)",
    "quranVerse": "QS. Al-Baqarah: 31",
    "quranMessage": "Allah mengajari Adam nama-nama benda. Menyusun huruf menjadi kata melatih kita mengekspresikan pikiran dengan jujur."
  },
  "K2-K3: Menulis Kreatif / Creative Writing": {
    "prerequisites": "Lancar menulis tegak bersambung dan menyusun kata.",
    "directAim": "Menulis cerita pendek orisinal berdasarkan imajinasi atau gambar stimulus.",
    "indirectAim": "Mengembangkan imajinasi terstruktur dan ekspresi jiwa secara tertulis.",
    "tool": "Creative Writing Prompts, Jurnal Cerita",
    "quranVerse": "QS. Luqman: 27",
    "quranMessage": "Jika pohon di bumi menjadi pena dan laut menjadi tinta, tidak akan habis kalimat-kalimat Allah dituliskan. Tulislah kebaikan."
  },
  "K2-K3: Deskripsi Objek / Scientific Description": {
    "prerequisites": "Level 3 (Menulis Kreatif).",
    "directAim": "Menulis laporan pengamatan objektif mengenai ciri fisik suatu benda secara detail.",
    "indirectAim": "Melatih ketelitian sains, kejujuran menulis fakta, dan pemikiran ilmiah.",
    "tool": "Objek Alam (Daun, Batu, Kerang), Lembar Pengamatan",
    "quranVerse": "QS. Ali Imran: 191",
    "quranMessage": "Tafakkur alam melatih kita memikirkan ciptaan Allah. Menuliskan deskripsi objek secara jujur adalah bagian dari mencari kebenaran fakta."
  },
  "K2-K3: Menulis Surat / Letter Writing": {
    "prerequisites": "Mampu menulis kalimat terstruktur.",
    "directAim": "Menulis surat pribadi dengan format yang benar (tanggal, salam, isi, penutup) kepada kerabat.",
    "indirectAim": "Membangun hubungan sosial (Silaturahim) dan empati tertulis.",
    "tool": "Kertas Surat, Amplop, Kotak Pos Kelas",
    "quranVerse": "QS. An-Naml: 29-30",
    "quranMessage": "Surat Nabi Sulaiman kepada Ratu Bilqis diawali dengan Bismillah. Menulis surat yang baik mempererat tali persaudaraan (Silaturahim)."
  },
  "K3: Laporan Penelitian / Research Reports": {
    "prerequisites": "Mampu mengumpulkan data dari buku/ensiklopedia.",
    "directAim": "Menyusun laporan singkat hasil riset mandiri tentang topik geografi atau biologi.",
    "indirectAim": "Melatih disiplin akademis dan penyimpulan informasi.",
    "tool": "Ensiklopedia Anak, Template Laporan Penelitian",
    "quranVerse": "QS. Al-An’am: 11",
    "quranMessage": "Jelajahilah bumi dan amatilah. Laporan penelitian membiasakan kita mendokumentasikan kebenaran ilmiah secara amanah."
  },
  "K3: Gaya Bahasa / Style of Language (Fables, Myths & Legends)": {
    "prerequisites": "Level 3 (Menulis Kreatif) dan membaca mandiri.",
    "directAim": "Mengidentifikasi dan menulis cerita menggunakan majas personifikasi atau metafora sederhana.",
    "indirectAim": "Memahami variasi gaya bahasa dalam sastra lisan dan tulisan.",
    "tool": "Gaya Bahasa Matching Cards, Buku Cerita Rakyat",
    "quranVerse": "QS. Ar-Rahman: 1-4",
    "quranMessage": "Allah mengajarkan manusia pandai menjelaskan. Gaya bahasa yang indah memperlembut penyampaian dakwah."
  },
  "K3: Jurnal Refleksi & Kebaikan (Reflective Journaling)": {
    "prerequisites": "Menulis paragraf dasar.",
    "directAim": "Mensolusi catatan harian reflektif tentang perbuatan baik (amal shalih) yang dilakukan atau disaksikan.",
    "indirectAim": "Melatih introspeksi diri (Muhasabah) dan kesadaran spiritual.",
    "tool": "Jurnal Refleksi Kulit/Notebook khusus",
    "quranVerse": "QS. Al-Qiyamah: 14",
    "quranMessage": "Bahkan manusia menjadi saksi atas dirinya sendiri. Jurnal refleksi membantu kita bermuhasabah mengevaluasi niat dan amal."
  },
  "K1-K2: Dikte Fonetik Dasar / Phonetic Dictation": {
    "prerequisites": "Movable Alphabet dan membaca fonetik lancar.",
    "directAim": "Menuliskan kata/kalimat yang didiktekan guru secara ejaan fonetik yang tepat.",
    "indirectAim": "Menghubungkan suara yang didengar dengan simbol tertulis secara cepat.",
    "tool": "Lembar Dikte, Pensil biasa",
    "quranVerse": "QS. Al-Muzzammil: 4",
    "quranMessage": "Mendengarkan dengan khusyu dan menuliskan dengan teliti melatih kejujuran kita dalam menerima dan menyalin kebenaran berita."
  },
  "K2-K3: Kosakata Visual Berulang / High Frequency Words & English Journaling": {
    "prerequisites": "English Phonics dasar.",
    "directAim": "Write daily short sentences in English using high-frequency sight words (the, of, and, a, to, in).",
    "indirectAim": "Build comfort in daily English written journaling.",
    "tool": "Sight Words Flashcards, English Journal Notebook",
    "quranVerse": "QS. Al-Baqarah: 269",
    "quranMessage": "Barangsiapa dianugerahi hikmah, ia telah mendapat kebaikan yang banyak. Menulis jurnal bahasa asing memperluas jangkauan hikmah."
  },
  "K2-K3: Apresiasi Sastra & Puisi (Literature Appreciation)": {
    "prerequisites": "Lancar membaca buku bacaan tingkat dasar.",
    "directAim": "Membaca dan mengidentifikasi amanat kebaikan di dalam bait puisi/prosa pilihan.",
    "indirectAim": "Membangun rasa cinta pada keindahan bahasa sastra.",
    "tool": "Buku Sastra Pilihan, Lembar Apresiasi",
    "quranVerse": "QS. Luqman: 12",
    "quranMessage": "Hikmah adalah anugerah Allah yang mulia. Karya sastra yang baik menyimpan untaian hikmah untuk memperhalus pekerti."
  },
  "K2-K3: Membaca Interpretatif & Intonasi / Interpretive Reading & Intonation": {
    "prerequisites": "Membaca nyaring lancar.",
    "directAim": "Membaca dialog cerita dengan menyesuaikan intonasi, tanda baca, dan emosi karakter.",
    "indirectAim": "Meningkatkan pemahaman kontekstual teks dan ekspresi suara.",
    "tool": "Teks naskah drama pendek, Kartu Ekspresi",
    "quranVerse": "QS. Thaha: 44",
    "quranMessage": "Berbicaralah kepadanya dengan perkataan yang lemah lembut. Intonasi yang baik melatih kesopanan kita dalam berbicara."
  },
  "K3: Analisis Karakter & Plot Cerita / Character & Plot Analysis": {
    "prerequisites": "Lancar membaca buku cerita panjang.",
    "directAim": "Menganalisis sifat karakter utama dan urutan kejadian (awal, konflik, resolusi) dalam cerita.",
    "indirectAim": "Melatih cara berpikir analitis tentang sebab-akibat perbuatan karakter.",
    "tool": "Plot Mountain Diagram, Character Profile Cards",
    "quranVerse": "QS. Al-Hujurat: 12",
    "quranMessage": "Analisis karakter melatih kita mengamati tindakan orang lain secara objektif untuk diambil pelajarannya tanpa berprasangka buruk."
  },
  "K3: Log & Jurnal Membaca Mandiri / Independent Reading Log & Journal": {
    "prerequisites": "Kemampuan membaca buku mandiri.",
    "directAim": "Mencatat judul, penulis, jumlah halaman, dan ringkasan singkat dari buku yang dibaca secara konsisten.",
    "indirectAim": "Membiasakan budaya membaca mandiri secara disiplin.",
    "tool": "Buku Jurnal Membaca Mandiri (Reading Log)",
    "quranVerse": "QS. Al-’Alaq: 1",
    "quranMessage": "Bacalah dengan nama Tuhanmu yang menciptakan. Menjaga catatan membaca melatih disiplin menuntut ilmu secara mandiri."
  },
  "K3: Membaca Hikmah (I'tibar) & Pesan Moral / Reading for Reflection (I'tibar) & Moral Values": {
    "prerequisites": "Level 3 (Analisis Karakter).",
    "directAim": "Menarik hikmah (I’tibar) dan nilai moral dari buku bacaan untuk diterapkan dalam kehidupan sehari-hari.",
    "indirectAim": "Melatih refleksi diri dan internalisasi moral akhlak mulia.",
    "tool": "Reflective Prompt Cards, Buku Kisah Hikmah",
    "quranVerse": "QS. Yusuf: 111",
    "quranMessage": "Pada kisah-kisah mereka terdapat pelajaran (I’tibar) bagi orang yang berakal. Ambillah hikmah kisah masa lalu sebagai cermin diri."
  },
  "K2-K3: Kisah Sastra Global & Percakapan Dasar / English Tales & Conversations": {
    "prerequisites": "English Phonics dan kosa kata dasar.",
    "directAim": "Read short English moral stories and engage in basic conversational question-and-answer.",
    "indirectAim": "Foster confidence in speaking and understanding stories in English.",
    "tool": "English Tale Books (Illustrated), Dialogue Cards",
    "quranVerse": "QS. Ar-Rum: 22",
    "quranMessage": "Keragaman bahasa adalah tanda kebesaran Allah. Membaca sastra global meluaskan pandangan kita tentang dunia ciptaan Allah."
  }
};
const newLevelsMap = {
  "lang_spoken": [
    {
      "label": "K4-K5: Debat & Diskusi Panel / Debate & Panel Discussions",
      "grades": [
        "K4",
        "K5"
      ],
      "presentation": {
        "toolDisplay": "Palu Sidang (Moderator Gavel), Kartu Topik, Timer",
        "toolsList": [
          "Moderator Gavel",
          "Topic Cards",
          "Timer"
        ],
        "prerequisites": "Anak terbiasa berbicara di forum kelas dan mampu menyampaikan pendapat pribadi secara lisan.",
        "directAim": "Menyusun argumen logis secara lisan, mengemukakan pendapat terstruktur, dan menyanggah pendapat dengan sopan.",
        "indirectAim": "Kematangan emosional, menghargai perbedaan sudut pandang, dan keterampilan negosiasi.",
        "error": "Menyela pembicara lain tanpa izin moderator, atau menggunakan argumen personal (ad hominem).",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru mengundang anak: 'Mari kita belajar bermusyawarah dan mengemukakan pendapat dengan adab yang baik.'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru memperkenalkan tata tertib diskusi formal: ada pihak afirmasi (setuju), oposisi (menolak), dan moderator.",
          "4. Guru membagikan kartu topik yang dekat dengan kehidupan anak, misalnya: “Penggunaan Gawai di Sekolah” atau “Kewajiban Menjaga Lingkungan”.",
          "5. Guru mencontohkan cara menyanggah pendapat dengan sopan: 'Saya menghargai pendapatmu, namun mari kita lihat dari sisi ini...'",
          "6. Guru memandu jalannya simulasi debat singkat dengan mengetukkan palu sidang sebagai tanda pergantian giliran bicara.",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "7. Anak mencoba menyampaikan argumen terstruktur selama 1-2 menit berdasarkan topik yang didapat.",
          "8. Anak merangkum hasil diskusi secara lisan di akhir sesi.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "9. Internalisasi Nilai Islam (QS. An-Nahl: 125): Guru menjelaskan: 'Serulah manusia ke jalan Tuhanmu dengan hikmah dan pengajaran yang baik, serta bantahlah mereka dengan cara yang baik. Debat melatih kita berargumentasi dengan adab islami.'"
        ]
      }
    },
    {
      "label": "K5-K6: Seni Deklamasi & Pidato / Public Speaking & Oratory",
      "grades": [
        "K5",
        "K6"
      ],
      "presentation": {
        "toolDisplay": "Podium Mini, Mikrofon Mainan, Draf Pidato",
        "toolsList": [
          "Podium",
          "Microphone",
          "Speech Draft"
        ],
        "prerequisites": "Anak percaya diri berbicara di forum kelas dan mampu menulis esai singkat.",
        "directAim": "Berpidato secara persuasif dengan intonasi, nada suara, dan gestur tubuh yang tepat.",
        "indirectAim": "Kemampuan memimpin, memengaruhi audiens secara positif, dan menyebarkan kebaikan.",
        "error": "Berbicara terlalu cepat, membelakangi audiens, atau volume suara terlalu rendah.",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru mengajak anak berdiskusi: 'Bagaimana cara menyampaikan kebaikan kepada orang banyak dengan suara yang berwibawa?'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru menunjukkan draf pidato bertema akhlak mulia atau cinta tanah air.",
          "4. Guru mendemonstrasikan olah suara (vokal, jeda) dan teknik pernapasan saat berpidato.",
          "5. Guru mencontohkan posisi berdiri tegak, gerakan tangan yang alami, serta kontak mata yang ramah dengan audiens.",
          "6. Guru menjelaskan struktur pidato formal yang terdiri dari salam/pembuka, isi, dan penutup.",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "7. Anak berlatih berpidato di depan kelas menggunakan draf yang disiapkan.",
          "8. Teman-teman sekelas memberikan tepuk tangan apresiasi setelah penampilan selesai.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "9. Internalisasi Nilai Islam (QS. Thaha: 25-28): Guru menjelaskan: 'Doa Nabi Musa memohon kelapangan dada dan agar kekakuan lidahnya dilepaskan sehingga perkataannya dipahami. Pidato melatih kita menyampaikan kebenaran dengan lugas dan fasih.'"
        ]
      }
    }
  ],
  "lang_word_study": [
    {
      "label": "K4-K5: Etimologi & Asal-usul Kata / Etymology & Word Origins",
      "grades": [
        "K4",
        "K5"
      ],
      "presentation": {
        "toolDisplay": "Kartu Etimologi (Warna-warni berdasarkan asal bahasa), Kamus Besar Bahasa Indonesia (KBBI)",
        "toolsList": [
          "Etymology Cards",
          "Dictionary"
        ],
        "prerequisites": "Anak memahami konsep kata dasar dan kata berimbuhan.",
        "directAim": "Mengidentifikasi asal-usul kata serapan dalam Bahasa Indonesia dari bahasa asing (Arab, Sanskerta, Belanda, Inggris).",
        "indirectAim": "Memahami sejarah perkembangan bahasa, kekayaan budaya, dan keragaman linguistik.",
        "error": "Salah mengklasifikasikan asal bahasa serapan (misal: mengira kata serapan Arab berasal dari Belanda).",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru menunjukkan satu kata sehari-hari, misalnya: “Kertas” atau “Sabun”, lalu bertanya: 'Tahukah kamu dari mana asal kata ini?'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru menjelaskan bahwa Bahasa Indonesia banyak menyerap kata dari bahasa Arab (misal: kertas, sabun, adil), Sanskerta (misal: bahagia, loka), Belanda (misal: handuk, kantor), dan Inggris.",
          "4. Guru mencontohkan cara mencari asal-usul kata (etimologi) di dalam kamus.",
          "5. Guru meletakkan kartu kata asal di kolom yang sesuai dengan asal negara bahasa tersebut.",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak mencocokkan kartu kata serapan dengan kartu asal bahasanya.",
          "7. Anak mencari kata serapan tertentu di dalam buku bacaan mereka.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Al-Hujurat: 13): Guru menjelaskan: 'Allah menciptakan manusia berbangsa-bangsa untuk saling mengenal. Etimologi membuktikan adanya saling pengaruh dan hubungan erat antar bangsa.'"
        ]
      }
    },
    {
      "label": "K5-K6: Pembentukan Istilah & Neologisme / Terminology & Word Formation",
      "grades": [
        "K5",
        "K6"
      ],
      "presentation": {
        "toolDisplay": "Kartu Istilah Padanan, KBBI Digital/Cetak",
        "toolsList": [
          "Terminology Cards",
          "Dictionary"
        ],
        "prerequisites": "Anak mahir menggunakan kamus dan memahami tata bahasa dasar.",
        "directAim": "Memahami proses pembentukan istilah ilmiah baru (neologisme) di Bahasa Indonesia melalui penerjemahan, penyerapan, atau gabungan keduanya.",
        "indirectAim": "Mengembangkan keterampilan berpikir analitis dan kontribusi aktif pada perkembangan bahasa ilmiah.",
        "error": "Menghasilkan padanan kata yang tidak sesuai dengan kaidah pembentukan kata Bahasa Indonesia.",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru bertanya: 'Bagaimana kata baru seperti “unduh” (download) atau “unggah” (upload) diciptakan di Bahasa Indonesia?'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru menerangkan proses penerjemahan langsung (download menjadi unduh) dan penyerapan dengan penyesuaian ejaan (activity menjadi aktivitas).",
          "4. Guru menunjukkan kartu istilah bahasa asing dan meminta anak menebak padanannya dalam bahasa Indonesia.",
          "5. Guru mendiskusikan pentingnya menggunakan istilah bahasa Indonesia yang baku untuk menjaga identitas bangsa.",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak menjodohkan kartu istilah asing dengan istilah resmi bahasa Indonesia.",
          "7. Anak menulis kalimat pendek menggunakan istilah-istilah ilmiah yang baru dipelajari.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Ar-Rahman: 1-4): Guru menjelaskan: 'Allah mengajarkan manusia pandai berbicara dan menjelaskan. Kemampuan membentuk kata ilmiah baru adalah wujud perkembangan akal manusia.'"
        ]
      }
    }
  ],
  "lang_eng_word_study": [
    {
      "label": "K3-K4: English Word Families & Affixes (Prefixes & Suffixes)",
      "grades": [
        "K3",
        "K4"
      ],
      "presentation": {
        "toolDisplay": "English Prefix Cards (Blue), Base Word Cards (Red), Suffix Cards (Green)",
        "toolsList": [
          "Prefix Cards",
          "Base Word Cards",
          "Suffix Cards"
        ],
        "prerequisites": "Anak memahami kosa kata dasar bahasa Inggris.",
        "directAim": "Identify and form new English words using prefixes (un-, re-, dis-) and suffixes (-ful, -less, -ness).",
        "indirectAim": "Expand English vocabulary and understand word structures.",
        "error": "Creating non-existent English words (e.g., unactive instead of inactive).",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru menunjukkan kata “happy” dan berkata: 'If we add “un” in front of “happy”, it becomes “unhappy”, which means not happy.'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru menjelaskan fungsi awalan (prefix) yang mengubah makna kata menjadi berlawanan (un-, dis-) atau berulang (re-).",
          "4. Guru menjelaskan fungsi akhiran (suffix) yang dapat mengubah jenis kata (misal: kata sifat “kind” menjadi benda “kindness” dengan akhiran “-ness”).",
          "5. Guru menyusun kata di atas karpet: “un” + “happy” = “unhappy”, “use” + “ful” = “useful”.",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak menyusun kata-kata baru menggunakan kartu awalan, kata dasar, dan akhiran.",
          "7. Anak menuliskan arti kata baru tersebut di buku latihan.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Ibrahim: 24): Guru menjelaskan: 'Penambahan sedikit imbuhan mengubah makna secara luas, mengingatkan kita pada pentingnya berhati-hati dalam berucap karena setiap kata memiliki dahan akibat.'"
        ]
      }
    },
    {
      "label": "K4-K5: English Synonyms, Antonyms & Homophones",
      "grades": [
        "K4",
        "K5"
      ],
      "presentation": {
        "toolDisplay": "Homophone Matching Cards, Synonym-Antonym Sorting Mats",
        "toolsList": [
          "Homophone Cards",
          "Sorting Mats"
        ],
        "prerequisites": "Anak mengenal kosakata bahasa Inggris menengah.",
        "directAim": "Differentiate English words that sound the same but have different spellings and meanings (homophones), and group words by similar (synonyms) or opposite (antonyms) meanings.",
        "indirectAim": "Improve reading comprehension, spelling accuracy, and context clues analysis in English.",
        "error": "Confusing homophones in writing (e.g., writing “their” instead of “there” or “allowed” instead of “aloud”).",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru mengucapkan kata “write” dan “right” secara lisan, lalu bertanya: 'Do these words sound the same? Yes, but they are written differently!'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru menjelaskan konsep Homofon (same sound, different spelling/meaning) dengan menaruh kartu “there” dan “their”.",
          "4. Guru menjelaskan konsep Sinonim (similar meaning, e.g., large-huge) dan Antonim (opposite meaning, e.g., hot-cold) menggunakan papan pengelompokan.",
          "5. Guru membacakan kalimat pendek dan meminta anak memilih homofon yang benar untuk melengkapinya.",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak mencocokkan pasangan kartu homofon di atas karpet.",
          "7. Anak mengelompokkan kartu sinonim dan antonim pada kolom yang disediakan.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Fatir: 28): Guru menjelaskan: 'Allah menciptakan ciptaan-Nya beraneka ragam warna dan jenis. Sinonim dan antonim menggambarkan kekayaan variasi ciptaan-Nya dalam ranah bahasa.'"
        ]
      }
    },
    {
      "label": "K5-K6: English Etymology & Root Words (Latin & Greek Roots)",
      "grades": [
        "K5",
        "K6"
      ],
      "presentation": {
        "toolDisplay": "Root Word Trees (Greek roots in Green, Latin roots in Blue)",
        "toolsList": [
          "Root Word Trees",
          "Meaning Labels"
        ],
        "prerequisites": "Anak memahami konsep prefiks dan sufiks dalam bahasa Inggris.",
        "directAim": "Recognize common Latin and Greek root words (e.g., port, scrib/script, geo, bio, photo) and use them to decipher the meanings of unfamiliar words.",
        "indirectAim": "Develop advanced vocabulary skills, analytical thinking, and preparation for scientific terminology.",
        "error": "Incorrectly guessing a word’s meaning by ignoring the root’s historical definition.",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru menunjukkan kata “telephone” dan menjelaskan: 'In Greek, “tele” means far, and “phone” means sound. So it means far sound!'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru memaparkan akar kata Yunani (Greek) dan Latin yang banyak digunakan dalam bahasa Inggris ilmiah.",
          "4. Guru menyusun pohon akar kata (Root Word Tree), misalnya akar kata Latin “port” (to carry) yang membentuk kata “import”, “export”, “portable”.",
          "5. Guru mendiskusikan bagaimana ilmu pengetahuan berkembang melalui penggabungan konsep-konsep dasar ini.",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak mencocokkan akar kata dengan definisi aslinya.",
          "7. Anak mencari kata-kata lain yang menggunakan akar kata yang sama di dalam kamus.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Al-Hujurat: 13): Guru menjelaskan: 'Segala ilmu berasal dari Allah. Mempelajari akar kata sejarah bahasa membantu kita memetakan peradaban ilmiah demi kemaslahatan umat.'"
        ]
      }
    }
  ],
  "lang_grammar": [
    {
      "label": "K4-K5: Studi Mendalam Kata Benda & Kata Ganti / Advanced Nouns & Pronouns",
      "grades": [
        "K4",
        "K5"
      ],
      "presentation": {
        "toolDisplay": "Grammar Symbols (Wood/Plastic), Advanced Noun-Pronoun Classification Cards",
        "toolsList": [
          "Grammar Symbols",
          "Classification Cards"
        ],
        "prerequisites": "Anak memahami fungsi dasar kata benda (noun) dan kata ganti (pronoun) dari level sebelumnya.",
        "directAim": "Classify nouns into abstract/concrete, collective, and compound nouns; and analyze advanced pronouns (relative, reflexive, demonstrative) in sentences.",
        "indirectAim": "Enhance syntactic precision in speaking and writing, and prepare for complex sentence structure.",
        "error": "Incorrectly categorizing abstract nouns as adjectives or confusing relative pronouns with conjunctions.",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru meletakkan simbol segitiga hitam besar (Noun) dan segitiga ungu besar (Pronoun) di atas karpet.",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru menjelaskan konsep Kata Benda Abstrak (yang tidak bisa disentuh oleh panca indra, seperti kebahagiaan, keadilan) menggunakan kartu contoh.",
          "4. Guru menunjukkan Kata Ganti Refleksif (diriku, dirimu) dan Kata Ganti Penunjuk (ini, itu) dengan simbol ungu.",
          "5. Guru menyusun kalimat contoh: “Ia menghargai dirinya sendiri.” lalu meminta anak menaruh simbol di atas setiap kata.",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak mengelompokkan kartu kata benda ke dalam kolom konkret, abstrak, atau kolektif.",
          "7. Anak menandai jenis kata ganti dalam kalimat contoh di kartu kerja.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Al-A’raf: 180): Guru menjelaskan: 'Nama-nama terbaik (Asmaul Husna) adalah milik Allah. Memahami kata benda abstrak membantu kita merenungi sifat-sifat keagungan Allah yang tak nampak fisik.'"
        ]
      }
    },
    {
      "label": "K5-K6: Sintaksis & Jenis-jenis Kalimat / Advanced Sentence Structure & Moods",
      "grades": [
        "K5",
        "K6"
      ],
      "presentation": {
        "toolDisplay": "Sentence Construction Strips (Color-coded: Main clause in red, Subordinate clause in yellow), Conjunction Pins",
        "toolsList": [
          "Sentence Strips",
          "Conjunction Pins"
        ],
        "prerequisites": "Anak menguasai seluruh kelas kata (9 parts of speech) dan analisis dasar kalimat.",
        "directAim": "Identify and construct compound sentences (kalimat majemuk setara/bertingkat) and understand sentence moods (indicative, imperative, conditional).",
        "indirectAim": "Develop logical reasoning in written communication and precise language expression.",
        "error": "Confusing compound coordinate sentences with complex subordinate sentences.",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru mengajak anak berdiskusi: 'Bagaimana cara menggabungkan dua pikiran yang berbeda menjadi satu kalimat yang padu?'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru menunjukkan dua lajur kalimat mandiri (klausa utama), misalnya: “Hujan turun deras” dan “Kami tetap belajar”.",
          "4. Guru menyambungkan kedua lajur tersebut menggunakan kata hubung “tetapi” (kalimat majemuk setara) atau “meskipun” (kalimat majemuk bertingkat).",
          "5. Guru menjelaskan jenis modus kalimat: modus berita (indikatif), perintah (imperatif), dan pengandaian (kondisional).",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak merangkai kalimat majemuk menggunakan kartu klausa dan kartu konjungsi di atas karpet.",
          "7. Anak mengubah sebuah kalimat berita menjadi kalimat pengandaian (conditional mood).",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Al-Imran: 103): Guru menjelaskan: 'Keharmonisan struktur kalimat yang menyatukan klausa menggambarkan kekuatan persaudaraan (Ukhuwah) yang saling melengkapi.'"
        ]
      }
    }
  ],
  "lang_analysis": [
    {
      "label": "K4-K5: Analisis Logis Anak Kalimat / Logical Analysis of Clauses",
      "grades": [
        "K4",
        "K5"
      ],
      "presentation": {
        "toolDisplay": "Logical Analysis Chart (Large wooden circles and arrows representing clauses), Sentence Strips",
        "toolsList": [
          "Logical Analysis Chart",
          "Sentence Strips"
        ],
        "prerequisites": "Anak memahami analisis dasar kalimat (Subject, Predicate, Object, Extension).",
        "directAim": "Analyze the relationship between main clauses (induk kalimat) and subordinate clauses (anak kalimat) using Montessori logical analysis charts.",
        "indirectAim": "Develop logical thinking and ability to read and analyze complex texts.",
        "error": "Incorrectly identifying which clause is the dependent (subordinate) clause.",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru meletakkan papan Analisis Logis Anak Kalimat di tengah karpet.",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru membacakan kalimat: “Dia bersyukur ketika mendapat nikmat.”",
          "4. Guru bertanya: 'Apa aksi utamanya? Dia bersyukur (Induk Kalimat). Kapan dia bersyukur? Ketika mendapat nikmat (Anak Kalimat Keterangan Waktu).'",
          "5. Guru menunjukkan panah penghubung pada papan analisis yang menunjuk hubungan logis sebab, waktu, atau syarat.",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak menulis kalimat majemuk bertingkat di kartu kerja, lalu memotongnya menjadi klausa-klausa.",
          "7. Anak menaruh potongan klausa tersebut di atas lingkaran papan Analisis Logis.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Ibrahim: 7): Guru menjelaskan: 'Terdapat hubungan logis mutlak antara syukur (sebab/klausa syarat) dengan pertambahan nikmat (akibat/induk kalimat) sesuai janji Allah.'"
        ]
      }
    },
    {
      "label": "K5-K6: Diagramming & Struktur Sintaksis Kompleks / Sentence Diagramming",
      "grades": [
        "K5",
        "K6"
      ],
      "presentation": {
        "toolDisplay": "Diagramming Board, Colored Chalks/Pens, Ruler",
        "toolsList": [
          "Diagramming Board",
          "Drawing Tools"
        ],
        "prerequisites": "Anak memahami kelas kata dan analisis logis anak kalimat.",
        "directAim": "Create visual diagrams of complex sentences to show the relationships between subjects, verbs, modifiers, and clauses.",
        "indirectAim": "Visual representation of abstract grammar rules and enhanced syntax analysis.",
        "error": "Drawing modifier lines attached to the wrong words (e.g., attaching an adjective modifier to the verb).",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru menulis satu kalimat sederhana di papan tulis: “Anak yang rajin itu sedang membaca Al-Qur’an.”",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru menggambar garis dasar horizontal dan membaginya dengan garis vertikal untuk memisahkan Subjek (Anak) dan Predikat (sedang membaca).",
          "4. Guru menunjukkan cara menaruh kata sifat (rajin) dan kata sandang (itu) di bawah kata benda yang diterangkannya menggunakan garis miring.",
          "5. Guru mendemonstrasikan cara membuat garis bercabang untuk kalimat majemuk bertingkat.",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak mencoba menggambar diagram kalimat pilihan mereka di papan tulis.",
          "7. Anak mendiskusikan kebenaran letak cabang kata bersama teman sebaya.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Al-Infitar: 7): Guru menjelaskan: 'Keteraturan visual dalam diagram sintaksis merefleksikan Sunnatullah, yaitu hukum keteraturan presisi yang Allah ciptakan di semesta.'"
        ]
      }
    }
  ],
  "lang_write": [
    {
      "label": "K4-K5: Penulisan Esai Ekspositori & Argumentatif / Expository & Argumentative Essays",
      "grades": [
        "K4",
        "K5"
      ],
      "presentation": {
        "toolDisplay": "Essay Outline Templates, Graphic Organizers (Introduction-Body-Conclusion)",
        "toolsList": [
          "Essay Outline",
          "Graphic Organizers"
        ],
        "prerequisites": "Anak mampu menulis paragraf terstruktur dan terbiasa dengan diskusi topik.",
        "directAim": "Write structured expository and argumentative essays with an introduction (thesis statement), body paragraphs (evidence), and a conclusion.",
        "indirectAim": "Develop critical thinking, persuasive writing skills, and logical reasoning.",
        "error": "Writing essays without a clear thesis statement, or lacking evidence for claims.",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru menerangkan: 'Esai adalah cara kita menuangkan pikiran kritis secara tertulis agar dipahami orang lain.'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru mengenalkan struktur esai 3 bagian: Tesis/Pembuka, Argumen/Isi, dan Kesimpulan/Penutup.",
          "4. Guru mencontohkan cara membuat kalimat pernyataan tesis (thesis statement) yang kuat dan terukur.",
          "5. Guru mengajarkan pentingnya menyertakan fakta/bukti yang jujur (Shiddiq) untuk mendukung argumen.",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak mengisi pengatur grafis (graphic organizer) untuk merencanakan tulisan mereka.",
          "7. Anak menulis draf kasar esai mereka berdasarkan outline yang dibuat.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Al-Ahzab: 70): Guru menjelaskan: 'Ucapkanlah perkataan yang benar dan jujur (Shiddiq) dalam argumentasi esai, agar tulisan membawa kemaslahatan nyata.'"
        ]
      }
    },
    {
      "label": "K5-K6: Karya Ilmiah & Jurnalistik / Research Paper & Journalistic Writing",
      "grades": [
        "K5",
        "K6"
      ],
      "presentation": {
        "toolDisplay": "Research Journal Notebook, Bibliography Guide, News Outline Sheets",
        "toolsList": [
          "Notebook",
          "Writing Guides"
        ],
        "prerequisites": "Anak mahir menulis esai dan menggunakan media riset dasar (buku/sumber digital).",
        "directAim": "Conduct simple research, write a bibliography, and draft journalistic articles using the 5W+1H framework.",
        "indirectAim": "Develop academic writing discipline, information filtering (tabayyun), and reporting skills.",
        "error": "Plagiarizing text without citation, or writing news reports that mix facts with personal opinions.",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru mengenalkan profesi wartawan dan peneliti: 'Tugas mereka adalah mencari fakta yang benar dan menyampaikannya secara jujur.'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru mengajarkan konsep Tabayyun (verifikasi informasi) sebelum menulis sebuah berita.",
          "4. Guru memaparkan kerangka berita 5W+1H (Apa, Siapa, Kapan, Di mana, Mengapa, Bagaimana) menggunakan contoh koran sekolah.",
          "5. Guru menunjukkan cara menulis daftar pustaka (bibliography) untuk menghargai karya orang lain.",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak mewawancarai teman atau guru, lalu menuliskan berita pendek berdasarkan wawancara tersebut.",
          "7. Anak menulis laporan penelitian mini dengan kutipan sumber yang jelas.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Al-Hujurat: 6): Guru menjelaskan: 'Pentingnya memeriksa kebenaran kabar (Tabayyun) sebelum menyebarkannya, agar kita tidak mendatangkan bahaya bagi orang lain.'"
        ]
      }
    }
  ],
  "lang_eng_write": [
    {
      "label": "K3-K4: Paragraph Structure & Narrative Writing in English",
      "grades": [
        "K3",
        "K4"
      ],
      "presentation": {
        "toolDisplay": "Paragraph Hamburger Organizer (Visual model: Bun, Meat, Veggies, Bun), Narrative Planner",
        "toolsList": [
          "Paragraph Graphic Organizer",
          "Narrative Planner"
        ],
        "prerequisites": "Anak memahami pembentukan kalimat bahasa Inggris sederhana.",
        "directAim": "Construct a structured English paragraph with a topic sentence, supporting details, and a concluding sentence; and write a simple narrative story.",
        "indirectAim": "Foster creative thinking and enhance coherence in writing in a foreign language.",
        "error": "Writing disconnected sentences without a clear main topic or logical flow.",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru berkata: 'Today, let’s build a paragraph together like a hamburger! The top bun is the main idea, the fillings are details, and the bottom bun holds it together.'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru menerangkan fungsi Topic Sentence (kalimat pembuka), Supporting Sentences (kalimat penjelas), dan Concluding Sentence (kalimat penutup).",
          "4. Guru menyusun kalimat-kalimat teracak di atas karpet dan meminta anak mengurutkannya menjadi paragraf yang baik.",
          "5. Guru membimbing anak menuliskan awal cerita narasi: “Once upon a time...”",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak menulis satu paragraf tentang kegiatan kesukaan mereka menggunakan Hamburger Organizer.",
          "7. Anak menggambar ilustrasi kecil untuk melengkapi cerita narasi mereka.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Al-Hujurat: 13): Guru menjelaskan: 'Menulis narasi dalam bahasa Inggris melatih kita menyebarkan kisah-kisah penuh hikmah kepada umat manusia di belahan dunia lain.'"
        ]
      }
    },
    {
      "label": "K4-K5: English Letter Writing & E-mail Etiquette",
      "grades": [
        "K4",
        "K5"
      ],
      "presentation": {
        "toolDisplay": "Letter Writing Templates, Envelopes, Stamps, Sample E-mails",
        "toolsList": [
          "Writing Templates",
          "Sample E-mails"
        ],
        "prerequisites": "Anak dapat menulis paragraf bahasa Inggris terstruktur.",
        "directAim": "Write formal and informal letters in English using correct formatting (heading, greeting, body, closing, signature) and understand basic polite e-mail etiquette.",
        "indirectAim": "Develop professional communication skills, courtesy, and digital literacy.",
        "error": "Using overly informal language (slang) in a formal letter or omitting key address/greeting fields.",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru bertanya: 'How do we write a polite message to someone who is far away?'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru menunjukkan perbedaan struktur surat tidak resmi (untuk teman) dan surat resmi (untuk sekolah/kantor) dalam bahasa Inggris.",
          "4. Guru menjelaskan bagian-bagian surat: Salutation (Dear...), Body of Letter, dan Sign-off (Sincerely yours, Warm regards).",
          "5. Guru menerangkan adab mengirim surel (e-mail etiquette): mengisi baris subjek dengan jelas, serta menyapa penerima dengan sopan.",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak menulis surat bahasa Inggris kepada sahabat mereka dan melipatnya ke dalam amplop.",
          "7. Anak menyimulasikan penulisan surel formal kepada kepala sekolah di lembar kerja.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. An-Naml: 29-30): Guru menjelaskan: 'Rasulullah mengajarkan kita bertutur kata sopan. Menulis surat atau email dengan adab yang baik mencerminkan keluhuran akhlak mulia.'"
        ]
      }
    },
    {
      "label": "K5-K6: English Expository Writing & Mini Research Presentation",
      "grades": [
        "K5",
        "K6"
      ],
      "presentation": {
        "toolDisplay": "English Research Cards, Presentation Poster Boards, Markers",
        "toolsList": [
          "Research Cards",
          "Poster Boards"
        ],
        "prerequisites": "Anak terbiasa menulis cerita pendek dan memahami konsep surat dalam bahasa Inggris.",
        "directAim": "Research a factual topic (e.g., an animal or a country) and write a short expository report in English, then present the findings to the class.",
        "indirectAim": "Foster independent inquiry, presentation confidence, and synthesis of information in a second language.",
        "error": "Copying sentences directly from sources (plagiarism) without understanding or putting them in their own words.",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru berkata: 'Today, you are going to be researchers! We will discover facts about a topic and share it in English.'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru menjelaskan konsep Menulis Ekspositori (menjelaskan fakta secara objektif tanpa opini).",
          "4. Guru menunjukkan cara mengumpulkan informasi dari kartu ensiklopedia anak.",
          "5. Guru mengajarkan cara menyusun fakta ke dalam poin-poin utama di papan poster.",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak menulis laporan mini bertema kebudayaan atau sains dalam bahasa Inggris.",
          "7. Anak mempresentasikan poster laporan mereka di hadapan teman sekelas dengan suara percaya diri.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Al-An’am: 11): Guru menjelaskan: 'Mengeksplorasi bumi dan mencatat fakta sains (expository) melatih sikap jujur (Shiddiq) dalam mendokumentasikan kebenaran.'"
        ]
      }
    }
  ],
  "lang_literature": [
    {
      "label": "K4-K5: Apresiasi Novel Anak & Cerita Rakyat / Novel & Folklore Appreciation",
      "grades": [
        "K4",
        "K5"
      ],
      "presentation": {
        "toolDisplay": "Children’s Novel (Buku Sastra Anak Pilihan), Folklore Cards",
        "toolsList": [
          "Children's Novels",
          "Folklore Cards"
        ],
        "prerequisites": "Anak lancar membaca buku cerita bergambar dan memahami unsur intrinsik sederhana.",
        "directAim": "Read and discuss selected children’s novels and Indonesian folklores, identifying cultural backgrounds, moral values, and character development.",
        "indirectAim": "Instill a love for reading, empathy through character perspectives, and appreciation of cultural heritage.",
        "error": "Summarizing plot only without analyzing the characters’ motivations or the story’s moral lesson.",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru memegang buku novel anak pilihan: 'Buku ini mengajak kita berkelana ke dunia petualangan yang mengajarkan persahabatan.'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru menjelaskan perbedaan antara cerita rakyat (folklore) yang diwariskan turun-temurun dan novel anak modern.",
          "4. Guru mengajak anak membaca satu bab bersama-sama dengan intonasi yang hidup.",
          "5. Guru mendiskusikan latar budaya dan amanat moral cerita: 'Mengapa tokoh utama bersikap demikian? Apa yang bisa kita teladani?'",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak menuliskan ringkasan plot cerita rakyat dalam bentuk peta pikiran (mind map).",
          "7. Anak menggambarkan watak tokoh utama berdasarkan tindakan dan ucapannya di dalam cerita.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Yusuf: 111): Guru menjelaskan: 'Pada kisah-kisah mereka terdapat pelajaran (I’tibar) bagi orang yang berakal. Menarik hikmah dari sastra membantu kelembutan akhlak kita.'"
        ]
      }
    },
    {
      "label": "K5-K6: Kajian Kritis & Resensi Buku / Critical Book Review",
      "grades": [
        "K5",
        "K6"
      ],
      "presentation": {
        "toolDisplay": "Book Review Templates, Sample Resensi, Library Books",
        "toolsList": [
          "Book Review Templates",
          "Sample Reviews"
        ],
        "prerequisites": "Anak terbiasa membaca buku bab (chapter books) mandiri dan menulis esai.",
        "directAim": "Analyze a book critically and write a book review including synopsis, evaluation of strengths/weaknesses, and recommendation.",
        "indirectAim": "Develop critical thinking, evaluative judgment, and formal academic expression.",
        "error": "Writing a book review that is only a summary of the story without any critical analysis or evaluation.",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru menunjukkan resensi buku di koran/majalah: 'Ini adalah cara pembaca memberikan penilaian jujur terhadap sebuah buku.'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru memaparkan komponen resensi buku: Judul resensi, data buku, sinopsis singkat, kelebihan/kekurangan, dan kesimpulan.",
          "4. Guru mencontohkan cara menilai bahasa yang digunakan penulis: 'Apakah bahasanya mudah dipahami? Apakah alurnya menarik?'",
          "5. Guru menekankan pentingnya memberikan kritik dengan bahasa yang sopan dan jujur (Shiddiq).",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak memilih satu buku yang sudah selesai dibaca, lalu menulis draf resensi buku.",
          "7. Anak membacakan resensi mereka di depan kelompok membaca kelas.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Al-Hujurat: 12): Guru menjelaskan: 'Memberikan penilaian kritis (review) harus berlandaskan kejujuran (Shiddiq) dan objektivitas, bukan prasangka buruk atau menjatuhkan.'"
        ]
      }
    }
  ],
  "lang_eng_literature": [
    {
      "label": "K3-K4: Reading English Fables & Moral Stories",
      "grades": [
        "K3",
        "K4"
      ],
      "presentation": {
        "toolDisplay": "Illustrated English Fable Books, Moral Value Cardboards",
        "toolsList": [
          "Fable Books",
          "Moral Cards"
        ],
        "prerequisites": "Anak mengenal kosakata bahasa Inggris dasar.",
        "directAim": "Read and comprehend simple English fables (e.g., Aesop’s fables) and identify the moral lesson of the story.",
        "indirectAim": "Build English vocabulary, improve reading comprehension, and reflect on ethical values.",
        "error": "Understanding the literal text but failing to extract the hidden moral lesson.",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru menunjukkan gambar kura-kura dan kelinci: 'Do you know the story of the tortoise and the hare? Let’s read it in English!'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru membacakan fabel bahasa Inggris secara perlahan dengan ekspresi wajah yang mendramatisasi cerita.",
          "4. Guru mengajak anak menebak arti kata-kata sulit dari konteks kalimat (context clues).",
          "5. Guru mendiskusikan pelajaran moral di akhir cerita: 'Why did the hare lose? Because he was boasting.'",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak mencocokkan potongan gambar cerita fabel dengan kalimat deskripsi bahasa Inggris yang sesuai.",
          "7. Anak menulis ulang pesan moral fabel tersebut di buku gambar.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Luqman: 19): Guru menjelaskan: 'Berjalanlah dengan sederhana dan lunakkanlah suaramu. Fabel kura-kura melatih sikap tawadhu (rendah hati) menghindari sifat sombong.'"
        ]
      }
    },
    {
      "label": "K4-K5: English Poetry & Creative Wordplay",
      "grades": [
        "K4",
        "K5"
      ],
      "presentation": {
        "toolDisplay": "English Poetry Anthology, Acrostic Worksheets, Colored Pens",
        "toolsList": [
          "Poetry Anthology",
          "Acrostic Worksheets"
        ],
        "prerequisites": "Anak memahami sajak sederhana dan memiliki kosakata bahasa Inggris menengah.",
        "directAim": "Read, write, and appreciate simple English poems (rhymes, acrostic poems, haiku) and experiment with wordplay.",
        "indirectAim": "Enhance phonological awareness, express feelings creatively, and build aesthetic sensitivity in English.",
        "error": "Writing lines that do not follow the rhythmic structure or acrostic rule selected.",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru membacakan satu puisi rima bahasa Inggris: 'Twinkle, twinkle, little star, how I wonder what you are...'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru menjelaskan konsep Rima (rhyming words, e.g., star-are) dalam puisi bahasa Inggris.",
          "4. Guru mendemonstrasikan cara menyusun Acrostic Poem (puisi yang huruf awal barisnya membentuk kata tertentu, misal: S-T-A-R).",
          "5. Guru mencontohkan pelafalan puisi dengan nada suara naik-turun yang dramatis.",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak menulis sebuah acrostic poem bahasa Inggris menggunakan nama mereka sendiri.",
          "7. Anak menghias puisi mereka dengan gambar bertema syukur.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Ar-Rahman: 1-4): Guru menjelaskan: 'Keindahan susunan sajak (Ihsan) dalam puisi mengekspresikan kekaguman kita kepada ciptaan Allah dan rasa syukur di lisan.'"
        ]
      }
    },
    {
      "label": "K5-K6: Reading English Chapter Books & Literary Analysis",
      "grades": [
        "K5",
        "K6"
      ],
      "presentation": {
        "toolDisplay": "English Chapter Books (e.g., Charlotte’s Web), Literary Analysis Charts",
        "toolsList": [
          "Chapter Books",
          "Analysis Charts"
        ],
        "prerequisites": "Anak lancar membaca buku fabel dan teks bahasa Inggris panjang.",
        "directAim": "Read longer English chapter books independently and perform basic literary analysis (theme, setting, character traits, conflict).",
        "indirectAim": "Develop stamina in reading, analytical reading habits, and advanced text interpretation.",
        "error": "Struggling to follow complex character subplots or failing to identify the main conflict.",
        "steps": [
          "I. KEGIATAN AWAL: [Berkesadaran]",
          "1. Memulai dengan membaca Basmalah.",
          "2. Guru memperlihatkan buku bab bahasa Inggris: 'This book has chapters, and we will follow a long journey of the characters.'",
          "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
          "3. Guru menjelaskan konsep Unsur Intrinsik Sastra: Theme (tema), Setting (latar tempat/waktu), dan Plot Conflict (konflik utama).",
          "4. Guru mengajak anak membaca satu bab mandiri, lalu berdiskusi: 'What is the main problem of the character in this chapter?'",
          "5. Guru mendemonstrasikan cara mengisi diagram analisis sastra di papan tulis.",
          "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
          "6. Anak membaca bab lanjutan secara mandiri di kelas.",
          "7. Anak mengisi lembar analisis karakter (Character Profile) bahasa Inggris secara tertulis.",
          "IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN",
          "8. Internalisasi Nilai Islam (QS. Yusuf: 111): Guru menjelaskan: 'Membaca kisah perjalanan hidup tokoh melatih empati diri dan mengambil ibrah (pelajaran moral) dari pemecahan masalah kehidupan.'"
        ]
      }
    }
  ]
};

const injectionEffect = `
    // --- ONE-TIME BAHASA UPDATE MIGRATION ---
    useEffect(() => {
        const runBahasaMigration = async () => {
            if (localStorage.getItem('migrated_bahasa_k1_k6_v4')) return;
            console.log("Starting Bahasa K1-K6 Restructuring & 21 New Levels Migration (v4 - Standardized 4-Part Format)...");
            try {
                const docRef = doc(db, 'kurikulum_pusat', 'bahasa');
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) return;
                const currentData = docSnap.data();
                const updatedData = JSON.parse(JSON.stringify(currentData));
                
                const parseGradesFromLabel = (label) => {
                    const match = label.match(/^(K\\d)(?:-(K\\d))?:/);
                    if (!match) return [];
                    const start = parseInt(match[1].replace('K', ''));
                    if (match[2]) {
                        const end = parseInt(match[2].replace('K', ''));
                        const gArr = [];
                        for (let i = start; i <= end; i++) {
                            gArr.push("K" + i);
                        }
                        return gArr;
                    } else {
                        return ["K" + start];
                    }
                };

                const cleanStepQuotes = (step) => {
                    if (typeof step !== 'string') return step;
                    let s = step;
                    s = s.replace(/Rasulullah\\.',/g, "Rasulullah.");
                    s = s.replace(/Ta'awun/g, "Ta’awun");
                    s = s.replace(/Jama'ah/g, "Jama’ah");
                    s = s.replace(/Nasta'in/g, "Nasta’in");
                    s = s.replace(/Ma'rifat/g, "Ma’rifat");
                    s = s.replace(/Ta'awudz/g, "Ta’awudz");
                    s = s.replace(/Fi'il/g, "Fi’il");
                    s = s.replace(/I'tibar/g, "I’tibar");
                    s = s.replace(/Al-'Asr/g, "Al-’Asr");
                    s = s.replace(/Assalamu'alaikum/g, "Assalamu’alaikum");
                    s = s.replace(/Bismillahirrrohmanirrohim/g, "Bismillahirrohmanirrohim");
                    s = s.replace(/I'm/g, "I’m");
                    s = s.replace(/Let's/g, "Let’s");
                    s = s.replace(/Let\\\\\'s/g, "Let’s");
                    s = s.replace(/let's/g, "let’s");
                    s = s.replace(/don't/g, "don’t");
                    s = s.replace(/didn't/g, "didn’t");
                    s = s.replace(/'Bismillah'/g, "“Bismillah”");
                    s = s.replace(/'Bismillahirrrohmanirrohim'/g, "“Bismillahirrohmanirrohim”");
                    s = s.replace(/'Ya'/g, "“Ya”");
                    s = s.replace(/'Tidak'/g, "“Tidak”");
                    s = s.replace(/'Why, How, What, Where'/g, "“Why, How, What, Where”");
                    s = s.replace(/'ng'/g, "“ng”");
                    s = s.replace(/'ny'/g, "“ny”");
                    s = s.replace(/'sh'/g, "“sh”");
                    s = s.replace(/'ch'/g, "“ch”");
                    s = s.replace(/'th'/g, "“th”");
                    s = s.replace(/'wh'/g, "“wh”");
                    s = s.replace(/'ee'/g, "“ee”");
                    s = s.replace(/'ea'/g, "“ea”");
                    s = s.replace(/'oa'/g, "“oa”");
                    s = s.replace(/'ai'/g, "“ai”");
                    s = s.replace(/'Pisang'/g, "“Pisang”");
                    s = s.replace(/'Massa'/g, "“Massa”");
                    s = s.replace(/'Masa'/g, "“Masa”");
                    s = s.replace(/'and'/g, "“and”");
                    s = s.replace(/'karena'/g, "“karena”");
                    s = s.replace(/'a cat'/g, "“a cat”");
                    s = s.replace(/'the sun'/g, "“the sun”");
                    s = s.replace(/'The small cat'/g, "“The small cat”");
                    s = s.replace(/'The red book'/g, "“The red book”");
                    s = s.replace(/'the solid table'/g, "“the solid table”");
                    s = s.replace(/'Dia\\/He'/g, "“Dia/He”");
                    s = s.replace(/'AND', 'OR', 'BUT'/g, "“AND”, “OR”, “BUT”");
                    s = s.replace(/'APA\\?'/g, "“APA?”");
                    s = s.replace(/'Ibu memasak\\.\\.\\. \\(Anak bingung: Masak apa\\?\\)'/g, "“Ibu memasak... (Anak bingung: Masak apa?)”");
                    s = s.replace(/Cari huruf 'b'/g, "Cari huruf “b”");
                    s = s.replace(/Cari huruf 'u'/g, "Cari huruf “u”");
                    s = s.replace(/di samping 'b'/g, "di samping “b”");
                    return s;
                };

                const parseCoreSteps = (steps) => {
                    return steps
                        .filter(s => {
                            const lower = s.toLowerCase();
                            if (s.startsWith("I.") || s.startsWith("II.") || s.startsWith("III.") || s.startsWith("IV.") || s.startsWith("V.")) return false;
                            if (lower.includes("basmalah") || lower.includes("bismillah") || lower.includes("hamdalah") || lower.includes("alhamdulillah")) return false;
                            if (lower.includes("jaza kumullohu") || lower.includes("penutup majelis")) return false;
                            if (lower.includes("apresiasi atas usaha") || lower.includes("menanyakan perasaan anak") || lower.includes("bersyukur atas ilmu baru")) return false;
                            if (lower.includes("susun kembali") || lower.includes("rapikan") || lower.includes("bereskan") || lower.includes("simpan kembali") || lower.includes("gulung karpet")) return false;
                            return true;
                        })
                        .map(s => {
                            return s.replace(/^\\d+\\.\\s*/, '').trim();
                        });
                };

                const compileStandardizedSteps = (label, tool, quranVerse, quranMessage, coreSteps) => {
                    const steps = [];
                    
                    steps.push("I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)");
                    steps.push("1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]");
                    steps.push("2. Undang anak ke area karpet kerja dan katakan: 'Nak, mari kita mengeksplorasi " + label.split(': ').slice(1).join(': ').split(' / ')[0] + " menggunakan " + tool + ". Mari kita merenungi kekuasaan Allah.' [Berkesadaran]");
                    steps.push("3. Siapkan karpet kerja yang bersih dan rapi di lantai.");
                    steps.push("4. Guru membawa material " + tool + " ke atas karpet bersama anak dengan penuh rasa hormat. [Berkesadaran]");
                    
                    steps.push("II. PRESENTASI INTI (Langkah Eksplorasi)");
                    steps.push("5. Guru meletakkan material di tengah karpet dan meminta anak mengamatinya secara visual. [Bermakna - Memahami]");
                    
                    let idx = 6;
                    coreSteps.forEach(cs => {
                        steps.push(idx + ". " + cs + " [Bermakna - Mengaplikasikan]");
                        idx++;
                    });
                    
                    steps.push("III. KERJA MANDIRI (Pijakan Saat Main)");
                    steps.push(idx + ". Undang anak untuk mencoba secara mandiri: 'Apakah kamu ingin mencobanya sendiri atau bekerja bersama temanmu?' [Menyenangkan]");
                    idx++;
                    steps.push(idx + ". Biarkan anak melakukan eksplorasi berulang kali secara mandiri dengan material tersebut untuk membangun konsentrasi. Guru mengobservasi tanpa menginterupsi. [Menyenangkan - Kerja Mandiri]");
                    idx++;
                    steps.push(idx + ". Setelah selesai, bimbing anak merapikan material dan mengembalikannya ke rak: 'Yuk, kita kembalikan ke rak secara rapi. Kebersihan dan keteraturan adalah bagian dari rasa syukur kita.' [Berkesadaran]");
                    idx++;
                    
                    steps.push("IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)");
                    steps.push(idx + ". Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]");
                    idx++;
                    steps.push(idx + ". Berikan apresiasi spesifik atas usaha anak: 'Masya Allah, hari ini kalian menunjukkan ketekunan dan kerja sama yang luar biasa saat menggunakan alat ini.' [Berkesadaran - Merefleksikan]");
                    idx++;
                    steps.push(idx + ". Recalling Pengalaman: Tanyakan kepada anak: 'Bagian mana dari kegiatan tadi yang paling menarik atau menantang bagi kalian?' Biarkan anak bercerita. [Berkesadaran - Merefleksikan]");
                    idx++;
                    steps.push(idx + ". Internalisasi Nilai Islam (" + quranVerse + "): Guru menjelaskan: '" + quranMessage + "' [Berkesadaran - Merefleksikan]");
                    idx++;
                    steps.push(idx + ". Ajak anak berkomitmen melakukan satu kebaikan nyata hari ini sebagai wujud syukur atas akal dan kemampuan yang Allah berikan. [Berkesadaran - Mengaplikasikan]");
                    idx++;
                    steps.push(idx + ". Mengucap hamdalah bersama-sama untuk menutup sesi kerja: 'Alhamdulillahi rabbil ’alamin.' [Berkesadaran]");
                    idx++;
                    steps.push(idx + ". Guru mengucapkan kalimat penutup kepada anak: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]");
                    
                    return steps;
                };

                const existingMetadata = ` + JSON.stringify(existingMetadata, null, 2) + `;
                const newLevelsMap = ` + JSON.stringify(newLevelsMap, null, 2) + `;
                
                updatedData.subAreas = updatedData.subAreas.map(sa => {
                    let newLevels = sa.levels.map(lvl => {
                        const label = typeof lvl === 'object' ? lvl.label : lvl;
                        const parsedGrades = parseGradesFromLabel(label);
                        const baseData = typeof lvl === 'object' ? lvl : { label };
                        
                        const meta = existingMetadata[label];
                        const newLevelDef = newLevelsMap[sa.id]?.find(nl => nl.label === label);
                        
                        if (meta) {
                            const rawSteps = baseData.presentation?.steps || [];
                            const cleanedRawSteps = rawSteps.map(step => cleanStepQuotes(step));
                            const coreSteps = parseCoreSteps(cleanedRawSteps);
                            const compiledSteps = compileStandardizedSteps(label, meta.tool, meta.quranVerse, meta.quranMessage, coreSteps);

                            return {
                                label: label,
                                grades: parsedGrades,
                                presentation: {
                                    tool: meta.tool.split(', ')[0],
                                    toolDisplay: meta.tool,
                                    toolsList: meta.tool.split(', '),
                                    prerequisites: meta.prerequisites,
                                    directAim: meta.directAim,
                                    indirectAim: meta.indirectAim,
                                    error: cleanStepQuotes(baseData.presentation?.error || ""),
                                    videoUrl: baseData.presentation?.videoUrl || "",
                                    steps: compiledSteps
                                }
                            };
                        } else if (newLevelDef) {
                            const rawSteps = newLevelDef.presentation.steps;
                            const cleanedRawSteps = rawSteps.map(step => cleanStepQuotes(step));
                            const coreSteps = parseCoreSteps(cleanedRawSteps);
                            
                            const quranMatch = rawSteps.find(step => step.includes("Internalisasi Nilai Islam"));
                            let quranVerse = "QS. Al-Alaq: 1";
                            let quranMessage = "Allah mengajarkan ilmu kepada manusia.";
                            if (quranMatch) {
                                const matchRes = quranMatch.match(/\((QS\.\s*[^\)]+)\):\s*Guru\s*menjelaskan:\s*'(.*)'/);
                                if (matchRes) {
                                    quranVerse = matchRes[1];
                                    quranMessage = matchRes[2];
                                }
                            }

                            const compiledSteps = compileStandardizedSteps(label, newLevelDef.presentation.toolDisplay, quranVerse, quranMessage, coreSteps);

                            return {
                                label: label,
                                grades: newLevelDef.grades,
                                presentation: {
                                    tool: newLevelDef.presentation.toolDisplay.split(', ')[0],
                                    toolDisplay: newLevelDef.presentation.toolDisplay,
                                    toolsList: newLevelDef.presentation.toolsList,
                                    prerequisites: newLevelDef.presentation.prerequisites,
                                    directAim: newLevelDef.presentation.directAim,
                                    indirectAim: newLevelDef.presentation.indirectAim,
                                    error: cleanStepQuotes(newLevelDef.presentation.error || ""),
                                    videoUrl: baseData.presentation?.videoUrl || "",
                                    steps: compiledSteps
                                }
                            };
                        } else {
                            if (baseData.presentation && baseData.presentation.steps) {
                                baseData.presentation.steps = baseData.presentation.steps.map(step => cleanStepQuotes(step));
                            }
                            return {
                                ...baseData,
                                grades: parsedGrades
                            };
                        }
                    });

                    const toAppend = newLevelsMap[sa.id];
                    if (toAppend) {
                        toAppend.forEach(al => {
                            if (!newLevels.some(l => l.label === al.label)) {
                                const rawSteps = al.presentation.steps;
                                const cleanedRawSteps = rawSteps.map(step => cleanStepQuotes(step));
                                const coreSteps = parseCoreSteps(cleanedRawSteps);
                                
                                const quranMatch = rawSteps.find(step => step.includes("Internalisasi Nilai Islam"));
                                let quranVerse = "QS. Al-Alaq: 1";
                                let quranMessage = "Allah mengajarkan ilmu kepada manusia.";
                                if (quranMatch) {
                                    const matchRes = quranMatch.match(/\((QS\.\s*[^\)]+)\):\s*Guru\s*menjelaskan:\s*'(.*)'/);
                                    if (matchRes) {
                                        quranVerse = matchRes[1];
                                        quranMessage = matchRes[2];
                                    }
                                }

                                const compiledSteps = compileStandardizedSteps(al.label, al.presentation.toolDisplay, quranVerse, quranMessage, coreSteps);

                                newLevels.push({
                                    label: al.label,
                                    grades: al.grades,
                                    presentation: {
                                        tool: al.presentation.toolDisplay.split(', ')[0],
                                        toolDisplay: al.presentation.toolDisplay,
                                        toolsList: al.presentation.toolsList,
                                        prerequisites: al.presentation.prerequisites,
                                        directAim: al.presentation.directAim,
                                        indirectAim: al.presentation.indirectAim,
                                        error: cleanStepQuotes(al.presentation.error),
                                        videoUrl: "",
                                        steps: compiledSteps
                                    }
                                });
                            }
                        });
                    }

                    newLevels = newLevels.map(lvl => {
                        if (lvl.presentation && lvl.presentation.steps) {
                            lvl.presentation.steps = lvl.presentation.steps.map(step => cleanStepQuotes(step));
                        }
                        if (lvl.presentation && lvl.presentation.error) {
                            lvl.presentation.error = cleanStepQuotes(lvl.presentation.error);
                        }
                        return lvl;
                    });

                    return { ...sa, levels: newLevels };
                });
                
                await setDoc(docRef, updatedData);
                console.log("Bahasa full restructuring & quotes cleaning successful!");
                localStorage.setItem('migrated_bahasa_k1_k6_v4', 'true');
                alert("Berhasil melakukan restrukturisasi penuh kurikulum Bahasa K1-K6 sesuai standar AMI & Internalisasi Islam!");
                window.location.reload();
            } catch (err) {
                console.error("Migration failed:", err);
            }
        };

        if (loading === false && curriculum.length > 0) {
            runBahasaMigration();
        }
    }, [loading, curriculum]);
`;

const targetHook = 'const [loading, setLoading] = useState(true);';
const insertPos = content.indexOf(targetHook);
if (insertPos === -1) {
  console.log("Error: Target state not found in CurriculumManager.jsx!");
  process.exit(1);
}

const replacementPos = insertPos + targetHook.length;
const newContent = content.substring(0, replacementPos) + "\n" + injectionEffect + content.substring(replacementPos);

fs.writeFileSync(targetFile, newContent, 'utf8');
console.log("Successfully injected Bahasa migration v3 (restructured) useEffect into CurriculumManager.jsx!");
