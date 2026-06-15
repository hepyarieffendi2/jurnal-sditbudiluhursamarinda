const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/CurriculumManager.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log("=== SEARCHING GRADE FILTER LOGIC IN CURRICULUM MANAGER ===");
lines.forEach((line, idx) => {
  if (line.includes("GradeFilter") || line.includes("gradeFilter") || line.includes("grades.includes") || line.includes("activeGradeFilter")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
