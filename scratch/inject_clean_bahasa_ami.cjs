const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const sa = require('../serviceAccountKey.json'); // serviceAccountKey is in the project root

const app = admin.initializeApp({ credential: admin.cert(sa) });
const db = getFirestore();

// Custom cleaner for core steps to remove moral/religious analogies and annotations
function cleanCoreStep(step) {
    let s = step;
    
    // Remove trailing annotations like [Bermakna - Memahami], [Merefleksikan], etc.
    s = s.replace(/\s*\[(Bermakna|Berkesadaran|Merefleksikan|Menyenangkan)[^\]]*\]/gi, "");
    
    // Remove step number prefix if exists (e.g. "5. ", "12. ")
    s = s.replace(/^\d+\.\s*/, "");
    
    // Clean specific forced analogies
    if (s.includes("Seperti persaudaraan (Ukhuwah), dua huruf yang berbeda jika bersatu")) {
        return "Ketika dua huruf berbeda bersanding bersama, mereka menghasilkan satu bunyi baru.";
    }
    if (s.includes("Dua huruf ini bersahabat erat. Saat mereka bersama, mereka memiliki satu suara kesatuan yang baru (Ukhuwah).")) {
        return "Saat kedua huruf diletakkan bersama, keduanya menghasilkan satu bunyi baru.";
    }
    if (s.includes("Jelaskan konsep Tali Persaudaraan (Ukhuwah) - kata sambung menyatukan ide.")) {
        return "Jelaskan bahwa kata sambung bertugas untuk menghubungkan kata-kata terpisah menjadi kalimat.";
    }
    if (s.includes("Mentadabburi fenomena bahwasanya sulur silaturahmi")) {
        return null; // Skip this convoluted step entirely
    }
    if (s.includes("Menulis surat adalah cara kita menjalin silaturahmi (Ukhuwah)")) {
        return "Jelaskan bahwa menulis surat adalah salah satu cara mengirimkan pesan kepada kerabat.";
    }
    if (s.includes("Rantai ini terdiri dari batang-batang manik yang saling berkaitan, seperti ukhuwah.")) {
        return "Tunjukkan bahwa rantai ini terdiri dari batang-batang manik yang saling berkaitan.";
    }
    if (s.includes("Keharmonisan struktur kalimat yang menyatukan klausa menggambarkan kekuatan persaudaraan (Ukhuwah)")) {
        return null; // Skip this forced analogy step
    }
    if (s.includes("mengingatkan kita pada pentingnya berhati-hati dalam berucap karena setiap kata memiliki dahan akibat")) {
        return "Jelaskan bagaimana penambahan awalan atau akhiran mengubah arti kata dasar.";
    }
    if (s.includes("Hubungkan dengan konsep Ihsan: Melakukan amal dengan cara yang terbaik.")) {
        return "Latih anak melakukan gerakan sesuai dengan kata keterangan tersebut secara tepat.";
    }
    if (s.includes("Tinggi rendahnya huruf harus adil (Al-Adl). Berikan hak setiap huruf.")) {
        return "Tunjukkan tinggi rendahnya huruf agar tertulis secara proporsional.";
    }
    if (s.includes("Hati yang bersambung dengan Allah akan berbuah keindahan")) {
        return null; // Skip
    }
    
    // Clean minor keywords while keeping the core sentence structure
    s = s.replace(/\s*\(Ukhuwah\)/g, "");
    s = s.replace(/\s*\(Ta'awun\)/g, "");
    s = s.replace(/\s*\(Shiddiq\)/g, "");
    s = s.replace(/\s*\(Fathonah\)/g, "");
    s = s.replace(/\s*\(Tabligh\)/g, "");
    s = s.replace(/\s*\(Amanah\)/g, "");
    s = s.replace(/\s*\(Ihsan\)/g, "");
    
    return s.trim();
}

async function runMigration() {
    try {
        console.log("Fetching 'bahasa' document from Firestore...");
        const docRef = db.collection('kurikulum_pusat').doc('bahasa');
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            console.error("Document 'bahasa' not found!");
            return;
        }
        
        const data = docSnap.data();
        const updatedData = JSON.parse(JSON.stringify(data));
        
        console.log("Processing sub-areas and levels...");
        updatedData.subAreas.forEach(sa => {
            console.log(`\nSub-area: ${sa.id}`);
            if (!sa.levels) return;
            
            sa.levels.forEach((level, idx) => {
                const label = level.label;
                const toolDisplay = level.presentation?.toolDisplay || level.presentation?.tool || "alat peraga";
                
                if (!level.presentation || !level.presentation.steps) {
                    console.log(`  [SKIP] ${label} - No presentation steps found.`);
                    return;
                }
                
                const oldSteps = level.presentation.steps;
                const coreSteps = [];
                
                oldSteps.forEach(step => {
                    const sLower = step.toLowerCase();
                    
                    // Filter out boilerplate wrappers
                    if (sLower.includes("bismillahirrahmanirrahim") || sLower.includes("basmalah")) return;
                    if (sLower.includes("hamdalah") || sLower.includes("alhamdulillah")) return;
                    if (sLower.includes("jaza kumullohu") || sLower.includes("penutup majelis")) return;
                    if (sLower.includes("apresiasi atas usaha") || sLower.includes("menanyakan perasaan") || sLower.includes("bersyukur atas ilmu baru")) return;
                    if (sLower.includes("karpet kerja") && (sLower.includes("gelar") || sLower.includes("siapkan") || sLower.includes("bentangkan") || sLower.includes("bawa") || sLower.includes("undang anak"))) return;
                    if (sLower.includes("merapikan") || sLower.includes("kembalikan ke rak") || sLower.includes("simpan kembali") || sLower.includes("bereskan")) return;
                    if (sLower.includes("internalisasi nilai islam") || sLower.includes("qs. ")) return;
                    if (sLower.includes("komitmen melakukan") || sLower.includes("kebaikan nyata")) return;
                    if (sLower.includes("meletakkan material di tengah karpet") && sLower.includes("visual")) return;
                    if (sLower.includes("mencoba secara mandiri") || sLower.includes("bekerja bersama teman")) return;
                    if (sLower.includes("observasi tanpa menginterupsi") || sLower.includes("eksplorasi berulang")) return;
                    
                    // Clean and add core step
                    const cleaned = cleanCoreStep(step);
                    if (cleaned) {
                        coreSteps.push(cleaned);
                    }
                });
                
                // Compile clean, minimalist AMI steps list
                const newSteps = [];
                newSteps.push("1. Undang anak ke area karpet kerja dan bentangkan karpet.");
                newSteps.push(`2. Bawa material ${toolDisplay} ke atas karpet bersama anak.`);
                
                let stepNum = 3;
                coreSteps.forEach(cs => {
                    newSteps.push(`${stepNum}. ${cs}`);
                    stepNum++;
                });
                
                newSteps.push(`${stepNum}. Berikan kesempatan kepada anak untuk mencoba menggunakan material secara mandiri.`);
                stepNum++;
                newSteps.push(`${stepNum}. Bimbing anak merapikan material kembali ke rak setelah selesai.`);
                
                // Update in updatedData
                level.presentation.steps = newSteps;
                
                // Also clean prerequisites, directAim, and indirectAim if they contain forced moral/religious messages
                if (level.presentation.prerequisites) {
                    level.presentation.prerequisites = level.presentation.prerequisites.replace(/\s*\(Amanah|\s*\(Ihsan|\s*\(Shiddiq|\s*\(Fathonah|\s*\(Tabligh|\s*\(Ukhuwah/gi, "");
                }
                if (level.presentation.directAim) {
                    level.presentation.directAim = level.presentation.directAim.replace(/dan merenungi kekuasaan Allah|laksana Ukhuwah yang mempersatukan hati|serta mensyukuri nikmat/gi, "");
                    level.presentation.directAim = level.presentation.directAim.replace(/\s*\(Amanah|\s*\(Ihsan|\s*\(Shiddiq|\s*\(Fathonah|\s*\(Tabligh|\s*\(Ukhuwah/gi, "");
                    level.presentation.directAim = level.presentation.directAim.trim();
                }
                if (level.presentation.indirectAim) {
                    level.presentation.indirectAim = level.presentation.indirectAim.replace(/sebagai wujud rasa syukur|sebagai sarana Syiar|demi kemaslahatan umat/gi, "");
                    level.presentation.indirectAim = level.presentation.indirectAim.replace(/\s*\(Amanah|\s*\(Ihsan|\s*\(Shiddiq|\s*\(Fathonah|\s*\(Tabligh|\s*\(Ukhuwah/gi, "");
                    level.presentation.indirectAim = level.presentation.indirectAim.trim();
                }
                
                console.log(`  [DONE] ${label} - Steps count: ${newSteps.length}`);
            });
        });
        
        console.log("\nSaving clean Bahasa curriculum document to Firestore...");
        await docRef.set(updatedData);
        console.log("Success! Firestore update complete.");
        process.exit(0);
    } catch (err) {
        console.error("Migration script failed:", err);
        process.exit(1);
    }
}

runMigration();
