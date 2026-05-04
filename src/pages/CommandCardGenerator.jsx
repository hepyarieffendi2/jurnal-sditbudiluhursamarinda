import React, { useState, useEffect } from 'react';
import { Printer, Wand2, RefreshCw, Layers, Sparkles, ChevronDown, Edit3, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { AREA_SENTRA } from '../data/areaSentra';

// Helper to extract command cards from curriculum steps
const extractCardsFromSteps = (steps) => {
    if (!steps || !Array.isArray(steps)) return [];
    
    // Pattern to look for action-oriented steps (usually after basic setup)
    // We look for steps in "MEMAHAMI" or "MENGAPLIKASIKAN" sections
    const relevantSteps = steps.filter(step => {
        const lower = step.toLowerCase();
        // Skip setup steps and introductory headers
        if (lower.includes('kegiatan awal') || lower.includes('memulai dengan') || lower.includes('undang anak')) return false;
        if (lower.includes('kegiatan penutup') || lower.includes('simpan kembali') || lower.includes('membaca hamdalah')) return false;
        // Keep actual working steps
        return step.match(/^\d+\./); 
    });

    // Select a few representative steps (e.g., middle and application phases)
    const cards = [];
    if (relevantSteps.length > 0) {
        // Take up to 3 interesting steps
        const selections = [
            relevantSteps[Math.min(2, relevantSteps.length - 1)],
            relevantSteps[Math.floor(relevantSteps.length / 2)],
            relevantSteps[relevantSteps.length - 1]
        ].filter((v, i, a) => a.indexOf(v) === i); // Unique

        selections.forEach((step, idx) => {
            // Clean up the step text (remove the number "1. " at start)
            const cleanedText = step.replace(/^\d+\.\s*/, '').trim();
            cards.push({
                id: Date.now() + idx,
                type: idx === 2 ? 'research' : 'practice',
                content: cleanedText
            });
        });
    }

    return cards;
};

export default function CommandCardGenerator() {
    const [selectedArea, setSelectedArea] = useState(AREA_SENTRA[1]); // Default Math
    const [selectedSubArea, setSelectedSubArea] = useState(AREA_SENTRA[1].subAreas[0]);
    const [selectedMaterial, setSelectedMaterial] = useState(AREA_SENTRA[1].subAreas[0].levels[0]);
    
    const [generatedCards, setGeneratedCards] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    // Initialize cards when material changes
    useEffect(() => {
        if (!selectedMaterial) return;
        
        // Try to get steps from the material object
        const steps = selectedMaterial.presentation?.steps;
        
        if (steps && steps.length > 0) {
            const cards = extractCardsFromSteps(steps);
            setGeneratedCards(cards);
        } else {
            // Fallback to basic template if no steps found
            setGeneratedCards([
                { id: 1, type: 'practice', content: 'Gunakan material ini secara mandiri sesuai contoh.' },
                { id: 2, type: 'practice', content: 'Ulangi pengerjaan sampai kamu merasa lancar.' },
                { id: 3, type: 'research', content: 'Tuliskan hasil kerjamu di buku jurnal.' }
            ]);
        }
    }, [selectedMaterial]);

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

    const handleCardContentChange = (id, newContent) => {
        setGeneratedCards(prev => prev.map(c => c.id === id ? { ...c, content: newContent } : c));
    };

    const handleSave = () => {
        // In a real app, we would save this to Firestore
        // For now, we simulate a save
        setIsEditing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const getLevelText = (lvl) => typeof lvl === 'object' ? lvl.label : lvl;

    const handlePrint = () => {
        window.print();
    };

    const titleText = selectedSubArea?.name ? selectedSubArea.name.split('/')[0].trim() : 'Materi Sentra';
    const subTitleText = selectedMaterial ? getLevelText(selectedMaterial).split('/')[0].trim() : 'Pembuatan LKPD';

    return (
        <div style={styles.container}>
            {/* Success Notification */}
            {showSuccess && (
                <div style={styles.successToast}>
                    <CheckCircle2 size={20} /> Kartu Tugas Berhasil Diperbarui!
                </div>
            )}

            <div className="no-print" style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.iconBox}><Wand2 size={24} color="#3B82F6" /></div>
                    <div>
                        <h1 style={styles.title}>Generator Kartu (LKPD) dari Database Kurikulum</h1>
                        <p style={styles.subtitle}>Otomatis mengambil data dari kurikulum pusat untuk dibuat kartu tugas.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
                        style={{ ...styles.editBtn, backgroundColor: isEditing ? '#10B981' : '#F8FAFC', color: isEditing ? 'white' : '#64748B' }}
                    >
                        {isEditing ? <><Save size={18} /> Simpan Perubahan</> : <><Edit3 size={18} /> Edit Isi Kartu</>}
                    </button>
                    <button onClick={handlePrint} style={styles.printBtn}>
                        <Printer size={18} /> Cetak (PDF)
                    </button>
                </div>
            </div>

            <div className="no-print" style={styles.grid}>
                <div style={styles.sidebar}>
                    <div style={styles.sidebarTitle}><Layers size={16} /> Pilih Materi Kurikulum</div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>1. Area Sentra</label>
                        <div style={styles.selectWrapper}>
                            <select value={selectedArea.id} onChange={handleAreaChange} style={styles.select}>
                                {AREA_SENTRA.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                            <ChevronDown size={18} color="#94A3B8" style={styles.selectIcon} />
                        </div>
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>2. Sub-Area</label>
                        <div style={styles.selectWrapper}>
                            <select value={selectedSubArea?.id} onChange={handleSubAreaChange} style={styles.select}>
                                {selectedArea?.subAreas.map(sa => <option key={sa.id} value={sa.id}>{sa.name}</option>)}
                            </select>
                            <ChevronDown size={18} color="#94A3B8" style={styles.selectIcon} />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>3. Judul Materi (Database)</label>
                        <div style={styles.selectWrapper}>
                            <select value={selectedMaterial ? getLevelText(selectedMaterial) : ''} onChange={handleMaterialChange} style={styles.select}>
                                {selectedSubArea?.levels.map((lvl, i) => <option key={i} value={getLevelText(lvl)}>{getLevelText(lvl).split('/')[0]}</option>)}
                            </select>
                            <ChevronDown size={18} color="#94A3B8" style={styles.selectIcon} />
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <Sparkles size={16} color="#F59E0B" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.75rem', lineHeight: 1.4, color: '#92400E' }}>
                            <strong>Smart Extraction:</strong> Generator ini otomatis mengambil instruksi dari kolom "Presentation Steps" di database Kurikulum Pusat Anda.
                        </span>
                    </div>

                    {selectedMaterial?.presentation?.error && (
                        <div style={{ ...styles.infoBox, backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                            <AlertCircle size={16} color="#3B82F6" style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: '0.75rem', lineHeight: 1.4, color: '#1E40AF' }}>
                                <strong>Control of Error:</strong> {selectedMaterial.presentation.error}
                            </span>
                        </div>
                    )}
                </div>

                <div style={{ backgroundColor: '#F1F5F9', padding: '24px', borderRadius: '24px', position: 'relative' }}>
                    <div className="printable-canvas" style={styles.printableCanvas}>
                        <div style={{ textAlign: 'center', marginBottom: '30px', paddingBottom: '16px', borderBottom: '2px solid #1E293B' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', margin: 0, color: '#0F172A' }}>{titleText}</h2>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '8px 0 0 0', color: '#64748B' }}>{subTitleText}</h3>
                        </div>

                        <div style={styles.cardContainer}>
                            {generatedCards.map((card, i) => (
                                <div key={card.id} style={styles.cleanCard}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
                                         <div style={{ width: '28px', height: '28px', backgroundColor: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontWeight: 900, fontSize: '0.9rem' }}>{i + 1}</div>
                                         <span style={{ fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', letterSpacing: '1.2px' }}>
                                             {card.type === 'practice' ? '🧩 Praktikum' : '🔬 Tantangan Mandiri'}
                                         </span>
                                    </div>
                                    
                                    {isEditing ? (
                                        <textarea 
                                            value={card.content} 
                                            onChange={(e) => handleCardContentChange(card.id, e.target.value)}
                                            style={styles.cardTextarea}
                                        />
                                    ) : (
                                        <div style={styles.cardContent}>
                                            {card.content}
                                        </div>
                                    )}
                                    
                                    <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '8pt', color: '#94A3B8', fontWeight: 700 }}>
                                         <span>SDIT Budi Luhur Samarinda</span>
                                         <span>{selectedArea.shortName}-AMI-{i+1}</span>
                                    </div>
                                </div>
                            ))}

                            <div style={{ ...styles.cleanCard, border: '2px dashed #CBD5E1', backgroundColor: '#F8FAFC' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <div style={{ width: '28px', height: '28px', border: '2px solid #94A3B8', borderRadius: '8px' }}></div>
                                    <span style={{ fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '1.2px' }}>✍️ Catatan Guru</span>
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ borderBottom: '1.5px dashed #E2E8F0', height: '14px' }}></div>
                                    <div style={{ borderBottom: '1.5px dashed #E2E8F0', height: '14px' }}></div>
                                    <div style={{ borderBottom: '1.5px dashed #E2E8F0', height: '14px' }}></div>
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
                    .no-print { display: none !important; }
                    @page { margin: 10mm; size: A4 portrait; }
                }
            `}</style>
        </div>
    );
}

const styles = {
    container: { maxWidth: '1300px', margin: '0 auto', padding: '24px', fontFamily: "'Inter', sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', backgroundColor: 'white', borderRadius: '24px', marginBottom: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9' },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '20px' },
    iconBox: { width: '52px', height: '52px', backgroundColor: '#EFF6FF', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    title: { margin: 0, fontSize: '1.4rem', fontWeight: 950, color: '#1E293B', letterSpacing: '-0.5px' },
    subtitle: { margin: '4px 0 0 0', fontSize: '0.9rem', color: '#64748B', fontWeight: 600 },
    printBtn: { backgroundColor: '#3B82F6', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '14px', fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)' },
    editBtn: { border: '1.5px solid #F1F5F9', padding: '12px 20px', borderRadius: '14px', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' },
    grid: { display: 'grid', gridTemplateColumns: '340px 1fr', gap: '32px', alignItems: 'start' },
    sidebar: { backgroundColor: 'white', padding: '28px', borderRadius: '24px', border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' },
    sidebarTitle: { fontSize: '0.9rem', fontWeight: 900, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '0.8rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase' },
    selectWrapper: { position: 'relative' },
    select: { width: '100%', padding: '14px 16px', borderRadius: '14px', border: '2px solid #F1F5F9', backgroundColor: '#F8FAFC', fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', appearance: 'none', cursor: 'pointer', outline: 'none', transition: 'all 0.2s' },
    selectIcon: { position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
    infoBox: { backgroundColor: '#FEFCE8', border: '1px solid #FEF08A', padding: '16px', borderRadius: '16px', display: 'flex', gap: '12px' },
    printableCanvas: { backgroundColor: 'white', boxShadow: '0 30px 60px rgba(0,0,0,0.12)', minHeight: '842px', borderRadius: '16px', padding: '15mm', border: '1px solid #E2E8F0' },
    cardContainer: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' },
    cleanCard: { border: '2.5px solid #0F172A', borderRadius: '16px', padding: '24px', minHeight: '260px', display: 'flex', flexDirection: 'column', backgroundColor: 'white', transition: 'all 0.2s' },
    cardContent: { fontSize: '16pt', margin: 0, color: '#1E293B', fontWeight: 700, lineHeight: 1.5, flex: 1, fontFamily: 'monospace' },
    cardTextarea: { width: '100%', height: '100%', border: 'none', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', fontSize: '12pt', fontWeight: 600, color: '#1E293B', outline: 'none', fontFamily: 'monospace', resize: 'none' },
    successToast: { position: 'fixed', top: '32px', right: '32px', backgroundColor: '#10B981', color: 'white', padding: '16px 24px', borderRadius: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1000, boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)', animation: 'slideIn 0.3s ease-out' }
};
