const fs = require('fs');

let content = fs.readFileSync('src/data/areaSentraCycle2.js', 'utf8');

// We have 6 broken blocks.
// They look like this:
//   "23. Guru mengucapkan kalimat penutup kepada murid: 'Alhamdulillahi jaza kumullohu khoiro.' [Berkesadaran]"
// ]",
//   "1. Memulai dengan membaca Basmalah bersama anak-anak.",
// ...
//   "22. Ucapkan kepada murid: Alhamdulillahi jaza kumullohu khoiro."
// ]
// We need to remove from `]",` up to the next `\n              ]` (inclusive) and replace with just `\n              ]`

let matches = 0;
content = content.replace(/\]\",[\s\S]*?\]/g, (match) => {
    matches++;
    return "]";
});

console.log("Fixed " + matches + " blocks");
fs.writeFileSync('src/data/areaSentraCycle2.js', content, 'utf8');
