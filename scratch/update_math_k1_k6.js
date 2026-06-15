import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
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

// Helper function to generate standardized steps
function generateSteps(title, tool, quranVerse, quranMessage, coreSteps) {
  const steps = [];
  steps.push("I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)");
  steps.push("1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]");
  steps.push(`2. Undang anak ke area karpet kerja dan katakan: 'Nak, hari ini kita akan mengeksplorasi ${title} menggunakan ${tool}. Mari kita lihat keagungan susunan ciptaan Allah.' [Berkesadaran]`);
  steps.push("3. Siapkan karpet kerja yang bersih dan rapi di lantai.");
  steps.push(`4. Guru membawa material ${tool} ke atas karpet bersama anak dengan penuh rasa hormat terhadap alat kerja. [Berkesadaran]`);
  
  steps.push("II. PRESENTASI INTI (Langkah Eksplorasi)");
  steps.push("5. Guru meletakkan material di tengah karpet dan meminta anak mengamatinya secara visual. [Bermakna - Memahami]");
  
  let stepIdx = 6;
  coreSteps.forEach(cs => {
    steps.push(`${stepIdx}. ${cs} [Bermakna - Mengaplikasikan]`);
    stepIdx++;
  });
  
  steps.push("III. KERJA MANDIRI (Pijakan Saat Main)");
  steps.push(`${stepIdx}. Undang anak untuk mencoba secara mandiri: 'Apakah kamu ingin mencobanya sendiri atau bekerja bersama temanmu?' [Menyenangkan]`);
  stepIdx++;
  steps.push(`${stepIdx}. Biarkan anak melakukan eksplorasi berulang kali secara mandiri dengan material tersebut untuk membangun konsentrasi. Guru mengobservasi tanpa menginterupsi. [Menyenangkan - Kerja Mandiri]`);
  stepIdx++;
  steps.push(`${stepIdx}. Setelah selesai, bimbing anak merapikan material dan mengembalikannya ke rak: 'Yuk, kita kembalikan ke rak secara rapi. Kebersihan dan keteraturan adalah bagian dari rasa syukur kita.' [Berkesadaran]`);
  stepIdx++;
  
  steps.push("IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)");
  steps.push(`${stepIdx}. Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]`);
  stepIdx++;
  steps.push(`${stepIdx}. Berikan apresiasi spesifik atas usaha anak: 'Masya Allah, hari ini kalian menunjukkan ketekunan dan kerja sama yang luar biasa saat menggunakan alat ini.' [Berkesadaran - Merefleksikan]`);
  stepIdx++;
  steps.push(`${stepIdx}. Recalling Pengalaman: Tanyakan kepada anak: 'Bagian mana dari kegiatan tadi yang paling menarik atau menantang bagi kalian?' Biarkan anak bercerita. [Berkesadaran - Merefleksikan]`);
  stepIdx++;
  steps.push(`${stepIdx}. Internalisasi Nilai Islam (${quranVerse}): Guru menjelaskan: '${quranMessage}' [Berkesadaran - Merefleksikan]`);
  stepIdx++;
  steps.push(`${stepIdx}. Ajak anak berkomitmen melakukan satu kebaikan nyata hari ini sebagai wujud syukur atas akal dan kemampuan yang Allah berikan. [Berkesadaran - Mengaplikasikan]`);
  stepIdx++;
  steps.push(`${stepIdx}. Mengucap hamdalah bersama-sama untuk menutup sesi kerja: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]`);
  stepIdx++;
  steps.push(`${stepIdx}. Guru mengucapkan kalimat penutup kepada anak: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]`);
  
  return steps;
}

// Defining all 51 new levels to add
const newLevelsData = [
  // === 5. memorization ===
  {
    subAreaId: "math_memorization",
    label: "K2-K3: Addition Finger Charts (Charts 1-6)",
    grades: ["K2", "K3"],
    tool: "Addition Finger Charts (Chart 1 to 6), Equation Cards",
    prerequisites: "Anak telah menguasai Addition Snake Game dan Addition Strip Board.",
    directAim: "Membantu anak menghafal kombinasi penjumlahan dasar secara semi-abstrak.",
    indirectAim: "Meningkatkan kecepatan mental arithmetic dan persiapan komputasi abstrak.",
    error: "Mekanis: Membandingkan jawaban anak dengan Control Chart.",
    quranVerse: "QS. Al-Baqarah: 261",
    quranMessage: "Allah melipatgandakan pahala bagi siapa yang Dia kehendaki. Dalam penjumlahan ini, kita melihat bagaimana angka kecil bertambah banyak, seperti satu benih tumbuh menjadi tujuh ratus bulir.",
    coreSteps: [
      "Guru mengenalkan Finger Chart 1 (Full Chart) dan cara meletakkan jari telunjuk kanan dan kiri pada angka penjumlah.",
      "Guru mengambil kartu soal (misal: 4 + 5), letakkan telunjuk kiri pada angka 4 merah dan telunjuk kanan pada angka 5 biru.",
      "Geser kedua jari secara tegak lurus hingga bertemu di satu kotak angka, yang menunjukkan hasil penjumlahan (9).",
      "Perkenalkan Chart berikutnya secara bertahap (Chart 2 s.d 6) di mana beberapa angka dikurangi secara perlahan untuk melatih ingatan anak."
    ]
  },
  {
    subAreaId: "math_memorization",
    label: "K2-K3: Subtraction Finger Charts",
    grades: ["K2", "K3"],
    tool: "Subtraction Finger Charts, Subtraction Equation Cards",
    prerequisites: "Anak telah menguasai Subtraction Strip Board dan fakta pengurangan dasar.",
    directAim: "Membantu anak menghafal kombinasi pengurangan dasar secara terstruktur.",
    indirectAim: "Transisi ke pengurangan mental tanpa alat bantu fisik.",
    error: "Mekanis: Pengecekan mandiri menggunakan Subtraction Control Chart.",
    quranVerse: "QS. An-Nahl: 70",
    quranMessage: "Allah menciptakan kamu, kemudian mewafatkanmu. Pengurangan mengingatkan kita bahwa nikmat umur dunia kita berkurang setiap detiknya, maka pergunakan waktu untuk amal saleh.",
    coreSteps: [
      "Guru meletakkan Subtraction Chart di karpet bersama kartu soal.",
      "Guru mengambil soal (misal: 12 - 5), tunjukkan cara meletakkan jari kiri pada angka 12 (minuend) dan jari kanan pada angka 5 (subtrahend).",
      "Guru mendemonstrasikan gerakan jari menyusuri kolom chart hingga bertemu pada angka jawaban (7).",
      "Latih anak menggunakan chart berulang kali dengan kartu soal yang berbeda."
    ]
  },
  {
    subAreaId: "math_memorization",
    label: "K3-K4: Multiplication Finger Charts (Charts 1-6)",
    grades: ["K3", "K4"],
    tool: "Multiplication Finger Charts, Multiplication Cards",
    prerequisites: "Anak telah menguasai Multiplication Bead Bar Layout dan konsep penjumlahan berulang.",
    directAim: "Membantu anak menghafal tabel perkalian 1 s.d 10 secara terstruktur.",
    indirectAim: "Persiapan perkalian multi-digit abstrak dan pembagian.",
    error: "Mekanis: Membandingkan hasil dengan Multiplication Control Chart.",
    quranVerse: "QS. Al-An'am: 160",
    quranMessage: "Barang siapa membawa amal baik maka baginya sepuluh kali lipat. Perkalian adalah pelipatgandaan kebaikan, seperti janji Allah melipatgandakan pahala kebaikan kita.",
    coreSteps: [
      "Guru menggelar Multiplication Finger Chart 1 di atas karpet.",
      "Guru mengambil kartu soal perkalian (misal: 6 x 7). Tunjukkan cara menempatkan jari pada angka 6 di sumbu horizontal dan angka 7 di sumbu vertikal.",
      "Gerakkan kedua jari di sepanjang jalur koordinat hingga berpotongan di kotak hasil perkalian (42).",
      "Perkenalkan chart tanpa angka hasil secara bertahap (blind chart) untuk menantang ingatan perkalian anak."
    ]
  },
  {
    subAreaId: "math_memorization",
    label: "K3-K4: Division Finger Charts",
    grades: ["K3", "K4"],
    tool: "Division Finger Charts, Division Equation Cards",
    prerequisites: "Anak telah menguasai Unit Division Board dan perkalian dasar.",
    directAim: "Membantu menghafal fakta pembagian dasar (invers perkalian).",
    indirectAim: "Persiapan pembagian bersusun panjang (long division) secara mental.",
    error: "Mekanis: Pengecekan dengan Division Control Chart.",
    quranVerse: "QS. Al-Furqan: 2",
    quranMessage: "Allah menciptakan segala sesuatu dan menetapkan ukuran-ukurannya dengan sangat rapi. Pembagian mengajarkan keadilan dan proporsi yang pas sesuai ketetapan Allah.",
    coreSteps: [
      "Guru meletakkan Division Chart dan set soal pembagian.",
      "Ambil soal (misal: 24 : 6). Cari angka 24 di dalam chart, lalu temukan angka pembagi 6 di bagian atas.",
      "Tunjukkan cara menarik garis koordinat menggunakan jari untuk menemukan hasil pembagian (4).",
      "Undang anak untuk berlatih berpasangan saling menebak soal pembagian."
    ]
  },
  {
    subAreaId: "math_memorization",
    label: "K2-K3: Addition Strip Board & Control Charts (Working Charts)",
    grades: ["K2", "K3"],
    tool: "Addition Working Charts (Blind Charts), Control Charts, Pen & Paper",
    prerequisites: "Anak sudah mengenal Finger Chart 1 dan 2.",
    directAim: "Mencatat hasil penjumlahan secara mandiri menggunakan bantuan chart kontrol.",
    indirectAim: "Membangun kemandirian koreksi kesalahan (self-correction).",
    error: "Mekanis: Anak melihat Control Chart secara visual untuk mengoreksi penulisan mereka sendiri.",
    quranVerse: "QS. Al-Hadid: 25",
    quranMessage: "Kami turunkan besi yang padat kekuatan dan bermanfaat bagi manusia. Penggunaan tabel kontrol melatih kejujuran dan keakuratan anak dalam mengoreksi pekerjaan sendiri.",
    coreSteps: [
      "Guru meletakkan Addition Working Chart (yang kosong/blind) dan Control Chart berdampingan.",
      "Anak mengambil soal, menghitung hasilnya secara mental atau dengan chart kosong, lalu menuliskan jawabannya di kertas.",
      "Guru mendemonstrasikan cara membuka Control Chart untuk mencocokkan hasil jawaban.",
      "Anak melakukan self-correction terhadap hasil kerjanya secara jujur."
    ]
  },
  {
    subAreaId: "math_memorization",
    label: "K2-K3: Subtraction Working Charts & Control Charts",
    grades: ["K2", "K3"],
    tool: "Subtraction Working Charts, Control Charts, Buku Tulis",
    prerequisites: "Anak telah memahami Subtraction Finger Charts.",
    directAim: "Melatih anak menuliskan dan memverifikasi hasil pengurangan secara mandiri.",
    indirectAim: "Kemandirian belajar dan peningkatan fokus visual.",
    error: "Mekanis: Menyamakan jawaban dengan Subtraction Control Chart.",
    quranVerse: "QS. Saba: 22",
    quranMessage: "Tiada yang tersembunyi dari Allah sekalipun sebesar zarrah. Kejujuran dalam mengoreksi jawaban sendiri adalah sifat mulia yang Allah sukai.",
    coreSteps: [
      "Guru menyiapkan kertas latihan berisi soal-soal pengurangan.",
      "Minta anak menyelesaikan soal pengurangan tersebut pada buku tulis menggunakan ingatan mereka.",
      "Tunjukkan cara mencocokkan setiap baris jawaban menggunakan Subtraction Control Chart secara sistematis.",
      "Ajarkan anak untuk memberi tanda centang jika benar dan memperbaiki yang salah secara mandiri."
    ]
  },
  {
    subAreaId: "math_memorization",
    label: "K3-K4: Multiplication Working Charts & Control Charts",
    grades: ["K3", "K4"],
    tool: "Multiplication Blind Chart, Control Chart, Lembar Kerja",
    prerequisites: "Anak telah mahir menggunakan Multiplication Finger Charts.",
    directAim: "Menuliskan dan mengoreksi hasil perkalian 1 s.d 10 secara mandiri.",
    indirectAim: "Kemandirian akademis dan penguatan memori perkalian.",
    error: "Mekanis: Membandingkan jawaban dengan Lembar Control Chart Perkalian.",
    quranVerse: "QS. Maryam: 94",
    quranMessage: "Sesungguhnya Allah telah menentukan jumlah mereka dan menghitung mereka dengan hitungan yang teliti. Penghitungan yang teliti melatih keteraturan berpikir kita.",
    coreSteps: [
      "Tunjukkan lembar kosong Multiplication Blind Chart.",
      "Anak mengisi kotak-kotak kosong pada chart dengan menuliskan hasil perkalian yang mereka ingat.",
      "Setelah selesai, tunjukkan cara menumpuk lembar transparansi Control Chart di atas pekerjaan mereka untuk mencocokkan angka secara langsung.",
      "Bimbing anak mendokumentasikan perkalian yang sudah mereka kuasai."
    ]
  },
  {
    subAreaId: "math_memorization",
    label: "K3-K4: Tabel Decanomial (Table of Pythagoras)",
    grades: ["K3", "K4"],
    tool: "Decanomial Bead Bar Box, Decanomial Paper Chart",
    prerequisites: "Anak memahami konsep perkalian dan luas geometris secara konkret.",
    directAim: "Melihat pola geometri dari perkalian (Tabel Pythagoras) secara masif.",
    indirectAim: "Persiapan konsep kuadrat, aljabar binomial/trinomial, dan pola angka.",
    error: "Visual: Pola warna manik-manik yang membentuk diagonal simetris.",
    quranVerse: "QS. Yasin: 40",
    quranMessage: "Tidaklah mungkin bagi matahari mengejar bulan dan malam pun tidak dapat mendahului siang. Masing-masing beredar pada garis edarnya. Pola diagonal Decanomial menunjukkan keteraturan hukum Allah.",
    coreSteps: [
      "Guru menggelar Decanomial Paper Chart di karpet.",
      "Tunjukkan cara mengambil bead bars (manik-manik) dari kotak dan menyusunnya membentuk persegi/persegi panjang sesuai koordinat perkalian (misal: baris 3, kolom 3 diisi 3 batang manik tiga).",
      "Anak menyusun manik-manik hingga memenuhi tabel decanomial, membentuk pola warna diagonal yang indah (diagonal persegi).",
      "Ajak anak melihat hubungan visual bahwa 3 x 4 membentuk luas yang sama dengan 4 x 3 (komutatif)."
    ]
  },

  // === 6. bead cabinet ===
  {
    subAreaId: "math_bead_cabinet",
    label: "K3-K4: Notasi Kuadrat & Kubik (n², n³)",
    grades: ["K3", "K4"],
    tool: "Bead Cabinet Chains, Label Arrows, Papan Tulis",
    prerequisites: "Anak telah menyelesaikan skip counting Rantai Pendek dan Panjang.",
    directAim: "Mengenal lambang notasi pangkat dua (kuadrat) dan pangkat tiga (kubik) secara tertulis.",
    indirectAim: "Persiapan aljabar dasar dan penulisan matematika formal.",
    error: "Mekanis: Kesalahan dalam mencocokkan jumlah rantai dengan angka eksponen.",
    quranVerse: "QS. Al-Ankabut: 14",
    quranMessage: "Dan sesungguhnya Kami telah mengutus Nuh kepada kaumnya, maka ia tinggal di antara mereka seribu tahun kurang lima puluh tahun. Penggunaan angka berpangkat menyederhanakan penulisan angka besar.",
    coreSteps: [
      "Guru mengambil rantai pendek 5 (berisi 5 batang manik 5) dan merapatkannya hingga membentuk bujur sangkar (square).",
      "Jelaskan bahwa 5 kali 5 ditulis dengan lambang 5² yang dibaca 'lima kuadrat' atau 'lima pangkat dua'.",
      "Ambil 5 keping bujur sangkar manik 5, tumpuk membentuk kubus. Jelaskan bahwa 5 x 5 x 5 ditulis 5³ yang dibaca 'lima kubik' atau 'lima pangkat tiga'.",
      "Latih anak menuliskan notasi kuadrat dan kubik untuk angka 1 s.d 10 di buku tulis."
    ]
  },
  {
    subAreaId: "math_bead_cabinet",
    label: "K3-K4: Eksplorasi Manik Kuadrat & Manik Kubik",
    grades: ["K3", "K4"],
    tool: "Bead Cabinet (Squares & Cubes), Neraca Timbangan",
    prerequisites: "Anak mengerti arti notasi kuadrat dan kubik.",
    directAim: "Membandingkan volume dan kuantitas antara manik kuadrat (2D) dan kubik (3D).",
    indirectAim: "Membangun fondasi berpikir tiga dimensi dan visualisasi spasial.",
    error: "Sensoris: Ketidakseimbangan berat pada timbangan jika jumlah manik tidak sesuai.",
    quranVerse: "QS. Al-Mutaffifin: 1-3",
    quranMessage: "Kecelakaan besarlah bagi orang-orang yang curang, yaitu orang-orang yang apabila menerima takaran dari orang lain mereka minta dipenuhi. Keadilan timbangan dan ukuran volume adalah perintah Allah.",
    coreSteps: [
      "Guru mengambil 1 keping bujur sangkar manik 6 (6² = 36 manik) dan 1 kubus manik 6 (6³ = 216 manik).",
      "Minta anak meraba perbedaan dimensi permukaan (dua dimensi) dengan bentuk volume (tiga dimensi).",
      "Gunakan neraca timbangan untuk menimbang 6 keping bujur sangkar manik 6 di satu sisi, dan 1 kubus manik 6 di sisi lain untuk membuktikan beratnya sama.",
      "Anak menuliskan hasil pembuktian rumus: 6 x 6² = 6³."
    ]
  },
  {
    subAreaId: "math_bead_cabinet",
    label: "K5-K6: Pencarian Akar Kuadrat dengan Papan Pasak (Square Root Extraction - Peg Board)",
    grades: ["K5", "K6"],
    tool: "Peg Board, Colorful Pegs, Cups",
    prerequisites: "Anak memahami konsep perkalian dan luas kuadrat.",
    directAim: "Mencari akar kuadrat dari suatu bilangan secara geometris menggunakan pasak.",
    indirectAim: "Persiapan konsep aljabar $(a+b)^2$ dan pemecahan masalah matematika lanjutan.",
    error: "Visual: Bentuk pasak yang disusun tidak membentuk persegi sempurna.",
    quranVerse: "QS. Luqman: 16",
    quranMessage: "Jika ada sesuatu perbuatan seberat biji sawi, dan berada dalam batu atau di langit atau di dalam bumi, niscaya Allah akan mendatangkannya. Akar kuadrat mencari asal usul terkecil dari sebuah bilangan besar.",
    coreSteps: [
      "Guru mengenalkan Peg Board dan pasak berwarna (hijau, biru, merah sesuai nilai tempat).",
      "Ambil soal (misal: akar kuadrat dari 144). Letakkan 144 pasak di wadah.",
      "Susun pasak membentuk persegi terbesar mulai dari kiri atas Peg Board: letakkan pasak ratusan, puluhan di sisi kanan-bawah, dan satuan di pojok kanan bawah.",
      "Tunjukkan bahwa panjang sisi persegi yang terbentuk (12) adalah akar kuadrat dari 144. Tuliskan hasilnya: $\\sqrt{144} = 12$."
    ]
  },
  {
    subAreaId: "math_bead_cabinet",
    label: "K6: Pencarian Akar Pangkat Tiga (Cube Root Extraction)",
    grades: ["K6"],
    tool: "Peg Board atau Wooden Cubing Material",
    prerequisites: "Anak telah menguasai akar kuadrat dengan Peg Board.",
    directAim: "Mencari akar pangkat tiga dari bilangan besar secara konkret/tiga dimensi.",
    indirectAim: "Pemahaman mendalam tentang ekspansi binomial $(a+b)^3$ secara visual.",
    error: "Visual: Susunan balok kayu tidak membentuk kubus sempurna.",
    quranVerse: "QS. Al-Jinn: 28",
    quranMessage: "Allah menghitung segala sesuatu satu per satu dengan teliti. Menemukan akar pangkat tiga melatih ketelitian tinggi dalam membedakan dimensi panjang, lebar, dan tinggi.",
    coreSteps: [
      "Guru mengenalkan komponen balok kayu kubus (merah, biru, kuning) yang mewakili rumus aljabar kubik.",
      "Berikan soal (misal: mencari akar pangkat tiga dari 27). Ambil 27 kubik satuan kayu.",
      "Susun 27 kubik tersebut membentuk satu kubus besar berukuran 3 x 3 x 3.",
      "Tunjukkan bahwa panjang rusuk dari kubus yang terbentuk (3) adalah jawaban akar pangkat tiga: $\\sqrt[3]{27} = 3$."
    ]
  },
  {
    subAreaId: "math_bead_cabinet",
    label: "K5-K6: Eksplorasi Formula Aljabar Binomial & Trinomial (Binomial & Trinomial Cubes)",
    grades: ["K5", "K6"],
    tool: "Binomial Cube, Trinomial Cube, Papan Tulis",
    prerequisites: "Anak menguasai notasi kuadrat & kubik serta konsep pencarian akar.",
    directAim: "Membuktikan rumus aljabar $(a+b)^3$ dan $(a+b+c)^3$ secara geometris.",
    indirectAim: "Persiapan transisi penuh ke aljabar abstrak di tingkat SMP.",
    error: "Visual: Balok kayu tidak dapat masuk kembali ke dalam kotaknya jika rumusnya salah disusun.",
    quranVerse: "QS. Ali 'Imran: 191",
    quranMessage: "Ya Tuhan kami, tiadalah Engkau menciptakan ini dengan sia-sia, Maha Suci Engkau. Kesempurnaan susunan kubus binomial dan trinomial membuktikan bahwa matematika adalah bahasa keindahan alam ciptaan Allah.",
    coreSteps: [
      "Guru membuka kotak Binomial Cube dan mengeluarkan semua komponen balok.",
      "Klasifikasikan balok berdasarkan warna sisinya (balok $a^3$, balok $a^2b$, balok $ab^2$, balok $b^3$).",
      "Susun balok lapis demi lapis di atas tutup kotak sambil membacakan komponen rumusnya secara visual.",
      "Tuliskan persamaan aljabar di papan tulis: $(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$ dan tunjukkan kesesuaian fisiknya."
    ]
  },

  // === 7. hierarchical ===
  {
    subAreaId: "math_hierarchical",
    label: "K3-K4: Operasi Hitung dengan Material Hierarki (Angka Jutaan)",
    grades: ["K3", "K4"],
    tool: "Hierarchical Decimal Material, Large Number Cards (Jutaan)",
    prerequisites: "Anak mengenal kubus jutaan dan mahir penjumlahan/pengurangan Golden Beads.",
    directAim: "Melakukan operasi penjumlahan dan pengurangan angka bernilai jutaan secara fisik.",
    indirectAim: "Membangun konsep skala angka raksasa dan apresiasi nilai tempat.",
    error: "Mekanis: Salah meletakkan manik kecil perwakilan jutaan pada kolom yang salah.",
    quranVerse: "QS. Al-Qamar: 49",
    quranMessage: "Sesungguhnya Kami menciptakan segala sesuatu menurut ukuran. Allah mengukur alam semesta ini dengan angka yang sangat besar, namun tetap teratur dalam hitungan-Nya.",
    coreSteps: [
      "Guru meletakkan papan material hierarki desimal di karpet.",
      "Anak menyusun soal angka jutaan menggunakan Large Number Cards (misal: 1.234.567 + 2.112.310).",
      "Ambil manik/kubus kecil perwakilan nilai tempat jutaan, ratus ribuan, puluh ribuan, dst, lalu letakkan di kolom papan yang sesuai.",
      "Gabungkan kuantitas fisik tersebut dari kolom satuan bergerak ke kiri, lakukan pertukaran jika mencapai 10, dan baca hasil akhirnya bersama-sama."
    ]
  },

  // === 9. fractions ===
  {
    subAreaId: "math_fractions",
    label: "K2: Penamaan Pecahan (Numerator & Denominator)",
    grades: ["K2"],
    tool: "Fraction Insets, Label Cards (Pembilang & Penyebut), Buku Tulis",
    prerequisites: "Anak mengenal konsep pecahan dasar (lingkaran utuh dibagi 2, 3, 4).",
    directAim: "Mengenal istilah pembilang (numerator) dan penyebut (denominator) secara tertulis.",
    indirectAim: "Mempersiapkan penulisan simbolis pecahan secara formal.",
    error: "Mekanis: Tertukar menempatkan posisi kartu label pembilang di bawah dan penyebut di atas.",
    quranVerse: "QS. Al-Muzzammil: 20",
    quranMessage: "Sesungguhnya Tuhanmu mengetahui bahwa kamu berdiri (sembahyang) kurang dari dua pertiga malam, atau seperdua malam atau sepertiganya. Pecahan digunakan Allah untuk mengukur waktu ibadah kita.",
    coreSteps: [
      "Guru meletakkan insets pecahan 1/3 di atas karpet.",
      "Tunjukkan kepingan pecahan yang diangkat dan katakan: 'Ini yang kita hitung, namanya Pembilang (Numerator).' Letakkan kartu label 'Pembilang' di atas kertas.",
      "Tunjukkan bingkai logam lingkaran penuh yang dibagi tiga dan katakan: 'Ini menunjukkan seluruh bagian lingkaran dibagi berapa, namanya Penyebut (Denominator).' Letakkan label 'Penyebut' di bawah.",
      "Bimbing anak menulis pecahan $1/3$ di buku kotak mereka, menandai angka 1 sebagai pembilang dan angka 3 sebagai penyebut."
    ]
  },
  {
    subAreaId: "math_fractions",
    label: "K3-K4: Penjumlahan Pecahan Penyebut Berbeda (Unlike Denominators)",
    grades: ["K3", "K4"],
    tool: "Fraction Insets, Equivalence Paper, Buku Tulis",
    prerequisites: "Anak menguasai ekuivalensi pecahan dan penjumlahan pecahan penyebut sama.",
    directAim: "Menjumlahkan pecahan yang memiliki penyebut berbeda menggunakan konsep ekuivalen.",
    indirectAim: "Persiapan operasi aljabar pecahan abstrak.",
    error: "Mekanis: Menjumlahkan pembilang langsung tanpa menyamakan penyebut.",
    quranVerse: "QS. An-Nisa: 11",
    quranMessage: "Allah mensyariatkan bagimu tentang pembagian warisan untuk anak-anakmu. Perhitungan pecahan dengan penyebut berbeda sangat krusial dalam pembagian warisan Islam (Faraidh).",
    coreSteps: [
      "Guru menulis soal di buku: $1/2 + 1/4$. Ambil kepingan $1/2$ dan $1/4$ dari wadah.",
      "Jelaskan bahwa kita tidak bisa menggabungkannya langsung karena ukurannya berbeda. Kita harus mencari 'keluarga' yang sama (ekuivalen).",
      "Ganti kepingan $1/2$ dengan dua kepingan $1/4$ menggunakan papan insets. Anak melihat bahwa $1/2$ ekuivalen dengan $2/4$.",
      "Kini penyebut sudah sama ($2/4 + 1/4$), gabungkan kepingan tersebut menjadi $3/4$ dan catat hasilnya."
    ]
  },
  {
    subAreaId: "math_fractions",
    label: "K3-K4: Pengurangan Pecahan Penyebut Berbeda (Unlike Denominators)",
    grades: ["K3", "K4"],
    tool: "Fraction Insets, Equivalence Board, Lembar Kerja",
    prerequisites: "Anak memahami konsep pengurangan pecahan penyebut sama dan ekuivalensi pecahan.",
    directAim: "Melakukan operasi pengurangan pecahan berpenyebut beda secara konkret.",
    indirectAim: "Membangun logika matematika analisis pecahan.",
    error: "Mekanis: Mengurangi penyebut secara langsung.",
    quranVerse: "QS. An-Nisa: 12",
    quranMessage: "Dan bagimu (suami-suami) seperdua dari harta yang ditinggalkan oleh istri-istrimu. Ketelitian pembagian pecahan menjamin keadilan hak bagi setiap manusia.",
    coreSteps: [
      "Tulis soal: $1/2 - 1/6$. Ambil kepingan $1/2$.",
      "Jelaskan bahwa kita ingin mengambil $1/6$ dari kepingan $1/2$ tersebut, tapi ukuran kepingannya berbeda.",
      "Tunjukkan ekuivalensi: ganti kepingan $1/2$ dengan tiga kepingan $1/6$ ($1/2 = 3/6$).",
      "Ambil satu kepingan $1/6$ dari tiga kepingan tersebut. Hitung sisanya ($2/6$ atau ekuivalen dengan $1/3$), lalu tulis hasilnya."
    ]
  },
  {
    subAreaId: "math_fractions",
    label: "K4-K5: Perkalian Pecahan (Fraction Multiplication)",
    grades: ["K4", "K5"],
    tool: "Fraction Insets (beberapa set), Buku Tulis",
    prerequisites: "Anak menguasai konsep perkalian bilangan bulat dan pecahan penyebut sama/beda.",
    directAim: "Mengalikan pecahan dengan bilangan bulat dan pecahan dengan pecahan secara visual.",
    indirectAim: "Persiapan perhitungan skala, persen, dan rumus fisika dasar.",
    error: "Mekanis: Mengalikan pembilang dengan penyebut secara bersilang tanpa rumus yang tepat.",
    quranVerse: "QS. Al-Ankabut: 14",
    quranMessage: "Satu per sekian bagian dari waktu dikalikan dengan kuantitas yang besar akan menghasilkan hitungan yang presisi. Allah menghitung setiap detail amal kita.",
    coreSteps: [
      "Guru menerangkan perkalian pecahan dengan bilangan bulat (misal: $1/3 \\times 2$). Ambil kepingan $1/3$ sebanyak dua kali, gabungkan menjadi $2/3$.",
      "Tingkatkan ke perkalian pecahan dengan pecahan (misal: $1/2 \\times 1/3$, dibaca 'setengah dari sepertiga').",
      "Ambil kepingan sepertiga ($1/3$), lalu bagilah kepingan sepertiga tersebut menjadi dua bagian yang sama besar menggunakan alat bantu insets atau kertas.",
      "Tunjukkan bahwa setengah bagian dari $1/3$ tersebut jika dicocokkan dengan lingkaran penuh nilainya sama dengan $1/6$. Tulis hasilnya: $1/2 \\times 1/3 = 1/6$."
    ]
  },
  {
    subAreaId: "math_fractions",
    label: "K4-K5: Pembagian Pecahan (Fraction Division)",
    grades: ["K4", "K5"],
    tool: "Fraction Insets, Skittles (Pion Pembagi), Buku Tulis",
    prerequisites: "Anak memahami konsep dasar pembagian menggunakan skittles di Golden Beads/Stamp Game.",
    directAim: "Membagi pecahan dengan bilangan bulat secara konkret menggunakan pion pembagi.",
    indirectAim: "Membangun abstraksi pembagian pecahan (dikalikan dengan kebalikan pembagi).",
    error: "Mekanis: Hasil pembagian dibaca total seluruh skittles, bukan per satu skittle.",
    quranVerse: "QS. Saba: 22",
    quranMessage: "Keadilan Allah menjangkau hal sekecil apa pun. Membagi pecahan mengajarkan kita cara mendistribusikan hak dengan adil hingga ke bagian terkecil.",
    coreSteps: [
      "Tulis soal: $1/2 : 2$ (setengah dibagi kepada dua orang). Letakkan dua skittles (pion) hijau di karpet.",
      "Tunjukkan cara membagi kepingan setengah ($1/2$) menjadi dua bagian yang sama besar.",
      "Berikan masing-masing bagian yang sudah dipotong ($1/4$) kepada setiap skittle.",
      "Jelaskan bahwa jawaban pembagian selalu merujuk pada apa yang didapatkan oleh SATU skittle ($1/4$). Catat hasilnya: $1/2 : 2 = 1/4$."
    ]
  },
  {
    subAreaId: "math_fractions",
    label: "K3-K4: Pecahan Campuran & Tidak Biasa (Mixed & Improper Fractions)",
    grades: ["K3", "K4"],
    tool: "Fraction Insets (Multiple sets), Lembar Kerja",
    prerequisites: "Anak lancar mengidentifikasi dan menjumlahkan pecahan biasa.",
    directAim: "Mengenal bentuk pecahan campuran (seperti $1 \\frac{1}{2}$) dan pecahan tidak biasa ($3/2$).",
    indirectAim: "Persiapan konversi pecahan tingkat lanjut dan operasi abstrak.",
    error: "Mekanis: Lupa menambahkan bilangan bulat di depan pecahan biasa saat menulis pecahan campuran.",
    quranVerse: "QS. Al-Muzzammil: 20",
    quranMessage: "Allah menetapkan ukuran malam dan siang dengan sangat pas. Angka campuran menunjukkan gabungan utuh dan bagian kecil yang saling menyempurnakan.",
    coreSteps: [
      "Guru meletakkan 1 lingkaran utuh logam dan 1 keping setengah ($1/2$) di karpet.",
      "Jelaskan bahwa ini bernilai 'satu setengah' dan ditulis $1 \\frac{1}{2}$ (Pecahan Campuran).",
      "Ganti 1 lingkaran utuh tersebut dengan dua kepingan setengah ($2/2$), lalu gabungkan dengan kepingan setengah yang tadi sehingga ada 3 kepingan setengah.",
      "Jelaskan bahwa 3 kepingan setengah ditulis $3/2$ (Pecahan Tidak Biasa / Improper Fraction). Tunjukkan bahwa $1 \\frac{1}{2} = 3/2$."
    ]
  },
  {
    subAreaId: "math_fractions",
    label: "K5-K6: Pecahan Desimal & Operasinya (Decimal Fractions)",
    grades: ["K5", "K6"],
    tool: "Decimal Board, Decimal Bead Bars, Lembar Kerja",
    prerequisites: "Anak memahami konsep nilai tempat persepuluhan, perseratusan dari pecahan asosiasi.",
    directAim: "Melakukan operasi penjumlahan, pengurangan, perkalian desimal secara konkret.",
    indirectAim: "Persiapan konsep uang digital, sains, dan persentase.",
    error: "Mekanis: Salah menaruh letak tanda koma desimal saat menjumlahkan secara bersusun.",
    quranVerse: "QS. Luqman: 16",
    quranMessage: "Sesungguhnya jika ada sesuatu perbuatan seberat biji sawi (kecil sekali). Angka desimal mewakili nilai yang sangat kecil di bawah satuan, namun tetap dihitung oleh Allah.",
    coreSteps: [
      "Guru mengenalkan Decimal Board: sisi kanan koma mewakili persepuluhan (biru muda), perseratusan (merah muda), dst.",
      "Tunjukkan soal penjumlahan desimal: $0,2 + 0,15$. Letakkan manik 2 di kolom persepuluhan, dan manik 1 di persepuluhan serta manik 5 di perseratusan.",
      "Gabungkan manik-manik tersebut di papan desimal, lalu baca hasilnya secara visual: $0,35$.",
      "Tuliskan aturan penjumlahan desimal di kertas dengan menyejajarkan tanda koma secara vertikal."
    ]
  },
  {
    subAreaId: "math_fractions",
    label: "K5-K6: Konversi Pecahan, Desimal, Persen (FDP Conversion)",
    grades: ["K5", "K6"],
    tool: "Fraction Insets, Decimal Board, Grid 100 Paper",
    prerequisites: "Anak menguasai konsep pecahan desimal dan pecahan biasa.",
    directAim: "Mengonversi nilai antara pecahan biasa, pecahan desimal, dan persen secara visual.",
    indirectAim: "Kemampuan analisis data keuangan, statistik, dan diskon belanja.",
    error: "Mekanis: Salah meletakkan nilai desimal 0,05 menjadi 50% (seharusnya 5%).",
    quranVerse: "QS. Al-Baqarah: 261",
    quranMessage: "Persentase (per seratus) membantu kita memahami konsep zakat (2.5%) dan pertumbuhan infak secara sistematis dan rapi sesuai syariat.",
    coreSteps: [
      "Guru meletakkan Grid Paper berisi 100 kotak (10 x 10) di karpet.",
      "Tunjukkan pecahan $1/4$ menggunakan insets pecahan, lalu arsir 1/4 bagian dari grid 100 kotak tersebut (yaitu 25 kotak).",
      "Jelaskan bahwa 25 kotak dari 100 ditulis 25% (dua puluh lima persen).",
      "Tunjukkan konversi nilai desimalnya: 25 kotak per seratus ditulis 0,25. Buat tabel konversi: $1/4 = 0,25 = 25\\%$."
    ]
  },

  // === 10. geometry ===
  {
    subAreaId: "math_geometry",
    label: "K2: Studi Garis (Types, Positions, Relations of Lines)",
    grades: ["K2"],
    tool: "Geometric Sticks Board, Colored Sticks, Push Pins",
    prerequisites: "Anak mengenal Geometric Cabinet (kabinet geometri).",
    directAim: "Mengidentifikasi garis lurus, sinar garis, segmen garis, posisi garis (horizontal, vertikal, diagonal), dan hubungan antar garis (sejajar, berpotongan, tegak lurus).",
    indirectAim: "Membangun fondasi menggambar arsitektur dan pemahaman ruang.",
    error: "Mekanis: Tertukar antara konsep sinar garis (satu arah) dan segmen garis (dua batas).",
    quranVerse: "QS. Al-Mulk: 3",
    quranMessage: "Kamu sekali-kali tidak melihat pada ciptaan Tuhan Yang Maha Pemurah sesuatu yang tidak seimbang. Garis sejajar dan tegak lurus menciptakan keseimbangan visual yang sempurna di alam.",
    coreSteps: [
      "Guru meletakkan papan Geometric Sticks di karpet.",
      "Ambil stik merah, pasang pin di kedua ujung stik dan katakan: 'Ini Segmen Garis (Line Segment), memiliki pangkal dan ujung.'",
      "Ambil stik lain, tunjukkan garis horizontal (sejajar permukaan), vertikal (tegak lurus), dan diagonal.",
      "Pasang dua stik yang tidak pernah bertemu walau diperpanjang (Garis Sejajar / Parallel Lines), lalu pasang stik yang memotong membentuk sudut siku-siku (Garis Tegak Lurus / Perpendicular Lines)."
    ]
  },
  {
    subAreaId: "math_geometry",
    label: "K2-K3: Studi Sudut (Types, Measurement, Protractor)",
    grades: ["K2", "K3"],
    tool: "Geometric Sticks, Protractor (Busur Derajat)",
    prerequisites: "Anak memahami konsep garis.",
    directAim: "Mengidentifikasi sudut siku-siku, lancip, tumpul, lurus, dan mengukur besar sudut dengan busur derajat.",
    indirectAim: "Persiapan konsep trigonometri dasar dan navigasi arah kiblat.",
    error: "Mekanis: Salah meletakkan titik tengah busur derajat pada titik sudut saat mengukur.",
    quranVerse: "QS. Yasin: 39",
    quranMessage: "Dan telah Kami tetapkan bagi bulan manzilah-manzilah, sehingga (setelah dia sampai ke manzilah yang terakhir) kembalilah dia seperti bentuk tandan yang tua. Orbit bulan membentuk sudut-sudut derajat yang teratur terhadap bumi.",
    coreSteps: [
      "Guru menggabungkan dua stik geometri pada satu pin membentuk satu engsel.",
      "Gerakkan stik membentuk sudut siku-siku (90 derajat). Jelaskan namanya.",
      "Gerakkan stik lebih sempit dari siku-siku (Sudut Lancip / Acute Angle), dan lebih lebar dari siku-siku (Sudut Tumpul / Obtuse Angle).",
      "Tunjukkan cara menempelkan titik pusat busur derajat pada titik sudut stik untuk membaca besar derajat sudut secara akurat."
    ]
  },
  {
    subAreaId: "math_geometry",
    label: "K3: Studi Segitiga Mendalam (7 Types of Triangles)",
    grades: ["K3"],
    tool: "Constructive Triangles (Triangle Boxes), Stick Board",
    prerequisites: "Anak menguasai klasifikasi sudut dan garis.",
    directAim: "Mengklasifikasikan 7 jenis segitiga berdasarkan sisi (sama sisi, sama kaki, sembarang) dan sudut (siku-siku, lancip, tumpul).",
    indirectAim: "Apresiasi struktur segitiga sebagai bangun paling kokoh dalam arsitektur.",
    error: "Mekanis: Salah mencocokkan nama segitiga berdasarkan kombinasi sisi dan sudutnya.",
    quranVerse: "QS. As-Saff: 4",
    quranMessage: "Sesungguhnya Allah menyukai orang yang berperang di jalan-Nya dalam barisan yang teratur seakan-akan mereka seperti suatu bangunan yang tersusun kokoh. Struktur segitiga adalah struktur terkokoh dalam konstruksi.",
    coreSteps: [
      "Guru membawa kotak stik geometri, buat tiga segitiga berdasarkan panjang sisinya: Sama Sisi, Sama Kaki, dan Sembarang.",
      "Buat lagi segitiga berdasarkan jenis sudut di dalamnya: Segitiga Siku-siku, Segitiga Lancip, dan Segitiga Tumpul.",
      "Tunjukkan bahwa ada total 7 kombinasi segitiga unik yang dapat dibentuk di dunia ini.",
      "Minta anak melabeli setiap jenis segitiga tersebut menggunakan kartu nama geometri."
    ]
  },
  {
    subAreaId: "math_geometry",
    label: "K3-K4: Studi Segiempat (Quadrilaterals Nomenclature)",
    grades: ["K3", "K4"],
    tool: "Geometric Cabinet, Stick Board, Classified Nomenclature Cards",
    prerequisites: "Anak mengenal bentuk segiempat dasar di TK/K1.",
    directAim: "Mengidentifikasi sifat-sifat khusus persegi, persegi panjang, jajar genjang, trapesium, belah ketupat, dan layang-layang.",
    indirectAim: "Membangun analisis geometri spasial yang tajam.",
    error: "Mekanis: Tertukar sifat antara jajar genjang (sisi sejajar) dengan trapesium (hanya sepasang sejajar).",
    quranVerse: "QS. Al-Furqan: 2",
    quranMessage: "Allah menetapkan ukuran-ukuran bangun datar dengan presisi. Setiap jenis segiempat memiliki aturan sudut dan panjang sisi yang khas dan teratur.",
    coreSteps: [
      "Guru mengeluarkan stik geometri dan membentuk persegi (4 sisi sama panjang, 4 sudut siku-siku).",
      "Ubah sudutnya tanpa mengubah panjang sisi (mendorong sudut persegi) menjadi Belah Ketupat (Rhombus). Tunjukkan perbedaannya.",
      "Bentuk bangun datar segiempat lainnya: Jajar Genjang, Trapesium Sama Kaki, Trapesium Sembarang, Layang-layang.",
      "Anak menyalin gambar bentuk segiempat dan mencatat sifat-sifat garis dan sudutnya di buku geometri."
    ]
  },
  {
    subAreaId: "math_geometry",
    label: "K3-K4: Studi Poligon (Pentagon s.d Decagon Nomenclature)",
    grades: ["K3", "K4"],
    tool: "Geometric Cabinet (Polygon drawer), Stick Board, Label Cards",
    prerequisites: "Anak memahami konsep sudut dan sisi bangun datar.",
    directAim: "Mengenal nama poligon beraturan dari segi lima (pentagon) hingga segi sepuluh (decagon).",
    indirectAim: "Pengenalan pola fraktal dan keindahan alam semesta (misal sarang lebah).",
    error: "Mekanis: Salah menghitung jumlah sisi bangun poligon yang berukuran besar.",
    quranVerse: "QS. Ar-Rahman: 7",
    quranMessage: "Dan Allah telah meninggikan langit dan Dia meletakkan neraca (keadilan). Poligon beraturan menunjukkan keindahan simetri yang seimbang, wujud keindahan ciptaan Allah.",
    coreSteps: [
      "Guru mengeluarkan laci poligon dari Kabinet Geometri di karpet.",
      "Minta anak meraba sekeliling sisi bangun segi lima dan menghitung sudutnya: 'Ini segi lima, namanya Pentagon.'",
      "Lanjutkan dengan mengenalkan Hexagon (segi enam), Heptagon (segi tujuh), Octagon (segi delapan), Nonagon (segi sembilan), dan Decagon (segi sepuluh).",
      "Anak membuat gambar poligon di atas kertas menggunakan penggaris dan jangka, serta melabelinya."
    ]
  },
  {
    subAreaId: "math_geometry",
    label: "K4: Studi Lingkaran (Parts & Properties of Circle)",
    grades: ["K4"],
    tool: "Metal Insets of Circle, Jangka, Colored Pencils",
    prerequisites: "Anak mengenal bentuk lingkaran.",
    directAim: "Mengidentifikasi bagian lingkaran: pusat, radius, diameter, busur, tali busur, juring, dan tembereng.",
    indirectAim: "Persiapan konsep perhitungan keliling/luas lingkaran dan konstanta pi ($\\pi$).",
    error: "Mekanis: Tertukar antara radius (setengah diameter) dengan diameter (garis tengah utuh).",
    quranVerse: "QS. Yasin: 40",
    quranMessage: "Masing-masing beredar pada garis edarnya yang berbentuk lingkaran/elips teratur. Lingkaran melambangkan ketidakterbatasan dan keteraturan rute ciptaan Allah.",
    coreSteps: [
      "Guru menggambar lingkaran besar menggunakan jangka di papan tulis.",
      "Tandai titik pusat lingkaran. Tarik garis dari pusat ke tepi dan katakan: 'Ini Radius (Jari-jari).'",
      "Tarik garis lurus melintasi pusat dari satu tepi ke tepi lain: 'Ini Diameter (Garis Tengah).'",
      "Warnai area juring (seperti potongan pizza) dan tembereng (area di bawah tali busur), lalu pasang kartu label nama untuk masing-masing bagian tersebut."
    ]
  },
  {
    subAreaId: "math_geometry",
    label: "K4-K5: Keliling & Luas (Perimeter & Area)",
    grades: ["K4", "K5"],
    tool: "Yellow Area Triangles, Grid Paper, Penggaris",
    prerequisites: "Anak mahir perkalian dan pembagian dasar.",
    directAim: "Menemukan rumus keliling dan luas persegi, persegi panjang, dan segitiga secara eksperimental.",
    indirectAim: "Penerapan praktis pengukuran lahan pertanian, bangunan rumah, dan arsitektur.",
    error: "Mekanis: Tertukar penggunaan rumus keliling (penjumlahan sisi) dengan luas (perkalian sisi).",
    quranVerse: "QS. Al-Inshiqaq: 8",
    quranMessage: "Maka dia akan diperiksa dengan pemeriksaan yang mudah. Menghitung luas lahan secara akurat menghindari kecurangan dan menegakkan keadilan transaksi antar manusia.",
    coreSteps: [
      "Tunjukkan cara menghitung Keliling persegi panjang: minta anak mengukur panjang keempat stik bingkai luar menggunakan penggaris, lalu menjumlahkannya.",
      "Tunjukkan konsep Luas menggunakan Grid Paper: buat persegi panjang 4 x 3 kotak. Hitung total kotak di dalamnya (12 kotak) untuk menunjukkan Luas = Panjang x Lebar.",
      "Gunakan Yellow Area Triangles (segitiga kuning) untuk menunjukkan bahwa luas segitiga adalah setengah dari luas persegi panjang ekuivalen: $L = \\frac{a \\times t}{2}$."
    ]
  },
  {
    subAreaId: "math_geometry",
    label: "K5-K6: Kekongruenan, Kesebangunan, Kesetaraan (Congruence, Similarity, Equivalence)",
    grades: ["K5", "K6"],
    tool: "Constructive Triangles, Red Insets of Equivalence",
    prerequisites: "Anak menguasai studi segitiga mendalam dan keliling/luas.",
    directAim: "Membedakan bangun yang kongruen (sama bentuk & ukuran), sebangun (sama bentuk beda ukuran), dan setara/ekuivalen (beda bentuk sama luas).",
    indirectAim: "Melatih logika abstrak tinggi dan pembuktian matematis.",
    error: "Visual: Salah menyimpulkan dua bangun ekuivalen sebagai kongruen karena bentuknya berbeda.",
    quranVerse: "QS. Yasin: 38",
    quranMessage: "Dan matahari berjalan di tempat peredarannya. Demikianlah ketetapan Yang Maha Perkasa lagi Maha Mengetahui. Kesamaan luas dalam bentuk berbeda (kesetaraan) membuktikan hukum kekekalan materi ciptaan Allah.",
    coreSteps: [
      "Guru mengambil dua segitiga dari laci Constructive Triangles yang berukuran persis sama. Himpitkan keduanya untuk membuktikan **Kongruen**.",
      "Ambil satu segitiga kecil dan satu segitiga besar dari kabinet yang sudutnya sama. Jelaskan bahwa keduanya **Sebangun (Similar)**.",
      "Gunakan Red Insets of Equivalence: tunjukkan persegi panjang merah dan segitiga merah yang bentuknya berbeda, namun ketika bagian-bagiannya ditata di atas timbangan atau di bingkai insets, keduanya menutupi luas permukaan yang persis sama (**Setara / Equivalent**)."
    ]
  },
  {
    subAreaId: "math_geometry",
    label: "K5-K6: Volume Bangun Ruang (Volume of Solids)",
    grades: ["K5", "K6"],
    tool: "Geometric Solids (Hollow/berongga), Air atau Pasir, Gelas Ukur",
    prerequisites: "Anak menguasai keliling & luas bidang datar.",
    directAim: "Menghitung kapasitas/volume kubus, balok, prisma, dan tabung secara eksperimental.",
    indirectAim: "Aplikasi praktis dalam sains, konstruksi wadah air, dan pengemasan produk.",
    error: "Mekanis: Lupa mengalikan tinggi bangun ruang saat mencari volume ($V = L_{alas} \\times t$).",
    quranVerse: "QS. Ar-Rahman: 9",
    quranMessage: "Dan tegakkanlah timbangan itu dengan adil dan janganlah kamu mengurangi neraca itu. Pengukuran volume yang tepat menjamin keadilan dalam perdagangan cairan dan bahan pangan.",
    coreSteps: [
      "Guru membawa Kubus dan Balok berongga (hollow) ke karpet bersama wadah air.",
      "Anak mengukur panjang sisi kubus: $5 \\text{ cm}$. Isi kubus tersebut dengan air hingga penuh.",
      "Tuangkan air tersebut ke dalam gelas ukur untuk melihat volume air secara mililiter ($125 \\text{ ml} = 125 \\text{ cm}^3$).",
      "Buktikan dengan rumus matematika: $\\text{Volume} = \\text{Sisi} \\times \\text{Sisi} \\times \\text{Sisi} \\ (5 \\times 5 \\times 5 = 125)$. Lakukan eksperimen serupa untuk Tabung dan Prisma."
    ]
  },

  // === 11. math_passage_abstraction ===
  {
    subAreaId: "math_passage_abstraction",
    label: "K2-K3: Penjumlahan Abstrak Bersusun",
    grades: ["K2", "K3"],
    tool: "Buku Kotak Matematika, Pensil dua warna (Merah, Hijau)",
    prerequisites: "Anak telah mahir melakukan penjumlahan dinamis dengan Stamp Game dan Bead Frame.",
    directAim: "Melakukan penjumlahan angka besar (ribuan) secara tertulis tanpa bantuan material konkret.",
    indirectAim: "Mencapai kemandirian berpikir matematis abstrak penuh.",
    error: "Mekanis: Lupa menambahkan angka simpanan (carrying) pada nilai tempat berikutnya.",
    quranVerse: "QS. Al-Inshiqaq: 8",
    quranMessage: "Maka dia akan diperiksa dengan pemeriksaan yang mudah. Perhitungan abstrak bersusun melatih kerapian berpikir sistematis agar segala urusan dipermudah oleh Allah.",
    coreSteps: [
      "Guru menuliskan soal di buku kotak dengan kode warna nilai tempat (satuan hijau, puluhan biru, ratusan merah, ribuan hijau). Soal: $3456 + 1278$.",
      "Tunjukkan cara menjumlahkan kolom satuan terlebih dahulu: $6 + 8 = 14$. Tulis angka 4 di bawah kolom satuan, dan tulis angka 1 kecil di atas kolom puluhan.",
      "Jumlahkan kolom puluhan beserta angka simpanan: $1 + 5 + 7 = 13$. Tulis angka 3, simpan angka 1 di kolom ratusan.",
      "Lanjutkan hingga kolom ribuan, lalu baca hasil akhirnya bersama anak secara abstrak."
    ]
  },
  {
    subAreaId: "math_passage_abstraction",
    label: "K2-K3: Pengurangan Abstrak Bersusun",
    grades: ["K2", "K3"],
    tool: "Buku Kotak, Pensil, Penghapus",
    prerequisites: "Anak mahir pengurangan dinamis menggunakan Stamp Game.",
    directAim: "Melakukan operasi pengurangan angka besar secara tertulis mandiri tanpa alat.",
    indirectAim: "Penguatan visualisasi mental nilai tempat.",
    error: "Mekanis: Mengurangi angka atas dengan angka bawah secara terbalik jika nilai atas lebih kecil.",
    quranVerse: "QS. Al-Kahf: 49",
    quranMessage: "Kitab catatan amal diputar, tidak meninggalkan yang kecil dan tidak yang besar melainkan ia mencatatnya. Pengurangan abstrak melatih kita untuk teliti menghitung sisa hasil usaha kita.",
    coreSteps: [
      "Guru menuliskan soal pengurangan dengan teknik meminjam di buku kotak: $4321 - 1564$.",
      "Mulai dari kolom satuan: $1 - 4$ tidak cukup. Demonstrasikan proses 'meminjam' 1 puluhan dari kolom puluhan (angka 2 dicoret menjadi 1, satuan 1 menjadi 11).",
      "Lakukan pengurangan satuan: $11 - 4 = 7$.",
      "Lanjutkan proses peminjaman pada kolom puluhan, ratusan hingga selesai, lalu verifikasi hasilnya bersama-sama."
    ]
  },
  {
    subAreaId: "math_passage_abstraction",
    label: "K3-K4: Perkalian Abstrak Bersusun",
    grades: ["K3", "K4"],
    tool: "Buku Tulis Kotak, Pensil",
    prerequisites: "Anak menghafal fakta perkalian 1 s.d 10 dan memahami Checkerboard.",
    directAim: "Melakukan perkalian bersusun dua digit atau lebih secara abstrak tertulis.",
    indirectAim: "Apresiasi efisiensi algoritma matematika abstrak.",
    error: "Mekanis: Salah menempatkan posisi hasil perkalian puluhan (lupa digeser satu kolom ke kiri).",
    quranVerse: "QS. Al-An'am: 160",
    quranMessage: "Pelipatgandaan angka secara abstrak menuntut kita mengingat setiap langkah secara tertib, seperti shalat yang harus dikerjakan dengan tertib dan tuma'ninah.",
    coreSteps: [
      "Tulis soal perkalian di buku: $24 \\times 13$.",
      "Tunjukkan langkah pertama: kalikan 24 dengan satuan 3 ($3 \\times 4 = 12$ tulis 2 simpan 1, $3 \\times 2 = 6$ tambah 1 menjadi 7. Hasil baris pertama: 72).",
      "Tunjukkan langkah kedua: kalikan 24 dengan puluhan 1 ($1 \\times 4 = 4$, letakkan angka 4 tepat di bawah kolom puluhan / bergeser satu ke kiri. $1 \\times 2 = 2$. Hasil baris kedua: 240).",
      "Jumlahkan kedua baris hasil perkalian tersebut ($72 + 240 = 312$)."
    ]
  },
  {
    subAreaId: "math_passage_abstraction",
    label: "K4-K5: Pembagian Bersusun Panjang (Abstract Long Division)",
    grades: ["K4", "K5"],
    tool: "Buku Tulis, Pensil, Penghapus",
    prerequisites: "Anak menguasai pembagian Racks and Tubes dan perkalian abstrak.",
    directAim: "Menyelesaikan pembagian bilangan multi-digit bersusun (porogapit) secara abstrak penuh.",
    indirectAim: "Membangun ketekunan kognitif tingkat tinggi.",
    error: "Mekanis: Salah meletakkan hasil pembagian di baris atas atau keliru dalam pengurangan bersusun di bawah.",
    quranVerse: "QS. Al-Isra: 12",
    quranMessage: "Supaya kamu mengetahui bilangan tahun-tahun dan perhitungan. Pembagian bersusun panjang menguji ketekunan anak menyelesaikan masalah secara bertahap s.d tuntas.",
    coreSteps: [
      "Tulis soal pembagian di buku dengan simbol porogapit: $725 : 5$.",
      "Tunjukkan langkah pertama: bagi ratusan $7$ dengan $5$ ($7 : 5 = 1$ sisa 2. Tulis 1 di atas, tulis 5 di bawah 7, kurangi menjadi 2).",
      "Turunkan angka berikutnya (puluhan 2) sehingga terbentuk angka 22. Bagi 22 dengan 5 ($22 : 5 = 4$. Tulis 4 di atas, tulis 20 di bawah 22, kurangi menjadi 2).",
      "Turunkan angka terakhir (satuan 5) sehingga menjadi 25. Bagi 25 dengan 5 ($25 : 5 = 5$. Tulis 5 di atas, tulis 25 di bawah 25, kurangi menjadi 0). Baca hasil akhir: 145."
    ]
  },

  // === 12. math_word_problems ===
  {
    subAreaId: "math_word_problems",
    label: "K1-K2: Soal Cerita Penjumlahan & Pengurangan",
    grades: ["K1", "K2"],
    tool: "Kartu Soal Bergambar Contextual, Counters (Manik-manik kecil)",
    prerequisites: "Anak lancar membaca kalimat pendek dan memahami penjumlahan/pengurangan konkret.",
    directAim: "Menerjemahkan cerita kehidupan sehari-hari ke dalam kalimat matematika (+ dan -).",
    indirectAim: "Aplikasi matematika dalam pemecahan masalah riil dan empati sosial.",
    error: "Bahasa: Salah mengartikan kata kunci cerita (misalnya kata 'diberikan kepada' diartikan penjumlahan padahal pengurangan).",
    quranVerse: "QS. Al-Isra: 12",
    quranMessage: "Menyelesaikan masalah sehari-hari secara adil membutuhkan pemahaman matematika, seperti berbagi kurma atau menghitung hari.",
    coreSteps: [
      "Guru membacakan kartu cerita: 'Ahmad memiliki 5 butir kurma. Ibunya memberikan lagi 3 butir kurma untuk Ahmad. Berapa kurma Ahmad sekarang?'.",
      "Minta anak menggunakan counters (manik) untuk menyimulasikan cerita tersebut: letakkan 5 manik, lalu tambahkan 3 manik.",
      "Tuntun anak menuliskan persamaan matematikanya di kertas: $5 + 3 = 8$.",
      "Ulangi dengan soal cerita pengurangan (misal: membagikan kurma ke teman)."
    ]
  },
  {
    subAreaId: "math_word_problems",
    label: "K2-K3: Soal Cerita Perkalian & Pembagian",
    grades: ["K2", "K3"],
    tool: "Kartu Soal Cerita Kontekstual, Buku Kotak",
    prerequisites: "Anak memahami konsep perkalian (penjumlahan berulang) dan pembagian (bagi rata).",
    directAim: "Memecahkan soal cerita perkalian dan pembagian menggunakan nalar kontekstual.",
    indirectAim: "Persiapan berpikir logis-analitis tingkat lanjut.",
    error: "Bahasa: Kesulitan membedakan kapan harus menggunakan perkalian atau pembagian berdasarkan narasi cerita.",
    quranVerse: "QS. Al-Hadid: 25",
    quranMessage: "Keadilan dalam membagi harta dan hak antar sesama adalah landasan hidup bermasyarakat dalam Islam. Matematika membantu kita membagi dengan adil.",
    coreSteps: [
      "Guru membacakan soal: 'Fatimah ingin membagikan 12 kue bolu secara merata kepada 3 sahabatnya. Berapa kue yang diterima setiap sahabat?'.",
      "Ajak anak berdiskusi: 'Apakah kuenya bertambah banyak atau dibagi rata? Berarti kita gunakan operasi apa?' (Pembagian).",
      "Anak menulis persamaan di buku: $12 : 3 = 4$. Masing-masing mendapat 4 kue.",
      "Latih dengan soal perkalian (misal: 3 kantong berisi masing-masing 5 apel)."
    ]
  },
  {
    subAreaId: "math_word_problems",
    label: "K4-K5: Soal Cerita Pecahan",
    grades: ["K4", "K5"],
    tool: "Lembar Soal Cerita Pecahan, Gambar Diagram Lingkaran",
    prerequisites: "Anak menguasai operasi pecahan dasar (tambah, kurang, kali, bagi pecahan).",
    directAim: "Menyelesaikan soal cerita yang melibatkan bagian pecahan dari suatu objek atau kelompok.",
    indirectAim: "Aplikasi zakat, infak, dan pembagian porsi secara riil.",
    error: "Konsep: Bingung membedakan antara nilai pecahan biasa dengan kuantitas objek riil.",
    quranVerse: "QS. Al-Muzzammil: 20",
    quranMessage: "Allah menetapkan bagian waktu ibadah kita dalam bentuk pecahan malam. Soal cerita pecahan membantu kita mengatur waktu dan hak dengan bijak.",
    coreSteps: [
      "Bacakan soal cerita: 'Ali memiliki uang Rp 10.000. Setengah (1/2) dari uangnya diinfakkan ke masjid. Berapa rupiah uang yang diinfakkan Ali?'.",
      "Ajak anak menggambar persegi panjang sebagai representasi total uang Rp 10.000, lalu membaginya menjadi 2 bagian sama besar.",
      "Hitung nilai dari satu bagian tersebut (Rp 5.000) dan tuliskan kalimat matematikanya: $\\frac{1}{2} \\times 10.000 = 5.000$.",
      "Latih dengan variasi soal cerita pecahan lainnya."
    ]
  },
  {
    subAreaId: "math_word_problems",
    label: "K5-K6: Soal Cerita Campuran & Multi-step",
    grades: ["K5", "K6"],
    tool: "Lembar Kerja Soal Cerita Kompleks, Pensil",
    prerequisites: "Anak menguasai keempat operasi matematika dasar dan nalar analisis bahasa yang baik.",
    directAim: "Menyelesaikan soal cerita kompleks yang membutuhkan lebih dari satu langkah pengerjaan.",
    indirectAim: "Membangun ketekunan menyelesaikan masalah hidup yang bercabang (problem solving).",
    error: "Logika: Melompati langkah perhitungan kedua karena terburu-buru menuliskan hasil dari langkah pertama.",
    quranVerse: "QS. Al-Inshiqaq: 8",
    quranMessage: "Segala amal kita akan dihisab melalui proses pemeriksaan yang sangat detail dan bertahap. Soal cerita multi-step melatih kita berpikir runut dan tidak terburu-buru.",
    coreSteps: [
      "Bacakan soal cerita multi-step: 'Budi membeli 3 kotak pensil. Setiap kotak berisi 10 pensil. Jika ia memberikan 5 pensil kepada adiknya, berapa pensil Budi sekarang?'.",
      "Bimbing anak memecah langkah: Langkah 1, hitung total pensil yang dibeli ($3 \\times 10 = 30$).",
      "Langkah 2, kurangi total pensil dengan yang diberikan ke adik ($30 - 5 = 25$).",
      "Tuliskan persamaan gabungannya secara terstruktur di buku tulis: $(3 \\times 10) - 5 = 25$."
    ]
  },

  // === 13. math_measurement ===
  {
    subAreaId: "math_measurement",
    label: "K1-K2: Pengukuran Panjang (Satuan Tak Baku & Baku)",
    grades: ["K1", "K2"],
    tool: "Penggaris, Meteran Pita, Pita Warna, Counters",
    prerequisites: "Anak mengenal konsep panjang-pendek secara sensoris.",
    directAim: "Mengukur panjang objek menggunakan jengkal/langkah (tak baku) dan centimeter/meter (baku).",
    indirectAim: "Membangun logika spasial, estimasi jarak, dan ketelitian alat ukur.",
    error: "Mekanis: Meletakkan ujung penggaris angka 1 pada awal benda (seharusnya dari angka 0).",
    quranVerse: "QS. Al-Mutaffifin: 1-3",
    quranMessage: "Kecelakaan besarlah bagi orang-orang yang curang dalam menakar dan menimbang. Ketelitian menggunakan alat ukur panjang adalah cerminan kejujuran amanah kita.",
    coreSteps: [
      "Ajak anak mengukur panjang meja menggunakan jengkal tangan mereka, bandingkan hasilnya antar anak (berbeda). Jelaskan ini satuan tak baku.",
      "Guru mengenalkan Penggaris dan Meteran. Tunjukkan letak angka 0 sebagai garis awal pengukuran.",
      "Letakkan tepi penggaris angka 0 pada ujung buku tulis, lalu baca angka di ujung lainnya (misal: 20 cm).",
      "Anak menuliskan hasil pengukuran benda-benda di kelas ke dalam tabel."
    ]
  },
  {
    subAreaId: "math_measurement",
    label: "K2-K3: Pengukuran Berat & Volume",
    grades: ["K2", "K3"],
    tool: "Timbangan Dapur Digital, Gelas Ukur Berisi Air, Wadah Berbagai Ukuran",
    prerequisites: "Anak mengenal sensoris berat-ringan dan penuh-kosong.",
    directAim: "Mengukur berat benda dalam gram/kilogram dan volume cairan dalam mililiter/liter.",
    indirectAim: "Aplikasi sains fisika sederhana, memasak di dapur, dan ketelitian takaran.",
    error: "Mekanis: Salah membaca skala garis ukur pada wadah timbangan analog/gelas.",
    quranVerse: "QS. Ar-Rahman: 7-9",
    quranMessage: "Tegakkanlah timbangan itu dengan adil dan janganlah kamu mengurangi neraca itu. Mengukur berat dan volume mengajarkan kita bersikap adil dalam takaran.",
    coreSteps: [
      "Guru mengenalkan timbangan digital dan gelas ukur.",
      "Anak menimbang benda (misal: buah apel) di atas timbangan dapur, membaca hasilnya (misal: 150 gram).",
      "Anak mengisi air ke dalam gelas ukur hingga garis tertentu, lalu membaca skalanya (misal: 250 ml).",
      "Latih anak menuangkan air dari gelas ukur ke botol minum untuk membandingkan kapasitas wadah."
    ]
  },
  {
    subAreaId: "math_measurement",
    label: "K1-K2: Pengenalan Uang (Koin & Kertas Rupiah)",
    grades: ["K1", "K2"],
    tool: "Uang Mainan Rupiah (Koin dan Kertas)",
    prerequisites: "Anak dapat menghitung angka s.d 1000.",
    directAim: "Mengenali nilai pecahan mata uang Rupiah dari Rp 100 s.d Rp 10.000.",
    indirectAim: "Persiapan kemandirian transaksi belanja (financial literacy).",
    error: "Visual: Salah membedakan nominal Rp 1.000 dan Rp 10.000 karena warnanya yang hampir mirip.",
    quranVerse: "QS. Al-Baqarah: 282",
    quranMessage: "Dan janganlah kamu jemu menuliskan hutang itu, baik kecil maupun besar sampai batas waktu membayarnya. Pengenalan uang melatih amanah dan kerapian catatan finansial.",
    coreSteps: [
      "Guru menggelar berbagai uang kertas dan koin mainan Rupiah di atas karpet.",
      "Tunjukkan koin Rp 500 dan kertas Rp 1.000, ajarkan cara membaca nominal angka nolnya.",
      "Lakukan Three Period Lesson untuk mengenalkan nama uang: Rp 1.000 (seribu rupiah), Rp 2.000, Rp 5.000, Rp 10.000.",
      "Bermain game mencocokkan kartu harga barang dengan nominal uang mainan yang tepat."
    ]
  },
  {
    subAreaId: "math_measurement",
    label: "K2-K3: Operasi Uang (Kembalian)",
    grades: ["K2", "K3"],
    tool: "Uang Mainan Rupiah, Barang-barang Kelas dengan Label Harga",
    prerequisites: "Anak menguasai penjumlahan/pengurangan abstrak dan pengenalan uang.",
    directAim: "Melakukan transaksi jual beli sederhana dan menghitung uang kembalian.",
    indirectAim: "Aplikasi matematika dalam aktivitas sosial-ekonomi nyata.",
    error: "Mekanis: Salah menghitung uang kembalian (mengurangi uang bayar dengan harga barang).",
    quranVerse: "QS. Al-Mutaffifin: 3",
    quranMessage: "Dan apabila mereka menakar atau menimbang untuk orang lain, mereka mengurangi. Kejujuran menghitung kembalian belanja adalah wujud integritas muslim yang mulia.",
    coreSteps: [
      "Guru dan anak membuat simulasi mini market di kelas. Berikan harga pada buku (Rp 3.000) dan pensil (Rp 2.000).",
      "Anak (sebagai pembeli) membawa uang Rp 10.000 untuk membeli buku seharga Rp 3.000.",
      "Bimbing anak (sebagai kasir) menghitung kembalian: Uang Bayar (Rp 10.000) - Harga Buku (Rp 3.000) = Uang Kembalian (Rp 7.000).",
      "Berikan uang kembalian berupa lembaran Rp 5.000 dan Rp 2.000 secara tepat."
    ]
  },
  {
    subAreaId: "math_measurement",
    label: "K1-K2: Membaca Jam Analog (Analog Clock, AM/PM)",
    grades: ["K1", "K2"],
    tool: "Montessori Clock (Jam Mainan dengan Jarum Bergerak)",
    prerequisites: "Anak dapat menghitung lompat lima (skip counting 5).",
    directAim: "Membaca waktu tepat (o'clock), setengah jam (half-past), dan persepuluhan menit pada jam analog.",
    indirectAim: "Kedisiplinan waktu shalat dan menghargai pentingnya waktu.",
    error: "Mekanis: Tertukar fungsi jarum pendek (penunjuk jam) dan jarum panjang (penunjuk menit).",
    quranVerse: "QS. Al-Asr: 1-3",
    quranMessage: "Demi masa. Sesungguhnya manusia itu benar-benar dalam kerugian, kecuali orang-orang yang beriman dan mengerjakan amal saleh. Waktu adalah nikmat berharga dari Allah.",
    coreSteps: [
      "Guru mengenalkan jam mainan: tunjukkan jarum pendek (merah) menunjuk Jam, dan jarum panjang (biru) menunjuk Menit.",
      "Posisikan jarum panjang di angka 12, gerakkan jarum pendek ke angka 3. Katakan: 'Ini jam 3 tepat.'",
      "Posisikan jarum panjang di angka 6, katakan: 'Ini jam 3 lewat 30 menit atau setengah 4.'",
      "Tunjukkan cara menghitung menit dengan melompati angka jam kelipatan 5 (angka 1 = 5 menit, angka 2 = 10 menit, dst)."
    ]
  },
  {
    subAreaId: "math_measurement",
    label: "K2-K3: Kalender & Durasi Waktu",
    grades: ["K2", "K3"],
    tool: "Kalender Dinding, Jam Meja, Kartu Nama Bulan",
    prerequisites: "Anak mengenal konsep membaca jam dasar dan hari dalam seminggu.",
    directAim: "Membaca tanggal pada kalender, menghitung selisih hari/minggu, dan menghitung durasi jam.",
    indirectAim: "Perencanaan agenda harian, puasa Ramadhan, dan manajemen waktu hidup.",
    error: "Mekanis: Salah menghitung jumlah hari dalam bulan tertentu (misal mengira Februari selalu 30 hari).",
    quranVerse: "QS. Yunus: 5",
    quranMessage: "Dialah yang menjadikan matahari bersinar dan bulan bercahaya... agar kamu mengetahui bilangan tahun dan perhitungan waktu. Kalender membantu kita merapikan jadwal ibadah.",
    coreSteps: [
      "Guru meletakkan kalender tahunan di atas karpet.",
      "Ajarkan nama-nama 12 bulan dalam tahun Masehi dan Hijriah secara berurutan.",
      "Berikan soal tantangan durasi: 'Jika hari ini tanggal 5 Juni, tanggal berapakah 2 minggu kemudian?' Tunjukkan cara melompati baris kalender ke bawah.",
      "Gunakan jam untuk menghitung durasi pengerjaan tugas (misal: mulai jam 08.00 selesai jam 09.30, durasinya 1 jam 30 menit)."
    ]
  },
  {
    subAreaId: "math_measurement",
    label: "K3-K4: Survey, Tally, Grafik (Pengumpulan & Grafik Data)",
    grades: ["K3", "K4"],
    tool: "Lembar Survey Kelas, Papan Tulis, Spidol Warna",
    prerequisites: "Anak mahir menghitung counters dan membuat garis lurus.",
    directAim: "Mengumpulkan data sederhana di kelas, mencatat dengan garis tally, dan menyajikannya dalam grafik batang.",
    indirectAim: "Membangun logika statistik dasar, analisis data, dan presentasi visual.",
    error: "Mekanis: Salah menjumlahkan garis tally coret miring (tally kelima) sehingga datanya meleset.",
    quranVerse: "QS. Maryam: 94",
    quranMessage: "Allah telah menghitung mereka dengan hitungan yang teliti. Pengumpulan data melatih kita bersikap objektif dan jujur dalam melihat fakta di lapangan.",
    coreSteps: [
      "Ajak anak melakukan survey kecil di kelas: tanyakan warna buah kesukaan 5 teman.",
      "Tulis nama buah di papan tulis: Apel, Jeruk, Pisang. Buat garis tally (IIII /) setiap ada teman yang menjawab.",
      "Ubah coretan tally menjadi angka numerik.",
      "Gambar sumbu vertikal (jumlah teman) dan horizontal (nama buah) di kertas grafik, arsir kotak ke atas membentuk grafik batang sesuai data survey."
    ]
  },
  {
    subAreaId: "math_measurement",
    label: "K3-K4: Pembulatan & Estimasi (Rounding & Estimation)",
    grades: ["K3", "K4"],
    tool: "Garis Bilangan (Number Line), Kartu Angka Puluhan",
    prerequisites: "Anak memahami nilai tempat satuan dan puluhan secara kuat.",
    directAim: "Membulatkan angka ke puluhan terdekat berdasarkan posisinya pada garis bilangan.",
    indirectAim: "Kemampuan memperkirakan (estimasi) jumlah barang/harga belanja dengan cepat.",
    error: "Mekanis: Membulatkan angka berakhiran 5 ke bawah (seharusnya dibulatkan ke atas).",
    quranVerse: "QS. Al-A'raf: 199",
    quranMessage: "Jadilah pemaaf dan suruhlah orang mengerjakan yang makruf. Estimasi membantu kita bersikap toleran dalam memperkirakan takaran tanpa harus kaku berlebihan.",
    coreSteps: [
      "Guru membentangkan garis bilangan dari angka 10 s.d 20 di atas karpet.",
      "Letakkan klip kertas pada angka 13. Tanyakan kepada anak: 'Angka 13 ini posisinya lebih dekat ke angka 10 atau ke angka 20?' (Lebih dekat ke 10).",
      "Jelaskan aturan pembulatan: angka satuan 1, 2, 3, 4 dibulatkan ke bawah (ke 10). Angka satuan 5, 6, 7, 8, 9 dibulatkan ke atas (ke 20).",
      "Latih anak membulatkan angka-angka acak secara lisan dan di lembar kerja."
    ]
  },

  // === 14. math_number_theory ===
  {
    subAreaId: "math_number_theory",
    label: "K3: Kelipatan & Faktor (Multiples & Factors)",
    grades: ["K3"],
    tool: "Peg Board, Colorful Pegs, Multiplication Bead Bars",
    prerequisites: "Anak menguasai konsep perkalian dasar.",
    directAim: "Menemukan kelipatan suatu bilangan dan membagi bilangan menjadi faktor-faktor penyusunnya secara fisik.",
    indirectAim: "Persiapan konsep KPK, FPB, dan pecahan ekuivalen.",
    error: "Mekanis: Melewatkan angka kelipatan tertentu saat menuliskan daftar deret kelipatan.",
    quranVerse: "QS. Al-Jinn: 28",
    quranMessage: "Allah telah menghitung segala sesuatu satu per satu dengan teliti. Kelipatan dan faktor adalah keteraturan sistematis yang Allah bangun dalam harmoni numerik.",
    coreSteps: [
      "Guru mengenalkan konsep Kelipatan (Multiples): ambil manik 3 sebanyak 1 kali (3), 2 kali (6), 3 kali (9). Tulis deret kelipatan: 3, 6, 9, 12, ...",
      "Guru mengenalkan konsep Faktor (Factors): ambil 12 pasak di Peg Board. Susun pasak tersebut membentuk persegi panjang yang rapi.",
      "Tunjukkan kombinasi susunan persegi panjang yang mungkin terbentuk: 1 x 12, 2 x 6, dan 3 x 4.",
      "Jelaskan bahwa angka 1, 2, 3, 4, 6, dan 12 adalah faktor dari angka 12 karena dapat membagi 12 tanpa sisa."
    ]
  },
  {
    subAreaId: "math_number_theory",
    label: "K4-K5: KPK & FPB (LCM & GCF)",
    grades: ["K4", "K5"],
    tool: "Peg Board, Pasak warna Hijau dan Biru, Lembar Kerja",
    prerequisites: "Anak menguasai kelipatan dan faktor suatu bilangan.",
    directAim: "Menemukan Kelipatan Persekutuan Terkecil (KPK) dan Faktor Persekutuan Terbesar (FPB) dari dua bilangan secara visual.",
    indirectAim: "Penerapan penyamaan penyebut pecahan secara cepat dan pembagian adil.",
    error: "Mekanis: Salah memilih angka terkecil pada persekutuan faktor terbesar (tertukar antara KPK dan FPB).",
    quranVerse: "QS. Al-Kahf: 12",
    quranMessage: "Kemudian Kami bangunkan mereka, agar Kami mengetahui barang siapakah di antara kedua golongan itu yang lebih tepat menghitung durasi waktu mereka tinggal. KPK membantu mencari titik temu waktu yang sama.",
    coreSteps: [
      "Tunjukkan cara mencari KPK dari 3 dan 4: di baris pertama Peg Board, letakkan pasak hijau di setiap kelipatan 3 (3, 6, 9, 12, 15).",
      "Di baris kedua, letakkan pasak biru di setiap kelipatan 4 (4, 8, 12, 16). Tunjukkan angka kolom di mana kedua pasak sejajar pertama kali (angka 12). KPK = 12.",
      "Tunjukkan cara mencari FPB dari 8 dan 12: cari faktor dari 8 (1, 2, 4, 8) dan 12 (1, 2, 3, 4, 6, 12).",
      "Cari faktor persekutuan yang bernilai paling besar yang dimiliki oleh kedua bilangan tersebut (angka 4). FPB = 4."
    ]
  },
  {
    subAreaId: "math_number_theory",
    label: "K4-K5: Bilangan Prima (Sieve of Eratosthenes)",
    grades: ["K4", "K5"],
    tool: "Chart 100 (Papan Ratusan), Pensil Warna, Kertas Cetak",
    prerequisites: "Anak memahami konsep faktor dan perkalian dasar.",
    directAim: "Mengidentifikasi bilangan prima (hanya memiliki 2 faktor) dari angka 1 s.d 100 dengan metode Sieve (saringan) Eratosthenes.",
    indirectAim: "Apresiasi keindahan struktur angka dasar alam semesta (prime numbers).",
    error: "Mekanis: Ikut mencoret angka 2 sebagai prima padahal angka 2 adalah satu-satunya prima genap.",
    quranVerse: "QS. Al-Fajr: 3",
    quranMessage: "Demi yang genap dan yang ganjil. Allah bersumpah dengan angka genap dan ganjil, menunjukkan ada rahasia dan hikmat yang mendalam pada setiap pembagian bilangan.",
    coreSteps: [
      "Guru memberikan lembar Chart 100 kotak angka ke anak.",
      "Jelaskan bahwa angka 1 bukan prima (coret angka 1). Angka 2 adalah prima (lingkari angka 2).",
      "Minta anak mencoret semua kelipatan 2 setelah angka 2 (4, 6, 8, dst). Lakukan hal yang sama untuk prima berikutnya: lingkari 3, coret kelipatan 3; lingkari 5, coret kelipatan 5; lingkari 7, coret kelipatan 7.",
      "Tunjukkan bahwa angka-angka yang tersisa yang tidak tercoret adalah Bilangan Prima (2, 3, 5, 7, 11, 13, 17, 19, ...)."
    ]
  },
  {
    subAreaId: "math_number_theory",
    label: "K4-K5: Urutan Operasi (BODMAS/PEMDAS)",
    grades: ["K4", "K5"],
    tool: "Lembar Kerja Urutan Operasi, Papan Tulis, Spidol",
    prerequisites: "Anak mahir keempat operasi matematika dasar secara abstrak.",
    directAim: "Menyelesaikan persamaan matematika campuran dengan urutan yang benar: Kurung, Pangkat, Kali/Bagi, Tambah/Kurang.",
    indirectAim: "Membangun ketertiban berpikir logis dan hukum prioritas.",
    error: "Mekanis: Mengerjakan operasi tambah dahulu sebelum kali karena letak tambahnya berada di sisi kiri.",
    quranVerse: "QS. As-Saff: 4",
    quranMessage: "Allah mencintai barisan yang teratur kokoh. Aturan urutan operasi (BODMAS) mengajarkan kita pentingnya mendahulukan yang wajib/prioritas utama sebelum yang lainnya.",
    coreSteps: [
      "Guru menuliskan soal di papan tulis: $5 + 3 \\times 2$.",
      "Jelaskan bahwa matematika memiliki hukum prioritas bernama BODMAS: Brackets (Kurung), Orders (Pangkat), Division/Multiplication (Bagi/Kali), Addition/Subtraction (Tambah/Kurang).",
      "Tunjukkan bahwa Kali ($3 \\times 2$) memiliki tingkat prioritas lebih tinggi daripada Tambah ($5 + ...$). Maka kita harus mengalikan dahulu: $3 \\times 2 = 6$.",
      "Langkah kedua, tambahkan hasilnya: $5 + 6 = 11$. Tunjukkan jika dikerjakan kiri ke kanan langsung hasilnya keliru (16)."
    ]
  }
];

async function updateMathCurriculum() {
  const docRef = doc(db, 'kurikulum_pusat', 'matematika');
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    console.error('Error: Document sditbudiluhursamarinda-cc15a/kurikulum_pusat/matematika does not exist.');
    process.exit(1);
  }
  
  const currentData = docSnap.data();
  
  // Backup current data
  writeFileSync('scratch/backup_matematika.json', JSON.stringify(currentData, null, 2), 'utf8');
  console.log('Successfully backed up current document to scratch/backup_matematika.json');
  
  // Create deep copy for mutation
  const updatedData = JSON.parse(JSON.stringify(currentData));
  
  // Define sub-areas map for fast lookup
  const subAreasMap = {};
  updatedData.subAreas.forEach(sub => {
    subAreasMap[sub.id] = sub;
  });
  
  // 1. Redefine and redistribute existing levels' grade fields to K1-K6
  console.log('Updating grades for existing subAreas levels to K1-K6...');
  
  // System Decimal (GB)
  if (subAreasMap['math_decimal_gb']) {
    const levels = subAreasMap['math_decimal_gb'].levels;
    levels.forEach((lvl, idx) => {
      // 1 to 10 is K1
      if (idx < 10) lvl.grades = ["K1"];
      // 11 to 15 is K2
      else if (idx >= 10 && idx < 15) lvl.grades = ["K2"];
      // 16 to 17 is K3
      else if (idx >= 15) lvl.grades = ["K3"];
    });
  }
  
  // Stamp Game
  if (subAreasMap['math_stamp_game']) {
    const levels = subAreasMap['math_stamp_game'].levels;
    levels.forEach((lvl, idx) => {
      // 1 to 5 is K2
      if (idx < 5) lvl.grades = ["K2"];
      // 6 to 9 is K2-K3
      else if (idx >= 5 && idx < 9) lvl.grades = ["K2", "K3"];
      // 10 is K3-K4
      else if (idx === 9) lvl.grades = ["K3", "K4"];
    });
  }
  
  // Dot Game
  if (subAreasMap['math_dot_game']) {
    if (subAreasMap['math_dot_game'].levels && subAreasMap['math_dot_game'].levels[0]) {
      subAreasMap['math_dot_game'].levels[0].grades = ["K2"];
    }
  }
  
  // Bead Frames
  if (subAreasMap['math_bead_frames']) {
    const levels = subAreasMap['math_bead_frames'].levels;
    levels.forEach((lvl, idx) => {
      // 1 to 4 is K2
      if (idx < 4) lvl.grades = ["K2"];
      // 5 to 6 is K2-K3
      else if (idx >= 4 && idx < 6) lvl.grades = ["K2", "K3"];
      // 7 is K3-K4
      else if (idx === 6) lvl.grades = ["K3", "K4"];
    });
  }
  
  // Memorization
  if (subAreasMap['math_memorization']) {
    const levels = subAreasMap['math_memorization'].levels;
    levels.forEach((lvl, idx) => {
      // 1 to 4 is K1-K2
      if (idx < 4) lvl.grades = ["K1", "K2"];
      // 5 to 6 is K2
      else if (idx >= 4 && idx < 6) lvl.grades = ["K2"];
    });
  }
  
  // Bead Cabinet
  if (subAreasMap['math_bead_cabinet']) {
    const levels = subAreasMap['math_bead_cabinet'].levels;
    levels.forEach((lvl, idx) => {
      lvl.grades = ["K1", "K2"];
    });
  }
  
  // Hierarchical
  if (subAreasMap['math_hierarchical']) {
    if (subAreasMap['math_hierarchical'].levels && subAreasMap['math_hierarchical'].levels[0]) {
      subAreasMap['math_hierarchical'].levels[0].grades = ["K2", "K3"];
    }
  }
  
  // Advanced Calculations
  if (subAreasMap['math_advanced_calculations']) {
    const levels = subAreasMap['math_advanced_calculations'].levels;
    levels.forEach((lvl) => {
      lvl.grades = ["K3", "K4"];
    });
  }
  
  // Fractions
  if (subAreasMap['math_fractions']) {
    const levels = subAreasMap['math_fractions'].levels;
    levels.forEach((lvl, idx) => {
      // 1 is K2
      if (idx === 0) lvl.grades = ["K2"];
      // 2 is K3
      else if (idx === 1) lvl.grades = ["K3"];
      // 3 to 5 is K2-K3
      else if (idx >= 2) lvl.grades = ["K2", "K3"];
    });
  }
  
  // Geometry
  if (subAreasMap['math_geometry']) {
    const levels = subAreasMap['math_geometry'].levels;
    levels.forEach((lvl, idx) => {
      // 1 to 2 is K1-K2
      if (idx < 2) lvl.grades = ["K1", "K2"];
      // 3 is K2
      else if (idx === 2) lvl.grades = ["K2"];
      // 4 is K3
      else if (idx === 3) lvl.grades = ["K3"];
    });
  }

  // 2. Initialize new sub-areas if they do not exist
  const newSubAreasInfo = [
    { id: "math_passage_abstraction", name: "Menuju Abstraksi / Passage to Abstraction" },
    { id: "math_word_problems", name: "Soal Cerita / Word Problems & Application" },
    { id: "math_measurement", name: "Pengukuran & Data / Measurement & Data" },
    { id: "math_number_theory", name: "Teori Bilangan / Number Theory" }
  ];
  
  newSubAreasInfo.forEach(ns => {
    if (!subAreasMap[ns.id]) {
      console.log(`Creating new sub-area: [${ns.id}] ${ns.name}`);
      const newSub = {
        id: ns.id,
        name: ns.name,
        levels: []
      };
      updatedData.subAreas.push(newSub);
      subAreasMap[ns.id] = newSub;
    }
  });

  // 3. Process and append the 51 levels
  console.log('Processing and appending 51 new levels...');
  let appendedCount = 0;
  let skippedCount = 0;
  
  newLevelsData.forEach(nl => {
    const targetSub = subAreasMap[nl.subAreaId];
    if (!targetSub) {
      console.error(`Error: Sub-area with ID ${nl.subAreaId} not found.`);
      return;
    }
    
    // Check if level already exists (based on part of label string)
    const normalizedLabel = nl.label.toLowerCase();
    const alreadyExists = targetSub.levels?.some(lvl => {
      const existingLabel = (typeof lvl === 'string' ? lvl : lvl.label)?.toLowerCase() || '';
      return existingLabel.includes(normalizedLabel) || normalizedLabel.includes(existingLabel);
    });
    
    if (alreadyExists) {
      console.log(`  Skipping level: "${nl.label}" (already exists in database)`);
      skippedCount++;
    } else {
      // Generate the steps
      const steps = generateSteps(nl.label, nl.tool, nl.quranVerse, nl.quranMessage, nl.coreSteps);
      
      const newLevelObj = {
        label: nl.label,
        grades: nl.grades,
        presentation: {
          tool: nl.tool,
          prerequisites: nl.prerequisites,
          directAim: nl.directAim,
          indirectAim: nl.indirectAim,
          error: nl.error,
          videoUrl: "",
          steps: steps
        }
      };
      
      if (!targetSub.levels) targetSub.levels = [];
      targetSub.levels.push(newLevelObj);
      appendedCount++;
    }
  });

  console.log(`Done processing: ${appendedCount} levels appended, ${skippedCount} skipped.`);
  
  // Calculate counts for validation
  console.log('=== SUMMARY OF TARGET STRUCTURE ===');
  updatedData.subAreas.forEach(sub => {
    console.log(`  Sub-Area: [${sub.id}] ${sub.name} - Total Levels: ${sub.levels?.length || 0}`);
  });
  
  // Write to Firestore
  console.log('Writing updated math document back to Firestore...');
  await setDoc(docRef, updatedData);
  console.log('Firestore write complete!');
  
  process.exit(0);
}

updateMathCurriculum().catch(err => {
  console.error('Update script failed:', err);
  process.exit(1);
});
