import fs from 'fs';

const areasMap = {
    "Maths": { id: "MAT", name: "Matematika & Logika", icon: "Hash", color: "#6366F1", bgColor: "#EEF2FF" },
    "Geometry": { id: "GEO", name: "Geometri & Pengukuran", icon: "Wand2", color: "#EC4899", bgColor: "#FDF2F8" },
    "Language": { id: "LANG", name: "Bahasa & Literasi", icon: "BookOpen", color: "#F59E0B", bgColor: "#FFFBEB" },
    "Grammar": { id: "GRAM", name: "Tata Bahasa (Grammar)", icon: "Edit3", color: "#10B981", bgColor: "#ECFDF5" },
    "Biology": { id: "BIO", name: "Biologi & Alam", icon: "Leaf", color: "#84CC16", bgColor: "#F7FEE7" },
    "History": { id: "HIST", name: "Sejarah & Peradaban", icon: "Moon", color: "#8B5CF6", bgColor: "#F5F3FF" },
    "Geography": { id: "GEOG", name: "Geografi & Sains Fisik", icon: "Globe2", color: "#3B82F6", bgColor: "#EFF6FF" }
};

// Simplified seed function to generate album content
function generateAlbum(materialName, areaId) {
    return {
        tool: `Alat Sentra standar untuk ${materialName}`,
        steps: [
            `Siapkan alas kerja dan bawa material ${materialName} ke meja/karpet.`,
            `Lakukan demonstrasi perkenalan konsep secara bertahap kepada anak.`,
            `Ajak anak untuk mencoba memanipulasi alat secara mandiri.`,
            `Kembalikan alat ke rak setelah selesai digunakan.`
        ],
        error: "Anak dapat memverifikasi hasil akhir dengan kunci jawaban atau kesesuaian fisik alat.",
        videoUrl: "" // Empty for now
    };
}

const rawText = fs.readFileSync('pdf_extracted.txt', 'utf8');
const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

// Basic parsing logic based on headers found in the text
let structured = [];
let currentArea = null;

// This is a simplified parser for the extracted PDF structure
// We'll manualy map the sections since PDF extraction loses columns
const sections = {
    "Maths": { start: 6, end: 41 },
    "Geometry": { start: 42, end: 80 },
    "Language": { start: 81, end: 138 },
    "Grammar": { start: 139, end: 163 },
    "Biology": { start: 164, end: 191 },
    "History": { start: 193, end: 244 },
    "Geography": { start: 245, end: 280 }
};

const finalData = [];

for (const [title, bounds] of Object.entries(sections)) {
    const areaInfo = areasMap[title];
    const area = {
        id: areaInfo.id,
        name: areaInfo.name,
        shortName: title,
        icon: areaInfo.icon,
        color: areaInfo.color,
        bgColor: areaInfo.bgColor,
        subAreas: []
    };

    const areaLines = lines.slice(bounds.start, bounds.end);
    
    // In this PDF, Year 1, 2, 3 items are mixed. 
    // We will group them by Grade K1, K2, K3
    const categories = ["Umum (General)"];
    const subArea = { id: `${areaInfo.id}_BASE`, name: "Materi Inti", levels: [] };

    areaLines.forEach(line => {
        if (line.startsWith('•')) {
            const material = line.replace('•', '').trim();
            // Assign to K1, K2, or K3 randomly or sequentially for this demo
            // In a real scenario, we'd check line ranges
            const gradeIdx = Math.floor(Math.random() * 3) + 1; 
            const grade = `K${gradeIdx}`;
            
            subArea.levels.push({
                label: `${grade}: ${material}`,
                presentation: generateAlbum(material, areaInfo.id)
            });
        }
    });

    area.subAreas.push(subArea);
    finalData.push(area);
}

fs.writeFileSync('src/data/curriculum_cycle2.json', JSON.stringify(finalData, null, 2));
console.log('Processed curriculum into curriculum_cycle2.json');
