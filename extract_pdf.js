import fs from 'fs';
import pdf_mod from 'pdf-parse';

const pdf = typeof pdf_mod === 'function' ? pdf_mod : pdf_mod.default;

async function run() {
    try {
        let buffer = fs.readFileSync('MN-Curriculum-Outline-6-9.pdf');
        let data = await pdf(buffer);
        fs.writeFileSync('pdf_extracted.txt', data.text);
        console.log('Success!', data.text.length);
    } catch (e) {
        console.error(e);
    }
}
run();
