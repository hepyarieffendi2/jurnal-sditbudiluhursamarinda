import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AREA_SENTRA_CYCLE2 } from './src/data/areaSentraCycle2.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GRANULES = [
  { 
    id: 1, day: 1, dayTitle: "Physical Mastery & Environment",
    title: "1. Adab Berjalan di Dalam Kelas", searchKey: "Adab Berjalan di Dalam Kelas",
    enTitle: "Walking in the Classroom",
    purpose: "Membangun kesadaran batasan ruang (spatial awareness), kontrol motorik kasar, dan rasa hormat pada area kerja.",
    timing: "Masa Orientasi (Hari ke-1) / Transisi antar aktivitas"
  },
  { 
    id: 2, day: 1, dayTitle: "Physical Mastery & Environment",
    title: "2. Merapikan Karpet & Kursi", searchKey: "Membersihkan & Menata Rak Materi",
    enTitle: "Rolling a Mat & Tucking a Chair",
    purpose: "Menanamkan tanggung jawab, kemandirian memelihara keteraturan kelas, dan presisi gerakan tangan.",
    timing: "Setelah selesai menggunakan alat / Sebelum transisi"
  },
  { 
    id: 3, day: 1, dayTitle: "Physical Mastery & Environment",
    title: "3. Adab Membawa & Menyimpan Alat", searchKey: "Adab Membawa & Menyimpan Alat",
    enTitle: "Carrying & Storing Materials",
    purpose: "Melatih keseimbangan, fokus visual, dan kehati-hatian (Tuma'ninah) dalam menjaga amanah barang.",
    timing: "Setiap mengambil dan mengembalikan alat sentra"
  },
  { 
    id: 4, day: 2, dayTitle: "Focus & Voice Calibration",
    title: "4. Volume Bicara & Silence Game", searchKey: "Volume Bicara & Silence Game",
    enTitle: "Voice Calibration & Silence Game",
    purpose: "Meningkatkan regulasi diri, kontrol impuls (menahan diri), dan kepekaan pendengaran.",
    timing: "Saat kelas terlalu berisik / Sebelum sesi hening"
  },
  { 
    id: 5, day: 2, dayTitle: "Focus & Voice Calibration",
    title: "5. Mendengar & Memperhatikan", searchKey: "Mendengar & Memperhatikan",
    enTitle: "Listening & Observing",
    purpose: "Membangun adab menuntut ilmu, kontak mata, dan keterampilan menyimak aktif (Active Listening).",
    timing: "Saat instruksi klasikal / circle time"
  },
  { 
    id: 6, day: 3, dayTitle: "Social Harmony & Respect",
    title: "6. Adab Menonton Teman Bekerja", searchKey: "Adab Menonton Teman Bekerja",
    enTitle: "Observing Others Work",
    purpose: "Menghargai privasi teman, melatih kesabaran, dan belajar dari observasi tanpa mengganggu.",
    timing: "Saat ingin bergabung dengan teman yang sedang bekerja"
  },
  { 
    id: 7, day: 3, dayTitle: "Social Harmony & Respect",
    title: "7. Adab Menunggu Giliran", searchKey: "Adab Menunggu Giliran",
    enTitle: "Waiting for a Turn",
    purpose: "Melatih regulasi emosi (menunda kepuasan), toleransi, dan memahami konsep antrean adil.",
    timing: "Saat alat yang diinginkan sedang digunakan teman"
  },
  { 
    id: 8, day: 3, dayTitle: "Social Harmony & Respect",
    title: "8. Interupsi & Memotong Pembicaraan", searchKey: "Interupsi & Memotong Pembicaraan",
    enTitle: "How to Interrupt Politely",
    purpose: "Membangun kesantunan sosial, kontrol impuls verbal, dan rasa hormat.",
    timing: "Saat butuh bantuan namun guru/teman sedang bicara"
  },
  { 
    id: 9, day: 3, dayTitle: "Social Harmony & Respect",
    title: "9. Meminta Maaf & Tabayyun", searchKey: "Meminta Maaf & Tabayyun",
    enTitle: "Apology & Conflict Resolution",
    purpose: "Mengembangkan empati, keberanian mengakui kesalahan, dan resolusi konflik sehat.",
    timing: "Saat terjadi perselisihan atau ketidaksengajaan"
  }
];

function findStepsInDatabase(searchKey) {
    let result = { steps: [], enTitle: "" };
    function search(items) {
        if (!Array.isArray(items)) return false;
        for (const item of items) {
            if (item.label && item.label.toLowerCase().includes(searchKey.toLowerCase())) {
                if (item.presentation && item.presentation.steps) {
                    result.steps = item.presentation.steps;
                    // Extract English title from label (part after the /)
                    const parts = item.label.split('/');
                    if (parts.length > 1) {
                        result.enTitle = parts[1].trim();
                    }
                    return true;
                }
            }
            if (item.levels && search(item.levels)) return true;
            if (item.subAreas && search(item.subAreas)) return true;
        }
        return false;
    }
    search(AREA_SENTRA_CYCLE2);
    return result;
}

function formatStepsToHTML(stepsArray) {
    if (!stepsArray || stepsArray.length === 0) {
        return `<div class="step-item" style="color:red; grid-column: 1 / -1;">Data tidak ditemukan di database kurikulum.</div>`;
    }

    let html = '';
    const validSteps = stepsArray.filter(step => /^\d+\./.test(step.trim()));
    
    validSteps.forEach(step => {
        const match = step.match(/^(\d+)\.\s*(.*)/);
        if (match) {
            const num = match[1];
            let text = match[2];
            text = text.replace(/"([^"]+)"/g, '<span class="dialogue">"$1"</span>');
            text = text.replace(/'([^']+)'/g, '<span class="dialogue">"$1"</span>');
            html += `\n                            <div class="step-item"><span class="step-num">${num}</span><span>${text}</span></div>`;
        }
    });
    return html;
}

async function generateManual() {
    console.log('Mulai proses generate Manual Pelatihan Pondasi Ketenangan (Full Re-render)...');
    
    const htmlPath = path.join(__dirname, 'Manual_Pelatihan_Pondasi_Ketenangan.html');

    // CSS and Cover Page
    let htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manual Pelatihan Pondasi Ketenangan - SDIT Budi Luhur</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        :root {
            --primary: #1E3A8A; /* Navy Blue */
            --accent: #D97706; /* Amber */
            --bg: #F8FAFC;
            --text: #1E293B;
            --border: #E2E8F0;
        }

        @page {
            size: A4;
            margin: 10mm;
        }

        @page:first {
            margin: 0;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #E2E8F0;
            color: var(--text);
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        .cover-page {
            height: 100vh;
            background-color: var(--primary);
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 20mm;
            box-sizing: border-box;
            position: relative;
            page-break-after: always;
            z-index: 10;
        }

        .cover-logo {
            width: 150px;
            margin-bottom: 30px;
        }

        .cover-page h1 {
            font-size: 3rem;
            font-weight: 800;
            margin: 0 0 10px 0;
            letter-spacing: -1px;
            line-height: 1.2;
        }

        .cover-page h2 {
            font-size: 1.5rem;
            font-weight: 400;
            opacity: 0.9;
            margin: 0 0 40px 0;
        }

        .school-info {
            margin-top: 80px;
            font-weight: 700;
            font-size: 1.2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            padding-top: 30px;
        }

        /* --- CONTENT PAGES --- */
        .page {
            background-color: white;
            padding: 10mm 15mm 20mm 15mm; /* Extra bottom padding for footer */
            min-height: 277mm; /* Full drawable A4 height with 10mm margins */
            box-sizing: border-box;
            position: relative;
            page-break-after: always;
            margin: 20px auto;
            max-width: 210mm;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        /* In print mode, remove the box shadow and margin since it is the paper */
        @media print {
            body { background: white; }
            .page {
                box-shadow: none;
                margin: 0;
                padding: 10mm 15mm 20mm 15mm;
                width: 100%;
                max-width: none;
                min-height: 277mm;
            }
            .no-print { display: none !important; }
            .page-footer {
                position: absolute;
                bottom: 5mm;
                left: 15mm;
                right: 15mm;
            }
        }

        .header-mini {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px; /* Reduced from 25px */
            border-bottom: 2px solid var(--border);
            padding-bottom: 10px;
            font-weight: 600;
            font-size: 0.9rem;
            color: var(--primary);
        }

        .header-mini span:first-of-type {
            font-weight: 500;
            color: #94a3b8; /* Muted gray for subtitle */
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .header-mini span:last-of-type {
            font-weight: 800;
            color: var(--primary);
            font-size: 0.85rem;
        }

        .header-logo {
            height: 35px;
        }

        .section-title {
            margin-bottom: 15px; /* Reduced from 25px */
        }

        .day-badge {
            background: var(--primary);
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.7rem; /* Reduced */
            font-weight: 700;
            display: inline-block;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .section-title h2 {
            font-size: 1.5rem; /* Reduced from 1.8rem */
            margin: 0;
            color: var(--primary);
            font-weight: 800;
            letter-spacing: -0.5px;
        }

        /* --- PRESENTATION BOX --- */
        .presentation-box {
            background: white;
            border-radius: 12px;
            border: 1px solid var(--border);
            padding: 15px; /* Reduced from 20px */
            margin-bottom: 15px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .presentation-box h3 {
            font-size: 1.2rem; /* Slightly reduced */
            color: #0f172a;
            margin: 0 0 5px 0;
        }

        /* --- NEW META CARDS UI --- */
        .en-title {
            display: inline-block;
            background: rgba(30, 58, 138, 0.08);
            color: var(--primary);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.75rem; /* Reduced */
            font-weight: 700;
            margin-bottom: 10px;
            margin-top: -5px;
            letter-spacing: 0.5px;
        }

        .meta-cards {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px; /* Reduced from 15px */
            margin-bottom: 15px;
        }

        .meta-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 8px; /* Reduced from 12px */
            display: flex;
            gap: 10px;
            align-items: flex-start;
        }

        .meta-icon {
            color: var(--accent);
            flex-shrink: 0;
            width: 18px; /* Slightly smaller */
            height: 18px;
        }

        .meta-text strong {
            display: block;
            font-size: 0.7rem; /* Reduced */
            color: var(--primary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
        }

        .meta-text p {
            margin: 0;
            font-size: 0.75rem; /* Reduced from 0.8rem */
            color: #475569;
            line-height: 1.3;
        }

        .steps-list {
            list-style: none;
            padding: 0;
            margin: 0;
            column-count: 2;
            column-gap: 30px;
            display: block;
        }

        .step-item {
            display: flex;
            gap: 10px;
            font-size: 0.8rem; /* Reduced from 0.85rem */
            color: #334155;
            line-height: 1.3;
            margin-bottom: 6px; /* Reduced from 10px */
            break-inside: avoid;
            page-break-inside: avoid;
        }

        .step-num {
            font-weight: 800;
            color: var(--primary);
            opacity: 0.5;
            width: 18px;
            flex-shrink: 0;
        }

        .dialogue {
            color: var(--primary);
            font-weight: 700;
            font-style: italic;
        }

        .page-footer {
            position: absolute;
            bottom: 5mm;
            left: 15mm;
            right: 15mm;
            display: flex;
            justify-content: space-between;
            font-size: 0.7rem;
            color: #94a3b8;
            border-top: 1px dashed #cbd5e1;
            padding-top: 10px;
            font-weight: 500;
        }

        .print-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background-color: var(--primary);
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 30px;
            font-family: inherit;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.3);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 100;
            transition: transform 0.2s;
        }

        .print-btn:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <button class="print-btn no-print" onclick="window.print()">
        <i data-lucide="printer"></i> Cetak Manual (PDF)
    </button>

    <div class="cover-page">
        <img src="LOGO SDIT BUDI LUHUR TRANSPARAN PUTIH.png" alt="Logo SDIT Budi Luhur" class="cover-logo" onerror="this.src='public/logo-budiluhur.png'">
        <h1>Pondasi Ketenangan</h1>
        <h2>Manual Pelatihan Guru Sentra (Cycle 2)</h2>
        <div class="school-info">SDIT BUDI LUHUR SAMARINDA</div>
    </div>
`;

    // Generate Each Page
    let currentPageIdx = 1;
    let lastDay = 0;

    for (const granul of GRANULES) {
        const data = findStepsInDatabase(granul.searchKey);
        const stepsHTML = formatStepsToHTML(data.steps);
        const finalEnTitle = data.enTitle || granul.enTitle;
        
        let headerHTML = '';
        if (granul.day !== lastDay) {
            headerHTML = `
            <div class="section-title">
                <div class="day-badge">Hari ${granul.day}</div>
                <h2>${granul.dayTitle}</h2>
            </div>`;
            lastDay = granul.day;
        }

        htmlContent += `
    <!-- Page ${currentPageIdx} -->
    <div class="page">
        <div class="header-mini">
            <img src="public/logo-budiluhur.png" alt="Logo" class="header-logo">
            <span>Pondasi Ketenangan</span>
            <span>Halaman ${String(currentPageIdx).padStart(2, '0')}</span>
        </div>

        ${headerHTML}

        <div class="presentation-box">
            <h3>${granul.title}</h3>
            <span class="en-title">${finalEnTitle}</span>
            <div class="meta-cards">
                <div class="meta-card">
                    <i data-lucide="target" class="meta-icon"></i>
                    <div class="meta-text">
                        <strong>Tujuan :</strong>
                        <p>${granul.purpose}</p>
                    </div>
                </div>
                <div class="meta-card">
                    <i data-lucide="clock" class="meta-icon"></i>
                    <div class="meta-text">
                        <strong>Penerapan:</strong>
                        <p>${granul.timing}</p>
                    </div>
                </div>
            </div>
            <div class="steps-list">
${stepsHTML}
            </div>
        </div>
        
        <div class="page-footer">
            <span>SDIT Budi Luhur Samarinda &copy; 2026</span>
            <span>Panduan Pondasi Ketenangan | Rev.2026.05</span>
        </div>
    </div>
`;
        currentPageIdx++;
    }

    // Close HTML
    htmlContent += `
    <script>
        lucide.createIcons();
    </script>
</body>
</html>`;

    fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
    console.log('\\nBerhasil! Manual_Pelatihan_Pondasi_Ketenangan.html telah dibangun ulang dengan 1 Granul = 1 Halaman.');
}

generateManual().catch(console.error);
