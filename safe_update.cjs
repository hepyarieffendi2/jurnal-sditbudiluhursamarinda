const fs = require('fs');

let content = fs.readFileSync('src/data/areaSentraCycle2.js', 'utf8');

const updates = [
  // 1
  {
    label: "K1: Pengenalan Jumlah / Introduction to Quantity (1, 10, 100, 1000)",
    steps: `[
                "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                "2. Undang anak ke rak matematika: 'Nak, hari ini kita akan berkenalan dengan keluarga besar manik-manik.' [Berkesadaran]",
                "3. Bawa nampan berisi 1 butir satuan, 1 batang puluhan, 1 keping ratusan, dan 1 kubus ribuan ke karpet kerja.",
                "II. PRESENTASI INTI (Pengenalan Jumlah)",
                "4. Tunjukkan butir satuan: 'Ini satu.' Biarkan anak memegangnya. [Bermakna - Memahami]",
                "5. Tunjukkan batang puluhan: 'Ini sepuluh.' Biarkan anak merasakan panjangnya. [Bermakna - Memahami]",
                "6. Tunjukkan keping ratusan: 'Ini seratus.' Biarkan anak merasakan beratnya. [Bermakna - Memahami]",
                "7. Tunjukkan kubus ribuan: 'Ini seribu.' Biarkan anak merasakan berat dan besarnya. [Bermakna - Memahami]",
                "8. Lakukan Three-Period Lesson secara acak: 'Tolong ambilkan seratus.', 'Tolong letakkan sepuluh di tangan guru.' [Bermakna - Memahami]",
                "9. Tunjuk secara acak dan tanyakan: 'Ini apa?' (Anak menjawab namanya). [Bermakna - Memahami]",
                "III. KERJA MANDIRI (Pijakan Saat Main)",
                "10. Undang anak untuk mengeksplorasi: 'Apakah kamu ingin bermain tebak-tebakan manik ini sendiri?' [Menyenangkan]",
                "11. Biarkan anak bereksplorasi secara mandiri merasakan berat dan dimensi benda. [Menyenangkan - Kerja Mandiri]",
                "12. Jika anak sudah tuntas, tuntun untuk membereskan material: 'Yuk, kita kembalikan ke rak agar selalu rapi.' [Berkesadaran]",
                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                "13. Memberikan apresiasi: 'Masya Allah, hari ini kamu hebat bisa membedakan mana yang paling berat dan ringan.' [Berkesadaran - Merefleksikan]",
                "14. Recalling Pengalaman: Guru bertanya: 'Mana yang paling berat saat kamu pegang, satuan atau ribuan?' [Berkesadaran - Merefleksikan]",
                "15. Internalisasi Ayat Al-Quran (QS. Al-Qamar: 49): Guru menyampaikan: 'Allah berfirman, sungguh Kami menciptakan segala sesuatu menurut ukuran. Ada yang kecil seperti satuan, ada yang besar seperti ribuan.' [Berkesadaran - Merefleksikan]",
                "16. Tindak Lanjut / Komitmen: Ajak anak merencanakan kebaikan: 'Mari kita jaga barang-barang ini sesuai ukurannya di rak ya.' [Berkesadaran - Mengaplikasikan]",
                "17. Mengucap bersama anak kalimat hamdalah: 'Alhamdulillahi rabbil \\'alamin.' [Berkesadaran]",
                "18. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
              ]`
  },
  // 2
  {
    label: "K1: Pengenalan Simbol / Introduction to Symbols (The Cards)",
    steps: `[
                "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                "2. Undang anak ke rak matematika: 'Hari ini kita akan melihat bagaimana angka ditulis.' [Berkesadaran]",
                "3. Siapkan kotak Kartu Angka Besar (1, 10, 100, 1000) ke atas karpet.",
                "II. PRESENTASI INTI (Pengenalan Simbol)",
                "4. Tunjukkan kartu '1' (Warna Hijau): 'Ini satu.' [Bermakna - Memahami]",
                "5. Tunjukkan kartu '10' (Warna Biru): 'Ini sepuluh.' [Bermakna - Memahami]",
                "6. Tunjukkan kartu '100' (Warna Merah): 'Ini seratus.' [Bermakna - Memahami]",
                "7. Tunjukkan kartu '1000' (Warna Hijau Besar): 'Ini seribu.' [Bermakna - Memahami]",
                "8. Lakukan Three-Period Lesson: 'Tolong ambilkan seratus.', 'Mana yang angka seribu?' [Bermakna - Memahami]",
                "9. Tunjuk secara acak dan tanyakan: 'Ini apa?' (Anak menyebutkan angkanya). [Bermakna - Memahami]",
                "III. KERJA MANDIRI (Pijakan Saat Main)",
                "10. Undang anak untuk mengeksplorasi: 'Apakah kamu ingin bermain tebak kartu angka ini dengan temanmu?' [Menyenangkan]",
                "11. Biarkan anak bereksplorasi mandiri. [Menyenangkan - Kerja Mandiri]",
                "12. Jika sudah tuntas, tuntun membereskan material. 'Mari kembalikan kartu ke kotaknya.' [Berkesadaran]",
                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                "13. Memberikan apresiasi: 'Masya Allah, kamu sudah mengenal angka yang banyak nolnya.' [Berkesadaran - Merefleksikan]",
                "14. Recalling Pengalaman: Guru bertanya: 'Angka berapa yang warna kartunya merah?' (Seratus). [Berkesadaran - Merefleksikan]",
                "15. Internalisasi Ayat Al-Quran (QS. Al-Muzzammil: 20): Guru menyampaikan: 'Allah mengetahui jumlah apa yang kamu baca. Allah Maha Tahu lambang dan angka yang kita pelajari hari ini.' [Berkesadaran - Merefleksikan]",
                "16. Tindak Lanjut / Komitmen: Ajak anak merencanakan kebaikan. [Berkesadaran - Mengaplikasikan]",
                "17. Mengucap bersama anak kalimat hamdalah: 'Alhamdulillahi rabbil \\'alamin.' [Berkesadaran]",
                "18. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
              ]`
  },
  // 3
  {
    label: "K1: Asosiasi Jumlah & Simbol / Association of Quantity & Symbols",
    steps: `[
                "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                "2. Undang anak (kelompok kecil 2-3 orang) ke rak matematika dan katakan: 'Nak, hari ini kita akan menggabungkan benda yang pernah kita raba dengan kartu angka pasangannya.' [Berkesadaran]",
                "3. Siapkan dua karpet kerja yang letaknya berdekatan (Karpet A dan Karpet B).",
                "4. Guru membawa nampan berisi Kuantitas (1, 10, 100, 1000) ke Karpet A, dan kotak Kartu Angka Besar ke Karpet B.",
                "II. PRESENTASI INTI (Asosiasi)",
                "5. Guru menggelar Kartu Angka Besar secara vertikal di Karpet B dari atas ke bawah (1, 10, 100, 1000). [Bermakna - Memahami]",
                "6. Guru mengambil 1 butir manik, meletakkannya di sebelah kanan kartu angka 1 di Karpet B. Guru berkata: 'Ini satu, dan ini angkanya satu.' [Bermakna - Memahami]",
                "7. Guru mengambil 1 batang puluhan, meletakkannya di sebelah kanan kartu angka 10. Guru berkata: 'Ini sepuluh, dan ini angkanya sepuluh.' [Bermakna - Memahami]",
                "8. Guru mengambil 1 keping ratusan, meletakkannya di sebelah kanan kartu angka 100. Guru berkata: 'Ini seratus, dan ini angkanya seratus.' [Bermakna - Memahami]",
                "9. Guru mengambil 1 kubus ribuan, meletakkannya di sebelah kanan kartu angka 1000. Guru berkata: 'Ini seribu, dan ini angkanya seribu.' [Bermakna - Memahami]",
                "10. Tahap Asosiasi (Recognition): Guru memisahkan kembali benda dan kartunya secara acak, lalu meminta anak berlatih memasangkannya kembali. [Bermakna - Memahami]",
                "11. 'Tolong letakkan benda sepuluh di samping kartu sepuluh.'",
                "12. 'Tolong letakkan kartu seratus di samping benda seratus.'",
                "13. Ulangi instruksi secara acak dan menyenangkan hingga anak lancar menjodohkan benda dan lambang kartunya. [Bermakna - Memahami]",
                "III. KERJA MANDIRI (Pijakan Saat Main)",
                "14. Undang anak mengeksplorasi pilihan kegiatan: 'Apakah kamu ingin memasangkan sendiri, atau bermain tebak jarak jauh?' [Menyenangkan]",
                "15. Biarkan anak bereksplorasi mandiri secara bergantian: [Menyenangkan - Kerja Mandiri]",
                "16. Eksplorasi Pasangan / Distance Game: Dua anak bekerja sama secara mandiri. Guru mundur dan hanya bertindak sebagai pengamat.",
                "17. Jika anak sudah tuntas, tuntun anak untuk membereskan material. 'Yuk, kembalikan ke rak. Kalau kelas rapi, Allah pasti suka.' [Berkesadaran]",
                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                "18. Memberikan apresiasi: 'Masya Allah, hari ini kalian hebat sekali menjodohkan semua benda dengan angkanya.' [Berkesadaran - Merefleksikan]",
                "19. Recalling Pengalaman: Guru bertanya: 'Siapa yang mau bercerita, mana yang lebih mudah, mencari benda atau mencari kartunya?' [Berkesadaran - Merefleksikan]",
                "20. Internalisasi Ayat Al-Quran (QS. Az-Zariyat: 49): Guru menyampaikan pesan spiritual: 'Allah berfirman bahwa segala sesuatu diciptakan berpasang-pasangan. Sama seperti benda matematika yang punya pasangan lambang angkanya.' [Berkesadaran - Merefleksikan]",
                "21. Tindak Lanjut / Komitmen: Ajak anak merencanakan kebaikan: 'Barang apa di kelas yang ingin kalian rapikan kembali ke pasangannya?' [Berkesadaran - Mengaplikasikan]",
                "22. Mengucap bersama anak kalimat hamdalah: 'Alhamdulillahi rabbil \\'alamin.' [Berkesadaran]",
                "23. Guru mengucapkan kalimat penutup kepada murid: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
              ]`
  },
  // 4
  {
    label: "K1-K2: Tata Letak Desimal Raksasa / The Large Decimal Layout (Bird's Eye View)",
    steps: `[
                "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                "2. Undang anak: 'Hari ini kita akan melihat pemandangan seluruh keluarga besar angka, dari yang paling kecil sampai yang sangat besar.' [Berkesadaran]",
                "3. Siapkan satu set lengkap Kartu Angka Besar dan seluruh manik dari Bank di karpet yang luas.",
                "II. PRESENTASI INTI (Bird's Eye View)",
                "4. Susun Kartu Angka Besar secara vertikal: satuan (1-9) di kanan, puluhan (10-90) di kirinya, dst sampai ribuan (1000-9000). [Bermakna - Memahami]",
                "5. Minta anak meletakkan manik fisik yang sesuai di sebelah setiap kartu (1 butir di sebelah angka 1, 9 butir di sebelah angka 9, dst). [Bermakna - Memahami]",
                "6. Biarkan anak melihat pola pembesarannya secara visual dan merasakan ukurannya. [Bermakna - Memahami]",
                "7. Tunjukkan bahwa 10 satuan besarnya sama dengan 1 puluhan. [Bermakna - Memahami]",
                "III. KERJA MANDIRI (Pijakan Saat Main)",
                "8. Undang anak untuk mengeksplorasi: 'Apakah kamu ingin menyusun tata letak raksasa ini sendiri?' [Menyenangkan]",
                "9. Biarkan anak bereksplorasi mandiri meletakkan manik di sebelah kartu. [Menyenangkan - Kerja Mandiri]",
                "10. Jika tuntas, ajak anak membereskan semua manik dan kartu ke rak dengan urut. [Berkesadaran]",
                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                "11. Memberikan apresiasi: 'Masya Allah, tata letak yang kalian buat sangat luas dan rapi.' [Berkesadaran - Merefleksikan]",
                "12. Recalling Pengalaman: Guru bertanya: 'Apa yang kamu lihat ketika angkanya semakin besar, maniknya jadi seperti apa?' [Berkesadaran - Merefleksikan]",
                "13. Internalisasi Ayat Al-Quran (QS. Al-Furqan: 2): Guru menyampaikan: 'Allah menciptakan segala sesuatu dan menetapkan ukurannya dengan rapi. Semakin besar angkanya, semakin besar wujudnya.' [Berkesadaran - Merefleksikan]",
                "14. Tindak Lanjut / Komitmen: Ajak anak merencanakan kebaikan: 'Sikap tertib apa yang ingin kalian lakukan hari ini?' [Berkesadaran - Mengaplikasikan]",
                "15. Mengucap bersama anak kalimat hamdalah: 'Alhamdulillahi rabbil \\'alamin.' [Berkesadaran]",
                "16. Guru mengucapkan kalimat penutup kepada murid: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
              ]`
  },
  // 5
  {
    label: "K1: Pembentukan Angka / Formation of Numbers (The Magic Slide)",
    steps: `[
                "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                "2. Undang anak: 'Hari ini kita akan belajar trik sulap menggabungkan angka.' [Berkesadaran]",
                "3. Siapkan satu set Kartu Angka Besar di atas karpet kerja.",
                "II. PRESENTASI INTI (Magic Slide)",
                "4. Susun Kartu Angka Besar secara vertikal. [Bermakna - Memahami]",
                "5. Minta anak mengambil 1 kartu ribuan, 1 ratusan, 1 puluhan, dan 1 satuan (misal: 2000, 300, 40, 5). [Bermakna - Memahami]",
                "6. Jajarkan kartu vertikal rata kanan (right-aligned): 2000 paling bawah, lalu 300, 40, dan 5 paling atas. [Bermakna - Memahami]",
                "7. Lakukan Magic Slide: Geser kartu dari atas ke bawah hingga bertumpuk di sebelah kanan, menyembunyikan angka nol. [Bermakna - Memahami]",
                "8. Tunjukkan angka '2345' dan baca: 'Dua ribu tiga ratus empat puluh lima.' [Bermakna - Memahami]",
                "9. Tarik kembali kartunya untuk menunjukkan bahwa nolnya masih ada di sana, bersembunyi. [Bermakna - Memahami]",
                "III. KERJA MANDIRI (Pijakan Saat Main)",
                "10. Undang anak untuk mengeksplorasi: 'Apakah kamu ingin membuat angka rahasiamu sendiri dengan Magic Slide?' [Menyenangkan]",
                "11. Biarkan anak bereksplorasi mandiri membuat berbagai angka 4 digit. [Menyenangkan - Kerja Mandiri]",
                "12. Jika selesai, bereskan kartu kembali ke kotaknya. [Berkesadaran]",
                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                "13. Memberikan apresiasi: 'Masya Allah, sulap angkamu keren sekali.' [Berkesadaran - Merefleksikan]",
                "14. Recalling Pengalaman: Guru bertanya: 'Ke mana perginya angka nol saat kartunya digabung?' [Berkesadaran - Merefleksikan]",
                "15. Internalisasi Ayat Al-Quran (QS. Al-Mulk: 13): Guru menyampaikan: 'Allah mengetahui yang tersembunyi. Meskipun angka nolnya tertutup, nilainya tetap ada.' [Berkesadaran - Merefleksikan]",
                "16. Tindak Lanjut / Komitmen: Ajak anak merencanakan kebaikan. [Berkesadaran - Mengaplikasikan]",
                "17. Mengucap bersama anak kalimat hamdalah: 'Alhamdulillahi rabbil \\'alamin.' [Berkesadaran]",
                "18. Guru mengucapkan kalimat penutup kepada murid: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
              ]`
  },
  // 6
  {
    label: "K1-K2: Permainan Pertukaran / The Exchange Game",
    steps: `[
                "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                "2. Undang sekelompok anak: 'Hari ini kita akan bermain ke Bank dan melakukan pertukaran.' [Berkesadaran]",
                "3. Siapkan nampan untuk masing-masing anak dan rak Bank penuh dengan manik.",
                "II. PRESENTASI INTI (The Exchange Game)",
                "4. Guru meletakkan banyak manik satuan secara acak di nampan anak. [Bermakna - Memahami]",
                "5. Minta anak menghitung. Jika sampai 10, anak harus berteriak: 'Stop! Pergi ke Bank!' [Bermakna - Memahami]",
                "6. Anak membawa 10 satuan ke Bank dan menukarnya dengan 1 batang puluhan. [Bermakna - Memahami]",
                "7. Lanjutkan menghitung. Lakukan pertukaran yang sama jika ada 10 puluhan ditukar 1 ratusan, dst. [Bermakna - Memahami]",
                "8. Pada akhirnya, nampan anak akan berisi angka 4 digit yang rapi tanpa lebih dari 9 di setiap nilai tempat. [Bermakna - Memahami]",
                "9. Cari Kartu Angka Kecil untuk hasil akhirnya. [Bermakna - Memahami]",
                "III. KERJA MANDIRI (Pijakan Saat Main)",
                "10. Undang anak mengeksplorasi: 'Apakah kalian ingin saling memberi tebakan jumlah manik untuk ditukar ke Bank?' [Menyenangkan]",
                "11. Biarkan anak bereksplorasi mandiri. [Menyenangkan - Kerja Mandiri]",
                "12. Jika sudah tuntas, bereskan manik kembali ke Bank. [Berkesadaran]",
                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                "13. Memberikan apresiasi: 'Masya Allah, hebat sekali kejujuran kalian saat menukar ke Bank.' [Berkesadaran - Merefleksikan]",
                "14. Recalling Pengalaman: Guru bertanya: 'Mengapa kita harus menukar jika maniknya sampai 10?' [Berkesadaran - Merefleksikan]",
                "15. Internalisasi Ayat Al-Quran (QS. As-Saff: 4): Guru menyampaikan: 'Allah mencintai orang yang teratur seperti bangunan yang kukuh. Menukar manik membuat bilangan kita rapi dan teratur.' [Berkesadaran - Merefleksikan]",
                "16. Tindak Lanjut / Komitmen: Ajak anak merencanakan kebaikan bersikap tertib hari ini. [Berkesadaran - Mengaplikasikan]",
                "17. Mengucap bersama anak kalimat hamdalah: 'Alhamdulillahi rabbil \\'alamin.' [Berkesadaran]",
                "18. Guru mengucapkan kalimat penutup kepada murid: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
              ]`
  },
  // 7
  {
    label: "K1-K2: Penjumlahan Statis / Golden Beads - Static Addition",
    steps: `[
                "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                "2. Undang anak: 'Hari ini kita akan belajar menggabungkan harta kita menjadi lebih banyak.' [Berkesadaran]",
                "3. Tulis soal penjumlahan statis tanpa penukaran (misal: 1234 + 2143).",
                "II. PRESENTASI INTI (Penjumlahan Statis)",
                "4. Minta anak pertama mengambil manik 1234 dan Kartu Angka Kecilnya. [Bermakna - Memahami]",
                "5. Minta anak kedua mengambil manik 2143 dan Kartu Angka Kecilnya. [Bermakna - Memahami]",
                "6. Guru berkata: 'Mari kita gabungkan harta kita.' Tuang semua manik ke satu nampan besar. [Bermakna - Memahami]",
                "7. Hitung jumlah total manik yang sudah digabungkan, mulai dari satuan hingga ribuan. [Bermakna - Memahami]",
                "8. Cari Kartu Angka Besar untuk melambangkan hasil akhir. [Bermakna - Memahami]",
                "9. Jejerkan Kartu Angka Kecil addends dengan Kartu Angka Besar hasil untuk menunjukkan persamaannya. [Bermakna - Memahami]",
                "III. KERJA MANDIRI (Pijakan Saat Main)",
                "10. Undang anak mengeksplorasi: 'Apakah kalian ingin membuat soal penggabungan sendiri?' [Menyenangkan]",
                "11. Biarkan anak bereksplorasi secara mandiri. [Menyenangkan - Kerja Mandiri]",
                "12. Jika sudah tuntas, tuntun membereskan material ke rak Bank. [Berkesadaran]",
                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                "13. Memberikan apresiasi: 'Masya Allah, kerja sama kalian menggabungkan angka patut diacungi jempol.' [Berkesadaran - Merefleksikan]",
                "14. Recalling Pengalaman: Guru bertanya: 'Saat digabungkan, apakah angkanya menjadi lebih banyak?' [Berkesadaran - Merefleksikan]",
                "15. Internalisasi Ayat Al-Quran (QS. Al-Baqarah: 261): Guru menyampaikan: 'Seperti perumpamaan biji yang ditanam, jika kita menggabungkan kebaikan, Allah akan melipatgandakan pahalanya menjadi sangat banyak.' [Berkesadaran - Merefleksikan]",
                "16. Tindak Lanjut / Komitmen: Ajak anak bersedekah atau berbagi dengan teman hari ini. [Berkesadaran - Mengaplikasikan]",
                "17. Mengucap bersama anak kalimat hamdalah: 'Alhamdulillahi rabbil \\'alamin.' [Berkesadaran]",
                "18. Guru mengucapkan kalimat penutup kepada murid: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
              ]`
  },
  // 8
  {
    label: "K1-K2: Penjumlahan Dinamis / Golden Beads - Dynamic Addition",
    steps: `[
                "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                "2. Undang anak: 'Hari ini kita akan belajar menggabungkan harta yang sangat banyak hingga kita harus membawanya ke Bank.' [Berkesadaran]",
                "3. Tulis soal penjumlahan dinamis (misal: 1256 + 2147).",
                "II. PRESENTASI INTI (Penjumlahan Dinamis)",
                "4. Anak mengambil manik dan Kartu Angka Kecil sesuai angka soal di nampannya. [Bermakna - Memahami]",
                "5. Gabungkan seluruh manik ke dalam nampan besar. [Bermakna - Memahami]",
                "6. Hitung manik satuan. Saat hitungan mencapai 10, ucapkan: 'STOP! Kita harus menukar.' [Bermakna - Memahami]",
                "7. Bawa 10 manik satuan ke Bank, tukar dengan 1 puluhan (Carry Over). [Bermakna - Memahami]",
                "8. Lanjutkan menghitung puluhan, ratusan, dan ribuan dengan menukar jika mencapai angka 10. [Bermakna - Memahami]",
                "9. Cari Kartu Angka Besar hasil total setelah seluruh penukaran selesai. [Bermakna - Memahami]",
                "10. Ajarkan anak mencatat proses 'menyimpan' (carry) di buku. [Bermakna - Mengaplikasikan]",
                "III. KERJA MANDIRI (Pijakan Saat Main)",
                "11. Undang anak mengeksplorasi: 'Apakah kamu ingin berlatih soal dengan penukaran ke Bank sendiri?' [Menyenangkan]",
                "12. Biarkan anak bereksplorasi mandiri melakukan penukaran berulang kali. [Menyenangkan - Kerja Mandiri]",
                "13. Kembalikan seluruh manik ke Bank dengan tertib jika sudah selesai. [Berkesadaran]",
                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                "14. Memberikan apresiasi: 'Masya Allah, ketelitian kalian menukar uang di Bank sangat luar biasa.' [Berkesadaran - Merefleksikan]",
                "15. Recalling Pengalaman: Guru bertanya: 'Mengapa ketika lebih dari 9 kita harus menukar ke Bank?' [Berkesadaran - Merefleksikan]",
                "16. Internalisasi Ayat Al-Quran (QS. An-Nisa: 58): Guru menyampaikan: 'Allah menyuruh kita menunaikan amanah. Saat kita menukar di Bank, kita harus amanah menghitung tepat 10, tidak kurang dan tidak lebih.' [Berkesadaran - Merefleksikan]",
                "17. Tindak Lanjut / Komitmen: Ajak anak merencanakan untuk selalu jujur hari ini. [Berkesadaran - Mengaplikasikan]",
                "18. Mengucap bersama anak kalimat hamdalah: 'Alhamdulillahi rabbil \\'alamin.' [Berkesadaran]",
                "19. Guru mengucapkan kalimat penutup kepada murid: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
              ]`
  },
  // 9
  {
    label: "K2: Permainan Bank Kolaboratif / The Cooperative Bank Game (Multi-Addend Addition)",
    steps: `[
                "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                "2. Undang 3-4 anak untuk melakukan pekerjaan kelompok besar di karpet luas dekat rak matematika. [Berkesadaran]",
                "3. Bagi peran: 1 anak menjadi 'Penjaga Bank' di rak manik, 1 anak menjadi 'Kasir' di karpet, dan sisanya menjadi 'Nasabah'.",
                "4. Siapkan nampan kerja untuk masing-masing nasabah.",
                "II. PRESENTASI INTI (Permainan Bank Kolaboratif)",
                "5. Guru memberikan slip angka terpisah kepada setiap Nasabah (misal A: 1234, B: 2351, C: 1413). [Bermakna - Memahami]",
                "6. Setiap Nasabah mengambil manik emas dan Kartu Angka Kecil sesuai slip mereka di Bank. [Bermakna - Memahami]",
                "7. Penjaga Bank memeriksa kebenaran jumlah manik (proses verifikasi amanah). [Bermakna - Memahami]",
                "8. Kasir berkata: 'Mari kita gabungkan seluruh harta kita.' lalu menuangkan seluruh satuan ke nampan besar. [Bermakna - Memahami]",
                "9. Kasir menghitung satuan gabungan. Jika mencapai 10, Kasir meminta Nasabah ke Bank untuk menukarkannya. [Bermakna - Memahami]",
                "10. Kasir melanjutkan menggabungkan puluhan, ratusan, dan ribuan dengan cara yang sama (penukaran dinamis). [Bermakna - Memahami]",
                "11. Kasir meminta Penjaga Bank mengambil Kartu Angka Besar hasil total akhir dari kotak. [Bermakna - Memahami]",
                "12. Lakukan Magic Slide pada Kartu Angka Besar hasil akhir dan jejerkan di samping manik gabungan. [Bermakna - Memahami]",
                "III. KERJA MANDIRI (Pijakan Saat Main)",
                "13. Undang anak untuk mengeksplorasi peran: 'Apakah kalian ingin mengulang dengan bertukar peran?' [Menyenangkan]",
                "14. Biarkan anak bereksplorasi mandiri secara berkelompok. [Menyenangkan - Kerja Mandiri]",
                "15. Kerja Kolaboratif: Anak bertukar peran dan menulis persamaan di buku catatan. Guru sebagai pengamat.",
                "16. Jika anak sudah tuntas, tuntun anak membereskan material dengan rapi. [Berkesadaran]",
                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                "17. Memberikan apresiasi: 'Masya Allah, tim kalian luar biasa kompak menyelesaikan angka ribuan yang besar.' [Berkesadaran - Merefleksikan]",
                "18. Recalling Pengalaman: Guru bertanya: 'Siapa yang mau cerita serunya jadi Kasir atau Penjaga Bank tadi?' [Berkesadaran - Merefleksikan]",
                "19. Internalisasi Ayat Al-Quran (QS. Al-Maidah: 2): Guru menyampaikan: 'Allah berfirman agar kita tolong-menolong dalam kebaikan. Bekerja sama membuat pekerjaan yang berat jadi ringan.' [Berkesadaran - Merefleksikan]",
                "20. Tindak Lanjut / Komitmen: Ajak anak merencanakan kebaikan tolong menolong hari ini. [Berkesadaran - Mengaplikasikan]",
                "21. Mengucap bersama anak kalimat hamdalah: 'Alhamdulillahi rabbil \\'alamin.' [Berkesadaran]",
                "22. Guru mengucapkan kalimat penutup kepada murid: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
              ]`
  },
  // 10
  {
    label: "K1-K2: Pengurangan Statis / Golden Beads - Static Subtraction",
    steps: `[
                "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                "2. Undang anak ke rak matematika: 'Nak, hari ini kita akan belajar tentang berbagi atau pengurangan dari benda yang kita miliki.' [Berkesadaran]",
                "3. Tulis soal pengurangan statis (misal: 4352 - 2141) dan siapkan satu nampan untuk pengurang.",
                "II. PRESENTASI INTI (Pengurangan Statis)",
                "4. Ambil manik awal (Minuend: 4352) dan Kartu Angka Besar yang sesuai, letakkan di karpet bagian atas. [Bermakna - Memahami]",
                "5. Guru: 'Pengurangan berarti memberikan sebagian harta.' Tunjukkan Kartu Angka Kecil pengurang (2141). [Bermakna - Memahami]",
                "6. Ambil 1 satuan dari karpet, letakkan di nampan pengurang. Lalu ambil 4 puluhan, 1 ratusan, dan 2 ribuan, letakkan di nampan pengurang. [Bermakna - Memahami]",
                "7. Jauhkan nampan pengurang dari area kerja utama. [Bermakna - Memahami]",
                "8. Hitung sisa manik yang tertinggal di karpet utama. [Bermakna - Memahami]",
                "9. Cari Kartu Angka Kecil yang mewakili sisa manik tersebut (Hasil). [Bermakna - Memahami]",
                "10. Verifikasi dengan Magic Slide pada Kartu Angka Kecil hasil. [Bermakna - Memahami]",
                "11. Latih anak mengecek hasil dengan menjumlahkan balik hasil dan pengurang. [Bermakna - Mengaplikasikan]",
                "III. KERJA MANDIRI (Pijakan Saat Main)",
                "12. Undang anak untuk mengeksplorasi: 'Apakah kamu ingin mencoba soal pengurangan lainnya sendiri?' [Menyenangkan]",
                "13. Biarkan anak bereksplorasi mandiri melakukan proses pemisahan manik. [Menyenangkan - Kerja Mandiri]",
                "14. Jika sudah tuntas, tuntun membereskan material: 'Yuk, kita kembalikan ke rak agar Allah suka.' [Berkesadaran]",
                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                "15. Memberikan apresiasi: 'Masya Allah, kalian teliti sekali menghitung sisa barang hari ini.' [Berkesadaran - Merefleksikan]",
                "16. Recalling Pengalaman: Guru bertanya: 'Saat maniknya dikurangi, apakah menjadi lebih banyak atau sedikit?' [Berkesadaran - Merefleksikan]",
                "17. Internalisasi Ayat Al-Quran (QS. Ibrahim: 7): Guru menyampaikan: 'Walau di matematika dikurangi menjadi sedikit, Allah berjanji jika kita berbagi, Allah justru menambah nikmat kita.' [Berkesadaran - Merefleksikan]",
                "18. Tindak Lanjut / Komitmen: Ajak anak merencanakan berbagi makanan hari ini. [Berkesadaran - Mengaplikasikan]",
                "19. Mengucap bersama anak kalimat hamdalah: 'Alhamdulillahi rabbil \\'alamin.' [Berkesadaran]",
                "20. Guru mengucapkan kalimat penutup kepada murid: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
              ]`
  },
  // 11
  {
    label: "K1-K2: Pengurangan Dinamis / Golden Beads - Dynamic Subtraction",
    steps: `[
                "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                "2. Undang anak: 'Hari ini kita akan belajar menukar barang yang besar agar bisa dibagi ke orang lain.' [Berkesadaran]",
                "3. Tulis soal pengurangan dinamis (misal: 2541 - 1256) dan siapkan area kerja dekat Bank Manik.",
                "II. PRESENTASI INTI (Pengurangan Dinamis)",
                "4. Siapkan manik awal (Minuend: 2541) dan Kartu Angka Besar yang sesuai di karpet utama. [Bermakna - Memahami]",
                "5. Tunjukkan Kartu Angka Kecil pengurang (1256): 'Jika kita tidak punya cukup untuk memberi, kita menukar milik kita di Bank.' [Bermakna - Memahami]",
                "6. Mulai kurangi satuan (6). Di karpet hanya ada 1 satuan. Kurang! [Bermakna - Memahami]",
                "7. Ambil 1 batang puluhan di karpet, bawa ke Bank. Tukarkan dengan 10 satuan dan letakkan di karpet. [Bermakna - Memahami]",
                "8. Sekarang kita punya 11 satuan. Ambillah 6 satuan untuk pengurang. [Bermakna - Memahami]",
                "9. Lakukan hal yang sama untuk puluhan jika tidak cukup (tukar ratusan ke puluhan). [Bermakna - Memahami]",
                "10. Lanjutkan hingga ribuan selesai dikurangi, lalu hitung sisa manik di karpet sebagai hasil akhir. [Bermakna - Memahami]",
                "11. Cari Kartu Angka Kecil hasil dan verifikasi dengan sisa manik di karpet. [Bermakna - Memahami]",
                "12. Ajarkan anak teknik mencoret angka di buku kerja sebagai tanda sudah dipinjam (Exchange). [Bermakna - Mengaplikasikan]",
                "III. KERJA MANDIRI (Pijakan Saat Main)",
                "13. Undang anak mengeksplorasi: 'Apakah kamu ingin mencoba soal dengan penukaran sendiri?' [Menyenangkan]",
                "14. Biarkan anak bereksplorasi mandiri mengerjakan soal dinamis ganda. [Menyenangkan - Kerja Mandiri]",
                "15. Jika tuntas, tuntun membereskan material dengan rapi kembali ke rak. [Berkesadaran]",
                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                "16. Memberikan apresiasi: 'Masya Allah, hebat sekali kesabaran kalian bolak-balik ke Bank hari ini.' [Berkesadaran - Merefleksikan]",
                "17. Recalling Pengalaman: Guru bertanya: 'Apa yang kalian lakukan saat barangnya tidak cukup untuk dikurangi?' [Berkesadaran - Merefleksikan]",
                "18. Internalisasi Ayat Al-Quran (QS. Al-Insyirah: 5-6): Guru menyampaikan: 'Tadi saat kesulitan karena barangnya kurang, ada jalan keluarnya dengan menukar di Bank. Bersama kesulitan ada kemudahan.' [Berkesadaran - Merefleksikan]",
                "19. Tindak Lanjut / Komitmen: Ajak anak merencanakan bersikap sabar hari ini. [Berkesadaran - Mengaplikasikan]",
                "20. Mengucap bersama anak kalimat hamdalah: 'Alhamdulillahi rabbil \\'alamin.' [Berkesadaran]",
                "21. Guru mengucapkan kalimat penutup kepada murid: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
              ]`
  },
  // 12
  {
    label: "K2: Perkalian / Golden Beads - Multiplication",
    steps: `[
                "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                "2. Undang anak: 'Hari ini kita akan melihat bagaimana Allah bisa melipatgandakan rezeki yang sama berulang kali.' [Berkesadaran]",
                "3. Tulis soal perkalian (misal: 121 x 3) dan siapkan 3 nampan untuk pengali.",
                "II. PRESENTASI INTI (Perkalian Golden Beads)",
                "4. Guru: 'Perkalian adalah menjumlahkan angka yang sama berulang kali.' [Bermakna - Memahami]",
                "5. Isi nampan A, B, dan C masing-masing dengan manik 121 dan Kartu Angka Kecil 121. [Bermakna - Memahami]",
                "6. Jajarkan ketiga nampan tersebut di karpet kerja. [Bermakna - Memahami]",
                "7. Gabungkan seluruh manik dari ketiga nampan ke nampan besar (seperti Addition). [Bermakna - Memahami]",
                "8. Lakukan penukaran (Exchange) di Bank jika jumlah mencapai 10 di setiap nilai tempat. [Bermakna - Memahami]",
                "9. Hitung hasil akhir totalnya dan cari Kartu Angka Besar hasil perkalian. [Bermakna - Memahami]",
                "10. Jelaskan: '121 dikali 3 artinya 121-nya ada tiga kali.' [Bermakna - Memahami]",
                "11. Verifikasi Kartu Angka Besar hasil dengan manik total. [Bermakna - Memahami]",
                "12. Latih anak memahami tabel perkalian melalui benda nyata ini. [Bermakna - Mengaplikasikan]",
                "III. KERJA MANDIRI (Pijakan Saat Main)",
                "13. Undang anak mengeksplorasi: 'Apakah kamu ingin melipatgandakan angka lainnya sendiri?' [Menyenangkan]",
                "14. Biarkan anak bereksplorasi mandiri menggunakan nampan berulang. [Menyenangkan - Kerja Mandiri]",
                "15. Jika anak sudah tuntas, tuntun membereskan material ke rak. 'Mari jaga kebersihan.' [Berkesadaran]",
                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                "16. Memberikan apresiasi: 'Masya Allah, keren sekali kalian berhasil melipatgandakan angka hari ini.' [Berkesadaran - Merefleksikan]",
                "17. Recalling Pengalaman: Guru bertanya: 'Perkalian itu mirip dengan operasi apa yang pernah kita pelajari?' [Berkesadaran - Merefleksikan]",
                "18. Internalisasi Ayat Al-Quran (QS. Al-Baqarah: 261): Guru menyampaikan: 'Allah melipatgandakan pahala sedekah seperti satu biji yang menumbuhkan tujuh bulir. Itulah kuasa Allah melipatgandakan kebaikan.' [Berkesadaran - Merefleksikan]",
                "19. Tindak Lanjut / Komitmen: Ajak anak merencanakan melipatgandakan kebaikan hari ini. [Berkesadaran - Mengaplikasikan]",
                "20. Mengucap bersama anak kalimat hamdalah: 'Alhamdulillahi rabbil \\'alamin.' [Berkesadaran]",
                "21. Guru mengucapkan kalimat penutup kepada murid: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
              ]`
  },
  // 13
  {
    label: "K3: Pembagian / Golden Beads - Division",
    steps: `[
                "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                "2. Undang anak: 'Hari ini kita akan belajar bagaimana membagikan rezeki secara adil dan merata kepada teman-teman.' [Berkesadaran]",
                "3. Tulis soal pembagian (misal: 639 : 3). Siapkan Skittles Hijau sebagai pembagi (orang-orangan).",
                "II. PRESENTASI INTI (Pembagian Golden Beads)",
                "4. Siapkan manik 639 (Dividend) dan Kartu Angka Besar di nampan. [Bermakna - Memahami]",
                "5. Letakkan 3 Skittles Hijau berjajar: 'Ini adalah tiga orang teman yang akan berbagi nikmat.' [Bermakna - Memahami]",
                "6. Guru: 'Dalam Islam, berbagi harus adil. Mulailah dari yang paling besar (ratusan).' [Bermakna - Memahami]",
                "7. Bagikan ratusan (6 keping) kepada 3 Skittles. Masing-masing dapat 2. [Bermakna - Memahami]",
                "8. Bagikan puluhan (3 keping) kepada 3 Skittles. Masing-masing dapat 1. [Bermakna - Memahami]",
                "9. Bagikan satuan (9 keping) kepada 3 Skittles. Masing-masing dapat 3. [Bermakna - Memahami]",
                "10. Guru: 'Dilihat dari HASILNYA, SATU orang (satu Skittles) mendapatkan berapa?' (Anak menjawab 213). [Bermakna - Memahami]",
                "11. Jelaskan: 'Itulah HASIL PEMBAGIAN. Kita hanya melihat apa yang didapatkan oleh SATU Skittles Hijau.' [Bermakna - Memahami]",
                "12. Cari Kartu Angka Kecil untuk hasil (213) dan letakkan di bawah Skittles pertama. [Bermakna - Memahami]",
                "13. Ajarkan konsep amanah dalam membagi harta dan mencatat hasilnya di buku. [Bermakna - Mengaplikasikan]",
                "III. KERJA MANDIRI (Pijakan Saat Main)",
                "14. Undang anak mengeksplorasi: 'Apakah kamu ingin membagikan angka besar ini kepada teman-teman Skittles?' [Menyenangkan]",
                "15. Biarkan anak bereksplorasi mandiri melakukan operasi pembagian. [Menyenangkan - Kerja Mandiri]",
                "16. Jika anak sudah tuntas, tuntun membereskan material dengan rapi. [Berkesadaran]",
                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                "17. Memberikan apresiasi: 'Masya Allah, kalian sangat adil dalam membagikan manik-manik tadi.' [Berkesadaran - Merefleksikan]",
                "18. Recalling Pengalaman: Guru bertanya: 'Saat membagi, kita mulai dari yang terbesar (ribuan) atau terkecil (satuan)?' [Berkesadaran - Merefleksikan]",
                "19. Internalisasi Ayat Al-Quran (QS. An-Nahl: 90): Guru menyampaikan: 'Sesungguhnya Allah menyuruh kamu berlaku adil. Kalian tadi membagikan secara adil tanpa ada yang kurang.' [Berkesadaran - Merefleksikan]",
                "20. Tindak Lanjut / Komitmen: Ajak anak merencanakan bersikap adil saat bermain. [Berkesadaran - Mengaplikasikan]",
                "21. Mengucap bersama anak kalimat hamdalah: 'Alhamdulillahi rabbil \\'alamin.' [Berkesadaran]",
                "22. Guru mengucapkan kalimat penutup kepada murid: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
              ]`
  },
  // 14
  {
    label: "K3: Pembagian Dinamis dengan Sisa / Golden Beads - Dynamic Division with Remainder",
    steps: `[
                "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                "2. Undang anak: 'Hari ini kita belajar membagikan rezeki, dan melihat apa yang terjadi jika ada bagian yang tersisa.' [Berkesadaran]",
                "3. Tulis soal (misal: 625 : 3). Siapkan Skittles Hijau dan sebuah Cawan Sisa (Remainder Bowl).",
                "II. PRESENTASI INTI (Pembagian Dinamis dengan Sisa)",
                "4. Minta anak mengambil manik 625 dan Kartu Angka Besar, dan letakkan 3 Skittles Hijau berjajar. [Bermakna - Memahami]",
                "5. Mulai bagikan ratusan (6 keping) kepada 3 Skittles. Masing-masing mendapat 2. [Bermakna - Memahami]",
                "6. Lanjutkan ke puluhan (2 batang). Di nampan hanya ada 2 batang padahal Skittles ada 3. Tidak cukup! [Bermakna - Memahami]",
                "7. Lakukan penukaran (Exchange) di Bank: 2 puluhan ditukar 20 satuan. Satukan dengan 5 satuan awal (menjadi 25 satuan). [Bermakna - Memahami]",
                "8. Bagikan 25 satuan secara merata kepada 3 Skittles. Masing-masing dapat 8, tersisa 1 manik. [Bermakna - Memahami]",
                "9. Guru: 'Karena Allah memerintahkan berlaku adil, sisa satu ini tidak boleh diberikan kepada salah satu orang saja. Letakkan di Cawan Sisa.' [Bermakna - Memahami]",
                "10. Guru bertanya: 'Berapa jumlah yang didapatkan oleh SATU Skittles?' (Anak menghitung 208). [Bermakna - Memahami]",
                "11. Jelaskan: 'Hasil pembagiannya 208, dengan sisa 1.' Letakkan Kartu Angka Kecil 208 di bawah Skittles pertama. [Bermakna - Memahami]",
                "12. Tunjukkan cara menulis hasil di buku kerja: '625 : 3 = 208 (sisa 1)'. [Bermakna - Mengaplikasikan]",
                "III. KERJA MANDIRI (Pijakan Saat Main)",
                "13. Undang anak mengeksplorasi: 'Apakah kamu ingin berlatih soal pembagian bersisa sendiri?' [Menyenangkan]",
                "14. Biarkan anak bereksplorasi mandiri menukar di bank dan menaruh sisa di cawan. [Menyenangkan - Kerja Mandiri]",
                "15. Jika anak sudah tuntas, tuntun membereskan material ke kotaknya masing-masing. [Berkesadaran]",
                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                "16. Memberikan apresiasi: 'Masya Allah, hebat sekali ketelitian kalian menukar puluhan ke satuan di Bank.' [Berkesadaran - Merefleksikan]",
                "17. Recalling Pengalaman: Guru bertanya: 'Mengapa sisa manik ditaruh di mangkok, bukan ke salah satu Skittles?' (Agar adil). [Berkesadaran - Merefleksikan]",
                "18. Internalisasi Ayat Al-Quran (QS. An-Nisa: 58): Guru menyampaikan: 'Allah menyuruh menyampaikan amanat dengan adil. Sisa harta yang tidak bisa dibagi rata adalah amanah yang harus disimpan adil.' [Berkesadaran - Merefleksikan]",
                "19. Tindak Lanjut / Komitmen: Ajak anak bersikap jujur dan adil hari ini. [Berkesadaran - Mengaplikasikan]",
                "20. Mengucap bersama anak kalimat hamdalah: 'Alhamdulillahi rabbil \\'alamin.' [Berkesadaran]",
                "21. Guru mengucapkan kalimat penutup kepada murid: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
              ]`
  }
];

function extractArray(str, startIndex) {
  let bracketCount = 0;
  let inString = false;
  let quoteChar = null;
  let i = startIndex;

  while (i < str.length) {
    const char = str[i];
    if (inString) {
      if (char === quoteChar && str[i - 1] !== '\\\\') {
        inString = false;
        quoteChar = null;
      }
    } else {
      if (char === '"' || char === "'") {
        inString = true;
        quoteChar = char;
      } else if (char === '[') {
        bracketCount++;
      } else if (char === ']') {
        bracketCount--;
        if (bracketCount === 0) {
          return { endIndex: i, str: str.substring(startIndex, i + 1) };
        }
      }
    }
    i++;
  }
  return null;
}

updates.forEach(u => {
  const labelStr = u.label.replace(/'/g, "\\'");
  const labelIndex = content.indexOf("label: '" + labelStr + "'");
  if (labelIndex === -1) {
    console.log("NOT FOUND: ", u.label);
    return;
  }
  const stepsIndex = content.indexOf('steps: [', labelIndex);
  if (stepsIndex === -1) return;
  
  const arrayStart = stepsIndex + 'steps: '.length;
  const result = extractArray(content, arrayStart);
  if (result) {
    content = content.substring(0, arrayStart) + u.steps + content.substring(result.endIndex + 1);
  }
});

fs.writeFileSync('src/data/areaSentraCycle2.js', content, 'utf8');
console.log("Done carefully.");
