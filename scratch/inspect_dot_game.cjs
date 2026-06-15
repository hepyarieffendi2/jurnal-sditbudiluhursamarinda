const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, 'backup_matematika_before_quotes_fix.json');
if (!fs.existsSync(backupPath)) {
  console.error("Backup file not found!");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
const dotSub = data.subAreas.find(sa => sa.id === 'math_dot_game');

if (dotSub) {
  console.log(`Sub-area: ${dotSub.id} (${dotSub.title})`);
  console.log(`Levels count: ${dotSub.levels.length}`);
  dotSub.levels.forEach((l, idx) => {
    console.log(`\nLevel ${idx + 1}: ${l.label}`);
    console.log(`Grades: ${JSON.stringify(l.grades)}`);
    console.log(`Tools: ${l.presentation?.tool || 'none'}`);
    console.log(`Prerequisites: ${l.presentation?.prerequisites || 'none'}`);
    console.log(`Direct Aim: ${l.presentation?.directAim || 'none'}`);
    console.log(`Indirect Aim: ${l.presentation?.indirectAim || 'none'}`);
    console.log(`Error: ${l.presentation?.error || 'none'}`);
    console.log(`Steps count: ${l.presentation?.steps?.length || 0}`);
    console.log("Steps:");
    l.presentation?.steps?.forEach((s, sIdx) => {
      console.log(`  ${sIdx + 1}. ${s}`);
    });
  });
} else {
  console.log("Sub-area math_dot_game not found in backup.");
}
