const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'CurriculumManager.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const target = '            <style>{`';
const firstIdx = content.indexOf(target);
if (firstIdx === -1) {
    console.error('Could not find the first occurrence of the style tag');
    process.exit(1);
}

const secondIdx = content.indexOf(target, firstIdx + target.length);
if (secondIdx === -1) {
    console.error('Could not find the second occurrence of the style tag');
    process.exit(1);
}

console.log(`Found first style tag at index ${firstIdx}, second style tag at index ${secondIdx}`);

// Let's verify what the text looks like right before and after
console.log('Text before first style tag:\n', content.slice(firstIdx - 150, firstIdx));
console.log('Text around second style tag:\n', content.slice(secondIdx - 150, secondIdx + 50));

const newContent = content.slice(0, firstIdx) + content.slice(secondIdx);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('File successfully updated!');
