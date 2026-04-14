import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { AREA_SENTRA } from '../data/areaSentra';
import { 
  ArrowLeft, Save, CheckCircle2, 
  Target, Sparkles, X, Star, 
  Moon, Hash, BookOpen, Leaf, Globe2, Wand2,
  Users, MapPin, PackageOpen, Loader2,
  ChevronLeft, ChevronRight, Calendar as LucideCalendar
} from 'lucide-react';

const IconMap = { Moon, Hash, BookOpen, Leaf, Globe2, Wand2 };
const AreaIcon = ({ name, color, size = 18 }) => {
  const IconComp = IconMap[name] || Star;
  return <IconComp size={size} color={color} />;
};

const WEEKLY_PLANNER_METADATA = {
  title: "Perencanaan Mingguan",
  cycle: "Target Sesi Sentra",
  icon: LucideCalendar,
  color: "#6366F1"
};

// --- PERIOD UTILS ---
const getPeriodId = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  // Simple week of month calculation
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfMonth = date.getDate();
  const weekNum = Math.ceil((dayOfMonth + firstDayOfMonth.getDay()) / 7);
  return `${y}-${m}-W${weekNum}`;
};

const getPeriodLabel = (periodId) => {
  if (!periodId) return "";
  const [y, m, w] = periodId.split('-');
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return `${months[parseInt(m)-1]} ${y}, Minggu ke-${w.replace('W','')}`;
};

export default function LessonPlan() {
  const navigate = useNavigate();
  const [activeRoom, setActiveRoom] = useState('Kelas 1');
  const [curriculum, setCurriculum] = useState([]);
  const [activeAreaId, setActiveAreaId] = useState(null);
  
  // Period State
  const [activePeriod, setActivePeriod] = useState(getPeriodId());
  const [viewDate, setViewDate] = useState(new Date());

  // Data States
  const [shelfItems, setShelfItems] = useState([]); 
  const [plannedItems, setPlannedItems] = useState({}); // { studentId: [materialLabels...] }
  
  // Modals & UI States
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState([]);
  
  // Bulk Assign State
  const [activeMaterial, setActiveMaterial] = useState(null); // The label string being edited for targets

  // 🔄 SYNC CURRICULUM FROM FIRESTORE
  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const collRef = collection(db, 'kurikulum_pusat');
        const snapshot = await getDocs(collRef);
        let fetchedData = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));

        if (fetchedData.length === 0) {
           setCurriculum(AREA_SENTRA);
           if(!activeAreaId) setActiveAreaId(AREA_SENTRA[1].id);
        } else {
           const orderMap = {};
           AREA_SENTRA.forEach((item, idx) => orderMap[item.id] = idx);
           fetchedData.sort((a,b) => (orderMap[a.id] ?? 99) - (orderMap[b.id] ?? 99));
           setCurriculum(fetchedData);
           if(!activeAreaId) setActiveAreaId(fetchedData[1]?.id || fetchedData[0].id);
        }
      } catch (err) {
        setCurriculum(AREA_SENTRA);
        if(!activeAreaId) setActiveAreaId(AREA_SENTRA[1].id);
      }
    };
    fetchCurriculum();
  }, []);

  // Load plans and students
  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      try {
        const targetDoc = await getDoc(doc(db, 'target_observasi', activePeriod));
        if (targetDoc.exists()) {
          setPlannedItems(targetDoc.data().plans || {});
        } else {
          setPlannedItems({});
        }
      } catch (err) {
        setPlannedItems({});
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, [activePeriod]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const q = query(collection(db, 'students'), where('status', '==', 'active'));
        const snapshot = await getDocs(q);
        const studData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        studData.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(studData);
      } catch (err) { console.error(err); }
    };
    fetchStudents();
  }, []);

  // Sync shelf for current room
  useEffect(() => {
    const saved = localStorage.getItem(`sentra_shelf_${activeRoom}`);
    if (saved) {
      setShelfItems(JSON.parse(saved));
    } else {
      const legacy = localStorage.getItem('sentra_shelf');
      setShelfItems(legacy ? JSON.parse(legacy) : []);
    }
  }, [activeRoom]);

  // Function to assign target to a student
  const toggleTarget = (studentId, materialLabel) => {
    const current = plannedItems[studentId] || [];
    let newTargets;
    if (current.includes(materialLabel)) {
      newTargets = current.filter(t => t !== materialLabel);
    } else {
      newTargets = [materialLabel]; // Single target focus
    }
    setPlannedItems({ ...plannedItems, [studentId]: newTargets });
  };

  const assignToAllVisible = () => {
    if (!activeMaterial) return;
    const newPlans = { ...plannedItems };
    visibleStudents.forEach(s => {
      newPlans[s.id] = [activeMaterial];
    });
    setPlannedItems(newPlans);
    setActiveMaterial(null);
  };

  // --- SAVE ACTIONS ---
  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'target_observasi', activePeriod), { 
        plans: plannedItems,
        periodLabel: getPeriodLabel(activePeriod),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    } catch (err) {
        alert("Gagal menyimpan ke server, periksa koneksi.");
    } finally {
        setSaving(false);
    }
  };

  const navigatePeriod = (direction) => {
    const nextDate = new Date(viewDate);
    nextDate.setDate(viewDate.getDate() + (direction * 7));
    setViewDate(nextDate);
    setActivePeriod(getPeriodId(nextDate));
  };

  const groupMateriByClass = (levels = []) => {
    const groups = { 'Kelas 1': [], 'Kelas 2': [], 'Kelas 3': [], 'Lainnya': [] };
    levels.forEach(lvl => {
        const label = typeof lvl === 'object' ? lvl.label : lvl;
        if (label.startsWith('K1:')) groups['Kelas 1'].push(lvl);
        else if (label.startsWith('K2:')) groups['Kelas 2'].push(lvl);
        else if (label.startsWith('K3:')) groups['Kelas 3'].push(lvl);
        else groups['Lainnya'].push(lvl);
    });
    return Object.entries(groups).filter(([_, items]) => items.length > 0);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Memuat data Perencanaan...</div>;

  return (
    <div className="page-container" style={{ paddingBottom: '140px' }}>
      
      {/* 🚀 SUCCESS OVERLAY */}
      {showSuccess && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}>
          <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '32px 64px', borderRadius: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)', animation: 'popIn 0.5s' }}>
             <CheckCircle2 size={64} />
             <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>Perencanaan Tersimpan!</div>
             <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Target sukses dibebankan ke anak.</p>
          </div>
        </div>
      )}

      {/* 🚀 BULK ASSIGN MODAL */}
      {activeMaterial && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setActiveMaterial(null)}>
              <div style={{ backgroundColor: 'white', width: '100%', borderTopLeftRadius: '35px', borderTopRightRadius: '35px', padding: '32px', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                      <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '8px' }}>TARGETKAN MATERI</div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, lineHeight: 1.3 }}>{activeMaterial.split(': ')[1]?.split(' / ')[0] || activeMaterial}</h3>
                      </div>
                      <button onClick={() => setActiveMaterial(null)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={20} /></button>
                  </div>
                  
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Pilih murid yang diwajibkan menerima presentasi materi ini:</div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginBottom: '32px', maxHeight: '40vh', overflowY: 'auto' }}>
                      {students.map(s => {
                          const isAssigned = (plannedItems[s.id] || []).includes(activeMaterial);
                          return (
                              <button 
                                  key={s.id}
                                  onClick={() => toggleTarget(s.id, activeMaterial)}
                                  style={{ 
                                      padding: '16px', borderRadius: '16px', border: '2px solid',
                                      borderColor: isAssigned ? 'var(--primary)' : 'var(--border-color)',
                                      background: isAssigned ? 'var(--primary-light)' : 'white',
                                      color: isAssigned ? 'var(--primary)' : 'var(--text-main)',
                                      fontWeight: 800, textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s',
                                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                                  }}
                              >
                                  {isAssigned ? <CheckCircle2 size={24} /> : <div style={{width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--border-color)'}} />}
                                  {s.name.split(' ')[0]} {/* Short name */}
                              </button>
                          );
                      })}
                  </div>
                  <button onClick={() => setActiveMaterial(null)} style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 900, fontSize: '1rem', cursor: 'pointer' }}>SIMPAN KELOMPOK INI</button>
              </div>
          </div>
      )}

      {/* HEADER SECTION */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => navigate(-1)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <ArrowLeft size={20} />
                </button>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Target Presentasi Anak</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F5F3FF', padding: '8px 16px', borderRadius: '100px', border: '1px solid #DDD6FE' }}>
               <LucideCalendar size={14} color="#6D28D9" />
               <span style={{ fontSize: '0.75rem', fontWeight: 950, color: '#6D28D9', textTransform: 'uppercase' }}>Siklus Mingguan</span>
            </div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Bebankan tanggung jawab belajar per anak/kelompok. Daftar materi di bawah ini disesuaikan dengan isi rak kelas masing-masing.</p>
      </div>

      {/* 📅 PERIOD NAVIGATOR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', background: 'white', padding: '12px', borderRadius: '20px', border: '2.5px solid #F1F5F9' }}>
          <button 
             onClick={() => navigatePeriod(-1)}
             style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', width: '44px', height: '44px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
             <ChevronLeft size={20} color="#64748B" />
          </button>
          
          <div style={{ flex: 1, textAlign: 'center' }}>
             <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Periode Target</div>
             <div style={{ fontSize: '1.1rem', fontWeight: 950, color: '#1E293B' }}>{getPeriodLabel(activePeriod)}</div>
          </div>

          <button 
             onClick={() => navigatePeriod(1)}
             style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', width: '44px', height: '44px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
             <ChevronRight size={20} color="#64748B" />
          </button>
      </div>

      {/* ROOM SWITCHER */}
      <div style={{ background: 'white', padding: '16px 20px', borderRadius: '20px', border: '2px solid #E2E8F0', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <MapPin size={24} color="#FF6B8B" />
          <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tentukan Target Untuk Kelas:</div>
              <select 
                  value={activeRoom} 
                  onChange={e => setActiveRoom(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', outline: 'none', marginTop: '4px' }}
              >
                  <option value="Kelas 1">Ruang Sentra 1 (Kelas 1)</option>
                  <option value="Kelas 2">Ruang Sentra 2 (Kelas 2)</option>
                  <option value="Kelas 3">Ruang Sentra 3 (Kelas 3)</option>
              </select>
          </div>
      </div>

      {/* 🗺️ AREA TABS (Horizontal Scroll Style) */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px', scrollbarWidth: 'none' }}>
        {curriculum.map(area => {
            const activeArea = curriculum.find(c => c.id === activeAreaId) || curriculum[0];
            // Hide areas that have NO shelf items in the currently selected room
            const hasShelfItems = area.subAreas.some(sub => sub.levels.some(l => shelfItems.includes(typeof l === 'object' ? l.label : l)));
            if (!hasShelfItems && shelfItems.length > 0) return null; 

            return (
                <button 
                    key={area.id}
                    onClick={() => setActiveAreaId(area.id)}
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px',
                        borderRadius: '16px', border: '2px solid', 
                        borderColor: activeAreaId === area.id ? 'var(--primary)' : 'transparent',
                        background: activeAreaId === area.id ? 'var(--primary-light)' : 'white',
                        color: activeAreaId === area.id ? 'var(--primary)' : 'var(--text-main)',
                        cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', fontWeight: 800
                    }}
                >
                    <AreaIcon name={area.icon} color={activeAreaId === area.id ? 'var(--primary)' : area.color} size={20} />
                    <span>{area.name}</span>
                </button>
            );
        })}
      </div>

      {/* 📋 CONTENT AREA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {shelfItems.length === 0 && (
              <div style={{ padding: '24px', backgroundColor: '#FEF3C7', color: '#B45309', borderRadius: '16px', textAlign: 'center', fontWeight: 800 }}>
                  ⚠️ {activeRoom} belum memiliki materi di rak fisik. Silakan atur rak di menu "Siapkan Rak Kelas" terlebih dahulu.
              </div>
          )}

          {(() => {
              const activeArea = curriculum.find(c => c.id === activeAreaId) || curriculum[0];
              return activeArea?.subAreas.map(sub => {
                  // Only display levels that are CURRENTLY ON THE SHELF in this room
                  const filteredLevels = sub.levels.filter(l => shelfItems.includes(typeof l === 'object' ? l.label : l));
                  if (filteredLevels.length === 0) return null;

                  return (
                      <div key={sub.id} className="card" style={{ padding: '24px' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '20px', color: activeArea.color, display: 'flex', alignItems: 'center', gap: '10px' }}>
                             <Sparkles size={18} /> {sub.name}
                          </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {groupMateriByClass(filteredLevels).map(([title, items]) => (
                              <div key={title} style={{ marginBottom: '8px' }}>
                                  <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>{title}</div>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr)', gap: '10px' }}>
                                      {items.map(m => {
                                          const label = typeof m === 'object' ? m.label : m;
                                          const cleanLabel = label.split(': ')[1]?.split(' / ')[0] || label;
                                          
                                          // Count how many students are assigned to this material
                                          const assignedCount = students.reduce((count, s) => {
                                              return count + ((plannedItems[s.id] || []).includes(label) ? 1 : 0);
                                          }, 0);

                                          return (
                                            <div 
                                                key={label} onClick={() => setActiveMaterial(label)}
                                                style={{ 
                                                    padding: '16px 20px', borderRadius: '16px', border: '2px solid',
                                                    borderColor: assignedCount > 0 ? 'var(--primary)' : 'var(--border-color)',
                                                    background: assignedCount > 0 ? 'var(--primary-light)' : 'white',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                    cursor: 'pointer', transition: 'all 0.1s'
                                                }}
                                            >
                                                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: assignedCount > 0 ? 'var(--primary)' : 'var(--text-main)' }}>{cleanLabel}</span>
                                                
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: assignedCount > 0 ? 'var(--primary)' : '#F1F5F9', color: assignedCount > 0 ? 'white' : 'var(--text-muted)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 900 }}>
                                                    <Users size={14} /> {assignedCount} Anak
                                                </div>
                                            </div>
                                          );
                                      })}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              );
          })})()}
      </div>

      {/* 🚀 FLOATING SUMMARY & SAVE */}
      <div className="premium-save-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div>
                  <div style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem' }}>Target Tersusun</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 700 }}>Total {Object.values(plannedItems).flat().length} tanggungan presentasi.</div>
              </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            style={{ 
              backgroundColor: 'white', color: 'var(--primary)', border: 'none', 
              padding: '16px 32px', borderRadius: '18px', fontWeight: 900, 
              cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}
          >
              <Save size={20} /> {saving ? 'Menyimpan...' : 'SIMPAN TARGET'}
          </button>
      </div>

      <style>{`
          @keyframes popIn { from { transform: scale(0.8) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
          @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
          ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
