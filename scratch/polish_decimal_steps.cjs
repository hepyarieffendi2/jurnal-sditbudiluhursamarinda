const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'areaSentraCycle2.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Let's fix pedagogical steps in Level 2: Introduction to Symbols
// Current:
// 4. Tunjukkan kartu '1' (Warna Hijau): 'Ini satu. Simbol untuk angka tunggal.'
// 5. Tunjukkan kartu '10' (Warna Biru): 'Ini sepuluh. Ada angka 1 and nol di belakangnya.'
// 6. Tunjukkan kartu '100' (Warna Merah): 'Ini seratus. Nolnya bertambah menjadi dua.'
// 7. Tunjukkan kartu '1000' (Warna Hijau Besar): 'Ini seribu. Angka nolnya ada tiga.'
// Proposed (AMI sensory directness):
// 4. Tunjukkan kartu '1' (Warna Hijau): 'Ini satu.'
// 5. Tunjukkan kartu '10' (Warna Biru): 'Ini sepuluh.'
// 6. Tunjukkan kartu '100' (Warna Merah): 'Ini seratus.'
// 7. Tunjukkan kartu '1000' (Warna Hijau Besar): 'Ini seribu.'
const oldSymbols = [
    '"4. Tunjukkan kartu \'1\' (Warna Hijau): \'Ini satu. Simbol untuk angka tunggal.\'"',
    '"5. Tunjukkan kartu \'10\' (Warna Biru): \'Ini sepuluh. Ada angka 1 and nol di belakangnya.\'"',
    '"6. Tunjukkan kartu \'100\' (Warna Merah): \'Ini seratus. Nolnya bertambah menjadi dua.\'"',
    '"7. Tunjukkan kartu \'1000\' (Warna Hijau Besar): \'Ini seribu. Angka nolnya ada tiga.\'"'
];
const newSymbols = [
    '"4. Tunjukkan kartu \'1\' (Warna Hijau): \'Ini satu.\'"',
    '"5. Tunjukkan kartu \'10\' (Warna Biru): \'Ini sepuluh.\'"',
    '"6. Tunjukkan kartu \'100\' (Warna Merah): \'Ini seratus.\'"',
    '"7. Tunjukkan kartu \'1000\' (Warna Hijau Besar): \'Ini seribu.\'"'
];

for (let i = 0; i < oldSymbols.length; i++) {
    content = content.replace(oldSymbols[i], newSymbols[i]);
}

// 2. Clarify Magic Slide Alignment (Level 5)
// Current: "7. Jajarkan kartu tersebut secara vertikal: 2000 paling bawah, lalu 300, 40, and 5 paling atas."
// Proposed: "7. Jajarkan kartu tersebut secara vertikal dengan meratakan seluruh kartu di sisi kanan (right-aligned): kartu 2000 paling bawah, lalu 300, 40, dan 5 paling atas."
content = content.replace(
    '"7. Jajarkan kartu tersebut secara vertikal: 2000 paling bawah, lalu 300, 40, and 5 paling atas."',
    '"7. Jajarkan kartu tersebut secara vertikal dengan meratakan seluruh kartu di sisi kanan (right-aligned): kartu 2000 paling bawah, lalu 300, 40, dan 5 paling atas."'
);

// 3. Fix "membawa-nya" -> "membawanya" in Level 3
content = content.replace(
    '"6. Anak berjalan ke Bank, mengambil 1 keping ratusan, and membawa-nya kembali."',
    '"6. Anak berjalan ke Bank, mengambil 1 keping ratusan, dan membawanya kembali."'
);

// 4. We also want to replace common 'and' to 'dan' inside the decimal steps to make it polished.
// Let's do selective regex replace only inside the 'matematika' block to avoid touching other areas.
const mathStartIndex = content.indexOf("id: 'matematika'");
let mathContent = content.substring(mathStartIndex);

// Perform replacements inside mathContent
mathContent = mathContent
    .replace(/\band\b/g, 'dan')
    .replace(/\bto\bnampan\b/g, 'ke nampan')
    .replace(/merasakat/g, 'merasakan')
    .replace(/ketelinean/g, 'ketelitian');

// Merge back
content = content.substring(0, mathStartIndex) + mathContent;

fs.writeFileSync(filePath, content, 'utf8');
console.log("Pedagogical polish and language corrections applied successfully!");
