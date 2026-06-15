const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/pages/CurriculumManager.jsx');
const content = fs.readFileSync(targetFile, 'utf8');

const injectionEffect = `
    // --- ONE-TIME GREAT LESSONS MIGRATION ---
    useEffect(() => {
        const runGreatLessonsMigration = async () => {
            if (localStorage.getItem('migrated_great_lessons_v1')) return;
            console.log("Starting Great Lessons (Cerita Besar) AMI Alignment Migration...");
            try {
                // 1. Update BAHASA
                const bahasaRef = doc(db, 'kurikulum_pusat', 'bahasa');
                const bahasaSnap = await getDoc(bahasaRef);
                if (bahasaSnap.exists()) {
                    const data = bahasaSnap.data();
                    const updatedData = JSON.parse(JSON.stringify(data));
                    
                    // Find and extract "Cerita Besar 4" from lang_spoken
                    const langSpoken = updatedData.subAreas.find(sa => sa.id === 'lang_spoken');
                    let storyOfWritingLvl = null;
                    if (langSpoken && langSpoken.levels) {
                        const foundIdx = langSpoken.levels.findIndex(lvl => {
                            const label = typeof lvl === 'object' ? lvl.label : lvl;
                            return label.includes("Cerita Besar 4");
                        });
                        if (foundIdx !== -1) {
                            storyOfWritingLvl = langSpoken.levels.splice(foundIdx, 1)[0];
                            console.log("Extracted Story of Writing level from lang_spoken");
                        }
                    }
                    
                    // Fallback level definition if not found
                    if (!storyOfWritingLvl) {
                        storyOfWritingLvl = {
                            label: "K1-K3: Cerita Besar 4: Sejarah Tulisan / The Story of Writing",
                            grades: ["K1", "K2", "K3"],
                            presentation: {
                                tool: "Gambar Sejarah Tulisan",
                                toolDisplay: "Gambar Sejarah Tulisan, Lempengan Tanah Liat, Papirus, Perkamen",
                                toolsList: ["Gambar Sejarah Tulisan", "Lempengan Tanah Liat", "Papirus", "Perkamen"],
                                prerequisites: "Kesiapan mendengarkan cerita dan rasa ingin tahu.",
                                directAim: "Memahami sejarah evolusi tulisan dari gambar prasejarah hingga alfabet modern.",
                                indirectAim: "Mensyukuri nikmat tulisan dan literasi sebagai penjaga ilmu.",
                                error: "Logika urutan waktu yang terbalik antara era gambar dan era alfabet.",
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
                                    "10. Undang anak untuk mengeksplorasi pilihan kegiatan: 'Apakah kamu ingin mencobanya sendiri atau menggambar simbol di atas nampan pasir?' [Menyenangkan]",
                                    "11. Biarkan anak berlatih menulis simbol di pasir atau menyalin huruf kuno pada kertas gambar secara mandiri. Guru mengobservasi tertib kerja anak. [Menyenangkan - Kerja Mandiri]",
                                    "12. Jika selesai, tuntun anak merapikan material dan mengembalikannya ke rak: 'Mari kita rapikan alas dan nampan kita secara teratur.' [Berkesadaran]",
                                    "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                                    "13. Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]",
                                    "14. Berikan apresiasi atas usaha, ketelitian, dan kejujuran anak dalam belajar. [Berkesadaran - Merefleksikan]",
                                    "15. Recalling Pengalaman: Tanyakan kepada anak tentang perasaan mereka mengetahui perjuangan para pendahulu dalam menulis. [Berkesadaran - Merefleksikan]",
                                    "16. Internalisasi Nilai Islam (QS. Al-Alaq: 4): Guru menjelaskan: 'Allah mengajarkan manusia dengan perantara pena. Menulis dengan indah adalah wujud rasa syukur atas kelenturan tangan dan nikmat literasi.' [Berkesadaran - Merefleksikan]",
                                    "17. Ajak anak berkomitmen melakukan satu kebaikan nyata hari ini sebagai wujud syukur. [Berkesadaran - Mengaplikasikan]",
                                    "18. Mengucap hamdalah bersama-sama untuk menutup sesi kerja: 'Alhamdulillahi rabbil ’alamin.' [Berkesadaran]",
                                    "19. Guru mengucapkan kalimat penutup kepada anak: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
                                ]
                            }
                        };
                    }

                    // Check if lang_great_lessons already exists
                    const hasGreatLessons = updatedData.subAreas.some(sa => sa.id === 'lang_great_lessons');
                    if (!hasGreatLessons) {
                        updatedData.subAreas.unshift({
                            id: "lang_great_lessons",
                            name: "Cerita Besar / The Great Lessons",
                            shortName: "Great Lessons",
                            icon: "BookOpen",
                            color: "#3B82F6",
                            bgColor: "#EFF6FF",
                            levels: [storyOfWritingLvl]
                        });
                        await setDoc(bahasaRef, updatedData);
                        console.log("Updated Bahasa document with lang_great_lessons subarea!");
                    }
                }

                // 2. Update MATEMATIKA
                const mathRef = doc(db, 'kurikulum_pusat', 'matematika');
                const mathSnap = await getDoc(mathRef);
                if (mathSnap.exists()) {
                    const data = mathSnap.data();
                    const updatedData = JSON.parse(JSON.stringify(data));
                    
                    const storyOfNumbersLvl = {
                        label: "K1: Cerita Besar 5: Sejarah Angka / The Story of Numbers",
                        grades: ["K1"],
                        presentation: {
                            tool: "Gambar Sejarah Angka",
                            toolDisplay: "Gambar Sejarah Angka, Batu Kerikil, Tali Simpul, Kertas & Spidol",
                            toolsList: ["Gambar Sejarah Angka", "Batu Kerikil", "Tali Simpul"],
                            prerequisites: "Kesiapan menyimak cerita sejarah perkembangan peradaban.",
                            directAim: "Memahami sejarah penemuan angka dari simbol purba hingga angka desimal modern.",
                            indirectAim: "Menumbuhkan apresiasi kosmik terhadap kontribusi para ilmuwan muslim dan peradaban masa lalu dalam menyederhanakan cara berhitung manusia.",
                            error: "Logika kronologis waktu peradaban yang terbalik (misal: mengira angka modern ada sebelum angka purba).",
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
                                "11. Undang anak untuk mencoba secara mandiri: 'Apakah kamu ingin mencobanya sendiri atau menggambar simbol angka purbamu sendiri?' [Menyenangkan]",
                                "12. Anak melakukan simulasi berhitung dengan mencocokkan kerikil atau membuat gambar guratan (tally marks) di atas kertas pasir/buku kotak. [Menyenangkan - Kerja Mandiri]",
                                "13. Setelah selesai, bimbing anak merapikan material kembali ke wadah: 'Yuk, kita kembalikan ke rak secara tertib. Merapikan alat adalah wujud tanggung jawab kita.' [Berkesadaran]",
                                "IV. REFLEKSI & PENUTUP (Pijakan Setelah Main / Recalling)",
                                "14. Berkumpul kembali dengan anak untuk melakukan refleksi singkat setelah beres-beres selesai. [Berkesadaran - Merefleksikan]",
                                "15. Berikan apresiasi spesifik: 'Masya Allah, kalian mendengarkan cerita sejarah tadi dengan sangat khusyuk dan tertib.' [Berkesadaran - Merefleksikan]",
                                "16. Recalling Pengalaman: Tanyakan kepada anak: 'Menurut kalian, bagaimana jika dunia ini tidak pernah ada angka Nol? Apakah kita bisa berhitung dengan mudah?' Biarkan anak menjawab. [Berkesadaran - Merefleksikan]",
                                "17. Internalisasi Nilai Islam (QS. Yasin: 12): Guru menjelaskan: 'Allah mencatat segala perbuatan manusia di dalam Kitab Induk yang nyata. Dan Allah adalah Al-Hasib, Maha Memperhitung segala amal kita dengan teliti.' [Berkesadaran - Merefleksikan]",
                                "18. Ajak anak berkomitmen melakukan satu kebaikan nyata hari ini sebagai bukti syukur atas akal yang Allah karuniakan.",
                                "19. Mengucap hamdalah bersama-sama untuk menutup sesi kerja: 'Alhamdulillahi rabbil ’alamin.' [Berkesadaran]",
                                "20. Guru mengucapkan kalimat penutup kepada anak: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
                            ]
                        }
                    };

                    const hasGreatLessons = updatedData.subAreas.some(sa => sa.id === 'math_great_lessons');
                    if (!hasGreatLessons) {
                        updatedData.subAreas.unshift({
                            id: "math_great_lessons",
                            name: "Cerita Besar / The Great Lessons",
                            shortName: "Great Lessons",
                            icon: "BookOpen",
                            color: "#3B82F6",
                            bgColor: "#EFF6FF",
                            levels: [storyOfNumbersLvl]
                        });
                        await setDoc(mathRef, updatedData);
                        console.log("Updated Matematika document with math_great_lessons subarea!");
                    }
                }

                console.log("Great Lessons AMI alignment migration successful!");
                localStorage.setItem('migrated_great_lessons_v1', 'true');
                alert("Berhasil menyelaraskan Cerita Besar (Great Lessons) Matematika & Bahasa sesuai standar AMI Murni!");
                window.location.reload();
            } catch (err) {
                console.error("Migration failed:", err);
            }
        };

        if (loading === false && curriculum.length > 0) {
            runGreatLessonsMigration();
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
console.log("Successfully injected Great Lessons migration hook into CurriculumManager.jsx!");
