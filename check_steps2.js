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
             summary.push({
               area: area.id,
               subArea: subArea.name,
               lesson: level.label,
               steps: stepCount
             });
          }
        }
      }
    }
  }
  
  const result = { totalLessons, minSteps, maxSteps, outOfRange: summary };
  fs.writeFileSync('check_results.json', JSON.stringify(result, null, 2), 'utf8');
}

check().catch(console.error);
