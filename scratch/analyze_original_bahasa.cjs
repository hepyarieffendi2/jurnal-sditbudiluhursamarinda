const fs = require('fs');

try {
  const bahasaData = JSON.parse(fs.readFileSync('scratch/backup_bahasa.json', 'utf8'));
  
  let samplePres = null;
  if (bahasaData.subAreas && bahasaData.subAreas.length > 4) { 
       for (const level of bahasaData.subAreas[4].levels || []) { 
           if (level.presentation && level.presentation.steps && level.presentation.steps.length > 0) {
               samplePres = level.presentation;
               break;
           }
       }
  }

  console.log("=== ORIGINAL BAHASA STEPS ===");
  if (samplePres) {
      console.log(JSON.stringify(samplePres.steps, null, 2));
  }
} catch (e) {
  console.error(e);
}
