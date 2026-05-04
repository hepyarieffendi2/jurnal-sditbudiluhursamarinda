const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/data/areaSentraCycle2.js');
let content = fs.readFileSync(filePath, 'utf8');
content = content.replace('export const AREA_SENTRA_CYCLE2 =', 'module.exports =');

const data = eval(content);
const result = {};

data.forEach(a => {
  const areaName = a.name;
  if (!result[areaName]) {
    result[areaName] = { k1: new Set(), k2: new Set() };
  }
  a.subAreas.forEach(s => {
    s.levels.forEach(l => {
      const isK1 = l.label.includes('K1');
      const isK2 = l.label.includes('K2');
      
      const p = l.presentation || {};
      const tools = new Set();
      
      // Collect from toolsList
      if (p.toolsList) {
        p.toolsList.forEach(t => tools.add(t.trim()));
      }
      
      // Collect from toolDisplay as fallback or additional
      if (p.toolDisplay) {
        // Split by comma or slash
        p.toolDisplay.split(/[,/]/).forEach(t => {
            const cleaned = t.trim().replace(/\(.*\)/, '').trim();
            if (cleaned) tools.add(cleaned);
        });
      }

      if (isK1) {
        tools.forEach(t => result[areaName].k1.add(t));
      }
      if (isK2) {
        tools.forEach(t => result[areaName].k2.add(t));
      }
    });
  });
});

Object.keys(result).forEach(k => {
  result[k].k1 = Array.from(result[k].k1).sort();
  result[k].k2 = Array.from(result[k].k2).sort();
});

console.log(JSON.stringify(result, null, 2));
