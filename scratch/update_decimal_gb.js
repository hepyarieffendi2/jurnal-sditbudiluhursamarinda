import fs from 'fs';
import path from 'path';

const filePath = 'd:/Coding AI/jurnal-sditbudiluhursamarinda/src/data/areaSentraCycle2.js';

function findStepsArrays(section) {
  const matches = [];
  let pos = 0;
  while (true) {
    const startIdx = section.indexOf("steps: [", pos);
    if (startIdx === -1) break;
    
    const contentStart = startIdx + "steps: [".length;
    
    let bracketCount = 1;
    let inString = false;
    let quoteChar = null;
    let i = contentStart;
    
    while (i < section.length && bracketCount > 0) {
      const char = section[i];
      if (inString) {
        // Handle escaped quotes
        if (char === quoteChar && section[i - 1] !== '\\') {
          inString = false;
          quoteChar = null;
        }
      } else {
        if (char === '"' || char === "'") {
          inString = true;
          quoteChar = char;
        } else if (char === '[') {
          bracketCount++;
        } else if (char === ']') {
          bracketCount--;
        }
      }
      i++;
    }
    
    const endIdx = i - 1; // position of the matching ']'
    const full = section.substring(startIdx, i);
    const content = section.substring(contentStart, endIdx);
    
    matches.push({
      full,
      content,
      index: startIdx,
      endIdx: i
    });
    
    pos = i;
  }
  return matches;
}

function main() {
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the sub-area math_decimal_gb
  const startIdx = content.indexOf("id: 'math_decimal_gb'");
  if (startIdx === -1) {
    console.error("Could not find math_decimal_gb sub-area");
    return;
  }

  // Find the next sub-area to bound our search
  const endIdx = content.indexOf("id: 'math_stamp_game'");
  if (endIdx === -1) {
    console.error("Could not find math_stamp_game sub-area");
    return;
  }

  // Extract the decimal section
  let decimalSection = content.substring(startIdx, endIdx);

  // We will find each levels block
  const matches = findStepsArrays(decimalSection);

  console.log(`Found ${matches.length} levels with steps inside math_decimal_gb`);

  // Process from last to first so indices don't shift in the string
  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    let stepsLines = m.content.split('\n');
    let newLines = [];
    let foundPenutup = false;
    let penutupNum = -1;

    for (let j = 0; j < stepsLines.length; j++) {
      let line = stepsLines[j];
      
      if (line.includes('V. KEGIATAN PENUTUP')) {
        foundPenutup = true;
        // Replace with the updated header
        const quoteChar = line.includes('"') ? '"' : "'";
        line = line.replace(/V\. KEGIATAN PENUTUP: \[Menyenangkan\]/, `V. KEGIATAN PENUTUP: [Menyenangkan] - KERJA MANDIRI`);
        newLines.push(line);

        // Find the number for the next step by looking ahead
        let nextStepNum = -1;
        for (let k = j + 1; k < stepsLines.length; k++) {
          const mNext = stepsLines[k].match(/["'](\d+)\.\s/);
          if (mNext) {
            nextStepNum = parseInt(mNext[1], 10);
            break;
          }
        }

        if (nextStepNum !== -1) {
          penutupNum = nextStepNum;
          // Insert the new transition step
          const indent = stepsLines[j].match(/^(\s*)/)[1];
          const newStep = `${indent}${quoteChar}${penutupNum}. Undang anak untuk melanjutkan eksplorasi secara mandiri: 'Apakah kamu ingin mencobanya sendiri?' Jika anak ingin lanjut bekerja secara mandiri, biarkan ia memanipulasi alat. Jika sudah tuntas atau memilih menyimpannya, tuntun untuk merapikannya.${quoteChar},`;
          newLines.push(newStep);
        } else {
          console.error(`Could not find next step number for level ${i + 1}`);
        }
        continue;
      }

      if (foundPenutup && penutupNum !== -1) {
        // Renumber the steps after the insertion
        const matchNum = line.match(/(["'])(\d+)\.\s/);
        if (matchNum) {
          const quoteChar = matchNum[1];
          const currentNum = parseInt(matchNum[2], 10);
          const newNum = currentNum + 1;
          line = line.replace(/(["'])\d+\.\s/, `${quoteChar}${newNum}. `);
        }
      }

      newLines.push(line);
    }

    if (foundPenutup) {
      const replacement = `steps: [${newLines.join('\n')}]`;
      // Replace in decimalSection
      decimalSection = decimalSection.substring(0, m.index) + replacement + decimalSection.substring(m.index + m.full.length);
    }
  }

  // Put the modified decimal section back into the full content
  content = content.substring(0, startIdx) + decimalSection + content.substring(endIdx);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Successfully updated all math_decimal_gb levels with independent work transition steps!");
}

main();
