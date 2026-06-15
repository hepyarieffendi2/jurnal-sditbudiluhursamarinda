const fs = require('fs');

try {
  const mathData = JSON.parse(fs.readFileSync('scratch/math_firestore_full.json', 'utf8'));
  let beadGamePres = null;
  
  if (mathData.subAreas) {
      for (const sub of mathData.subAreas) {
          for (const level of sub.levels || []) {
              if (level.label.toLowerCase().includes('permainan manik') || level.label.toLowerCase().includes('bead')) {
                  beadGamePres = level.presentation;
                  break;
              }
          }
      }
  }

  console.log("=== MATH BEAD GAME STEPS ===");
  if (beadGamePres && beadGamePres.steps) {
      beadGamePres.steps.forEach((step, idx) => {
          console.log(`Step ${idx}: ${step}`);
      });
  } else {
      console.log("Bead game steps not found.");
  }
} catch (e) {
  console.error(e);
}
