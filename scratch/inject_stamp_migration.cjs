const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/pages/CurriculumManager.jsx');
const content = fs.readFileSync(targetFile, 'utf8');

const newLevelsData = [
  {
    label: "K2: Pengenalan Stamp Game / Introduction To The Stamp Game",
    grades: ["K2"],
    tool: "Stamp Game, Nampan, Perwakilan Golden Beads (1 unit, 1 puluhan, 1 ratusan, 1 ribuan)",
    prerequisites: "Anak telah menyelesaikan seluruh presentasi dasar dan operasi hitung (Statis & Dinamis) menggunakan Golden Beads. Anak sudah terbiasa memegang pensil dan menulis angka secara proporsional di dalam buku kotak-kokak matematika.",
    directAim: "Anak memahami masa transisi dari material konkret ke semi-abstrak. Anak menyadari bahwa kepingan kayu dengan ukuran fisik yang sama persis dapat mewakili nilai yang berbeda (1, 10, 100, 1000) berdasarkan angka yang tertulis dan warna yang melambangkannya.",
    indirectAim: "Membangun kemandirian anak untuk bekerja di atas meja (bukan lagi di karpet). Mempersiapkan fondasi operasional untuk seluruh operasi hitung Stamp Game.",
    error: "Visual & Taktil: Kode warna standar (Hijau untuk Satuan/Ribuan, Biru untuk Puluhan, Merah untuk Ratusan) dan angka yang tercetak pada permukaan kepingan prangko.",
    quranVerse: "QS. Al-Hujurat: 13",
    quranMessage: "Allah tidak menilai manusia dari rupa fisik atau besarnya ukuran tubuh, melainkan dari ketakwaan di dalam dadanya. Sama seperti ubin Stamp Game yang bentuk fisiknya sama kecil, namun nilainya ditentukan oleh tulisan angka di dalamnya.",
    coreSteps: [
      "Guru meletakkan nampan perwakilan Golden Beads dan kotak Stamp Game berdampingan di atas meja.",
      "Guru mengambil 1 butir manik Satuan, menyandingkannya dengan prangko hijau bertuliskan angka 1: 'Di Golden Beads ini satu, dan di Stamp Game kepingan hijau ini juga satu.'",
      "Guru mengambil batang Puluhan, menyandingkannya dengan prangko biru bertuliskan angka 10: 'Di puluhan bentuknya panjang seperti ini. Di Stamp Game, ubin biru kecil ini juga sepuluh karena ada angka 10 tertulis di atasnya.'",
      "Guru menyandingkan keping Ratusan dengan prangko merah bertuliskan angka 100, lalu kubus Ribuan yang besar dengan prangko hijau bertuliskan angka 1000: 'Meskipun ubin seribu ini kecil dan ringan, nilainya persis sama dengan kubus seribu yang besar dan berat.'",
      "Guru menegaskan aturan: 'Mulai sekarang kita berpindah ke meja. Nilai benda ini tidak lagi dilihat dari ukurannya, melainkan dari warna dan angka yang tertulis padanya.'"
    ],
    independentSteps: [
      "Undang anak untuk mengeksplorasi pilihan kegiatan: 'Apakah kamu ingin mencoba menyusun beberapa kepingan prangko ini di atas mejamu?' [Menyenangkan]",
      "Guru memberikan tantangan kecil secara lisan untuk mengecek pemahaman: 'Tolong ambilkan dan susun 4 keping ratusan dan 2 keping satuan secara vertikal.' [Menyenangkan - Kerja Mandiri]",
      "Jika anak sudah tuntas mengeksplorasi seluruh warna dan nilai tempat, bimbing anak merapikan material sesuai warna ke tempatnya: 'Mari pastikan semua prangko masuk ke kotak kecilnya masing-masing. Kepingan ini kecil-kecil, butuh ketelitian agar tidak tercecer.' [Berkesadaran]"
    ],
    reflectionSteps: [
      "Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]",
      "Berikan apresiasi spesifik: 'Masya Allah, hari ini kalian menunjukkan ketelitian tinggi saat membedakan dan menata kepingan prangko yang kecil-kecil.' [Berkesadaran - Merefleksikan]",
      "Tanyakan kepada anak: 'Bagian mana dari kegiatan tadi yang paling menantang bagi kalian saat melihat ubin ribuan ternyata sama kecilnya dengan ubin satuan?' [Berkesadaran - Merefleksikan]"
    ]
  },
  {
    label: "K2-K3: Penjumlahan Statis / Stamp Game - Static Addition",
    grades: ["K2"],
    tool: "Stamp Game, Penggaris/Pita Pembatas, Buku Kotak Matematika, Pensil",
    prerequisites: "Anak menguasai Pengenalan Material Stamp Game, pernah melakukan Penjumlahan Statis dengan Golden Beads.",
    directAim: "Anak mampu melakukan operasi penjumlahan (menggabungkan dua kuantitas) tanpa proses menyimpan pada tingkat semi-abstrak.",
    indirectAim: "Membangun disiplin pencatatan matematika bersusun di buku kotak-kotak.",
    error: "Mekanis: Jika warna ubin tidak sejajar di kolomnya atau hasil perhitungan ubin tidak sesuai dengan angka yang tertulis di buku.",
    quranVerse: "QS. Al-Ma'idah: 2",
    quranMessage: "Dan tolong-menolonglah kamu dalam mengerjakan kebajikan dan takwa. Penjumlahan mengajarkan kita bahwa ketika kebaikan kecil digabungkan dengan kebaikan lainnya, mereka akan bersatu membentuk kekuatan yang lebih besar.",
    coreSteps: [
      "Guru mengajak anak membuka buku kotak-kotaknya dan menuliskan sebuah soal penjumlahan statis secara bersusun ke bawah, misalnya: 2341 + 1234.",
      "Guru menunjuk angka pertama (2341) dan membimbing anak menyusun ubin angka pertama dari atas ke bawah secara vertikal sesuai nilai tempatnya: 1 satuan hijau di kanan, 4 puluhan biru di sebelahnya, 3 ratusan merah, dan 2 ribuan hijau di paling kiri.",
      "Guru mengambil penggaris kecil dan meletakkannya tepat di bawah susunan prangko tersebut sebagai batas.",
      "Guru meminta anak menyusun angka kedua (1234) di bawah penggaris pembatas secara sejajar dengan kolom di atasnya.",
      "Tindakan Fisik (Menggabungkan): Guru menyingkirkan penggaris pembatas, lalu mendorong semua kepingan prangko dari kelompok bawah ke arah atas sehingga mereka menyatu dengan kelompok pertama: 'Menjumlahkan artinya menggabungkan.'",
      "Guru meminta anak menghitung hasil gabungan dimulai dari kolom Satuan, lalu meminta anak menulis angka 5 di kolom satuan pada buku tulis. Lanjutkan menghitung kolom Puluhan, Ratusan, dan Ribuan."
    ],
    independentSteps: [
      "Undang anak untuk mengeksplorasi: 'Bunda akan menuliskan satu soal lagi di bukumu. Apakah kamu ingin mencoba menyusun kepingan prangkonya dan menemukan jawabannya sendiri?' [Menyenangkan]",
      "Berikan soal baru (statis / tidak ada kolom yang melebihi 9). Biarkan anak bekerja mandiri menyusun, menggabungkan, dan mencatat hasilnya di buku. [Menyenangkan - Kerja Mandiri]",
      "Tuntun anak untuk membereskan material setelah selesai mengerjakan: 'Tulisannya sangat rapi dan posisinya pas di dalam kotak! Mari kita kembalikan semua kepingan prangko ke tempatnya sesuai warna agar tidak tercampur.' [Berkesadaran]"
    ],
    reflectionSteps: [
      "Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]",
      "Berikan apresiasi spesifik: 'Masya Allah, Bunda sangat bangga dengan ketelitian kalian menyusun ubin-ubin ini dengan lurus dan mencatat hasilnya dengan rapi.' [Berkesadaran - Merefleksikan]",
      "Recalling Pengalaman: Tanyakan kepada anak: 'Saat melakukan penjumlahan tadi, apa yang kita lakukan dengan penggaris batasnya saat kita mau menggabungkan angka atas dan angka bawah?' [Berkesadaran - Merefleksikan]"
    ]
  },
  {
    label: "K2-K3: Penjumlahan Dinamis / Stamp Game - Dynamic Addition",
    grades: ["K2", "K3"],
    tool: "Stamp Game, Penggaris Pembatas, Buku Kotak, Pensil biasa, Pensil warna merah",
    prerequisites: "Anak mahir Penjumlahan Statis Stamp Game dan terbiasa menulis lurus di buku kotak-kotak.",
    directAim: "Anak mampu melakukan operasi penjumlahan dengan teknik menyimpan atau menukar (carrying over) di tingkat semi-abstrak dengan batasan maksimal 9 di setiap nilai tempat.",
    indirectAim: "Mematangkan konsep nilai tempat desimal desimal dan persiapan mental ke Dot Game.",
    error: "Mekanis: Lupa menukarkan kelompok 10 ubin ke kotak, atau lupa menuliskan angka simpanan merah di buku.",
    quranVerse: "QS. Al-Baqarah: 261",
    quranMessage: "Allah melipatgandakan pahala bagi siapa yang Dia kehendaki. Penggabungan amal kebaikan kecil yang terkumpul hingga sepuluh akan dinaikkan tingkatnya oleh Allah menjadi pahala yang lebih tinggi.",
    coreSteps: [
      "Guru menuliskan soal penjumlahan dinamis bersusun ke bawah di buku anak, misalnya: 2458 + 1764.",
      "Anak menyusun kuantitas pertama, meletakkan penggaris pembatas, menyusun kuantitas kedua, lalu mendorongnya untuk menyatukan.",
      "Anak menghitung ubin satuan hijau: satu, dua, ... sembilan, sepuluh! Guru menghentikan anak pada angka 10: 'Setiap mendapat sepuluh satuan, kita harus segera menukarnya di kotak menjadi satu puluhan.'",
      "Anak memasukkan 10 ubin satuan kembali ke kotak, mengambil 1 ubin puluhan biru, dan meletakkannya di atas kolom puluhan meja.",
      "Guru membimbing anak mengambil pensil warna merah, dan menuliskan angka 1 kecil di atas kolom Puluhan pada buku tulis: 'Kita catat satu puluhan baru ini di sini agar tidak lupa saat dihitung.'",
      "Anak menghitung sisa kepingan satuan yang tertinggal di atas meja (2), menulis angka 2 di buku, lalu beralih menghitung kolom puluhan (termasuk 1 keping biru tambahan hasil tukaran tadi) dan melakukan proses pertukaran yang sama jika kolom tersebut mencapai sepuluh."
    ],
    independentSteps: [
      "Undang anak untuk mengeksplorasi: 'Apakah kamu mau mencoba menjumlahkan angka yang lain dan melakukan pertukarannya sendiri?' [Menyenangkan]",
      "Berikan soal baru (ada pertukaran di kolom yang berbeda-beda). Biarkan anak bekerja mandiri, menukar prangko, dan mencatat angka simpanan kecil dengan pensil warna merah di buku kotak. [Menyenangkan - Kerja Mandiri]",
      "Tuntun anak untuk membereskan material: 'Masukkan kepingannya perlahan, pastikan tidak ada prangko biru yang nyasar masuk ke rumah prangko hijau. Allah menyukai kebersihan dan orang yang menjaga amanah barang dengan baik.' [Berkesadaran]"
    ],
    reflectionSteps: [
      "Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]",
      "Berikan apresiasi spesifik: 'Masya Allah, hari ini kalian menunjukkan kemandirian luar biasa saat melakukan pertukaran di bank secara jujur.' [Berkesadaran - Merefleksikan]",
      "Recalling Pengalaman: Tanyakan kepada anak: 'Saat kamu menukar sepuluh prangko satuan dengan satu prangko puluhan biru, apakah jumlahnya berubah menjadi sedikit atau nilainya tetap sama?' [Berkesadaran - Merefleksikan]"
    ]
  },
  {
    label: "K2-K3: Pengurangan Statis / Stamp Game - Static Subtraction",
    grades: ["K2"],
    tool: "Stamp Game, Buku Kotak Matematika, Pensil",
    prerequisites: "Anak memahami konsep pengurangan dasar di Golden Beads dan mahir Pengenalan Stamp Game.",
    directAim: "Anak mampu melakukan operasi pengurangan (mengambil kuantitas) tanpa proses meminjam di tingkat semi-abstrak.",
    indirectAim: "Melatih pemahaman logika bahwa dalam pengurangan hanya kuantitas awal (minuend) yang disusun.",
    error: "Logika: Mencoba menyusun kedua angka di meja (dalam pengurangan, hanya angka awal yang disusun).",
    quranVerse: "QS. An-Nahl: 70",
    quranMessage: "Nikmat umur dunia kita berkurang setiap harinya. Pengurangan mengingatkan kita untuk selalu membagikan/mengeluarkan sebagian rezeki kita kepada sesama karena harta sejati kita adalah apa yang kita berikan.",
    coreSteps: [
      "Guru menulis soal pengurangan statis bersusun di buku anak, misalnya: 4567 - 1234.",
      "Guru menegaskan aturan penting: 'Dalam pengurangan, kita hanya menyusun angka awal yang paling besar saja di atas meja. Angka kedua tidak disusun.'",
      "Anak menyusun ubin untuk angka pertama (4567) di meja secara vertikal per kolom.",
      "Tunjukkan angka pengurang (1234). Mulai dari Satuan: Guru mengambil 4 ubin hijau dari kolom satuan di meja dan memasukkannya kembali ke kotak.",
      "Lanjutkan ke Puluhan: ambil 3 ubin biru masukkan ke kotak. Ratusan: ambil 2 ubin merah masukkan ke kotak. Ribuan: ambil 1 ubin hijau masukkan ke kotak.",
      "Guru meminta anak menghitung sisa ubin yang masih tertinggal di atas meja (dimulai dari satuan), lalu menuliskan hasilnya di buku menggunakan pensil biasa."
    ],
    independentSteps: [
      "Undang anak untuk mengeksplorasi: 'Bunda akan menuliskan soal pengurangan baru. Apakah kamu ingin mencobanya sendiri?' [Menyenangkan]",
      "Berikan soal pengurangan statis baru di buku kotak. Biarkan anak bekerja secara mandiri menyusun angka awal, mengambil ubin yang dibuang, dan menuliskan sisa di meja sebagai jawaban. [Menyenangkan - Kerja Mandiri]",
      "Bimbing anak merapikan ubin setelah selesai bekerja: 'Mari kita masukkan ubin kembali ke slotnya masing-masing. Kerapian adalah cerminan keindahan akhlak kita.' [Berkesadaran]"
    ],
    reflectionSteps: [
      "Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]",
      "Berikan apresiasi spesifik: 'Masya Allah, kalian sangat jujur dan teliti saat mengambil ubin sesuai angka pengurangnya.' [Berkesadaran - Merefleksikan]",
      "Recalling Pengalaman: Tanyakan kepada anak: 'Apa perbedaan utama yang kalian rasakan saat mempersiapkan alat untuk penjumlahan dan pengurangan?' [Berkesadaran - Merefleksikan]"
    ]
  },
  {
    label: "K2-K3: Pengurangan Dinamis / Stamp Game - Dynamic Subtraction",
    grades: ["K2", "K3"],
    tool: "Stamp Game, Buku Kotak, Pensil biasa, Pensil warna merah",
    prerequisites: "Anak menguasai Pengurangan Statis Stamp Game dengan lancar.",
    directAim: "Anak mampu melakukan operasi pengurangan dengan teknik meminjam atau menukar (borrowing / exchanging) dari kolom nilai tempat sebelah kiri.",
    indirectAim: "Melatih logika pemecahan masalah dan ketelitian saat menghadapi kekurangan jumlah.",
    error: "Mekanis: Lupa mencoret angka di buku dengan pensil merah setelah menukar ubin, atau salah mengambil jumlah ubin hasil pertukaran.",
    quranVerse: "QS. An-Nisa: 12",
    quranMessage: "Allah menetapkan hak waris secara teliti dan adil. Tolong-menolong antar nilai tempat (meminjamkan) menjamin keakuratan hasil akhir, mendidik kita untuk selalu peka membantu sesama yang kekurangan.",
    coreSteps: [
      "Guru menulis soal pengurangan dinamis bersusun ke bawah di buku anak, misalnya: 4231 - 1546.",
      "Guru meminta anak hanya menyusun kepingan prangko untuk angka pertama (4231) di atas meja. Angka kedua tidak disusun.",
      "Guru menunjuk angka satuan pada soal di buku (1 - 6): 'Kita punya satu satuan hijau di meja, dan kita diminta mengambil orang enam satuan. Apakah cukup?' (Anak menjawab tidak).",
      "Hukum Meminjam (Borrowing/Exchanging): Anak mengambil 1 keping puluhan biru dari meja, dan memasukkannya kembali ke kotak. Sebagai gantinya, anak mengambil 10 keping satuan hijau dari kotak, lalu meletakkannya di kolom Satuan.",
      "Pencatatan (Recording the Exchange): Guru membimbing anak mengambil pensil merah, mencoret angka puluhan 3 di buku menjadi 2, dan menulis angka 1 merah di samping satuan sehingga menjadi 11.",
      "Tindakan Fisik (Mengambil/Mengurangi): Kini di meja ada 11 keping satuan hijau. Anak menghitung dan mengambil 6 keping satuan hijau ke bawah/masuk kotak. Sisanya (5) dibiarkan di atas.",
      "Anak beralih ke kolom puluhan (2 - 4). Karena tidak cukup, anak meminjam 1 keping ratusan merah, menukarnya dengan 10 keping puluhan biru dari kotak, mencatatnya dengan pensil merah di buku, lalu menarik 4 puluhan ke bawah.",
      "Lanjutkan proses peminjaman ini hingga kolom Ribuan, lalu minta anak menghitung sisa prangko yang tertinggal di atas meja dan menulis hasilnya di buku."
    ],
    independentSteps: [
      "Undang anak untuk mengeksplorasi: 'Apakah kamu mau mencoba soal pengurangan yang lain dan melakukan peminjamannya sendiri ke bank?' [Menyenangkan]",
      "Berikan soal baru (ada proses meminjam di kolom yang berbeda). Biarkan anak bekerja mandiri, menukar prangko, mencatat coretan merah di buku kotak, dan menghitung sisanya. [Menyenangkan - Kerja Mandiri]",
      "Tuntun anak untuk membereskan material ke rak: 'Mari kembalikan kepingannya perlahan, pastikan kepingan ratusan merah tidak masuk ke rumah ribuan hijau.' [Berkesadaran]"
    ],
    reflectionSteps: [
      "Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]",
      "Berikan apresiasi spesifik: 'Masya Allah, Bunda sangat kagum melihat kesabaran kalian saat menukar kepingan yang tidak cukup tadi.' [Berkesadaran - Merefleksikan]",
      "Recalling Pengalaman: Tanyakan kepada anak: 'Saat kamu meminjam tadi, satu keping biru yang kamu kembalikan ke kotak berubah menjadi berapa keping hijau saat diletakkan di mejamu?' [Berkesadaran - Merefleksikan]"
    ]
  },
  {
    label: "K2-K3: Perkalian Statis / Stamp Game - Static Multiplication",
    grades: ["K2", "K3"],
    tool: "Stamp Game, Pion/Bidak Hijau (Satuan), Buku Kotak, Pensil",
    prerequisites: "Anak memahami konsep perkalian sebagai penjumlahan berulang di Golden Beads.",
    directAim: "Anak mampu melakukan operasi perkalian tanpa proses menukar (statis) menggunakan bantuan pion hijau sebagai pengali.",
    indirectAim: "Mematangkan memori perkalian dasar dan konsep pelipatgandaan.",
    error: "Mekanis: Menyusun jumlah ubin yang tidak sama di bawah masing-masing pion pengali.",
    quranVerse: "QS. Al-Baqarah: 245",
    quranMessage: "Barangsiapa meminjamkan kepada Allah pinjaman yang baik, maka Allah akan melipatgandakan ganti kepadanya dengan banyak. Perkalian mengajarkan kemurahan Allah melipatgandakan amal hamba-Nya.",
    coreSteps: [
      "Guru mengajak anak menuliskan sebuah soal perkalian statis di buku kotak, misalnya: 2321 x 3.",
      "Pengenalan Pengali (Multiplier): Guru menunjuk angka 3 pada soal dan meminta anak meletakkan 3 buah pion/bidak hijau dari kotak secara berjejer horizontal di bagian atas meja kerja.",
      "Menyusun Kuantitas (Multiplicand): Guru menunjuk angka 2321: 'Kita harus memberikan angka dua ribu tiga ratus dua puluh satu ini kepada setiap pion secara adil.'",
      "Di bawah pion hijau pertama, anak menyusun prangko 2321 secara vertikal. Lakukan hal yang sama persis (identik) di bawah pion kedua dan ketiga.",
      "Tindakan Fisik (Menggabungkan): Guru menyingkirkan ketiga pion hijau ke sudut meja, lalu meminta anak mendorong semua kepingan prangko dari ketiga lajur ke tengah hingga menyatu per kolom.",
      "Anak menghitung hasil akhir ubin dari kolom satuan dan mencatat hasilnya di buku kotak-kotak secara berurutan ke kiri."
    ],
    independentSteps: [
      "Undang anak untuk mengeksplorasi: 'Apakah kamu mau mencoba soal perkalian yang lain dan menyusun kepingannya sendiri di bawah pion hijau?' [Menyenangkan]",
      "Berikan soal baru (statis, hasil tiap kolom tidak ada yang melebihi 9). Biarkan anak bekerja mandiri, meletakkan pion, menyusun prangko, menggabungkan, dan mencatat hasilnya di buku. [Menyenangkan - Kerja Mandiri]",
      "Tuntun anak untuk membereskan material ke rak setelah selesai: 'Kembalikan kepingan dan pion hijaunya ke dalam kotak. Pastikan kotaknya tertutup rapat agar tidak ada yang hilang.' [Berkesadaran]"
    ],
    reflectionSteps: [
      "Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]",
      "Berikan apresiasi spesifik: 'Masya Allah, Bunda senang melihat ketelitian kalian menyusun jumlah ubin yang sama persis di bawah masing-masing pion.' [Berkesadaran - Merefleksikan]",
      "Recalling Pengalaman: Tanyakan kepada anak: 'Menurut kalian, lebih cepat mana, menjumlahkan angka yang beda-beda, atau melakukan perkalian seperti tadi dengan menyusun angka yang sama berkali-kali lalu digabung?' [Berkesadaran - Merefleksikan]"
    ]
  },
  {
    label: "K2-K3: Perkalian Dinamis / Stamp Game - Dynamic Multiplication",
    grades: ["K2", "K3"],
    tool: "Stamp Game, Pion Hijau, Buku Kotak, Pensil biasa, Pensil warna merah",
    prerequisites: "Anak menguasai Perkalian Statis dan Penjumlahan Dinamis di Stamp Game.",
    directAim: "Anak mampu melakukan operasi perkalian dengan teknik menyimpan atau menukar (carrying over) ke nilai tempat lebih tinggi.",
    indirectAim: "Persiapan mental untuk perkalian multi-digit dan penguatan konsentrasi.",
    error: "Mekanis: Salah menukar 10 ubin ke kotak, atau lupa mencatat angka simpanan merah di kolom berikutnya.",
    quranVerse: "QS. Al-An'am: 160",
    quranMessage: "Siapa yang berbuat kebaikan akan mendapat balasan sepuluh kali lipat. Melalui perkalian dinamis, kita melihat bagaimana angka kecil dikumpulkan berulang kali hingga naik tingkat menjadi puluhan, ratusan, bahkan ribuan.",
    coreSteps: [
      "Guru menuliskan soal perkalian dinamis bersusun ke bawah di buku anak, misalnya: 1456 x 3.",
      "Guru meminta anak mengambil 3 pion hijau dari kotak dan menjejerkannya di bagian atas meja.",
      "Anak diminta menyusun ubin sejumlah 1456 secara vertikal di bawah pion pertama, pion kedua, dan pion ketiga secara identik.",
      "Tindakan Fisik (Menggabungkan): Guru menyingkirkan ketiga pion hijau, lalu meminta anak mendorong dan menggabungkan semua kepingan prangko sesuai warnanya di tengah meja.",
      "Hukum Pertukaran (Dynamic Exchange): Anak menghitung satuan hijau: satu, dua, tiga... delapan, sembilan, sepuluh! Anak mengambil 10 keping satuan hijau tersebut dan memasukkannya ke kotak, lalu menukarnya dengan 1 keping puluhan biru yang diletakkan di atas kolom puluhan meja.",
      "Pencatatan (Carrying Over): Anak mengambil pensil merah dan menulis angka 1 kecil di atas kolom Puluhan pada buku tulis.",
      "Anak melanjutkan menghitung sisa satuan hijau di meja (8), menulis angka 8 di buku, lalu mengulangi proses perhitungan dan pertukaran yang sama untuk kolom puluhan dan ratusan."
    ],
    independentSteps: [
      "Undang anak untuk mengeksplorasi: 'Apakah kamu mau mencoba mengalikan angka yang lain dan menukarkan kepingannya sendiri ke bank?' [Menyenangkan]",
      "Berikan soal baru (ada proses menukar di beberapa kolom). Biarkan anak bekerja mandiri, meletakkan pion, menyusun prangko, menggabungkan, menukar ke bank, dan mencatat hasilnya di buku kotak. [Menyenangkan - Kerja Mandiri]",
      "Tuntun anak untuk membereskan material: 'Mari kembalikan pion dan prangko ke tempat asalnya. Allah sangat menyukai keindahan dan hamba-Nya yang pandai merawat barang.' [Berkesadaran]"
    ],
    reflectionSteps: [
      "Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]",
      "Berikan apresiasi spesifik: 'Masya Allah, Bunda sangat kagum. Walaupun kepingannya tadi sangat banyak, kalian tetap sabar menukar setiap mencapai angka sepuluh.' [Berkesadaran - Merefleksikan]",
      "Recalling Pengalaman: Tanyakan kepada anak: 'Apa yang terjadi pada kepingan yang awalnya berbaris panjang setelah ditukar-tukar? Mengapa itu membantu kita membaca angka dengan mudah?' [Berkesadaran - Merefleksikan]"
    ]
  },
  {
    label: "K2-K3: Pembagian Statis / Stamp Game - Static Division",
    grades: ["K2", "K3"],
    tool: "Stamp Game, Pion Hijau, Mangkuk Kecil, Buku Kotak, Pensil",
    prerequisites: "Anak memahami konsep pembagian sebagai proses membagi sama rata dari Golden Beads.",
    directAim: "Anak mampu melakukan operasi pembagian tanpa sisa (statis) dengan memulai pembagian dari nilai tempat terbesar.",
    indirectAim: "Menanamkan pemahaman bahwa jawaban pembagian adalah apa yang diperoleh oleh HANYA SATU pion.",
    error: "Mekanis: Membagikan ubin tidak berurutan, atau salah membaca hasil akhir (membaca total seluruh ubin, bukan per satu pion).",
    quranVerse: "QS. Ar-Rahman: 9",
    quranMessage: "Tegakkanlah timbangan itu dengan adil dan janganlah kamu mengurangi neraca itu. Pembagian melatih kejujuran dan rasa keadilan sosial dengan mendistribusikan hak secara merata.",
    coreSteps: [
      "Guru menulis soal pembagian statis di buku anak menggunakan simbol porogapit, misalnya: 8462 : 2.",
      "Anak menyusun total harta awal (8462) di mangkuk kecil atau di bagian bawah meja.",
      "Guru menunjuk pembagi (2): anak meletakkan 2 pion hijau berjejer horizontal di bagian atas meja.",
      "Guru menekankan aturan emas pembagian: 'Kita harus membagikan mulai dari kelompok nilai tempat yang terbesar, yaitu Ribuan.'",
      "Anak mengambil ubin ribuan dari bawah dan membagikannya secara bergantian kepada pion pertama dan kedua hingga habis. Lanjutkan membagikan ratusan, puluhan, dan satuan."
    ],
    independentSteps: [
      "Undang anak untuk mengeksplorasi: 'Apakah kamu mau mencoba membagikan kepingan prangko untuk teman pion kita dengan soal yang lain?' [Menyenangkan]",
      "Berikan soal baru (statis, angkanya habis dibagi tanpa harus menukar ke bank). Biarkan anak bekerja mandiri, meletakkan pion, menyusun prangko di bawah, membaginya dari nilai terbesar, dan mencatat hasil milik satu pion di buku. [Menyenangkan - Kerja Mandiri]",
      "Tuntun anak untuk membereskan material ke rak: 'Kembalikan semua prangko dan pion ke kotaknya dengan tertib. Allah menyukai orang-orang yang menjaga kerapian.' [Berkesadaran]"
    ],
    reflectionSteps: [
      "Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]",
      "Berikan apresiasi spesifik: 'Masya Allah, Bunda sangat salut melihat caramu bekerja membagikan kepingan secara merata.' [Berkesadaran - Merefleksikan]",
      "Recalling Pengalaman: Tanyakan kepada anak: 'Kenapa ya di dalam pembagian kita hanya melihat jawaban dari satu pion saja? Dan mengapa kita mulai membagikan dari nilai terbesar?' [Berkesadaran - Merefleksikan]"
    ]
  },
  {
    label: "K2-K3: Pembagian Dinamis / Stamp Game - Dynamic Division",
    grades: ["K2", "K3"],
    tool: "Stamp Game, Pion Hijau, Buku Kotak, Pensil",
    prerequisites: "Anak menguasai Pembagian Statis Stamp Game dan terbiasa dengan hukum pertukaran.",
    directAim: "Anak mampu melakukan operasi pembagian dengan teknik meminjam atau menukar sisa ubin yang tidak habis dibagi rata.",
    indirectAim: "Mempersiapkan pemahaman pembagian bersusun panjang (long division) secara tertulis.",
    error: "Mekanis: Menyisakan ubin yang tidak habis membagi di meja tanpa menukarnya ke nilai tempat bawahnya.",
    quranVerse: "QS. Saba: 3",
    quranMessage: "Tidak ada yang tersembunyi dari Tuhanmu meskipun sebesar zarrah. Ketelitian menukar sisa bagi memastikan tidak ada hak yang terbuang sia-sia.",
    coreSteps: [
      "Guru menuliskan soal pembagian dinamis di buku anak, misalnya: 5264 : 4.",
      "Anak meletakkan 4 pion hijau di atas meja, menyusun ubin total 5264 di bagian bawah meja.",
      "Anak membagikan ubin ribuan (5) kepada 4 pion. Masing-masing pion mendapat 1 ribuan, dan ada 1 ribuan sisa yang tidak cukup dibagi rata.",
      "Hukum Penukaran Sisa: Guru menuntun anak: 'Sisa satu ribuan ini harus kita kembalikan ke kotak, menukarnya dengan sepuluh ratusan merah, lalu meletakkannya di kelompok ratusan bawah meja.'",
      "Kini kelompok ratusan memiliki 12 ubin. Anak membagikan 12 ratusan tersebut kepada 4 pion (masing-masing mendapat 3 ratusan).",
      "Anak melanjutkan membagikan puluhan (6 puluhan). 4 terbagi ke 4 pion, sisa 2 puluhan ditukar menjadi 20 satuan di bawah meja. Bagikan total 24 satuan kepada 4 pion (masing-masing mendapat 6 satuan).",
      "Guru meminta anak menutup lajur pion lainnya, menghitung hasil milik satu pion (1366), dan mencatatnya di buku kotak."
    ],
    independentSteps: [
      "Undang anak untuk mengeksplorasi: 'Apakah kamu mau mencoba membagikan soal pembagian dinamis lainnya secara mandiri?' [Menyenangkan]",
      "Berikan soal baru. Biarkan anak bekerja mandiri, membagi mulai dari nilai terbesar, menukarkan sisa ubin yang tidak bisa dibagi rata ke bank, melanjutkan pembagian, dan menuliskan hasilnya di buku. [Menyenangkan - Kerja Mandiri]",
      "Tuntun anak untuk membereskan material: 'Kembalikan semua prangko dan pion ke kotaknya dengan tertib. Pastikan tidak ada kepingan yang tertinggal di bawah meja.' [Berkesadaran]"
    ],
    reflectionSteps: [
      "Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]",
      "Berikan apresiasi spesifik: 'Masya Allah, kalian sangat tekun dan teliti melakukan penukaran sisa ubin tadi secara mandiri.' [Berkesadaran - Merefleksikan]",
      "Recalling Pengalaman: Tanyakan kepada anak: 'Apa yang kalian lakukan ketika ada ubin ribuan yang tersisa dan tidak bisa dibagikan langsung kepada empat pion?' [Berkesadaran - Merefleksikan]"
    ]
  },
  {
    label: "K3: Pembagian Kelompok / Stamp Game - Group Division",
    grades: ["K3", "K4"],
    tool: "Stamp Game, Pion Hijau (Satuan), Pion Biru (Puluhan), Pion Merah (Ratusan), Buku Kotak, Pensil",
    prerequisites: "Anak mahir Pembagian Dinamis Stamp Game.",
    directAim: "Anak mampu melakukan operasi pembagian dengan pembagi multi-digit menggunakan aturan proporsi Pion (Rule of the Skittle).",
    indirectAim: "Persiapan pembagian bersusun panjang dengan pembagi puluhan/ratusan.",
    error: "Mekanis: Memberikan warna ubin yang sama kepada pion hijau dan pion biru (melanggar Hukum Pion bahwa puluhan mendapat ubin 10x lipat lebih besar).",
    quranVerse: "QS. Al-Mulk: 3",
    quranMessage: "Kamu sekali-kali tidak melihat pada ciptaan Tuhan Yang Maha Pemurah sesuatu yang tidak seimbang. Keseimbangan proporsi pembagian membuktikan hukum keadilan Allah.",
    coreSteps: [
      "Guru mengajak anak menuliskan soal pembagian dua digit di buku kotak, misalnya: 483 : 21.",
      "Anak menyusun total ubin 483 di bagian bawah meja.",
      "Hukum Pion (Rule of the Skittle): Pembagi adalah 21 (2 puluhan dan 1 satuan). Anak meletakkan 2 pion biru (puluhan) and 1 pion hijau (satuan) berjejer di atas meja.",
      "Guru menjelaskan aturan proporsi: 'Pion biru bernilai sepuluh kali lipat dari pion hijau. Maka, ketika pion biru mendapat ratusan, pion hijau mendapat puluhan. Ketika pion biru mendapat puluhan, pion hijau mendapat satuan.'",
      "Anak membagikan ubin mulai dari ratusan: berikan ubin ratusan merah kepada 2 pion biru (masing-masing mendapat 2), and ubin puluhan biru kepada pion hijau (mendapat 2).",
      "Anak membagikan sisa ubin (6 puluhan, 3 satuan): berikan ubin puluhan biru kepada 2 pion biru (masing-masing mendapat 3), and ubin satuan hijau kepada pion hijau (mendapat 3).",
      "Guru menegaskan aturan hasil: 'Jawaban akhir pembagian selalu merujuk pada apa yang diperoleh oleh HANYA SATU PION HIJAU (SATUAN).' Anak melihat pion hijau mendapat 2 puluhan dan 3 satuan, sehingga jawabannya adalah 23. Catat di atas garis bagi di buku."
    ],
    independentSteps: [
      "Undang anak untuk mengeksplorasi: 'Apakah kamu mau mencoba membagikan soal pembagian kelompok lainnya secara mandiri bersama temanmu?' [Menyenangkan]",
      "Berikan soal baru pembagian dua digit (misal: 693 : 33). Biarkan anak bekerja secara mandiri atau berpasangan menentukan jenis pion (biru dan hijau), menyusun ubin, membagikan sesuai proporsi, dan mencatat hasilnya. [Menyenangkan - Kerja Mandiri]",
      "Tuntun anak untuk membereskan material: 'Mari kumpulkan pion biru dan hijau kembali ke kotaknya. Jaga semua komponen agar tetap utuh dan rapi di rak.' [Berkesadaran]"
    ],
    reflectionSteps: [
      "Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]",
      "Berikan apresiasi spesifik: 'Masya Allah, kerja sama kalian dalam memahami aturan pion biru dan hijau hari ini sangat luar biasa.' [Berkesadaran - Merefleksikan]",
      "Recalling Pengalaman: Tanyakan kepada anak: 'Mengapa ketika pion biru (puluhan) mendapat ubin puluhan biru, pion hijau (satuan) harus mendapat ubin satuan hijau? Mengapa bukan ratusan?' [Berkesadaran - Merefleksikan]"
    ]
  }
];

// Map Javascript objects to correct levels with steps generated
const levels = newLevelsData.map(nl => {
  const steps = [];
  steps.push("I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)");
  steps.push("1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]");
  steps.push("2. Undang anak ke area kerja dan katakan: 'Nak, hari ini kita akan mengeksplorasi " + nl.label.split(' / ')[0] + " menggunakan " + nl.tool + ". Mari kita lihat keagungan susunan ciptaan Allah.' [Berkesadaran]");
  steps.push("3. Siapkan area kerja yang bersih dan rapi di atas meja.");
  steps.push("4. Guru membawa material " + nl.tool + " ke atas meja bersama anak dengan penuh rasa hormat terhadap alat kerja. [Berkesadaran]");
  
  steps.push("II. PRESENTASI INTI (Langkah Eksplorasi)");
  steps.push("5. Guru meletakkan material di tengah meja dan meminta anak mengamatinya secara visual. [Bermakna - Memahami]");
  
  let stepIdx = 6;
  nl.coreSteps.forEach(cs => {
    steps.push(stepIdx + ". " + cs + " [Bermakna - Mengaplikasikan]");
    stepIdx++;
  });
  
  steps.push("III. KERJA MANDIRI (Pijakan Saat Main)");
  nl.independentSteps.forEach(is => {
    steps.push(stepIdx + ". " + is);
    stepIdx++;
  });
  
  steps.push("IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)");
  nl.reflectionSteps.forEach(rs => {
    steps.push(stepIdx + ". " + rs);
    stepIdx++;
  });
  steps.push(stepIdx + ". Internalisasi Nilai Islam (" + nl.quranVerse + "): Guru menjelaskan: '" + nl.quranMessage + "' [Berkesadaran - Merefleksikan]");
  stepIdx++;
  steps.push(stepIdx + ". Ajak anak berkomitmen melakukan satu kebaikan nyata hari ini sebagai wujud syukur atas akal dan kemampuan yang Allah berikan. [Berkesadaran - Mengaplikasikan]");
  stepIdx++;
  steps.push(stepIdx + ". Mengucap hamdalah bersama-sama untuk menutup sesi kerja: 'Alhamdulillahi rabbil 'alamin.' [Berkesadaran]");
  stepIdx++;
  steps.push(stepIdx + ". Guru mengucapkan kalimat penutup kepada anak: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]");
  
  return {
    label: nl.label,
    grades: nl.grades,
    presentation: {
      tool: nl.tool.split(', ')[0],
      prerequisites: nl.prerequisites,
      directAim: nl.directAim,
      indirectAim: nl.indirectAim,
      error: nl.error,
      videoUrl: "",
      steps: steps
    }
  };
});

// Construct the useEffect block code string
const injectionEffect = `
    // --- ONE-TIME STAMP GAME UPDATE MIGRATION ---
    useEffect(() => {
        const runStampMigration = async () => {
            if (localStorage.getItem('migrated_stamp_game_ami_v3')) return;
            console.log("Starting Stamp Game AMI Migration...");
            try {
                const docRef = doc(db, 'kurikulum_pusat', 'matematika');
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) return;
                const currentData = docSnap.data();
                const updatedData = JSON.parse(JSON.stringify(currentData));
                
                const stampLevels = ${JSON.stringify(levels, null, 2)};
                
                const stampSub = updatedData.subAreas.find(sa => sa.id === 'math_stamp_game');
                if (stampSub) {
                    stampSub.levels = stampLevels;
                    await setDoc(docRef, updatedData);
                    console.log("Stamp Game update successful!");
                    localStorage.setItem('migrated_stamp_game_ami_v3', 'true');
                    alert("Berhasil memperbarui Stamp Game ke standar AMI murni!");
                    window.location.reload();
                }
            } catch (err) {
                console.error("Migration failed:", err);
            }
        };

        if (loading === false && curriculum.length > 0) {
            runStampMigration();
        }
    }, [loading, curriculum]);
`;

// Insert the new hook into CurriculumManager.jsx
// Let's replace the old Stamp Game migration block if it was left, or clean target
// Wait! Since we deleted the Stamp Game hook using restore_stamp_migration.cjs, the file is currently clean without ANY hook.
// So let's insert it right after the `const [loading, setLoading] = useState(true);` line (which is line 104).
const targetHook = 'const [loading, setLoading] = useState(true);';
const insertPos = content.indexOf(targetHook);
if (insertPos === -1) {
  console.log("Error: Target state not found in CurriculumManager.jsx!");
  process.exit(1);
}

const replacementPos = insertPos + targetHook.length;
const newContent = content.substring(0, replacementPos) + "\n" + injectionEffect + content.substring(replacementPos);

fs.writeFileSync(targetFile, newContent, 'utf8');
console.log("Successfully injected Clean-Quoted Stamp Game migration useEffect into CurriculumManager.jsx!");
