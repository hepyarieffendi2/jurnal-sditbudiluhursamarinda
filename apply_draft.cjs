const fs = require('fs');

const draft = fs.readFileSync('draft_materi.txt', 'utf8');
let content = fs.readFileSync('src/data/areaSentraCycle2.js', 'utf8');

const blocks = draft.split(/(?=I\. PIJAKAN AWAL & PERSIAPAN)/);
console.log("Found " + blocks.length + " blocks starting with PIJAKAN AWAL");

for (let i = 0; i < blocks.length; i++) {
  const block = blocks[i];
  if (!block.includes('I. PIJAKAN AWAL')) continue;
  
  const lines = block.split('\n');
  const steps = [];
  let foundEnd = false;
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    if (line.startsWith('Prasyarat') || line.startsWith('Tujuan') || line.startsWith('Kontrol') || line.startsWith('PENGANGKATAN')) {
      foundEnd = true;
      break;
    }
    steps.push(line.trim());
  }
  
  if (steps.length === 0) continue;
  
  let labelMatcher = null;
  const fullText = block.toLowerCase();
  const blockStartIndex = draft.indexOf(block);
  const precedingText = draft.substring(Math.max(0, blockStartIndex - 200), blockStartIndex).toLowerCase();
  
  if (precedingText.includes('pengenalan jumlah') || precedingText.includes('introduction to quantity')) {
    labelMatcher = 'K1: Pengenalan Jumlah';
  } else if (precedingText.includes('simbol') && !precedingText.includes('asosiasi')) {
    labelMatcher = 'K1: Pengenalan Simbol';
  } else if (precedingText.includes('asosiasi jumlah dan simbol')) {
    labelMatcher = 'K1: Asosiasi Jumlah & Simbol';
  } else if (precedingText.includes("bird's eye view") || precedingText.includes("tata letak desimal raksasa")) {
    labelMatcher = 'K1-K2: Tata Letak Desimal Raksasa';
  } else if (precedingText.includes('permainan pertukaran') || precedingText.includes('exchange game')) {
    labelMatcher = 'K1-K2: Permainan Pertukaran';
  } else if (precedingText.includes('penjumlahan statis') || precedingText.includes('static addition')) {
    labelMatcher = 'K1-K2: Penjumlahan Statis';
  } else if (precedingText.includes('penjumlahan dinamis') || precedingText.includes('dynamic addition')) {
    labelMatcher = 'K1-K2: Penjumlahan Dinamis';
  } else if (precedingText.includes('permainan bank kolaboratif') || precedingText.includes('cooperative bank game')) {
    labelMatcher = 'K2: Permainan Bank Kolaboratif';
  } else if (precedingText.includes('pengurangan statis') || precedingText.includes('static subtraction')) {
    labelMatcher = 'K1-K2: Pengurangan Statis';
  } else if (precedingText.includes('pengurangan dinamis') || precedingText.includes('dynamic subtraction')) {
    labelMatcher = 'K1-K2: Pengurangan Dinamis';
  } else if (precedingText.includes('pembentukan angka') || precedingText.includes('magic slide')) {
    labelMatcher = 'K1: Pembentukan Angka';
  } else {
    if (fullText.includes('menjadi sesuatu yang sangat besar') && fullText.includes('1 unit, 1 batang sepuluh')) labelMatcher = 'K1: Pengenalan Jumlah';
    else if (fullText.includes('melihat bagaimana lambang atau tulisan angkanya') && fullText.includes('warna hijau')) labelMatcher = 'K1: Pengenalan Simbol';
    else if (fullText.includes('menggabungkan benda yang pernah kita raba dengan kartu angka pasangannya')) labelMatcher = 'K1: Asosiasi Jumlah & Simbol';
    else if (fullText.includes('menggelar sesuatu yang sangat besar dan panjang. kita akan butuh dua karpet besar')) labelMatcher = 'K1-K2: Tata Letak Desimal Raksasa';
    else if (fullText.includes('bermain peran. bunda akan menjadi petugas bank, dan kalian akan menukarkan barang')) labelMatcher = 'K1-K2: Permainan Pertukaran';
    else if (fullText.includes('apa yang terjadi jika dua kelompok barang digabungkan menjadi satu')) labelMatcher = 'K1-K2: Penjumlahan Statis';
    else if (fullText.includes('jumlah gabungannya akan sangat banyak sehingga kita perlu melakukan pertukaran di bank')) labelMatcher = 'K1-K2: Penjumlahan Dinamis';
    else if (fullText.includes('melakukan proyek penggabungan yang paling besar dari yang pernah kita lakukan')) labelMatcher = 'K2: Permainan Bank Kolaboratif';
    else if (fullText.includes('ambil sebagian untuk diberikan kepada orang lain')) labelMatcher = 'K1-K2: Pengurangan Statis';
    else if (fullText.includes('sehingga kita harus meminjam ke bank')) labelMatcher = 'K1-K2: Pengurangan Dinamis';
  }

  if (labelMatcher) {
    console.log("Matched block " + i + " to label: " + labelMatcher);
    let idx = content.indexOf(`label: '${labelMatcher}`);
    if (idx !== -1) {
      let stepsIdx = content.indexOf('steps: [', idx);
      if (stepsIdx !== -1) {
        let arrayStart = stepsIdx + 'steps: ['.length;
        let bracketCount = 1;
        let inString = false;
        let quoteChar = null;
        let j = arrayStart;
        while (j < content.length) {
          const char = content[j];
          if (inString) {
            if (char === quoteChar && content[j - 1] !== '\\\\') {
              inString = false;
            }
          } else {
            if (char === '"' || char === "'") {
              inString = true;
              quoteChar = char;
            } else if (char === '[') {
              bracketCount++;
            } else if (char === ']') {
              bracketCount--;
              if (bracketCount === 0) {
                let newSteps = JSON.stringify(steps, null, 2).split('\n').map((l, i) => i === 0 ? l : '              ' + l).join('\n');
                content = content.substring(0, arrayStart - 1) + newSteps + content.substring(j + 1);
                console.log("  -> Successfully updated steps for " + labelMatcher);
                break;
              }
            }
          }
          j++;
        }
      }
    } else {
      console.log("  -> WARNING: Label not found in file: " + labelMatcher);
    }
  } else {
    console.log("Could not match block " + i);
  }
}

fs.writeFileSync('src/data/areaSentraCycle2.js', content, 'utf8');
console.log("Finished applying draft!");
