import fs from 'fs';

async function check() {
  const code = fs.readFileSync('src/data/areaSentraCycle2.js', 'utf8');
  fs.writeFileSync('temp_eval.js', code);
  
  const module = await import('./temp_eval.js');
  const data = module.AREA_SENTRA_CYCLE2;
  const targetAreas = ['matematika', 'bahasa'];
  
  let totalLessons = 0;
  let minSteps = 999;
  let maxSteps = 0;
  let summary = [];

  for (const area of data) {
    if (targetAreas.includes(area.id)) {
      for (const subArea of area.subAreas) {
        for (const level of subArea.levels) {
          totalLessons++;
          const stepCount = level.presentation.steps.length;
          if (stepCount < minSteps) minSteps = stepCount;
          if (stepCount > maxSteps) maxSteps = stepCount;
          
          if (stepCount < 11 || stepCount > 25) {
             summary.push(`[${area.id}] ${subArea.name} - ${level.label}: ${stepCount} steps`);
          }
        }
      }
    }
  }
  
  console.log(`Total Math & Lang Lessons: ${totalLessons}`);
  console.log(`Min steps found: ${minSteps}, Max steps found: ${maxSteps}`);
  if (summary.length > 0) {
     console.log("Lessons outside 11-25 range:");
     console.log(summary.join('\n'));
  } else {
     console.log("ALL lessons in Math and Language meet the 11-25 steps standard.");
  }
  fs.unlinkSync('temp_eval.js');
}

check().catch(console.error);
