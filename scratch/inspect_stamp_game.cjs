const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, 'backup_matematika.json');
const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

const stampGameArea = data.subAreas.find(sa => sa.id === 'math_stamp_game');

if (stampGameArea) {
  console.log(`Found Stamp Game area: ${stampGameArea.name}`);
  console.log(`Total levels: ${stampGameArea.levels.length}`);
  
  stampGameArea.levels.forEach((l, i) => {
    console.log(`\n==================================================`);
    console.log(`Level ${i + 1}: ${l.label}`);
    console.log(`Grades: ${JSON.stringify(l.grades)}`);
    console.log(`Tool: ${l.presentation?.tool || l.presentation?.toolDisplay}`);
    console.log(`Prerequisites: ${l.presentation?.prerequisites || ''}`);
    console.log(`Direct Aim: ${l.presentation?.directAim || ''}`);
    console.log(`Indirect Aim: ${l.presentation?.indirectAim || ''}`);
    console.log(`Error Control: ${l.presentation?.error || ''}`);
    console.log(`Steps count: ${l.presentation?.steps?.length || 0}`);
    console.log(`Sample Steps (1-8):`);
    if (l.presentation?.steps) {
      l.presentation.steps.slice(0, 8).forEach(s => console.log(`  - ${s}`));
    }
  });
} else {
  console.log('math_stamp_game sub-area not found in backup!');
}
