/**
 * kumerReference.js
 * Database Capaian Pembelajaran (CP) Komprehensif - SD Fase A & B
 * Sumber Resmi: Keputusan Kepala BSKAP No. 032/H/KR/2024
 */

export const KUMER_CP = {
  PAI_BP: {
    fase_a: [
      { id: 'pai-a-qh', elemen: 'Al-Qur’an dan Hadis', cp: 'Mengenal huruf hijaiyah dan harakatnya secara terpisah dan bersambung; menghafal surah-surah pendek.' },
      { id: 'pai-a-ak', elemen: 'Akidah', cp: 'Mengenal rukun iman dan Asmaul Husna (Ar-Rahman, Ar-Rahim, Al-Malik, Al-Quddus, As-Salam).' },
      { id: 'pai-a-ah', elemen: 'Akhlak', cp: 'Membiasakan adab harian: makan, minum, belajar, dan berterima kasih kepada manusia.' },
      { id: 'pai-a-fi', elemen: 'Fikih', cp: 'Mempraktikkan tata cara wudhu, tayamum, shalat, dan rukun Islam.' },
      { id: 'pai-a-sp', elemen: 'Sejarah Peradaban', cp: 'Mengenal kisah singkat kelahiran dan masa kecil Nabi Muhammad saw.' }
    ],
    fase_b: [
      { id: 'pai-b-qh', elemen: 'Al-Qur’an dan Hadis', cp: 'Membaca Al-Qur’an dengan tajwid (mad thabi’i); memahami hadis tentang shalat dan kebersihan.' },
      { id: 'pai-b-ak', elemen: 'Akidah', cp: 'Memahami makna 20 Asmaul Husna; iman kepada Kitab-Kitab Allah dan Rasul-Rasul Allah.' },
      { id: 'pai-b-ah', elemen: 'Akhlak', cp: 'Berbakti kepada orang tua (birrul walidain); adab bertamu dan menghargai teman.' },
      { id: 'pai-b-fi', elemen: 'Fikih', cp: 'Memahami puasa Ramadhan, shalat jumat, dan shalat hari raya.' },
      { id: 'pai-b-sp', elemen: 'Sejarah Peradaban', cp: 'Mengenal masa dewasa Nabi Muhammad saw hingga peristiwa Hijrah.' }
    ]
  },
  MATEMATIKA: {
    fase_a: [
      { id: 'mat-a-bi', elemen: 'Bilangan', cp: 'Menunjukkan intuisi bilangan sampai 100; menentukan nilai tempat (satuan, puluhan); membandingkan bilangan.' },
      { id: 'mat-a-al', elemen: 'Aljabar', cp: 'Mengenal, meniru, dan melanjutkan pola gambar dan pola bilangan sederhana.' },
      { id: 'mat-a-pe', elemen: 'Pengukuran', cp: 'Membandingkan panjang dan berat benda secara langsung; mengenal durasi waktu (jam).' },
      { id: 'mat-a-ge', elemen: 'Geometri', cp: 'Mengenal ciri-ciri bangun datar (segitiga, segiempat, lingkaran) dan bangun ruang.' },
      { id: 'mat-a-ad', elemen: 'Analisis Data', cp: 'Mengurutkan, menyortir, dan menyajikan data statistik sederhana (piktogram).' }
    ],
    fase_b: [
      { id: 'mat-b-bi', elemen: 'Bilangan', cp: 'Memahami bilangan cacah sampai 10.000; nilai tempat ribuan; perkalian dan pembagian sampai 100.' },
      { id: 'mat-b-fr', elemen: 'Bilangan (Pecahan)', cp: 'Mengenal pecahan sederhana (1/2, 1/3, 1/4) dan nilai pembilang serta penyebut.' },
      { id: 'mat-b-ge', elemen: 'Geometri', cp: 'Mengukur sudut (siku-siku, lancip, tumpul); mengenal ciri-ciri bangun datar kompleks.' },
      { id: 'mat-b-pe', elemen: 'Pengukuran', cp: 'Mengukur luas dan volume menggunakan satuan tidak baku dan satuan baku.' }
    ]
  },
  PENDIDIKAN_PANCASILA: {
    fase_a: [
      { id: 'pkn-a-pa', elemen: 'Pancasila', cp: 'Mengenal simbol dan sila Pancasila; menceritakan hubungannya dengan lingkungan.' },
      { id: 'pkn-a-uu', elemen: 'UUD 1945', cp: 'Mengenal aturan di lingkungan keluarga dan sekolah; identitas diri dan teman.' },
      { id: 'pkn-a-bh', elemen: 'Bhinneka Tunggal Ika', cp: 'Mengidentifikasi karakteristik fisik dan non-fisik orang di lingkungan sekitar.' },
      { id: 'pkn-a-nk', elemen: 'NKRI', cp: 'Mengenal wilayah lingkungan rumah dan sekolah sebagai bagian wilayah NKRI.' }
    ],
    fase_b: [
      { id: 'pkn-b-pa', elemen: 'Pancasila', cp: 'Menerapkan nilai-nilai Pancasila dalam kehidupan sehari-hari; gotong royong.' },
      { id: 'pkn-b-uu', elemen: 'UUD 1945', cp: 'Mengidentifikasi hak dan kewajiban sebagai warga sekolah dan keluarga.' }
    ]
  },
  BAHASA_INDONESIA: {
    fase_a: [
      { id: 'ind-a-ms', elemen: 'Menyimak', cp: 'Memahami instruksi lisan; menanggapi teks naratif yang dibacakan.' },
      { id: 'ind-a-mm', elemen: 'Membaca & Memirsa', cp: 'Membaca kata-kata yang sering ditemui; memahami informasi dari teks bergambar.' },
      { id: 'ind-a-bp', elemen: 'Berbicara & Presentasi', cp: 'Berbicara santun; menceritakan kembali suatu isi teks dengan bahasa sendiri.' },
      { id: 'ind-a-me', elemen: 'Menulis', cp: 'Menulis huruf, suku kata, dan kalimat sederhana dengan teknik yang benar.' }
    ],
    fase_b: [
      { id: 'ind-b-me', elemen: 'Menulis', cp: 'Menulis teks narasi, deskripsi, dan eksposisi sederhana dengan ejaan benar.' }
    ]
  },
  IPAS: {
    fase_b: [
      { id: 'ips-b-ps', elemen: 'Sains', cp: 'Menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada manusia dan hewan.' },
      { id: 'ips-b-sz', elemen: 'Sains (Zat)', cp: 'Mengenal wujud zat (padat, cair, gas) dan perubahan wujudnya.' },
      { id: 'ips-b-gj', elemen: 'Sains (Gaya)', cp: 'Memahami gaya otot, gaya magnet, gaya gravitasi, dan gaya gesek.' },
      { id: 'ips-b-se', elemen: 'Sosial', cp: 'Mengenal sejarah keluarga, lingkungan sekolah, dan kearifan lokal.' },
      { id: 'ips-b-ek', elemen: 'Ekonomi', cp: 'Mengenal kebutuhan manusia dan nilai mata uang dalam kegiatan ekonomi.' }
    ]
  },
  SENI_RUPA: {
    fase_a: [
      { id: 'snr-a-ml', elemen: 'Mengalami', cp: 'Mengenal dan mengeksplorasi unsur rupa (garis, bentuk, warna, tekstur).' },
      { id: 'snr-a-mc', elemen: 'Menciptakan', cp: 'Memilih dan menggunakan berbagai alat dan bahan (potong, tempel, gambar).' },
      { id: 'snr-a-rf', elemen: 'Merefleksikan', cp: 'Menghargai pengalaman artistik dan menceritakan karya sendiri.' }
    ],
    fase_b: [
      { id: 'snr-b-mc', elemen: 'Menciptakan', cp: 'Membuat karya dekoratif (pola) dan memadukan warna komplementer.' },
      { id: 'snr-b-rf', elemen: 'Merefleksikan', cp: 'Menganalisis kemiripan bentuk benda di sekitar dengan unsur rupa.' }
    ]
  },
  PJOK: {
    fase_a: [
      { id: 'pjok-a-gr', elemen: 'Keterampilan Gerak', cp: 'Mempraktikkan gerak dasar lokomotor (jalan, lari) dan non-lokomotor (keseimbangan).' },
      { id: 'pjok-a-kb', elemen: 'Pemanfaatan Gerak', cp: 'Mengenal kebersihan diri, mencuci tangan, dan menjaga kesehatan tubuh.' }
    ],
    fase_b: [
      { id: 'pjok-b-gr', elemen: 'Keterampilan Gerak', cp: 'Mempraktikkan variasi gerak dasar lokomotor dan manipulatif (melempar/menangkap).' },
      { id: 'pjok-b-kb', elemen: 'Pemanfaatan Gerak', cp: 'Memahami prosedur pemeliharaan kebersihan alat reproduksi dan pola hidup sehat.' }
    ]
  },
  BAHASA_INGGRIS: {
    fase_a: [
      { id: 'ing-a-ms', elemen: 'Menyimak & Berbicara', cp: 'Mengikuti instruksi sederhana; berinteraksi menggunakan ungkapan salam dan perkenalan.' },
      { id: 'ing-a-mm', elemen: 'Membaca & Memirsa', cp: 'Merespon teks bergambar; mengenal kosa kata benda di lingkungan sekolah dan rumah.' }
    ],
    fase_b: [
      { id: 'ing-b-ms', elemen: 'Menyimak & Berbicara', cp: 'Berkomunikasi menggunakan kalimat sederhana untuk menyatakan keinginan dan perasaan.' },
      { id: 'ing-b-me', elemen: 'Menulis & Mempresentasikan', cp: 'Menulis kosa kata sederhana dan menyusun kalimat pendek dengan bantuan gambar.' }
    ]
  }
};
