const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/pages/CurriculumManager.jsx');
const content = fs.readFileSync(targetFile, 'utf8');

const newLevelsData = [
  {
    label: "K2: Dot Game — Penjumlahan / The Dot Game — Addition",
    grades: ["K2"],
    tool: "Dot Game Paper, Lead Pencil, Purple/Red Colored Pencil",
    prerequisites: "Anak telah memahami konsep desimal konkret (Golden Beads) dan mahir melakukan penjumlahan dinamis dengan Stamp Game.",
    directAim: "Menjumlahkan beberapa bilangan besar secara tertulis menggunakan kertas berkisi dengan cara mengelompokkan sepuluh.",
    indirectAim: "Transisi penuh ke komutasi abstrak bersusun secara tertulis.",
    error: "Mekanis: Salah menghitung jumlah titik dalam kolom atau lupa mencoret baris kelipatan sepuluh.",
    quranVerse: "QS. Al-Baqarah: 261",
    quranMessage: "Allah menggambarkan pelipatgandaan pahala kebaikan seperti satu benih yang tumbuh menjadi banyak. Penjumlahan ini memperlihatkan bagaimana titik-titik kecil yang terkumpul rapi membentuk nilai yang besar.",
    coreSteps: [
      "Guru meletakkan Dot Game Paper, pensil biasa, dan pensil warna di atas karpet kerja.",
      "Guru mengenalkan kertas Dot Game: kolom Units (U), Tens (T), Hundreds (H), Thousands (Th), dan Ten Thousands (TTh). Tunjukkan pula kotak penyimpan carry-over di bagian atas tiap kolom dan kotak hasil di bawah.",
      "Guru menuliskan soal penjumlahan bersusun banyak di kolom kosong sebelah kanan kertas, misalnya: 3856 + 2475 + 1984, lalu menggambar garis pembatas dan simbol tambah dengan pensil biasa.",
      "Guru menunjuk angka Units dari bilangan pertama (6) dan meminta anak menggambar 6 titik hitam dengan pensil biasa di kolom Units, mengisi baris berisi 10 kotak dari kiri ke kanan.",
      "Guru melanjutkan ke Units bilangan kedua (5), menggambar 5 titik hitam di kolom Units melanjutkan baris yang tersisa atau di baris baru. Lakukan hal yang sama untuk bilangan ketiga (4).",
      "Guru meminta anak menghitung titik hitam di kolom Units mulai dari pojok kiri atas. Setiap kali hitungan mencapai sepuluh (10), bimbing anak mencoret baris tersebut secara diagonal dengan pensil warna.",
      "Untuk setiap baris sepuluh yang dicoret, guru meminta anak menggambar satu titik berwarna (ungu/merah) di kotak carry-over (pembawa) di atas kolom Tens (Puluhan).",
      "Anak menghitung sisa titik hitam yang tidak membentuk kelompok sepuluh di kolom Units (yaitu ada 5 titik), lalu menulis angka 5 di kotak hasil paling bawah kolom Units.",
      "Guru meminta anak menggambar titik-titik hitam untuk kolom Tens (Puluhan) dari ketiga bilangan soal (5, 7, 8) di kolom Tens secara berurutan ke bawah.",
      "Anak menghitung seluruh titik di kolom Tens, termasuk titik carry-over berwarna di bagian atas. Setiap mencapai sepuluh, coret barisnya, buat titik berwarna di kotak carry-over kolom Hundreds (Ratusan), dan catat sisanya di bawah.",
      "Anak mengulangi langkah ini untuk kolom Hundreds, Thousands, dan Ten Thousands hingga semua kolom selesai dihitung.",
      "Guru mengajak anak membaca hasil akhir yang tertulis bersama-sama: delapan ribu tiga ratus lima belas (8315)."
    ],
    independentSteps: [
      "Undang anak untuk mencoba secara mandiri: 'Apakah kamu ingin mencobanya sendiri atau bekerja bersama temanmu?' [Menyenangkan]",
      "Biarkan anak melakukan eksplorasi berulang kali secara mandiri dengan material tersebut untuk membangun konsentrasi. Guru mengobservasi tanpa menginterupsi. [Menyenangkan - Kerja Mandiri]",
      "Setelah selesai, bimbing anak merapikan material dan mengembalikannya ke rak: 'Yuk, kita kembalikan ke rak secara rapi. Kebersihan dan keteraturan adalah bagian dari rasa syukur kita.' [Berkesadaran]"
    ],
    reflectionSteps: [
      "Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]",
      "Berikan apresiasi spesifik atas usaha anak: 'Masya Allah, hari ini kalian menunjukkan ketekunan dan kerja sama yang luar biasa saat menggunakan alat ini.' [Berkesadaran - Merefleksikan]",
      "Recalling Pengalaman: Tanyakan kepada anak: 'Bagian mana dari kegiatan tadi yang paling menarik atau menantang bagi kalian?' Biarkan anak bercerita. [Berkesadaran - Merefleksikan]"
    ]
  },
  {
    label: "K2-K3: Dot Game — Pengurangan / The Dot Game — Subtraction",
    grades: ["K2", "K3"],
    tool: "Dot Game Paper, Lead Pencil, Colored Pencil, Eraser",
    prerequisites: "Anak memahami konsep pengurangan dinamis dengan Stamp Game.",
    directAim: "Melakukan pengurangan bilangan besar di kertas berkisi dengan teknik mencoret titik hitam dan pertukaran nilai tempat.",
    indirectAim: "Penguatan konsep meminjam (borrowing/exchanging) secara tertulis.",
    error: "Mekanis: Salah mencoret jumlah titik yang dikurangi atau lupa melakukan pertukaran nilai tempat.",
    quranVerse: "QS. Al-Kahf: 49",
    quranMessage: "Buku catatan amal tidak melewatkan hal kecil maupun besar melainkan mencatatnya secara rapi. Pengurangan melatih ketelitian kita dalam mengurangi hak/kewajiban dengan tepat tanpa kecurangan.",
    coreSteps: [
      "Guru mengajak anak mempersiapkan Dot Game Paper, pensil biasa, pensil warna, dan penghapus di atas karpet kerja.",
      "Guru menulis soal pengurangan bersusun (misalnya: 4521 - 2354) di bagian kanan kertas.",
      "Guru menegaskan aturan penting: 'Dalam pengurangan, kita hanya menggambar titik-titik hitam untuk angka pertama (minuend: 4521) saja di atas meja. Angka pengurang tidak dibuat titiknya.'",
      "Anak menggambar titik-titik hitam yang mewakili minuend (1 satuan, 2 puluhan, 5 ratusan, 4 ribuan) pada kolom desimal masing-masing.",
      "Mulai kurangi dari kolom satuan: Guru menunjuk angka satuan pengurang (4) dan meminta anak mencoret 4 titik hitam di kolom satuan. Karena hanya ada 1 titik hitam, tunjukkan kita tidak cukup.",
      "Hukum Pertukaran (Exchanging): Anak mengambil pensil warna, mencoret satu titik hitam di kolom puluhan (T) sebagai tanda dipinjam, lalu menggambar 10 titik hitam baru dengan pensil biasa di kolom satuan (U).",
      "Kini kolom satuan memiliki 11 titik hitam. Anak mencoret 4 titik hitam di antaranya, menghitung sisa titik hitam yang belum dicoret (7), dan menulis angka 7 di kotak hasil bawah kolom satuan.",
      "Anak beralih ke kolom puluhan (sisa 1 titik hitam karena 1 telah dicoret warna). Pengurangnya adalah 5. Karena tidak cukup, anak meminjam dari ratusan: coret 1 titik di kolom ratusan (H) dengan pensil warna, lalu gambar 10 titik hitam baru di kolom puluhan.",
      "Anak mencoret 5 titik hitam dari total 11 titik di kolom puluhan, menghitung sisanya (6), dan menulis angka 6 di kotak hasil.",
      "Anak melanjutkan langkah pengurangan dan peminjaman yang sama untuk kolom ratusan dan ribuan hingga selesai.",
      "Guru mengajak anak membaca sisa akhir di kotak hasil bersama-sama: dua ribu seratus enam puluh tujuh (2167)."
    ],
    independentSteps: [
      "Undang anak untuk mencoba secara mandiri: 'Apakah kamu ingin mencobanya sendiri atau bekerja bersama temanmu?' [Menyenangkan]",
      "Biarkan anak melakukan eksplorasi berulang kali secara mandiri dengan material tersebut untuk membangun konsentrasi. Guru mengobservasi tanpa menginterupsi. [Menyenangkan - Kerja Mandiri]",
      "Setelah selesai, bimbing anak merapikan material dan mengembalikannya ke rak: 'Yuk, kita kembalikan ke rak secara rapi. Kebersihan dan keteraturan adalah bagian dari rasa syukur kita.' [Berkesadaran]"
    ],
    reflectionSteps: [
      "Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]",
      "Berikan apresiasi spesifik atas usaha anak: 'Masya Allah, hari ini kalian menunjukkan ketekunan dan kerja sama yang luar biasa saat menggunakan alat ini.' [Berkesadaran - Merefleksikan]",
      "Recalling Pengalaman: Tanyakan kepada anak: 'Bagian mana dari kegiatan tadi yang paling menarik atau menantang bagi kalian?' Biarkan anak bercerita. [Berkesadaran - Merefleksikan]"
    ]
  },
  {
    label: "K3: Dot Game — Perkalian / The Dot Game — Multiplication",
    grades: ["K3"],
    tool: "Dot Game Paper, Lead Pencil, Colored Pencil",
    prerequisites: "Anak menguasai perkalian dinamis dengan Stamp Game dan memahami perkalian sebagai penjumlahan berulang.",
    directAim: "Mengalikan bilangan besar dengan melukiskan set titik berulang kali di kertas berkisi.",
    indirectAim: "Persiapan tabel perkalian visual tingkat tinggi.",
    error: "Mekanis: Menggambar set titik dengan jumlah yang salah atau keliru dalam mengelompokkan kelipatan sepuluh.",
    quranVerse: "QS. Al-An’am: 160",
    quranMessage: "Siapa yang berbuat kebaikan akan mendapat balasan sepuluh kali lipat. Perkalian mengajarkan kemurahan Allah melipatgandakan amal hamba-Nya dengan berlipat ganda.",
    coreSteps: [
      "Guru meletakkan Dot Game Paper, pensil biasa, dan pensil warna di atas karpet kerja.",
      "Guru menulis soal perkalian bersusun (misalnya: 1324 x 3) di bagian kanan kertas.",
      "Guru menjelaskan bahwa kita akan menggambar titik-titik untuk bilangan 1324 sebanyak 3 kali ke bawah.",
      "Anak menggambar set pertama titik-titik 1324 (4 satuan, 2 puluhan, 3 ratusan, 1 ribuan) di kolom masing-masing.",
      "Anak menggambar set kedua dan set ketiga yang identik di bawahnya, dipisahkan dengan garis batas pensil tipis di antara masing-masing set.",
      "Anak mulai menghitung total titik di kolom satuan (4 x 3 = 12 titik hitam). Setiap mencapai sepuluh, bimbing anak mencoret baris kotak tersebut dan menggambar satu titik berwarna di kotak carry-over kolom puluhan.",
      "Anak mencatat sisa satuan yang tidak dicoret (2) di kotak hasil paling bawah kolom satuan.",
      "Anak melanjutkan ke kolom puluhan, menghitung semua titik hitam ditambah titik carry-over berwarna di atasnya. Coret baris sepuluh jika ada, lakukan carry-over ke ratusan, dan catat sisa hasilnya.",
      "Anak mengulangi proses perhitungan dan pertukaran yang sama untuk kolom ratusan dan ribuan.",
      "Guru mengajak anak membaca hasil perkalian akhir bersama-sama: tiga ribu sembilan ratus tujuh puluh dua (3972)."
    ],
    independentSteps: [
      "Undang anak untuk mencoba secara mandiri: 'Apakah kamu ingin mencobanya sendiri atau bekerja bersama temanmu?' [Menyenangkan]",
      "Biarkan anak melakukan eksplorasi berulang kali secara mandiri dengan material tersebut untuk membangun konsentrasi. Guru mengobservasi tanpa menginterupsi. [Menyenangkan - Kerja Mandiri]",
      "Setelah selesai, bimbing anak merapikan material dan mengembalikannya ke rak: 'Yuk, kita kembalikan ke rak secara rapi. Kebersihan dan keteraturan adalah bagian dari rasa syukur kita.' [Berkesadaran]"
    ],
    reflectionSteps: [
      "Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]",
      "Berikan apresiasi spesifik atas usaha anak: 'Masya Allah, hari ini kalian menunjukkan ketekunan dan kerja sama yang luar biasa saat menggunakan alat ini.' [Berkesadaran - Merefleksikan]",
      "Recalling Pengalaman: Tanyakan kepada anak: 'Bagian mana dari kegiatan tadi yang paling menarik atau menantang bagi kalian?' Biarkan anak bercerita. [Berkesadaran - Merefleksikan]"
    ]
  }
];

const levels = newLevelsData.map(nl => {
  const steps = [];
  steps.push("I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)");
  steps.push("1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]");
  steps.push("2. Undang anak ke area karpet kerja dan katakan: 'Nak, hari ini kita akan mengeksplorasi " + nl.label.split(' / ')[0] + " menggunakan " + nl.tool + ". Mari kita lihat keagungan susunan ciptaan Allah.' [Berkesadaran]");
  steps.push("3. Siapkan karpet kerja yang bersih dan rapi di lantai.");
  steps.push("4. Guru membawa material " + nl.tool + " ke atas karpet bersama anak dengan penuh rasa hormat terhadap alat kerja. [Berkesadaran]");
  
  steps.push("II. PRESENTASI INTI (Langkah Eksplorasi)");
  steps.push("5. Guru meletakkan material di tengah karpet dan meminta anak mengamatinya secara visual. [Bermakna - Memahami]");
  
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
  steps.push(stepIdx + ". Mengucap hamdalah bersama-sama untuk menutup sesi kerja: 'Alhamdulillahi rabbil ’alamin.' [Berkesadaran]");
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

const injectionEffect = `
    // --- ONE-TIME DOT GAME UPDATE MIGRATION ---
    useEffect(() => {
        const runDotMigration = async () => {
            if (localStorage.getItem('migrated_dot_game_ami_v5')) return;
            console.log("Starting Dot Game AMI Migration...");
            try {
                const docRef = doc(db, 'kurikulum_pusat', 'matematika');
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) return;
                const currentData = docSnap.data();
                const updatedData = JSON.parse(JSON.stringify(currentData));
                
                const dotLevels = ${JSON.stringify(levels, null, 2)};
                
                const dotSub = updatedData.subAreas.find(sa => sa.id === 'math_dot_game');
                if (dotSub) {
                    dotSub.levels = dotLevels;
                    await setDoc(docRef, updatedData);
                    console.log("Dot Game update successful!");
                    localStorage.setItem('migrated_dot_game_ami_v5', 'true');
                    alert("Berhasil memperbarui Dot Game ke standar AMI murni!");
                    window.location.reload();
                }
            } catch (err) {
                console.error("Migration failed:", err);
            }
        };

        if (loading === false && curriculum.length > 0) {
            runDotMigration();
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
console.log("Successfully injected Clean-Quoted Dot Game migration useEffect into CurriculumManager.jsx!");
