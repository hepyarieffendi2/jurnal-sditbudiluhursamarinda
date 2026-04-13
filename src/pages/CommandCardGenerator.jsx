import React, { useState, useEffect } from 'react';
import { Printer, Wand2, RefreshCw, Layers, Sparkles, ChevronDown } from 'lucide-react';
import { AREA_SENTRA } from '../data/areaSentra';

// Generate dynamic challenges based on material name and step context
const generateChallenges = (levelLabel, subAreaName, areaName) => {
    const rawLabel = typeof levelLabel === 'object' ? levelLabel.label : levelLabel || '';
    const label = rawLabel.toLowerCase();
    const context = (subAreaName + ' ' + areaName).toLowerCase();
    
    const hasWord = (str, words) => words.some(w => str.includes(w));
    
    // Deteksi Kelas/Usia untuk panjang teks. K1 belum lancar membaca kalimat kompleks Sentra.
    const isK1 = label.includes('k1');
    const t = (k1Text, k2k3Text) => isK1 ? k1Text : (k2k3Text || k1Text);

    // --- MATEMATIKA ---
    if (hasWord(context, ['matematika', 'math', 'aritmatika'])) {
        if (hasWord(label, ['pecahan', 'fraction', 'inset'])) {
            return [
                { id: 1, type: 'practice', content: t('Gambar 1/2 dan warnai.', 'Ambil material Inset. Gambarkan pecahan 1/2 dan warnai.') },
                { id: 2, type: 'practice', content: t('Gambar 1/4 dan warnai.', 'Gambarkan pecahan 1/4 dan bandingkan ukurannya dengan 1/2.') },
                { id: 3, type: 'practice', content: t('1/2 + 1/2 = ...', 'Susun dua keping 1/2. Akan menjadi pecahan berapa?') }
            ];
        }
        if (hasWord(label, ['+', 'penjumlahan', 'tambah', 'addition', 'gabung'])) {
            // Soal Math mentah tanpa kata-kata bersayap agar anak fokus menghitung material
            return isK1 ? [
                { id: 1, type: 'practice', content: '  3.421\n+ 2.158\n-------' },
                { id: 2, type: 'practice', content: '  4.502\n+ 1.346\n-------' },
                { id: 3, type: 'practice', content: '  5.291\n+ 4.004\n-------' },
                { id: 4, type: 'practice', content: '  1.234\n+ 4.321\n-------' }
            ] : [
                { id: 1, type: 'practice', content: 'Susun dinamika meminjam:\n\n  5.892\n+ 3.451\n-------' },
                { id: 2, type: 'practice', content: 'Coba letakkan ini:\n\n  9.008\n+ 2.992\n-------' },
                { id: 3, type: 'research', content: 'Buatlah 2 soalmu sendiri. Gunakan angka di atas 5.000.' }
            ];
        }
        if (hasWord(label, ['-', 'pengurangan', 'kurang', 'subtraction'])) {
            return isK1 ? [
                { id: 1, type: 'practice', content: '  8.452\n- 3.231\n-------' },
                { id: 2, type: 'practice', content: '  5.986\n- 2.405\n-------' },
                { id: 3, type: 'practice', content: '  6.759\n- 4.210\n-------' }
            ] : [
                { id: 1, type: 'practice', content: 'Selesaikan:\n\n  6.002\n- 1.458\n-------' },
                { id: 2, type: 'practice', content: 'Beranikan dirimu:\n\n  8.100\n- 3.499\n-------' }
            ];
        }
        if (hasWord(label, ['x', 'perkalian', 'kali', 'multiplication', 'checker'])) {
            return isK1 ? [
                 { id: 1, type: 'practice', content: '  412\nx   2\n-----' },
                 { id: 2, type: 'practice', content: '  304\nx   3\n-----' },
                 { id: 3, type: 'practice', content: '  121\nx   4\n-----' }
            ] : [
                { id: 1, type: 'practice', content: 'Selesaikan di Checker Board:\n1.234 x 13 =' },
                { id: 2, type: 'practice', content: '345 x 24 =' },
            ];
        }
        if (hasWord(label, [':', '/', 'pembagian', 'bagi', 'division'])) {
            return isK1 ? [
                 { id: 1, type: 'practice', content: '8 : 2 =' },
                 { id: 2, type: 'practice', content: '12 : 3 =' },
                 { id: 3, type: 'practice', content: '24 : 4 =' }
            ] : [
                { id: 1, type: 'practice', content: 'Bagikan 8.462 di Tes Tube:\n8.462 : 2 =' },
                { id: 2, type: 'practice', content: '5.438 : 4 = ... (sisa?)' },
            ];
        }
        if (hasWord(label, ['geometri', 'sudut', 'bangun', 'geometry', 'triangle', 'segi', 'poligon'])) {
            return [
                { id: 1, type: 'command', content: t('Gambar segitiga dan warnai.', 'Ambil penggaris. Gambarlah satu sudut lancip dan satu sudut tumpul yang jelas.') },
                { id: 2, type: 'research', content: t('Cari 3 benda siku-siku.', 'Kelilingi kelas, temukan 3 benda yang memiliki sudut siku-siku (90°).') }
            ];
        }
        // Fallback matematika
        return [
            { id: 1, type: 'practice', content: t('Bikin 2 soal tambahan.', 'Gunakan material Matematika ini untuk membuat persamaan baru secara mandiri.') },
            { id: 2, type: 'research', content: t('Salin ke buku rapi.', 'Pindahkan angka-angka dari material ke atas kertas. Tulis di buku kerjamu.') }
        ];
    }
    
    // --- BAHASA ---
    if (hasWord(context, ['bahasa', 'literasi', 'language']) || hasWord(label, ['baca', 'tulis'])) {
         if (hasWord(label, ['fonetik', 'huruf', 'alphabet', 'pink', 'blue', 'kataba'])) {
             return [
                 { id: 1, type: 'practice', content: t('Susun 5 nama hewan.', 'Gunakan kotak Alfabet Bergerak untuk menyusun 5 nama hewan herbivora yang kamu tahu.') },
                 { id: 2, type: 'command', content: t('Baca 1 cerita.', 'Pilih satu buku dari rak. Baca, lalu maju menceritakan isinya kepada guru.') }
             ];
         }
         if (hasWord(label, ['tata bahasa', 'grammar', 'kalimat', 'kata', 'noun', 'verb'])) {
             return [
                 { id: 1, type: 'practice', content: t('Tulis: Bola itu bundar.', 'Tulis: "Kucing belang itu berlari." Beri simbol struktur tata bahasa di atasnya.') },
                 { id: 2, type: 'research', content: t('Tulis 5 benda di kelas.', 'Carilah 3 benda. Tulis apa kata sifat dan kata kerjanya.') }
             ];
         }
         return [
            { id: 1, type: 'research', content: t('Tulis 3 hal yang menyenangkan.', 'Tulis sebuah paragraf bebas tentang apa yang membuatmu gembira minggu ini.') },
            { id: 2, type: 'command', content: t('Cari kata di Ensiklopedi.', 'Buka buku literasi. Temukan dan catat 3 kata ajaib baru beserta maknanya.') }
         ];
    }
    
    // --- BIOLOGI / ALAM ---
    if (hasWord(context, ['biologi', 'alam']) || hasWord(label, ['zoologi', 'botani', 'daun', 'hewan', 'animal', 'plant', 'leaf'])) {
        return [
            { id: 1, type: 'command', content: t('Pasangkan label kartu.', 'Ambil Kartu Nomenklatur. Pasangkan antara gambar aslinya, label nama, dan penjelasannya.') },
            { id: 2, type: 'research', content: t('Salin (Jiplak) pakai kertas.', 'Salin gambar material ini menggunakan metode kertas kalkir (tracing), beri nama jelas.') },
            { id: 3, type: 'research', content: t('Buat buku mini (Booklet).', 'Gunting dan rekatkan. Buatlah buku saku literatur mini berisi penjelasan biologi ini.') }
        ];
    }
    
    // --- SOSIAL / SEJARAH / GEOGRAFI ---
    if (hasWord(context, ['sosial', 'sejarah', 'geografi']) || hasWord(label, ['bumi', 'waktu', 'benua', 'map', 'history'])) {
         return [
            { id: 1, type: 'command', content: t('Jiplak Peta Benua.', 'Bongkar pasang Puzzle Map. Sebutkan nama-nama benua secara berurutan.') },
            { id: 2, type: 'research', content: t('Buat Garis Waktu.', 'Susun Timeline Sejarah di jurnalmu, catat aktivitas dari kamu bangun hingga tidur.') },
            { id: 3, type: 'command', content: t('Warnai lautan bumi.', 'Salin bentuk satu benua di kertas A4, lalu warnai area tepinya menjadi biru tua.') }
         ];
    }

    // --- AGAMA ISLAM (PAI) ---
    if (hasWord(context, ['agama', 'pai', 'islam']) || hasWord(label, ['sholat', 'wudhu', 'doa', 'ibadah'])) {
         return [
             { id: 1, type: 'practice', content: t('Urutkan gambar Wudhu.', 'Praktekkan gerakan wudhu yang tertib seperti yang telah kamu tonton di buku panduan.') },
             { id: 2, type: 'research', content: t('Tulis satu doa pendek.', 'Tuliskan dan hias lukisan satu lafaz doa harian di buku tulismu.') },
         ];
    }
    if (hasWord(context, ['agama', 'pai']) && hasWord(label, ['quran', 'tilawati', 'tahfidz', 'surah', 'ngaji'])) {
         return [
             { id: 1, type: 'practice', content: t('Hafal 2 ayat lagi.', 'Duduk manis. Hafalkan mandiri tambahan ayat baru hari ini sebelum maju menyetor.') },
             { id: 2, type: 'command', content: t('Dengarkan qiroah Al-Quran.', 'Pakai earphone, dengarkan murottal secara kusyuk pada bacaan yang sedang kamu kerjakan.') },
         ];
    }
    
    // --- DEFAULT FALLBACK ---
    return [
        { id: 1, type: 'command', content: t('Ambil dengan hati-hati.', 'Siapkan matras. Ambil material ini perlahan dari rak. Ikuti alur presentasi daru guru.') },
        { id: 2, type: 'practice', content: t('Ulangi sampai 3 kali.', 'Siklus Repetisi: Gunakan alat peraga ini berulang-ulang sampai kamu paham alurnya.') },
        { id: 3, type: 'research', content: t('Gambat di buku jurnal.', 'Lembar Mandiri: Buatlah sketsa gambaran pengerjaan material ini di Jurnal Kerja dirimu.') }
    ];
};

export default function CommandCardGenerator() {
    const [selectedArea, setSelectedArea] = useState(AREA_SENTRA[1]); // Default Math
    const [selectedSubArea, setSelectedSubArea] = useState(AREA_SENTRA[1].subAreas[0]);
    const [selectedMaterial, setSelectedMaterial] = useState(AREA_SENTRA[1].subAreas[0].levels[0]);
    
    const [generatedCards, setGeneratedCards] = useState([]);
    const [showControlChart, setShowControlChart] = useState(false);
    
    useEffect(() => {
        if (!selectedArea || !selectedSubArea || !selectedMaterial) return;
        
        const label = typeof selectedMaterial === 'object' ? selectedMaterial.label : selectedMaterial;
        const cards = generateChallenges(label, selectedSubArea.name, selectedArea.name);
        setGeneratedCards(cards);
    }, [selectedArea, selectedSubArea, selectedMaterial]);

    const handleAreaChange = (e) => {
        const area = AREA_SENTRA.find(a => a.id === e.target.value);
        setSelectedArea(area);
        const firstSub = area.subAreas[0];
        setSelectedSubArea(firstSub);
        setSelectedMaterial(firstSub?.levels[0] || null);
    };

    const handleSubAreaChange = (e) => {
        const subArea = selectedArea.subAreas.find(sa => sa.id === e.target.value);
        setSelectedSubArea(subArea);
        setSelectedMaterial(subArea?.levels[0] || null);
    };

    const handleMaterialChange = (e) => {
        const matValue = e.target.value;
        const mat = selectedSubArea.levels.find(l => {
            const label = typeof l === 'object' ? l.label : l;
            return label === matValue;
        });
        setSelectedMaterial(mat);
    };

    const getLevelText = (lvl) => typeof lvl === 'object' ? lvl.label : lvl;

    const handlePrint = () => {
        const rootLayout = document.querySelector('.app-layout');
        const mainArea = document.querySelector('.main-content-area');
        
        const originalStyles = [];
        if (rootLayout) {
             originalStyles.push({ el: rootLayout, height: rootLayout.style.height, overflow: rootLayout.style.overflow });
             rootLayout.style.height = 'auto';
             rootLayout.style.overflow = 'visible';
             rootLayout.style.minHeight = 'auto'; 
        }
        if (mainArea) {
             originalStyles.push({ el: mainArea, paddingBottom: mainArea.style.paddingBottom });
             mainArea.style.paddingBottom = '0';
        }

        window.print();

        if (rootLayout) {
            rootLayout.style.height = originalStyles[0].height;
            rootLayout.style.overflow = originalStyles[0].overflow;
            rootLayout.style.minHeight = '100vh';
        }
        if (mainArea) {
            mainArea.style.paddingBottom = originalStyles[1]?.paddingBottom || '120px';
        }
    };

    const titleText = selectedSubArea?.name ? selectedSubArea.name.split('/')[0].trim() : 'Materi Sentra';
    const subTitleText = selectedMaterial ? getLevelText(selectedMaterial).split('/')[0].trim() : 'Pembuatan LKPD';

    return (
        <div style={styles.container}>
            <div className="no-print" style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.iconBox}><Wand2 size={24} color="#3B82F6" /></div>
                    <div>
                        <h1 style={styles.title}>Cetak Kartu Tugas (LKPD)</h1>
                        <p style={styles.subtitle}>Pembuatan LKPD Command Cards berstandar pendidikan Sentra.</p>
                    </div>
                </div>
                <button onClick={handlePrint} style={styles.printBtn}>
                    <Printer size={18} /> Simpan / Cetak (PDF)
                </button>
            </div>

            <div className="no-print" style={styles.grid}>
                
                <div style={styles.sidebar}>
                    <div style={styles.sidebarTitle}>
                        <Layers size={16} /> Panel Pengaturan Cetak
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>1. Tentukan Tema Area</label>
                        <div style={styles.selectWrapper}>
                            <select value={selectedArea.id} onChange={handleAreaChange} style={styles.select}>
                                {AREA_SENTRA.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                            <ChevronDown size={18} color="#94A3B8" style={styles.selectIcon} />
                        </div>
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>2. Kategori Sentra Khusus</label>
                        <div style={styles.selectWrapper}>
                            <select value={selectedSubArea?.id} onChange={handleSubAreaChange} style={styles.select}>
                                {selectedArea?.subAreas.map(sa => <option key={sa.id} value={sa.id}>{sa.name}</option>)}
                            </select>
                            <ChevronDown size={18} color="#94A3B8" style={styles.selectIcon} />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>3. Judul / Fokus Material</label>
                        <div style={styles.selectWrapper}>
                            <select value={selectedMaterial ? getLevelText(selectedMaterial) : ''} onChange={handleMaterialChange} style={styles.select}>
                                {selectedSubArea?.levels.map((lvl, i) => <option key={i} value={getLevelText(lvl)}>{getLevelText(lvl).split('/')[0]}</option>)}
                            </select>
                            <ChevronDown size={18} color="#94A3B8" style={styles.selectIcon} />
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <Sparkles size={16} color="#F59E0B" flexShrink={0} />
                        <span style={{ fontSize: '0.75rem', lineHeight: 1.4, color: '#92400E' }}>
                            Penting: Sistem OTOMATIS membaca umur audiens. Kartu yang diprioritaskan untuk <strong>Kelas 1 (K1)</strong> meminimalisir banyak kata, diganti latihan teknis murni.
                        </span>
                    </div>
                </div>

                <div style={{ backgroundColor: '#DBEAFE', padding: '16px', borderRadius: '16px' }}>
                    <div className="printable-canvas" style={styles.printableCanvas}>
                        
                        <div style={{ textAlign: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '3px solid #1E293B' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', margin: 0, color: '#0F172A' }}>{titleText}</h2>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '8px 0 0 0', color: '#475569' }}>{subTitleText}</h3>
                        </div>

                        <div style={styles.cardContainer}>
                            {generatedCards.map((card, i) => (
                                <div key={card.id} style={styles.cleanCard}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                                         <div style={{ width: '24px', height: '24px', backgroundColor: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 800, fontSize: '0.8rem' }}>{i + 1}</div>
                                         <span style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: '#475569', letterSpacing: '1px' }}>
                                             {card.type === 'practice' ? '🧩 Praktikum' : card.type === 'research' ? '🔬 Tantangan' : '📋 Instruksi'}
                                         </span>
                                    </div>
                                    
                                    <pre style={{ 
                                        fontSize: '18pt', margin: 0, color: '#1E293B', fontWeight: 700, 
                                        lineHeight: 1.4, flex: 1, fontFamily: 'monospace', whiteSpace: 'pre-wrap',
                                        wordSpacing: card.content.includes('-------') ? '3px' : 'normal' 
                                    }}>
                                        {card.content}
                                    </pre>
                                    
                                    <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '7pt', color: '#64748B' }}>
                                         <strong>SDIT Budi Luhur Sentra</strong>
                                         <span>ID: {selectedArea.shortName}-C{i+1}</span>
                                    </div>
                                </div>
                            ))}

                            <div style={{ ...styles.cleanCard, border: '2px dashed #94A3B8' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <div style={{ width: '24px', height: '24px', border: '2px solid #64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}></div>
                                    <span style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', letterSpacing: '1px' }}>✍️ Lembar Kustomisasi</span>
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ flex: 1, borderBottom: '1px dashed #CBD5E1' }}></div>
                                    <div style={{ flex: 1, borderBottom: '1px dashed #CBD5E1' }}></div>
                                    <div style={{ flex: 1, borderBottom: '1px dashed #CBD5E1' }}></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .printable-canvas, .printable-canvas * { visibility: visible; }
                    .printable-canvas { 
                        position: absolute; left: 0; top: 0; width: 100%; 
                        padding: 0 !important; box-shadow: none !important; border: none !important;
                    }
                    body, html { 
                        height: 100%; width: 100%; margin: 0; padding: 0; 
                        background: none !important; overflow: visible !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;
                    }
                    .no-print { display: none !important; }
                    @page { margin: 15mm; size: A4 portrait; }
                }
            `}</style>
        </div>
    );
}

const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '16px', fontFamily: 'Inter, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'white', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
    iconBox: { width: '44px', height: '44px', backgroundColor: '#EFF6FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    title: { margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' },
    subtitle: { margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748B', fontWeight: 600 },
    printBtn: { backgroundColor: '#3B82F6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' },
    grid: { display: 'grid', gridTemplateColumns: 'minmax(300px, 320px) 1fr', gap: '24px', alignItems: 'start' },
    sidebar: { backgroundColor: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '20px' },
    sidebarTitle: { fontSize: '0.85rem', fontWeight: 900, color: '#334155', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '0.75rem', fontWeight: 800, color: '#64748B' },
    selectWrapper: { position: 'relative' },
    select: { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', backgroundColor: '#F8FAFC', fontSize: '0.88rem', fontWeight: 700, color: '#1E293B', appearance: 'none', cursor: 'pointer', outline: 'none' },
    selectIcon: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
    infoBox: { backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '16px', borderRadius: '12px', display: 'flex', gap: '10px', marginTop: '16px' },
    printableCanvas: { backgroundColor: 'white', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', minHeight: '842px', borderRadius: '12px', padding: '12mm' },
    cardContainer: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
    cleanCard: { border: '2px solid #0F172A', borderRadius: '12px', padding: '20px', minHeight: '220px', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }
};
