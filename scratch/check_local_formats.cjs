const fs = require('fs');

try {
  const mathData = JSON.parse(fs.readFileSync('scratch/math_firestore_full.json', 'utf8'));
  const bahasaData = JSON.parse(fs.readFileSync('scratch/backup_bahasa.json', 'utf8')); // Wait, backup_bahasa is before or after migration? Let's check from DB.
  
  let beadGamePres = null;
  let stampGamePres = null;
  
  if (mathData.subAreas) {
      for (const sub of mathData.subAreas) {
          for (const level of sub.levels || []) {
              if (level.label.toLowerCase().includes('permainan manik') || level.label.toLowerCase().includes('bead')) {
                  beadGamePres = level.presentation;
              }
              if (level.label.toLowerCase().includes('permainan perangko') || level.label.toLowerCase().includes('stamp')) {
                  stampGamePres = level.presentation;
              }
          }
      }
  }

  console.log("=== MATH STAMP GAME FORMAT ===");
  if (stampGamePres && stampGamePres.steps) {
      console.log(JSON.stringify(stampGamePres.steps, null, 2).substring(0, 800) + "...");
  } else {
      console.log("Stamp game steps not found.");
  }
} catch (e) {
  console.error(e);
}
