const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/areaSentraCycle2.js');
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
      if (isK1) {
        l.presentation.toolsList?.forEach(t => result[areaName].k1.add(t));
      }
      if (isK2) {
        l.presentation.toolsList?.forEach(t => result[areaName].k2.add(t));
      }
    });
  });
});

Object.keys(result).forEach(k => {
  result[k].k1 = Array.from(result[k].k1).sort();
  result[k].k2 = Array.from(result[k].k2).sort();
});

console.log(JSON.stringify(result, null, 2));
