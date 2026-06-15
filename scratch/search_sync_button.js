import { readFileSync } from 'fs';

const content = readFileSync('src/pages/CurriculumManager.jsx', 'utf8');
const lines = content.split('\n');

console.log("=== SCANNING FOR seedCycle2 OR SYNC BUTTONS ===");
lines.forEach((line, idx) => {
  if (line.includes('seedCycle2') || line.includes('selaras') || line.includes('Wand2') || line.includes('AIGuide') || line.includes('Sync')) {
    if (line.length < 160) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
process.exit(0);
