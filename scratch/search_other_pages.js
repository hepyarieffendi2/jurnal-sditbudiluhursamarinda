import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function walkDir(dir, files = []) {
  const list = readdirSync(dir);
  list.forEach(file => {
    const path = join(dir, file);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walkDir(path, files);
    } else if (path.endsWith('.js') || path.endsWith('.jsx')) {
      files.push(path);
    }
  });
  return files;
}

const allFiles = walkDir('src/pages');

console.log("=== SCANNING FOR K1, K2, K3 ARRAYS ===");
allFiles.forEach(file => {
  const content = readFileSync(file, 'utf8');
  if (content.includes('K1') || content.includes('K2') || content.includes('K3')) {
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if ((line.includes('K1') && line.includes('K2') && line.includes('K3')) || line.includes("['Semua'")) {
        console.log(`${file} (Line ${idx + 1}): ${line.trim()}`);
      }
    });
  }
});
process.exit(0);
