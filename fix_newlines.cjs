const fs = require('fs');
let content = fs.readFileSync('src/data/areaSentraCycle2.js', 'utf8');

// Replace literal "\n that was incorrectly inserted by update_multi_div.cjs
content = content.replace(/"\\n              ]/g, '"\n              ]');
content = content.replace(/steps: \["\\n/g, 'steps: ["\n');

fs.writeFileSync('src/data/areaSentraCycle2.js', content, 'utf8');
console.log('Fixed literal newlines');
