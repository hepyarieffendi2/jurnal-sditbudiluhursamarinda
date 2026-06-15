const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_quotes_analysis.json'), 'utf8'));

function fixQuotes(str) {
  if (typeof str !== 'string') return str;
  
  // 1. Replace known apostrophes
  let newStr = str;
  const replacements = [
    { pattern: /Al-Ma'idah/g, replacement: "Al-Ma’idah" },
    { pattern: /Al-An'am/g, replacement: "Al-An’am" },
    { pattern: /Al-A'raf/g, replacement: "Al-A’raf" },
    { pattern: /Ali 'Imran/g, replacement: "Ali ’Imran" },
    { pattern: /Al-Qur'an/g, replacement: "Al-Qur’an" },
    { pattern: /Qur'an/g, replacement: "Qur’an" },
    { pattern: /Al-Qari'ah/g, replacement: "Al-Qari’ah" },
    { pattern: /Al-Isra'/g, replacement: "Al-Isra’" },
    { pattern: /Isra'/g, replacement: "Isra’" },
    { pattern: /Mi'raj/g, replacement: "Mi’raj" },
    { pattern: /Ka'bah/g, replacement: "Ka’bah" },
    { pattern: /Ar-Ra'd/g, replacement: "Ar-Ra’d" },
    { pattern: /rabbil 'alamin/gi, replacement: "rabbil ’alamin" },
    { pattern: /rabbil 'alamiin/gi, replacement: "rabbil ’alamiin" },
    { pattern: /rabbil 'aalamiin/gi, replacement: "rabbil ’aalamiin" },
    { pattern: /Bird's/g, replacement: "Bird’s" },
    { pattern: /Montessori's/g, replacement: "Montessori’s" },
    { pattern: /child's/g, replacement: "child’s" }
  ];
  
  replacements.forEach(r => {
    newStr = newStr.replace(r.pattern, r.replacement);
  });
  
  newStr = newStr.replace(/Al-An am/g, "Al-An’am");
  
  // 2. Fix direct speech vs other single quotes
  const colonQuoteIndex = newStr.indexOf(": '");
  if (colonQuoteIndex === -1) {
    // No direct speech prefix, so replace all remaining single quotes with double quotes
    newStr = newStr.replace(/'/g, '"');
  } else {
    // Direct speech starts at colonQuoteIndex + 2
    const openPos = colonQuoteIndex + 2;
    const closePos = newStr.indexOf("'", openPos + 1);
    
    if (closePos === -1) {
      // Unmatched single quote
      // Just replace all quotes except openPos
      let chars = newStr.split('');
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] === "'" && i !== openPos) {
          chars[i] = '"';
        }
      }
      newStr = chars.join('');
    } else {
      // Replace all quotes except at openPos and closePos
      let chars = newStr.split('');
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] === "'" && i !== openPos && i !== closePos) {
          chars[i] = '"';
        }
      }
      newStr = chars.join('');
    }
  }
  
  return newStr;
}

let changedCount = 0;
data.forEach((item, idx) => {
  const original = item.val;
  const fixed = fixQuotes(original);
  
  if (original !== fixed) {
    changedCount++;
    if (changedCount <= 50) {
      console.log(`\n#${changedCount} Path: ${item.path}`);
      console.log(`  Original : ${original}`);
      console.log(`  Fixed    : ${fixed}`);
    }
  }
});

console.log(`\nTotal changed strings: ${changedCount} / ${data.length}`);
