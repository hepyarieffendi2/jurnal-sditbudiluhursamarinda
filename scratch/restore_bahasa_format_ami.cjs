const fs = require('fs');

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
    if (s.includes("Tunjukkan bahwa meskipun benda dipindah, namanya tetap sama (Istiqomah).")) {
        return "Tunjukkan bahwa meskipun benda dipindah lokasinya, nama benda tersebut tetaplah sama.";
    }
    if (s.includes("Bahas bahwa Noun adalah pondasi kalimat, seperti bumi bagi bangunan.")) {
        return "Jelaskan bahwa Noun (Kata Benda) adalah kata dasar yang menunjukkan nama dari sesuatu.";
    }
    if (s.includes("Hormatilah setiap benda dengan memanggil namanya secara benar (Adab)")) {
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

async function runLocalTest() {
    try {
        const bahasaData = JSON.parse(fs.readFileSync('scratch/backup_bahasa.json', 'utf8'));
        
        let sampleOldSteps = null;
        let sampleNewSteps = null;
        
        bahasaData.subAreas.forEach(sa => {
            if (!sa.levels) return;
            sa.levels.forEach((level) => {
                if (!level.presentation || !level.presentation.steps) return;
                
                const oldSteps = level.presentation.steps;
                const newSteps = [];
                let currentSection = "";
                let stepCounter = 1;
                
                oldSteps.forEach(step => {
                    const sectionMatch = step.match(/^([IVX]+)\.\s/);
                    if (sectionMatch) {
                        currentSection = sectionMatch[1]; // I, II, III, IV, V
                        newSteps.push(step); // push header as-is
                    } else {
                        // It's a numbered step (or unnumbered text)
                        let content = step.replace(/^\d+\.\s*/, ""); 
                        
                        if (currentSection === "II") {
                            // Core presentation step
                            let cleaned = cleanCoreStep(content);
                            if (cleaned) {
                                newSteps.push(`${stepCounter}. ${cleaned}`);
                                stepCounter++;
                            }
                        } else {
                            // Wrapper step
                            // Also ensure we remove any ukhuwah from wrapper if we really want to, but standard Islamic wrappers are usually okay.
                            // Let's just do a light clean of Ukhuwah, Ta'awun from wrapper steps just in case, while keeping the [Berkesadaran] tags
                            let wrapperCleaned = content.replace(/\s*\((Ukhuwah|Ta'awun|Shiddiq|Fathonah|Tabligh|Amanah|Ihsan)\)/g, "");
                            newSteps.push(`${stepCounter}. ${wrapperCleaned}`);
                            stepCounter++;
                        }
                    }
                });
                
                level.presentation.steps = newSteps;
                
                // Print the first one we find in grammar (index 4) for verification
                if (sa.id === "lang_grammar" && !sampleNewSteps) {
                    sampleOldSteps = oldSteps;
                    sampleNewSteps = newSteps;
                }
            });
        });
        
        console.log("=== SAMPLE OLD STEPS ===");
        console.log(JSON.stringify(sampleOldSteps, null, 2).substring(0, 800) + '...');
        console.log("\n=== SAMPLE NEW STEPS ===");
        console.log(JSON.stringify(sampleNewSteps, null, 2));

        // Save updated data to a temp file
        fs.writeFileSync('scratch/bahasa_restored_format.json', JSON.stringify(bahasaData, null, 2));
        console.log("\nSaved to scratch/bahasa_restored_format.json");
        
    } catch (err) {
        console.error(err);
    }
}

runLocalTest();
