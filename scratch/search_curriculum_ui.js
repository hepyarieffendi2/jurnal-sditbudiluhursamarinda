import { readFileSync } from 'fs';

const content = readFileSync('src/pages/CurriculumManager.jsx', 'utf8');
const lines = content.split('\n');

console.log("=== SCANNING FOR GRADE FILTERS ===");
lines.forEach((line, idx) => {
  if (line.includes('activeGradeFilter') || line.includes('K1') || line.includes('K2') || line.includes('K3') || line.includes('Kelas')) {
    if (line.length < 150) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
process.exit(0);
