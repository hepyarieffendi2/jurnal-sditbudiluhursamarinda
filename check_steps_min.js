import fs from 'fs';

async function check() {
  const code = fs.readFileSync('src/data/areaSentraCycle2.js', 'utf8');
  fs.writeFileSync('temp_eval.js', code);
  
  const module = await import('./temp_eval.js');
  const data = module.AREA_SENTRA_CYCLE2;
  const targetAreas = ['matematika', 'bahasa'];
  
  let summary = [];

  for (const area of data) {
    if (targetAreas.includes(area.id)) {
      for (const subArea of area.subAreas) {
        for (const level of subArea.levels) {
          const stepCount = level.presentation.steps.length;
          // Remember: the raw array contains 5 descriptive Roman numeral headings
          // So an array length of 15 means only 10 actual numbered steps. We want length >= 16 to guarantee >= 11 actual steps.
          if (stepCount < 16) {
             summary.push(`[${area.id}] ${subArea.name} - ${level.label}: ${stepCount} items (${stepCount - 5} steps)`);
          }
        }
      }
    }
  }
  
  if (summary.length > 0) {
     console.log("Lessons with LESS than 11 numbered steps (< 16 items in array):");
     console.log(summary.join('\n'));
  } else {
     console.log("SUCCESS: ALL lessons in Math and Language meet the >= 11 steps standard!");
  }
  fs.unlinkSync('temp_eval.js');
}

check().catch(console.error);
