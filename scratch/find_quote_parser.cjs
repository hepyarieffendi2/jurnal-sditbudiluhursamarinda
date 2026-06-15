const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/CurriculumManager.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes("'") && (line.includes("split") || line.includes("replace") || line.includes("regex") || line.includes("match"))) {
    if (line.includes("step") || line.includes("render") || line.includes("quote")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
  if (line.includes("kalimat") || line.includes("langsung") || line.includes("bubble") || line.includes("dialog")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
