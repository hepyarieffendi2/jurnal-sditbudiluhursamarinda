const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'areaSentraCycle2.js');
const content = fs.readFileSync(filePath, 'utf8');

// We want to find the mathematical and geometry sections
// The math section starts with id: 'matematika'
const mathStartIndex = content.indexOf("id: 'matematika'");
if (mathStartIndex === -1) {
    console.error("Could not find math section");
    process.exit(1);
}

// Let's get the content from 'matematika' onwards
const mathContent = content.substring(mathStartIndex);

// Now let's extract all toolsList: [...] lines
const toolsRegex = /toolsList:\s*\[([\s\S]*?)\]/g;
let match;
const uniqueTools = new Set();
const toolsBySubarea = {};

// We can also find each subArea and its levels
const subAreaRegex = /id:\s*'math_([^']+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?levels:\s*\[([\s\S]*?)(?=\s*\{\s*id:\s*'math_|\s*\]\s*\}\s*,\s*\{\s*id:|\s*\}\s*\]\s*\}\s*\]|$)/g;

let subAreaMatch;
while ((subAreaMatch = subAreaRegex.exec(mathContent)) !== null) {
    const subAreaId = 'math_' + subAreaMatch[1];
    const subAreaName = subAreaMatch[2];
    const subAreaText = subAreaMatch[3];
    
    toolsBySubarea[subAreaName] = new Set();
    
    const subToolsRegex = /toolsList:\s*\[([\s\S]*?)\]/g;
    let subToolMatch;
    while ((subToolMatch = subToolsRegex.exec(subAreaText)) !== null) {
        // Parse the tools
        const toolsRaw = subToolMatch[1];
        const tools = toolsRaw.split(',').map(t => t.trim().replace(/['"']/g, '')).filter(t => t);
        for (const tool of tools) {
            uniqueTools.add(tool);
            toolsBySubarea[subAreaName].add(tool);
        }
    }
}

console.log("=== ALL UNIQUE MATH TOOLS ===");
console.log(Array.from(uniqueTools).sort());
console.log("\n=== TOOLS BY SUBAREA ===");
for (const [subArea, tools] of Object.entries(toolsBySubarea)) {
    console.log(`- ${subArea}:`, Array.from(tools));
}
