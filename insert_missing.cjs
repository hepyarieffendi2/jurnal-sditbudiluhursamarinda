const fs = require('fs');

let content = fs.readFileSync('src/data/areaSentraCycle2.js', 'utf8');

const missing = [
  {
    afterLabel: "K1: Asosiasi Jumlah & Simbol / Association of Quantity & Symbols",
    newBlock: `,
          { 
            label: 'K1-K2: Tata Letak Desimal Raksasa / The Large Decimal Layout (Bird\\'s Eye View)', 
            presentation: { 
              toolDisplay: "Golden Beads & Large Number Cards",
              toolsList: ["Golden Beads", "Number Cards"], 
              error: "Sistematis: Jika ada barisan kartu atau manik yang berantakan atau terlewat, ajak anak memeriksa barisan dari kolom satuan ke ribuan.",
              steps: []
            }
          }`
  },
  {
    afterLabel: "K1-K2: Penjumlahan Dinamis / Golden Beads - Dynamic Addition",
    newBlock: `,
          { 
            label: 'K2: Permainan Bank Kolaboratif / The Cooperative Bank Game (Multi-Addend Addition)', 
            presentation: { 
              toolDisplay: "Golden Beads, Small & Large Number Cards",
              toolsList: ["Golden Beads", "Number Cards"], 
              error: "Mekanis: Jika jumlah manik gabungan tidak cocok dengan gabungan kartu angka hasil di akhir transaksi, lakukan audit penukaran di Bank.",
              steps: []
            }
          }`
  },
  {
    afterLabel: "K3: Pembagian / Golden Beads - Division",
    newBlock: `,
          { 
            label: 'K3: Pembagian Dinamis dengan Sisa / Golden Beads - Dynamic Division with Remainder', 
            presentation: { 
              toolDisplay: "Golden Beads, Large & Small Number Cards, Skittles & Remainder Bowl",
              toolsList: ["Golden Beads", "Number Cards", "Skittles"], 
              error: "Logika: Sisa pembagian (manik yang tersisa di akhir) nilainya harus LEBIH KECIL daripada jumlah skittles (Divisor). Jika lebih besar, berarti pembagian belum selesai.",
              steps: []
            }
          }`
  }
];

function extractObject(str, startIndex) {
  let bracketCount = 0;
  let inString = false;
  let quoteChar = null;
  let i = startIndex;

  while (i < str.length) {
    const char = str[i];
    if (inString) {
      if (char === quoteChar && str[i - 1] !== '\\\\') {
        inString = false;
        quoteChar = null;
      }
    } else {
      if (char === '"' || char === "'") {
        inString = true;
        quoteChar = char;
      } else if (char === '{') {
        bracketCount++;
      } else if (char === '}') {
        bracketCount--;
        if (bracketCount === 0) {
          return { endIndex: i };
        }
      }
    }
    i++;
  }
  return null;
}

missing.forEach(m => {
  const labelIndex = content.indexOf("label: '" + m.afterLabel + "'");
  if (labelIndex === -1) {
    console.log("NOT FOUND afterLabel:", m.afterLabel);
    return;
  }
  
  // Find the start of the object containing this label
  let objStart = content.lastIndexOf('{', labelIndex);
  const result = extractObject(content, objStart);
  
  if (result) {
    // Check if it's already there
    const nextLabelMatch = content.substring(result.endIndex, result.endIndex + 200).match(/label:\s*'([^']+)'/);
    if (nextLabelMatch && nextLabelMatch[1] === m.newBlock.match(/label:\s*'([^']+)'/)[1]) {
      console.log("Already inserted:", nextLabelMatch[1]);
      return;
    }
    
    content = content.substring(0, result.endIndex + 1) + m.newBlock + content.substring(result.endIndex + 1);
    console.log("Inserted missing block after", m.afterLabel);
  }
});

fs.writeFileSync('src/data/areaSentraCycle2.js', content, 'utf8');
