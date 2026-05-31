const fs = require('fs');

const logPath = 'C:\\Users\\MyBook Hype AMD\\.gemini\\antigravity\\brain\\b73045ca-fa37-438d-8835-dea0ee155ec9\\.system_generated\\logs\\transcript.jsonl';
const fileContent = fs.readFileSync(logPath, 'utf8');
const lines = fileContent.split('\n');

console.log('Searching for the model response to user query about printing...');

let foundUserIndex = -1;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    try {
        const step = JSON.parse(line);
        if (step.type === 'USER_INPUT' && step.content && step.content.includes('tiap granul')) {
            console.log(`FOUND USER INPUT at step index ${step.step_index}`);
            console.log(step.content);
            foundUserIndex = i;
            break;
        }
    } catch(e) {}
}

if (foundUserIndex !== -1) {
    // Print the next 3 steps
    for (let k = foundUserIndex + 1; k < foundUserIndex + 4; k++) {
        if (k >= lines.length) break;
        try {
            const step = JSON.parse(lines[k]);
            console.log(`\n=== STEP ${step.step_index} (${step.source}) ===`);
            console.log(step.content || `[Tool Call/Response: ${step.type}]`);
        } catch(e) {}
    }
} else {
    console.log('User input not found.');
}
