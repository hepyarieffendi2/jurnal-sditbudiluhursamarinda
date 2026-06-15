const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/pages/CurriculumManager.jsx');
const content = fs.readFileSync(targetFile, 'utf8');

const migrationHook = `
    // --- ONE-TIME MATH QUOTES MIGRATION IN BROWSER ---
    useEffect(() => {
        const runQuotesMigration = async () => {
            if (localStorage.getItem('migrated_math_quotes_v5')) return;
            console.log("Starting Math Quotes Migration in browser...");
            try {
                const docRef = doc(db, 'kurikulum_pusat', 'matematika');
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) return;
                const currentData = docSnap.data();
                
                const fixQuotesStr = (str) => {
                    if (typeof str !== 'string') return str;
                    let newStr = str;
                    const apostrophes = [
                        { pattern: /Al-Ma'idah/g, replacement: "Al-Ma’idah" },
                        { pattern: /Al-An'am/g, replacement: "Al-An’am" },
                        { pattern: /Al-A'raf/g, replacement: "Al-A’raf" },
                        { pattern: /Ali 'Imran/g, replacement: "Ali ’Imran" },
                        { pattern: /Al-Qur'an/g, replacement: "Al-Qur’an" },
                        { pattern: /Qur'an/g, replacement: "Qur’an" },
                        { pattern: /Al-Qari'ah/g, replacement: "Al-Qari’ah" },
                        { pattern: /Al-Isra'/g, replacement: "Al-Isra’" },
                        { pattern: /Isra'/g, replacement: "Isra’" },
                        { pattern: /Mi'raj/g, replacement: "Mi’raj" },
                        { pattern: /Ka'bah/g, replacement: "Ka’bah" },
                        { pattern: /Ar-Ra'd/g, replacement: "Ar-Ra’d" },
                        { pattern: /rabbil 'alamin/gi, replacement: "rabbil ’alamin" },
                        { pattern: /rabbil 'alamiin/gi, replacement: "rabbil ’alamiin" },
                        { pattern: /rabbil 'aalamiin/gi, replacement: "rabbil ’aalamiin" },
                        { pattern: /Bird's/g, replacement: "Bird’s" },
                        { pattern: /Montessori's/g, replacement: "Montessori’s" },
                        { pattern: /child's/g, replacement: "child’s" }
                    ];
                    
                    apostrophes.forEach(r => {
                        newStr = newStr.replace(r.pattern, r.replacement);
                    });
                    
                    newStr = newStr.replace(/Al-An am/g, "Al-An’am");
                    
                    const terms = [
                        "1", "2", "10", "345", "0,1", "1.000.000", "Partial Products",
                        "ekor", "memakan", "makan-memakan", "ular kebaikan",
                        "Addition Control Chart", "Subtraction Control Chart", "Subtraction Table",
                        "Multiplication Control Chart", "Division Control Chart", "Multiplication Booklet",
                        "Sisa", "4", "8", "16", "12", "lima kuadrat", "lima pangkat dua",
                        "lima kubik", "lima pangkat tiga", "The Magic Slide", "Magic Slide",
                        "Three Period Lesson", "Equivalence Control Chart", "=",
                        "setengah dari sepertiga", "satu setengah", "Stereognostic", "Tracer",
                        "Garis Pandu Hitam", "Matahari"
                    ];
                    
                    terms.forEach(t => {
                        const regex = new RegExp("'" + t + "'", 'g');
                        newStr = newStr.replace(regex, '"' + t + '"');
                    });
                    
                    return newStr;
                };

                const processObj = (obj) => {
                    if (typeof obj === 'string') {
                        return fixQuotesStr(obj);
                    } else if (Array.isArray(obj)) {
                        return obj.map(item => processObj(item));
                    } else if (typeof obj === 'object' && obj !== null) {
                        const newObj = {};
                        Object.keys(obj).forEach(key => {
                            newObj[key] = processObj(obj[key]);
                        });
                        return newObj;
                    }
                    return obj;
                };

                const cleanedData = processObj(currentData);
                
                await setDoc(docRef, cleanedData);
                console.log("Math Quotes migration successful in browser!");
                localStorage.setItem('migrated_math_quotes_v5', 'true');
                alert("Berhasil memperbarui tanda petik dan apostrof di kurikulum Matematika!");
                window.location.reload();
            } catch (err) {
                console.error("Browser migration failed:", err);
            }
        };

        if (loading === false && curriculum.length > 0) {
            runQuotesMigration();
        }
    }, [loading, curriculum]);
`;

const targetHook = 'const [loading, setLoading] = useState(true);';
const insertPos = content.indexOf(targetHook);
if (insertPos === -1) {
  console.log("Error: targetHook state not found in CurriculumManager.jsx!");
  process.exit(1);
}

const replacementPos = insertPos + targetHook.length;
const newContent = content.substring(0, replacementPos) + "\n" + migrationHook + content.substring(replacementPos);

fs.writeFileSync(targetFile, newContent, 'utf8');
console.log("Successfully injected Math Quotes migration hook into CurriculumManager.jsx!");
