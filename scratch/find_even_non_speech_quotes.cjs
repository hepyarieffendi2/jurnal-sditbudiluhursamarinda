const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, 'backup_bahasa.json');
if (!fs.existsSync(backupPath)) {
  console.log("backup_bahasa.json not found!");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

data.subAreas.forEach(sa => {
  sa.levels.forEach(l => {
    if (l.presentation && l.presentation.steps) {
      l.presentation.steps.forEach(step => {
        // Find single quotes inside words, e.g., letter'letter or letter\'letter
        const wordQuoteMatches = step.match(/\w\\?'\w/g);
        if (wordQuoteMatches) {
          console.log(`[WORD QUOTE] ${l.label} -> "${step}" (Found: ${wordQuoteMatches.join(', ')})`);
        }
        
        // Find other potential issues, like stray quotes at the end of word: e.g. Rasulullah.',
        if (step.includes("',") || step.includes("'.") || step.includes("';")) {
          console.log(`[STRAY QUOTE] ${l.label} -> "${step}"`);
        }
      });
    }
  });
});
