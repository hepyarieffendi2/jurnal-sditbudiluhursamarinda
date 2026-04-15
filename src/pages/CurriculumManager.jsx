import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Edit3, Save, Plus, Trash2, Search, Video, Hash, Leaf, Globe2, Moon, Wand2, Loader2, X, ChevronRight, Package, Book, Sparkles, Activity, MessageSquare, Tag, LayoutGrid, Globe, Heart, ArrowLeft, Palette, Languages, Lightbulb, Calculator, FlaskConical, Filter } from 'lucide-react';
import InventoryModal from './InventoryModal';
import { AREA_SENTRA } from '../data/areaSentra';
import { AREA_SENTRA_CYCLE2 } from '../data/areaSentraCycle2';
import { db } from '../firebase-config';
import { collection, getDocs, setDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const getIcon = (iconName) => {
    switch (iconName) {
        case 'Moon': return <Moon size={20} />;
        case 'Hash': return <Hash size={20} />;
        case 'BookOpen': return <BookOpen size={20} />;
        case 'Leaf': return <Leaf size={20} />;
        case 'Globe2': return <Globe2 size={20} />;
        case 'Wand2': return <Wand2 size={20} />;
        default: return <BookOpen size={20} />;
    }
};

export default function CurriculumManager() {
    const [curriculum, setCurriculum] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeAreaId, setActiveAreaId] = useState(null);
    const [activeSubAreaId, setActiveSubAreaId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeGradeFilter, setActiveGradeFilter] = useState('Semua');
    const [editingItem, setEditingItem] = useState(null); // { label, originalLabel, data, grades, areaColor }
    const [detailDrawerItem, setDetailDrawerItem] = useState(null); // 🚀 New: Detail Drawer State
    const [showShoppingList, setShowShoppingList] = useState(false);
    const [expandedCard, setExpandedCard] = useState(null);

    // CRUD States for Area & SubArea
    const [editingArea, setEditingArea] = useState(null);
    const [editingSubArea, setEditingSubArea] = useState(null);
    const [showAreaModal, setShowAreaModal] = useState(false);
    const [showSubAreaModal, setShowSubAreaModal] = useState(false);

    const [areaForm, setAreaForm] = useState({ id: '', name: '', shortName: '', icon: 'BookOpen', color: '#3B82F6', bgColor: '#EFF6FF' });
    const [subAreaForm, setSubAreaForm] = useState({ id: '', name: '' });

    const [showMaterialModal, setShowMaterialModal] = useState(false);
    const [materialForm, setMaterialForm] = useState({ indLabel: '', engLabel: '', grades: ['K1'] });

    const toolRef = useRef(null);
    const stepsRef = useRef(null);
    const errorRef = useRef(null);
    const videoRef = useRef(null);

    const seedCycle2 = async () => {
        if (!window.confirm("Bunda, apakah yakin ingin menyelaraskan Kurikulum? Video URL yang sudah ada di Database akan tetap dipertahankan, namun langkah-langkah presentasi akan diperbarui sesuai standar terbaru.")) return;
        setLoading(true);
        try {
            const collRef = collection(db, 'kurikulum_pusat');
            const snapshot = await getDocs(collRef);

            // 1. Ambil data Video URL existing agar tidak hilang
            const existingVideoMap = {}; // Key: areaId|subAreaId|levelLabel
            snapshot.docs.forEach(docSnap => {
                const area = docSnap.data();
                area.subAreas?.forEach(sa => {
                    sa.levels?.forEach(lvl => {
                        const label = typeof lvl === 'object' ? lvl.label : lvl;
                        const videoUrl = typeof lvl === 'object' ? lvl.presentation?.videoUrl : null;
                        if (videoUrl) {
                            existingVideoMap[`${docSnap.id}|${sa.id}|${label}`] = videoUrl;
                        }
                    });
                });
            });

            console.log("Ditemukan " + snapshot.size + " area lama. Sedang menyelaraskan...");

            // 2. Bersihkan data lama (Opsional, tapi jika ID berubah ini berguna)
            for (const docSnap of snapshot.docs) {
                await deleteDoc(doc(db, 'kurikulum_pusat', docSnap.id));
            }

            // 3. Inject Video URL lama ke data AREA_SENTRA_CYCLE2 yang baru
            const finalData = AREA_SENTRA_CYCLE2.map(area => {
                const newSubAreas = area.subAreas.map(sa => {
                    const newLevels = sa.levels.map(lvl => {
                        const label = typeof lvl === 'object' ? lvl.label : lvl;
                        const key = `${area.id}|${sa.id}|${label}`;

                        if (existingVideoMap[key]) {
                            // Jika materi berupa object, inject ke presentation
                            if (typeof lvl === 'object') {
                                return {
                                    ...lvl,
                                    presentation: {
                                        ...(lvl.presentation || {}),
                                        videoUrl: existingVideoMap[key]
                                    }
                                };
                            } else {
                                // Jika materi berupa string, ubah jadi object agar bisa simpan videoUrl
                                return {
                                    label: lvl,
                                    presentation: { videoUrl: existingVideoMap[key], steps: [] }
                                };
                            }
                        }
                        return lvl;
                    });
                    return { ...sa, levels: newLevels };
                });
                return { ...area, subAreas: newSubAreas };
            });

            // 4. Unggah data yang sudah di-merge
            for (const area of finalData) {
                await setDoc(doc(db, 'kurikulum_pusat', area.id), area);
            }

            alert("Sihir AI Berhasil! Kurikulum telah diperbarui dan Link Video Anda tetap aman terjaga. ✨");
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert("Gagal menyuntikkan data: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Curriculum from Firestore
    useEffect(() => {
        const fetchCurriculum = async () => {
            try {
                const collRef = collection(db, 'kurikulum_pusat');
                const snapshot = await getDocs(collRef);

                let fetchedData = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));

                // SEEDING: If empty, inject initial AREA_SENTRA to Firestore
                if (fetchedData.length === 0) {
                    console.log("Database kosong. Memulai Seeding Kurikulum Awal...");
                    for (const area of AREA_SENTRA) {
                        await setDoc(doc(db, 'kurikulum_pusat', area.id), area);
                    }
                    fetchedData = AREA_SENTRA;
                    alert("Sistem berhasil menanamkan data awal kurikulum ke Database Firestore!");
                }

                // Sort to maintain original array order based on AREA_SENTRA data map
                const orderMap = {};
                AREA_SENTRA.forEach((item, idx) => orderMap[item.id] = idx);
                AREA_SENTRA_CYCLE2.forEach((item, idx) => { if (!orderMap[item.id]) orderMap[item.id] = idx + 10; });
                fetchedData.sort((a, b) => (orderMap[a.id] ?? 99) - (orderMap[b.id] ?? 99));

                setCurriculum(fetchedData);
                if (fetchedData.length > 0) setActiveAreaId(fetchedData[0].id);

                // Auto-fix: Ensure all materials have a grades array based on their label if missing
                const needsFix = fetchedData.some(area =>
                    area.subAreas?.some(sa =>
                        sa.levels?.some(lvl => typeof lvl === 'object' && !lvl.grades)
                    )
                );

                if (needsFix) {
                    console.log("Migrasi data: Menyisipkan array grades ke materi...");
                    const fixedData = fetchedData.map(area => ({
                        ...area,
                        subAreas: area.subAreas?.map(sa => ({
                            ...sa,
                            levels: sa.levels?.map(lvl => {
                                if (typeof lvl !== 'object') return { label: lvl, grades: lvl.match(/^(K\d|3Y|K\d-K\d)/)?.[0]?.split('-') || ['K1'] };
                                if (lvl.grades) return lvl;
                                const label = lvl.label || "";
                                const gradesMatch = label.match(/^(K\d|3Y|K\d-K\d)/);
                                const grades = gradesMatch ? gradesMatch[0].split('-') : ['K1'];
                                return { ...lvl, grades };
                            })
                        }))
                    }));
                    setCurriculum(fixedData);
                }

            } catch (error) {
                console.error("Gagal menarik data kurikulum: ", error);
                alert("Gagal terhubung ke Database. Menggunakan data simulasi sementara.");
                setCurriculum(AREA_SENTRA);
                setActiveAreaId(AREA_SENTRA[0]?.id);
            } finally {
                setLoading(false);
            }
        };
        fetchCurriculum();
    }, []);

    const activeArea = curriculum.find(a => a.id === activeAreaId);
    const activeSubArea = activeArea?.subAreas?.find(sa => sa.id === activeSubAreaId) || activeArea?.subAreas?.[0];

    // CRUD HANDLERS
    const handleAddArea = async () => {
        if (!areaForm.id || !areaForm.name) return alert("ID dan Nama wajib diisi!");
        setLoading(true);
        try {
            const newArea = { ...areaForm, subAreas: [] };
            await setDoc(doc(db, 'kurikulum_pusat', areaForm.id), newArea);
            setCurriculum(prev => [...prev, newArea]);
            setShowAreaModal(false);
            setAreaForm({ id: '', name: '', shortName: '', icon: 'BookOpen', color: '#3B82F6', bgColor: '#EFF6FF' });
        } catch (e) {
            alert("Gagal menambah area: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateArea = async () => {
        if (!editingArea) return;
        setLoading(true);
        try {
            const updatedArea = { ...editingArea, ...areaForm };
            await updateDoc(doc(db, 'kurikulum_pusat', editingArea.id), updatedArea);
            setCurriculum(prev => prev.map(a => a.id === editingArea.id ? updatedArea : a));
            setShowAreaModal(false);
            setEditingArea(null);
        } catch (e) {
            alert("Gagal update area: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteArea = async (id) => {
        if (!window.confirm("Bunda, yakin ingin menghapus seluruh Sentra ini? Seluruh kategori & materi di dalamnya akan hilang selamanya.")) return;
        setLoading(true);
        try {
            await deleteDoc(doc(db, 'kurikulum_pusat', id));
            setCurriculum(prev => prev.filter(a => a.id !== id));
            if (activeAreaId === id) setActiveAreaId(curriculum.find(a => a.id !== id)?.id || null);
        } catch (e) {
            alert("Gagal menghapus area: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubArea = async () => {
        if (!activeArea || !subAreaForm.name) return;
        setLoading(true);
        try {
            const newId = subAreaForm.id || subAreaForm.name.toLowerCase().replace(/\s+/g, '_');
            const newSubArea = { id: newId, name: subAreaForm.name, levels: [] };
            const updatedSubAreas = [...(activeArea.subAreas || []), newSubArea];

            await updateDoc(doc(db, 'kurikulum_pusat', activeAreaId), { subAreas: updatedSubAreas });
            setCurriculum(prev => prev.map(a => a.id === activeAreaId ? { ...a, subAreas: updatedSubAreas } : a));
            setShowSubAreaModal(false);
            setSubAreaForm({ id: '', name: '' });
        } catch (e) {
            alert("Gagal menambah sub-area: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSubArea = async () => {
        if (!activeArea || !editingSubArea) return;
        setLoading(true);
        try {
            const updatedSubAreas = activeArea.subAreas.map(sa =>
                sa.id === editingSubArea.id ? { ...sa, name: subAreaForm.name } : sa
            );

            await updateDoc(doc(db, 'kurikulum_pusat', activeAreaId), { subAreas: updatedSubAreas });
            setCurriculum(prev => prev.map(a => a.id === activeAreaId ? { ...a, subAreas: updatedSubAreas } : a));
            setShowSubAreaModal(false);
            setEditingSubArea(null);
        } catch (e) {
            alert("Gagal update sub-area: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubArea = async (subId) => {
        if (!window.confirm("Hapus kategori ini beserta seluruh materinya?")) return;
        setLoading(true);
        try {
            const updatedSubAreas = activeArea.subAreas.filter(sa => sa.id !== subId);
            await updateDoc(doc(db, 'kurikulum_pusat', activeAreaId), { subAreas: updatedSubAreas });
            setCurriculum(prev => prev.map(a => a.id === activeAreaId ? { ...a, subAreas: updatedSubAreas } : a));
            if (activeSubAreaId === subId) setActiveSubAreaId(updatedSubAreas[0]?.id || null);
        } catch (e) {
            alert("Gagal menghapus sub-area: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMaterial = async (label) => {
        if (!activeArea) return;
        if (!window.confirm(`Hapus materi "${label.split(':').pop().trim()}"?`)) return;
        setLoading(true);
        try {
            const updatedSubAreas = activeArea.subAreas.map(sa => {
                const exists = sa.levels.some(lvl => (typeof lvl === 'object' ? lvl.label : lvl) === label);
                if (!exists) return sa;
                return { ...sa, levels: sa.levels.filter(lvl => (typeof lvl === 'object' ? lvl.label : lvl) !== label) };
            });

            await updateDoc(doc(db, 'kurikulum_pusat', activeAreaId), { subAreas: updatedSubAreas });
            setCurriculum(prev => prev.map(a => a.id === activeAreaId ? { ...a, subAreas: updatedSubAreas } : a));
        } catch (e) {
            alert("Gagal menghapus materi: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMaterial = async () => {
        if (!activeArea || !activeSubArea || !materialForm.indLabel) return;
        if (materialForm.grades.length === 0) return alert("Pilih minimal satu jenjang kelas!");

        setLoading(true);
        try {
            const sortedGrades = [...materialForm.grades].sort();
            const gradePrefix = sortedGrades.join('-');
            const label = `${gradePrefix}: ${materialForm.indLabel}${materialForm.engLabel ? ` / ${materialForm.engLabel}` : ''}`;

            const newMaterial = {
                label,
                grades: sortedGrades,
                presentation: { tool: '', steps: [], error: '', videoUrl: '' }
            };

            const updatedSubAreas = activeArea.subAreas.map(sa => {
                if (sa.id !== activeSubArea.id) return sa;
                return { ...sa, levels: [...(sa.levels || []), newMaterial] };
            });

            await updateDoc(doc(db, 'kurikulum_pusat', activeAreaId), { subAreas: updatedSubAreas });
            setCurriculum(prev => prev.map(a => a.id === activeAreaId ? { ...a, subAreas: updatedSubAreas } : a));
            setShowMaterialModal(false);
            setMaterialForm({ indLabel: '', engLabel: '', grades: ['K1'] });
        } catch (e) {
            alert("Gagal menambah materi: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingItem || !activeArea) return;
        setLoading(true);

        try {
            const sortedGrades = [...editingItem.grades].sort();
            const gradePrefix = sortedGrades.join('-');
            const currentPureLabel = editingItem.label.includes(': ') ? editingItem.label.split(': ').slice(1).join(': ') : editingItem.label;
            const newFullLabel = `${gradePrefix}: ${currentPureLabel}`;

            const updatedSubAreas = activeArea.subAreas.map(sa => {
                const materialExists = sa.levels.some(lvl => (typeof lvl === 'object' ? lvl.label : lvl) === editingItem.originalLabel);
                if (!materialExists) return sa;

                const updatedLevels = sa.levels.map(lvl => {
                    const oldLabel = (typeof lvl === 'object') ? lvl.label : lvl;
                    if (oldLabel !== editingItem.originalLabel) return lvl;

                    const baseData = typeof lvl === 'object' ? lvl : { label: lvl };
                    return {
                        ...baseData,
                        label: newFullLabel,
                        grades: sortedGrades,
                        presentation: {
                            tool: toolRef.current?.value || '',
                            steps: stepsRef.current?.value ? stepsRef.current.value.split('\n').filter(s => s.trim() !== '') : [],
                            error: errorRef.current?.value || '',
                            videoUrl: videoRef.current?.value || ''
                        }
                    };
                });
                return { ...sa, levels: updatedLevels };
            });

            await updateDoc(doc(db, 'kurikulum_pusat', activeAreaId), { subAreas: updatedSubAreas });
            setCurriculum(prev => prev.map(a => a.id === activeAreaId ? { ...a, subAreas: updatedSubAreas } : a));
            setEditingItem(null);
        } catch (e) {
            alert("Gagal menyimpan perubahan: " + e.message);
        } finally {
            setLoading(false);
        }
    };


    const generateAIGuide = () => {
        const materialName = editingItem.label.split(': ')[1]?.split(' / ')[0]?.trim();
        if (!materialName) return;

        // AI Knowledge Base: Real Sentra Presentation Guides
        const knowledge = {
            "Konsep & Proses (+ & -)": {
                tool: "Golden Beads (Manik Emas) atau Stamp Game, Kartu Angka Besar & Kecil",
                steps: [
                    "Siapkan alas kerja (karpet).",
                    "Susun angka pertama dengan manik atau prangko.",
                    "Susun angka kedua di bawah angka pertama.",
                    "Gabungkan ('Add') manik/prangko mulai dari kolom Satuan (Units).",
                    "Jika jumlah satuan mencapai 10, lakukan pertukaran (Exchange) ke kolom Puluhan.",
                    "Lanjutkan penggabungan hingga kolom Ribuan.",
                    "Hitung total akhir dan letakkan kartu angka hasil."
                ],
                error: "Jumlah akhir tidak cocok dengan tumpukan manik/prangko asli."
            },
            "Stamp Game": {
                tool: "Kotak Prangko (Stamp Game), Alas Karpet, Kartu Angka",
                steps: [
                    "Ambil prangko sesuai dengan angka yang diminta.",
                    "Atur prangko secara vertikal di kolom yang benar (Satuan, Puluhan, dst).",
                    "Lakukan operasi (+ atau -) dengan menggabungkan atau mengambil prangko.",
                    "Lakukan pertukaran jika prangko di satu kolom melebihi 10."
                ],
                error: "Warna prangko tertukar di kolom yang salah."
            },
            "Golden Beads": {
                tool: "Manik Emas (1, 10, 100, 1000), Kartu Angka Besar",
                steps: [
                    "Perkenalkan hirarki 1 unit, 1 batang (10), 1 lempeng (100), 1 kubus (1000).",
                    "Ajak anak merasakan tekstur dan berat yang berbeda.",
                    "Minta anak 'mengambilkan' jumlah tertentu (misal: 3 Ratusan dan 2 Puluhan)."
                ],
                error: "Jumlah manik tidak sinkron dengan kartu angka."
            },
            "Sandpaper Letters": {
                tool: "Huruf Raba (Sandpaper Letters)",
                steps: [
                    "Raba huruf menggunakan jari telunjuk dan tengah sesuai arah menulis.",
                    "Bunyikan suara huruf (Phonetic Sound), bukan nama huruf.",
                    "Minta anak menirukan bunyi dan rabaannya.",
                    "Gunakan Lessons 3-Period (Ini adalah..., Tunjukkan..., Apa ini?)"
                ],
                error: "Arah rabaan terbalik (tidak sesuai arah menulis)."
            },
            "Seven Continents": {
                tool: "Peta Puzzle Dunia, Globe",
                steps: [
                    "Tunjukkan globe sebagai miniatur bumi.",
                    "Keluarkan potongan benua dari puzzle.",
                    "Sebutkan nama benua sambil diletakkan di tempat yang benar.",
                    "Gunakan lagu benua untuk membantu hafalan."
                ],
                error: "Warna benua tidak pas pada bingkai puzzle."
            }
        };

        const suggested = knowledge[Object.keys(knowledge).find(k => materialName.includes(k))] || {
            tool: `Alat peraga ${materialName}`,
            steps: [`Siapkan alat ${materialName}.`, "Demonstrasikan cara memegang alat.", "Lakukan kegiatan utama.", "Ajak anak mencoba.", "Kembalikan alat ke rak."],
            error: "Hasil akhir tidak sesuai dengan target kegiatan."
        };

        if (toolRef.current) toolRef.current.value = suggested.tool;
        if (stepsRef.current) stepsRef.current.value = suggested.steps.join('\n');
        if (errorRef.current) errorRef.current.value = suggested.error;

        alert(`Magic AI: Panduan Presentasi untuk "${materialName}" berhasil dituangkan! ✨`);
    };

    const getYTThumbnail = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`;
        }
        return null;
    };

    if (loading) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', color: '#64748B' }}>
            <Loader2 size={32} className="animate-spin" />
            <p style={{ fontWeight: 800 }}>Sinkronisasi Kurikulum Pusat...</p>
        </div>
    }

    return (
        <div className="page-container" style={{ padding: '32px 24px', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                        <Sparkles size={16} /> Kurikulum SDIT Budi Luhur Samarinda
                    </div>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#0F172A', margin: 0, letterSpacing: '-1.5px' }}>Album Management</h1>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setShowShoppingList(true)}
                        className="btn-glass"
                        style={{ padding: '12px 18px', borderRadius: '14px', border: '1.5px solid #E2E8F0', background: 'white', color: '#64748B', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Package size={18} /> Inventaris
                    </button>

                    <div style={{ position: 'relative' }}>
                        <button
                            className="btn-primary"
                            onClick={() => {
                                if (window.confirm("Buka panel Sinkronisasi AI?")) seedCycle2();
                            }}
                            style={{ padding: '12px 18px', borderRadius: '14px', background: '#0F172A', color: 'white', border: 'none', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px rgba(15,23,42,0.2)' }}
                        >
                            <Wand2 size={18} /> <span className="tab-text-full">Sync AI</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* TOP NAVIGATION: AREA TABS (Using ShortNames for Efficiency) */}
            <div
                className="area-tabs-container"
                style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '16px',
                    flexWrap: 'wrap',
                    padding: '4px 0'
                }}
            >
                {curriculum.map(area => {
                    const isActive = activeAreaId === area.id;

                    const iconMap = {
                        'Palette': Palette, 'Languages': Languages, 'Lightbulb': Lightbulb,
                        'Calculator': Calculator, 'FlaskConical': FlaskConical, 'Globe': Globe,
                        'Heart': Heart, 'BookOpen': BookOpen, 'LayoutGrid': LayoutGrid, 'Activity': Activity
                    };
                    const IconComponent = iconMap[area.icon] || BookOpen;

                    return (
                        <div key={area.id} style={{ position: 'relative' }} onMouseEnter={e => e.currentTarget.querySelector('.area-actions').style.opacity = 1} onMouseLeave={e => e.currentTarget.querySelector('.area-actions').style.opacity = 0}>
                            <button
                                onClick={() => {
                                    setActiveAreaId(area.id);
                                    if (area.subAreas?.length > 0) setActiveSubAreaId(area.subAreas[0].id);
                                }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '14px',
                                    backgroundColor: isActive ? area.color : 'white',
                                    color: isActive ? 'white' : '#64748B',
                                    border: isActive ? 'none' : '1.5px solid #F1F5F9',
                                    fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                                    boxShadow: isActive ? `0 8px 16px ${area.color}20` : '0 2px 4px rgba(0,0,0,0.02)',
                                    fontSize: '0.8rem'
                                }}
                            >
                                <IconComponent size={16} /> {area.shortName.toUpperCase()}
                            </button>
                            <div className="area-actions" style={{ position: 'absolute', top: '-8px', right: '0', display: 'flex', gap: '4px', opacity: 0, transition: 'opacity 0.2s', zIndex: 20 }}>
                                <button onClick={(e) => { e.stopPropagation(); setEditingArea(area); setAreaForm(area); setShowAreaModal(true); }} style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', shadow: '0 2px 5px rgba(0,0,0,0.1)' }}><Edit3 size={10} /></button>
                            </div>
                        </div>
                    );
                })}
                <button
                    onClick={() => { setEditingArea(null); setAreaForm({ id: '', name: '', shortName: '', icon: 'BookOpen', color: '#3B82F6', bgColor: '#EFF6FF' }); setShowAreaModal(true); }}
                    style={{
                        padding: '10px 18px', borderRadius: '14px', border: '1.5px dashed #CBD5E1',
                        backgroundColor: 'transparent', color: '#64748B', fontSize: '0.8rem', fontWeight: 800,
                        display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
                    }}
                >
                    <Plus size={14} /> NEW
                </button>
            </div>

            {/* GLOBAL GRADE FILTER BAR (Below Navbar) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', backgroundColor: '#F1F5F9', padding: '6px', borderRadius: '16px', width: 'fit-content' }}>
                <div style={{ padding: '0 12px', fontSize: '0.65rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filter Kelas:</div>
                {['Semua', 'K1', 'K2', 'K3'].map(g => (
                    <button
                        key={g}
                        onClick={() => setActiveGradeFilter(g)}
                        style={{
                            border: 'none',
                            background: activeGradeFilter === g ? 'white' : 'transparent',
                            color: activeGradeFilter === g ? '#0F172A' : '#64748B',
                            fontSize: '0.75rem', fontWeight: 800, padding: '8px 20px', borderRadius: '12px',
                            cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: activeGradeFilter === g ? '0 4px 10px rgba(0,0,0,0.05)' : 'none'
                        }}
                    >
                        {g === 'Semua' ? 'SEMUA KELAS' : `KELAS ${g.slice(1)}`}
                    </button>
                ))}
            </div>

            {/* FULL WIDTH COMPARTMENT: TWO-COLUMN LAYOUT */}
            <div style={{
                width: '100%', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '28px',
                minHeight: '750px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.03)', position: 'relative'
            }}>
                {activeArea && (
                    <>
                        {/* 2. MAIN CONTENT AREA (SIDEBAR + LIST) */}
                        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                            {/* LEFT SIDEBAR: CATEGORIES */}
                            <div style={{
                                width: '300px', borderRight: '1px solid #F1F5F9', backgroundColor: '#FBFDFF',
                                padding: '24px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px'
                            }}>
                                <div style={{ padding: '0 12px 12px 12px', fontSize: '0.7rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Katalog Kategori</div>

                                {(() => {
                                    const saWithMetrics = activeArea.subAreas?.map(sa => {
                                        const filtered = sa.levels.filter(lvl => {
                                            const grades = typeof lvl === 'object' ? (lvl.grades || []) : [];
                                            const label = typeof lvl === 'object' ? lvl.label : lvl;

                                            if (activeGradeFilter === 'Semua') return true;
                                            return grades.includes(activeGradeFilter) || grades.includes('3Y');
                                        });
                                        return { ...sa, filteredCount: filtered.length };
                                    }) || [];

                                    return saWithMetrics.sort((a, b) => b.filteredCount - a.filteredCount).map(subArea => {
                                        const isActive = activeSubAreaId === subArea.id;
                                        const isEmpty = subArea.filteredCount === 0 && activeGradeFilter !== 'Semua';

                                        return (
                                            <div key={subArea.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onMouseEnter={e => e.currentTarget.querySelector('.subarea-actions').style.opacity = 1} onMouseLeave={e => e.currentTarget.querySelector('.subarea-actions').style.opacity = 0}>
                                                <button
                                                    onClick={() => { setActiveSubAreaId(subArea.id); setSearchTerm(''); }}
                                                    style={{
                                                        flex: 1, padding: '12px 16px', borderRadius: '16px', fontWeight: 800, fontSize: '0.85rem',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
                                                        cursor: 'pointer', outline: 'none', transition: 'all 0.2s', border: 'none',
                                                        backgroundColor: isActive ? activeArea.bgColor : 'transparent',
                                                        color: isActive ? activeArea.color : '#475569',
                                                        opacity: isEmpty ? 0.35 : 1,
                                                        textAlign: 'left',
                                                        order: isEmpty ? 99 : 0,
                                                        marginBottom: '4px'
                                                    }}
                                                >
                                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                        <span style={{ fontSize: '0.88rem', fontWeight: 800, lineHeight: '1.2' }}>
                                                            {subArea.name.split(' / ')[0]}
                                                        </span>
                                                        {subArea.name.includes(' / ') && (
                                                            <span style={{
                                                                fontSize: '0.72rem',
                                                                fontWeight: 600,
                                                                color: isActive ? `${activeArea.color}99` : '#94A3B8',
                                                                letterSpacing: '0.2px'
                                                            }}>
                                                                {subArea.name.split(' / ')[1]}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span style={{
                                                        backgroundColor: isActive ? 'white' : '#F1F5F9',
                                                        color: isActive ? activeArea.color : '#94A3B8',
                                                        padding: '2px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900,
                                                        minWidth: '24px', textAlign: 'center', border: isActive ? `1px solid ${activeArea.color}20` : '1px solid transparent'
                                                    }}>
                                                        {subArea.filteredCount}
                                                    </span>
                                                </button>
                                                <div className="subarea-actions" style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0, transition: 'opacity 0.2s' }}>
                                                    <button onClick={(e) => { e.stopPropagation(); setEditingSubArea(subArea); setSubAreaForm({ name: subArea.name }); setShowSubAreaModal(true); }} style={{ width: '24px', height: '24px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}><Edit3 size={14} /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteSubArea(subArea.id); }} style={{ width: '24px', height: '24px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}

                                <button
                                    onClick={() => { setEditingSubArea(null); setSubAreaForm({ id: '', name: '' }); setShowSubAreaModal(true); }}
                                    style={{
                                        marginTop: '12px', padding: '12px 16px', borderRadius: '16px', fontWeight: 700, fontSize: '0.8rem',
                                        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', outline: 'none',
                                        border: '1px dashed #CBD5E1', backgroundColor: 'transparent', color: '#94A3B8', transition: 'all 0.2s'
                                    }}
                                >
                                    <Plus size={16} /> Tambah Sub-Area
                                </button>
                            </div>

                            {/* RIGHT CONTENT: MATERIAL LIST */}
                            <div style={{ flex: 1, backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

                                {/* RIGHT COLUMN HEADER: Area Info & Category Title */}
                                <div style={{ padding: '32px 32px 24px', backgroundColor: 'white' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: activeArea.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeArea.color }}>
                                            {(() => {
                                                const iconMap = {
                                                    'Palette': Palette,
                                                    'Languages': Languages,
                                                    'Lightbulb': Lightbulb,
                                                    'Calculator': Calculator,
                                                    'FlaskConical': FlaskConical,
                                                    'Globe': Globe,
                                                    'Heart': Heart,
                                                    'BookOpen': BookOpen,
                                                    'LayoutGrid': LayoutGrid,
                                                    'Activity': Activity
                                                };
                                                const IconComp = iconMap[activeArea.icon] || BookOpen;
                                                return <IconComp size={20} />;
                                            })()}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 950, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                {activeArea.name}
                                            </div>
                                            <h2 style={{ fontSize: '1.4rem', fontWeight: 950, color: '#0F172A', margin: 0, lineHeight: 1.1 }}>{activeSubArea?.name}</h2>
                                        </div>
                                    </div>
                                </div>

                                {/* Command Bar: Consolidated Search & Actions (Sticky) */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 32px', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', position: 'sticky', top: 0, zIndex: 10 }}>
                                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                                        <Search size={14} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                        <input
                                            type="text"
                                            placeholder={`Cari materi di ${activeSubArea?.name}...`}
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            style={{ padding: '12px 16px 12px 42px', borderRadius: '14px', border: '1px solid #E2E8F0', fontSize: '0.9rem', outline: 'none', width: '100%', fontWeight: 700, backgroundColor: '#F8FAFC' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: '24px' }}>
                                        <button
                                            onClick={() => setShowMaterialModal(true)}
                                            style={{ background: activeArea.color, color: 'white', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '0.85rem', fontWeight: 950, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: `0 8px 16px ${activeArea.color}25` }}
                                        >
                                            <Plus size={18} /> Tambah Materi
                                        </button>
                                    </div>
                                </div>

                                {/* Scrolling List */}
                                <div style={{ padding: '24px 32px 48px' }}>
                                    {activeArea.subAreas?.filter(sa => searchTerm ? true : sa.id === activeSubArea?.id).map(subArea => {
                                        const filteredLevels = subArea.levels.filter(lvl => {
                                            const grades = typeof lvl === 'object' ? (lvl.grades || []) : [];
                                            const label = typeof lvl === 'object' ? lvl.label : lvl;
                                            if (searchTerm && !label.toLowerCase().includes(searchTerm.toLowerCase())) return false;
                                            if (activeGradeFilter !== 'Semua' && !grades.includes(activeGradeFilter) && !grades.includes('3Y')) return false;
                                            return true;
                                        });

                                        if (filteredLevels.length === 0) return null;

                                        return (
                                            <div key={subArea.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {filteredLevels.map((lvl, index) => {
                                                    const isObject = typeof lvl === 'object';
                                                    const label = isObject ? lvl.label : lvl;
                                                    const rawLabel = label.includes(': ') ? label.split(': ').slice(1).join(': ') : label;
                                                    const [indTitle, engTitle] = rawLabel.split(' / ');
                                                    const rawGradeMatch = label.match(/^(K\d|3Y)/);
                                                    const grade = rawGradeMatch ? rawGradeMatch[1] : '';
                                                    const hasPresentation = isObject && lvl.presentation && lvl.presentation.steps?.length > 1;
                                                    const stepsCount = isObject ? (lvl.presentation?.steps?.filter(s => s.match(/^\d+\./))?.length || 0) : 0;
                                                    const hasTool = isObject && lvl.presentation && (
                                                        (lvl.presentation.tool && lvl.presentation.tool.length > 5) ||
                                                        (lvl.presentation.toolDisplay && lvl.presentation.toolDisplay.length > 5) ||
                                                        (lvl.presentation.toolsList && lvl.presentation.toolsList.length > 0)
                                                    );
                                                    const hasVideo = isObject && lvl.presentation?.videoUrl;

                                                    const gradeColors = { 'K1': '#3B82F6', 'K2': '#8B5CF6', 'K3': '#F59E0B', '3Y': '#10B981' };

                                                    return (
                                                        <div className="material-card" key={index} style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #F1F5F9', overflow: 'hidden', transition: 'all 0.25s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>

                                                            {/* Card Header — Always visible */}
                                                            <div
                                                                onClick={() => setDetailDrawerItem({
                                                                    lvl,
                                                                    isObject,
                                                                    label,
                                                                    indTitle,
                                                                    engTitle,
                                                                    hasTool,
                                                                    hasPresentation,
                                                                    hasVideo,
                                                                    stepsCount,
                                                                    areaColor: activeArea.color,
                                                                    bgColor: activeArea.bgColor,
                                                                    areaName: activeArea.name
                                                                })}
                                                                style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'background 0.15s' }}
                                                                className="card-header-hover"
                                                            >
                                                                {/* Grade Badge */}
                                                                <div style={{
                                                                    padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900,
                                                                    backgroundColor: `${gradeColors[grade] || '#94A3B8'}15`,
                                                                    color: gradeColors[grade] || '#94A3B8',
                                                                    letterSpacing: '0.5px', flexShrink: 0
                                                                }}>
                                                                    {grade || '?'}
                                                                </div>

                                                                {/* Title */}
                                                                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                    <div style={{
                                                                        fontWeight: 800,
                                                                        fontSize: '0.95rem',
                                                                        color: '#1E293B',
                                                                        lineHeight: '1.3',
                                                                        letterSpacing: '-0.2px'
                                                                    }}>
                                                                        {indTitle}
                                                                    </div>
                                                                    {engTitle && (
                                                                        <div style={{
                                                                            fontSize: '0.78rem',
                                                                            fontWeight: 600,
                                                                            color: '#94A3B8',
                                                                            fontStyle: 'italic',
                                                                            opacity: 0.85
                                                                        }}>
                                                                            {engTitle}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Status Badges */}
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                                                    <div title="Alat Ada" style={{ opacity: hasTool ? 1 : 0.2, color: '#F59E0B' }}><Package size={14} /></div>
                                                                    <div title="Panduan Siap" style={{ opacity: hasPresentation ? 1 : 0.2, color: '#3B82F6' }}><Book size={14} /></div>
                                                                    <div title="Video Ada" style={{ opacity: hasVideo ? 1 : 0.2, color: '#EF4444' }}><Video size={14} /></div>
                                                                    <div style={{ marginLeft: '8px', padding: '3px 8px', borderRadius: '6px', backgroundColor: '#F1F5F9', fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>
                                                                        {stepsCount > 0 ? `${stepsCount} steps` : 'Draft'}
                                                                    </div>
                                                                </div>

                                                                {/* Expand Arrow */}
                                                                <div style={{ marginLeft: '8px', color: '#94A3B8', flexShrink: 0 }}>
                                                                    <ChevronRight size={18} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>


            {/* 🛠️ EDIT/ELABORASI MODAL (CENTERED) */}
            {editingItem && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '20px' }} onClick={() => setEditingItem(null)}>
                    <div
                        style={{ backgroundColor: 'white', width: '100%', maxWidth: '750px', maxHeight: '90vh', borderRadius: '32px', display: 'flex', flexDirection: 'column', animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ padding: '32px 40px', borderBottom: '1px solid #F1F5F9', position: 'relative' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px' }}>Edit Buku Panduan (Album)</h3>
                            <button 
                                onClick={() => setEditingItem(null)}
                                style={{ position: 'absolute', top: 32, right: 32, background: '#F1F5F9', border: 'none', width: 36, height: 36, borderRadius: '50%', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontWeight: 700, color: editingItem.areaColor, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Target Materi: <span style={{ color: '#1E293B' }}>{editingItem.label.split(': ')[1]?.split(' / ')[0]}</span>
                                </div>
                                <button
                                    onClick={generateAIGuide}
                                    style={{ backgroundColor: '#F5F3FF', color: '#7C3AED', border: '1px solid #7C3AED40', borderRadius: '8px', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginRight: 48 }}
                                >
                                    <Wand2 size={14} /> Tuangkan Panduan (AI Magic)
                                </button>
                            </div>
                        </div>

                        <div style={{ padding: '40px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '8px' }}>TARGET KELAS</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {['K1', 'K2', 'K3'].map(g => (
                                        <button
                                            key={g}
                                            onClick={() => {
                                                const newGrades = editingItem.grades.includes(g)
                                                    ? editingItem.grades.filter(x => x !== g)
                                                    : [...editingItem.grades, g];
                                                setEditingItem({ ...editingItem, grades: newGrades });
                                            }}
                                            style={{
                                                flex: 1, padding: '10px', borderRadius: '12px', border: '2px solid',
                                                borderColor: editingItem.grades.includes(g) ? editingItem.areaColor : '#E2E8F0',
                                                backgroundColor: editingItem.grades.includes(g) ? `${editingItem.areaColor}15` : 'white',
                                                color: editingItem.grades.includes(g) ? editingItem.areaColor : '#64748B',
                                                fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                        >
                                            {editingItem.grades.includes(g) ? '✓ ' : ''} Kelas {g.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '8px' }}>Material / Alat yang Diperlukan (APE)</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input ref={toolRef} type="text" defaultValue={editingItem.data?.toolDisplay || (editingItem.data?.toolsList?.join(', ')) || editingItem.data?.tool || ''} placeholder="Contoh: Balok merah biru, alas karpet..." style={{ flex: 1, padding: '14px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', outline: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.2s' }} onFocus={e => e.target.style.borderColor = '#CBD5E1'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                                    <button
                                        onClick={() => {
                                            const tool = toolRef.current?.value || editingItem.label.split(': ')[1]?.split(' / ')[0]?.trim();
                                            window.open(`https://www.google.com/search?q=Montessori+${tool}+material&tbm=isch`, '_blank');
                                        }}
                                        style={{ padding: '0 16px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', color: '#64748B', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <Search size={14} /> Lihat Gambar APE
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '8px' }}>Langkah Presentasi (Baris baru = Langkah baru)</label>
                                <textarea
                                    ref={stepsRef}
                                    defaultValue={editingItem.data?.steps?.join('\n') || ''}
                                    placeholder="1. Gulung karpet&#10;2. Bawa material&#10;3. Demonstrasikan..."
                                    style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', outline: 'none', fontSize: '0.95rem', fontWeight: 500, minHeight: '150px', resize: 'vertical', transition: 'all 0.2s' }}
                                    onFocus={e => e.target.style.borderColor = '#CBD5E1'} onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '8px' }}>Kontrol Kesalahan (Control of Error)</label>
                                <input ref={errorRef} type="text" defaultValue={editingItem.data?.error || ''} placeholder="Bagaimana anak tau kalau dia salah secara mandiri?" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', outline: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.2s' }} onFocus={e => e.target.style.borderColor = '#CBD5E1'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '8px' }}>Link Video Demonstrasi (Youtube, dll)</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        ref={videoRef}
                                        type="text"
                                        defaultValue={editingItem.data?.videoUrl || ''}
                                        placeholder="https://youtube.com/..."
                                        style={{ flex: 1, padding: '14px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', outline: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.2s' }}
                                        onFocus={e => e.target.style.borderColor = '#CBD5E1'} onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                                    />
                                    <button
                                        onClick={() => {
                                            const rawLabel = editingItem.label.includes(': ') ? editingItem.label.split(': ').slice(1).join(': ') : editingItem.label;
                                            const [indTitle, engTitle] = rawLabel.split(' / ');

                                            // Primary terms (English preferably)
                                            // Primary terms (English preferably)
                                            const searchTerms = engTitle || indTitle;

                                            // Clean search terms: remove special chars like (+ & -), (/) etc
                                            const cleanSearch = searchTerms
                                                .replace(/[&+\-\/()]/g, ' ') // Replace special chars with spaces
                                                .replace(/\s+/g, ' ')        // Collapse multiple spaces
                                                .trim();

                                            // Take only the FIRST tool mentioned if there are many (to keep search accurate)
                                            const toolSection = toolRef.current?.value || '';
                                            const primaryTool = toolSection
                                                .split(/[,;|]/)[0]           // Split by separators
                                                .replace(/[&+\-\/()]/g, ' ') // Strip special chars
                                                .trim();

                                            const finalQuery = primaryTool ? `${cleanSearch} ${primaryTool}` : cleanSearch;

                                            window.open(`https://www.youtube.com/results?search_query=Montessori+${finalQuery.trim()}+presentation`, '_blank');
                                        }}
                                        style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '8px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
                                    >
                                        <Video size={18} /> Cari di YouTube
                                    </button>
                                </div>
                            </div>

                        </div>

                        <div style={{ padding: '32px 40px', borderTop: '1px solid #F1F5F9', backgroundColor: '#F8FAFC', borderRadius: '0 0 32px 32px', display: 'flex', gap: '16px' }}>
                            <button onClick={() => setEditingItem(null)} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '2px solid #CBD5E1', background: 'transparent', fontWeight: 800, color: '#64748B', cursor: 'pointer' }}>Batal</button>
                            <button onClick={handleSaveEdit} style={{ flex: 2, padding: '16px', borderRadius: '16px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)' }}>
                                <Save size={20} /> Simpan Panduan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 📘 DETAIL DRAWER (SLIDE FROM RIGHT) */}
            {detailDrawerItem && (
                <div 
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', justifyContent: 'flex-end' }} 
                    onClick={() => setDetailDrawerItem(null)}
                >
                    <div 
                        style={{ background: 'white', width: '100%', maxWidth: '500px', height: '100%', display: 'flex', flexDirection: 'column', animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '-15px 0 50px rgba(0,0,0,0.1)' }} 
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header High Impact Style (from AreaTracker) */}
                        <div style={{ padding: '32px 40px 24px', borderBottom: '1px solid #F1F5F9', background: `${detailDrawerItem.areaColor}05` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                <div style={{ background: detailDrawerItem.areaColor, color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 950, letterSpacing: '1px' }}>
                                    ALBUM PANDUAN
                                </div>
                                <button onClick={() => setDetailDrawerItem(null)} style={{ background: 'white', border: '1px solid #E2E8F0', width: 36, height: 36, borderRadius: '50%', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <X size={20}/>
                                </button>
                            </div>
                            
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 950, color: '#1E293B', lineHeight: 1.2, margin: 0 }}>
                                {detailDrawerItem.indTitle}
                            </h2>
                            {detailDrawerItem.engTitle && (
                                <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 700, fontStyle: 'italic', marginTop: 8 }}>
                                    {detailDrawerItem.engTitle}
                                </p>
                            )}
                            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 800, background: '#F1F5F9', color: '#64748B', padding: '4px 8px', borderRadius: '6px' }}>
                                    MATERI: {detailDrawerItem.areaName}
                                </div>
                                {detailDrawerItem.stepsCount > 0 && (
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, background: `${detailDrawerItem.areaColor}15`, color: detailDrawerItem.areaColor, padding: '4px 8px', borderRadius: '6px' }}>
                                        {detailDrawerItem.stepsCount} LANGKAH
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Scrollable */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px 48px' }}>
                            {/* Apparatus */}
                            {detailDrawerItem.hasTool && (
                                <div style={{ marginBottom: '32px', padding: '20px', backgroundColor: '#FFFBEB', borderRadius: '20px', border: '1px solid #FEF3C7' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 950, color: '#D97706', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Package size={14} /> Alat / Apparatus (APE)
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#92400E', lineHeight: '1.6' }}>
                                        {detailDrawerItem.lvl.presentation.toolDisplay || (detailDrawerItem.lvl.presentation.toolsList?.join(', ')) || detailDrawerItem.lvl.presentation.tool}
                                    </div>
                                </div>
                            )}

                            {/* Steps */}
                            {detailDrawerItem.hasPresentation ? (
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 950, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Activity size={12} /> Langkah Presentasi AMI
                                    </div>
                                    <div className="modern-steps-container">
                                        {(() => {
                                            let stepCounter = 0;
                                            return detailDrawerItem.lvl.presentation.steps.map((step, si) => {
                                                const isHeader = typeof step === 'string' && (step.startsWith('I.') || step.startsWith('--') || step.startsWith('II.') || step.startsWith('III.') || step.startsWith('IV.') || step.startsWith('V.'));

                                                if (isHeader) {
                                                    return (
                                                        <div key={si} className="modern-step-header" style={{ marginTop: si === 0 ? 0 : 24 }}>
                                                            <div className="modern-header-dot" style={{ backgroundColor: detailDrawerItem.areaColor }}></div>
                                                            {step.replace(/---/g, '').replace(/^[IVX]+\.\s*/, '').trim()}
                                                        </div>
                                                    );
                                                }

                                                stepCounter++;
                                                const stepMatch = typeof step === 'string' ? step.match(/^(\d+\.)\s(.*)/) : null;
                                                const stepNum = stepMatch ? stepMatch[1] : `${stepCounter}.`;
                                                const stepText = stepMatch ? stepMatch[2] : step;

                                                return (
                                                    <div key={si} className="modern-step-row">
                                                        <div className="modern-step-num">{stepNum}</div>
                                                        <div className="modern-step-content">
                                                            {typeof stepText === 'string' ? stepText.split(/'([^']+)'/).map((part, index) =>
                                                                index % 2 === 1 ? (
                                                                    <div key={index} className="modern-dialogue-box">
                                                                        <MessageSquare size={12} style={{ marginTop: 4, flexShrink: 0 }} />
                                                                        <span>"{part}"</span>
                                                                    </div>
                                                                ) : part
                                                            ) : stepText}
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '32px 20px', background: '#F8FAFC', borderRadius: '24px', border: '1px dashed #E2E8F0', textAlign: 'center', color: '#94A3B8' }}>
                                    <Sparkles size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
                                    <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>Belum ada langkah presentasi.</p>
                                </div>
                            )}

                            {/* Control of Error */}
                            {detailDrawerItem.lvl.presentation?.error && (
                                <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#FFF1F2', borderRadius: '24px', border: '1px solid #FFE4E6' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 950, color: '#E11D48', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Tag size={14} /> Kontrol Kesalahan
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#9F1239', lineHeight: '1.5' }}>
                                        {detailDrawerItem.lvl.presentation.error}
                                    </div>
                                </div>
                            )}

                            {/* Video Video preview */}
                            {detailDrawerItem.hasVideo && (
                                <div style={{ marginTop: '32px' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 950, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Video size={14} /> Video Tutorial
                                    </div>
                                    <div 
                                        onClick={() => window.open(detailDrawerItem.lvl.presentation.videoUrl, '_blank')}
                                        style={{ 
                                            position: 'relative', width: '100%', borderRadius: '24px', 
                                            overflow: 'hidden', cursor: 'pointer', aspectRatio: '16/9',
                                            background: '#0F172A', border: '1px solid #E2E8F0',
                                            boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {getYTThumbnail(detailDrawerItem.lvl.presentation.videoUrl) ? (
                                            <>
                                                <img src={getYTThumbnail(detailDrawerItem.lvl.presentation.videoUrl)} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '14px solid #EF4444', marginLeft: 4 }}></div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }}>NONTON VIDEO</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Action */}
                        <div style={{ padding: '24px 40px', borderTop: '1px solid #F1F5F9', background: 'white' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button 
                                    onClick={() => {
                                        const { label, isObject, lvl, areaColor } = detailDrawerItem;
                                        const prefix = label.split(': ')[0] || '';
                                        const grades = prefix.split('-').filter(g => ['K1', 'K2', 'K3'].includes(g));
                                        setEditingItem({
                                            label,
                                            originalLabel: label,
                                            data: isObject ? lvl.presentation : null,
                                            grades: grades.length > 0 ? grades : ['K1'],
                                            areaColor
                                        });
                                        setDetailDrawerItem(null);
                                    }}
                                    style={{ flex: 1, padding: '16px', borderRadius: '16px', background: detailDrawerItem.areaColor, color: 'white', fontWeight: 950, fontSize: '0.9rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 10px 20px ${detailDrawerItem.areaColor}40` }}
                                >
                                    <Edit3 size={18} /> EDIT MATERI
                                </button>
                                <button 
                                    onClick={() => {
                                        if (window.confirm(`Hapus materi "${detailDrawerItem.indTitle}"?`)) {
                                            handleDeleteMaterial(detailDrawerItem.label);
                                            setDetailDrawerItem(null);
                                        }
                                    }}
                                    style={{ padding: '16px', borderRadius: '16px', background: '#FEF2F2', color: '#EF4444', border: '2px solid #FEE2E2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 🏙️ AREA MODAL */}
            {showAreaModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={() => setShowAreaModal(false)}>
                    <div
                        style={{ backgroundColor: 'white', width: '450px', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '24px', color: '#1E293B' }}>{editingArea ? 'Edit Sentra Belajar' : 'Tambah Sentra Baru'}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {!editingArea && (
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>ID AREA (UNIK)</label>
                                    <input value={areaForm.id} onChange={e => setAreaForm({ ...areaForm, id: e.target.value.toLowerCase().replace(/\s+/g, '_') })} placeholder="contoh: matematika" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} />
                                </div>
                            )}
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>NAMA LENGKAP</label>
                                <input value={areaForm.name} onChange={e => setAreaForm({ ...areaForm, name: e.target.value })} placeholder="contoh: Matematika & Logika" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>NAMA SINGKAT (PADA TAB)</label>
                                <input value={areaForm.shortName} onChange={e => setAreaForm({ ...areaForm, shortName: e.target.value })} placeholder="contoh: MATH" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>WARNA TEMA</label>
                                    <input type="color" value={areaForm.color} onChange={e => {
                                        const hex = e.target.value;
                                        setAreaForm({ ...areaForm, color: hex, bgColor: hex + '15' });
                                    }} style={{ width: '100%', height: '44px', padding: '4px', borderRadius: '12px', border: '1px solid #E2E8F0', cursor: 'pointer' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>ICON</label>
                                    <select value={areaForm.icon} onChange={e => setAreaForm({ ...areaForm, icon: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: 700 }}>
                                        <option value="BookOpen">BookOpen</option>
                                        <option value="Hash">Hash</option>
                                        <option value="Moon">Moon</option>
                                        <option value="Leaf">Leaf</option>
                                        <option value="Globe2">Globe2</option>
                                        <option value="Wand2">Wand2</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowAreaModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontWeight: 800, cursor: 'pointer' }}>Batal</button>
                            <button onClick={editingArea ? handleUpdateArea : handleAddArea} style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: areaForm.color, color: 'white', fontWeight: 800, cursor: 'pointer', boxShadow: `0 8px 20px ${areaForm.color}30` }}>
                                {editingArea ? 'Simpan Perubahan' : 'Tambah Sentra'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 📂 SUBAREA MODAL */}
            {showSubAreaModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={() => setShowSubAreaModal(false)}>
                    <div
                        style={{ backgroundColor: 'white', width: '400px', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '24px', color: '#1E293B' }}>{editingSubArea ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>NAMA KATEGORI</label>
                                <input value={subAreaForm.name} onChange={e => setSubAreaForm({ ...subAreaForm, name: e.target.value })} placeholder="contoh: Geografi Fisik / Physical Geography" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} />
                            </div>
                        </div>
                        <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowSubAreaModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontWeight: 800, cursor: 'pointer' }}>Batal</button>
                            <button onClick={editingSubArea ? handleUpdateSubArea : handleAddSubArea} style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: activeArea?.color || '#3B82F6', color: 'white', fontWeight: 800, cursor: 'pointer', boxShadow: `0 8px 20px ${activeArea?.color}30` }}>
                                {editingSubArea ? 'Update Kategori' : 'Tambah Kategori'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 📚 MATERIAL MODAL */}
            {showMaterialModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={() => setShowMaterialModal(false)}>
                    <div
                        style={{ backgroundColor: 'white', width: '500px', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '24px', color: '#1E293B' }}>Tambah Material Baru</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '8px' }}>PILIH KELAS — BISA LEBIH DARI SATU</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {['K1', 'K2', 'K3'].map(g => (
                                        <button
                                            key={g}
                                            onClick={() => {
                                                const newGrades = materialForm.grades.includes(g)
                                                    ? materialForm.grades.filter(x => x !== g)
                                                    : [...materialForm.grades, g];
                                                setMaterialForm({ ...materialForm, grades: newGrades });
                                            }}
                                            style={{
                                                flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid',
                                                borderColor: materialForm.grades.includes(g) ? 'var(--primary)' : '#E2E8F0',
                                                backgroundColor: materialForm.grades.includes(g) ? 'var(--primary-light)' : 'white',
                                                color: materialForm.grades.includes(g) ? 'var(--primary)' : '#64748B',
                                                fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                        >
                                            {materialForm.grades.includes(g) ? '✓ ' : ''} Kelas {g.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>NAMA MATERI (INDONESIA)</label>
                                <input value={materialForm.indLabel} onChange={e => setMaterialForm({ ...materialForm, indLabel: e.target.value })} placeholder="Contoh: Operasi Penambahan Dinamis" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>NAMA MATERI (ENGLISH - OPSIONAL)</label>
                                <input value={materialForm.engLabel} onChange={e => setMaterialForm({ ...materialForm, engLabel: e.target.value })} placeholder="Contoh: Dynamic Addition Operation" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} />
                            </div>
                        </div>
                        <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowMaterialModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontWeight: 800, cursor: 'pointer' }}>Batal</button>
                            <button onClick={handleAddMaterial} style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: activeArea?.color || '#3B82F6', color: 'white', fontWeight: 900, cursor: 'pointer', boxShadow: `0 8px 20px ${activeArea?.color}40` }}>
                                Simpan & Siapkan Album
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 📦 INVENTARIS SARPRAS APE MODAL */}
            {showShoppingList && (
                <InventoryModal curriculum={curriculum} onClose={() => setShowShoppingList(false)} />
            )}
            <style>{`
          /* AreaTracker Style Ported */
          .modern-steps-container { position: relative; padding-left: 20px; margin-top: 12px; }
          .modern-steps-container::before { 
              content: ''; position: absolute; left: 6px; top: 10px; bottom: 10px; 
              width: 2px; background: #E2E8F0; border-radius: 2px;
          }
          .modern-step-header { 
              position: relative; margin-top: 24px; margin-bottom: 16px;
              font-size: 0.85rem; font-weight: 950; color: #0F172A; text-transform: uppercase;
              padding-left: 10px; letter-spacing: 0.5px;
          }
          .modern-header-dot { 
              position: absolute; left: -20px; top: 50%; transform: translateY(-50%);
              width: 14px; height: 14px; border: 3px solid white; border-radius: 50%;
              box-shadow: 0 0 0 2px #E2E8F0;
          }
          .modern-step-row { position: relative; display: flex; gap: 16px; margin-bottom: 16px; }
          .modern-step-num { 
              font-size: 0.8rem; font-weight: 950; color: #94A3B8; 
              width: 24px; flex-shrink: 0; text-align: right; margin-top: 2px;
          }
          .modern-step-content { font-size: 1rem; font-weight: 600; color: #334155; line-height: 1.6; flex: 1; }
          .modern-dialogue-box { 
              background: #F1F5F9; padding: 10px 14px; border-radius: 12px; 
              margin: 8px 0; color: #4F46E5; font-weight: 800; font-size: 0.9rem;
              display: flex; gap: 8px; align-items: flex-start;
              border-left: 4px solid #4F46E5;
          }
          .modern-dialogue-box span { font-style: italic; }

          @keyframes slideLeft { 
              from { transform: translateX(100%); } 
              to { transform: translateX(0); } 
          }
          .material-card {
              transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .material-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 12px 30px rgba(0,0,0,0.04) !important;
          }
          .card-header-hover:hover {
              background-color: #F8FAFC !important;
          }
          @keyframes accordionIn {
              from { opacity: 0; transform: translateY(-5px); }
              to { opacity: 1; transform: translateY(0); }
          }
          .btn-primary:active, .btn-glass:active { transform: scale(0.96); }
      `}</style>
        </div>
    );
}
