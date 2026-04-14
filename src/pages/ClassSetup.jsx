import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../firebase-config';
import {
  collection, getDocs, doc, setDoc, getDoc, query, where, limit
} from 'firebase/firestore';
import { AREA_SENTRA } from '../data/areaSentra';
import {
  ArrowLeft, Save, CheckCircle2, Star, X, Info, History,
  Moon, Hash, BookOpen, Leaf, Globe2, Wand2, MapPin, PackageOpen, Loader2, ClipboardList,
  MessageSquare, Package, AlertCircle, TrendingUp, Target
} from 'lucide-react';

const IconMap = { Moon, Hash, BookOpen, Leaf, Globe2, Wand2 };
const AreaIcon = ({ name, color, size = 18 }) => {
  const IconComp = IconMap[name] || Star;
  return <IconComp size={size} color={color} />;
};

export default function ClassSetup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeRoom, setActiveRoom] = useState(searchParams.get('room') || 'Kelas 1');
  const [curriculum, setCurriculum] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAreaId, setActiveAreaId] = useState(null);
  const [shelfItems, setShelfItems] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showGuide, setShowGuide] = useState(null);
  const [showHistory, setShowHistory] = useState(null); // List of history items or null
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [viewMode] = useState('map'); // Always 'map'
  const [mapFocusGrade, setMapFocusGrade] = useState('All');
  const [expandedSubAreaId, setExpandedSubAreaId] = useState(null);

  const [masteredData, setMasteredData] = useState(new Set());
  const [masteredCount, setMasteredCount] = useState({}); // { label: count }
  const [popularData, setPopularData] = useState({}); // { label: count }
  const [targetedNames, setTargetedNames] = useState({}); // { label: [names...] }
  const [studentMap, setStudentMap] = useState({}); // { id: name }
  // 🔄 FETCH ALL MASTER DATA (CURRICULUM, READINESS, SHELF)
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Curriculum from Firestore
        let curData = [];
        try {
          const collRef = collection(db, 'kurikulum_pusat');
          const snapshot = await getDocs(collRef);
          curData = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        } catch (fbErr) {
          console.warn("Firebase Kurikulum Permission Denied. Menggunakan Data Lokal.", fbErr);
        }

        if (!curData || curData.length === 0) {
           curData = AREA_SENTRA;
        } else {
           const orderMap = {};
           AREA_SENTRA.forEach((item, idx) => orderMap[item.id] = idx);
           curData.sort((a,b) => (orderMap[a.id] ?? 99) - (orderMap[b.id] ?? 99));
        }
        setCurriculum(curData);
        if (!activeAreaId) setActiveAreaId(curData[1]?.id || curData[0].id);

        // 2. Fetch Active Shelf for Room
        try {
           const roomDocRef = doc(db, 'setelan_rak', activeRoom);
           const roomSnap = await getDoc(roomDocRef);
           if (roomSnap.exists()) {
              setShelfItems(roomSnap.data().items || []);
           } else {
              const legacy = localStorage.getItem(`sentra_shelf_${activeRoom}`);
              setShelfItems(legacy ? JSON.parse(legacy) : []);
           }
        } catch (shelfErr) {
           console.warn("Firebase Shelf Permission Denied. Mencoba LocalStorage...", shelfErr);
           const legacy = localStorage.getItem(`sentra_shelf_${activeRoom}`);
           setShelfItems(legacy ? JSON.parse(legacy) : []);
        }

        try {
          const activitySnapshot = await getDocs(collection(db, 'jurnal_aktivitas'));
          const masteredSet = new Set();
          const pCounts = {};
          const mCounts = {};
          
          activitySnapshot.docs.forEach(docSnap => {
             const d = docSnap.data();
             const label = d.pencapaian;
             if (d.kematangan === 'Mahir') {
                masteredSet.add(label);
                mCounts[label] = (mCounts[label] || 0) + 1;
             }
             pCounts[label] = (pCounts[label] || 0) + 1;
          });
          setMasteredData(masteredSet);
          setMasteredCount(mCounts);
          setPopularData(pCounts);
        } catch (masterErr) {
           console.warn("Firebase Activity Insights pass.", masterErr);
        }

        try {
          // Detect current week to see what's planned
          const y = new Date().getFullYear();
          const m = String(new Date().getMonth() + 1).padStart(2, '0');
          const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
          const weekNum = Math.ceil((new Date().getDate() + firstDay.getDay()) / 7);
          const periodId = `${y}-${m}-W${weekNum}`;

          const targetSnap = await getDoc(doc(db, 'target_observasi', periodId));
          if (targetSnap.exists()) {
             const plans = targetSnap.data().plans || {};
             const labelToNames = {};
             
             Object.entries(plans).forEach(([studId, materials]) => {
                const studName = studentMap[studId] || studId;
                materials.forEach(mLabel => {
                   if (!labelToNames[mLabel]) labelToNames[mLabel] = [];
                   if (!labelToNames[mLabel].includes(studName)) labelToNames[mLabel].push(studName);
                });
             });
             setTargetedNames(labelToNames);
          }
        } catch (targetErr) {
           console.warn("Target Insights pass.", targetErr);
        }

      } catch (err) {
        console.error("Master Sync Overall Error:", err);
        setCurriculum(AREA_SENTRA);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [activeRoom]);

  const activeArea = curriculum.find(a => a.id === activeAreaId) || curriculum[0];

  const toggleItemOnShelf = (itemLabel) => {
    setShelfItems(prev => prev.includes(itemLabel) ? prev.filter(i => i !== itemLabel) : [...prev, itemLabel]);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const now = new Date();
      
      // 💾 SIMPAN KE LOKAL DULU (AGAR GURU TIDAK KERJA DUA KALI)
      localStorage.setItem(`sentra_shelf_${activeRoom}`, JSON.stringify(shelfItems));

      // ☁️ TRY FIREBASE (SILENT FAIL IF PERMISSION ERROR)
      try {
        const roomRef = doc(db, 'setelan_rak', activeRoom);
        const updatePayload = {
          items: shelfItems,
          updatedAt: now,
          updatedBy: 'Sistem Guru'
        };

        await setDoc(roomRef, updatePayload);

        const historyColRef = collection(db, 'riwayat_rak');
        const historyDocRef = doc(historyColRef);
        await setDoc(historyDocRef, {
          room: activeRoom,
          ...updatePayload,
          historyId: historyDocRef.id
        });
      } catch (fbErr) {
        console.warn("Gagal simpan ke Online (Izin Firebase). Data tersimpan aman di perangkat lokal ini.", fbErr);
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/eksplorasi');
      }, 1500);
    } catch (err) {
      console.error("Critical Save Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
       const q = query(collection(db, 'riwayat_rak'), where('room', '==', activeRoom), limit(20));
       const snapshot = await getDocs(q);
       const logs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
       logs.sort((a,b) => b.updatedAt.toMillis() - a.updatedAt.toMillis());
       setShowHistory(logs);
    } catch (err) {
       console.error("Gagal ambil riwayat (Permissions?):", err);
       alert("Gagal memuat riwayat dari server. Mohon update Firebase Rules.");
       setShowHistory([]); 
    } finally {
       setLoadingHistory(false);
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const q = query(collection(db, 'students'), where('status', '==', 'active'));
        const snapshot = await getDocs(q);
        const map = {};
        snapshot.docs.forEach(d => map[d.id] = (d.data().name || d.id).split(' ')[0]);
        setStudentMap(map);
      } catch (err) { console.error(err); }
    };
    fetchStudents();
  }, [activeRoom]);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <Loader2 size={32} className="animate-spin" color="var(--primary)" />
      <p style={{ fontWeight: 800, color: 'var(--text-muted)' }}>Sinkronisasi Kurikulum Pusat...</p>
    </div>
  }

  return (
    <div className="page-container" style={{ paddingBottom: '40px' }}>

      {/* 📜 MODAL RIWAYAT PENYUSUNAN RAK */}
      {showHistory && (
         <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(12px)' }} onClick={() => setShowHistory(null)}>
            <div style={{ backgroundColor: 'white', width: '92%', maxWidth: '500px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', animation: 'popIn 0.3s' }} onClick={e => e.stopPropagation()}>
                <div style={{ background: '#F8FAFC', padding: '24px 32px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1E293B' }}>
                       <History size={20} />
                       <h3 style={{ fontSize: '1.2rem', fontWeight: 950, margin: 0 }}>Riwayat {activeRoom}</h3>
                    </div>
                    <button style={{ background: 'white', border: '1px solid #E2E8F0', width: '32px', height: '32px', borderRadius: '8px', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowHistory(null)}>
                       <X size={18}/>
                    </button>
                </div>
                <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {showHistory.length === 0 ? (
                       <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontWeight: 700 }}>Belum ada riwayat tercatat.</div>
                    ) : (
                       showHistory.map(log => (
                          <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                             <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 950, color: '#1E293B' }}>{log.updatedAt.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>{log.items?.length || 0} Materi • {log.updatedBy}</div>
                             </div>
                             <button 
                               onClick={() => {
                                  if(window.confirm('Pulihkan setelan rak ini? Isian saat ini akan diganti.')) {
                                     setShelfItems(log.items || []);
                                     setShowHistory(null);
                                  }
                               }}
                               style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', color: 'var(--primary)', padding: '8px 16px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 950, cursor: 'pointer' }}
                             >
                                Pulihkan
                             </button>
                          </div>
                       ))
                    )}
                </div>
            </div>
         </div>
      )}
      
      {showSuccess && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}>
          <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '32px 64px', borderRadius: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)', animation: 'popIn 0.5s' }}>
            <CheckCircle2 size={64} />
            <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>Rak {activeRoom} Siap!</div>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Kelas terisolasi, siap digunakan.</p>
          </div>
        </div>
      )}

      {showGuide && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(16px)' }} onClick={() => setShowGuide(null)}>
            <div className="modern-guide-modal fade-in" onClick={e => e.stopPropagation()}>
                <div className="modern-guide-header" style={{ borderBottom: `4px solid ${activeArea?.color || 'var(--primary)'}` }}>
                    <div className="modern-guide-badge" style={{ backgroundColor: `${activeArea?.color || 'var(--primary)'}20`, color: activeArea?.color || 'var(--primary)' }}>📖 PANDUAN PRESENTASI</div>
                    <button className="modern-close-btn" onClick={() => setShowGuide(null)}><X size={20}/></button>
                </div>
                <div className="modern-guide-scroll-body">
                    <h2 className="modern-title">{(showGuide.label || '').split(': ')[1]?.split(' / ')[0] || showGuide.label}</h2>
                    
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
                                <div className="modern-header-dot" style={{ backgroundColor: activeArea?.color || '#4F46E5' }}></div>
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

      {/* 🛠️ CONTROL CENTER */}
      <div className="control-center-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => navigate('/eksplorasi')} className="header-action-btn" title="Kembali">
                <ArrowLeft size={18} />
            </button>
            <button 
                onClick={fetchHistory}
                disabled={loadingHistory}
                className="header-action-btn"
                title="Lihat Riwayat"
            >
                {loadingHistory ? <Loader2 size={18} className="animate-spin" /> : <History size={18} />}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
            {shelfItems.length > 0 && (
              <button
                onClick={() => { if (window.confirm('Kosongkan semua pilihan di rak ini?')) setShelfItems([]); }}
                className="btn-clear-shelf"
              >
                <X size={14} /> <span className="hide-mobile">BATAL PILIH</span><span className="show-mobile">Batal</span>
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn-save-master"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span className="hide-mobile">KUNCI RAK ({shelfItems.length})</span>
              <span className="show-mobile">Simpan ({shelfItems.length})</span>
            </button>
          </div>
        </div>

        {/* AREA SELECTION RIBBON (HORIZONTAL SCROLL) */}
        <div className="area-navbar-wrapper">
          <div className="area-navbar-container">
            {curriculum.map(area => {
              const currentShelfLabels = new Set(shelfItems);
              const countInArea = area.subAreas?.reduce((sum, sub) => sum + sub.levels.filter(l => currentShelfLabels.has(typeof l === 'object' ? l.label : l)).length, 0) || 0;
              const isActive = activeAreaId === area.id;
              
              return (
                <button 
                  key={area.id} 
                  onClick={() => setActiveAreaId(area.id)} 
                  className={`area-nav-btn ${isActive ? 'active' : ''}`} 
                  style={{ 
                      '--area-theme': area.color,
                  }}
                >
                  <div className="area-icon-box">
                    <AreaIcon name={area.icon} color={isActive ? 'white' : area.color} size={20} />
                  </div>
                  <span className="area-label-text">{area.name.split(' / ')[0]}</span>
                  {countInArea > 0 && <span className="area-badge">{countInArea}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {activeArea && (
          <div style={{ textAlign: 'center', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="show-mobile" style={{ fontSize: '0.75rem', fontWeight: 950, color: activeArea.color, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {activeArea.name.split(' / ')[0]}
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '100px', border: '1px solid #A7F3D0' }}>
                   💡 SMART INSIGHT AKTIF
                </span>
            </div>
            <div style={{ backgroundColor: '#F1F5F9', padding: '2px', borderRadius: '100px', display: 'flex', gap: '2px', border: '1px solid #E2E8F0', width: 'fit-content', margin: '4px auto 0' }}>
              {['All', 'K1', 'K2', 'K3'].map(g => (
                <button key={g} onClick={() => setMapFocusGrade(g)} style={{ padding: '4px 12px', borderRadius: '100px', border: 'none', backgroundColor: mapFocusGrade === g ? activeArea.color : 'transparent', color: mapFocusGrade === g ? 'white' : '#64748B', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.6rem' }}>
                  {g === 'All' ? 'SEMUA' : `K${g.slice(1)}`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '0 0 100px 0', maxWidth: '850px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeArea?.subAreas.map(sub => {
            const isExpanded = expandedSubAreaId === sub.id;
            
            // FILTER MATERI BERDASARKAN JENJANG (HIDE NON-MATCHING)
            const filteredLevels = sub.levels.filter(m => {
                if (mapFocusGrade === 'All') return true;
                const label = typeof m === 'object' ? m.label : m;
                return label.includes(mapFocusGrade);
            });

            if (filteredLevels.length === 0) return null; // Sembunyikan kategori jika tidak ada materi yang cocok

            const itemsInSubArea = filteredLevels.filter(l => shelfItems.includes(typeof l === 'object' ? l.label : l)).length;
            
            return (
              <div key={sub.id} id={`subarea-${sub.id}`} style={{ backgroundColor: 'white', borderRadius: '24px', border: '1.5px solid', borderColor: isExpanded ? activeArea.color : '#F1F5F9', boxShadow: isExpanded ? '0 20px 40px rgba(0,0,0,0.08)' : '0 4px 12px rgba(0,0,0,0.02)', transition: 'all 0.4s' }}>
                <div onClick={() => setExpandedSubAreaId(isExpanded ? null : sub.id)} style={{ padding: '24px 32px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isExpanded ? `${activeArea.color}08` : 'white', borderRadius: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: isExpanded ? activeArea.color : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isExpanded ? 'white' : '#94A3B8', fontWeight: 950, fontSize: '1.2rem' }}>{sub.name.charAt(0)}</div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 950, color: '#0F172A', marginBottom: '2px', display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                        <span>{sub.name.split(' / ')[0]}</span>
                        {sub.name.includes(' / ') && (
                           <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isExpanded ? activeArea.color : '#94A3B8', opacity: 0.8, marginTop: '2px' }}>
                             {sub.name.split(' / ')[1]}
                           </span>
                        )}
                      </h3>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>{filteredLevels.length} Materi</span>
                        {itemsInSubArea > 0 && <span style={{ fontSize: '0.8rem', fontWeight: 900, color: activeArea.color }}>• {itemsInSubArea} Aktif</span>}
                      </div>
                    </div>
                  </div>
                  <ArrowLeft style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(-90deg)', transition: 'transform 0.4s', color: '#CBD5E1' }} size={24} />
                </div>
                {isExpanded && (
                  <div style={{ padding: '24px 32px 40px 32px', backgroundColor: '#F8FAFC', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {filteredLevels.map((m, idx) => {
                        const label = typeof m === 'object' ? m.label : m;
                        const isChecked = shelfItems.includes(label);
                        const isMastered = masteredData.has(label);
                        const cleanLabel = label.split(': ')[1]?.split(' / ')[0] || label;

                        // 🧠 INTELLIGENCE: Determine Level & Type
                        const isFoundation = idx < 3;
                        const isAdvanced = idx > 6;
                        const missingPres = isChecked && idx > 0 ? filteredLevels.slice(0, idx).filter(pre => !shelfItems.includes(typeof pre === 'object' ? pre.label : pre)).map(m => (typeof m === 'object' ? m.label : m).split(': ').slice(-1)[0]) : [];
                        const isMissingPre = missingPres.length > 0;

                        // 📘 MICRO-TRAINING: Pedagogical Reasoning (Example hints)
                        const getPedagogicalReason = (lbl) => {
                            if (lbl.includes('Sandpaper')) return 'Membangun memori otot jari untuk persiapan menulis.';
                            if (lbl.includes('Pink Tower')) return 'Membantu anak memahami dimensi (besar-kecil) secara visual & taktil.';
                            if (lbl.includes('Number Rods')) return 'Memperkenalkan kuantitas konkrit 1-10 secara linear.';
                            if (lbl.includes('Spindle')) return 'Menghubungkan simbol angka dengan kuantitas yang terlepas-lepas.';
                            return null;
                        };
                        const hint = getPedagogicalReason(label);

                        return (
                          <div key={label} style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            {/* Sequence Line Connector */}
                            {idx < filteredLevels.length - 1 && (
                                <div style={{ 
                                    position: 'absolute', left: '62px', top: '70px', height: '30px', width: '3px', 
                                    backgroundColor: isChecked ? activeArea.color : '#E2E8F0', 
                                    opacity: isChecked ? 0.6 : 0.3, zIndex: 0 
                                }}></div>
                            )}

                            <div 
                                onClick={() => toggleItemOnShelf(label)} 
                                style={{ 
                                    display: 'flex', alignItems: 'center', gap: '20px', padding: '16px 24px', borderRadius: '24px', 
                                    backgroundColor: 'white', 
                                    cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                                    border: '2px solid', 
                                    borderColor: isChecked ? activeArea.color : '#F1F5F9', 
                                    boxShadow: isChecked ? `0 12px 30px ${activeArea.color}20` : 'none', 
                                    transform: isChecked ? 'translateX(10px)' : 'none',
                                    position: 'relative', zIndex: 1,
                                    marginBottom: '16px'
                                }}
                            >
                              <div style={{ 
                                  width: '40px', height: '40px', borderRadius: '12px', 
                                  backgroundColor: isChecked ? activeArea.color : '#F8FAFC', 
                                  color: isChecked ? 'white' : '#94A3B8', 
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '0.9rem', fontWeight: 950, border: '1.5px solid',
                                  borderColor: isChecked ? 'transparent' : '#E2E8F0'
                              }}>
                                {idx + 1}
                              </div>

                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    {isFoundation ? (
                                        <span style={{ fontSize: '0.6rem', fontWeight: 950, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '6px' }}>PONDASI</span>
                                    ) : isAdvanced ? (
                                        <span style={{ fontSize: '0.6rem', fontWeight: 950, color: '#7C3AED', background: '#F5F3FF', padding: '2px 8px', borderRadius: '6px' }}>LANJUTAN</span>
                                    ) : (
                                        <span style={{ fontSize: '0.6rem', fontWeight: 950, color: '#2563EB', background: '#EFF6FF', padding: '2px 8px', borderRadius: '6px' }}>PENGEMBANGAN</span>
                                    )}

                                    {/* 💡 SMART INSIGHT BADGES & DESCRIPTIONS */}
                                    {targetedNames[label] && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontSize: '0.6rem', fontWeight: 950, color: '#D97706', background: '#FFFBEB', border: '1px solid #FCD34D', padding: '1px 8px', borderRadius: '6px', width: 'fit-content', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Target size={10} /> TARGET MINGGU INI
                                            </span>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#B45309', marginLeft: '4px' }}>
                                                Direncanakan untuk: {targetedNames[label].join(', ')}
                                            </div>
                                        </div>
                                    )}
                                    {popularData[label] >= 2 && (
                                        <span style={{ fontSize: '0.6rem', fontWeight: 950, color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '1px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                                            <TrendingUp size={10} /> POPULER ({popularData[label]}x Digunakan)
                                        </span>
                                    )}
                                    {masteredCount[label] > 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontSize: '0.6rem', fontWeight: 950, color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '1px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                                                <CheckCircle2 size={10} /> TELAH TUNTAS ({masteredCount[label]} Anak)
                                            </span>
                                            {masteredCount[label] >= 5 && (
                                                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#059669', marginLeft: '4px', fontStyle: 'italic' }}>
                                                    Aman dipindahkan ke gudang.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {isMissingPre && (
                                        <div style={{ marginTop: '4px', fontSize: '0.65rem', fontWeight: 800, color: '#DC2626', background: '#FEF2F2', padding: '6px 12px', borderRadius: '10px', border: '1px solid #FCA5A5', lineHeight: 1.4 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                                                <AlertCircle size={10}/> BUTUH PRASYARAT:
                                            </div>
                                            {missingPres.join(', ')}
                                        </div>
                                    )}
                                    {hint && isChecked && (
                                        <div style={{ marginTop: '4px', fontSize: '0.6rem', fontWeight: 700, color: '#047857', background: '#F0FDF4', padding: '4px 8px', borderRadius: '6px', border: '1px dashed #A7F3D0', fontStyle: 'italic' }}>
                                            💡 Intro: {hint}
                                        </div>
                                    )}
                                </div>

                                <div style={{ fontSize: '1rem', fontWeight: 900, color: isChecked ? '#0F172A' : '#475569', display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
                                    <span>{(label.split(': ')[1] || label).split(' / ')[0]}</span>
                                </div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', marginTop: '2px' }}>{label.split(':')[0]}</div>
                              </div>

                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <button onClick={(e) => { e.stopPropagation(); setShowGuide(typeof m === 'object' ? m : { label }); }} style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '10px', width: '36px', height: '36px', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                                  <Info size={18} />
                                </button>
                                <div style={{ 
                                    width: '32px', height: '32px', borderRadius: '50%', border: '2.5px solid', 
                                    borderColor: isChecked ? activeArea.color : '#E2E8F0', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    backgroundColor: isChecked ? activeArea.color : 'transparent',
                                    transition: 'all 0.3s'
                                }}>
                                  {isChecked && <CheckCircle2 size={18} color="white" />}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>


      <style>{`
          .control-center-header { 
              position: sticky; top: 0; z-index: 1000; 
              background: rgba(255, 255, 255, 0.85); 
              backdrop-filter: blur(16px) saturate(180%);
              -webkit-backdrop-filter: blur(16px) saturate(180%);
              padding: 16px 20px; border-bottom: 2px solid rgba(255, 255, 255, 0.3); margin-bottom: 24px;
          }

          .header-action-btn { background: white; border: 2px solid #F1F5F9; border-radius: 12px; height: 44px; width: 44px; display: flex; align-items: center; justifyContent: center; cursor: pointer; color: #64748B; transition: all 0.2s; }
          
          .btn-copy-shelf { background: var(--primary-light); color: var(--primary); border: 2px solid #C7D2FE; padding: 0 16px; border-radius: 12px; fontWeight: 900; height: 44px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }
          .btn-clear-shelf { background: #FEF2F2; color: #EF4444; border: 2px solid #FECACA; padding: 0 16px; border-radius: 12px; fontWeight: 900; height: 44px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }
          .btn-save-master { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; border: none; padding: 0 24px; border-radius: 14px; fontWeight: 950; height: 44px; cursor: pointer; boxShadow: 0 4px 15px rgba(37, 99, 235, 0.3); display: flex; align-items: center; gap: 10px; font-size: 0.9rem; margin-left: auto; }
          
          .area-navbar-wrapper {
              margin: 16px -20px 0 -20px; padding: 0 20px;
              overflow-x: auto; scrollbar-width: none;
              -ms-overflow-style: none;
          }
          .area-navbar-wrapper::-webkit-scrollbar { display: none; }
          
          .area-navbar-container {
              display: flex; gap: 12px; padding: 4px 0 12px 0;
              width: max-content;
          }

          .area-nav-btn {
              display: flex; align-items: center; gap: 10px;
              padding: 8px 16px 8px 8px; border-radius: 100px;
              background: rgba(255, 255, 255, 0.7);
              backdrop-filter: blur(8px); border: 1.5px solid #F1F5F9;
              cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              position: relative; white-space: nowrap;
          }

          .area-nav-btn:hover { background: white; transform: translateY(-2px); border-color: var(--area-theme); }

          .area-nav-btn.active {
              background: var(--area-theme);
              border-color: var(--area-theme);
              box-shadow: 0 10px 20px -5px var(--area-theme);
              transform: scale(1.05);
          }

          .area-icon-box {
              width: 36px; height: 36px; border-radius: 50%;
              background: white; display: flex; align-items: center; 
              justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05);
              transition: all 0.3s;
          }

          .area-nav-btn.active .area-icon-box { background: rgba(255,255,255,0.2); }
          .area-nav-btn.active .area-label-text { color: white; }

          .area-label-text { font-size: 0.85rem; font-weight: 850; color: #64748B; transition: all 0.3s; }
          
          .area-badge {
              background: #0F172A; color: white; font-size: 0.65rem; font-weight: 950;
              padding: 2px 8px; border-radius: 100px; border: 2px solid white;
              position: absolute; top: -5px; right: -5px;
          }
          
          .area-nav-btn.active .area-badge { background: white; color: var(--area-theme); border-color: var(--area-theme); }
          
          .show-mobile { display: none; }
          .hide-mobile { display: flex; }

          /* MODERN MENTOR MODAL */
          .modern-guide-modal { 
              background: rgba(255, 255, 255, 0.85); 
              backdrop-filter: blur(32px) saturate(160%);
              -webkit-backdrop-filter: blur(32px) saturate(160%);
              width: 92%; max-width: 550px; border-radius: 40px; 
              box-shadow: 0 30px 60px -12px rgba(15,23,42,0.3); overflow: hidden;
              display: flex; flex-direction: column; max-height: 85vh;
              animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
              border: 1px solid rgba(255, 255, 255, 0.5);
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
              margin: 12px 0; color: var(--primary); font-weight: 800; font-size: 0.95rem;
              display: flex; gap: 10px; align-items: flex-start;
              border-left: 4px solid var(--primary);
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

          @keyframes popIn {
            from { opacity: 0; transform: scale(0.9) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }

          @media (max-width: 640px) {
              .show-mobile { display: flex; }
              .hide-mobile { display: none; }
              .control-center-header { padding: 12px; margin-bottom: 16px; }
              .btn-copy-shelf, .btn-clear-shelf { padding: 0 12px; border-radius: 10px; height: 38px; font-size: 0.75rem; }
              .header-action-btn { height: 38px; width: 38px; border-radius: 10px; }
              
              .area-navbar-wrapper { margin: 12px -12px 0 -12px; padding: 0 12px; }
              .area-nav-btn { padding: 6px 12px 6px 6px; gap: 8px; }
              .area-icon-box { width: 30px; height: 30px; }
              .area-label-text { font-size: 0.75rem; }
          }

          @keyframes popIn { from { transform: scale(0.8) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
          ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
