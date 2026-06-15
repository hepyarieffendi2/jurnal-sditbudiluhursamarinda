const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, 'backup_matematika.json');
const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

const stampGameArea = data.subAreas.find(sa => sa.id === 'math_stamp_game');

if (stampGameArea) {
  stampGameArea.levels.forEach((l, i) => {
    console.log(`Level ${i + 1}: ${l.label} -> Video: ${l.presentation?.videoUrl || 'none'}`);
  });
}
