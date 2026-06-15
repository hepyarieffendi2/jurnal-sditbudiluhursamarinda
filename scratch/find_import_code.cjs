const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/CurriculumManager.jsx');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

const term = 'handleExecuteImport';
lines.forEach((line, idx) => {
  if (line.includes(term)) {
    console.log(`Match at line ${idx + 1}:`);
    for (let i = Math.max(0, idx - 10); i < Math.min(lines.length, idx + 40); i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
});
