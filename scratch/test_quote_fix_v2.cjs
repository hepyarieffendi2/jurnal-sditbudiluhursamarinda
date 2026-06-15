const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_quotes_analysis.json'), 'utf8'));

function fixQuotes(str) {
  if (typeof str !== 'string') return str;
  
  let newStr = str;
  
  // 1. Replace known apostrophes
  const apostrophes = [
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
  
  apostrophes.forEach(r => {
    newStr = newStr.replace(r.pattern, r.replacement);
  });
  
  newStr = newStr.replace(/Al-An am/g, "Al-An’am");
  
  // 2. Replace specific quoted terms
  const terms = [
    "ekor", "memakan", "makan-memakan", "ular kebaikan",
    "Addition Control Chart", "Subtraction Control Chart", "Subtraction Table",
    "Multiplication Control Chart", "Division Control Chart",
    "lima kuadrat", "lima pangkat dua", "lima kubik", "lima pangkat tiga",
    "The Magic Slide", "Magic Slide", "Three Period Lesson", "Equivalence Control Chart",
    "Pembilang", "Penyebut", "keluarga", "satu setengah", "Matahari", "Tracer",
    "Garis Pandu Hitam", "Stereognostic"
  ];
  
  terms.forEach(t => {
    // Replace 'term' with "term"
    const regex = new RegExp(`'${t}'`, 'g');
    newStr = newStr.replace(regex, `"${t}"`);
  });
  
  return newStr;
}

let oddCountAfter = 0;
data.forEach((item) => {
  const original = item.val;
  const fixed = fixQuotes(original);
  
  const quoteCount = (fixed.match(/'/g) || []).length;
  if (quoteCount % 2 !== 0) {
    oddCountAfter++;
    console.log(`\nRemaining Odd Quote String #${oddCountAfter}:`);
    console.log(`  Path: ${item.path}`);
    console.log(`  Original: ${original}`);
    console.log(`  Fixed   : ${fixed}`);
    console.log(`  Quotes Count: ${quoteCount}`);
  }
});

console.log(`\nTotal strings with odd quotes remaining: ${oddCountAfter}`);
