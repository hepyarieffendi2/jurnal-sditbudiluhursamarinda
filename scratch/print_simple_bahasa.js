const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, 'backup_bahasa.json');
if (!fs.existsSync(backupPath)) {
  console.log("backup_bahasa.json not found!");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

data.subAreas.forEach((sa, i) => {
  console.log(`${i + 1}. Sub-area ID: ${sa.id} | Name: ${sa.name || sa.title}`);
  if (sa.levels) {
    sa.levels.forEach((l, idx) => {
      console.log(`   - Level ${idx + 1}: ${l.label}`);
    });
  } else {
    console.log(`   - (No levels)`);
  }
});
