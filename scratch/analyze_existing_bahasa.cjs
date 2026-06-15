const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, 'backup_bahasa.json');
if (!fs.existsSync(backupPath)) {
  console.log("backup_bahasa.json not found!");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

let report = "";

data.subAreas.forEach(sa => {
  report += `\n========================================\n`;
  report += `Sub-area: ${sa.id} (${sa.name})\n`;
  report += `========================================\n`;
  
  if (sa.levels) {
    sa.levels.forEach((l, idx) => {
      report += `\nLevel ${idx + 1}: ${l.label}\n`;
      if (l.presentation) {
        report += `  - Tool Display: ${l.presentation.toolDisplay || 'None'}\n`;
        report += `  - Tools List: ${JSON.stringify(l.presentation.toolsList || [])}\n`;
        report += `  - Error: ${l.presentation.error || 'None'}\n`;
        report += `  - Steps:\n`;
        if (l.presentation.steps) {
          l.presentation.steps.forEach(step => {
            report += `    * ${step}\n`;
          });
        }
      }
    });
  }
});

fs.writeFileSync(path.join(__dirname, 'bahasa_analysis_raw.txt'), report, 'utf8');
console.log("Analysis saved to scratch/bahasa_analysis_raw.txt");
