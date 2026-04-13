const fs = require('fs');
const pdf = require('pdf-parse');

async function extract() {
    try {
        let dataBuffer = fs.readFileSync('MN-Curriculum-Outline-6-9.pdf');
        let data = await pdf(dataBuffer);
        fs.writeFileSync('pdf_extracted.txt', data.text);
        console.log('Extraction complete. Filesize:', data.text.length);
    } catch (err) {
        console.error('Error parsing PDF:', err);
    }
}

extract();
