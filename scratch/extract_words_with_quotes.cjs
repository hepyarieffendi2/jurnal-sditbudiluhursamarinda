const fs = require('fs');
const path = require('path');

const analysisPath = path.join(__dirname, 'all_quotes_analysis.json');
if (!fs.existsSync(analysisPath)) {
  console.log("Analysis file not found!");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));

// We want to find cases of single quotes that are inside words or names,
// e.g. Al-Ma'idah, Al-An'am, Al-Qur'an, rabbil 'alamin, Ka'bah, do'a, etc.
// Let's look for match patterns.
const uniqueWords = new Set();
const oddQuoteStrings = [];

data.forEach(item => {
  const str = item.val;
  // Match words like Al-Ma'idah, Al-An'am, Al-Qur'an, do'a
  const wordMatches = str.match(/([a-zA-Z]+'[a-zA-Z]+|[a-zA-Z]+'[a-zA-Z]+'[a-zA-Z]+|[a-zA-Z]+'\s+[a-zA-Z]+)/g);
  if (wordMatches) {
    wordMatches.forEach(w => uniqueWords.add(w));
  }
  
  // Also check for specific words manually
  const specificWords = ["rabbil 'alamin", "Al-Qur'an", "Al-An'am", "Al-Ma'idah", "Ka'bah", "do'a", "da'wah", "Mi'raj", "Isra'", "Isra' Mi'raj", "Al-Qari'ah"];
  specificWords.forEach(w => {
    if (str.toLowerCase().includes(w.toLowerCase())) {
      uniqueWords.add(w);
    }
  });

  // Count number of single quotes in this string
  const quoteCount = (str.match(/'/g) || []).length;
  if (quoteCount % 2 !== 0) {
    oddQuoteStrings.push({ path: item.path, val: str, count: quoteCount });
  }
});

console.log("--- UNIQUE WORDS/PHRASES WITH SINGLE QUOTE ---");
console.log(Array.from(uniqueWords));

console.log(`\n--- STRINGS WITH ODD NUMBER OF SINGLE QUOTES (${oddQuoteStrings.length}) ---`);
oddQuoteStrings.slice(0, 30).forEach((item, idx) => {
  console.log(`\n#${idx + 1} Path: ${item.path}`);
  console.log(`  Value: ${item.val}`);
});
