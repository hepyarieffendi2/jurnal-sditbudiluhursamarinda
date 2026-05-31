const fs = require('fs');

let content = fs.readFileSync('src/data/areaSentraCycle2.js', 'utf8');

const level3Label = "label: 'K1: Asosiasi Jumlah & Simbol / Association of Quantity & Symbols',";
const userLevel3Steps = `[
                "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                "2. Undang anak (kelompok kecil 2-3 orang) ke rak matematika dan katakan: 'Nak, hari ini kita akan menggabungkan benda yang pernah kita raba dengan kartu angka pasangannya.' [Berkesadaran]",
                "3. Siapkan dua karpet kerja yang letaknya berdekatan (Karpet A dan Karpet B).",
                "4. Guru membawa nampan berisi Kuantitas (1, 10, 100, 1000) ke Karpet A, dan kotak Kartu Angka Besar ke Karpet B.",
                "II. PRESENTASI INTI (Asosiasi)",
                "(Catatan Guru: Terapkan Economy of Words secara ketat di tahap ini. Biarkan anak melihat langsung hubungan antara benda dan angkanya secara visual).",
                "5. Guru menggelar Kartu Angka Besar secara vertikal di Karpet B dari atas ke bawah (1, 10, 100, 1000). [Bermakna - Memahami]",
                "6. Guru mengambil 1 butir manik dari nampan di Karpet A, meletakkannya di sebelah kanan kartu angka 1 di Karpet B. Guru berkata: 'Ini satu, dan ini angkanya satu.' [Bermakna - Memahami]",
                "7. Guru mengambil 1 batang puluhan, meletakkannya di sebelah kanan kartu angka 10. Guru berkata: 'Ini sepuluh, dan ini angkanya sepuluh.' [Bermakna - Memahami]",
                "8. Guru mengambil 1 keping ratusan, meletakkannya di sebelah kanan kartu angka 100. Guru berkata: 'Ini seratus, dan ini angkanya seratus.' [Bermakna - Memahami]",
                "9. Guru mengambil 1 kubus ribuan, meletakkannya di sebelah kanan kartu angka 1000. Guru berkata: 'Ini seribu, dan ini angkanya seribu.' [Bermakna - Memahami]",
                "10. Tahap Asosiasi (Recognition): Guru memisahkan kembali benda dan kartunya secara acak, lalu meminta anak berlatih memasangkannya kembali. [Bermakna - Memahami]",
                "11. 'Tolong letakkan benda sepuluh di samping kartu sepuluh.'",
                "12. 'Tolong letakkan kartu seratus di samping benda seratus.'",
                "13. Ulangi instruksi secara acak dan menyenangkan hingga anak lancar menjodohkan benda dan lambang kartunya. [Bermakna - Memahami]",
                "III. KERJA MANDIRI (Pijakan Saat Main)",
                "14. Undang anak mengeksplorasi pilihan kegiatan: 'Apakah kamu ingin memasangkan sendiri, atau bermain tebak jarak jauh (Distance Game) dengan temanmu?' [Menyenangkan]",
                "15. Biarkan anak bereksplorasi mandiri secara bergantian: [Menyenangkan - Kerja Mandiri]",
                "16. Eksplorasi Pasangan / Distance Game: Dua anak bekerja sama secara mandiri. Satu anak meminta angka tertentu, anak lain mencarinya di karpet seberang. Guru mundur dan hanya bertindak sebagai pengamat.",
                "17. Jika anak sudah tuntas, tuntun anak untuk membereskan material. 'Yuk, kita kembalikan ke rak. Kalau kelas dan sentra kita rapi, Allah pasti suka.' [Berkesadaran]",
                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                "(Dilakukan bersama kelompok kecil tersebut tepat setelah mereka selesai beres-beres).",
                "19. Memberikan apresiasi: 'Masya Allah, hari ini kalian hebat sekali sudah bisa menjodohkan semua benda dengan angkanya.' [Berkesadaran - Merefleksikan]",
                "20. Recalling Pengalaman: Guru bertanya kepada anak: 'Siapa yang mau bercerita, saat bermain tadi, mana yang lebih mudah dilakukan, mencari bendanya atau mencari kartunya?' (Biarkan anak menceritakan pengalamannya). [Berkesadaran - Merefleksikan]",
                "21. Internalisasi Ayat Al-Quran (QS. Az-Zariyat: 49): Guru menyampaikan pesan spiritual: 'Tadi kalian memasangkan benda dengan kartunya, kan? Tahukah kalian, dalam Surah Az-Zariyat ayat 49, Allah berfirman bahwa segala sesuatu diciptakan berpasang-pasangan agar kita mengingat kebesaran Allah. Sama seperti materi hari ini, benda matematika punya pasangan lambang angkanya. Siang pasangannya malam, tangan kanan pasangannya tangan kiri. Semuanya Allah ciptakan dengan rapi dan berpasangan!' [Berkesadaran - Merefleksikan]",
                "22. Tindak Lanjut / Komitmen: Ajak anak merencanakan kebaikan: 'Karena Allah suka segala sesuatu yang rapi di tempat pasangannya, kira-kira barang apa di kelas ini yang ingin kalian rapikan kembali ke tempat pasangannya hari ini?' [Berkesadaran - Mengaplikasikan]",
                "23. Mengucap bersama anak kalimat hamdalah sebagai rasa syukur: 'Alhamdulillahi rabbil \\\\'alamin.' [Berkesadaran]",
                "24. Guru mengucapkan kalimat penutup kepada murid: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
              ]`;

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

let labelIndex = content.indexOf(level3Label);
if (labelIndex !== -1) {
  let stepsIndex = content.indexOf('steps: [', labelIndex);
  let arrayStart = stepsIndex + 'steps: '.length;
  let result = extractArray(content, arrayStart);
  if (result) {
    content = content.substring(0, arrayStart) + userLevel3Steps + content.substring(result.endIndex + 1);
    fs.writeFileSync('src/data/areaSentraCycle2.js', content, 'utf8');
    console.log("Level 3 restored successfully.");
  }
}
