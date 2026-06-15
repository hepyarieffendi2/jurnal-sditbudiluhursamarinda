const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/pages/CurriculumManager.jsx');
const content = fs.readFileSync(targetFile, 'utf8');

const injectionEffect = `
    // --- ONE-TIME GREAT LESSONS DETAILS UPDATE ---
    useEffect(() => {
        const runDetailsUpdate = async () => {
            if (localStorage.getItem('migrated_great_lessons_details_v2')) return;
            console.log("Updating Great Lessons steps with K1-K6 details...");
            try {
                // 1. Update BAHASA
                const bahasaRef = doc(db, 'kurikulum_pusat', 'bahasa');
                const bahasaSnap = await getDoc(bahasaRef);
                if (bahasaSnap.exists()) {
                    const data = bahasaSnap.data();
                    const updatedData = JSON.parse(JSON.stringify(data));
                    
                    const greatLessons = updatedData.subAreas.find(sa => sa.id === 'lang_great_lessons');
                    if (greatLessons && greatLessons.levels && greatLessons.levels.length > 0) {
                        greatLessons.levels = greatLessons.levels.map(lvl => {
                            const label = typeof lvl === 'object' ? lvl.label : lvl;
                            if (label.includes("Cerita Besar 4")) {
                                const base = typeof lvl === 'object' ? lvl : { label };
                                return {
                                    ...base,
                                    presentation: {
                                        ...base.presentation,
                                        steps: [
                                            "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                                            "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                                            "2. Undang anak melingkar dan katakan: 'Nak, hari ini kita akan menjelajahi bagaimana pena dan tulisan menjadi penjaga ilmu di dunia. Allah mengajarkan manusia dengan perantara pena (Al-Alaq: 4).' [Berkesadaran]",
                                            "3. Siapkan karpet kerja bertekstur halus di lantai.",
                                            "4. Guru membawa material gambar lukisan gua, sampel lempeng/papirus, serta perkamen ke atas karpet. [Berkesadaran]",
                                            "II. PRESENTASI INTI (Langkah Eksplorasi)",
                                            "5. Guru memperlihatkan gambar lukisan gua (Lascaux/Maros) dan menceritakan bagaimana manusia purba berkomunikasi lewat gambar. [Bermakna - Memahami]",
                                            "6. Guru menjelaskan perkembangan huruf Hieroglif di Mesir Kuno dan transisinya ke alfabet Fenisia. [Bermakna - Memahami]",
                                            "7. Guru memperlihatkan contoh naskah kuno era Romawi dan transisinya ke seni kaligrafi di Era Keemasan Islam. [Bermakna - Memahami]",
                                            "8. Guru mencontohkan kata-kata kunci dalam Bahasa Inggris: “Cave painting”, “Symbols”, “Alphabet”, dan “Manuscript”. [Bermakna - Memahami]",
                                            "9. Guru mengajak anak menyimulasikan penulisan simbol sederhana di atas nampan pasir sebagai replika tablet tanah liat kuno. [Bermakna - Mengaplikasikan]",
                                            "III. KERJA MANDIRI (Pijakan Saat Main)",
                                            "10. Undang anak untuk mengeksplorasi pilihan kegiatan sesuai jenjang kelas mereka: [Menyenangkan]",
                                            "11. (Untuk Kelas 1 - K1): Anak berlatih menulis simbol kuno di atas nampan pasir menggunakan kuas, jari, atau menjiplak huruf kuno sandpaper. [Menyenangkan - Kerja Mandiri]",
                                            "12. (Untuk Kelas 2 - K2): Anak menyusun kartu-kartu evolusi huruf dari lukisan gua hingga alfabet Latin berdasarkan garis waktu (timeline). [Menyenangkan - Kerja Mandiri]",
                                            "13. (Untuk Kelas 3 - K3): Anak menulis pesan pendek menggunakan huruf Fenisia kuno pada kertas gambar (replika kertas perkamen kuno). [Menyenangkan - Kerja Mandiri]",
                                            "14. (Untuk Kelas 4-6 - K4-K6): Anak melakukan riset mini di perpustakaan tentang sejarah mesin cetak pertama (Gutenberg) atau sejarah kaligrafi Islam, lalu menuangkannya dalam poster. [Menyenangkan - Kerja Mandiri]",
                                            "15. Jika selesai, tuntun anak merapikan material dan mengembalikannya ke rak: 'Mari kita rapikan alas dan nampan kita secara teratur.' [Berkesadaran]",
                                            "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                                            "16. Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]",
                                            "17. Berikan apresiasi atas usaha, ketelitian, dan kejujuran anak dalam belajar. [Berkesadaran - Merefleksikan]",
                                            "18. Recalling Pengalaman: Tanyakan kepada anak tentang perasaan mereka mengetahui perjuangan para pendahulu dalam menulis. [Berkesadaran - Merefleksikan]",
                                            "19. Internalisasi Nilai Islam (QS. Al-Alaq: 4): Guru menjelaskan: 'Allah mengajarkan manusia dengan perantara pena. Menulis dengan indah adalah wujud rasa syukur atas kelenturan tangan dan nikmat literasi.' [Berkesadaran - Merefleksikan]",
                                            "20. Ajak anak berkomitmen melakukan satu kebaikan nyata hari ini sebagai wujud syukur. [Berkesadaran - Mengaplikasikan]",
                                            "21. Mengucap hamdalah bersama-sama untuk menutup sesi kerja: 'Alhamdulillahi rabbil ’alamin.' [Berkesadaran]",
                                            "22. Guru mengucapkan kalimat penutup kepada anak: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
                                        ]
                                    }
                                };
                            }
                            return lvl;
                        });
                        await setDoc(bahasaRef, updatedData);
                        console.log("Updated Bahasa Great Lessons details!");
                    }
                }

                // 2. Update MATEMATIKA
                const mathRef = doc(db, 'kurikulum_pusat', 'matematika');
                const mathSnap = await getDoc(mathRef);
                if (mathSnap.exists()) {
                    const data = mathSnap.data();
                    const updatedData = JSON.parse(JSON.stringify(data));
                    
                    const greatLessons = updatedData.subAreas.find(sa => sa.id === 'math_great_lessons');
                    if (greatLessons && greatLessons.levels && greatLessons.levels.length > 0) {
                        greatLessons.levels = greatLessons.levels.map(lvl => {
                            const label = typeof lvl === 'object' ? lvl.label : lvl;
                            if (label.includes("Cerita Besar 5")) {
                                const base = typeof lvl === 'object' ? lvl : { label };
                                return {
                                    ...base,
                                    presentation: {
                                        ...base.presentation,
                                        steps: [
                                            "I. PIJAKAN AWAL & PERSIAPAN (Pijakan Sebelum Main)",
                                            "1. Mulai kegiatan dengan mengucap bersama anak: 'Bismillahirrahmanirrahim.' [Berkesadaran]",
                                            "2. Undang anak melingkar di atas karpet dan katakan: 'Nak, hari ini kita akan mendengarkan kisah menakjubkan tentang bagaimana manusia menemukan cara menuliskan angka. Tahukah kamu bahwa dahulu angka tidak tertulis seperti sekarang?' [Berkesadaran]",
                                            "3. Siapkan karpet kerja dan tata gambar-gambar peradaban kuno (Babilonia, Mesir, Hindu-Arab) secara rapi.",
                                            "4. Guru meletakkan nampan berisi beberapa batu kerikil dan tali simpul di tengah karpet sebagai replika alat hitung kuno.",
                                            "II. PRESENTASI INTI (Langkah Eksplorasi)",
                                            "5. Guru meletakkan gambar lukisan gua dan berkata: 'Ribuan tahun lalu, manusia menghitung ternak mereka dengan mencocokkannya satu per satu dengan batu kerikil. Satu domba, satu kerikil masuk ke kantong kulit.' [Bermakna - Memahami]",
                                            "6. Guru menunjukkan gambar tablet Babilonia: 'Lalu manusia mulai membuat goresan di lempengan tanah liat sebagai tanda jumlah barang.' [Bermakna - Memahami]",
                                            "7. Guru menunjukkan angka Romawi (I, V, X) dan memperagakan keterbatasannya ketika menulis angka besar yang sangat panjang.",
                                            "8. Guru menunjukkan penemuan angka Hindu-Arab (0, 1, 2, 3, ...) dan menjelaskan kontribusi besar ilmuwan muslim seperti Al-Khawarizmi yang menemukan angka Nol (Sifr/Kosong). [Bermakna - Memahami]",
                                            "9. Guru: 'Angka nol inilah yang merevolusi matematika sehingga kita bisa menghitung hingga jutaan dengan sangat mudah.' [Bermakna - Memahami]",
                                            "10. In English: 'Numbers (Angka), Calculation (Perhitungan), Zero (Nol), and History (Sejarah).'",
                                            "III. KERJA MANDIRI (Pijakan Saat Main)",
                                            "11. Undang anak untuk mengeksplorasi pilihan kegiatan sesuai jenjang kelas mereka: [Menyenangkan]",
                                            "12. (Untuk Kelas 1 - K1): Anak menghitung jumlah domba purba menggunakan batu kerikil asli yang dimasukkan ke dalam kantong kulit, atau menggambar simbol angka purba di atas nampan pasir/garam. [Menyenangkan - Kerja Mandiri]",
                                            "13. (Untuk Kelas 2 - K2): Anak mencocokkan kartu simbol angka peradaban (Babilonia, Romawi, Mesir) dengan garis waktu asal negaranya, atau menulis angka Romawi di buku kotak. [Menyenangkan - Kerja Mandiri]",
                                            "14. (Untuk Kelas 3 - K3): Membuat tablet angka Babilonia menggunakan tanah liat (clay) asli yang diukir dengan stik kayu, atau mencari biografi ilmuwan muslim penemu angka Nol (Al-Khawarizmi). [Menyenangkan - Kerja Mandiri]",
                                            "15. (Untuk Kelas 4-6 - K4-K6): Anak membandingkan sistem basis bilangan desimal (basis 10) dengan bilangan seksagesimal Babilonia (basis 60) atau biner komputer (basis 2), lalu membuat laporan riset singkat. [Menyenangkan - Kerja Mandiri]",
                                            "16. Setelah selesai, bimbing anak merapikan material kembali ke wadah: 'Yuk, kita kembalikan ke rak secara tertib. Merapikan alat adalah wujud tanggung jawab kita.' [Berkesadaran]",
                                            "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                                            "17. Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]",
                                            "18. Berikan apresiasi spesifik: 'Masya Allah, kalian mendengarkan cerita sejarah tadi dengan sangat khusyuk dan tertib.' [Berkesadaran - Merefleksikan]",
                                            "19. Recalling Pengalaman: Tanyakan kepada anak: 'Menurut kalian, bagaimana jika dunia ini tidak pernah ada angka Nol? Apakah kita bisa berhitung dengan mudah?' Biarkan anak menjawab. [Berkesadaran - Merefleksikan]",
                                            "20. Internalisasi Nilai Islam (QS. Yasin: 12): Guru menjelaskan: 'Allah mencatat segala perbuatan manusia di dalam Kitab Induk yang nyata. Dan Allah adalah Al-Hasib, Maha Memperhitung segala amal kita dengan teliti.' [Berkesadaran - Merefleksikan]",
                                            "21. Ajak anak berkomitmen melakukan satu kebaikan nyata hari ini sebagai bukti syukur atas akal yang Allah karuniakan.",
                                            "22. Mengucap hamdalah bersama-sama untuk menutup sesi kerja: 'Alhamdulillahi rabbil ’alamin.' [Berkesadaran]",
                                            "23. Guru mengucapkan kalimat penutup kepada anak: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
                                        ]
                                    }
                                };
                            }
                            return lvl;
                        });
                        await setDoc(mathRef, updatedData);
                        console.log("Updated Matematika Great Lessons details!");
                    }
                }

                localStorage.setItem('migrated_great_lessons_details_v2', 'true');
                alert("Berhasil menyelaraskan perbedaan aktivitas tingkat kelas (K1-K6) pada Cerita Besar di aplikasi!");
                window.location.reload();
            } catch (err) {
                console.error("Migration failed:", err);
            }
        };

        if (loading === false && curriculum.length > 0) {
            runDetailsUpdate();
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
console.log("Successfully injected Great Lessons details update hook into CurriculumManager.jsx!");
