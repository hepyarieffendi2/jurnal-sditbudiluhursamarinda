const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\MyBook Hype AMD\\.gemini\\antigravity\\brain\\b73045ca-fa37-438d-8835-dea0ee155ec9\\.system_generated\\logs\\transcript.jsonl';
if (!fs.existsSync(logPath)) {
    console.error('Log file does not exist at:', logPath);
    process.exit(1);
}

const fileContent = fs.readFileSync(logPath, 'utf8');
const lines = fileContent.split('\n');

console.log('Searching transcript for print recommendations...');
lines.forEach((line) => {
    if (!line.trim()) return;
    try {
        const step = JSON.parse(line);
        if (step.source === 'MODEL' && step.content && (step.content.includes('print') || step.content.includes('Cetak') || step.content.includes('cetak'))) {
            console.log(`=== STEP ${step.step_index} ===`);
            console.log(step.content);
            console.log('\n--------------------------------------------------\n');
        }
    } catch (e) {
        // Skip malformed lines
    }
});
