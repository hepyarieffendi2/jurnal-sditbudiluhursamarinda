import React, { useState, useEffect } from 'react';
import { useAuth, canManageContent } from '../context/AuthContext';
import { ShieldAlert, XCircle, CheckCircle2, AlertTriangle, Lightbulb, Save, Edit3, Plus, Trash2, X, Loader, ChevronDown, ChevronUp, Download, Search, HandHeart, BookOpen, Clock, Activity, Volume1, MessageCircle, Heart, ListOrdered, Sparkles, Printer, CheckSquare, Square } from 'lucide-react';
import { db } from '../firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const defaultSOPs = [
  // Pagi / Kedatangan
  {
    id: 1, fase: "Fase 1: Kedatangan", judul: "Penyambutan & Salam di Pintu", tujuan: "Membangun koneksi awal yang positif dan mengecek kesiapan emosi anak.", langkah: [
      "Guru memeriksa kesiapan diri (tersenyum, postur tubuh baik, dan tenang) sebelum membuka pintu kelas.",
      "Guru menyambut sejajar dengan mata anak (merendahkan tubuh/duduk di kursi kecil).",
      "Menyambut anak dengan senyum ramah, menatap matanya, dan memanggil nama kesayangannya.",
      "Mengucapkan salam dengan suara yang jelas tapi lembut, mencontohkan pilar Berbicara Pelan & Sopan.",
      "Mengecek kebersihan diri anak (kuku, seragam, rambut) secara wajar tanpa membuat anak malu.",
      "Mengecek Perasaan Pagi: Jika wajah anak terlihat sedih/rewel, berikan waktu menenangkan diri sejenak sebelum dia bergabung dengan teman."
    ], afirmasi: "Assalamu'alaikum sayang. Mari masuk ke kelas. Permisi, sepatunya dilepas dulu ya nak. Ingat selalu Berbicara Pelan & Sopan.", pilar: ['Berbicara Pelan & Sopan']
  },

  {
    id: 2, fase: "Fase 1: Kedatangan", judul: "Meletakkan Sepatu & Tas", tujuan: "Melatih kemandirian anak dalam menata barang pribadinya sendiri tanpa dibantu orang tua.", langkah: [
      "Anak berhenti di batas alas (sebelum karpet/lantai kelas) sebelum melepas sepatu.",
      "Anak melepas sepatu sendiri. Orang tua atau pengantar cukup melihat dari jauh.",
      "Sepatu diletakkan berpasangan dengan rapi dan lurus di rak sepatu kelas.",
      "Anak berjalan memasuki area kelas sambil tetap memakai tasnya.",
      "Berjalan tertib menuju loker masing-masing sesuai nama raknya.",
      "Mengeluarkan botol minum dan kotak bekal, lalu menaruhnya di keranjang makan yang disediakan.",
      "Menggantungkan tas dengan rapi dan memastikan ritsletingnya tertutup."
    ], afirmasi: "Hebat sekali! Alhamdulillahi Jaza Kumullohu Khoiro sudah membudayakan Antri saat giliran menaruh tas di rak lokermu.", pilar: ['Budayakan Antri']
  },

  {
    id: 3, fase: "Fase 1: Kedatangan", judul: "SASUKE Pagi (Merapikan Meja)", tujuan: "Menumbuhkan tanggung jawab kebersihan pada area terdekatnya.", langkah: [
      "Setelah urusan meletakkan tas selesai, anak langsung menuju bangku atau meja belajarnya.",
      "Mengecek kebersihan atas meja, memastikan tidak ada debu atau kotoran.",
      "Mengecek ke dalam laci meja: memastikan tidak ada bungkus makanan atau sampah tertinggal kemarin.",
      "Jika perlu lewat meja teman, anak wajib mengucapkan 'Permisi'.",
      "Berjalan membuang sampah temuan ke tempat sampah yang sesuai.",
      "Kembali ke meja, menyusun posisi kotak pensil atau buku standar di sudut kanan atas meja.",
      "Anak duduk lurus dan merapatkan kursinya ke meja agar tidak menghalangi jalan teman."
    ], afirmasi: "Meja belajarmu sudah rapi! Alhamdulillahi Jaza Kumullohu Khoiro sudah selalu Jaga Kebersihan terbiasa sejak pagi.", pilar: ['Jaga Kebersihan']
  },

  // Spiritual & Alam
  {
    id: 4, fase: "Fase 2: Spiritual & Alam", judul: "Antre Wudhu (Membentuk Barisan)", tujuan: "Melatih kesabaran antre dan transisi perpindahan ruangan yang damai.", langkah: [
      "Guru memberikan arahan: 'Amal sholeh anak-anak, silakan bentuk baris kereta menuju area wudhu.'",
      "Anak-anak berbaris memanjang ke belakang, menjaga jarak satu rentangan tangan agar tidak saling tabrak.",
      "Anak menahan diri untuk tidak ngobrol, menjaga suara agar tidak mengganggu kelas lain yang sedang belajar.",
      "Berjalan dengan tenang, dilarang keras untuk berlari-lari. Jika ingin mendahului teman, wajib bilang 'Permisi'.",
      "Tangan diletakkan di samping badan, tidak boleh iseng mendorong teman atau pegangan tangga.",
      "Setibanya di area wudhu, anak menunggu di titik batas antre yang sudah ditentukan."
    ], afirmasi: "Barisannya sungguh rapi. Ingat untuk Budayakan Antri dan mempraktikkan kata Permisi saat berjalan di lorong.", pilar: ['Budayakan Antri', 'Berbicara Pelan & Sopan']
  },

  {
    id: 5, fase: "Fase 2: Spiritual & Alam", judul: "Pelaksanaan Wudhu (Hemat Air)", tujuan: "Mensucikan fisik sesuai syariat dengan berhemat.", langkah: [
      "Maju ke keran wudhu hanya saat teman di depannya sudah benar-benar selesai dan pergi.",
      "Membuka keran air pelan-pelan (hanya setengah putaran) agar air mengalir secukupnya.",
      "Melaksanakan gerakan wudhu secara berurutan, dimulai dari membaca Basmalah.",
      "Menjaga cipratan air; dilarang keras menepuk air wudhu hingga membasahi lantai/dinding secara berlebihan.",
      "Jika air tidak sengaja terciprat ke kaki teman, anak sigap langsung mengucapkan 'Maaf'.",
      "Bergeser ke area kering menghadap kiblat dan membaca doa wudhu dengan khusyuk."
    ], afirmasi: "Alhamdulillahi Jaza Kumullohu Khoiro, wudhumu tenang dan tidak menciprat. Tandanya kamu Sayang Teman dan peduli sekolah.", pilar: ['Sayang Teman', 'Jaga Kebersihan']
  },

  {
    id: 6, fase: "Fase 2: Spiritual & Alam", judul: "SAKURA (Menyiram Tanaman)", tujuan: "Menghidupkan jiwa kepedulian terhadap lingkungan dan makhluk ciptaan Allah.", langkah: [
      "Selesai wudhu, anak berjalan ke area hijau / pot tanaman kelas.",
      "Meminta izin meminjam teko penyiram (watering can) dari teman: 'Amal sholeh nak, pinjam tekonya'.",
      "Mengisi air ke dalam teko secukupnya.",
      "Berjalan pelan supaya airnya tidak tumpah menuju pot tanaman yang menjadi tugasnya.",
      "Menyiramkan air tepat ke tanah atau akar tanaman, jangan tertuang tumpah ke lantai.",
      "Melihat tanamannya sebentar, dan memetik daun yang sudah kering bila ada.",
      "Menggembalikan teko seraya berucap 'Alhamdulillahi Jaza Kumullohu Khoiro' pada teman."
    ], afirmasi: "Tanamannya gembira bisa minum senantiasa. Merawat tanaman wujud hebatmu dalam Jaga Kebersihan lingkungan.", pilar: ['Jaga Kebersihan']
  },

  {
    id: 7, fase: "Fase 2: Spiritual & Alam", judul: "Persiapan & Shalat Dhuha", tujuan: "Membangun ketundukan dan kekhusyukan harian.", langkah: [
      "Anak masuk dengan kalimat 'Permisi' pelan ke area tempat shalat tanpa merusak barisan depan.",
      "Mengambil sajadah dan menggelarnya di baris paling depan yang masih kosong.",
      "Merapikan barisan dengan cara melihat bahu dan tumit agar lurus dengan teman di samping.",
      "Mengunci sikap untuk shalat, berhenti bercanda atau berbincang apa pun.",
      "Mengikuti gerakan dan bacaan Imam shalat dengan tertib (Thuma'ninah), dilarang bertindak mendahului imam.",
      "Tetap duduk berzikir bersama setelah salam. Jika minta tolong dirapikan: 'Amal sholeh bantu lipat ujung sajadahku'."
    ], afirmasi: "Saat shalat, kita berbisik hanya kepada Allah. Di masjid mari senantiasa Berbicara Pelan & Sopan.", pilar: ['Berbicara Pelan & Sopan']
  },

  // Siklus Kerja
  {
    id: 8, fase: "Fase 3: Siklus Kerja", judul: "Memilih & Mengambil Material Belajar", tujuan: "Melatih fokus dan rasa hormat terhadap material pembelajaran.", langkah: [
      "Anak berdiri melihat rak untuk menentukan alat belajar apa yang ingin dipakainya.",
      "Jika alat yang dituju terhalang teman, ucapkan sentuhan lisan: 'Permisi, boleh agak bergeser sedikit?'.",
      "Berdiri tepat di depan alat belajar yang ia tuju.",
      "Menarik alat tersebut menopang dengan genggaman yang kuat menggunakan DUA belah tangan.",
      "Membawa alat dengan mendekatkannya ke dada agar aman dan tidak mudah jatuh mendentum.",
      "Bila ingin meminta jalan dari teman lewati barisan lorong silakan ucapkan 'Permisi sayang'."
    ], afirmasi: "Jalannya santai saja ya, Nak. Ingat kata ajaib Permisi dan senantiasa Budayakan Antri.", pilar: ['Budayakan Antri']
  },

  {
    id: 9, fase: "Fase 3: Siklus Kerja", judul: "Aturan Pemakaian Karpet Belajar", tujuan: "Menetapkan batasan hak wilayah / area kerja anak.", langkah: [
      "Mengambil gulungan karpet dari keranjangnya, membawanya lurus di depan tubuh.",
      "Memilih area duduk yang tidak menghalangi jalan lalu-lalang kelas.",
      "Membuka gulungan karpet di lantai secara perlahan tanpa bunyi debu terkibas.",
      "Aturan Kelas: Teman dilarang keras untuk menginjak karpet belajar tersebut.",
      "Bila tidak sengaja terinjak ujung karpetnya, anak yang menginjak wajib menyuarakan 'Maaf, tak sengaja'.",
      "Jangan melangkahi permadani area pribadi (harus putar jalan permisi)."
    ], afirmasi: "Amal sholeh jalan agak menyamping nak, karpet jangan dilangkahi. Itu tandamu sangat Sayang Teman.", pilar: ['Sayang Teman']
  },

  {
    id: 10, fase: "Fase 3: Siklus Kerja", judul: "Cara Meminta Bantuan Guru", tujuan: "Menjauhkan kebiasaan berteriak di kelas dan melatih komunikasi menghargai orang lain.", langkah: [
      "Jika butuh bantuan belajar, anak berlatih mandiri mendekati posisi di mana Ustadzah berada tanpa teriak.",
      "Menyentuh perlahan tangan guru seraya berucap: 'Permisi Ustadzah, Amal sholeh bantu saya sebentar'.",
      "Guru merespons mengelus tangannya: 'Tunggu sebentar sayang'.",
      "Anak diam bersabar menanti hingga Ustadzah merampungkan komunikasi dengan pihak lain.",
      "Sekalinya guru sudah melimpahkan diri kepadanya, anak bebas bertanya tanpa disela.",
      "Diakhiri dengan menyuguhkan kata pamungkas: 'Alhamdulillahi Jaza Kumullohu Khoiro Ustadzah'."
    ], afirmasi: "Ustadzah tahu kamu sedang perlu bantuan sayang. Yuk praktikkkan kata 'Amal sholeh' dan Bicara Bergantian.", pilar: ['Bicara Bergantian', 'Berbicara Pelan & Sopan']
  },

  {
    id: 11, fase: "Fase 3: Siklus Kerja", judul: "Beres-beres Alat Belajar (Clean Up)", tujuan: "Membangun pemahaman agar tugas selalu diselesaikan secara tanggung jawab sampai akhir.", langkah: [
      "Tugas bergelar tuntas kala benda kembali susunan sempurna seperti sediakala di baki awalnya.",
      "Meminta kawan meminggir sejenak saat hendak balikan rak: 'Permisi, aku mau menaruh ini di rakmu'.",
      "Membawa kembali nampan mainan menggunakan jurus peluk di dada ke tempat masuknya.",
      "Bila mainannya bertaburan, teman boleh meringankan beban dengan kata: 'Amal sholeh mari kubantu ambilkan'.",
      "Berjalan karpet gulungannya berdiri tegak menyatu secara elegan di keranjang balok.",
      "Si tertolong membalas utuh: 'Alhamdulillahi Jaza Kumullohu Khoiro'."
    ], afirmasi: "Selesai secara mandiri membanggakan. Membereskan alat wujud cintamu untuk Jaga Kebersihan ruang bermainmu.", pilar: ['Jaga Kebersihan', 'Sayang Teman']
  },

  // Kebutuhan Dasar
  {
    id: 12, fase: "Fase 4: Kebutuhan Dasar", judul: "Izin ke Toilet (Sandi Jari)", tujuan: "Memberi kebebasan pemenuhan kebutuhan biologis tanpa mengganggu keheningan area kelas.", langkah: [
      "Bila ingin buang air, anak unjuk jari menyilang (Sandi Toilet) dibarengi kode senyap bibir mengucap 'Permisi'.",
      "Guru tersenyum angguk-angguk tanda mengabulkannya tidak memutus penerangan materi kawan sekelas.",
      "Anak melengos senyap bawa Kartu Kalung Restroom Pass dari pintu luar.",
      "Jika dia menghalangi siswa di pintu, berucap hangat 'Amal sholeh, aku izin keluar sebentar ya'.",
      "Semerbak berkalung melintas selasar sekolah menuntaskan siklus bilasnya.",
      "Mengembalikan gantungan pass dan masuk tak bersuara merecoki."
    ], afirmasi: "Sandi jarimu serta kata permisi sungguh memikat! Syukran kamu senantiasa Berbicara Pelan & Sopan di dalam.", pilar: ['Berbicara Pelan & Sopan']
  },

  {
    id: 13, fase: "Fase 4: Kebutuhan Dasar", judul: "Adab Saat Makan & Minum", tujuan: "Melaksanakan kesantunan sunnah harian secara konsisten.", langkah: [
      "Anak membersihkan tangannya dahulu memakai guyuran wastafel busa secukupnya.",
      "Membentangkan kain Placemat di kolong dan duduk kursi bersandar posisi punggung tegap.",
      "Sebelum mulai bekal, ia menawarkan atau meminta pertolongan toples: 'Amal sholeh tolong bukakan pengunci botolku'.",
      "Membalas pertolongan dari teman melekung manis: 'Alhamdulillahi Jaza Kumullohu Khoiro ya'.",
      "Kunyahan dikendalikan halus ritmenya untuk tiada memperbunyikan decakan ngecap kencang pipi.",
      "Berucap kata senyap 'Maaf, aku kebetulan tidak bawa bekal lebih hari ini' bila dimintai lebihan camilan dan pas tak sisa."
    ], afirmasi: "Indahnya saling meminjam dengan Amal Sholeh. Berbagi lauk pun diiringi dengan nada Berbicara Pelan & Sopan.", pilar: ['Berbicara Pelan & Sopan']
  },

  {
    id: 14, fase: "Fase 4: Kebutuhan Dasar", judul: "Kecelakaan Air Tumpah", tujuan: "Melatih kemandirian mengatasi keteledoran kecil tanpa perlu heboh atau tangisan rindu bantuan.", langkah: [
      "Tidak panik jika menjatuhkan kuah bekalnya, guru pantang ikut meluap heboh menjeriti si bocah.",
      "Segera sang anak tersebut mendongak dan berseru lugas kepada kumpulannya: 'Maaf merepotkan, aku bersihkan sekarang!'.",
      "Mengambili pel penyerap mikrofiber dari tempat sapu membersih basuhan cair dari tepian genangan ke dalam.",
      "Jika dirasa besar alirannya, ia meminta 'Amal sholeh temanku, pinjam ember saringannya'.",
      "Bila tertolong oleh kerumunan sebaya ia semestinya melempar madu kata 'Alhamdulillahi Jaza Kumullohu Khoiro semuanya'.",
      "Kejadian tertutup pasca lantai dipastikan melompong kering tak bikin licin pijakan."
    ], afirmasi: "Ucapan maafmu sejuk dan usahamu bergegas istimewa. Mandiri mengatasi spill adalah kemilaunya dari Jaga Kebersihan.", pilar: ['Jaga Kebersihan']
  },

  // Kepulangan
  {
    id: 15, fase: "Fase 5: Kepulangan", judul: "Evaluasi Circle Time Akhir", tujuan: "Refleksi dan penutupan hari pembelajaran (closure).", langkah: [
      "Anak-anak diajak berkumpul menapak lantai simetris karpet berbentuk formasi bulat O.",
      "Mengevaluasi rekam lisan pagi ini: Di manakah kalian paling banyak mempraktikkan kata 'Permisi' hari ini?",
      "Guru memfasilitasi anak jika siang ada baku rebut main, suruh yang mengalah ikhlas, yang merebut berani berkata: 'Maafku dari hati'.",
      "Tim kelas dihembusi pemikiran introspeksi dan dibubuhkan janji keesokan hari mengulang kehebatan perbuatannya.",
      "Sesi membedah doa berpisah ruang dan mengucapkan lantunan syukur pada pembawa doa.",
      "Teman merespons: 'Alhamdulillahi Jaza Kumullohu Khoiro ustadzah & teman-temanku seharian'."
    ], afirmasi: "Alhamdulillahi Jaza Kumullohu Khoiro kepada yang jujur mengakui kesalahan dengan berucap Maaf. Ayo teman, kita sayangi dia kembali dan Bicara Bergantian.", pilar: ['Bicara Bergantian', 'Sayang Teman']
  },

  {
    id: 16, fase: "Fase 5: Kepulangan", judul: "SASUKE Akhir (Piket Bersihkan Kelas)", tujuan: "Tanggung Jawab Bersama: Mengembalikan wajah kelas kembali segar demi rona mentari besoknya.", langkah: [
      "Regu pembersih membagi wilayah penugasan, berkata santun manakala hendak menyapu kaki teman: 'Permisi kakinya mau kusapu di bawah'.",
      "Tim bebas piket merapikan kolong sepatunya dengan manis menghargai kerja tukang sapu.",
      "Jika ingin menyerahkan estafet asbak/tempat sampah berlanjut diucapkan 'Amal sholeh tong sampahnya diluarkan'.",
      "Penghapus membersihkan noda whiteboard tanpa tersisa serpihan jejak huruf dari peruntukan spidol siang hari.",
      "Ustadzah menginspeksi mutlak kepulangan, jika sempurna akan mengumandangkan pujian akhir 'Kelaskan Bebas Debu'.",
      "Sekawanan mengucapkan Alhamdulillahi Jaza Kumullohu Khoiro untuk ruang bening meronanya ini."
    ], afirmasi: "Kata-kata ajaib memercantik proses Osojimu nak. Berpegang ke semboyan Jaga Kebersihan di manapun napakmu singgah.", pilar: ['Jaga Kebersihan']
  },

  {
    id: 17, fase: "Fase 5: Kepulangan", judul: "Safety Handover (Serah Terima)", tujuan: "Menjamin mutlak jiwa keselamatan anak menyeberang menuju kendaraan perpisahan pagarnya.", langkah: [
      "Bersiap berdiri baris dari kanopi aspal terluarnya menuju batas garis kuning mobil.",
      "Bila mendahului pejalan orang tua teman, katakan lurus sopan 'Permisi bundanya Fatih mau melintas'.",
      "Sadar tiada lagi senggol dorong membikin sakit di perbatasan; bila terdorong lisan berbunyi refleks 'Maaf maaf sengaja tak kulihat'.",
      "Menyambangi kendaraan saat teriak panggilan bergema lewat mikrofon.",
      "Memecah jabat tangan batiniah 'Alhamdulillahi Jaza Kumullohu Khoiro ustadz/satpam' di tepi mobil jemput bundanya."
    ], afirmasi: "Sangat menawan caramu menunggu tuntasnya. Antrean yang rapi (Budayakan Antri) melambangkan hatimu juga rapi sempurna.", pilar: ['Budayakan Antri']
  }
];


const defaultCases = [
  {
    id: 1,
    kategori: "Pembelajaran",
    title: "Mengobrol Saat Penjelasan",
    kasus: "Saat guru sedang menerangkan materi di depan kelas, dua orang siswa terus-menerus mengobrol sendiri di belakang.",
    tradisional: "Budi, Anton! Coba diam! Kalau kalian bicara terus, silakan keluar dari kelas!",
    positif: "Berhenti sejenak, tatap mata anak. 'Bapak lihat kalian sedang asyik berdiskusi. Sepertinya ada hal penting yang ingin dibagi? Waktunya Bapak yang bicara, obrolannya disimpan dulu untuk jam istirahat ya.'",
    konsekuensi: "Anak diminta menjelaskan ulang poin penting terakhir yang disampaikan guru kepada teman sekelasnya sebagai bentuk pemulihan waktu belajar yang hilang."
  },
  {
    id: 2,
    kategori: "Pembelajaran",
    title: "Menolak Mengerjakan Tugas / Jurnal",
    kasus: "Saat sesi tugas mandiri, seorang siswi menelungkupkan kepalanya di meja dan menolak menyentuh bukunya.",
    tradisional: "Kamu malas sekali! Teman-temanmu sudah setengah jalan. Kerjakan sekarang kalau tidak, tidak boleh istirahat!",
    positif: "Menghampiri privat. 'Ibu lihat kamu kurang bersemangat. Terasa materi ini terlalu berat atau ada hal lain yang mengganggu pikiranmu? Mari kita coba satu soal bersama.'",
    konsekuensi: "Tetap harus menyelesaikan sisa tugas tersebut pada saat jam istirahat (sebagai kompensasi natural dari membuang waktu produktif di kelas)."
  },
  {
    id: 3,
    kategori: "Sosial & Empati",
    title: "Bercanda Kasar",
    kasus: "Anak laki-laki bercanda saling dorong, yang satu kelewat batas sehingga temannya jatuh dan menangis.",
    tradisional: "Sudah Ibu bilang jangan main kasar! Sini kamu, minta maaf sekarang! Menangis saja kalian ini.",
    positif: "Pisahkan dulu (cooling-down). 'Tarik napas dulu. Apa yang tadi kalian harapkan dari bercanda ini? Bapak lihat mainnya merugikan teman. Apa yang bisa kamu lakukan agar temanmu merasa mendingan?'",
    konsekuensi: "Restitusi: Membantu pemulihan temannya (mengambilkan es/obat/minum) dan kehilangan hak mengikuti permainan fisik hari itu untuk menjaga keselamatan bersama."
  },
  {
    id: 4,
    kategori: "Ketertiban",
    title: "Membuang Sampah Sembarangan",
    kasus: "Anak memakan kemasan jajan lalu membuang bungkusnya diam-diam di laci meja.",
    tradisional: "Siapa yang buang ini?! Kalian ini jorok sekali, sudah masuk SD tapi buang sampah saja harus diajari!",
    positif: "Dekati anak. 'Sepertinya kamu sedang buru-buru ya tadi? Ibu menemukan ada sampah yang salah tempat di lacimu. Di mana seharusnya laci dan sampah berada?'",
    konsekuensi: "Bertanggung jawab merapikan laci mejanya sendiri dan memastikan satu baris meja di sekitarnya bersih dari sampah sebelum pulang sekolah."
  },
  {
    id: 5,
    kategori: "Ketertiban",
    title: "Terlambat Datang ke Sekolah",
    kasus: "Siswa datang terlambat 15 menit ketika kegiatan ikrar dan instruksi pagi sudah selesai.",
    tradisional: "Kenapa telat terus? Sekarang kamu berdiri di lapangan hormat bendera, atau disetrap berdiri di depan kelas!",
    positif: "Sambut hangat. 'Selamat pagi, Budi. Silakan masuk. Nanti saat istirahat kita ngobrol sebentar ya, Bapak ingin tahu apa yang membuatmu terhambat pagi ini agar besok kita bisa lebih awal.'",
    konsekuensi: "Memotong waktu istirahat si anak sebesar waktu keterlambatannya guna mengejar kegiatan belajar yang tertinggal (Kompensasi waktu)."
  },
  {
    id: 6,
    kategori: "Perilaku Kritis",
    title: "Membentak Balik / Tidak Sopan pada Guru",
    kasus: "Saat ditegur peringatan pertama, siswa menolak instruksi dan membentak balik gurunya di depan teman-teman.",
    tradisional: "Kamu berani melawan?! Kamu nggak ada sopan santunnya ya sama guru! Keluar kelas sekarang!",
    positif: "Tetap tenang. 'Bapak lihat kamu sangat kesal karena ditegur. Namun, nada bicaramu tidak sopan. Mari kita bicara setelah emosimu reda di sudut tenang ruangan.'",
    konsekuensi: "Menulis surat refleksi tentang bagaimana seharusnya berkomunikasi saat marah dan meminta maaf secara privat setelah kondisi emosionalnya stabil (Pemulihan relasi)."
  },
  {
    id: 7,
    kategori: "Sosial & Empati",
    title: "Menyembunyikan/Melempar Barang Teman",
    kasus: "Beberapa siswa iseng mengoper kotak pensil temannya seperti bola voli sambil tertawa, sementara pemiliknya panik.",
    tradisional: "Kalian jahil terus! Kembalikan cepat! Nanti Ibu laporkan kalian semua ke wali murid biar dimarahi di rumah!",
    positif: "Hentikan. 'Sepertinya kalian butuh hiburan, tapi barang teman bukan alat bola voli. Ini membuat teman kalian merasa tidak aman. Kenapa kalian memilih barang teman?'",
    konsekuensi: "Pelaku harus merapikan kembali seluruh isi kotak pensil tersebut, memastikan tidak ada yang rusak, dan menyerahkannya kembali dengan sopan."
  },
  {
    id: 8,
    kategori: "Karakter & Ibadah",
    title: "Bolos Jamaah Shalat (Dhuha/Dzuhur)",
    kasus: "Siswa bersembunyi di toilet atau kantin dengan berbagai alasan agar terhindar dari jamaah shalat.",
    tradisional: "Kamu ini bikin dosa saja! Sana wudhu, Ibu hukum kamu shalat berdiri paling depan dan disetrap 10 menit setelahnya!",
    positif: "Validasi. 'Bapak lihat kamu menghindar. Apakah ada hal yang membuatmu merasa tidak nyaman atau enggan untuk shalat saat ini? Mari kita bicara pelan.'",
    konsekuensi: "Karena telah meninggalkan hak jamaah, anak tetap harus mengganti (Qadha) shalatnya secara mandiri di waktu istirahat sebelum diizinkan bermain."
  },
  {
    id: 9,
    kategori: "Karakter & Ibadah",
    title: "Bercanda Membatalkan Shalat",
    kasus: "Siswa sengaja menginjak kaki teman sebelah atau menarik pecinya saat sedang shalat.",
    tradisional: "Yang bercanda sana keluar barisan! Minta ampun sama Allah, batal shalat kalian semua gara-gara kamu!",
    positif: "Setelah shalat. 'Ibu melihat kamu kesulitan menjaga fokus hari ini. Apa yang membuatmu sangat ingin bercanda saat shalat? Besok shalat di sebelah Ibu ya agar Ibu bisa membantumu fokus.'",
    konsekuensi: "Shadowing: Keesokan harinya anak ditugaskan shalat tepat di samping guru dan bertugas merapikan sajadah barisan shafnya."
  },
  {
    id: 10,
    kategori: "Ketertiban Akademis",
    title: "Mencontek Saat Ujian / Tugas",
    kasus: "Guru memergoki siswa secara sembunyi-sembunyi menyalin jawaban di kertas milik temannya.",
    tradisional: "Berani kamu mencontek! Nol nilaimu! Ibu sobek kertasmu sekarang juga, pembohong!",
    positif: "Privat. 'Ibu lihat kamu sedang bingung dan memilih jalan pintas. Apakah soalnya terasa mustahil dikerjakan sendiri? Tolong tutup kertasnya, kita bahas setelah ini.'",
    konsekuensi: "Kertas tugas dibatalkan (Natural), dan anak diberikan tugas pengganti di waktu istirahat dengan pengawasan langsung untuk membuktikan kemampuannya sendiri."
  },
  {
    id: 11,
    kategori: "Sosial & Empati",
    title: "Mengejek Nama Orang Tua",
    kasus: "Siswa saling memanggil dengan nama bapaknya/ibunya sambil tertawa, hingga ada teman yang sakit hati/menangis.",
    tradisional: "Sudah, diam! Kenapa bawa-bawa nama bapak? Mau Ibu laporkan guru BK biar dipanggil orang orangtua kalian?!",
    positif: "Tegas & Tenang. 'Ibu lihat kalian ingin akrab, tapi mengejek nama orang tua merusak kehormatan keluarga. Tahukah kalian betapa sedihnya temanmu saat ini?'",
    konsekuensi: "Membuat kartu ucapan apresiasi untuk orang tua temannya tersebut sebagai bentuk pemulihan rasa hormat yang telah dirusak."
  },
  {
    id: 12,
    kategori: "Sosial & Empati",
    title: "Pilih Kasih / Menolak Teman Sekelompok",
    kasus: "Saat pembagian grup, siswa terang-terangan berteriak 'Aku nggak mau sama dia, dia lelet/bodoh!'",
    tradisional: "Nggak boleh pilih-pilih teman! Harus mau semuanya, kalau nggak mau kelompoknya Ibu batalkan biar kalian kerjakan tugas sendirian semua!",
    positif: "Face to face. 'Bapak dengar opinimu, sepertinya kamu meragukan kerjasama tim? Kalimat tadi melukai hatinya. Bagaimana caramu menyampaikan kekhawatiran tanpa menghina?'",
    konsekuensi: "Anak tersebut harus menjadi pendamping utama dan mempresentasikan hasil kerja teman yang ia tolak tadi sebagai bentuk tanggung jawab kelompok."
  },
  {
    id: 13,
    kategori: "Regulasi Emosi",
    title: "Tantrum Keluar Ruangan (Meltdown)",
    kasus: "Siswa menangis histeris, menolak instruksi guru, atau mengurung diri di bawah meja/keluar kelas.",
    tradisional: "Ayo bangun! Jangan manja! Sudah besar kok nangis kayak anak TK, memalukan dilihat kelas sebelah! (Sambil ditarik paksa).",
    positif: "Ruang Aman. 'Bapak di sini jika kamu butuh. Sepertinya emosimu sedang meluap ya? Tenangkan diri dulu, Bapak tidak akan memaksamu bicara sekarang.'",
    konsekuensi: "Tugas yang tertinggal saat menangis tetap menjadi tanggung jawab yang harus diselesaikan di waktu luang/istirahat setelah emosinya stabil."
  },
  {
    id: 14,
    kategori: "Ketertiban",
    title: "Menyerobot Antrean (Wudhu / Cuci Tangan)",
    kasus: "Siswa tidak mau bersabar dan memaksa maju melewati teman-temannya yang sudah antre lebih dulu.",
    tradisional: "Hayo! Kenapa kamu nyerobot barisan?! Mundur sana! Nggak bisa apa disuruh antre sabar sedikit?!",
    positif: "Hentikan. 'Ibu lihat kamu sangat ingin cepat-cepat selesai, apakah ada sesuatu yang kamu kejar? Namun di sekolah kita berlatih budaya antre untuk keadilan bersama.'",
    konsekuensi: "Harus mengulang antrean dari urutan paling belakang (terakhir) sebagai harga dari ketidaksabaran mencuri hak orang lain."
  },
  {
    id: 15,
    kategori: "Keselamatan",
    title: "Berlari di Kelas / Tangga Sekolah",
    kasus: "Siswa berkejaran/berlari saat jam pelajaran di dalam kelas, atau turun berlari di tangga koridor.",
    tradisional: "Heh, jangan lari-lari! Kalau jatuh dan bocor kepalanya baru tahu rasa kamu nanti! Berhenti!",
    positif: "Stop. 'Sepertinya kamu sedang merasa sangat bertenaga dan ingin cepat ya? Namun, kelas dan tangga adalah area jalan kaki demi keselamatan kita semua.'",
    konsekuensi: "Walk it Again: Anak diminta kembali ke titik awal lalu berjalan kaki perlahan melewati rute tersebut dengan cara yang benar."
  },
  {
    id: 16,
    kategori: "Karakter & Ibadah",
    title: "Lambat / Menunda Berbaris Shalat",
    kasus: "Saat instruksi Shalat Dhuha/Dzuhur berkumandang, siswa malah asyik mengobrol, bermain santai, atau lambat mengambil wudhu.",
    tradisional: "Guru: 'Ayo cepat baris! yang belum baris Bapak hukum!' (Dan guru marah-marah hingga merusak suasana ibadah).",
    positif: "SOP Transisi. 'Waktu istirahat sudah usai, sepertinya obrolannya seru sekali? Mari kita persiapkan diri menghadap Allah. Simpan energinya untuk shalat yang fokus.'",
    konsekuensi: "Bertugas membereskan dan menggulung semua sajadah paling akhir di saat temannya yang lain sudah diperbolehkan istirahat/bermain."
  }
];

export default function DisiplinPositifPage() {
  const { user } = useAuth();
  const isKurikulum = canManageContent(user?.role);
  const [activeTab, setActiveTab] = useState('sop'); // 'sop' | 'disiplin'

  const [isEditing, setIsEditing] = useState(false);
  const [cases, setCases] = useState([]);
  const [sops, setSops] = useState([]);

  const [activeFilter, setActiveFilter] = useState("Semua");
  const [expandedId, setExpandedId] = useState(null);
  const [expandedSOPId, setExpandedSOPId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editSearchTerm, setEditSearchTerm] = useState("");
  const [expandedEditId, setExpandedEditId] = useState(null);

  const [isPrintMode, setIsPrintMode] = useState(false);
  const [selectedForPrint, setSelectedForPrint] = useState([]);
  const [itemsToPrint, setItemsToPrint] = useState([]);

  useEffect(() => {
    const handleAfterPrint = () => {
      setItemsToPrint([]);
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const handleSinglePrint = (item, type) => {
    setItemsToPrint([{ ...item, _type: type }]);
    setTimeout(() => window.print(), 300);
  };

  const handleBulkPrint = () => {
    const items = [];
    if (activeTab === 'sop') {
      items.push(...sops.filter(s => selectedForPrint.includes('sop_' + s.id)).map(s => ({ ...s, _type: 'sop' })));
    } else {
      items.push(...cases.filter(c => selectedForPrint.includes('kasus_' + c.id)).map(c => ({ ...c, _type: 'kasus' })));
    }
    setItemsToPrint(items);
    setTimeout(() => window.print(), 300);
  };

  const toggleSelectForPrint = (idStr) => {
    if (selectedForPrint.includes(idStr)) {
      setSelectedForPrint(selectedForPrint.filter(id => id !== idStr));
    } else {
      setSelectedForPrint([...selectedForPrint, idStr]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, 'settings', 'standarKelas');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetchedCases = docSnap.data().cases && docSnap.data().cases.length > 0 ? docSnap.data().cases : defaultCases;
          // Force upgrade to 17 SOPs if the server still has the old 5 SOP version
          const fetchedSops = (docSnap.data().sops && docSnap.data().sops.length >= 17) ? docSnap.data().sops : defaultSOPs;

          setCases(fetchedCases);
          setSops(fetchedSops);
        } else {
          // Legacy support: fetch old disiplinPositif node if modern node is empty
          const oldRef = doc(db, 'settings', 'disiplinPositif');
          const oldSnap = await getDoc(oldRef);
          if (oldSnap.exists() && oldSnap.data().cases && oldSnap.data().cases.length > 0) {
            setCases(oldSnap.data().cases);
          } else {
            setCases(defaultCases);
          }
          setSops(defaultSOPs);
        }
      } catch (error) {
        console.error("Firebase fetch error:", error);
        setCases(defaultCases);
        setSops(defaultSOPs);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsEditing(false);
    try {
      const docRef = doc(db, 'settings', 'standarKelas');
      await setDoc(docRef, { cases, sops });
      alert('Selesai! File Standar Kelas (SOP & Disiplin Positif) berhasil disimpan ke server.');
    } catch (error) {
      console.error("Firebase save error:", error);
      alert("Gagal menyimpan ke database. Periksa koneksi internet.");
      setIsEditing(true);
    }
  };

  const handleAddSOP = () => {
    const newId = sops.length > 0 ? Math.max(...sops.map(s => s.id)) + 1 : 1;
    setSops([...sops, {
      id: newId, fase: 'Fase Baru', judul: 'SOP Baru', tujuan: 'Mendeskripsikan tujuan di sini...', langkah: ['Langkah 1'], afirmasi: '...'
    }]);
    setExpandedEditId(newId);
  };

  const handleRemoveSOP = (id) => {
    if (window.confirm('Hapus rutinitas SOP ini?')) setSops(sops.filter(s => s.id !== id));
  };

  const handleSOPChange = (id, field, value) => {
    setSops(sops.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleAddKasus = () => {
    const newId = cases.length > 0 ? Math.max(...cases.map(c => c.id)) + 1 : 1;
    setCases([{
      id: newId,
      kategori: 'Pembelajaran',
      title: 'Judul Kasus Baru',
      kasus: 'Penjelasan situasi...',
      tradisional: 'Respons lama...',
      positif: 'Respons positif...',
      konsekuensi: 'Konsekuensi logis...'
    }, ...cases]);
    setExpandedEditId(newId);
    setEditSearchTerm(""); // Reset search so new case is visible
  };

  const handleRemoveKasus = (id) => {
    if (window.confirm('Hapus kasus penyelesaian ini?')) {
      setCases(cases.filter(c => c.id !== id));
    }
  };

  const handleChange = (id, field, value) => {
    setCases(cases.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const categories = ["Semua", ...new Set(cases.map(item => item.kategori))];
  const filteredCases = activeFilter === "Semua" ? cases : cases.filter(c => c.kategori === activeFilter);

  if (itemsToPrint.length > 0) {
    return (
      <div className="printable-canvas" style={{ backgroundColor: 'white', color: 'black', minHeight: '100vh', padding: '20px' }}>
        <style>
          {`
            @media print {
              body * { visibility: hidden; }
              .printable-canvas, .printable-canvas * { visibility: visible; }
              .printable-canvas { 
                position: absolute; left: 0; top: 0; width: 100%; 
                padding: 0 !important; margin: 0 !important;
              }
              @page { margin: 10mm 12mm; size: A4 portrait; }
              body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .no-print { display: none !important; }
              .print-item { 
                page-break-after: always;
                break-after: page;
                border: 1px solid #E2E8F0;
                padding: 18px 22px;
                margin-bottom: 10px;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
              }
              .print-item:last-child { page-break-after: auto; break-after: auto; }
            }
          `}
        </style>

        <div className="no-print" style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          padding: '16px 24px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#F1F5F9', padding: '8px', borderRadius: '10px' }}><Printer size={20} color="var(--primary)" /></div>
            <span style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.95rem' }}>Pratinjau Cetak: {itemsToPrint.length} Dokumen</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => window.print()}
              style={{ padding: '10px 24px', background: 'var(--primary)', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}
            >Cetak Sekarang</button>
            <button
              onClick={() => setItemsToPrint([])}
              style={{ padding: '10px 20px', background: '#F1F5F9', color: '#475569', borderRadius: '12px', border: '1px solid #E2E8F0', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem' }}
            >Kembali</button>
          </div>
        </div>

        <div style={{ maxWidth: '800px', margin: '60px auto 0 auto', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
          {itemsToPrint.map((item, idx) => (
            <div key={idx} className="print-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '3px solid #0F172A', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src="/logo-budiluhur.png" alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                  <div>
                    <h1 style={{ margin: 0, fontSize: '13pt', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>SDIT Budi Luhur Samarinda</h1>
                    <p style={{ margin: '1px 0 0 0', fontSize: '7.5pt', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{item._type === 'sop' ? 'SOP Manajemen Kelas' : 'Panduan Disiplin Positif'}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ padding: '2px 10px', background: '#F1F5F9', borderRadius: '6px', fontSize: '7pt', fontWeight: 800, color: '#475569', display: 'inline-block' }}>
                    {item._type === 'sop' ? 'DOKUMEN SOP' : 'PANDUAN DISIPLIN'}
                  </div>
                  <p style={{ margin: '2px 0 0 0', fontSize: '6.5pt', color: '#94A3B8' }}>Terbit: {new Date().toLocaleDateString('id-ID')}</p>
                </div>
              </div>

              {item._type === 'sop' ? (
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '7.5pt', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.fase}</span>
                    <h3 style={{ fontSize: '15pt', margin: '2px 0 0 0', fontWeight: 900, color: '#0F172A', lineHeight: 1.15 }}>{item.judul}</h3>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <h4 style={{ fontSize: '9pt', margin: '0 0 4px 0', color: '#1E293B', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '1px' }}></div> 1. Tujuan Pembiasaan
                    </h4>
                    <p style={{ margin: '0 0 0 12px', lineHeight: '1.35', fontSize: '9.5pt', color: '#334155' }}>{item.tujuan}</p>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <h4 style={{ fontSize: '9pt', margin: '0 0 4px 0', color: '#1E293B', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', background: '#7E22CE', borderRadius: '1px' }}></div> 2. Pilar Terkait
                    </h4>
                    <div style={{ margin: '0 0 0 12px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {Array.isArray(item.pilar) ? item.pilar.map((p, pIdx) => (
                        <span key={pIdx} style={{ padding: '2px 10px', background: '#F3E8FF', color: '#7E22CE', borderRadius: '12px', fontSize: '8pt', fontWeight: 800 }}>{p}</span>
                      )) : <span style={{ padding: '2px 10px', background: '#F3E8FF', color: '#7E22CE', borderRadius: '12px', fontSize: '8pt', fontWeight: 800 }}>{item.pilar}</span>}
                    </div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <h4 style={{ fontSize: '9pt', margin: '0 0 6px 0', color: '#1E293B', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', background: '#475569', borderRadius: '1px' }}></div> 3. Langkah Pelaksanaan
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginLeft: '12px' }}>
                      {Array.isArray(item.langkah) ? item.langkah.map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px' }}>
                          <div style={{ fontSize: '9pt', fontWeight: 900, color: '#94A3B8', width: '16px', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</div>
                          <div style={{ fontSize: '9pt', lineHeight: '1.35', color: '#1E293B', flex: 1 }}>{step}</div>
                        </div>
                      )) : <div style={{ fontSize: '9pt', lineHeight: '1.35', color: '#1E293B' }}>{item.langkah}</div>}
                    </div>
                  </div>
                  <div style={{ marginTop: 'auto', background: '#F0FDF4', padding: '10px 14px', borderRadius: '10px', border: '1px solid #DCFCE7' }}>
                    <div style={{ fontSize: '7.5pt', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', marginBottom: '3px' }}>Script Afirmasi Guru</div>
                    <div style={{ fontSize: '9.5pt', color: '#166534', fontStyle: 'italic', fontWeight: 700, lineHeight: 1.35 }}>"{item.afirmasi}"</div>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '25px' }}>
                    <span style={{ fontSize: '9pt', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{item.kategori}</span>
                    <h3 style={{ fontSize: '22pt', margin: '5px 0 0 0', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>{item.title}</h3>
                  </div>
                  <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ fontSize: '11pt', margin: '0 0 10px 0', color: '#1E293B', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', background: '#D97706', borderRadius: '2px' }}></div> Deskripsi Situasi / Kasus
                    </h4>
                    <div style={{ margin: '0 0 0 16px', padding: '15px', background: '#FFFBEB', borderRadius: '12px', border: '1px solid #FEF3C7', fontSize: '11.5pt', color: '#92400E', lineHeight: '1.6' }}>
                      {item.kasus}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ background: '#FFF1F2', padding: '18px', borderRadius: '12px', border: '1px solid #FEE2E2' }}>
                      <h4 style={{ fontSize: '9pt', margin: '0 0 10px 0', color: '#BE123C', fontWeight: 900, textTransform: 'uppercase' }}>❌ Tradisional</h4>
                      <p style={{ margin: 0, lineHeight: '1.5', fontSize: '10.5pt', color: '#881337', fontStyle: 'italic' }}>"{item.tradisional}"</p>
                    </div>
                    <div style={{ background: '#F0FDF4', padding: '18px', borderRadius: '12px', border: '1px solid #DCFCE7' }}>
                      <h4 style={{ fontSize: '9pt', margin: '0 0 10px 0', color: '#15803D', fontWeight: 900, textTransform: 'uppercase' }}>✅ Positif</h4>
                      <p style={{ margin: 0, lineHeight: '1.5', fontWeight: 700, fontSize: '10.5pt', color: '#166534' }}>"{item.positif}"</p>
                    </div>
                  </div>
                  <div style={{ marginTop: 'auto', background: '#EFF6FF', padding: '20px', borderRadius: '16px', border: '1px solid #DBEAFE' }}>
                    <div style={{ fontSize: '10pt', margin: '0 0 10px 0', color: '#1D4ED8', fontWeight: 900, textTransform: 'uppercase' }}>Konsekuensi Logis</div>
                    <p style={{ margin: '0', lineHeight: '1.6', fontSize: '11.5pt', fontWeight: 700, color: '#1E40AF' }}>{item.konsekuensi}</p>
                  </div>
                </div>
              )}
              <div style={{ marginTop: '12px', paddingTop: '6px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', fontSize: '6.5pt', color: '#94A3B8', fontWeight: 600 }}>
                <span>Dicetak melalui Portal Jurnal SDIT Budi Luhur Samarinda</span>
                <span>Halaman {idx + 1} / {itemsToPrint.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      {/* Header Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #1E40AF 100%)', padding: '12px', borderRadius: '16px', color: 'white', display: 'flex', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)' }}>
                <BookOpen size={28} />
              </div>
              <h1 style={{ margin: 0, color: '#0F172A', fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
                Standar Kelas
              </h1>
            </div>
            <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '650px', lineHeight: '1.6' }}>
              Panduan terpusat manajemen kelas. Gabungan antara instruksi proaktif <strong style={{ color: 'var(--primary)' }}>SOP Harian</strong> dan penanganan kuratif <strong style={{ color: '#059669' }}>Disiplin Positif</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {!isEditing && (
              <button
                onClick={() => { setIsPrintMode(!isPrintMode); setSelectedForPrint([]); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '14px', border: '1px solid #E2E8F0', background: isPrintMode ? '#E0E7FF' : 'white', color: isPrintMode ? '#4338CA' : '#1E293B', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
              >
                <Printer size={18} /> {isPrintMode ? 'Batal Cetak' : 'Mode Cetak'}
              </button>
            )}
            {isPrintMode && !isEditing && (
              <button
                onClick={handleBulkPrint}
                disabled={selectedForPrint.length === 0}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '14px', border: 'none', background: selectedForPrint.length > 0 ? '#4F46E5' : '#94A3B8', color: 'white', fontWeight: 'bold', cursor: selectedForPrint.length > 0 ? 'pointer' : 'not-allowed', transition: 'all 0.2s', boxShadow: selectedForPrint.length > 0 ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none' }}
              >
                Cetak Terpilih ({selectedForPrint.length})
              </button>
            )}
            {isKurikulum && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '14px', border: '1px solid #E2E8F0', background: 'white', color: '#1E293B', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#1E293B' }}
              >
                <Edit3 size={18} /> Edit Standar Kelas
              </button>
            )}
            {isKurikulum && isEditing && (
              <button
                onClick={handleSave}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '14px', border: 'none', background: '#10B981', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
              >
                <Save size={18} /> Simpan Semua
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      {!isEditing && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', backgroundColor: '#F1F5F9', padding: '6px', borderRadius: '20px', width: 'fit-content' }}>
          <button
            onClick={() => setActiveTab('sop')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '16px', border: 'none', background: activeTab === 'sop' ? 'white' : 'transparent', color: activeTab === 'sop' ? 'var(--primary)' : '#64748B', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s', boxShadow: activeTab === 'sop' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', fontSize: '0.95rem' }}
          >
            <Clock size={18} /> SOP Rutinitas
          </button>
          <button
            onClick={() => setActiveTab('disiplin')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '16px', border: 'none', background: activeTab === 'disiplin' ? 'white' : 'transparent', color: activeTab === 'disiplin' ? '#059669' : '#64748B', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s', boxShadow: activeTab === 'disiplin' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', fontSize: '0.95rem' }}
          >
            <HandHeart size={18} /> Disiplin Positif
          </button>
        </div>
      )}

      {/* View Mode */}
      {!isEditing ? (
        <>
          {activeTab === 'disiplin' && (
            <div style={{ animation: 'fadeIn 0.4s' }}>
              {/* 🌟 MANIFESTO: TRADISIONAL VS POSITIF */}
              <div style={{ marginBottom: '40px', background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ padding: '20px 24px', background: 'linear-gradient(to right, #F8FAFC, #FFFFFF)', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Lightbulb size={20} color="var(--primary)" />
                  <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Prinsip Dasar Disiplin
                  </h2>
                </div>
                <div style={{ padding: '24px', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '2px solid #F1F5F9' }}>
                        <th style={{ padding: '12px 16px', color: '#64748B', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Aspek</th>
                        <th style={{ padding: '12px 16px', color: '#E11D48', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Disiplin Tradisional</th>
                        <th style={{ padding: '12px 16px', color: '#059669', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Disiplin Positif</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { aspect: 'Fokus Utama', trad: 'Pelanggaran aturan (Apa yang dilakukan)', pos: 'Alasan di balik perilaku (Mengapa dilakukan)' },
                        { aspect: 'Tujuan', trad: 'Kepatuhan jangka pendek melalui rasa takut/malu', pos: 'Perubahan karakter jangka panjang melalui kesadaran' },
                        { aspect: 'Respons', trad: 'Hukuman (Punishment)', pos: 'Restitusi (Memperbaiki keadaan)' },
                        { aspect: 'Sifat', trad: 'Reaktif (Bertindak setelah kejadian)', pos: 'Proaktif (Membangun koneksi sebelum kejadian)' },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: i === 3 ? 'none' : '1px solid #F8FAFC' }}>
                          <td style={{ padding: '16px', fontSize: '0.9rem', fontWeight: 900, color: '#475569' }}>{row.aspect}</td>
                          <td style={{ padding: '16px', fontSize: '0.85rem', color: '#9F1239', lineHeight: '1.5' }}>{row.trad}</td>
                          <td style={{ padding: '16px', fontSize: '0.85rem', color: '#065F46', lineHeight: '1.5', fontWeight: 600 }}>{row.pos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px', scrollbarWidth: 'none' }}>
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFilter(cat)}
                    style={{
                      padding: '10px 20px', borderRadius: '24px', whiteSpace: 'nowrap', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: activeFilter === cat ? 'none' : '1px solid #E2E8F0',
                      background: activeFilter === cat ? 'var(--primary)' : 'white',
                      color: activeFilter === cat ? 'white' : '#64748B',
                      boxShadow: activeFilter === cat ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '30vh', gap: '16px', color: 'var(--text-muted)' }}>
                  <Loader size={36} color="var(--primary)" />
                  <span style={{ fontWeight: 600 }}>Memuat aturan main dari server...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {filteredCases.map(item => {
                    const isExpanded = expandedId === item.id;
                    return (
                      <div key={item.id} style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: isExpanded ? '0 10px 25px -5px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.3s' }}>

                        {/* Accordion Header */}
                        <div
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: isExpanded ? '#F8FAFC' : 'white', borderBottom: isExpanded ? '1px solid #E2E8F0' : 'none', transition: 'background 0.2s' }}
                        >
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            {isPrintMode && (
                              <div onClick={(e) => { e.stopPropagation(); toggleSelectForPrint('kasus_' + item.id); }} style={{ color: selectedForPrint.includes('kasus_' + item.id) ? '#4F46E5' : '#94A3B8' }}>
                                {selectedForPrint.includes('kasus_' + item.id) ? <CheckSquare size={24} /> : <Square size={24} />}
                              </div>
                            )}
                            <div>
                              <div style={{ display: 'inline-block', padding: '4px 10px', background: '#E2E8F0', color: '#475569', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                                {item.kategori}
                              </div>
                              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0F172A', fontWeight: 800 }}>{item.title}</h3>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {!isPrintMode && (
                              <button onClick={(e) => { e.stopPropagation(); handleSinglePrint(item, 'kasus'); }} style={{ background: '#F1F5F9', color: '#475569', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} title="Cetak Kasus Ini" onMouseOver={e => e.currentTarget.style.background = '#E2E8F0'} onMouseOut={e => e.currentTarget.style.background = '#F1F5F9'}>
                                <Printer size={18} />
                              </button>
                            )}
                            <div style={{ background: isExpanded ? 'var(--primary)' : '#F1F5F9', color: isExpanded ? 'white' : '#64748B', borderRadius: '50%', padding: '6px', display: 'flex', transition: 'all 0.3s' }}>
                              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                          </div>
                        </div>

                        {/* Accordion Body */}
                        {isExpanded && (
                          <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                            {/* Card Header (Kasus) */}
                            <div style={{ padding: '24px', borderBottom: '1px dashed #E2E8F0' }}>
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: '#FFFBEB', padding: '16px', borderRadius: '12px' }}>
                                <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <p style={{ margin: 0, fontSize: '0.95rem', color: '#92400E', lineHeight: '1.6' }}>{item.kasus}</p>
                              </div>
                            </div>
                            {/* Card Responses Comparison */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1px', background: '#F1F5F9' }}>
                              <div style={{ background: '#FFF1F2', padding: '20px' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 10px 0', color: '#BE123C', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}><XCircle size={16} /> Tradisional</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#881337', lineHeight: '1.6' }}>"{item.tradisional}"</p>
                              </div>
                              <div style={{ background: '#F0FDF4', padding: '20px' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 10px 0', color: '#15803D', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}><CheckCircle2 size={16} /> Disiplin Positif</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#166534', lineHeight: '1.6' }}>"{item.positif}"</p>
                              </div>
                            </div>
                            {/* Card Footer: Konsekuensi Logis */}
                            <div style={{ background: 'linear-gradient(to right, #F8FAFC, #EFF6FF)', padding: '20px 24px', borderTop: '1px dashed #E2E8F0' }}>
                              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase' }}>
                                <Lightbulb size={16} /> Konsekuensi Logis
                              </h4>
                              <p style={{ margin: 0, fontSize: '0.95rem', color: '#1E40AF', lineHeight: '1.6', fontWeight: 500 }}>
                                {item.konsekuensi}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sop' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', animation: 'fadeIn 0.4s' }}>

              {/* 🌟 BUDAYA SEKOLAH DASHBOARD */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px', animation: 'fadeIn 0.5s' }}>

                {/* Col 1: 5 PILAR */}
                <div style={{ background: 'linear-gradient(to right, #F8FAFC, #FFFFFF)', borderRadius: '24px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <Sparkles size={22} color="#F59E0B" />
                    <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>5 Pilar Budi Luhur</h2>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#DBEAFE', color: '#1D4ED8', padding: '8px 12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem' }}><Volume1 size={14} /> Berbicara Pelan</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FEF3C7', color: '#D97706', padding: '8px 12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem' }}><MessageCircle size={14} /> Bicara Bergantian</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FCE7F3', color: '#BE185D', padding: '8px 12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem' }}><Heart size={14} /> Sayang Teman</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F3E8FF', color: '#7E22CE', padding: '8px 12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem' }}><ListOrdered size={14} /> Budayakan Antri</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#D1FAE5', color: '#047857', padding: '8px 12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem' }}><Sparkles size={14} /> Jaga Kebersihan</div>
                  </div>
                </div>

                {/* Col 2: 4 KATA AJAIB */}
                <div style={{ background: 'linear-gradient(to right, #FFF7ED, #FFFFFF)', borderRadius: '24px', padding: '24px', border: '1px solid #FFEDD5', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <HandHeart size={22} color="#EA580C" />
                    <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#9A3412', textTransform: 'uppercase', letterSpacing: '0.5px' }}>4 Kata Ajaib Budi Luhur</h2>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFEDD5', color: '#C2410C', padding: '8px 12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem' }}>Amal Sholeh (Tolong)</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FEE2E2', color: '#B91C1C', padding: '8px 12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem' }}>Maaf</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ECFCCB', color: '#4D7C0F', padding: '8px 12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem' }}>Alhamdulillahi Jaza Kumullohu Khoiro</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#E0E7FF', color: '#4338CA', padding: '8px 12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem' }}>Permisi</div>
                  </div>
                </div>

              </div>

              {sops.map((sop, idx) => {
                const isExpanded = expandedSOPId === sop.id;
                const isLast = idx === sops.length - 1;
                return (
                  <div key={sop.id} style={{ display: 'flex', gap: '24px' }}>
                    {/* Vertical Timeline Node */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, zIndex: 2, boxShadow: '0 4px 12px rgba(37,99,235,0.3)', border: '4px solid white' }}>
                        {idx + 1}
                      </div>
                      {!isLast && <div style={{ width: '3px', flex: 1, backgroundColor: '#E2E8F0', margin: '4px 0', borderRadius: '2px' }} />}
                      {isLast && <div style={{ width: '3px', height: '24px', backgroundColor: 'transparent' }} />}
                    </div>

                    {/* SOP Master Card */}
                    <div style={{ flex: 1, paddingBottom: isLast ? '0' : '40px' }}>
                      <div style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: isExpanded ? '0 10px 25px -5px rgba(0,0,0,0.05)' : '0 2px 5px rgba(0,0,0,0.02)', transition: 'all 0.3s' }}>

                        {/* Header Accordion */}
                        <div onClick={() => setExpandedSOPId(isExpanded ? null : sop.id)} style={{ padding: '24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: isExpanded ? '#F8FAFC' : 'white', transition: 'background 0.2s' }}>
                          <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                            {isPrintMode && (
                              <div onClick={(e) => { e.stopPropagation(); toggleSelectForPrint('sop_' + sop.id); }} style={{ color: selectedForPrint.includes('sop_' + sop.id) ? '#4F46E5' : '#94A3B8', marginTop: '10px' }}>
                                {selectedForPrint.includes('sop_' + sop.id) ? <CheckSquare size={24} /> : <Square size={24} />}
                              </div>
                            )}
                            <div>
                              <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{sop.fase}</div>
                              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0F172A', fontWeight: 900, marginBottom: '12px' }}>{sop.judul}</h3>

                              {/* Tag Pilar Pembiasaan */}
                              {sop.pilar && sop.pilar.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                  {sop.pilar.map((p, pIdx) => {
                                    let bg = '#F1F5F9'; let col = '#475569'; let Icon = CheckCircle2;
                                    if (p.includes('Pelan')) { bg = '#DBEAFE'; col = '#1D4ED8'; Icon = Volume1; }
                                    else if (p.includes('Bergantian')) { bg = '#FEF3C7'; col = '#D97706'; Icon = MessageCircle; }
                                    else if (p.includes('Sayang')) { bg = '#FCE7F3'; col = '#BE185D'; Icon = Heart; }
                                    else if (p.includes('Antri')) { bg = '#F3E8FF'; col = '#7E22CE'; Icon = ListOrdered; }
                                    else if (p.includes('Kebersihan')) { bg = '#D1FAE5'; col = '#047857'; Icon = Sparkles; }
                                    return (
                                      <span key={pIdx} style={{ background: bg, color: col, display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                        <Icon size={12} /> {p}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {!isPrintMode && (
                              <button onClick={(e) => { e.stopPropagation(); handleSinglePrint(sop, 'sop'); }} style={{ background: '#F1F5F9', color: '#475569', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} title="Cetak SOP Ini" onMouseOver={e => e.currentTarget.style.background = '#E2E8F0'} onMouseOut={e => e.currentTarget.style.background = '#F1F5F9'}>
                                <Printer size={18} />
                              </button>
                            )}
                            <div style={{ background: isExpanded ? 'var(--primary)' : '#F1F5F9', color: isExpanded ? 'white' : '#64748B', borderRadius: '50%', padding: '6px', display: 'flex', transition: 'all 0.3s' }}>
                              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div style={{ padding: '0 24px 24px', animation: 'fadeIn 0.3s ease-in-out' }}>
                            <div style={{ backgroundColor: '#EFF6FF', border: '1px border #BFDBFE', padding: '16px', borderRadius: '12px', marginBottom: '20px', color: '#1E40AF', fontSize: '0.9rem', fontWeight: 600, display: 'flex', gap: '12px' }}>
                              <Lightbulb size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                              <span>{sop.tujuan}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                              {sop.langkah.map((step, i) => (
                                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                                  <div style={{ backgroundColor: 'white', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '0.8rem', fontWeight: 900, flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>{i + 1}</div>
                                  <div style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.5, marginTop: '2px', fontWeight: 500 }}>{step}</div>
                                </div>
                              ))}
                            </div>

                            <div style={{ backgroundColor: '#F0FDF4', borderLeft: '4px solid #10B981', padding: '16px', borderRadius: '0 12px 12px 0' }}>
                              <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#15803D', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <HandHeart size={14} /> Script Kalimat Afirmasi
                              </div>
                              <div style={{ fontSize: '0.95rem', color: '#166534', fontStyle: 'italic', fontWeight: 700, lineHeight: 1.5 }}>"{sop.afirmasi}"</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Edit Mode */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Editor Header & Control */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#F1F5F9', padding: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontWeight: 800, color: '#334155', fontSize: '1.2rem' }}>Daftar Kasus (Mode Edit)</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => {
                  if (window.confirm('Aksi ini akan me-reset daftar aturan kembali ke Template Standar 17 SOP & Kasus. Lanjutkan?')) {
                    setCases(defaultCases);
                    setSops(defaultSOPs);
                  }
                }} style={{ background: 'white', color: '#475569', border: '1px solid #CBD5E1', padding: '10px 16px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <Download size={16} /> Reset Template
                </button>
                <button onClick={handleAddKasus} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <Plus size={16} /> Kasus Baru
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={20} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari berdasarkan judul kasus, kategori, atau deskripsi..."
                value={editSearchTerm}
                onChange={(e) => setEditSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '12px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cases.filter(item =>
              item.title.toLowerCase().includes(editSearchTerm.toLowerCase()) ||
              item.kategori.toLowerCase().includes(editSearchTerm.toLowerCase()) ||
              item.kasus.toLowerCase().includes(editSearchTerm.toLowerCase())
            ).map((item) => {
              const isEditExpanded = expandedEditId === item.id;

              return (
                <div key={item.id} style={{ background: 'white', borderRadius: '16px', border: isEditExpanded ? '2px solid var(--primary)' : '1px solid #E2E8F0', overflow: 'hidden', transition: 'all 0.2s', boxShadow: isEditExpanded ? '0 8px 20px rgba(0,0,0,0.06)' : 'none' }}>
                  {/* Compact Header for Edit */}
                  <div
                    onClick={() => setExpandedEditId(isEditExpanded ? null : item.id)}
                    style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: isEditExpanded ? '#F8FAFC' : 'white' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>{item.kategori}</span>
                      <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '1.05rem' }}>{item.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveKasus(item.id); }}
                        style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
                        title="Hapus Kasus"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div style={{ color: '#94A3B8' }}>
                        {isEditExpanded ? <ChevronUp size={20} /> : <Edit3 size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Form for Editing */}
                  {isEditExpanded && (
                    <div style={{ padding: '24px', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s ease-in-out' }}>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>Judul & Kategori</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                          <input type="text" value={item.title} onChange={e => handleChange(item.id, 'title', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', fontWeight: 600, boxSizing: 'border-box' }} placeholder="Judul Kasus" />
                          <input type="text" value={item.kategori} onChange={e => handleChange(item.id, 'kategori', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }} placeholder="Kategori" />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>Situasi (Kasus)</span>
                        <textarea value={item.kasus} onChange={e => handleChange(item.id, 'kasus', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', resize: 'vertical', minHeight: '80px', boxSizing: 'border-box' }} placeholder="Jelaskan deskripsi situasinya..." />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>Perbandingan Respons</span>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontSize: '0.85rem', color: '#E11D48', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}><XCircle size={16} /> Tradisional (Hindari)</span>
                          <textarea value={item.tradisional} onChange={e => handleChange(item.id, 'tradisional', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #FECACA', background: '#FFF1F2', outline: 'none', resize: 'vertical', minHeight: '80px', color: '#9F1239', boxSizing: 'border-box' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontSize: '0.85rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16} /> Disiplin Positif (Lakukan)</span>
                          <textarea value={item.positif} onChange={e => handleChange(item.id, 'positif', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #A7F3D0', background: '#F0FDF4', outline: 'none', resize: 'vertical', minHeight: '80px', color: '#166534', boxSizing: 'border-box' }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', paddingTop: '16px', borderTop: '1px dashed #E2E8F0' }}>
                        <span style={{ fontWeight: 700, color: '#2563EB', fontSize: '0.9rem' }}>Konsekuensi Logis</span>
                        <textarea value={item.konsekuensi} onChange={e => handleChange(item.id, 'konsekuensi', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #BFDBFE', background: '#EFF6FF', outline: 'none', resize: 'vertical', minHeight: '80px', color: '#1E40AF', fontWeight: 500, boxSizing: 'border-box' }} placeholder="Jelaskan konsekuensi logis untuk pemulihan..." />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                        <button
                          onClick={() => setExpandedEditId(null)}
                          style={{ background: '#F8FAFC', color: '#334155', border: '1px solid #CBD5E1', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                        >Tutup Editor</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {cases.filter(item =>
              item.title.toLowerCase().includes(editSearchTerm.toLowerCase()) ||
              item.kategori.toLowerCase().includes(editSearchTerm.toLowerCase()) ||
              item.kasus.toLowerCase().includes(editSearchTerm.toLowerCase())
            ).length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                  Tidak ada kasus yang sesuai dengan pencarian "{editSearchTerm}".
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
