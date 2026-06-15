import { AREA_SENTRA_CYCLE2 } from '../src/data/areaSentraCycle2.js';

console.log("=== AREA_SENTRA_CYCLE2 MATH SUB-AREAS ===");
const mathArea = AREA_SENTRA_CYCLE2.find(a => a.id === 'matematika');
if (mathArea && mathArea.subAreas) {
  mathArea.subAreas.forEach((sub, idx) => {
    console.log(`\n[${idx + 1}] ${sub.id} (${sub.name}) - ${sub.levels?.length || 0} levels`);
  });
} else {
  console.log("No Matematika area found in AREA_SENTRA_CYCLE2!");
}
process.exit(0);
