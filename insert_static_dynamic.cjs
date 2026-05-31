const fs = require('fs');

let content = fs.readFileSync('src/data/areaSentraCycle2.js', 'utf8');

// 1. Rename Perkalian to Perkalian Statis and remove the exchange step
let perkalianLabel = "label: 'K2: Perkalian / Golden Beads - Multiplication',";
let perkalianStaticLabel = "label: 'K2: Perkalian Statis / Golden Beads - Static Multiplication',";
content = content.replace(perkalianLabel, perkalianStaticLabel);

// Remove the exchange step from Perkalian Statis
// The step is: "8. Lakukan penukaran (Exchange) di Bank jika jumlah mencapai 10 di setiap nilai tempat. [Bermakna - Memahami]",
// Let's use string replace on that exact step, and renumber the rest.
// To be safe, we'll extract the Perkalian Statis block, modify its steps array, and put it back.

function extractObject(str, startIndex) {
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
      } else if (char === '{') {
        bracketCount++;
      } else if (char === '}') {
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

let staticMultIdx = content.indexOf(perkalianStaticLabel);
let staticMultObjStart = content.lastIndexOf('{', staticMultIdx);
let staticMultResult = extractObject(content, staticMultObjStart);

if (staticMultResult) {
  let lines = staticMultResult.str.split('\n');
  let newLines = [];
  let deletedCount = 0;
  
  for (let line of lines) {
    if (line.includes("Lakukan penukaran (Exchange) di Bank jika jumlah mencapai 10")) {
      deletedCount++;
      continue;
    }
    
    // Renumber steps if after the deleted line
    if (deletedCount > 0) {
      let match = line.match(/(["'])(\d+)\.\s/);
      if (match) {
        let currentNum = parseInt(match[2], 10);
        line = line.replace(new RegExp(`(["'])${currentNum}\\.\\s`), `$1${currentNum - deletedCount}. `);
      }
    }
    newLines.push(line);
  }
  
  let newStaticMultStr = newLines.join('\n');
  content = content.substring(0, staticMultObjStart) + newStaticMultStr + content.substring(staticMultResult.endIndex + 1);
}

// 2. Insert Perkalian Dinamis right after Perkalian Statis
let perkalianDinamisBlock = `,
          { 
            label: 'K2: Perkalian Dinamis / Golden Beads - Dynamic Multiplication', 
            presentation: { 
              toolDisplay: "Golden Beads, Small & Large Number Cards",
              toolsList: ["Golden Beads", "Number Cards"], 
              error: "Mekanis: Jika anak salah jumlah saat menukar, hasil akhirnya akan salah.",
              steps: [
                "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                "2. Undang anak: 'Hari ini kita akan mengalikan rezeki yang besar, sehingga kita harus menukarnya di Bank.' [Berkesadaran]",
                "3. Tulis soal perkalian dinamis (misal: 145 x 3) dan siapkan 3 nampan untuk pengali.",
                "II. PRESENTASI INTI (Perkalian Dinamis)",
                "4. Guru: 'Sama seperti penjumlahan, jika angka kita bertambah lebih dari 9, kita menukarnya.' [Bermakna - Memahami]",
                "5. Isi nampan A, B, dan C masing-masing dengan manik 145 dan Kartu Angka Kecil 145. [Bermakna - Memahami]",
                "6. Jajarkan ketiga nampan tersebut di karpet kerja. [Bermakna - Memahami]",
                "7. Gabungkan seluruh manik satuan ke nampan besar. Hitung bersusun (5+5+5=15). [Bermakna - Memahami]",
                "8. Lakukan penukaran (Exchange) di Bank: 10 satuan ditukar 1 puluhan. Letakkan puluhan baru di area puluhan. [Bermakna - Memahami]",
                "9. Lanjutkan untuk puluhan dan ratusan, lakukan pertukaran jika diperlukan. [Bermakna - Memahami]",
                "10. Hitung hasil akhir totalnya (435) dan cari Kartu Angka Besar hasil perkalian. [Bermakna - Memahami]",
                "11. Verifikasi Kartu Angka Besar hasil dengan manik total. [Bermakna - Memahami]",
                "12. Latih anak mencatat hasil di buku, dengan angka kecil untuk menunjukkan simpanan (carry). [Bermakna - Mengaplikasikan]",
                "III. KERJA MANDIRI (Pijakan Saat Main)",
                "13. Undang anak mengeksplorasi: 'Apakah kamu ingin mengalikan angka lainnya sendiri?' [Menyenangkan]",
                "14. Biarkan anak bereksplorasi mandiri. [Menyenangkan - Kerja Mandiri]",
                "15. Jika anak sudah tuntas, tuntun membereskan material ke rak. [Berkesadaran]",
                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                "16. Memberikan apresiasi: 'Masya Allah, kesabaran kalian bolak-balik ke Bank luar biasa.' [Berkesadaran - Merefleksikan]",
                "17. Recalling Pengalaman: Guru bertanya: 'Mengapa ketika jumlahnya lebih dari 9 kita harus menukar?' [Berkesadaran - Merefleksikan]",
                "18. Internalisasi Ayat Al-Quran (QS. Al-Baqarah: 261): Guru menyampaikan: 'Allah melipatgandakan pahala hamba-Nya yang beramal ikhlas. Matematika membantu kita memahaminya.' [Berkesadaran - Merefleksikan]",
                "19. Tindak Lanjut / Komitmen: Ajak anak merencanakan amal kebaikan hari ini. [Berkesadaran - Mengaplikasikan]",
                "20. Mengucap bersama anak kalimat hamdalah: 'Alhamdulillahi rabbil \\\\'alamin.' [Berkesadaran]",
                "21. Guru mengucapkan kalimat penutup kepada murid: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
              ]
            }
          }`;

// Find end of Perkalian Statis again (since we modified it)
staticMultIdx = content.indexOf(perkalianStaticLabel);
staticMultObjStart = content.lastIndexOf('{', staticMultIdx);
staticMultResult = extractObject(content, staticMultObjStart);
if (staticMultResult) {
  content = content.substring(0, staticMultResult.endIndex + 1) + perkalianDinamisBlock + content.substring(staticMultResult.endIndex + 1);
}

// 3. Rename Pembagian to Pembagian Statis
let pembagianLabel = "label: 'K3: Pembagian / Golden Beads - Division',";
let pembagianStaticLabel = "label: 'K3: Pembagian Statis / Golden Beads - Static Division',";
content = content.replace(pembagianLabel, pembagianStaticLabel);

// 4. Insert Pembagian Dinamis right after Pembagian Statis
let pembagianDinamisBlock = `,
          { 
            label: 'K3: Pembagian Dinamis / Golden Beads - Dynamic Division', 
            presentation: { 
              toolDisplay: "Golden Beads, Large & Small Number Cards, Skittles",
              toolsList: ["Golden Beads", "Number Cards", "Skittles"], 
              error: "Mekanis: Pembagian harus dimulai dari KOLOM TERBESAR agar sisa ratusan bisa ditukar menjadi puluhan.",
              steps: [
                "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                "2. Undang anak: 'Hari ini kita belajar membagi secara adil, bahkan ketika porsinya besar dan harus ditukar dulu.' [Berkesadaran]",
                "3. Tulis soal pembagian dinamis tanpa sisa (misal: 456 : 3). Siapkan 3 Skittles Hijau.",
                "II. PRESENTASI INTI (Pembagian Dinamis)",
                "4. Siapkan manik 456 dan Kartu Angka Besar di nampan. Letakkan 3 Skittles berjajar. [Bermakna - Memahami]",
                "5. Mulai bagikan ratusan (4 keping). Masing-masing dapat 1, dan tersisa 1 keping ratusan. [Bermakna - Memahami]",
                "6. Guru: 'Kita tidak bisa membelah 1 keping ratusan ini. Apa yang harus kita lakukan?' (Tukar ke Bank). [Bermakna - Memahami]",
                "7. Tukar 1 ratusan ke Bank menjadi 10 puluhan. Gabungkan dengan 5 puluhan awal (menjadi 15 puluhan). [Bermakna - Memahami]",
                "8. Bagikan 15 puluhan kepada 3 Skittles. Masing-masing dapat 5. [Bermakna - Memahami]",
                "9. Bagikan satuan (6 manik). Masing-masing dapat 2. Semuanya terbagi habis. [Bermakna - Memahami]",
                "10. Guru: 'Berapa yang didapatkan oleh SATU Skittles?' (Anak menjawab 152). [Bermakna - Memahami]",
                "11. Letakkan Kartu Angka Kecil 152 di bawah Skittles pertama sebagai simbol hasil akhir. [Bermakna - Memahami]",
                "12. Latih anak menulis soal dan hasil ini di buku catatannya. [Bermakna - Mengaplikasikan]",
                "III. KERJA MANDIRI (Pijakan Saat Main)",
                "13. Undang anak mengeksplorasi: 'Apakah kamu ingin membagikan rezeki besar ini sendiri?' [Menyenangkan]",
                "14. Biarkan anak bereksplorasi mandiri menukar manik di Bank selama proses membagi. [Menyenangkan - Kerja Mandiri]",
                "15. Jika sudah tuntas, tuntun membereskan material dengan rapi. [Berkesadaran]",
                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                "16. Memberikan apresiasi: 'Masya Allah, kesabaran kalian menukar uang agar pembagiannya adil sangat hebat.' [Berkesadaran - Merefleksikan]",
                "17. Recalling Pengalaman: Guru bertanya: 'Mengapa tadi sisa ratusannya harus ditukar ke Bank?' [Berkesadaran - Merefleksikan]",
                "18. Internalisasi Ayat Al-Quran (QS. An-Nahl: 90): Guru menyampaikan: 'Allah memerintahkan keadilan. Agar adil dibagikan, harta yang besar harus dipecah/ditukar agar merata untuk semua orang.' [Berkesadaran - Merefleksikan]",
                "19. Tindak Lanjut / Komitmen: Ajak anak bersikap adil saat membagikan sesuatu hari ini. [Berkesadaran - Mengaplikasikan]",
                "20. Mengucap bersama anak kalimat hamdalah: 'Alhamdulillahi rabbil \\\\'alamin.' [Berkesadaran]",
                "21. Guru mengucapkan kalimat penutup kepada murid: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
              ]
            }
          }`;

let pembagianStaticIdx = content.indexOf(pembagianStaticLabel);
let pembagianStaticObjStart = content.lastIndexOf('{', pembagianStaticIdx);
let pembagianStaticResult = extractObject(content, pembagianStaticObjStart);
if (pembagianStaticResult) {
  content = content.substring(0, pembagianStaticResult.endIndex + 1) + pembagianDinamisBlock + content.substring(pembagianStaticResult.endIndex + 1);
}

fs.writeFileSync('src/data/areaSentraCycle2.js', content, 'utf8');
console.log("Static and dynamic split applied successfully!");
