const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/pages/CurriculumManager.jsx');
const content = fs.readFileSync(targetFile, 'utf8');

const injectionEffect = `
    // --- ONE-TIME GREAT LESSONS GRADES FIX ---
    useEffect(() => {
        const runGradesFix = async () => {
            if (localStorage.getItem('migrated_great_lessons_grades_v1')) return;
            console.log("Updating Great Lessons grades to K1-K6...");
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
                                    label: "K1-K6: Cerita Besar 4: Sejarah Tulisan / The Story of Writing",
                                    grades: ["K1", "K2", "K3", "K4", "K5", "K6"]
                                };
                            }
                            return lvl;
                        });
                        await setDoc(bahasaRef, updatedData);
                        console.log("Updated Bahasa Great Lessons to K1-K6!");
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
                                    label: "K1-K6: Cerita Besar 5: Sejarah Angka / The Story of Numbers",
                                    grades: ["K1", "K2", "K3", "K4", "K5", "K6"]
                                };
                            }
                            return lvl;
                        });
                        await setDoc(mathRef, updatedData);
                        console.log("Updated Matematika Great Lessons to K1-K6!");
                    }
                }

                localStorage.setItem('migrated_great_lessons_grades_v1', 'true');
                alert("Berhasil menyelaraskan Cerita Besar (Great Lessons) Matematika & Bahasa untuk jenjang Kelas 1-6!");
                window.location.reload();
            } catch (err) {
                console.error("Migration failed:", err);
            }
        };

        if (loading === false && curriculum.length > 0) {
            runGradesFix();
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
console.log("Successfully injected Great Lessons grades fix hook into CurriculumManager.jsx!");
