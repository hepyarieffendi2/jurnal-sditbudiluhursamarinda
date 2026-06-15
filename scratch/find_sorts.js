import { readFileSync } from 'fs';

const content = readFileSync('src/pages/CurriculumManager.jsx', 'utf8');
const regex = /\.sort\(/g;
let match;
console.log("=== .sort( OCCURRENCES IN CurriculumManager.jsx ===");
while ((match = regex.exec(content)) !== null) {
  const index = match.index;
  const start = Math.max(0, index - 80);
  const end = Math.min(content.length, index + 80);
  const lineNum = content.substring(0, index).split('\n').length;
  console.log(`Line ${lineNum}: ...${content.substring(start, end).replace(/\n/g, ' ')}...`);
}
process.exit(0);
