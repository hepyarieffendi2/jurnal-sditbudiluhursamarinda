const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_quotes_analysis.json'), 'utf8'));

const suspectPatterns = [
  "ekor'", "memakan'", "kebaikan'", "Chart'", "Table'", "kuadrat'", "kubik'",
  "Slide'", "Pembilang'", "Penyebut'", "keluarga'", "setengah'", "Lesson'", "Matahari'"
];

console.log("=== INSPECTING SUSPECT PATTERNS AND TYPOS ===");
data.forEach(item => {
  const str = item.val;
  const hasSuspect = suspectPatterns.some(p => str.includes(p));
  const quoteCount = (str.match(/'/g) || []).length;
  
  if (hasSuspect || quoteCount % 2 !== 0) {
    // Only print if it contains suspect pattern or has odd quote count
    // and is not just a standard rabbil 'alamin / Al-Ma'idah (which we already know)
    const isStandard = !hasSuspect && (
      (str.includes("rabbil 'alamin") || str.includes("Al-Ma'idah") || str.includes("Al-An'am") || str.includes("Al-Qur'an") || str.includes("Bird's") || str.includes("Ar-Ra'd")) && 
      (quoteCount === 3 || quoteCount === 1)
    );
    
    if (!isStandard || hasSuspect) {
      console.log(`\nPath: ${item.path} (Quotes: ${quoteCount})`);
      console.log(`Text: ${str}`);
    }
  }
});
