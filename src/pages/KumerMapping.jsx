import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Search, ChevronRight, CheckCircle2, Link2, BookOpen, Layers, Save, Loader2, Sparkles, AlertTriangle, Info, Plus, X, ArrowRight, RefreshCw } from 'lucide-react';
import { AREA_SENTRA } from '../data/areaSentra';
import { KUMER_CP } from '../data/kumerReference';
import { SMART_KUMER_MAPPING } from '../data/smartKumerMapping';

export default function KumerMapping() {
    const [selectedMapel, setSelectedMapel] = useState('MATEMATIKA');
    const [selectedFase, setSelectedFase] = useState('fase_a');
    const [mappings, setMappings] = useState({}); // Stores: { [cpId]: [materialLabel1, materialLabel2] }
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isPickerOpen, setIsPickerOpen] = useState(null); // Stores cpId being edited

    // Fetch existing mappings from Firestore
    useEffect(() => {
        const fetchMappings = async () => {
            setLoading(true);
            try {
                const docSnap = await getDoc(doc(db, 'settings', 'kumer_gap_analysis'));
                if (docSnap.exists()) {
                    setMappings(docSnap.data());
                } else {
                    // Import from smart mapping on first run
                    const initial = {};
                    for (const [cpId, granules] of Object.entries(SMART_KUMER_MAPPING)) {
                        initial[cpId] = granules;
                    }
                    setMappings(initial);
                }
            } catch (err) {
                console.error("Error fetching mappings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMappings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'settings', 'kumer_gap_analysis'), mappings);
            triggerSuccess("Analisis celah kurikulum berhasil disimpan!");
        } catch (err) {
            console.error("Error saving:", err);
            alert("Gagal menyimpan.");
        } finally {
            setSaving(false);
        }
    };

    const handleSync = () => {
        const newMappings = { ...mappings };
        let count = 0;
        
        // Loop through my smart database and apply to state
        for (const [cpId, granules] of Object.entries(SMART_KUMER_MAPPING)) {
            if (!newMappings[cpId] || newMappings[cpId].length === 0) {
                newMappings[cpId] = granules;
                count++;
            } else {
                // Add missing granules to existing CP mapping
                const existing = newMappings[cpId];
                const toAdd = granules.filter(g => !existing.includes(g));
                if (toAdd.length > 0) {
                    newMappings[cpId] = [...existing, ...toAdd];
                    count++;
                }
            }
        }
        
        setMappings(newMappings);
        triggerSuccess(`Berhasil menyinkronkan ${count} pemetaan cerah!`);
    };

    const triggerSuccess = (msg) => {
        setShowSuccess(msg);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const addMaterialToCP = (cpId, materialLabel) => {
        setMappings(prev => {
            const current = prev[cpId] || [];
            if (current.includes(materialLabel)) return prev;
            return { ...prev, [cpId]: [...current, materialLabel] };
        });
    };

    const removeMaterialFromCP = (cpId, materialLabel) => {
        setMappings(prev => ({
            ...prev,
            [cpId]: (prev[cpId] || []).filter(l => l !== materialLabel)
        }));
    };

    const currentCPList = KUMER_CP[selectedMapel]?.[selectedFase] || [];

    // All available materials from our curriculum to pick from
    const allMaterials = [];
    AREA_SENTRA.forEach(area => {
        area.subAreas.forEach(sub => {
            sub.levels.forEach(lvl => {
                const label = typeof lvl === 'object' ? lvl.label : lvl;
                allMaterials.push({ label, area: area.name, subArea: sub.name });
            });
        });
    });

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.5s', fontFamily: "'Inter', sans-serif" }}>
            
            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', padding: '12px', borderRadius: '16px', color: 'white' }}>
                        <ArrowRight size={24} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 950, margin: 0, color: '#1E293B' }}>Pemetaan CP & Analisis Celah</h1>
                        <p style={{ color: '#64748B', fontWeight: 600, margin: 0 }}>Cek keselarasan kurikulum sekolah dengan Capaian Pembelajaran Nasional.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={handleSync}
                        style={{ 
                            background: '#F5F3FF', color: '#5B21B6', border: '1.5px solid #DDD6FE', padding: '14px 28px', 
                            borderRadius: '16px', fontWeight: 800, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
                        }}
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} /> Sinkronkan Data
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        style={{ 
                            background: '#4F46E5', color: 'white', border: 'none', padding: '14px 28px', 
                            borderRadius: '16px', fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)'
                        }}
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
                        Simpan Analisis
                    </button>
                </div>
            </div>

            {showSuccess && (
                <div style={{ backgroundColor: '#EEF2FF', color: '#4338CA', padding: '16px', borderRadius: '12px', border: '1px solid #C7D2FE', marginBottom: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={20} /> {showSuccess}
                </div>
            )}

            {/* MAPEL & FASE SELECTOR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', background: 'white', padding: '6px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    {Object.keys(KUMER_CP).map(mapel => (
                        <button 
                            key={mapel}
                            onClick={() => setSelectedMapel(mapel)}
                            style={{ 
                                padding: '10px 20px', borderRadius: '10px', border: 'none',
                                background: selectedMapel === mapel ? '#4F46E5' : 'transparent', 
                                color: selectedMapel === mapel ? 'white' : '#64748B',
                                fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem'
                            }}
                        >
                            {mapel.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        onClick={() => setSelectedFase('fase_a')}
                        style={{ 
                            padding: '10px 20px', borderRadius: '10px', border: '1px solid #E2E8F0',
                            background: selectedFase === 'fase_a' ? '#1E293B' : 'white', 
                            color: selectedFase === 'fase_a' ? 'white' : '#64748B',
                            fontWeight: 800, cursor: 'pointer'
                        }}
                    >
                        Fase A (Kls 1-2)
                    </button>
                    <button 
                        onClick={() => setSelectedFase('fase_b')}
                        style={{ 
                            padding: '10px 20px', borderRadius: '10px', border: '1px solid #E2E8F0',
                            background: selectedFase === 'fase_b' ? '#1E293B' : 'white', 
                            color: selectedFase === 'fase_b' ? 'white' : '#64748B',
                            fontWeight: 800, cursor: 'pointer'
                        }}
                    >
                        Fase B (Kls 3)
                    </button>
                </div>
            </div>

            {/* CP LISTING (THE MAIN TABLE) */}
            {loading ? (
                <div style={{ padding: '100px', textAlign: 'center' }}><Loader2 className="animate-spin" size={40} color="#4F46E5" /></div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {currentCPList.map((cp, idx) => {
                        const linkedMaterials = mappings[cp.id] || [];
                        const hasGap = linkedMaterials.length === 0;

                        return (
                            <div key={cp.id} style={{ 
                                background: 'white', borderRadius: '24px', border: `2px solid ${hasGap ? '#FEE2E2' : '#F1F5F9'}`,
                                overflow: 'hidden', boxShadow: hasGap ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {/* CP Side (Pemerintah) */}
                                    <div style={{ flex: '1', minWidth: '350px', padding: '24px', backgroundColor: hasGap ? '#FFF1F1' : '#F8FAFC', borderRight: '1px solid #F1F5F9' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 900, background: '#1E293B', color: 'white', padding: '2px 8px', borderRadius: '6px' }}>{cp.elemen}</span>
                                            {hasGap && <span style={{ fontSize: '0.7rem', fontWeight: 900, background: '#EF4444', color: 'white', padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <AlertTriangle size={12} /> CELAH KURIKULUM
                                            </span>}
                                        </div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', lineHeight: 1.5, margin: 0 }}>
                                            {cp.cp}
                                        </h3>
                                        <div style={{ marginTop: '16px', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>ID: {cp.id}</div>
                                    </div>

                                    {/* Granul Side (Montessori Budi Luhur) */}
                                    <div style={{ flex: '1.2', minWidth: '400px', padding: '24px' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                            Implementasi Granul Montessori (Kita)
                                            <span>{linkedMaterials.length} Materi</span>
                                        </div>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {linkedMaterials.map((m, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F0FDF4', border: '1px solid #DCFCE7', padding: '10px 14px', borderRadius: '12px' }}>
                                                    <CheckCircle2 size={16} color="#10B981" />
                                                    <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>{m}</div>
                                                    <button onClick={() => removeMaterialFromCP(cp.id, m)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={16} /></button>
                                                </div>
                                            ))}
                                            
                                            <button 
                                                onClick={() => setIsPickerOpen(cp.id)}
                                                style={{ 
                                                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', 
                                                    borderRadius: '12px', border: '1.5px dashed #CBD5E1', background: 'transparent',
                                                    color: '#64748B', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                                                }}
                                            >
                                                <Plus size={16} /> Tambah Materi Penghubung
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MATERIAL PICKER MODAL */}
            {isPickerOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontWeight: 900 }}>Pilih Materi Montessori</h3>
                            <button onClick={() => setIsPickerOpen(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <div style={{ padding: '16px 24px', backgroundColor: '#F8FAFC' }}>
                             <div style={{ position: 'relative' }}>
                                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={18} />
                                <input type="text" placeholder="Cari materi (misal: Golden Beads)..." style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }} onChange={(e) => {/* Implement search if needed */}} />
                             </div>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px' }}>
                            {allMaterials.map((mat, i) => {
                                const isLinked = (mappings[isPickerOpen] || []).includes(mat.label);
                                return (
                                    <div 
                                        key={i} 
                                        onClick={() => addMaterialToCP(isPickerOpen, mat.label)}
                                        style={{ 
                                            padding: '12px', borderRadius: '12px', marginBottom: '4px', cursor: 'pointer',
                                            backgroundColor: isLinked ? '#F0FDF4' : 'transparent',
                                            display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.1s'
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isLinked ? '#166534' : '#1E293B' }}>{mat.label}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{mat.area} › {mat.subArea}</div>
                                        </div>
                                        {isLinked ? <CheckCircle2 size={18} color="#10B981" /> : <Plus size={18} color="#CBD5E1" />}
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #F1F5F9', textAlign: 'right' }}>
                            <button onClick={() => setIsPickerOpen(null)} style={{ background: '#1E293B', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>Selesai</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
