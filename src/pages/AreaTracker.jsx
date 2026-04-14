import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../firebase-config';
import {
  collection, getDocs, doc, setDoc, getDoc, query, where, limit, addDoc, serverTimestamp, Timestamp, deleteDoc, writeBatch
} from 'firebase/firestore';
import { AREA_SENTRA, MATURITY_LEVELS, CONCENTRATION_EMOJIS } from '../data/areaSentra';
import {
  ArrowLeft, Save, CheckCircle2, Star, X, Info, History, Search,
  Moon, Hash, BookOpen, Leaf, Globe2, Wand2, MapPin, PackageOpen, Loader2, ClipboardList,
  MessageSquare, Package, AlertCircle, TrendingUp, Target, Sparkles, Settings2, RotateCcw,
  LayoutGrid, Book, Globe, Home, Briefcase, Calendar, Activity, Award, Zap, User, Users, Heart, ArrowRightCircle, Eye, EyeOff, AlertTriangle,
  PackageSearch, ChevronRight, GraduationCap, ShieldCheck, Flame, Users2, HeartHandshake, Smile, SmilePlus, HelpCircle
} from 'lucide-react';

const IconMap = { Moon, Hash, BookOpen, Leaf, Globe2, Wand2 };
const AreaIcon = ({ name, color, size = 18 }) => {
  const IconComp = IconMap[name] || Star;
  return <IconComp size={size} color={color} />;
};

export default function AreaTracker() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomParam = searchParams.get('room');
  
  const [viewMode, setViewMode] = useState(searchParams.get('mode') === 'kelola' ? 'kelola' : 'observasi');
  const [activeRoom, setActiveRoom] = useState(roomParam || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [curriculum, setCurriculum] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAreaId, setActiveAreaId] = useState(null);
  const [shelfItems, setShelfItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [repetitions, setRepetitions] = useState({});
  const [observedToday, setObservedToday] = useState([]);
  const [roomList, setRoomList] = useState([]);

  const [activeSubAreaId, setActiveSubAreaId] = useState(null);
  const [mapFocusGrade, setMapFocusGrade] = useState('All');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showGuide, setShowGuide] = useState(null);
  const [showPrepSheet, setShowPrepSheet] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [activeDrawerMateri, setActiveDrawerMateri] = useState(null);
  const [activePilarHelp, setActivePilarHelp] = useState(null); // 🚀 Help Tooltip State
  
  const [selectedKids, setSelectedKids] = useState([]);
  const [showFullGrid, setShowFullGrid] = useState(false);
  const [activityType, setActivityType] = useState('auto');
  const [loadingAction, setLoadingAction] = useState(false);

  // 📝 5 Pilar Observasi Sentra (AMI Indonesia Labels)
  const [maturity, setMaturity] = useState('P');
  const [concentration, setConcentration] = useState('Exploration');
  const [socialContext, setSocialContext] = useState('Individual');
  const [independence, setIndependence] = useState('Independent');
  const [restoration, setRestoration] = useState(true);

  const [masteredCount, setMasteredCount] = useState({});
  const [popularData, setPopularData] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const roomSnap = await getDocs(collection(db, 'master_rombel'));
        const rooms = roomSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        rooms.sort((a, b) => (a.level || '').localeCompare(b.level || ''));
        setRoomList(rooms);
        if (!activeRoom && rooms.length > 0) setActiveRoom(rooms[0].name);

        const studQuery = query(collection(db, 'students'), where('status', '==', 'active'));
        const studSnap = await getDocs(studQuery);
        const studData = studSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        studData.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(studData);

        const curSnap = await getDocs(collection(db, 'kurikulum_pusat'));
        let curData = curSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (curData.length === 0) curData = AREA_SENTRA;
        else {
          const orderMap = {};
          AREA_SENTRA.forEach((item, idx) => orderMap[item.id] = idx);
          curData.sort((a, b) => (orderMap[a.id] ?? 99) - (orderMap[b.id] ?? 99));
        }
        setCurriculum(curData);
        if (!activeAreaId) setActiveAreaId(curData[0].id);

        const actSnap = await getDocs(collection(db, 'jurnal_aktivitas'));
        const reps = {};
        const pCounts = {};
        const mCounts = {};
        actSnap.docs.forEach(d => {
            const data = d.data();
            const key = `${data.muridId}_${data.pencapaian}`;
            const level = data.kematangan || 'P';
            if (!reps[key]) reps[key] = { count: 1, level };
            else {
                reps[key].count++;
                if (level === 'M' || level === 'Mahir') reps[key].level = 'M';
            }
            if (level === 'M' || level === 'Mahir') mCounts[data.pencapaian] = (mCounts[data.pencapaian] || 0) + 1;
            pCounts[data.pencapaian] = (pCounts[data.pencapaian] || 0) + 1;
        });
        setRepetitions(reps);
        setMasteredCount(mCounts);
        setPopularData(pCounts);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (loading || !activeRoom) return;
    const syncContext = async () => {
        try {
            const shelfDoc = await getDoc(doc(db, 'setelan_rak', activeRoom));
            if (shelfDoc.exists()) setShelfItems(shelfDoc.data().items || []);
            else setShelfItems([]);

            const q = query(collection(db, 'jurnal_aktivitas'));
            const snap = await getDocs(q);
            const observed = new Set();
            snap.docs.forEach(doc => {
                const d = doc.data();
                const dStr = d.tanggal?.toDate ? d.tanggal.toDate().toISOString().split('T')[0] : new Date(d.tanggal).toISOString().split('T')[0];
                if (dStr === selectedDate) observed.add(d.muridId);
            });
            setObservedToday(Array.from(observed));
        } catch (e) {}
    };
    syncContext();
  }, [activeRoom, selectedDate, loading]);

  useEffect(() => {
    if (!activeRoom || roomList.length === 0) return;
    const roomInfo = roomList.find(r => r.name === activeRoom);
    if (roomInfo?.level) setMapFocusGrade(roomInfo.level);
  }, [activeRoom, roomList]);

  const toggleItemOnShelf = (label) => {
    setShelfItems(prev => prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]);
  };

  const handleSaveShelf = async () => {
    setLoadingAction(true);
    try {
        await setDoc(doc(db, 'setelan_rak', activeRoom), {
            items: shelfItems,
            updatedAt: serverTimestamp(),
            updatedBy: 'Sistem Guru (Integrated)'
        });
        setShowSuccess(true);
        setTimeout(() => { setShowSuccess(false); setViewMode('observasi'); }, 1500);
    } catch (e) { console.error(e); }
    finally { setLoadingAction(false); }
  };

  const lookupTool = (materiLabel) => {
    let result = { area: "Umum", activity: "Eksplorasi", presentation: null, color: 'var(--primary)', areaObj: null, itemObj: null };
    curriculum.forEach(a => a.subAreas?.forEach(sa => sa.levels?.forEach(lvl => {
        const label = typeof lvl === 'object' ? lvl.label : lvl;
        if (label === materiLabel) result = { area: a.name, activity: sa.name, color: a.color, presentation: typeof lvl === 'object' ? lvl.presentation : null, areaObj: a, itemObj: lvl };
    })));
    return result;
  };

  const getAparatusList = () => {
    const list = {};
    curriculum.forEach(area => {
        area.subAreas.forEach(sub => {
            sub.levels.forEach(lvl => {
                const label = typeof lvl === 'object' ? lvl.label : lvl;
                if (shelfItems.includes(label) && lvl.presentation?.toolsList) {
                    if (!list[area.name]) list[area.name] = new Set();
                    lvl.presentation.toolsList.forEach(tool => list[area.name].add(tool));
                }
            });
        });
    });
    return list;
  };

  const toggleKidSelection = (id) => {
    setSelectedKids(prev => {
        const isCurrentlySelected = prev.includes(id);
        const next = isCurrentlySelected ? prev.filter(k => k !== id) : [...prev, id];
        
        if (!isCurrentlySelected && next.length === 1 && activeDrawerMateri) {
            const kidRep = repetitions[`${id}_${activeDrawerMateri}`];
            const isPractice = (kidRep?.count > 0);
            setMaturity(isPractice ? 'W' : 'P');
            setConcentration(isPractice ? 'Asyik' : 'Exploration');
            setSocialContext('Individual');
            setIndependence('Independent');
            setRestoration(true);
        }
        return next;
    });
  };

  const handleInstantSave = async () => {
    if (!activeDrawerMateri || selectedKids.length === 0) return;
    setLoadingAction(true);
    const toolInfo = lookupTool(activeDrawerMateri);
    const batch = writeBatch(db);
    
    try {
        selectedKids.forEach(sId => {
            const student = students.find(s => s.id === sId);
            const isPractice = (activityType === 'practice' || (activityType === 'auto' && repetitions[`${sId}_${activeDrawerMateri}`]?.count > 0));
            
            const finalMaturity = showSheet ? maturity : (isPractice ? 'W' : 'P');
            const finalConcentration = showSheet ? concentration : (isPractice ? 'Asyik' : 'Exploration');

            const newDocRef = doc(collection(db, 'jurnal_aktivitas'));
            batch.set(newDocRef, {
                murid: student.name, muridId: sId, area: toolInfo.area, aktivitas: toolInfo.activity, pencapaian: activeDrawerMateri,
                kematangan: finalMaturity, 
                konsentrasi: finalConcentration, 
                sosial: showSheet ? socialContext : 'Individual',
                emosional: showSheet ? independence : 'Independent',
                restorasi: showSheet ? restoration : true,
                durasi: 15, guru: "Ustadzah",
                tanggal: selectedDate === new Date().toISOString().split('T')[0] ? serverTimestamp() : Timestamp.fromDate(new Date(selectedDate)),
                mode: 'pilar_sentra_v2'
            });
        });

        await batch.commit();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        setSelectedKids([]);
        setActiveDrawerMateri(null);
        setShowSheet(false);
    } catch (e) { 
        console.error("Save error:", e);
        alert("Gagal menyimpan: " + e.message);
    }
    finally { setLoadingAction(false); }
  };

  const activeArea = curriculum.find(a => a.id === activeAreaId) || curriculum[0];
  const currentRoomStudents = students.filter(s => s.rombel === activeRoom);

  const getProgressData = (itemLabel) => {
    const mastered = [], working = [], waiting = [];
    currentRoomStudents.forEach(s => {
        const rep = repetitions[`${s.id}_${itemLabel}`];
        if (rep) {
            if (rep.level === 'M') mastered.push(s);
            else working.push(s);
        } else waiting.push(s);
    });
    const total = currentRoomStudents.length || 1;
    return { mastered, working, waiting, masteredPct: Math.round((mastered.length / total) * 100), workingPct: Math.round((working.length / total) * 100) };
  };

  if (loading) return <div className="loading-screen"><Loader2 className="animate-spin" /> <p>Menyiapkan Command Center...</p></div>;

  const aparatusList = getAparatusList();
  const activeToolInfo = activeDrawerMateri ? lookupTool(activeDrawerMateri) : null;
  const activeProgress = activeDrawerMateri ? getProgressData(activeDrawerMateri) : null;

  // 🚀 Pilar Guidance Data (AMI Standard)
  const PILAR_GUIDE = {
    maturity: {
      title: "Kematangan (P-W-M-N)",
      text: "P: Presentasi pertama guru.\nW: Anak memilih & mengulang sendiri.\nM: Anak sudah menguasai & tuntas.\nN: Anak kesulitan, menyalahgunakan alat, atau butuh demo ulang."
    },
    concentration: {
      title: "Konsentrasi",
      text: "Eksplorasi: Baru tahap coba-coba/penasaran.\nAsyik Bekerja: Anak mulai fokus meski ada distraksi.\nDeep Focus: Konsentrasi mendalam, anak 'tenggelam' dalam kerjanya."
    },
    social: {
      title: "Konteks Sosial",
      text: "Individual: Bekerja sendiri dengan dunianya.\nBerpasangan: Bekerja berdampingan (Parallel play/Shared).\nKelompok: Berbagi peran untuk satu tujuan."
    },
    independence: {
      title: "Kemandirian",
      text: "Mandiri: Memilih, memproses & mengakhiri sendiri.\nButuh Dorongan: Anak ragu, menunggu perintah, atau mencari persetujuan guru terus-menerus."
    },
    restoration: {
      title: "Restorasi Alat",
      text: "YA: Dikembalikan ke rak sesuai urutan & rapi.\nTIDAK: Ditinggal di meja/karpet tanpa dirapikan."
    }
  };

  return (
    <div className="unified-sentra-container" style={{ paddingBottom: '100px' }}>
      
      <div className="control-center-header" style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', padding: '12px 16px', borderBottom: '1.5px solid #F1F5F9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                <div className="room-badge" style={{ background: '#EEF2FF', color: 'var(--primary)', padding: '6px 10px', borderRadius: '12px', fontWeight: 950, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #C7D2FE', width: '100%', minWidth: 0 }}>
                    <MapPin size={13} style={{ flexShrink: 0 }} /> 
                    <select value={activeRoom} onChange={e => setActiveRoom(e.target.value)} style={{ background: 'transparent', border: 'none', fontWeight: 950, color: 'inherit', outline: 'none', cursor: 'pointer', width: '100%', minWidth: 0, textOverflow: 'ellipsis' }}>
                        {roomList.map(r => (
                            <option key={r.id} value={r.name}>{r.level ? `${r.level} - ` : ''}{r.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '14px', border: '1px solid #E2E8F0', flexShrink: 0 }}>
                <button onClick={() => setViewMode('observasi')} style={{ padding: '7px 12px', borderRadius: '11px', border: 'none', background: viewMode === 'observasi' ? 'white' : 'transparent', color: viewMode === 'observasi' ? 'var(--primary)' : '#64748B', fontWeight: 950, fontSize: '0.65rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, boxShadow: viewMode === 'observasi' ? '0 4px 12px rgba(0,0,0,0.08)' : 'none', transition: '0.3s' }}>
                    <LayoutGrid size={13} /> RAK
                </button>
                <button onClick={() => setViewMode('kelola')} style={{ padding: '7px 12px', borderRadius: '11px', border: 'none', background: viewMode === 'kelola' ? 'white' : 'transparent', color: viewMode === 'kelola' ? 'var(--primary)' : '#64748B', fontWeight: 950, fontSize: '0.65rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, boxShadow: viewMode === 'kelola' ? '0 4px 12px rgba(0,0,0,0.08)' : 'none', transition: '0.3s' }}>
                    <Settings2 size={13} /> ATUR
                </button>
            </div>
        </div>

        <div className="area-navbar-wrapper" style={{ margin: '0 -4px', padding: '0 4px' }}>
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
            {curriculum.map(area => {
              const isActive = activeAreaId === area.id;
              const countOnShelf = area.subAreas?.reduce((sum, sub) => sum + sub.levels.filter(l => shelfItems.includes(typeof l === 'object' ? l.label : l)).length, 0) || 0;
              const shortLabel = (() => {
                  const n = area.name.toLowerCase();
                  if (n.includes('agama') || n.includes('pai')) return 'PAI';
                  if (n.includes('matematika') || n.includes('math')) return 'MATH';
                  if (n.includes('bahasa')) return 'BHSA';
                  if (n.includes('budaya') || n.includes('culture')) return 'BDYA';
                  if (n.includes('practical') || n.includes('praktis')) return 'PRAC';
                  if (n.includes('seni') || n.includes('art')) return 'SENI';
                  if (n.includes('indrawi') || n.includes('sensorial')) return 'SAINS';
                  return area.name.substring(0, 4).toUpperCase();
              })();
              return (
                <button key={area.id} onClick={() => setActiveAreaId(area.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '6px 2px', borderRadius: '10px', background: isActive ? `${area.color}15` : 'transparent', border: 'none', color: isActive ? area.color : '#94A3B8', cursor: 'pointer', transition: '0.2s', minWidth: 0, position: 'relative' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: isActive ? area.color : '#F1F5F9', color: isActive ? 'white' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AreaIcon name={area.icon} color={isActive ? 'white' : '#94A3B8'} size={14} />
                  </div>
                  <span style={{ fontSize: '0.55rem', fontWeight: 950 }}>{shortLabel}</span>
                  {countOnShelf > 0 && <span style={{ position: 'absolute', top: 0, right: 0, fontSize: '0.45rem', background: '#0F172A', color: 'white', padding: '1px 3px', borderRadius: '4px' }}>{countOnShelf}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {viewMode === 'kelola' ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                    {['All', 'K1', 'K2', 'K3'].map(g => (
                        <button key={g} onClick={() => setMapFocusGrade(g)} style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: mapFocusGrade === g ? activeArea.color : '#F1F5F9', color: mapFocusGrade === g ? 'white' : '#64748B', fontWeight: 900, fontSize: '0.6rem' }}>{g}</button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {shelfItems.length > 0 && (
                        <button onClick={() => setShowPrepSheet(true)} style={{ background: '#EEF2FF', color: 'var(--primary)', border: '1px solid #C7D2FE', padding: '8px 12px', borderRadius: '10px', fontWeight: 950, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}><PackageSearch size={16} /> CEK ALAT</button>
                    )}
                    <button onClick={handleSaveShelf} className="btn-save-master" style={{ background: 'var(--primary)', color: 'white', padding: '8px 16px', borderRadius: '10px', border: 'none', fontWeight: 950, fontSize: '0.75rem' }}>{loadingAction ? '...' : 'SIMPAN'}</button>
                </div>
            </div>
        ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F8FAFC', padding: '5px 12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <Calendar size={12} color="#64748B" />
                    <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ border: 'none', background: 'transparent', fontWeight: 950, fontSize: '0.75rem', color: '#1E293B', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    {['All', 'K1', 'K2', 'K3'].map(g => (
                        <button key={g} onClick={() => setMapFocusGrade(g)} style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: mapFocusGrade === g ? activeArea.color : '#F1F5F9', color: mapFocusGrade === g ? 'white' : '#64748B', fontWeight: 900, fontSize: '0.6rem' }}>{g}</button>
                    ))}
                </div>
            </div>
        )}
      </div>

      <div style={{ padding: '24px 20px', maxWidth: '850px', margin: '0 auto' }}>
          <div key={`${viewMode}-${activeAreaId}`} className="animate-content-switch" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeArea?.subAreas.map(sub => {
                const isExpanded = activeSubAreaId === sub.id;
                const filteredLevels = sub.levels.filter(m => {
                    const label = typeof m === 'object' ? m.label : m;
                    const matchesGrade = mapFocusGrade === 'All' || label.includes(mapFocusGrade);
                    const matchesMode = viewMode === 'kelola' || shelfItems.includes(label);
                    return matchesGrade && matchesMode;
                });
                if (filteredLevels.length === 0) return null;
                const countInSubAreaOnShelf = sub.levels.filter(l => shelfItems.includes(typeof l === 'object' ? l.label : l)).length;

                const gradeRange = (() => {
                    const grades = new Set();
                    sub.levels.forEach(lvl => {
                        const label = typeof lvl === 'object' ? lvl.label : lvl;
                        if (label.includes('K1')) grades.add('K1');
                        if (label.includes('K2')) grades.add('K2');
                        if (label.includes('K3')) grades.add('K3');
                    });
                    const sorted = Array.from(grades).sort();
                    if (sorted.length === 0) return 'All';
                    if (sorted.length === 1) return sorted[0];
                    return `${sorted[0]}-${sorted[sorted.length - 1]}`;
                })();

                const subIndo = sub.name.split(' / ')[1] || sub.name.split(' / ')[0];
                const subEng = sub.name.split(' / ')[1] ? sub.name.split(' / ')[0] : '';

                return (
                    <div key={sub.id} style={{ backgroundColor: 'white', borderRadius: '24px', border: '1.5px solid #F1F5F9', overflow: 'hidden' }}>
                        <div onClick={() => setActiveSubAreaId(isExpanded ? null : sub.id)} style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isExpanded ? `${activeArea.color}05` : 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ minWidth: '40px', height: '40px', borderRadius: '50%', background: isExpanded ? activeArea.color : '#F1F5F9', color: isExpanded ? 'white' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: '0.65rem', border: '1.5px solid', borderColor: isExpanded ? 'rgba(255,255,255,0.3)' : '#E2E8F0', flexShrink: 0 }}>{gradeRange}</div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 950, color: '#1E293B' }}>{subIndo}</h3>
                                            {subEng && <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, fontStyle: 'italic' }}>{subEng}</span>}
                                        </div>
                                        {countInSubAreaOnShelf > 0 && <span style={{ fontSize: '0.6rem', fontWeight: 950, background: `${activeArea.color}15`, color: activeArea.color, padding: '2px 8px', borderRadius: '6px' }}>{countInSubAreaOnShelf} AKTIF</span>}
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800 }}>{filteredLevels.length} Materi</span>
                                </div>
                            </div>
                            <ArrowLeft style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(-90deg)', transition: '0.3s', color: '#CBD5E1' }} size={18} />
                        </div>
                        {isExpanded && (
                            <div style={{ padding: '8px 20px 24px 20px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9' }}>
                                {filteredLevels.map((m, idx) => {
                                    const label = typeof m === 'object' ? m.label : m;
                                    const isChecked = shelfItems.includes(label);
                                    const isFoundation = idx < 3;
                                    const isAdvanced = idx > 6;
                                    
                                    const mPartsFromLabel = label.split(': ')[1] || label;
                                    const mIndo = mPartsFromLabel.split(' / ')[1] || mPartsFromLabel.split(' / ')[0];
                                    const mEng = mPartsFromLabel.split(' / ')[1] ? mPartsFromLabel.split(' / ')[0] : '';

                                    return (
                                        <div key={label} onClick={() => { if (viewMode === 'kelola') toggleItemOnShelf(label); else { setActiveDrawerMateri(label); setSelectedKids([]); } }} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 18px', borderRadius: '18px', backgroundColor: 'white', border: '2px solid', borderColor: isChecked ? activeArea.color : '#F1F5F9', cursor: 'pointer', transition: '0.2s', marginBottom: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: isChecked ? activeArea.color : '#F1F5F9', color: isChecked ? 'white' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 950 }}>{idx + 1}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', gap: 4, marginBottom: 4, flexWrap: 'wrap' }}>
                                                    {isFoundation ? <span style={{ fontSize: '0.5rem', fontWeight: 950, color: '#059669', background: '#ECFDF5', padding: '1px 5px', borderRadius: '4px' }}>PONDASI</span> 
                                                    : isAdvanced ? <span style={{ fontSize: '0.5rem', fontWeight: 950, color: '#7C3AED', background: '#F5F3FF', padding: '1px 5px', borderRadius: '4px' }}>LANJUTAN</span> 
                                                    : <span style={{ fontSize: '0.5rem', fontWeight: 950, color: '#2563EB', background: '#EFF6FF', padding: '1px 5px', borderRadius: '4px' }}>PENGEMBANGAN</span>}
                                                    {viewMode === 'kelola' && popularData[label] >= 3 && <span style={{ fontSize: '0.5rem', fontWeight: 950, color: '#D97706', background: '#FFFBEB', padding: '1px 5px', borderRadius: '4px' }}>🔥 POPULER</span>}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1E293B' }}>{mIndo}</div>
                                                    {mEng && <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, fontStyle: 'italic' }}>{mEng}</span>}
                                                </div>
                                            </div>
                                            {viewMode === 'kelola' ? (
                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid', borderColor: isChecked ? activeArea.color : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isChecked ? activeArea.color : 'transparent' }}>{isChecked && <CheckCircle2 size={14} color="white" />}</div>
                                            ) : <ChevronRight size={18} color="#CBD5E1" />}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
          </div>
      </div>

      {showSuccess && (
        <div style={{ position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)', zIndex: 12000, background: '#0F172A', color: 'white', padding: '12px 24px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <CheckCircle2 color="#10B981" /> <b>Berhasil Disimpan!</b>
        </div>
      )}

      {/* 🚀 SIDE DRAWER FOR ASSESSMENT */}
      {activeDrawerMateri && (
          <div className="side-drawer-overlay" onClick={() => setActiveDrawerMateri(null)}>
              <div className="side-drawer-content" onClick={e => e.stopPropagation()}>
                    <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', background: `${activeToolInfo.color}05` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div style={{ background: activeToolInfo.color, color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '0.6rem', fontWeight: 950 }}>{activeToolInfo.area.toUpperCase()}</div>
                            <button onClick={() => setActiveDrawerMateri(null)} style={{ background: 'white', border: '1px solid #E2E8F0', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}><X size={18}/></button>
                        </div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 950, color: '#1E293B', lineHeight: 1.2 }}>
                            {activeDrawerMateri.split(' / ')[1] || activeDrawerMateri.split(' / ')[0]}
                        </h2>
                        <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, fontStyle: 'italic', marginTop: 4 }}>
                            {activeDrawerMateri.split(' / ')[0]}
                        </p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                            <button onClick={() => setShowGuide(activeToolInfo.itemObj)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #E2E8F0', padding: '6px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900, color: '#64748B' }}><Info size={14}/> PANDUAN</button>
                            <div style={{ flex: 1, height: '4px', background: '#E2E8F0', borderRadius: 10, alignSelf: 'center', overflow: 'hidden', display: 'flex' }}>
                                <div style={{ width: `${activeProgress.masteredPct}%`, background: '#10B981' }} />
                                <div style={{ width: `${activeProgress.workingPct}%`, background: '#3B82F6' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748B' }}>{showFullGrid ? 'SEMUA MURID' : 'BELUM PRESENTASI'}</span>
                            <button onClick={() => setShowFullGrid(!showFullGrid)} style={{ background: '#F1F5F9', border: 'none', padding: '4px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 950, color: 'var(--primary)' }}>{showFullGrid ? 'Filter Belum' : 'Lihat Semua'}</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {(showFullGrid ? currentRoomStudents : activeProgress.waiting).map(kid => {
                                const isKidSelected = selectedKids.includes(kid.id);
                                const kidRep = repetitions[`${kid.id}_${activeDrawerMateri}`];
                                return (
                                    <div key={kid.id} onClick={() => toggleKidSelection(kid.id)} style={{ padding: '12px 16px', borderRadius: '16px', border: '1.5px solid', borderColor: isKidSelected ? 'var(--primary)' : '#F1F5F9', background: isKidSelected ? '#EEF2FF' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: isKidSelected ? 'var(--primary)' : '#F1F5F9', color: isKidSelected ? 'white' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 950 }}>{isKidSelected ? '✓' : kid.name.charAt(0)}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: isKidSelected ? 'var(--primary)' : '#1E293B', lineHeight: 1.2 }}>{kid.name}</div>
                                            {kidRep?.level && <div style={{ fontSize: '0.6rem', color: kidRep.level === 'M' ? '#10B981' : '#3B82F6', fontWeight: 950, marginTop: 2 }}>{kidRep.level === 'M' ? '🎓 MASTERED' : '⚙️ WORKING'}</div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ padding: '24px', borderTop: '1px solid #F1F5F9', background: 'white', display: 'flex', gap: 12 }}>
                        <button 
                            disabled={selectedKids.length === 0}
                            onClick={() => setShowSheet(true)}
                            style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '1.5px dashed #C7D2FE', background: '#F8FAFC', color: 'var(--primary)', fontWeight: 950, fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                            OPSI LANJUT
                        </button>
                        <button 
                            disabled={selectedKids.length === 0 || loadingAction}
                            onClick={handleInstantSave}
                            style={{ flex: 2, padding: '16px', borderRadius: '16px', border: 'none', background: selectedKids.length > 0 ? 'var(--primary)' : '#CBD5E1', color: 'white', fontWeight: 950, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: selectedKids.length > 0 ? '0 10px 20px -5px rgba(59, 130, 246, 0.3)' : 'none', cursor: 'pointer' }}
                        >
                            {loadingAction ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                            SIMPAN {selectedKids.length > 0 ? `(${selectedKids.length} Murid)` : ''}
                        </button>
                    </div>
              </div>
          </div>
      )}

      {/* 🚀 5 PILAR AMI OBSERVASI MODAL (BOTTOM) */}
      {showSheet && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 13000, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowSheet(false)}>
             <div style={{ background: 'white', width: '100%', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '32px 24px 48px', animation: 'slideUp 0.4s ease', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                    <div style={{ width: 40, height: 4, background: '#CBD5E1', borderRadius: 10, margin: '0 auto 24px' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                           <h2 style={{ fontSize: '1.2rem', fontWeight: 950, color: '#1E293B' }}>Fokus Observasi ({selectedKids.length} Murid)</h2>
                           <p style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700, marginTop: 2, maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {selectedKids.map(id => students.find(s => s.id === id)?.name).join(', ')}
                           </p>
                        </div>
                        <button onClick={() => setShowSheet(false)} style={{ background: '#F1F5F9', border: 'none', padding: '8px', borderRadius: '50%' }}><X size={20}/></button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* 1. Kematangan (P-W-M-N) */}
                        <div style={{ padding: '16px', background: '#FFF7ED', borderRadius: '24px', border: '1px solid #FFEDD5', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Sparkles size={18} color="#D97706" />
                                    <p style={{ fontSize: '0.75rem', fontWeight: 950, color: '#9A3412', margin: 0, letterSpacing: '0.5px' }}>1. KEMATANGAN (P-W-M-N)</p>
                                </div>
                                <button onClick={() => setActivePilarHelp(activePilarHelp === 'maturity' ? null : 'maturity')} style={{ border: 'none', background: 'white', borderRadius: '50%', padding: '4px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                    <HelpCircle size={15} color="#D97706" />
                                </button>
                            </div>
                            {activePilarHelp === 'maturity' && (
                                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', fontSize: '0.7rem', color: '#9A3412', border: '1px solid #FFEDD5', marginBottom: 12, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{PILAR_GUIDE.maturity.text}</div>
                            )}
                            <div style={{ display: 'flex', gap: 8 }}>
                                {[
                                    {id: 'P', label: 'Presentasi'}, 
                                    {id: 'W', label: 'Berlatih'}, 
                                    {id: 'M', label: 'Mahir'},
                                    {id: 'N', label: 'Bantuan'}
                                ].map(l => (
                                    <button key={l.id} onClick={() => setMaturity(l.id)} style={{ flex: 1, padding: '12px 4px', borderRadius: '14px', border: '2px solid', borderColor: maturity === l.id ? '#D97706' : '#FFEDD5', background: maturity === l.id ? '#D97706' : 'white', fontWeight: 950, color: maturity === l.id ? 'white' : '#9A3412', fontSize: '0.7rem' }}>
                                        {l.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Konsentrasi */}
                        <div style={{ padding: '16px', background: '#FEF2F2', borderRadius: '24px', border: '1px solid #FEE2E2' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Flame size={18} color="#DC2626" />
                                    <p style={{ fontSize: '0.75rem', fontWeight: 950, color: '#991B1B', margin: 0, letterSpacing: '0.5px' }}>2. KONSENTRASI</p>
                                </div>
                                <button onClick={() => setActivePilarHelp(activePilarHelp === 'concentration' ? null : 'concentration')} style={{ border: 'none', background: 'white', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
                                    <HelpCircle size={15} color="#DC2626" />
                                </button>
                            </div>
                            {activePilarHelp === 'concentration' && (
                                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', fontSize: '0.7rem', color: '#991B1B', border: '1px solid #FEE2E2', marginBottom: 12, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{PILAR_GUIDE.concentration.text}</div>
                            )}
                            <div style={{ display: 'flex', gap: 8 }}>
                                {[
                                    {id: 'Exploration', label: 'Eksplorasi'}, 
                                    {id: 'Asyik', label: 'Asyik Bekerja'}, 
                                    {id: 'Deep', label: 'Deep Focus'}
                                ].map(c => (
                                    <button key={c.id} onClick={() => setConcentration(c.id)} style={{ flex: 1, padding: '12px 4px', borderRadius: '14px', border: '2px solid', borderColor: concentration === c.id ? '#DC2626' : '#FEE2E2', background: concentration === c.id ? '#DC2626' : 'white', fontWeight: 950, color: concentration === c.id ? 'white' : '#991B1B', fontSize: '0.7rem' }}>
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Konteks Sosial */}
                        <div style={{ padding: '16px', background: '#F5F3FF', borderRadius: '24px', border: '1px solid #EDE9FE' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Users2 size={18} color="#7C3AED" />
                                    <p style={{ fontSize: '0.75rem', fontWeight: 950, color: '#5B21B6', margin: 0, letterSpacing: '0.5px' }}>3. KONTEKS SOSIAL</p>
                                </div>
                                <button onClick={() => setActivePilarHelp(activePilarHelp === 'social' ? null : 'social')} style={{ border: 'none', background: 'white', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
                                    <HelpCircle size={15} color="#7C3AED" />
                                </button>
                            </div>
                            {activePilarHelp === 'social' && (
                                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', fontSize: '0.7rem', color: '#5B21B6', border: '1px solid #EDE9FE', marginBottom: 12, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{PILAR_GUIDE.social.text}</div>
                            )}
                            <div style={{ display: 'flex', gap: 8 }}>
                                {[
                                    {id: 'Individual', label: 'Individual'}, 
                                    {id: 'Pair', label: 'Berpasangan'}, 
                                    {id: 'Collaborative', label: 'Kelompok'}
                                ].map(s => (
                                    <button key={s.id} onClick={() => setSocialContext(s.id)} style={{ flex: 1, padding: '12px 4px', borderRadius: '14px', border: '2px solid', borderColor: socialContext === s.id ? '#7C3AED' : '#EDE9FE', background: socialContext === s.id ? '#7C3AED' : 'white', fontWeight: 950, color: socialContext === s.id ? 'white' : '#5B21B6', fontSize: '0.7rem' }}>
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 4. Kemandirian */}
                        <div style={{ padding: '16px', background: '#EFF6FF', borderRadius: '24px', border: '1px solid #DBEAFE' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <HeartHandshake size={18} color="#2563EB" />
                                    <p style={{ fontSize: '0.75rem', fontWeight: 950, color: '#1E40AF', margin: 0, letterSpacing: '0.5px' }}>4. KEMANDIRIAN</p>
                                </div>
                                <button onClick={() => setActivePilarHelp(activePilarHelp === 'independence' ? null : 'independence')} style={{ border: 'none', background: 'white', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
                                    <HelpCircle size={15} color="#2563EB" />
                                </button>
                            </div>
                            {activePilarHelp === 'independence' && (
                                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', fontSize: '0.7rem', color: '#1E40AF', border: '1px solid #DBEAFE', marginBottom: 12, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{PILAR_GUIDE.independence.text}</div>
                            )}
                            <div style={{ display: 'flex', gap: 8 }}>
                                {[
                                    {id: 'Independent', label: 'Mandiri'}, 
                                    {id: 'NeedsPush', label: 'Butuh Dorongan'}
                                ].map(i => (
                                    <button key={i.id} onClick={() => setIndependence(i.id)} style={{ flex: 1, padding: '12px 4px', borderRadius: '14px', border: '2px solid', borderColor: independence === i.id ? '#2563EB' : '#DBEAFE', background: independence === i.id ? '#2563EB' : 'white', fontWeight: 950, color: independence === i.id ? 'white' : '#1E40AF', fontSize: '0.7rem' }}>
                                        {i.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 5. Restorasi */}
                        <div style={{ padding: '16px 20px', background: '#ECFDF5', borderRadius: '24px', border: '1px solid #D1FAE5' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <RotateCcw size={18} color="#059669" />
                                    <p style={{ fontSize: '0.85rem', fontWeight: 950, color: '#065F46', margin: 0 }}>5. RESTORASI ALAT</p>
                                </div>
                                <button onClick={() => setActivePilarHelp(activePilarHelp === 'restoration' ? null : 'restoration')} style={{ border: 'none', background: 'white', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
                                    <HelpCircle size={15} color="#059669" />
                                </button>
                            </div>
                            {activePilarHelp === 'restoration' && (
                                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', fontSize: '0.7rem', color: '#065F46', border: '1px solid #D1FAE5', marginBottom: 12, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{PILAR_GUIDE.restoration.text}</div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.7rem', color: '#065F46', fontWeight: 700 }}>Anak merapikan kembali ke rak sesuai urutan.</span>
                                <button onClick={() => setRestoration(!restoration)} style={{ background: restoration ? '#059669' : '#D1FAE5', border: 'none', width: 68, height: 32, borderRadius: '100px', position: 'relative', transition: '0.3s' }}>
                                    <div style={{ position: 'absolute', top: 4, left: restoration ? 40 : 4, width: 24, height: 24, background: 'white', borderRadius: '50%', transition: '0.3s' }} />
                                    <span style={{ fontSize: '0.6rem', fontWeight: 950, color: restoration ? 'white' : '#065F46', position: 'absolute', left: restoration ? 8 : 34, top: '50%', transform: 'translateY(-50%)' }}>{restoration ? 'YA' : 'TDK'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleInstantSave} style={{ width: '100%', marginTop: 32, padding: '20px', borderRadius: '24px', background: 'var(--primary)', color: 'white', fontWeight: 950, fontSize: '1rem', border: 'none', boxShadow: '0 15px 30px -10px rgba(37,99,235,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                        {loadingAction ? <Loader2 className="animate-spin" size={20}/> : <ShieldCheck size={22}/>}
                        SIMPAN OBSERVASI 5 PILAR
                    </button>
             </div>
          </div>
      )}

      {/* 🛠️ APARATUS PREP MODAL (CENTERED) */}
      {showPrepSheet && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowPrepSheet(false)}>
             <div style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '32px', padding: '32px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 950, color: '#1E293B' }}>Daftar Persiapan Alat</h2>
                            <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 700, marginTop: 4 }}>Siapkan benda fisik berikut untuk diletakkan di rak.</p>
                        </div>
                        <button onClick={() => setShowPrepSheet(false)} style={{ background: '#F1F5F9', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', cursor: 'pointer' }}><X size={20}/></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {Object.keys(aparatusList).length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>Belum ada alat yang diaktifkan di rak.</div>
                        ) : Object.entries(aparatusList).map(([areaName, tools]) => (
                            <div key={areaName}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 950, color: 'white', background: '#0F172A', padding: '3px 10px', borderRadius: '6px', display: 'inline-block', marginBottom: 12 }}>{areaName.toUpperCase()}</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                                    {Array.from(tools).map(tool => (
                                        <div key={tool} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
                                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155' }}>{tool}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => setShowPrepSheet(false)} style={{ width: '100%', marginTop: 32, padding: '16px', background: 'var(--primary)', color: 'white', borderRadius: '16px', border: 'none', fontWeight: 950, fontSize: '1rem', cursor: 'pointer', transition: '0.2s' }}>Selesai Menyiapkan</button>
             </div>
          </div>
      )}

      {/* 📘 GUIDE MODAL (CENTERED) */}
      {showGuide && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 11000, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowGuide(null)}>
             <div style={{ background: 'white', width: '100%', maxWidth: '550px', borderRadius: '32px', padding: '32px', maxHeight: '85vh', overflowY: 'auto', animation: 'popIn 0.3s ease' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ background: '#EEF2FF', color: 'var(--primary)', padding: '10px', borderRadius: '12px' }}><BookOpen size={20}/></div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 950, color: '#1E293B' }}>Panduan Presentasi</h2>
                        </div>
                        <button onClick={() => setShowGuide(null)} style={{ background: '#F1F5F9', border: 'none', width: 36, height: 36, borderRadius: '50%', color: '#64748B' }}><X size={20}/></button>
                    </div>
                    
                    <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: 4 }}>{showGuide.label}</h3>
                    
                    {showGuide.presentation ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
                            <div>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 950, color: 'var(--primary)', marginBottom: 8 }}>🎯 TUJUAN (DIRECT AIM)</h4>
                                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>{showGuide.presentation.directAim || 'Melatih koordinasi dan fokus anak.'}</p>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 950, color: 'var(--primary)', marginBottom: 8 }}>📝 LANGKAH-LANGKAH</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {(showGuide.presentation.steps || ['Ajak anak ke rak', 'Bawa alat ke meja', 'Lakukan demo']).map((step, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: 12 }}>
                                            <span style={{ fontWeight: 950, color: 'var(--primary)', fontSize: '0.85rem' }}>{idx+1}.</span>
                                            <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '16px', textAlign: 'center', color: '#94A3B8', marginTop: 20 }}>
                            Belum ada panduan detail untuk materi ini.
                        </div>
                    )}
                    
                    <button onClick={() => setShowGuide(null)} style={{ width: '100%', marginTop: 24, padding: '14px', background: '#F1F5F9', color: '#475569', borderRadius: '12px', border: 'none', fontWeight: 950 }}>Tutup</button>
             </div>
          </div>
      )}
    </div>
  );
}
