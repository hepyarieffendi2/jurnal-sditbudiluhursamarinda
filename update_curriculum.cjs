const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'Coding AI', 'jurnal-sditbudiluhursamarinda', 'src', 'data', 'areaSentraCycle2.js');

let content = fs.readFileSync(filePath, 'utf8');

function processSteps(match, stepsBlock) {
    // Split lines, trim, and remove quotes/commas
    const rawLines = stepsBlock.split('\n')
        .map(line => line.trim().replace(/^["']|["'],?$/g, ''))
        .filter(line => line.length > 0);
    
    const headerMap = {
        "I. PERSIAPAN & UNDANGAN:": "I. KEGIATAN AWAL: [Berkesadaran]",
        "II. PROSEDUR INTI (PRESENTASI):": "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
        "III. TANTANGAN & LATIHAN MANDIRI:": "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
        "IV. MERAPIKAN & MENGEMBALIKAN ALAT:": "V. KEGIATAN PENUTUP: [Menyenangkan]"
    };
    
    let currentStepNum = 1;
    let awalSteps = [];
    let memahamiSteps = [];
    let mengaplikasikanSteps = [];
    let penutupSteps = [];
    
    let currentSection = null;
    
    for (let line of rawLines) {
        if (headerMap[line]) {
            currentSection = line;
            continue;
        }
        
        // Remove existing number prefix if present
        const contentLine = line.replace(/^\d+\.\s*/, '').trim();
        
        switch (currentSection) {
            case "I. PERSIAPAN & UNDANGAN:": awalSteps.push(contentLine); break;
            case "II. PROSEDUR INTI (PRESENTASI):": memahamiSteps.push(contentLine); break;
            case "III. TANTANGAN & LATIHAN MANDIRI:": mengaplikasikanSteps.push(contentLine); break;
            case "IV. MERAPIKAN & MENGEMBALIKAN ALAT:": penutupSteps.push(contentLine); break;
            default: memahamiSteps.push(contentLine);
        }
    }

    const finalOutput = [];
    
    finalOutput.push(`"${headerMap["I. PERSIAPAN & UNDANGAN:"]}"`);
    awalSteps.forEach(s => finalOutput.push(`"${currentStepNum++}. ${s}"`));
    
    finalOutput.push(`"${headerMap["II. PROSEDUR INTI (PRESENTASI):"]}"`);
    memahamiSteps.forEach(s => finalOutput.push(`"${currentStepNum++}. ${s}"`));
    
    finalOutput.push(`"${headerMap["III. TANTANGAN & LATIHAN MANDIRI:"]}"`);
    mengaplikasikanSteps.forEach(s => finalOutput.push(`"${currentStepNum++}. ${s}"`));
    
    // NEW SECTION
    finalOutput.push(`"IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN"`);
    finalOutput.push(`"${currentStepNum++}. Memberikan apresiasi atas usaha, ketelitian, dan kejujuran anak dalam belajar."`);
    finalOutput.push(`"${currentStepNum++}. Mengajak anak bersyukur atas ilmu baru dan kemampuan yang Allah anugerahkan."`);
    finalOutput.push(`"${currentStepNum++}. Menanyakan perasaan anak setelah berhasil menyelesaikan tantangan ini."`);

    finalOutput.push(`"${headerMap["IV. MERAPIKAN & MENGEMBALIKAN ALAT:"]}"`);
    penutupSteps.forEach(s => finalOutput.push(`"${currentStepNum++}. ${s}"`));
    
    return 'steps: [\n                ' + finalOutput.join(',\n                ') + '\n              ]';
}

const updatedContent = content.replace(/steps:\s*\[([\s\S]*?)\]/g, processSteps);

fs.writeFileSync(filePath, updatedContent);
console.log("Curriculum updated with Deep Learning labels.");
