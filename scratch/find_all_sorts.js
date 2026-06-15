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

const allFiles = walkDir('src');

console.log("=== SCANNING FOR .sort( IN SRC/ ===");
allFiles.forEach(file => {
  const content = readFileSync(file, 'utf8');
  if (content.includes('.sort(')) {
    console.log(`\nFile: ${file}`);
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('.sort(')) {
        console.log(`  Line ${idx + 1}: ${line.trim()}`);
      }
    });
  }
});
process.exit(0);
