const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_quotes_analysis.json'), 'utf8'));

console.log("=== CHECKING QUOTES THAT ARE NOT PRECEDED BY COLON AND SPACE ===");

let count = 0;
data.forEach(item => {
  const str = item.val;
  
  // Find all matches of '...' in the string
  // Let's look for any ' that doesn't have ': ' before it, unless it's the closing quote
  // We can do this by checking occurrences of '
  let pos = -1;
  while ((pos = str.indexOf("'", pos + 1)) !== -1) {
    // Check if this single quote is preceded by ': '
    const isPreceded = pos >= 2 && str.substring(pos - 2, pos) === ': ';
    
    // Check if this single quote is an apostrophe or closing quote
    // Let's print the surrounding context of this quote
    const start = Math.max(0, pos - 15);
    const end = Math.min(str.length, pos + 15);
    const context = str.substring(start, end);
    
    if (!isPreceded) {
      // It's not preceded by ': '. Let's see what it is.
      // If it's surrounded by letters, it's an apostrophe (like Al-Ma'idah)
      const prevChar = pos > 0 ? str[pos - 1] : '';
      const nextChar = pos < str.length - 1 ? str[pos + 1] : '';
      const isWordApostrophe = /[a-zA-Z]/.test(prevChar) && /[a-zA-Z]/.test(nextChar);
      
      // Let's also check if it's the closing quote of a ': ' block
      // We can check if there's a ': '' earlier in the string
      const beforeStr = str.substring(0, pos);
      const openQuotePos = beforeStr.lastIndexOf(": '");
      const isClosingQuote = openQuotePos !== -1 && !beforeStr.substring(openQuotePos + 3).includes("'");
      
      if (!isWordApostrophe && !isClosingQuote) {
        console.log(`\nPath: ${item.path}`);
        console.log(`Context: ... ${context} ...`);
        console.log(`Full text: ${str}`);
        count++;
      }
    }
  }
});

console.log(`\nTotal potentially non-standard quotes: ${count}`);
