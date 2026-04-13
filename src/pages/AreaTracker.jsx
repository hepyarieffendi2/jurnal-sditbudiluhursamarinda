import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { AREA_SENTRA, MATURITY_LEVELS, CONCENTRATION_EMOJIS } from '../data/areaSentra';
import {
    CheckCircle2, Search, Target, LayoutGrid, Info, X, Play, AlertTriangle, MapPin, Sparkles, BookOpen, Loader2, PackageOpen,
    ArrowRightCircle, RotateCcw, Filter, Eye, EyeOff, Settings2, Trash2, MessageSquare, Package, AlertCircle, BarChart3, Lightbulb, Book,
    Globe, Home, Briefcase, Calendar, Activity, Award, Zap, User, Users, Heart, Hash, ArrowLeft
} from 'lucide-react';
import { deleteDoc, doc } from 'firebase/firestore';

export default function AreaTracker() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const roomParam = searchParams.get('room');
    const [activeTab, setActiveTab] = useState('radar'); // 'target', 'radar', 'overview'
    const [activeRoom, setActiveRoom] = useState(roomParam || 'Semua Ruang');
    const [expandedMateri, setExpandedMateri] = useState(null); // Track which materia's names are being peeked

    // Data State
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [curriculum, setCurriculum] = useState([]);
    const [plannedItems, setPlannedItems] = useState({});
    const [shelfItems, setShelfItems] = useState([]);
    const [repetitions, setRepetitions] = useState({});
    const [roomList, setRoomList] = useState([]); // Master Rombel
    const [searchQuery, setSearchQuery] = useState('');
    const [shelfSearch, setShelfSearch] = useState('');
    const [showFullGrid, setShowFullGrid] = useState(false);
    const [lastSavedAction, setLastSavedAction] = useState(null); // { ids: [], type: 'instant' | 'manual' }
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [observedToday, setObservedToday] = useState([]); // List of student IDs observed today
    const [showOnlyPending, setShowOnlyPending] = useState(false);

    // 🕵️ SYNC OBSERVED STATUS
    useEffect(() => {
        const fetchObservedToday = async () => {
            try {
                // We use string date comparison for simplicity in this session
                const q = query(collection(db, 'jurnal_aktivitas'));
                const snap = await getDocs(q);
                const observed = new Set();
                
                // Filtering in JS because Firebase date query can be tricky with different timestamp types
                snap.docs.forEach(doc => {
                    const data = doc.data();
                    let dateStr = "";
                    if (data.tanggal?.toDate) {
                        dateStr = data.tanggal.toDate().toISOString().split('T')[0];
                    } else if (data.tanggal) {
                        dateStr = new Date(data.tanggal).toISOString().split('T')[0];
                    }

                    if (dateStr === selectedDate) {
                        observed.add(data.muridId);
                    }
                });
                setObservedToday(Array.from(observed));
            } catch (err) { console.error(err); }
        };
        fetchObservedToday();
    }, [selectedDate, lastSavedAction]);

    // 🏛️ FETCH MASTER ROMBEL
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const snap = await getDocs(collection(db, 'master_rombel'));
                const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                data.sort((a, b) => (a.level || '').localeCompare(b.level || ''));
                setRoomList(data);
            } catch (e) { }
        };
        fetchRooms();
    }, []);

    // 🔄 FEETCH CURRICULUM FROM FIRESTORE (MASTER SYNC)
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const collRef = collection(db, 'kurikulum_pusat');
                const snapshot = await getDocs(collRef);
                let fetchedCurriculum = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));

                if (fetchedCurriculum.length === 0) {
                    setCurriculum(AREA_SENTRA);
                } else {
                    const orderMap = {};
                    AREA_SENTRA.forEach((item, idx) => orderMap[item.id] = idx);
                    fetchedCurriculum.sort((a, b) => (orderMap[a.id] ?? 99) - (orderMap[b.id] ?? 99));
                    setCurriculum(fetchedCurriculum);
                }
            } catch (err) {
                setCurriculum(AREA_SENTRA);
            }
        };
        fetchMasterData();
    }, []);

    // Observation State
    const [selectedKids, setSelectedKids] = useState([]);
    const [showSheet, setShowSheet] = useState(false);
    const [formMateri, setFormMateri] = useState('');
    const [tempLevel, setTempLevel] = useState('W');
    const [tempFocus, setTempFocus] = useState({ emoji: '⚙️', label: 'Working' });
    const [tempSocialContext, setTempSocialContext] = useState('Individual');
    const [tempMood, setTempMood] = useState('Tenang');
    const [tempRestorasi, setTempRestorasi] = useState(true);
    const [tempDuration, setTempDuration] = useState(20);

    // UI States
    const [showGuide, setShowGuide] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSearchingFull, setIsSearchingFull] = useState(false);
    const [fullSearchQuery, setFullSearchQuery] = useState('');
    const [selectedSearchArea, setSelectedSearchArea] = useState(null);
    const [preflightData, setPreflightData] = useState(null); 
    const [showPreflight, setShowPreflight] = useState(false);

    useEffect(() => {
        const plans = localStorage.getItem('sentra_plans');
        if (plans) setPlannedItems(JSON.parse(plans));

        const fetchStudents = async () => {
            try {
                const q = query(collection(db, 'students'), where('status', '==', 'active'));
                const snap = await getDocs(q);
                const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                data.sort((a, b) => a.name.localeCompare(b.name));
                setStudents(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    // 🏠 SYNC SHELF WITH FIRESTORE
    useEffect(() => {
        const fetchShelfData = async () => {
            // If "Semua Ruang", we might just empty it or find a default. 
            // In a classroom context, usually one room is active.
            if (activeRoom === 'Semua Ruang') {
                const legacy = localStorage.getItem('sentra_shelf');
                setShelfItems(legacy ? JSON.parse(legacy) : []);
                return;
            }

            try {
                const snap = await getDocs(collection(db, 'setelan_rak'));
                const roomDoc = snap.docs.find(d => d.id === activeRoom);
                if (roomDoc && roomDoc.exists()) {
                    setShelfItems(roomDoc.data().items || []);
                } else {
                    // Fallback one-time
                    const legacy = localStorage.getItem(`sentra_shelf_${activeRoom}`);
                    setShelfItems(legacy ? JSON.parse(legacy) : []);
                }
            } catch (err) {
                console.error("Gagal sinkron rak:", err);
            }
        };
        fetchShelfData();
    }, [activeRoom]);

    // 📊 FETCH ALL REPETITIONS (MASTER SYNC FOR DASHBOARD)
    useEffect(() => {
        const fetchAllRepetitions = async () => {
            if (students.length === 0) return;
            try {
                const q = query(collection(db, 'jurnal_aktivitas'));
                const snap = await getDocs(q);
                const reps = {};
                snap.docs.forEach(d => {
                    const data = d.data();
                    const key = `${data.muridId}_${data.pencapaian}`;
                    const currentStatus = data.kematangan || 'P';
                    
                    if (!reps[key]) {
                        reps[key] = { count: 1, level: currentStatus };
                    } else {
                        reps[key].count += 1;
                        // M (Mastered) override any other status
                        if (currentStatus === 'M') reps[key].level = 'M';
                    }
                });
                setRepetitions(reps);
            } catch (e) {
                console.error("Gagal ambil agregat repetisi:", e);
            }
        };
        if (!loading) fetchAllRepetitions();
    }, [loading, students.length]);

    const fetchRepetition = async (studentId) => {
        // Logic for single student if needed elsewhere
    };

    const toggleKidSelection = (id) => {
        setSelectedKids(prev => prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]);
    };

    // 🕵️ PEDAGOGICAL REVIEW BEFORE ACTION
    const openObservationSheet = (forceIds = null, materi = '') => {
        const targets = forceIds || selectedKids;
        if (targets.length === 0) return;

        // Auto-select history if available
        targets.forEach(tId => fetchRepetition(tId));
        setFormMateri(materi);
        setTempLevel('W');
        setTempFocus({ emoji: '⚙️', label: 'Working' });
        setShowSheet(true);
    };

    const handleActionWithReview = (actionType, materi = '') => {
        const targets = selectedKids;
        if (targets.length === 0) return;
        
        const missing = [];
        targets.forEach(kidId => {
            let foundIdx = -1;
            let areaList = [];
            curriculum.forEach(a => a.subAreas.forEach(sa => {
                const idx = sa.levels.findIndex(l => (typeof l === 'object' ? l.label : l) === materi);
                if (idx !== -1) { foundIdx = idx; areaList = sa.levels; }
            }));

            if (foundIdx > 0) {
                const missingForKid = [];
                for (let i = 0; i < foundIdx; i++) {
                    const preLabel = typeof areaList[i] === 'object' ? areaList[i].label : areaList[i];
                    if (!repetitions[`${kidId}_${preLabel}`]) {
                        missingForKid.push(preLabel.split(': ').slice(-1)[0]);
                    }
                }
                if (missingForKid.length > 0) {
                    missing.push({
                        kidId,
                        name: students.find(s => s.id === kidId)?.name,
                        items: missingForKid
                    });
                }
            }
        });

        if (missing.length > 0 && materi) {
            setPreflightData({ type: actionType, missing, materi });
            setShowPreflight(true);
        } else {
            if (actionType === 'instant') handleInstantSave(materi);
            else openObservationSheet(null, materi);
        }
    };

    const lookupTool = (materiLabel) => {
        let result = { area: "Umum", activity: "Eksplorasi", presentation: null };
        curriculum.forEach(a => a.subAreas?.forEach(sa => sa.levels?.forEach(lvl => {
            const label = typeof lvl === 'object' ? lvl.label : lvl;
            if (label === materiLabel) result = { area: a.name, areaId: a.id, activity: sa.name, presentation: typeof lvl === 'object' ? lvl.presentation : null };
        })));
        return result;
    };

    const getIdealCapacity = (areaName) => {
        const bigAreas = ['Seni', 'Olahraga', 'Agama', 'Adab', 'Ibadah', 'Great Lesson'];
        return bigAreas.some(a => areaName?.toLowerCase().includes(a.toLowerCase())) ? 30 : 6;
    };

    const handleUndo = async () => {
        if (!lastSavedAction) return;
        setLoading(true);
        try {
            for (const recordId of lastSavedAction.ids) {
                await deleteDoc(doc(db, 'jurnal_aktivitas', recordId));
            }
            setLastSavedAction(null);
            setShowSuccess(false);
            // Refresh repetitions
            const q = query(collection(db, 'jurnal_aktivitas'));
            const snap = await getDocs(q);
            const reps = {};
            snap.docs.forEach(d => {
                const data = d.data();
                const key = `${data.muridId}_${data.pencapaian}`;
                reps[key] = (reps[key] || 0) + 1;
            });
            setRepetitions(reps);
        } catch (err) {
            console.error("Gagal undo:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInstantSave = async (materiPilihan) => {
        if (!materiPilihan || selectedKids.length === 0) return;
        const toolInfo = lookupTool(materiPilihan);
        setLoading(true);

        try {
            const savedIds = [];
            for (const sId of selectedKids) {
                const student = students.find(s => s.id === sId);
                if (!student) continue;
                const docRef = await addDoc(collection(db, 'jurnal_aktivitas'), {
                    murid: student.name, muridId: String(sId), area: toolInfo.area, areaId: toolInfo.areaId,
                    aktivitas: toolInfo.activity, pencapaian: materiPilihan, kematangan: 'P',
                    konsentrasi: 'Working', konsentrasiEmoji: '⚙️',
                    sosial: 'Individual', restorasi: true,
                    durasi: 15,
                    guru: "Ustadzah",
                    tanggal: selectedDate === new Date().toISOString().split('T')[0] ? serverTimestamp() : Timestamp.fromDate(new Date(selectedDate)),
                    mode: 'presentasi_langsung'
                });
                savedIds.push(docRef.id);
            }

            setLastSavedAction({ ids: savedIds, type: 'instant' });

            // Force refresh repetitions in background
            const q = query(collection(db, 'jurnal_aktivitas'));
            const snap = await getDocs(q);
            const reps = {};
            snap.docs.forEach(d => {
                const data = d.data();
                const key = `${data.muridId}_${data.pencapaian}`;
                reps[key] = (reps[key] || 0) + 1;
            });
            setRepetitions(reps);

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
            setSelectedKids([]);
            setFormMateri('');
        } catch (err) {
            console.error("Gagal simpan instan:", err);
            alert("Gagal menyimpan data.");
        } finally {
            setLoading(false);
        }
    };

    const handleSmartSave = async () => {
        if (!formMateri) return;
        const toolInfo = lookupTool(formMateri);
        setLoading(true);

        try {
            const savedIds = [];
            for (const sId of selectedKids) {
                const student = students.find(s => s.id === sId);
                if (!student) continue;
                const docRef = await addDoc(collection(db, 'jurnal_aktivitas'), {
                    murid: student.name, muridId: String(sId), area: toolInfo.area, areaId: toolInfo.areaId,
                    aktivitas: toolInfo.activity, pencapaian: formMateri, kematangan: tempLevel,
                    konsentrasi: tempFocus.label, konsentrasiEmoji: tempFocus.emoji,
                    sosial: tempSocialContext, restorasi: tempRestorasi,
                    durasi: tempDuration,
                    guru: "Ustadzah",
                    tanggal: selectedDate === new Date().toISOString().split('T')[0] ? serverTimestamp() : Timestamp.fromDate(new Date(selectedDate)),
                    mode: 'sentra_manual'
                });
                savedIds.push(docRef.id);
            }
            setLastSavedAction({ ids: savedIds, type: 'manual' });

            // Refresh repetitions
            const q = query(collection(db, 'jurnal_aktivitas'));
            const snap = await getDocs(q);
            const reps = {};
            snap.docs.forEach(d => {
                const data = d.data();
                const key = `${data.muridId}_${data.pencapaian}`;
                reps[key] = (reps[key] || 0) + 1;
            });
            setRepetitions(reps);

            setShowSheet(false);
            setSelectedKids([]);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (err) {
            console.error("Gagal simpan manual:", err);
        } finally {
            setLoading(false);
        }
    };

    // 🏠 DYNAMIC ROOMS & DERIVED DATA (SMART GRADE MAPPING)
    const uniqueRooms = Array.from(new Set(students.map(s => s.rombel))).filter(r => r).sort();
    const normalize = (str) => String(str || "").trim().toLowerCase();

    const currentRoomStudents = students.filter(s => {
        const isAll = normalize(activeRoom) === 'semua ruang';
        if (isAll) return true;

        // Strict room match to ensure only students in the selected class are shown
        return normalize(s.rombel) === normalize(activeRoom);
    });

    const searchedStudents = currentRoomStudents.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const radarStudents = [...searchedStudents].sort((a, b) => (a.selectedArea && !b.selectedArea) ? 1 : (!a.selectedArea && b.selectedArea) ? -1 : 0);

    const shelfCoverage = shelfItems
        .filter(item => !shelfSearch || item.toLowerCase().includes(shelfSearch.toLowerCase()))
        .map(item => {
            const mastered = [];
            const working = [];
            const waiting = [];
            searchedStudents.forEach(s => {
                const repKey = `${s.id}_${item}`;
                const record = repetitions[repKey];
                
                if (record) {
                    if (record.level === 'M') {
                        mastered.push(s);
                    } else {
                        working.push(s);
                    }
                } else {
                    waiting.push(s);
                }
            });
            return {
                label: item,
                mastered,
                working,
                presented: [...mastered, ...working],
                waiting,
                all: searchedStudents,
                totalCount: searchedStudents.length,
                workingPercent: Math.round((working.length / (searchedStudents.length || 1)) * 100) || 0,
                masteredPercent: Math.round((mastered.length / (searchedStudents.length || 1)) * 100) || 0,
                waitingPercent: Math.round((waiting.length / (searchedStudents.length || 1)) * 100) || 0
            };
        })
        .sort((a, b) => (a.workingPercent + a.masteredPercent) - (b.workingPercent + b.masteredPercent));

    return (
        <div className="sentra-v3-container">
            {/* SUCCESS OVERLAY */}
            {showSuccess && (
                <div className="success-overlay" style={{ flexDirection: 'column', gap: 20 }}>
                    <div className="success-pill"><CheckCircle2 size={24} /> Observasi Berhasil Disimpan!</div>
                     {lastSavedAction && (
                        <button className="undo-btn" onClick={handleUndo}>
                            <RotateCcw size={18} /> Batalkan (Undo)
                        </button>
                    )}
                </div>
            )}

            {/* 🛡️ PEDAGOGICAL PRE-FLIGHT MODAL */}
            {showPreflight && preflightData && (
                 <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)' }}>
                    <div className="fade-in" style={{ backgroundColor: 'white', width: '102%', maxWidth: '500px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', animation: 'popIn 0.3s' }}>
                        <div style={{ padding: '32px', textAlign: 'center' }}>
                            <div style={{ width: '64px', height: '64px', backgroundColor: '#FFFBEB', color: '#F59E0B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <AlertTriangle size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: '#0F172A', marginBottom: '8px' }}>Tinjauan Kesiapan Murid</h3>
                            <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
                                Sistem mendeteksi beberapa murid terpilih belum memiliki catatan mastering untuk prasyarat materi <b style={{color:'#1E293B'}}>{preflightData.materi.split(': ').slice(-1)[0]}</b>.
                            </p>

                            <div style={{ textAlign: 'left', background: '#F8FAFC', padding: '20px', borderRadius: '20px', maxHeight: '200px', overflowY: 'auto', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
                                {preflightData.missing.map((m, i) => (
                                    <div key={i} style={{ marginBottom: '12px' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#1E293B' }}>{m.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 700 }}>Blm menguasai: {m.items.join(', ')}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button 
                                    onClick={() => {
                                        const { type, materi } = preflightData;
                                        setShowPreflight(false);
                                        if (type === 'instant') handleInstantSave(materi);
                                        else {
                                            setFormMateri(materi);
                                            setShowSheet(true);
                                        }
                                    }}
                                    style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', boxShadow:'0 10px 20px rgba(99, 102, 241, 0.2)' }}
                                >
                                    Ya, Tetap Simpan
                                </button>
                                <button 
                                    onClick={() => setShowPreflight(false)}
                                    style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: 'transparent', color: '#64748B', border: '1px solid #E2E8F0', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}
                                >
                                    Cek Lagi (Batal)
                                </button>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '20px', fontStyle: 'italic', fontWeight: 700 }}>
                                *Prinsip AMI: Menghormati sekuensial materi membantu anak berkembang lebih optimal.
                            </p>
                        </div>
                    </div>
                 </div>
            )}

            {/* JIT LEARNING GUIDE */}
            {showGuide && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(16px)' }} onClick={() => setShowGuide(null)}>
                    <div className="modern-guide-modal fade-in" onClick={e => e.stopPropagation()}>
                        <div className="modern-guide-header" style={{ borderBottom: `4px solid ${lookupTool(showGuide.label).color || '#4F46E5'}` }}>
                            <div className="modern-guide-badge" style={{ backgroundColor: `${lookupTool(showGuide.label).color || '#4F46E5'}20`, color: lookupTool(showGuide.label).color || '#4F46E5' }}>📖 PANDUAN PRESENTASI</div>
                            <button className="modern-close-btn" onClick={() => setShowGuide(null)}><X size={20} /></button>
                        </div>

                        <div className="modern-guide-scroll-body">
                            <h2 className="modern-title">{showGuide.label.split(' / ')[0]}</h2>

                            <div className="modern-info-card">
                                <Package size={18} />
                                <div>
                                    <label>ALAT PERAGA</label>
                                    <p>{showGuide.presentation?.toolDisplay || showGuide.presentation?.tool || "-"}</p>
                                </div>
                            </div>

                            <div className="modern-steps-container">
                                {(showGuide.presentation?.steps || ["Hubungi Admin untuk panduan."]).map((step, i) => {
                                    const isHeader = /^[IVX]+\.\s/.test(step);
                                    const stepMatch = step.match(/^(\d+\.)\s(.*)/);
                                    const stepNum = stepMatch ? stepMatch[1] : null;
                                    const stepText = stepMatch ? stepMatch[2] : step;

                                    if (isHeader) {
                                        return (
                                            <div key={i} className="modern-step-header">
                                                <div className="modern-header-dot" style={{ backgroundColor: lookupTool(showGuide.label).color || '#4F46E5' }}></div>
                                                {step}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={i} className="modern-step-row">
                                            <div className="modern-step-num">{stepNum}</div>
                                            <div className="modern-step-content">
                                                {stepText.split(/'([^']+)'/).map((part, index) =>
                                                    index % 2 === 1 ? (
                                                        <div key={index} className="modern-dialogue-box">
                                                            <MessageSquare size={12} style={{ marginTop: 4 }} />
                                                            <span>"{part}"</span>
                                                        </div>
                                                    ) : part
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {showGuide.presentation?.error && (
                                <div className="modern-error-card">
                                    <AlertCircle size={18} />
                                    <div>
                                        <label>KONTROL KESALAHAN</label>
                                        <p>{showGuide.presentation.error}</p>
                                    </div>
                                </div>
                            )}

                            {showGuide.presentation?.videoUrl && (
                                <a href={showGuide.presentation.videoUrl} target="_blank" rel="noreferrer" className="modern-video-btn">
                                    <div className="video-play-icon">▶</div>
                                    Tonton Video Demonstrasi
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="app-header-area">
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#EEF2FF', padding: '8px 16px', borderRadius: '12px', color: '#4F46E5', border: '1px solid #C7D2FE' }}>
                        <Calendar size={14} />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            style={{ border: 'none', background: 'transparent', fontWeight: 900, fontSize: '0.85rem', color: '#4F46E5', outline: 'none', cursor: 'pointer' }}
                        />
                    </div>
                </div>
                <h1>Sesi Sentra</h1>

                {/* ROOM SWITCHER FILTER & RAK SETUP */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <div className="room-switcher" style={{ margin: 0, flex: 1, minWidth: '200px' }}>
                        <MapPin size={16} />
                        <select value={activeRoom} onChange={e => setActiveRoom(e.target.value)}>
                            <option value="Semua Ruang">Semua Kelas ({students.length})</option>
                            {roomList.length > 0 ? (
                                roomList.map(r => (
                                    <option key={r.id} value={r.name}>
                                        {r.level ? `${r.level} - ` : ''}{r.name}
                                    </option>
                                ))
                            ) : null}
                        </select>
                    </div>



                    <button
                        onClick={() => navigate(`/setelan-rak?room=${encodeURIComponent(activeRoom)}`)}
                        style={{
                            backgroundColor: '#F8FAFC', color: '#4F46E5', border: '1px solid #E2E8F0',
                            padding: '10px 16px', borderRadius: '14px', fontWeight: 800, fontSize: '0.85rem',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                    >
                        <Briefcase size={16} /> Atur Rak Ruangan Ini
                    </button>
                </div>

                {/* 3 TABS PILLS - RESPONSIVE ADAPTIVE */}
                <div className="tri-tabs">
                    <button className={`tri-btn ${activeTab === 'target' ? 'active' : ''}`} onClick={() => setActiveTab('target')}>
                        <span className="tab-icon"><Target size={20} /></span>
                        <span className="tab-text-full">1. Presentasi Baru</span>
                        <span className="tab-text-short">Presentasi</span>
                    </button>
                    <button className={`tri-btn ${activeTab === 'radar' ? 'active' : ''}`} onClick={() => setActiveTab('radar')}>
                        <span className="tab-icon"><Eye size={20} /></span>
                        <span className="tab-text-full">2. Jurnal Observasi</span>
                        <span className="tab-text-short">Observasi</span>
                    </button>
                    <button className={`tri-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                        <span className="tab-icon"><BarChart3 size={20} /></span>
                        <span className="tab-text-full">3. Statistik Kelas</span>
                        <span className="tab-text-short">Statistik</span>
                    </button>
                </div>
            </div>

            <div className="main-playground">
                {loading && <div style={{ textAlign: 'center', marginTop: 50, color: '#94A3B8' }}>Sabar bund, memuat prajurit kelas...</div>}

                {/* =========================================
            TAB 1: TARGET PRESENTASI (ACTION-FIRST) - OPSI 3 (MODERN MATERIAL-FIRST)
         ========================================= */}
                {activeTab === 'target' && !loading && (
                    <div className="tab-pane fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                            <div className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>MATERI SIAP PRESENTASI <Book size={18} /></div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '12px', marginRight: '8px', padding: '6px 12px', background: 'white', borderRadius: '100px', border: '1px solid #E2E8F0', fontSize: '0.65rem', fontWeight: 900 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div> MAHIR</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }}></div> BERLATIH</div>
                                </div>
                                <div className="search-bar-solid" style={{ margin: 0, padding: '8px 16px', borderRadius: '100px', width: '250px' }}>
                                    <Search size={14} color="#94A3B8" />
                                    <input type="text" placeholder="Cari materi di rak..." value={shelfSearch} onChange={e => setShelfSearch(e.target.value)} style={{ fontSize: '0.8rem' }} />
                                </div>
                                <div style={{ backgroundColor: '#EEF2FF', padding: '10px 16px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 900, color: '#4F46E5', border: '1px solid #C7D2FE' }}>
                                    {shelfItems.length} Materi
                                </div>
                            </div>
                        </div>

                        {shelfCoverage.length === 0 ? (
                            <div className="empty-state-nice">
                                <PackageOpen color="#94A3B8" size={48} />
                                <h3>Rak Belum Ditata</h3>
                                <p>Atur materi di rak kelas terlebih dahulu.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {shelfCoverage.map(data => {
                                    const isSelectedMateri = formMateri === data.label;

                                    return (
                                        <div key={data.label} className={`target-card ${isSelectedMateri ? 'selected-materi' : ''}`} style={{ display: 'block', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', border: isSelectedMateri ? '2px solid #4F46E5' : '2px solid #F1F5F9' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', cursor: 'pointer' }} onClick={() => setFormMateri(isSelectedMateri ? '' : data.label)}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                                        <span style={{ fontSize: '0.65rem', fontWeight: 950, color: '#4F46E5', background: '#EEF2FF', padding: '2px 8px', borderRadius: '6px' }}>
                                                            {data.label.split(':')[0]}
                                                        </span>
                                                        <span style={{ fontSize: '0.65rem', fontWeight: 950, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Package size={10} /> {lookupTool(data.label).presentation?.toolDisplay?.split(',')[0] || "Alat Peraga"}
                                                        </span>
                                                    </div>

                                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 950, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            {data.label.split(': ')[1]?.split(' / ')[0] || data.label}
                                                            {isSelectedMateri && <Sparkles size={16} color="#4F46E5" />}
                                                        </div>
                                                        {data.label.includes(' / ') && (
                                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', fontStyle: 'italic', marginTop: '1px' }}>
                                                                {data.label.split(' / ')[1]}
                                                            </span>
                                                        )}
                                                    </h3>
                                                    
                                                    {/* 🌈 RAINBOW PROGRESS BAR */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                                        <div 
                                                            onClick={(e) => { e.stopPropagation(); setExpandedMateri(expandedMateri === data.label ? null : data.label); }}
                                                            style={{ height: '8px', width: '120px', background: '#F1F5F9', borderRadius: '20px', overflow: 'hidden', display: 'flex', cursor: 'pointer' }}
                                                        >
                                                            <div style={{ width: `${data.masteredPercent}%`, height: '100%', background: '#10B981' }} title="Mastered" />
                                                            <div style={{ width: `${data.workingPercent}%`, height: '100%', background: '#3B82F6' }} title="Working" />
                                                        </div>
                                                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B' }}>{data.masteredPercent + data.workingPercent}% Tuntas</span>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '1.2rem', fontWeight: 950, color: '#4F46E5' }}>{data.working.length + data.mastered.length} <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>/ {searchedStudents.length}</span></div>
                                                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94A3B8' }}>ANAK TELAH DAPAT</div>
                                                </div>
                                            </div>

                                            {/* 🕵️ STUDENT PEEK (ACCORDION) */}
                                            {expandedMateri === data.label && (
                                                <div style={{ marginBottom: '16px', padding: '12px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', animation: 'slideDown 0.2s' }}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                        <div>
                                                            <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#059669', marginBottom: '4px' }}>🎓 MAHIR ({data.mastered.length})</div>
                                                            <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{data.mastered.length > 0 ? data.mastered.map(s => s.name.split(' ')[0]).join(', ') : '-'}</div>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#3B82F6', marginBottom: '4px' }}>🛠️ BERLATIH ({data.working.length})</div>
                                                            <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{data.working.length > 0 ? data.working.map(s => s.name.split(' ')[0]).join(', ') : '-'}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#64748B' }}>🎯 TARGET: {data.waiting.length} ANAK</div>
                                                        {data.waiting.length > 0 && (
                                                            <button 
                                                                onClick={(e) => { 
                                                                    e.stopPropagation(); 
                                                                    setSelectedKids(prev => {
                                                                        const next = [...prev];
                                                                        data.waiting.forEach(s => { if (!next.includes(s.id)) next.push(s.id); });
                                                                        return next;
                                                                    });
                                                                    setFormMateri(data.label);
                                                                    setExpandedMateri(null);
                                                                }}
                                                                style={{ padding: '4px 8px', background: 'white', border: '1px solid #C7D2FE', borderRadius: '6px', fontSize: '0.6rem', fontWeight: 800, color: '#4F46E5', cursor: 'pointer' }}
                                                            >
                                                                Pilih Semua Target
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* SELECTION GRID (ONLY WHEN SELECTED) */}
                                            {isSelectedMateri && (
                                                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px dashed #E2E8F0', animation: 'slideDown 0.3s ease' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '16px' }}>

                                                        {selectedKids.length > 0 && (
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                                                {selectedKids.length > getIdealCapacity(data.label) ? (
                                                                    <div className="pulse-warning" style={{
                                                                        fontSize: '0.8rem', color: '#B45309', fontWeight: 900, background: '#FFFBEB',
                                                                        padding: '10px 16px', borderRadius: '12px', border: '2px solid #FCD34D',
                                                                        display: 'flex', alignItems: 'center', gap: '8px'
                                                                    }}>
                                                                        <AlertTriangle size={16} />
                                                                        Sesi ini melebihi batas ideal (max {getIdealCapacity(data.label)} anak).
                                                                    </div>
                                                                ) : null}

                                                                {/* 🧠 SMART SUMMARY BAR (Minimalist Replacement) */}
                                                                {(() => {
                                                                    const missingCount = selectedKids.filter(kidId => {
                                                                        let foundIdx = -1;
                                                                        let areaList = [];
                                                                        curriculum.forEach(a => a.subAreas.forEach(sa => {
                                                                            const idx = sa.levels.findIndex(l => (typeof l === 'object' ? l.label : l) === data.label);
                                                                            if (idx !== -1) { foundIdx = idx; areaList = sa.levels; }
                                                                        }));
                                                                        if (foundIdx > 0) {
                                                                            for (let i = 0; i < foundIdx; i++) {
                                                                                const preLabel = typeof areaList[i] === 'object' ? areaList[i].label : areaList[i];
                                                                                if (!repetitions[`${kidId}_${preLabel}`]) return true;
                                                                            }
                                                                        }
                                                                        return false;
                                                                    }).length;

                                                                    if (missingCount > 0) {
                                                                        return (
                                                                            <div style={{ fontSize: '0.75rem', fontWeight: 850, color: '#B45309', background: '#FFFBEB', padding: '10px 16px', borderRadius: '12px', border: '1.5px solid #FDE68A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                 <AlertCircle size={14} />
                                                                                 <span>{missingCount} anak terdeteksi belum memiliki prasyarat lengkap.</span>
                                                                            </div>
                                                                        );
                                                                    }
                                                                    return null;
                                                                })()}

                                                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                                                    <button
                                                                        className="btn-start-presentation outline"
                                                                        style={{ padding: '12px 20px', fontSize: '0.8rem', background: 'white', color: '#4F46E5', border: '2px solid #C7D2FE', boxShadow: 'none' }}
                                                                        onClick={() => handleActionWithReview('smart', data.label)}
                                                                    >
                                                                        <Settings2 size={14} /> Opsi Lanjut
                                                                    </button>

                                                                    <button
                                                                        className="btn-start-presentation"
                                                                        style={{
                                                                            padding: '12px 24px', fontSize: '0.85rem',
                                                                            backgroundColor: (selectedKids.length > getIdealCapacity(data.label)) ? '#D97706' : '#059669',
                                                                            boxShadow: (selectedKids.length > getIdealCapacity(data.label)) ? '0 8px 16px rgba(217, 119, 6, 0.2)' : '0 8px 16px rgba(5, 150, 105, 0.2)',
                                                                            transition: 'all 0.3s ease'
                                                                        }}
                                                                        onClick={() => handleActionWithReview('instant', data.label)}
                                                                    >
                                                                        {loading ? <Loader2 className="animate-spin" size={14} /> : (
                                                                            <>
                                                                                {(selectedKids.length > getIdealCapacity(data.label))
                                                                                    ? <>SIMPAN SESI BESAR ({selectedKids.length} ANAK) <AlertTriangle size={14} /></>
                                                                                    : <>SIMPAN PRESENTASI ({selectedKids.length} ANAK) <CheckCircle2 size={14} /> </>
                                                                                }
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                                                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#475569' }}>
                                                            {showFullGrid ? 'SEMUA MURID DI KELAS' : 'SIAPA YANG AKAN MENERIMA PRESENTASI INI?'}
                                                        </div>
                                                        <button
                                                            onClick={() => setShowFullGrid(!showFullGrid)}
                                                            style={{ background: '#F1F5F9', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                                                        >
                                                            {showFullGrid ? <><EyeOff size={12} /> Hanya Belum Dapat</> : <><Eye size={12} /> Lihat Semua Murid</>}
                                                        </button>
                                                    </div>

                                                    {(showFullGrid ? data.all : data.waiting).length > 0 ? (
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                                                            {(showFullGrid ? data.all : data.waiting).map(kid => {
                                                                const isSelected = selectedKids.includes(kid.id);
                                                                const alreadyHad = data.presented.some(p => p.id === kid.id);

                                                                return (
                                                                    <div key={kid.id}
                                                                        onClick={() => toggleKidSelection(kid.id)}
                                                                        className={`mini-selection-pill ${isSelected ? 'active' : ''} ${alreadyHad ? 'already-had' : ''}`}
                                                                        style={{
                                                                            padding: '10px', borderRadius: '14px', border: isSelected ? '2px solid #4F46E5' : '1px solid #E2E8F0',
                                                                            background: isSelected ? '#EEF2FF' : (alreadyHad ? '#F8FAFC' : 'white'), cursor: 'pointer', transition: 'all 0.2s',
                                                                            display: 'flex', alignItems: 'center', gap: '8px', opacity: (alreadyHad && !isSelected) ? 0.6 : 1
                                                                        }}>
                                                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: isSelected ? '#4F46E5' : (alreadyHad ? '#CBD5E1' : '#F1F5F9'), color: isSelected ? 'white' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 900, position: 'relative' }}>
                                                                            {isSelected ? '✓' : (alreadyHad ? '↺' : kid.name.substring(0, 1))}
                                                                            {/* Inline Prerequisite Indicator */}
                                                                            {(() => {
                                                                                let foundIdx = -1;
                                                                                let areaList = [];
                                                                                curriculum.forEach(a => a.subAreas.forEach(sa => {
                                                                                    const idx = sa.levels.findIndex(l => (typeof l === 'object' ? l.label : l) === data.label);
                                                                                    if (idx !== -1) { foundIdx = idx; areaList = sa.levels; }
                                                                                }));
                                                                                if (foundIdx > 0) {
                                                                                    for (let i = 0; i < foundIdx; i++) {
                                                                                        const preLabel = typeof areaList[i] === 'object' ? areaList[i].label : areaList[i];
                                                                                        if (!repetitions[`${kid.id}_${preLabel}`]) return <div style={{ position: 'absolute', top: -4, right: -4, background: '#F59E0B', color: 'white', borderRadius: '50%', width: '10px', height: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', border: '1px solid white' }}>!</div>;
                                                                                    }
                                                                                }
                                                                                return null;
                                                                            })()}
                                                                        </div>
                                                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: isSelected ? '#4F46E5' : '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                                                                            {kid.name}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div style={{ background: '#ECFDF5', color: '#059669', padding: '16px', borderRadius: '16px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 900 }}>
                                                            🎉 Semua anak telah mendapatkan presentasi materi ini!
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <style>{`
                    .mini-selection-pill:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                `}</style>
                    </div>
                )}



                {/* =========================================
            TAB 2: RADAR OBSERVASI (SAPU PANDANG) 
         ========================================= */}
                {activeTab === 'radar' && !loading && (
                    <div className="tab-pane fade-in">
                        <div className="sweep-instruction">
                            <Lightbulb size={24} style={{ flexShrink: 0 }} />
                            <div><b>Petunjuk:</b> Pilih beberapa siswa yang bekerja di area/meja yang sama, lalu tekan tombol "Catat".</div>
                        </div>

                        <div className="search-bar-solid" style={{ marginBottom: '20px' }}>
                            <Search size={18} color="#94A3B8" />
                            <input type="text" placeholder="Cari anak spesifik..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1 }} />
                            
                            <div style={{ width: '1.5px', height: '20px', background: '#E2E8F0', margin: '0 4px' }}></div>
                            
                            <button 
                                onClick={() => setShowOnlyPending(!showOnlyPending)}
                                style={{
                                    background: 'none', border: 'none', padding: '4px 8px',
                                    color: showOnlyPending ? 'var(--primary)' : '#94A3B8',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                {showOnlyPending ? <EyeOff size={18} /> : <Eye size={18} />}
                                <span style={{ fontSize: '0.7rem', fontWeight: 900, display: window.innerWidth > 400 ? 'inline' : 'none' }}>
                                    {showOnlyPending ? 'Filter: Pending' : 'Semua'}
                                </span>
                            </button>
                        </div>

                        {currentRoomStudents.length === 0 && activeRoom !== 'Semua Ruang' && (
                            <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7', padding: '12px 16px', borderRadius: '16px', marginBottom: '20px', color: '#B45309', fontSize: '0.85rem', fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>⚠️ Tidak ada murid terdaftar di "{activeRoom}".</div>
                                <button onClick={() => navigate('/students')} style={{ background: '#D97706', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem' }}>Daftarkan Murid</button>
                            </div>
                        )}

                        <div className="radar-grid">
                            {currentRoomStudents
                                .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                .filter(s => showOnlyPending ? !observedToday.includes(s.id) : true)
                                .sort((a, b) => {
                                    const aObs = observedToday.includes(a.id);
                                    const bObs = observedToday.includes(b.id);
                                    if (aObs && !bObs) return 1;
                                    if (!aObs && bObs) return -1;
                                    return 0;
                                })
                                .map(kid => {
                                    const isObserved = observedToday.includes(kid.id);
                                    const isSelected = selectedKids.includes(kid.id);
                                    return (
                                        <div key={kid.id} className={`radar-kid-card ${isSelected ? 'selected' : ''} ${isObserved ? 'observed-subdued' : ''}`} onClick={() => toggleKidSelection(kid.id)} style={{ opacity: isObserved && !isSelected ? 0.6 : 1 }}>
                                            <div className={`radar-avatar ${isSelected ? 'active-avatar' : ''} ${isObserved ? 'observed-avatar' : ''}`}>
                                                {isSelected ? <CheckCircle2 size={24} /> : (isObserved ? '✓' : kid.name.substring(0, 2))}
                                            </div>
                                            <div className="radar-info">
                                                <h4 style={{ margin: 0, color: isObserved ? '#94A3B8' : '#0F172A' }}>{kid.name}</h4>
                                                <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 800, marginBottom: '4px' }}>ROMBEL: {kid.rombel || '?'}</div>
                                                {isObserved ? (
                                                    <div className="status-done"><CheckCircle2 size={12} /> Selesai Diobservasi</div>
                                                ) : (
                                                    <div className="status-urgent"><AlertTriangle size={12} /> Belum diobservasi</div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>

                        {/* FAB: CATAT KELOMPOK */}
                        <div className={`floating-action-bar ${(selectedKids.length > 0 && !showSheet) ? 'visible' : ''}`}>
                            <div className="fab-text">
                                <div className="badge-count">{selectedKids.length}</div> Terpilih
                            </div>
                            <button className="btn-fab-catat" onClick={() => handleActionWithReview('smart', formMateri)}>
                                Catat Bersamaan <Sparkles size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* =========================================
            TAB 3: IKHTISAR KURVA (OVERVIEW)
         ========================================= */}
                {activeTab === 'overview' && !loading && (
                    <div className="tab-pane fade-in">
                        <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>PETA KURVA KELAS HARI INI <BarChart3 size={18} /></div>
                        <div className="overview-cards">
                            <div className="ov-card bg-green">
                                <h3>Anak Telah Disapa</h3>
                                <h1>{currentRoomStudents.filter(s => s.selectedArea).length} <span>/ {currentRoomStudents.length}</span></h1>
                                <p>Tugas observasi Bunda sudah hebat hari ini!</p>
                            </div>
                            <div className="ov-card bg-blue">
                                <h3>Great Work Terekam</h3>
                                <h1>{currentRoomStudents.filter(s => s.focus === '😍').length} <span>anak</span></h1>
                                <p>Mencapai fase konsentrasi mendalam (😍)</p>
                            </div>
                        </div>
                        <div className="empty-state-nice" style={{ marginTop: 24 }}>
                            <BookOpen color="#94A3B8" size={32} />
                            <h3>Laporan Terperinci</h3>
                            <p>Waktu spesifik (menit dan jam log) telah direkam otomatis ke database rapot wali kelas tanpa perlu Ustadzah ketik sedikitpun.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* =========================================
             BOTTOM SHEET (ZERO TYPING MAGIC)
          ========================================= */}
            <div className={`glass-overlay ${showSheet ? 'active' : ''}`} onClick={() => setShowSheet(false)}>
                <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
                    <div className="sheet-handle"></div>

                    <div className="sheet-header">
                        <div>
                            <h2 style={{ color: '#1E293B', fontWeight: 950 }}>Merekam Sesi: {selectedKids.length} Anak</h2>
                            <div className="sheet-names" style={{ color: '#64748B', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {students.filter(s => selectedKids.includes(s.id)).map(s => (
                                    <span key={s.id} style={{ background: '#F1F5F9', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>{s.name}</span>
                                ))}
                            </div>
                        </div>
                        <button className="btn-close" onClick={() => setShowSheet(false)}><X size={20} /></button>
                    </div>

                    {/* SECTION: FREEDOM WITH LIMITS */}
                    <div className="section-title" style={{ marginLeft: 4 }}>Mereka Mengerjakan Pengalaman Apa?</div>
                    <div className="section-box">
                        <div className="limit-warning">Hanya alat di "Rak Kelas" yang aktif minggu ini</div>

                        <div className="chip-list">
                            {/* Tampilkan opsi dari Shelf (Freedom with limits) */}
                            {shelfItems.length > 0 ? shelfItems.map(item => {
                                const toolName = lookupTool(item).presentation?.toolDisplay?.split(',')[0] || "Alat";
                                const itemName = item.split(': ')[1]?.split(' / ')[0] || item;
                                const engName = item.includes(' / ') ? item.split(' / ')[1] : null;

                                // AMBIL DATA REPETISI NYATA
                                const isSingle = selectedKids.length === 1;
                                const repCount = isSingle ? (repetitions[`${selectedKids[0]}_${item}`] || 0) : 0;
                                const isFirstPresentation = repCount === 0;

                                const isSelectedMat = formMateri === item;

                                return (
                                    <button key={item}
                                        className={`chip-item ${isSelectedMat ? 'active' : ''} ${isFirstPresentation && isSingle ? 'rep-glow' : ''}`}
                                        style={{ position: 'relative' }}
                                        onClick={() => setFormMateri(item)}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.55rem', fontWeight: 900, color: isSelectedMat ? '#4F46E5' : '#94A3B8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Package size={10} /> {toolName}
                                                </div>
                                                <div style={{ fontWeight: 850, fontSize: '0.9rem', color: isSelectedMat ? '#4F46E5' : '#334155' }}>{itemName}</div>
                                                {engName && <div style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.6, fontStyle: 'italic' }}>{engName}</div>}
                                            </div>
                                            {isSingle && (
                                                <div style={{
                                                    fontSize: '0.65rem',
                                                    padding: '4px 8px',
                                                    borderRadius: '6px',
                                                    background: isFirstPresentation ? '#EEF2FF' : '#F8FAFC',
                                                    color: isFirstPresentation ? '#4F46E5' : '#64748B',
                                                    fontWeight: 900,
                                                    border: `1px solid ${isFirstPresentation ? '#C7D2FE' : '#E2E8F0'}`
                                                }}>
                                                    {isFirstPresentation ? '✨ PRESENTASI BARU' : `Latihan ke-${repCount}`}
                                                </div>
                                            )}
                                            {/* 🧠 RADAR PREREQUISITE INDICATOR */}
                                            {(() => {
                                                const kidIds = selectedKids.length > 0 ? selectedKids : [];
                                                if (kidIds.length === 0) return null;
                                                
                                                let foundIdx = -1;
                                                let areaList = [];
                                                curriculum.forEach(a => a.subAreas.forEach(sa => {
                                                    const idx = sa.levels.findIndex(l => (typeof l === 'object' ? l.label : l) === item);
                                                    if (idx !== -1) { foundIdx = idx; areaList = sa.levels; }
                                                }));

                                                if (foundIdx > 0) {
                                                    let isMissingMatch = false;
                                                    for (const kId of kidIds) {
                                                        for (let i = 0; i < foundIdx; i++) {
                                                            const preLabel = typeof areaList[i] === 'object' ? areaList[i].label : areaList[i];
                                                            if (!repetitions[`${kId}_${preLabel}`]) {
                                                                isMissingMatch = true;
                                                                break;
                                                            }
                                                        }
                                                        if (isMissingMatch) break;
                                                    }
                                                    if (isMissingMatch) return <div style={{ position: 'absolute', top: -5, right: -5, background: '#F59E0B', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white', fontSize: '10px' }}>!</div>;
                                                }
                                                return null;
                                            })()}
                                        </div>

                                        {isSelectedMat && lookupTool(item).presentation && (
                                            <div className="mini-guide-btn" onClick={(e) => { e.stopPropagation(); setShowGuide({ label: item, presentation: lookupTool(item).presentation }); }}>
                                                <BookOpen size={12} /> Baca Panduan Alat
                                            </div>
                                        )}
                                    </button>
                                );
                            }) : (
                                // Fallback jika lupa setting rak
                                <div style={{ color: '#EF4444', fontSize: '0.85rem' }}>Rak kosong! Tambah alat lewat halaman Kurikulum.</div>
                            )}
                            {/* Emergency override button */}
                            {!isSearchingFull ? (
                                <button className="chip-item outline" style={{ borderStyle: 'dashed', background: '#F8FAFC' }} onClick={() => setIsSearchingFull(true)}>+ Cari di luar rak...</button>
                            ) : (
                                <div style={{ width: '100%', marginTop: '10px' }}>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                        <div style={{ flex: 1, position: 'relative' }}>
                                            <input 
                                                autoFocus
                                                type="text" 
                                                placeholder="Ketik nama alat/materi..." 
                                                value={fullSearchQuery}
                                                onChange={e => setFullSearchQuery(e.target.value)}
                                                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid var(--primary)', outline: 'none', fontWeight: 700 }}
                                            />
                                            {fullSearchQuery && (
                                                <X size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94A3B8' }} onClick={() => setFullSearchQuery('')} />
                                            )}
                                        </div>
                                        <button onClick={() => { setIsSearchingFull(false); setFullSearchQuery(''); }} style={{ background: '#F1F5F9', border: 'none', padding: '12px', borderRadius: '12px', color: '#64748B', fontWeight: 800 }}>Batal</button>
                                    </div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {fullSearchQuery.length >= 2 ? (
                                            /* ⚡ SEARCH RESULTS (MODE KETIK) */
                                            (() => {
                                                const matches = [];
                                                curriculum.forEach(a => a.subAreas?.forEach(sa => sa.levels?.forEach(lvl => {
                                                    const label = typeof lvl === 'object' ? lvl.label : lvl;
                                                    if (label.toLowerCase().includes(fullSearchQuery.toLowerCase())) {
                                                        matches.push({ label, area: a.name, activity: sa.name });
                                                    }
                                                })));
                                                
                                                if (matches.length === 0) return <div style={{ textAlign: 'center', padding: '16px', color: '#94A3B8', fontSize: '0.8rem' }}>Materi tidak ditemukan.</div>;

                                                return matches.slice(0, 5).map(m => (
                                                    <button key={m.label} onClick={() => { setFormMateri(m.label); setIsSearchingFull(false); setFullSearchQuery(''); setSelectedSearchArea(null); }} style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', padding: '12px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', cursor: 'pointer' }}>
                                                        <div style={{ fontSize: '0.6rem', fontWeight: 950, color: '#64748B', textTransform: 'uppercase' }}>{m.area} › {m.activity}</div>
                                                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1E293B' }}>{m.label.split(' / ')[0]}</div>
                                                        {m.label.includes(' / ') && <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontStyle: 'italic' }}>{m.label.split(' / ')[1]}</div>}
                                                    </button>
                                                ));
                                            })()
                                        ) : selectedSearchArea ? (
                                            /* 📂 BROWSE AREA (MODE KLIK) */
                                            <div style={{ animation: 'fadeIn 0.3s' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                                    <button onClick={() => setSelectedSearchArea(null)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <ArrowLeft size={14}/> Kembali ke Semua Area
                                                    </button>
                                                </div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748B', marginBottom: '10px' }}>ALAT PERAGA DI AREA {selectedSearchArea.toUpperCase()}</div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                                                    {curriculum.find(a => a.name === selectedSearchArea)?.subAreas?.map(sa => (
                                                        <div key={sa.name} style={{ marginBottom: '8px' }}>
                                                            <div style={{ fontSize: '0.65rem', fontWeight: 950, color: 'var(--primary)', marginBottom: '6px', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px', width: 'fit-content' }}>{sa.name}</div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px' }}>
                                                                {sa.levels?.map(lvl => {
                                                                    const label = typeof lvl === 'object' ? lvl.label : lvl;
                                                                    return (
                                                                        <button key={label} onClick={() => { setFormMateri(label); setIsSearchingFull(false); setSelectedSearchArea(null); }} style={{ textAlign: 'left', padding: '10px 12px', background: 'white', border: '1px solid #F1F5F9', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                                                                            {label.split(' / ')[0]}
                                                                            {label.includes(' / ') && <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600 }}>{label.split(' / ')[1]}</div>}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            /* 🏔️ PILIH AREA AWAL (MODE IKON) */
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', animation: 'fadeIn 0.3s' }}>
                                                {curriculum.map(area => {
                                                    // Map icons based on area name
                                                    const icon = area.name.includes('Practical') ? <Briefcase size={18}/> : 
                                                                 area.name.includes('Sensorial') ? <Sparkles size={18}/> :
                                                                 area.name.includes('Bahasa') || area.name.includes('Indo') ? <Book size={18}/> :
                                                                 area.name.includes('Math') ? <Hash size={18}/> :
                                                                 area.name.includes('Agama') || area.name.includes('Ibadah') ? <Heart size={18}/> :
                                                                 area.name.includes('English') ? <Globe size={18}/> : <Package size={18}/>;

                                                    return (
                                                        <button 
                                                            key={area.name} 
                                                            onClick={() => setSelectedSearchArea(area.name)}
                                                            style={{ 
                                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                                                                gap: '8px', padding: '16px 10px', background: '#F8FAFC', border: '1px solid #E2E8F0', 
                                                                borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s'
                                                            }}
                                                        >
                                                            <div style={{ color: 'var(--primary)' }}>{icon}</div>
                                                            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#475569', textAlign: 'center' }}>{area.name}</div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SECTION: MATURITY TAPS */}
                    <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B' }}>
                        <Sparkles size={16} color="#8B5CF6" />
                        <span>1. Kematangan (Mastery)</span>
                    </div>
                    <div className="section-box maturity-grid-modern">
                        {MATURITY_LEVELS.map(lvl => {
                            const isSelected = tempLevel === lvl.v;
                            const icons = { P: <CheckCircle2 size={18} />, W: <Activity size={18} />, M: <Award size={18} />, N: <AlertCircle size={18} /> };
                            const colors = { P: '#3B82F6', W: '#F59E0B', M: '#10B981', N: '#EF4444' };
                            const guides = {
                                P: 'Baru menerima presentasi.',
                                W: 'Tahap mengulang & berlatih.',
                                M: 'Mahir, tuntas, & mandiri.',
                                N: 'Macet/butuh bantuan guru.'
                            };
                            return (
                                <button key={lvl.v}
                                    className={`mat-btn-modern ${isSelected ? 'active' : ''}`}
                                    onClick={() => {
                                        setTempLevel(lvl.v);
                                        // Auto-set restoration if Mastered
                                        if (lvl.v === 'M') setTempRestorasi(true);
                                    }}
                                    style={{
                                        borderColor: isSelected ? colors[lvl.v] : '#E2E8F0',
                                        color: isSelected ? colors[lvl.v] : '#64748B',
                                        background: isSelected ? colors[lvl.v] + '08' : 'white',
                                        padding: '12px 10px',
                                        height: 'auto',
                                        minHeight: '70px'
                                    }}
                                >
                                    <div className="icon-circle" style={{ background: isSelected ? colors[lvl.v] : '#F1F5F9', color: isSelected ? 'white' : '#94A3B8', width: '28px', height: '28px' }}>
                                        {icons[lvl.v]}
                                    </div>
                                    <div style={{ textAlign: 'left', flex: 1 }}>
                                        <div style={{ fontWeight: 900, fontSize: '0.9rem', marginBottom: '2px' }}>{lvl.v} {isSelected && <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>— {lvl.l}</span>}</div>
                                        <div style={{ fontSize: '0.6rem', lineHeight: '1.2', opacity: 0.8, fontWeight: 700 }}>{guides[lvl.v]}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* PILLAR 2: EMOTION/CONCENTRATION */}
                    <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', marginTop: '16px' }}>
                        <Target size={16} color="#F59E0B" />
                        <span>2. Gairah Konsentrasi (AMI)</span>
                    </div>
                    <div className="section-box modern-focus-row">
                        {CONCENTRATION_EMOJIS.map(emo => {
                            const isSelected = tempFocus.label === emo.label;
                            const focusIcons = { 'Exploration': <Sparkles size={18} />, 'Working': <Activity size={18} />, 'Deep Focus': <Zap size={18} /> };
                            const focusGuides = {
                                'Exploration': 'Baru menjajaki minat.',
                                'Working': 'Fokus & asyik bekerja.',
                                'Deep Focus': 'Khusyuk & kebal gangguan.'
                            };
                            return (
                                <button key={emo.label}
                                    className={`focus-btn-modern ${isSelected ? 'active' : ''}`}
                                    onClick={() => setTempFocus(emo)}
                                    style={{
                                        borderColor: isSelected ? '#4F46E5' : '#E2E8F0',
                                        background: isSelected ? '#EEF2FF' : 'white',
                                        color: isSelected ? '#4F46E5' : '#64748B',
                                        height: 'auto',
                                        minHeight: '80px',
                                        padding: '12px 6px'
                                    }}
                                >
                                    <div className="focus-icon-wrap" style={{ color: isSelected ? '#4F46E5' : '#CBD5E1', marginBottom: '4px' }}>
                                        {focusIcons[emo.label] || <span>{emo.emoji}</span>}
                                    </div>
                                    <div style={{ fontWeight: 800, fontSize: '0.75rem', marginBottom: '4px' }}>{emo.label}</div>
                                    <div style={{ fontSize: '0.55rem', fontWeight: 700, opacity: 0.7, textAlign: 'center', lineHeight: '1.2' }}>{focusGuides[emo.label]}</div>
                                </button>
                            );
                        })}
                    </div>

                    {/* PILLAR 3: SOCIAL CONTEXT */}
                    <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', marginTop: '16px' }}>
                        <Users size={16} color="#8B5CF6" />
                        <span>3. Konteks Sosial (Second Plane)</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {[
                            { v: 'Individual', e: <User size={18} />, c: '#64748B', g: 'Bekerja sendiri.' },
                            { v: 'Pair', e: <Users size={18} />, c: '#4F46E5', g: 'Bekerja berdua.' },
                            { v: 'Collaborative', e: <Users size={18} />, c: '#8B5CF6', g: 'Kerja kelompok.' }
                        ].map(soc => {
                            const isSelected = tempSocialContext === soc.v;
                            return (
                                <button
                                    key={soc.v}
                                    onClick={() => setTempSocialContext(soc.v)}
                                    style={{
                                        flex: 1, padding: '12px 8px', borderRadius: '16px', border: '2px solid',
                                        borderColor: isSelected ? soc.c : '#E2E8F0',
                                        background: isSelected ? soc.c + '08' : 'white',
                                        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                                        justifyContent: 'center', transition: 'all 0.2s', minHeight: '70px'
                                    }}
                                >
                                    <div style={{ color: isSelected ? soc.c : '#94A3B8' }}>{soc.e}</div>
                                    <div style={{ fontWeight: 900, fontSize: '0.75rem', color: isSelected ? soc.c : '#64748B' }}>{soc.v}</div>
                                    <div style={{ fontSize: '0.6rem', fontWeight: 700, opacity: 0.7, textAlign: 'center' }}>{soc.g}</div>
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
                        <div>
                            <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Heart size={14} color="#EF4444" /> <span>4. Emosi (Mood)</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                {[
                                    { v: 'Tenang', e: <Zap size={16} />, c: '#3B82F6', g: 'Hati tenang' },
                                    { v: 'Ceria', e: <Sparkles size={16} />, c: '#F59E0B', g: 'Senang' },
                                    { v: 'Frustrasi', e: <AlertCircle size={16} />, c: '#EF4444', g: 'Lelah' }
                                ].map(m => {
                                    const isSelected = tempMood === m.v;
                                    return (
                                        <button key={m.v} onClick={() => setTempMood(m.v)} style={{
                                            padding: '10px 4px', borderRadius: '14px', border: '2px solid',
                                            borderColor: isSelected ? m.c : '#E2E8F0',
                                            background: isSelected ? m.c + '10' : 'white',
                                            color: isSelected ? m.c : '#64748B',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer'
                                        }}>
                                            {m.e}
                                            <div style={{ fontSize: '0.65rem', fontWeight: 900 }}>{m.v}</div>
                                            <div style={{ fontSize: '0.55rem', fontWeight: 700, opacity: 0.7 }}>{m.g}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <RotateCcw size={14} color="#10B981" /> <span>5. Siklus Kerja</span>
                            </div>
                            <button
                                onClick={() => setTempRestorasi(!tempRestorasi)}
                                style={{
                                    width: '100%', padding: '10px', borderRadius: '16px', border: '2px solid',
                                    borderColor: tempRestorasi ? '#10B981' : '#EF4444',
                                    background: tempRestorasi ? '#F0FDF4' : '#FEF2F2',
                                    fontWeight: 900, color: tempRestorasi ? '#166534' : '#991B1B',
                                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', justifyContent: 'center', fontSize: '0.85rem',
                                    minHeight: '70px'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    {tempRestorasi ? <CheckCircle2 size={16} /> : <X size={16} />}
                                    {tempRestorasi ? 'Restored' : 'Incomplete'}
                                </div>
                                <div style={{ fontSize: '0.6rem', fontWeight: 700, opacity: 0.8 }}>
                                    {tempRestorasi ? 'Alat tuntas dirapikan.' : 'Belum selesai merpikan.'}
                                </div>
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: 32 }}>
                        <button className="btn-simpan-massive" disabled={!formMateri} onClick={() => handleActionWithReview('smart', formMateri)}>
                            Selesai & Simpan
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        .montessori-v3-container {
            font-family: 'Inter', sans-serif;
            background-color: #F4F7FB;
            min-height: 100vh;
            color: #0F172A;
            padding-bottom: 120px;
        }

        /* HEADER & TABS */
        .app-header-area { padding: 30px 24px 20px; position: sticky; top:0; z-index:100;
            background: rgba(255, 255, 255, 0.85); 
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }
        .app-header-area h1 { font-family: 'Outfit', sans-serif; font-size: 2rem; font-weight: 900; margin: 0 0 16px; color: #0F172A;}
        
        .room-switcher {
            display: flex; align-items: center; gap: 8px; background: #F8FAFC; padding: 10px 16px; border-radius: 14px; margin-bottom: 24px; border: 1px solid #E2E8F0;
        }
        .room-switcher select { flex: 1; border: none; background: transparent; font-weight: 800; font-size: 0.95rem; color: var(--primary); outline: none; }

        .tri-tabs { 
            display: flex; background: rgba(241, 245, 249, 0.6); padding: 6px; border-radius: 20px; gap: 6px; 
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.4);
        }
        .tri-btn { 
            flex: 1; padding: 12px 10px; border: none; border-radius: 14px; background: transparent; 
            font-weight: 800; font-size: 0.85rem; color: #64748B; cursor: pointer; transition: all 0.2s; 
            display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .tri-btn.active { background: white; color: var(--primary); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .tab-text-short { display: none; }

        @media (max-width: 640px) {
            .tri-tabs { display: grid; grid-template-columns: 1fr 1fr 1fr; padding: 4px; gap: 4px; border-radius: 16px; }
            .tri-btn { padding: 10px 4px; flex-direction: column; gap: 4px; border-radius: 12px; font-size: 0.7rem; }
            .tab-icon { font-size: 1.2rem; }
            .tab-text-full { display: none; }
            .tab-text-short { display: block; font-weight: 900; }
            
            .app-header-area h1 { font-size: 1.5rem; margin-bottom: 12px; }
            .room-switcher { padding: 8px 12px; margin-bottom: 16px; }
            .room-switcher select { font-size: 0.85rem; }
        }

        .main-playground { padding: 24px; }
        .section-title { font-size: 0.85rem; font-weight: 800; color: #64748B; margin-bottom: 16px; letter-spacing: 0.5px; text-transform: uppercase; }

        /* TARGET VIEW */
        .target-card { background: white; border-radius: 24px; border: 2px solid var(--primary-light); padding: 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap:16px;}
        .tc-left h3 { font-size: 1.3rem; margin: 0 0 8px; color: #0F172A; }
        .area-badge { display: inline-block; padding: 6px 12px; background: #FFFBEB; color: #D97706; border-radius: 10px; font-size: 0.8rem; font-weight: 800; margin-bottom: 12px; }
        .tc-kids { display: flex; gap: 8px; flex-wrap: wrap; }
        .kid-pill { background: #F8FAFC; padding: 6px 12px 6px 6px; border-radius: 12px; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 8px; border: 1px solid #E2E8F0; }
        .kid-avatar { width: 26px; height: 26px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: var(--primary);}
        .btn-start-presentation { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); color: white; border: none; padding: 16px 24px; border-radius: 16px; font-weight: 800; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2); }

        /* RADAR SWEEP VIEW */
        .sweep-instruction { background: var(--primary-light); border: 1px dashed #A5B4FC; padding: 16px; border-radius: 16px; color: var(--primary); font-size: 0.9rem; font-weight: 600; display: flex; gap: 12px; margin-bottom: 24px;}
        .search-bar-solid { display: flex; align-items: center; background: white; padding: 16px 20px; border-radius: 20px; border: 1px solid #E2E8F0; margin-bottom: 24px; gap: 12px; }
        .search-bar-solid input { flex: 1; border: none; outline: none; font-size: 1rem; font-weight: 700; color: #1E293B;}
        
        .radar-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
        .radar-kid-card { background: white; border-radius: 20px; border: 2px solid transparent; padding: 16px; display: flex; align-items: center; gap: 16px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
        .radar-kid-card.urgent-border { border-color: #FECACA; background: #FEF2F2; color: var(--accent); }
        .radar-kid-card.selected { border-color: var(--primary); background: var(--primary-light); transform: scale(1.02); box-shadow: 0 8px 15px rgba(37, 99, 235, 0.15); }
        .radar-avatar { width: 44px; height: 44px; background: #F1F5F9; border-radius: 14px; font-weight: 800; color: #64748B; font-size: 1.1rem; display: flex; justify-content: center; align-items: center; }
        .active-avatar { background: var(--primary); color: white; }
        .radar-info h4 { font-size: 1.05rem; margin: 0 0 4px; color: #0F172A; }
        .status-urgent { display: flex; align-items: center; gap: 4px; color: #DC2626; font-size: 0.8rem; font-weight: 800; }
        .status-okay { color: #059669; font-size: 0.8rem; font-weight: 700; }
        .status-done { display: flex; align-items: center; gap: 4px; color: #10B981; font-size: 0.8rem; font-weight: 800; }
        .observed-subdued { border-color: #F1F5F9 !important; background: #F8FAFC !important; }
        .observed-avatar { background: #E2E8F0 !important; color: #94A3B8 !important; }

        /* 🚀 MORPHING ACTION BAR (Premium Overlay Logic) */
        .floating-action-bar { 
            position: fixed; 
            bottom: 24px; 
            left: 50%; 
            transform: translateX(-50%) translateY(120px); 
            width: 94%;
            max-width: 440px;
            height: 76px;
            background: #0F172A; 
            padding: 0 12px 0 24px; 
            border-radius: 30px; 
            box-shadow: 0 20px 50px rgba(0,0,0,0.4); 
            display: flex; 
            align-items: center; 
            justify-content: space-between;
            z-index: 9999999; 
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            border: 1px solid rgba(255,255,255,0.1);
        }
        .floating-action-bar.visible { transform: translateX(-50%) translateY(0); }
        .fab-text { display: flex; align-items: center; gap: 12px; font-weight: 800; color: white; }
        .badge-count { background: var(--primary); color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; box-shadow: 0 0 15px rgba(37, 99, 235, 0.4); }
        .btn-fab-catat { 
            background: white; 
            color: #0F172A; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 20px; 
            font-weight: 950; 
            cursor: pointer; 
            display: flex; 
            align-items: center; 
            gap: 8px;
            font-family: 'Inter', sans-serif; 
            font-size: 0.9rem;
            transition: all 0.2s;
        }
        .btn-fab-catat:active { transform: scale(0.95); opacity: 0.9; }

        /* OVERVIEW TAB */
        .overview-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;}
        .ov-card { padding: 24px; border-radius: 24px; color: white; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .ov-card.bg-green { background: linear-gradient(135deg, #10B981, #059669); }
        .ov-card.bg-blue { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); }
        .ov-card h3 { font-size: 0.9rem; font-weight: 800; opacity: 0.9; margin: 0 0 12px; }
        .ov-card h1 { font-size: 3rem; margin: 0; font-weight: 900; }
        .ov-card h1 span { font-size: 1rem; opacity: 0.8; font-weight: 700; }
        .ov-card p { font-size: 0.85rem; font-weight: 600; margin-top: 12px; opacity: 0.9; }

        /* MAGIC BOTTOM SHEET */
        .glass-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.15); backdrop-filter: blur(4px); display: none; align-items: flex-end; justify-content: center; z-index: 8000; opacity: 0; transition: opacity 0.3s;}
        .glass-overlay.active { display: flex; opacity: 1; }
        .bottom-sheet { 
            background: #FFFFFF; 
            width: 100%; max-width: 600px; border-radius: 32px 32px 0 0; 
            padding: 24px 28px 40px; transform: translateY(100%); 
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
            max-height: 94vh; overflow-y: auto;
            border: 1px solid #E2E8F0;
            box-shadow: 0 -20px 50px rgba(0,0,0,0.08);
        }
        .glass-overlay.active .bottom-sheet { transform: translateY(0); }
        .sheet-handle { width: 50px; height: 6px; background: #E2E8F0; border-radius: 10px; margin: 0 auto 24px; }
        .sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .sheet-header h2 { font-family: 'Outfit'; font-size: 1.5rem; margin: 0 0 4px;}
        .sheet-names { font-size: 0.9rem; font-weight: 700; color: #64748B; }
        .btn-close { background: #F1F5F9; border: none; width: 44px; height: 44px; border-radius: 50%; color: #64748B; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        .section-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 20px; padding: 20px; margin-bottom: 24px; }
        .limit-warning { font-size: 0.75rem; font-weight: 800; color: #D97706; background: #FEF3C7; padding: 6px 12px; border-radius: 8px; display: inline-block; margin-bottom: 16px; }
        
        .chip-list { display: flex; flex-direction: column; gap: 12px; }
        .chip-item { background: white; border: 1px solid #E2E8F0; border-radius: 16px; padding: 16px; text-align: left; font-size: 1.05rem; font-weight: 700; color: #1E293B; cursor: pointer; position: relative; transition: all 0.2s;}
        .chip-item.active { border-color: var(--primary); background: var(--primary-light); box-shadow: 0 4px 15px rgba(37, 99, 235, 0.15); border-width: 2px;}
        .chip-item.rep-glow { border: 2px solid #F59E0B; }
        .chip-item.outline { border: 2px dashed #CBD5E1; color: #64748B; text-align: center; }
        .rep-badge { display: inline-block; background: #FEFCE8; color: #A16207; font-size: 0.8rem; font-weight: 800; padding: 4px 8px; border-radius: 8px; margin-top: 8px; border: 1px solid #FEF08A; }
        .mini-guide-btn { margin-top: 12px; display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 800; color: #4F46E5; background: white; padding: 6px 12px; border-radius: 8px; border: 1px solid #C7D2FE; }

        .maturity-grid-modern { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .mat-btn-modern { 
            display: flex; align-items: center; gap: 12px; padding: 12px;
            border-radius: 16px; border: 2px solid #E2E8F0; cursor: pointer; transition: all 0.2s;
            background: white;
        }
        .mat-btn-modern .icon-circle {
            width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
        }
        
        .modern-focus-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .focus-btn-modern {
            padding: 16px 8px; border-radius: 16px; border: 2px solid #E2E8F0;
            display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s;
            background: white; font-weight: 800; font-size: 0.75rem;
        }
        .focus-icon-wrap { transition: transform 0.2s; }
        .focus-btn-modern.active .focus-icon-wrap { transform: scale(1.2); }

        .btn-simpan-massive { background: #4F46E5; color: white; width: 100%; border: none; padding: 20px; border-radius: 20px; font-size: 1rem; font-weight: 950; box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3); cursor: pointer; transition: all 0.2s; }
        .btn-simpan-massive:disabled { background: #CBD5E1; color: #94A3B8; box-shadow: none; cursor: not-allowed; }
        .btn-simpan-massive:active:not(:disabled) { transform: scale(0.98); }

        /* MODERN MENTOR MODAL */
        .modern-guide-modal { 
            background: white; width: 92%; max-width: 550px; border-radius: 40px; 
            box-shadow: 0 30px 60px -12px rgba(15,23,42,0.3); overflow: hidden;
            display: flex; flex-direction: column; max-height: 85vh;
        }
        .modern-guide-header { 
            display: flex; justify-content: space-between; align-items: center; 
            padding: 24px 32px; background: white; 
        }
        .modern-guide-badge { 
            font-size: 0.75rem; font-weight: 900; padding: 10px 18px; 
            border-radius: 100px; letter-spacing: 0.5px;
        }
        .modern-close-btn { 
            background: #F1F5F9; border: none; width: 44px; height: 44px; 
            border-radius: 50%; color: #64748B; display: flex; align-items: center; 
            justify-content: center; cursor: pointer; transition: all 0.2s;
        }
        .modern-guide-scroll-body { padding: 0 32px 40px; overflow-y: auto; }
        .modern-title { 
            font-family: 'Outfit'; font-size: 1.8rem; font-weight: 900; 
            color: #0F172A; margin: 0 0 24px; line-height: 1.2;
        }
        .modern-info-card { 
            background: #F8FAFC; border-radius: 24px; padding: 20px 24px; 
            display: flex; gap: 16px; align-items: center; margin-bottom: 32px;
            border: 1px solid #E2E8F0;
        }
        .modern-info-card label { display: block; font-size: 0.65rem; font-weight: 900; color: #94A3B8; text-transform: uppercase; margin-bottom: 2px; }
        .modern-info-card p { font-size: 1rem; font-weight: 750; color: #1E293B; margin: 0; }

        .modern-steps-container { position: relative; padding-left: 20px; }
        .modern-steps-container::before { 
            content: ''; position: absolute; left: 6px; top: 10px; bottom: 10px; 
            width: 2px; background: #E2E8F0; border-radius: 2px;
        }
        
        .modern-step-header { 
            position: relative; margin-top: 32px; margin-bottom: 20px;
            font-size: 0.9rem; font-weight: 950; color: #0F172A; text-transform: uppercase;
            padding-left: 10px;
        }
        .modern-header-dot { 
            position: absolute; left: -20px; top: 50%; transform: translateY(-50%);
            width: 14px; height: 14px; border: 3px solid white; border-radius: 50%;
            box-shadow: 0 0 0 2px #E2E8F0;
        }

        .modern-step-row { position: relative; display: flex; gap: 16px; margin-bottom: 20px; }
        .modern-step-num { 
            font-size: 0.85rem; font-weight: 950; color: #94A3B8; 
            width: 24px; flex-shrink: 0; text-align: right; margin-top: 2px;
        }
        .modern-step-content { font-size: 1.05rem; font-weight: 650; color: #334155; line-height: 1.6; flex: 1; }
        
        .modern-dialogue-box { 
            background: #F1F5F9; padding: 12px 16px; border-radius: 16px; 
            margin: 12px 0; color: #4F46E5; font-weight: 800; font-size: 0.95rem;
            display: flex; gap: 10px; align-items: flex-start;
            border-left: 4px solid #4F46E5;
        }
        .modern-dialogue-box span { font-style: italic; }

        .modern-error-card { 
            margin-top: 40px; background: #FEF2F2; border: 1.5px solid #FECACA; 
            padding: 24px; border-radius: 28px; display: flex; gap: 16px; color: #991B1B;
        }
        .modern-error-card label { display: block; font-size: 0.65rem; font-weight: 900; color: #F87171; text-transform: uppercase; margin-bottom: 4px; }
        .modern-error-card p { font-size: 0.95rem; font-weight: 750; margin: 0; line-height: 1.5; }

        .modern-video-btn { 
            margin-top: 24px; display: flex; align-items: center; justify-content: center; gap: 12px;
            background: #0F172A; color: white; padding: 18px 24px; border-radius: 24px;
            font-weight: 900; text-decoration: none; transition: transform 0.2s;
            box-shadow: 0 10px 20px rgba(15,23,42,0.2);
        }
        .modern-video-btn:hover { transform: translateY(-2px); }
        .video-play-icon { 
            width: 28px; height: 28px; background: white; color: #0F172A; 
            border-radius: 50%; display: flex; align-items: center; justify-content: center; 
            font-size: 0.7rem; padding-left: 2px;
        }
        .fade-in { animation: fadeIn 0.3s ease-in-out; }

        @keyframes pulseWarning { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(0.98); } 100% { opacity: 1; transform: scale(1); } }
        .pulse-warning { animation: pulseWarning 2s infinite ease-in-out; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .empty-state-nice { text-align: center; background: white; padding: 48px 24px; border-radius: 24px; border: 2px dashed #CBD5E1; color: #64748B; }
        .empty-state-nice h3 { margin: 16px 0 8px; color: #1E293B; font-weight: 800; }
        .empty-state-nice p { font-size: 0.9rem; font-weight: 600; line-height: 1.5; }
        
        .success-overlay { position: fixed; inset: 0; background: rgba(255,255,255,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        .success-pill { background: #10B981; color: white; padding: 20px 40px; border-radius: 40px; font-size: 1.2rem; font-weight: 900; display: flex; align-items: center; gap: 16px; box-shadow: 0 20px 50px rgba(16,185,129,0.3); animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);}
        
        .undo-btn { 
            background: white; color: #DC2626; border: 2px solid #FECACA; padding: 12px 24px; border-radius: 100px; 
            font-weight: 800; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s;
            box-shadow: 0 10px 20px rgba(220, 38, 38, 0.1);
        }
        .undo-btn:hover { background: #FEF2F2; transform: translateY(-2px); }

        @keyframes slideUp { from {transform: translateY(50px) scale(0.9); opacity:0;} to {transform: translateY(0) scale(1); opacity:1;} }
      `}</style>
        </div>
    );
}
