const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/pages/CurriculumManager.jsx');
const content = fs.readFileSync(targetFile, 'utf8');

const targetMarkerStart = '// --- ONE-TIME GREAT LESSONS MIGRATION ---';
const targetMarkerEnd = '}, [loading, curriculum]);';

const startIdx = content.indexOf(targetMarkerStart);
if (startIdx === -1) {
  console.log("Migration marker start not found, file is already clean or different!");
  process.exit(0);
}

const endIdx = content.indexOf(targetMarkerEnd, startIdx);
if (endIdx === -1) {
  console.log("Error: Migration marker end not found!");
  process.exit(1);
}

const removalLength = endIdx + targetMarkerEnd.length - startIdx;
const originalSlice = content.substring(startIdx, startIdx + removalLength);

const newContent = content.replace(originalSlice, '');

fs.writeFileSync(targetFile, newContent, 'utf8');
console.log("Successfully removed the Great Lessons migration hook from CurriculumManager.jsx!");
