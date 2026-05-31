const fs = require('fs');
let content = fs.readFileSync('src/data/areaSentraCycle2.js', 'utf8');

const staticMultiplicationSteps = [
  "Prasyarat (Prerequisites)\\nAnak sudah lancar melakukan Penjumlahan Dinamis dan paham bahwa perkalian adalah penjumlahan berulang dari angka yang sama.",
  "Tujuan Langsung (Direct Aim)\\nAnak memahami secara konkret konsep dasar perkalian statis tanpa perlu menukar, yaitu menjumlahkan angka yang sama berulang kali.",
  "Tujuan Tidak Langsung (Indirect Aim)\\nPersiapan untuk menghafal tabel perkalian dan menyelesaikan soal perkalian abstrak secara bersusun.",
  "Kontrol Kesalahan (Control of Error)\\nMenghitung jumlah manik bersama-sama. Jika salah ambil, hasilnya tidak cocok dengan perhitungan akhir.",
  "PENGANGKATAN PERTAMA SISTEM DESIMAL: PERKALIAN STATIS (STATIC MULTIPLICATION)\\n(Materi Sentra Matematika / Kognitif - SD Kelas Bawah)",
  "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)\\n1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]\\n2. Undang tiga anak ke karpet kerja dan katakan: 'Nak, hari ini kita akan melakukan penjumlahan yang sangat spesial. Kalian akan mendapatkan jumlah barang yang sama persis.' [Berkesadaran]\\n3. Siapkan karpet kerja utama. Pastikan Bank Golden Bead memiliki stok yang cukup. Siapkan kotak Kartu Angka Kecil (untuk pengali/multiplier) dan kotak Kartu Angka Besar (untuk hasil/product).\\n4. Siapkan nampan kecil untuk masing-masing anak dan satu nampan besar di tengah.",
  "II. PRESENTASI INTI (Penjumlahan Berulang)\\n(Catatan Guru: Pilih angka yang tidak menghasilkan lebih dari 9 jika dikalikan, misalnya 1232 dikalikan 3).\\n5. Guru menyusun Kartu Angka Kecil 1232 di nampan Anak A, Anak B, dan Anak C. \\n6. Guru berkata: 'Kalian bertiga mendapat kartu yang sama. Tolong pergi ke Bank dan ambil manik-maniknya.' [Bermakna - Memahami]\\n7. Setelah ketiga anak kembali, minta mereka menjajarkan manik dan kartunya dari atas ke bawah.\\n8. Guru berkata: 'Bunda ingin menggabungkan barang kalian semua.' Dorong semua manik ke tengah (satuan dengan satuan, puluhan dengan puluhan).\\n9. Tindakan Fisik (Granul AMI): Guru mengajak anak mulai menghitung hasil gabungannya dari satuan (2 + 2 + 2 = 6).\\n10. Setelah semua nilai tempat dihitung (hasilnya 3696), anak diminta mengambil Kartu Angka Besar 3696.\\n11. Guru melakukan The Magic Slide pada Kartu Angka Besar, meletakkannya di bawah tiga Kartu Angka Kecil tadi.\\n12. Guru menyimpulkan: 'Tadi kita punya seribu dua ratus tiga puluh dua. Angka itu kita ambil sebanyak TIGA kali. Itulah yang disebut dikali tiga. Hasilnya tiga ribu enam ratus sembilan puluh enam.' [Bermakna - Mengaplikasikan]",
  "III. KERJA MANDIRI (Pijakan Saat Main)\\n13. Undang anak untuk mengeksplorasi: 'Apakah kalian ingin mencoba membuat soal perkalian kalian sendiri?' [Menyenangkan]\\n14. Biarkan anak bereksplorasi mandiri secara berkelompok. Mereka menentukan angka dan mengalikannya dengan jumlah teman mereka di karpet. [Menyenangkan - Kerja Mandiri]\\n15. Ekstensi Menulis: Anak menyalin persamaan ke buku kotaknya (1232 x 3 = 3696).\\n16. Jika anak sudah tuntas, tuntun anak untuk membereskan material kembali ke Bank Golden Bead dengan teliti. [Berkesadaran]",
  "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)\\n17. Memberikan apresiasi: 'Masya Allah, kerja sama yang luar biasa menggabungkan barang yang sama persis tadi.' [Berkesadaran - Merefleksikan]\\n18. Recalling Pengalaman: Guru bertanya: 'Siapa yang mau bercerita, lebih cepat mana, menjumlahkan angka yang beda-beda atau mengalikan angka yang sama?' [Berkesadaran - Merefleksikan]\\n19. Internalisasi Ayat Al-Quran (QS. Al-Baqarah: 261): Guru menyampaikan pesan spiritual: 'Tadi kalian melihat barang kalian dikali tiga kan? Tahukah kalian, Allah itu Maha Mengalikan pahala. Kalau kita bersedekah, Allah berjanji mengalikan pahala kita bukan cuma tiga kali, tapi sampai tujuh ratus kali lipat! Betapa pemurahnya Allah.' [Berkesadaran - Merefleksikan]\\n20. Tindak Lanjut / Komitmen: Ajak anak bersedekah atau berbuat baik hari ini agar pahalanya dikalikan oleh Allah. [Berkesadaran - Mengaplikasikan]\\n21. Mengucap hamdalah bersama: 'Alhamdulillahi rabbil \\'alamin.' [Berkesadaran]\\n22. Guru mengucapkan kalimat penutup kepada murid: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
];

const dynamicMultiplicationSteps = [
  "Prasyarat (Prerequisites)\\nAnak sudah lancar Perkalian Statis dan mahir menukar barang di Bank Golden Bead.",
  "Tujuan Langsung (Direct Aim)\\nAnak memahami konsep perkalian dinamis di mana hasil penjumlahan berulang mencapai 10 atau lebih, sehingga memerlukan pertukaran.",
  "Tujuan Tidak Langsung (Indirect Aim)\\nPersiapan perkalian susun dengan teknik menyimpan di atas kertas.",
  "Kontrol Kesalahan (Control of Error)\\nKegagalan menukar di Bank. Perhitungan ulang secara teliti.",
  "PENGANGKATAN PERTAMA SISTEM DESIMAL: PERKALIAN DINAMIS (DYNAMIC MULTIPLICATION)\\n(Materi Sentra Matematika / Kognitif - SD Kelas Bawah)",
  "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)\\n1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]\\n2. Undang anak ke karpet kerja dan katakan: 'Nak, hari ini kita akan mengalikan barang yang sangat banyak sehingga kita harus bolak-balik menukarnya ke Bank.' [Berkesadaran]\\n3. Siapkan karpet kerja utama, Bank Golden Bead yang penuh, Kartu Angka Kecil, dan Kartu Angka Besar.\\n4. Siapkan nampan untuk masing-masing anak.",
  "II. PRESENTASI INTI (Perkalian dengan Pertukaran)\\n5. Guru menyusun Kartu Angka Kecil 2456 di nampan 3 orang anak.\\n6. Anak pergi ke Bank mengambil manik-manik yang sesuai dengan kartunya, lalu menjajarkannya di karpet. [Bermakna - Memahami]\\n7. Guru mendorong semua manik ke tengah untuk digabungkan.\\n8. Tindakan Fisik (Granul AMI): Anak mulai menghitung dari satuan (6 x 3 = 18). Karena lebih dari 10, anak harus menukar 10 satuan dengan 1 puluhan ke Bank, menyisakan 8 satuan.\\n9. Anak melanjutkan menghitung puluhan (ditambah 1 puluhan hasil tukaran tadi), lalu menukarkannya jika mencapai 10 ke keping ratusan. [Bermakna - Mengaplikasikan]\\n10. Lakukan proses menukar ini berulang hingga ribuan.\\n11. Setelah hasil akhirnya rapi, anak mengambil Kartu Angka Besar yang sesuai dengan sisa akhir di karpet.\\n12. Guru melakukan The Magic Slide pada Kartu Angka Besar dan membacanya: 'Dua ribu empat ratus lima puluh enam dikali tiga sama dengan tujuh ribu tiga ratus enam puluh delapan.'",
  "III. KERJA MANDIRI (Pijakan Saat Main)\\n13. Undang anak untuk mengeksplorasi pembuatan soal perkalian dinamis mereka sendiri secara kelompok. [Menyenangkan]\\n14. Biarkan anak mandiri menukar ke Bank Golden Bead. Guru mundur dan bertindak sebagai pengamat. [Menyenangkan - Kerja Mandiri]\\n15. Ekstensi Menulis (Wajib): Anak memotret persamaan ke buku tulis. Guru mencontohkan cara menulis angka simpanan kecil di atas baris perkalian bersusun.\\n16. Jika sudah tuntas, minta anak merapikan Bank Golden Bead dengan tertib. [Berkesadaran]",
  "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)\\n17. Memberikan apresiasi atas kegigihan anak menukar ke Bank tanpa henti. [Berkesadaran - Merefleksikan]\\n18. Recalling Pengalaman: Minta anak berbagi pengalaman bagian mana yang paling sulit saat menukar dalam jumlah besar. [Berkesadaran - Merefleksikan]\\n19. Internalisasi Hadits: 'Saat kalian menukar satuan menjadi puluhan, kalian meringankan beban kelompok satuan yang terlalu banyak, kan? Rasulullah bersabda bahwa siapa yang meringankan beban orang lain, Allah akan ringankan bebannya. Jadi jangan lelah membantu teman ya!' [Berkesadaran - Merefleksikan]\\n20. Tindak Lanjut: Minta anak mencari satu teman yang bisa mereka bantu hari ini. [Berkesadaran - Mengaplikasikan]\\n21. Tutup dengan hamdalah bersama-sama. [Berkesadaran]\\n22. Guru mengucapkan kalimat penutup: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
];

const staticDivisionSteps = [
  "Prasyarat (Prerequisites)\\nAnak sudah mengenal konsep penjumlahan, pengurangan, dan perkalian statis.",
  "Tujuan Langsung (Direct Aim)\\nAnak memahami bahwa pembagian adalah proses membagi suatu jumlah yang besar secara adil kepada beberapa orang sehingga setiap orang mendapat jumlah yang persis sama.",
  "Tujuan Tidak Langsung (Indirect Aim)\\nPersiapan untuk pembagian panjang (long division) bersusun (porogapit).",
  "Kontrol Kesalahan (Control of Error)\\nAda barang yang tersisa atau tidak bisa dibagi rata (karena ini pembagian statis tanpa sisa).",
  "PENGANGKATAN PERTAMA SISTEM DESIMAL: PEMBAGIAN STATIS (STATIC DIVISION)\\n(Materi Sentra Matematika / Kognitif - SD Kelas Bawah)",
  "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)\\n1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]\\n2. Undang tiga anak ke karpet kerja dan katakan: 'Nak, hari ini Bunda punya harta yang sangat banyak, dan Bunda ingin membagikannya kepada kalian bertiga secara adil.' [Berkesadaran]\\n3. Siapkan karpet kerja, Bank Golden Bead, Kartu Angka Besar (untuk total yang akan dibagi/dividend), dan Kartu Angka Kecil (untuk hasil/quotient).\\n4. Siapkan nampan untuk masing-masing anak.",
  "II. PRESENTASI INTI (Pembagian Fisik Adil)\\n5. Guru mengambil Kartu Angka Besar (misal: 3693) dan mengambil maniknya secara utuh dari Bank lalu diletakkan di nampan guru.\\n6. Guru berkata: 'Kita punya tiga ribu enam ratus sembilan puluh tiga, dan akan kita bagi rata untuk tiga orang.' [Bermakna - Memahami]\\n7. Tindakan Fisik (Granul AMI): Aturan Emas Pembagian - 'Berbeda dengan operasi lain, dalam pembagian kita selalu mulai membagi dari yang PALING BESAR (Ribuan) terlebih dahulu!'\\n8. Guru memberikan 1 kubus ribuan ke Anak A, 1 ke Anak B, dan 1 ke Anak C.\\n9. Guru beralih membagikan keping ratusan secara bergantian sampai habis. Lalu membagikan batang puluhan, dan terakhir butir satuan. [Bermakna - Mengaplikasikan]\\n10. Guru bertanya kepada salah satu anak: 'Berapa banyak yang kamu dapatkan?'\\n11. Anak A menghitung miliknya (1231). Guru bertanya ke Anak B dan C, mereka juga menjawab 1231. 'Wah, semuanya mendapat jumlah yang adil!'\\n12. Minta setiap anak mengambil Kartu Angka Kecil 1231 dan meletakkannya di bawah barang mereka.\\n13. Guru menyimpulkan: 'Tiga ribu enam ratus sembilan puluh tiga, DIBAGI tiga, hasilnya adalah seribu dua ratus tiga puluh satu.'",
  "III. KERJA MANDIRI (Pijakan Saat Main)\\n14. Undang anak untuk mencoba menjadi dermawan yang membagikan barang secara mandiri. [Menyenangkan]\\n15. Biarkan anak bereksplorasi bergantian membagi harta secara adil. [Menyenangkan - Kerja Mandiri]\\n16. Ekstensi Menulis: Anak menuliskan persamaannya di buku (3693 : 3 = 1231).\\n17. Jika tuntas, ajak anak membereskan material ke Bank. [Berkesadaran]",
  "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)\\n18. Memberikan apresiasi: 'Masya Allah, kalian membagikan barang dengan sangat adil tanpa ada yang berebut.' [Berkesadaran - Merefleksikan]\\n19. Recalling Pengalaman: Tanyakan bagaimana rasanya mendapat bagian yang adil. [Berkesadaran - Merefleksikan]\\n20. Internalisasi Ayat Al-Quran (QS. An-Nahl: 90): 'Tadi kalian membagi dengan sangat adil kan? Tahukah kalian, dalam Surah An-Nahl ayat 90, Allah memerintahkan kita untuk selalu berlaku adil. Allah sangat mencintai pemimpin atau teman yang membagi apapun secara adil dan tidak pilih kasih.' [Berkesadaran - Merefleksikan]\\n21. Tindak Lanjut: Ajak anak berbuat adil hari ini, misalnya saat membagi makanan dengan adik. [Berkesadaran - Mengaplikasikan]\\n22. Tutup dengan hamdalah. [Berkesadaran]\\n23. Guru mengucapkan: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
];

const dynamicDivisionSteps = [
  "Prasyarat (Prerequisites)\\nAnak sudah menguasai Pembagian Statis dan sangat lancar menukar barang bernominal besar menjadi kecil di Bank.",
  "Tujuan Langsung (Direct Aim)\\nAnak memahami proses pembagian dinamis, yaitu ketika suatu nilai tempat tidak bisa dibagi rata, ia harus ditukar (dipecah) ke nilai tempat yang lebih kecil.",
  "Tujuan Tidak Langsung (Indirect Aim)\\nPemahaman mendalam tentang sisa pembagian (remainder) dan algoritma porogapit yang sesungguhnya.",
  "Kontrol Kesalahan (Control of Error)\\nSisa di akhir tidak boleh lebih besar atau sama dengan jumlah pembagi.",
  "PENGANGKATAN PERTAMA SISTEM DESIMAL: PEMBAGIAN DINAMIS (DYNAMIC DIVISION)\\n(Materi Sentra Matematika / Kognitif - SD Kelas Bawah)",
  "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)\\n1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]\\n2. Undang anak ke karpet kerja dan katakan: 'Nak, hari ini kita akan membagi harta lagi, tapi kali ini hartanya ada yang utuh dan harus kita pecahkan di Bank agar bisa dibagi rata.' [Berkesadaran]\\n3. Siapkan karpet, Bank Golden Bead, Kartu Angka Besar, dan Kartu Angka Kecil.\\n4. Siapkan nampan untuk pembagi (misal: 3 orang anak).",
  "I. PIJAKAN AWAL & PRESIAPAN (Pijakan Sebelum Main)\\n1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]\\n2. Undang anak ke karpet kerja dan katakan: 'Nak, hari ini kita akan membagi harta lagi, tapi kali ini hartanya ada yang utuh dan harus kita pecahkan di Bank agar bisa dibagi rata.' [Berkesadaran]\\n3. Siapkan karpet, Bank Golden Bead, Kartu Angka Besar, dan Kartu Angka Kecil.\\n4. Siapkan nampan untuk pembagi (misal: 3 orang anak).",
  "II. PRESENTASI INTI (Pembagian dengan Pemecahan)\\n5. Guru mengambil Kartu Angka Besar 4567 dan maniknya secara utuh di karpet utama.\\n6. Guru berkata: 'Mari kita bagi 4567 ini untuk tiga orang.' [Bermakna - Memahami]\\n7. Mulai dari Ribuan: Guru membagikan 1 kubus ribuan ke tiap anak. Tersisa 1 kubus ribuan di karpet. 'Wah, ribuan ini tidak bisa dibagi 3. Apa yang harus kita lakukan?' Anak menjawab: 'Tukar ke Bank!'\\n8. Anak menukar 1 kubus ribuan tersebut ke Bank menjadi 10 keping ratusan. Ratusan ini digabung dengan 5 ratusan yang sudah ada (menjadi 15 ratusan). [Bermakna - Mengaplikasikan]\\n9. Guru dan anak membagikan 15 keping ratusan tersebut secara adil ke 3 anak (masing-masing dapat 5).\\n10. Lanjutkan ke puluhan: bagikan 6 puluhan ke 3 anak (dapat 2).\\n11. Lanjutkan ke satuan: bagikan 7 satuan ke 3 anak (masing-masing dapat 2, TERSISA 1 satuan).\\n12. Guru menunjuk sisa 1 satuan tersebut: 'Satu ini tidak bisa dibagi rata untuk bertiga, dan tidak ada yang lebih kecil lagi dari satuan untuk ditukar. Ini kita sebut SISA (Remainder).'\\n13. Anak mengambil Kartu Angka Kecil sesuai bagiannya (1522). Sisa diletakkan di bawah dengan kartu 1.\\n14. Guru membaca: 'Empat ribu lima ratus enam puluh tujuh dibagi tiga, hasilnya seribu lima ratus dua puluh dua, dengan SISA satu.'",
  "III. KERJA MANDIRI (Pijakan Saat Main)\\n15. Undang anak bereksplorasi membuat soal pembagian dinamis yang memicu pertukaran mandiri. [Menyenangkan]\\n16. Biarkan kelompok bekerja mandiri menukar (memecah) kubus/kepingan besar di Bank agar bisa dibagi rata. [Menyenangkan - Kerja Mandiri]\\n17. Ekstensi Menulis (Wajib): Anak menuliskan persamaannya ke buku lengkap dengan sisa (4567 : 3 = 1522 R 1). Guru dapat menunjukkan teknik penulisannya.\\n18. Ajak anak membereskan material. [Berkesadaran]",
  "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)\\n19. Memberikan apresiasi: 'Masya Allah, kesabaran kalian memecah uang besar menjadi kecil di Bank agar bisa dibagi rata sangat luar biasa.' [Berkesadaran - Merefleksikan]\\n20. Recalling Pengalaman: Tanyakan bagaimana perasaan mereka saat menemukan sisa yang tidak bisa dibagi lagi. [Berkesadaran - Merefleksikan]\\n21. Internalisasi Hadits: 'Kadang dalam hidup, setelah kita membagi rata, ada sedikit sisa yang tidak pas. Sama seperti manusia, tidak ada yang sempurna. Kita harus menerima kekurangan teman kita sebagai sisa yang mewarnai kelas kita, dan saling memaafkan.' [Berkesadaran - Merefleksikan]\\n22. Tindak Lanjut: Ajak anak belajar merelakan dan tidak berdebat jika mendapat sisa makanan yang tidak rata. [Berkesadaran - Mengaplikasikan]\\n23. Tutup dengan hamdalah. [Berkesadaran]\\n24. Guru mengucapkan: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
];

function updatePresentation(labelMatcher, newSteps) {
  let idx = content.indexOf(`label: '${labelMatcher}`);
  if (idx !== -1) {
    let stepsIdx = content.indexOf('steps: [', idx);
    if (stepsIdx !== -1) {
      let arrayStart = stepsIdx + 'steps: ['.length;
      let bracketCount = 1;
      let inString = false;
      let quoteChar = null;
      let j = arrayStart;
      while (j < content.length) {
        const char = content[j];
        if (inString) {
          if (char === quoteChar && content[j - 1] !== '\\\\') {
            inString = false;
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
              let formattedSteps = JSON.stringify(newSteps, null, 2).split('\n').map((l, i) => i === 0 ? l : '              ' + l).join('\n');
              content = content.substring(0, arrayStart - 1) + formattedSteps + content.substring(j + 1);
              console.log("Updated: " + labelMatcher);
              break;
            }
          }
        }
        j++;
      }
    }
  } else {
    console.log("NOT FOUND: " + labelMatcher);
  }
}

updatePresentation('K2: Perkalian Statis / Golden Beads - Static Multiplication', staticMultiplicationSteps);
updatePresentation('K2: Perkalian Dinamis / Golden Beads - Dynamic Multiplication', dynamicMultiplicationSteps);
updatePresentation('K3: Pembagian Statis / Golden Beads - Static Division', staticDivisionSteps);
updatePresentation('K3: Pembagian Dinamis / Golden Beads - Dynamic Division', dynamicDivisionSteps);

fs.writeFileSync('src/data/areaSentraCycle2.js', content, 'utf8');
console.log("Finished updating Multi/Div!");
