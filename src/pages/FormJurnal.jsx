import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, Save, CheckCircle, Clock, Info, User, Users, Clipboard, Moon, Hash, BookOpen, Leaf, Globe2, Wand2, Star, Play, X, Check, ChevronRight, ChevronLeft, ChevronDown, Eye, Repeat, Sparkles, MessageSquare, Zap, BookMarked } from 'lucide-react';
import { AREA_SENTRA } from '../data/areaSentra';

const IconMap = { Moon, Hash, BookOpen, Leaf, Globe2, Wand2 };
const AreaIcon = ({ name, color, size = 18 }) => {
  const IconComp = IconMap[name] || Star;
  return <IconComp size={size} color={color} />;
};

// Montessori P-W-M-N Maturity Standard
const MATURITY_META = [
  { level: 'P', title: 'Presented', emoji: '📢', desc: 'Selesai dipresentasikan oleh Guru.', color: '#3B82F6', bg: '#EFF6FF', guide: 'Baru menerima presentasi.' },
  { level: 'W', title: 'Working', emoji: '⚙️', desc: 'Sedang berlatih / mengulang aktivitas.', color: '#F59E0B', bg: '#FFFBEB', guide: 'Tahap mengulang & berlatih.' },
  { level: 'M', title: 'Mastered', emoji: '🌟', desc: 'Sudah menguasai / masuk fase abstrak.', color: '#10B981', bg: '#ECFDF5', guide: 'Mahir, tuntas, & mandiri.' },
  { level: 'N', title: 'Needs Support', emoji: '🆘', desc: 'Butuh bantuan / presentasi ulang.', color: '#EF4444', bg: '#FEF2F2', guide: 'Macet/butuh bantuan guru.' },
];

const FOCUS_LEVELS = [
  { emoji: '🌱', label: 'Exploration', value: 1, color: '#94A3B8', desc: 'Menjajaki minat.', guide: 'Baru menjajaki minat.' },
  { emoji: '⚙️', label: 'Working', value: 2, color: '#3B82F6', desc: 'Fokus & asyik.', guide: 'Fokus & asyik bekerja.' },
  { emoji: '🔥', label: 'Deep Focus', value: 3, color: '#8B5CF6', desc: 'Kebal gangguan.', guide: 'Khusyuk & kebal gangguan.' },
];

const SOCIAL_META = [
  { level: 'Individual', emoji: '👤', color: '#64748B', bg: '#F1F5F9', guide: 'Bekerja sendiri.' },
  { level: 'Pair', emoji: '👥', color: '#4F46E5', bg: '#EEF2FF', guide: 'Bekerja berdua.' },
  { level: 'Collaborative', emoji: '👨‍👩‍👧‍👦', color: '#8B5CF6', bg: '#F5F3FF', guide: 'Kerja kelompok.' },
];

const QUICK_DURATIONS = [5, 10, 15, 20, 30, 45, 60];

export default function FormJurnal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studentName = searchParams.get('name') || 'Pilih Murid';
  
  // Wizard step
  const [step, setStep] = useState(0); // Changed from 1 to 0 for initial student selection
  const totalSteps = 4; // 0: Student, 1: Material, 2: Level, 3: Assessment, 4: Notes (Total stays comparable)

  // Form states
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]); // Array for future multi-select, but currently one
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedSubArea, setSelectedSubArea] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null); // full object or string
  const [maturity, setMaturity] = useState('W');
  const [focusLevel, setFocusLevel] = useState(2);
  const [socialContext, setSocialContext] = useState('Individual');
  const [isRestored, setIsRestored] = useState(true);
  const [duration, setDuration] = useState(20);
  const [repetition, setRepetition] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const contentRef = useRef(null);

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Students
        const snapS = await getDocs(query(collection(db, 'students'), where('status', '==', 'active')));
        const sData = snapS.docs.map(d => ({ id: d.id, ...d.data() }));
        setStudents(sData.sort((a,b) => a.name.localeCompare(b.name)));

        // Fetch Master Rombel for filtering
        const snapR = await getDocs(collection(db, 'master_rombel'));
        const rData = snapR.docs.map(d => ({ id: d.id, ...d.data() }));
        setRooms(rData.sort((a,b) => (a.level||'').localeCompare(b.level||'')));

        // If name already in search params, pre-select
        const preSelected = searchParams.get('name');
        if (preSelected) {
          setSelectedStudents([preSelected]);
          setStep(1); // Skip to material selection
        }
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  // Auto-reset cascade
  useEffect(() => { setSelectedSubArea(null); setSelectedLevel(null); }, [selectedArea]);
  useEffect(() => { setSelectedLevel(null); }, [selectedSubArea]);
  useEffect(() => { if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  // Auto-expand first group
  useEffect(() => {
    if (selectedSubArea) {
      const groups = getGroups(selectedSubArea);
      const firstKey = Object.keys(groups).find(k => groups[k].length > 0);
      setExpandedGroup(firstKey || null);
    }
  }, [selectedSubArea]);

  const getGroups = (sub) => {
    if (!sub) return {};
    const groups = {};
    sub.levels.forEach(lvl => {
      const label = typeof lvl === 'object' ? lvl.label : lvl;
      let key = 'Lainnya';
      if (label.startsWith('K1:')) key = 'Kelas 1 (6-7 thn)';
      else if (label.startsWith('K2:')) key = 'Kelas 2 (7-8 thn)';
      else if (label.startsWith('K3:')) key = 'Kelas 3 (8-9 thn)';
      else if (label.startsWith('3Y:')) key = 'Siklus 3 Tahun';
      if (!groups[key]) groups[key] = [];
      groups[key].push(lvl);
    });
    return groups;
  };

  const getLevelLabel = (lvl) => typeof lvl === 'object' ? lvl.label : lvl;
  const getLevelShort = (lvl) => {
    const label = getLevelLabel(lvl);
    return label.split(': ').slice(1).join(': ').split(' / ')[0] || label;
  };
  const hasGuide = (lvl) => typeof lvl === 'object' && lvl.presentation;

  const canGoNext = () => {
    if (step === 0) return selectedStudents.length > 0;
    if (step === 1) return selectedArea && selectedSubArea;
    if (step === 2) return selectedLevel;
    return true;
  };

  const getFilteredStudents = () => {
    return students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRoom = activeRoom === 'Semua' || s.rombel === activeRoom;
      return matchSearch && matchRoom;
    });
  };

  const handleSubmit = async () => {
    if (selectedStudents.length === 0 || !selectedArea || !selectedSubArea || !selectedLevel) {
      alert("Harap lengkapi area & material.");
      return;
    }
    setLoading(true);
    try {
      const levelLabel = getLevelLabel(selectedLevel);
      // For now, handle one student. If multi-select is expanded, loop here.
      const currentStudent = selectedStudents[0];
      await addDoc(collection(db, 'jurnal_aktivitas'), {
        murid: currentStudent,
        area: selectedArea.name,
        aktivitas: selectedSubArea.name,
        pencapaian: levelLabel,
        kematangan: maturity,
        konsentrasi: FOCUS_LEVELS[focusLevel - 1]?.label || 'Working',
        sosial: socialContext,
        restorasi: isRestored,
        durasi: parseInt(duration),
        repetisi: repetition,
        catatan: notes,
        guru: "Ustadzah Sari",
        tanggal: serverTimestamp()
      });
      setSaved(true);
      setTimeout(() => navigate(-1), 2500);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan. Cek koneksi internet.");
    } finally {
      setLoading(false);
    }
  };

  if (saved) {
    return (
      <div style={styles.successPage}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}><CheckCircle size={48} /></div>
          <h2 style={{ margin: 0 }}>Observasi Tersimpan! ✨</h2>
          <p style={{ color: '#64748B', marginTop: '12px' }}>Data perkembangan <strong>{selectedStudents[0]}</strong> telah dicatat.</p>
          <div style={styles.successSummary}>
            <div><strong>{selectedArea?.name}</strong></div>
            <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{getLevelShort(selectedLevel)}</div>
            <div style={{ marginTop: '8px' }}>{MATURITY_META.find(m => m.level === maturity)?.emoji} {MATURITY_META.find(m => m.level === maturity)?.title} · {FOCUS_LEVELS[focusLevel-1]?.emoji} {duration} mnt</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      
      {/* HEADER BAR */}
      <div style={styles.header}>
        <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)} style={styles.backBtn}>
          <ArrowLeft size={20} />
        </button>
        <div style={styles.headerCenter}>
          <div style={styles.headerTitle}>Monitor Sentra</div>
          <div style={styles.headerStudent}>
            {selectedStudents.length > 0 ? `👥 ${selectedStudents.join(', ')}` : 'Pilih Murid untuk Diobservasi'}
          </div>
        </div>
        <div style={styles.stepBadge}>
          {step}/{totalSteps}
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${(step / totalSteps) * 100}%` }} />
      </div>

      {/* STEP LABELS */}
      <div style={styles.stepLabels}>
        {['Murid', 'Material', 'Level', 'Skor', 'Naratif'].map((label, i) => (
          <div key={i} style={{ ...styles.stepLabel, color: step >= i ? 'var(--primary)' : '#CBD5E1', fontWeight: step === i ? 800 : 500 }}>
            <div style={{ ...styles.stepDot, backgroundColor: step > i ? 'var(--primary)' : step === i ? 'var(--primary)' : '#E2E8F0', transform: step === i ? 'scale(1.2)' : 'scale(1)' }}>
              {step > i ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: '0.65rem' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* SCROLLABLE CONTENT */}
      <div ref={contentRef} style={styles.content}>
        
        {/* ━━━ STEP 0: PILIH MURID (QUICK SELECT) ━━━ */}
        {step === 0 && (
          <div style={styles.stepContent}>
            <div style={styles.sectionTitle}>
              <Users size={18} color="var(--primary)" />
              <span>Pilih Murid</span>
            </div>
            
            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={16} />
              <input 
                type="text" 
                placeholder="Cari nama murid..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: 600, fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            {/* Room Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
              <button 
                key="all"
                onClick={() => setActiveRoom('Semua')}
                style={{ ...styles.roomTab, backgroundColor: activeRoom === 'Semua' ? 'var(--primary)' : 'white', color: activeRoom === 'Semua' ? 'white' : '#64748B', borderColor: activeRoom === 'Semua' ? 'var(--primary)' : '#E2E8F0' }}
              >Semua</button>
              {rooms.map(r => (
                <button 
                  key={r.id}
                  onClick={() => setActiveRoom(r.name)}
                  style={{ ...styles.roomTab, backgroundColor: activeRoom === r.name ? 'var(--primary)' : 'white', color: activeRoom === r.name ? 'white' : '#64748B', borderColor: activeRoom === r.name ? 'var(--primary)' : '#E2E8F0' }}
                >
                  {r.level}-{r.name}
                </button>
              ))}
            </div>

            {/* Student Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {getFilteredStudents().length > 0 ? (
                getFilteredStudents().map(s => {
                  const isSelected = selectedStudents.includes(s.name);
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedStudents([s.name]);
                        setStep(1);
                      }}
                      style={{
                        ...styles.studentCard,
                        borderColor: isSelected ? 'var(--primary)' : 'transparent',
                        backgroundColor: isSelected ? 'var(--primary-light)' : 'white',
                        boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.2)' : '0 2px 4px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{ ...styles.studentAvatar, backgroundColor: isSelected ? 'var(--primary)' : '#F1F5F9', color: isSelected ? 'white' : '#64748B' }}>
                        {s.name.charAt(0)}
                      </div>
                      <div style={{ textAlign: 'left', flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.8rem', color: isSelected ? 'var(--primary)' : '#1E293B' }}>{s.name}</div>
                        <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600 }}>{s.rombel || 'Tanpa Kelas'}</div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px', color: '#94A3B8', fontWeight: 600 }}>Murid tidak ditemukan.</div>
              )}
            </div>
          </div>
        )}

        {/* ━━━ STEP 1: AREA & MATERIAL ━━━ */}
        {step === 1 && (
          <div style={styles.stepContent}>
            <div style={styles.sectionTitle}>
              <Sparkles size={18} color="var(--primary)" />
              <span>Apa yang sedang dikerjakan anak?</span>
            </div>
            
            {/* Area Grid */}
            <div style={styles.areaGrid}>
              {AREA_SENTRA.map(area => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => setSelectedArea(area)}
                  style={{
                    ...styles.areaCard,
                    borderColor: selectedArea?.id === area.id ? area.color : 'transparent',
                    backgroundColor: selectedArea?.id === area.id ? area.bgColor : '#F8FAFC',
                    boxShadow: selectedArea?.id === area.id ? `0 4px 20px ${area.color}30` : 'none',
                  }}
                >
                  <div style={{ ...styles.areaIconWrap, backgroundColor: selectedArea?.id === area.id ? area.color + '20' : '#F1F5F9' }}>
                    <AreaIcon name={area.icon} color={area.color} size={22} />
                  </div>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700, 
                    color: selectedArea?.id === area.id ? area.color : '#64748B',
                    lineHeight: 1.2
                  }}>{area.shortName}</span>
                </button>
              ))}
            </div>

            {/* Sub-area pills */}
            {selectedArea && (
              <div style={{ animation: 'fadeSlideUp 0.3s ease', marginTop: '16px' }}>
                <div style={styles.subLabel}>
                  <AreaIcon name={selectedArea.icon} color={selectedArea.color} size={16} />
                  <span style={{ color: selectedArea.color }}>Sub-area {selectedArea.shortName}:</span>
                </div>
                <div style={styles.subGrid}>
                  {selectedArea.subAreas.map(sub => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubArea(sub)}
                      style={{
                        ...styles.subPill,
                        borderColor: selectedSubArea?.id === sub.id ? selectedArea.color : '#E2E8F0',
                        backgroundColor: selectedSubArea?.id === sub.id ? selectedArea.color : 'white',
                        color: selectedSubArea?.id === sub.id ? 'white' : '#334155',
                        boxShadow: selectedSubArea?.id === sub.id ? `0 3px 12px ${selectedArea.color}40` : '0 1px 3px rgba(0,0,0,0.06)',
                      }}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ━━━ STEP 2: LEVEL PENCAPAIAN ━━━ */}
        {step === 2 && selectedSubArea && (
          <div style={styles.stepContent}>
            <div style={styles.sectionTitle}>
              <Clipboard size={18} color="var(--primary)" />
              <span>Material apa yang digunakan?</span>
            </div>
            <div style={styles.breadcrumb}>
              <span>{selectedArea?.shortName}</span>
              <ChevronRight size={14} />
              <span>{selectedSubArea.name}</span>
            </div>

            {/* Grouped levels with accordion */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(getGroups(selectedSubArea))
                .filter(([_, items]) => items.length > 0)
                .map(([title, items]) => {
                  const isOpen = expandedGroup === title;
                  const groupColor = title.includes('1') ? '#3B82F6' : title.includes('2') ? '#8B5CF6' : title.includes('3') ? '#F59E0B' : '#10B981';
                  return (
                    <div key={title} style={styles.groupCard}>
                      <button 
                        type="button"
                        onClick={() => setExpandedGroup(isOpen ? null : title)}
                        style={{ ...styles.groupHeader, borderColor: groupColor + '30' }}
                      >
                        <div style={{ ...styles.groupDot, backgroundColor: groupColor }} />
                        <span style={{ fontWeight: 800, fontSize: '0.8rem', flex: 1, textAlign: 'left' }}>{title}</span>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8', marginRight: '8px' }}>{items.length} materi</span>
                        <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                      </button>
                      {isOpen && (
                        <div style={styles.groupItems}>
                          {items.map((lvl) => {
                            const label = getLevelLabel(lvl);
                            const isSelected = getLevelLabel(selectedLevel) === label;
                            return (
                              <button
                                key={label}
                                type="button"
                                onClick={() => { setSelectedLevel(lvl); setShowGuide(false); }}
                                style={{
                                  ...styles.levelItem,
                                  borderColor: isSelected ? 'var(--primary)' : '#F1F5F9',
                                  backgroundColor: isSelected ? 'var(--primary-light)' : 'white',
                                }}
                              >
                                <div style={{ ...styles.levelRadio, borderColor: isSelected ? 'var(--primary)' : '#CBD5E1', backgroundColor: isSelected ? 'var(--primary)' : 'transparent' }}>
                                  {isSelected && <div style={styles.levelRadioInner} />}
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left', gap: 2 }}>
                                   <div style={{ fontSize: '0.55rem', fontWeight: 900, color: isSelected ? 'var(--primary)' : '#94A3B8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <Package size={10} /> {lvl.presentation?.toolDisplay?.split(',')[0] || "Aparatus"}
                                   </div>
                                   <div style={{ fontWeight: isSelected ? 800 : 700, fontSize: '0.85rem', color: isSelected ? 'var(--primary)' : '#334155' }}>
                                      {label.split(': ')[1]?.split(' / ')[0] || label}
                                   </div>
                                   {label.includes(' / ') && (
                                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: isSelected ? 'var(--primary)' : '#94A3B8', fontStyle: 'italic', opacity: 0.8 }}>
                                         {label.split(' / ')[1]}
                                      </div>
                                   )}
                                </div>
                                {hasGuide(lvl) && (
                                  <div style={{ ...styles.guideBadge, backgroundColor: isSelected ? 'var(--primary)' : '#E2E8F0', color: isSelected ? 'white' : '#94A3B8' }}>
                                    <BookMarked size={12} />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Inline Guide Preview */}
            {selectedLevel && hasGuide(selectedLevel) && (
              <div style={{ animation: 'fadeSlideUp 0.3s ease', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowGuide(!showGuide)} style={styles.guideToggle}>
                  <BookMarked size={16} color="#3B82F6" />
                  <span style={{ flex: 1, fontWeight: 700, textAlign: 'left' }}>
                    {showGuide ? 'Sembunyikan Panduan' : 'Lihat Panduan Presentasi'}
                  </span>
                  <ChevronDown size={16} style={{ transform: showGuide ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                </button>
                {showGuide && (
                  <div style={styles.guideContent}>
                    <div style={styles.guideSection}>
                      <div style={styles.guideSectionLabel}>🧰 Alat Peraga</div>
                      <div style={styles.guideSectionText}>{selectedLevel.presentation.tool}</div>
                    </div>
                    <div style={styles.guideSection}>
                      <div style={styles.guideSectionLabel}>📋 Langkah Presentasi</div>
                      {(() => {
                        let stepCounter = 0;
                        return selectedLevel.presentation.steps.map((s, i) => {
                          const isHeader = typeof s === 'string' && (s.startsWith('I.') || s.startsWith('--') || s.startsWith('II.') || s.startsWith('III.') || s.startsWith('IV.'));
                          
                          if (isHeader) {
                            return (
                              <div key={i} style={{ 
                                backgroundColor: '#F0F9FF', 
                                padding: '8px 12px', 
                                borderRadius: '10px', 
                                border: '1px solid #BAE6FD', 
                                margin: '14px 0 8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}>
                                <div style={{ width: '4px', height: '16px', backgroundColor: '#3B82F6', borderRadius: '2px' }} />
                                <div style={{ color: '#0369A1', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  {s.replace(/---/g, '').replace(/^[IVX]+\.\s*/, '').trim()}
                                </div>
                              </div>
                            );
                          }

                          stepCounter++;
                          return (
                            <div key={i} style={styles.guideStep}>
                              <div style={styles.guideStepNum}>{stepCounter}</div>
                              <div style={styles.guideStepText}>{s.replace(/^\d+\.\s*/, '')}</div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                    <div style={{ ...styles.guideSection, borderTop: '1px solid #FEE2E2', paddingTop: '12px' }}>
                      <div style={{ ...styles.guideSectionLabel, color: '#EF4444' }}>⚠️ Kontrol Kesalahan</div>
                      <div style={{ ...styles.guideSectionText, color: '#6B7280' }}>{selectedLevel.presentation.error}</div>
                    </div>
                    {selectedLevel.presentation.videoUrl && (
                      <a href={selectedLevel.presentation.videoUrl} target="_blank" rel="noopener noreferrer" style={styles.videoBtn}>
                        <Play size={16} /> Tonton Video Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ━━━ STEP 3: PENILAIAN SENTRA ━━━ */}
        {step === 3 && (
          <div style={styles.stepContent}>
            <div style={styles.sectionTitle}>
              <Eye size={18} color="var(--primary)" />
              <span>Bagaimana perkembangan anak?</span>
            </div>

            {/* Three-Period Lesson Maturity */}
            <div style={styles.assessCard}>
              <div style={styles.assessLabel}>
                <Sparkles size={14} color="#8B5CF6" />
                <span>Tingkat Kematangan (Three-Period Lesson)</span>
              </div>
              <div style={styles.maturityGrid}>
                {MATURITY_META.map(m => {
                  const isSelected = maturity === m.level;
                  return (
                    <button key={m.level} type="button" onClick={() => {
                      setMaturity(m.level);
                      if (m.level === 'M') setIsRestored(true);
                    }} style={{
                      ...styles.maturityCard,
                      borderColor: isSelected ? m.color : '#E2E8F0',
                      backgroundColor: isSelected ? m.bg : 'white',
                      boxShadow: isSelected ? `0 4px 16px ${m.color}25` : 'none',
                    }}>
                      <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{m.emoji}</span>
                      <span style={{ fontWeight: 950, fontSize: '0.9rem', color: isSelected ? m.color : '#1E293B', marginBottom: '2px' }}>{m.level}</span>
                      <span style={{ fontSize: '0.6rem', color: isSelected ? m.color : '#64748B', lineHeight: 1.2, fontWeight: 700, textAlign: 'center' }}>{m.guide}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Focus / Concentration */}
            <div style={styles.assessCard}>
              <div style={styles.assessLabel}>
                <Zap size={14} color="#F59E0B" />
                <span>Tingkat Konsentrasi</span>
              </div>
              <div style={styles.focusRow}>
                {FOCUS_LEVELS.map(f => {
                  const isSelected = focusLevel === f.value;
                  return (
                    <button key={f.value} type="button" onClick={() => setFocusLevel(f.value)} style={{
                      ...styles.focusBtn,
                      height: 'auto', padding: '12px 8px',
                      borderColor: isSelected ? f.color : '#E2E8F0',
                      backgroundColor: isSelected ? f.color + '15' : 'white',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    }}>
                      <span style={{ fontSize: '1.6rem', marginBottom: '4px' }}>{f.emoji}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 900, color: isSelected ? f.color : '#64748B', marginBottom: '2px' }}>{f.label}</span>
                      <span style={{ fontSize: '0.55rem', fontWeight: 700, color: isSelected ? f.color : '#94A3B8', textAlign: 'center', lineHeight: 1.2 }}>{f.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Social Context (Crucial for 6-9) */}
            <div style={styles.assessCard}>
              <div style={styles.assessLabel}>
                <Users size={14} color="#8B5CF6" />
                <span>Konteks Sosial (Second Plane)</span>
              </div>
              <div style={styles.indepRow}>
                {SOCIAL_META.map(soc => {
                  const isSelected = socialContext === soc.level;
                  return (
                    <button key={soc.level} type="button" onClick={() => setSocialContext(soc.level)} style={{
                      ...styles.indepBtn,
                      borderColor: isSelected ? soc.color : '#E2E8F0',
                      backgroundColor: isSelected ? soc.bg : 'white',
                      boxShadow: isSelected ? `0 3px 12px ${soc.color}25` : 'none',
                    }}>
                      <span style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{soc.emoji}</span>
                      <span style={{ fontWeight: 900, fontSize: '0.8rem', color: isSelected ? soc.color : '#64748B', marginBottom: '2px' }}>{soc.level}</span>
                      <span style={{ fontSize: '0.55rem', fontWeight: 700, color: isSelected ? soc.color : '#94A3B8', textAlign: 'center' }}>{soc.guide}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PILLAR 4 & 5: MOOD & RESTORASI */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={styles.assessCard}>
                <div style={styles.assessLabel}>
                  <Heart size={14} color="#EF4444" />
                  <span>Emosi (Mood)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { v: 'Tenang', e: <Zap size={16}/>, c: '#3B82F6', g: 'Hati tenang' },
                    { v: 'Ceria', e: <Sparkles size={16}/>, c: '#F59E0B', g: 'Senang' },
                    { v: 'Frustrasi', e: <AlertCircle size={16}/>, c: '#EF4444', g: 'Lelah' }
                  ].map(m => {
                    const isSelected = mood === m.v;
                    return (
                      <button key={m.v} type="button" onClick={() => setMood(m.v)} style={{
                        padding: '10px 4px', borderRadius: '14px', border: '2px solid',
                        borderColor: isSelected ? m.c : '#E2E8F0',
                        backgroundColor: isSelected ? m.c + '10' : 'white',
                        color: isSelected ? m.c : '#64748B',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer', transition: 'all 0.2s'
                      }}>
                        {m.e}
                        <div style={{fontSize:'0.6rem', fontWeight:900}}>{m.v}</div>
                        <div style={{fontSize:'0.5rem', fontWeight:700, opacity:0.7}}>{m.g}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={styles.assessCard}>
                <div style={styles.assessLabel}>
                  <Repeat size={14} color="#10B981" />
                  <span>Siklus Kerja (Restorasi)</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsRestored(!isRestored)}
                  style={{
                    ...styles.restorationBtn,
                    backgroundColor: isRestored ? '#ECFDF5' : '#FEF2F2',
                    borderColor: isRestored ? '#10B981' : '#EF4444',
                    color: isRestored ? '#059669' : '#DC2626',
                    flexDirection: 'column', height: 'auto', padding: '10px'
                  }}
                >
                  <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:4}}>
                     <div style={{ ...styles.restorationCheck, backgroundColor: isRestored ? '#10B981' : '#EF4444' }}>
                      {isRestored ? <Check size={14} color="white" /> : <X size={14} color="white" />}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{isRestored ? 'Restored' : 'Incomplete'}</div>
                  </div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.8 }}>{isRestored ? 'Alat tuntas dirapikan.' : 'Belum selesai merapikan.'}</div>
                </button>
              </div>
            </div>

            {/* Duration & Repetition */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={styles.assessCard}>
                <div style={styles.assessLabel}>
                  <Clock size={14} color="#3B82F6" />
                  <span>Durasi Fokus</span>
                </div>
                <div style={styles.durationGrid}>
                  {QUICK_DURATIONS.map(d => (
                    <button key={d} type="button" onClick={() => setDuration(d)} style={{
                      ...styles.durationBtn,
                      borderColor: duration === d ? '#3B82F6' : '#E2E8F0',
                      backgroundColor: duration === d ? '#EFF6FF' : 'white',
                      color: duration === d ? '#3B82F6' : '#64748B',
                      fontWeight: duration === d ? 800 : 500,
                    }}>
                      {d}'
                    </button>
                  ))}
                </div>
              </div>
              <div style={styles.assessCard}>
                <div style={styles.assessLabel}>
                  <Repeat size={14} color="#8B5CF6" />
                  <span>Pengulangan</span>
                </div>
                <div style={styles.repControl}>
                  <button type="button" onClick={() => setRepetition(Math.max(1, repetition - 1))} style={styles.repBtn}>−</button>
                  <div style={styles.repValue}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#8B5CF6' }}>{repetition}</span>
                    <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>kali</span>
                  </div>
                  <button type="button" onClick={() => setRepetition(repetition + 1)} style={styles.repBtn}>+</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ━━━ STEP 4: CATATAN NARATIF ━━━ */}
        {step === 4 && (
          <div style={styles.stepContent}>
            <div style={styles.sectionTitle}>
              <MessageSquare size={18} color="var(--primary)" />
              <span>Catatan Observasi</span>
            </div>

            {/* Summary card */}
            <div style={styles.summaryCard}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Area</span>
                <span style={styles.summaryValue}>{selectedArea?.name}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Material</span>
                <span style={styles.summaryValue}>{getLevelShort(selectedLevel)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Kematangan</span>
                <span style={styles.summaryValue}>{MATURITY_META.find(m => m.level === maturity)?.emoji} {MATURITY_META.find(m => m.level === maturity)?.title}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Konsentrasi</span>
                <span style={styles.summaryValue}>{FOCUS_LEVELS[focusLevel - 1]?.emoji} {FOCUS_LEVELS[focusLevel - 1]?.label} · {duration} mnt</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Konteks Sosial</span>
                <span style={styles.summaryValue}>{SOCIAL_META.find(s => s.level === socialContext)?.emoji} {socialContext}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Restorasi</span>
                <span style={{ ...styles.summaryValue, color: isRestored ? '#059669' : '#DC2626' }}>{isRestored ? '✅ Cycle Complete' : '❌ Incomplete'}</span>
              </div>
            </div>

            <textarea
              placeholder={`Tuliskan catatan observasi detail...\n\nContoh:\n• Ahmad memilih Golden Beads secara mandiri\n• Fokus 25 menit tanpa gangguan\n• Mulai memahami konsep pertukaran (exchange)\n• Mengulangi aktivitas 3 kali berturut-turut`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={styles.textarea}
            />
          </div>
        )}
      </div>

      {/* BOTTOM ACTION BAR */}
      <div style={styles.bottomBar}>
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} style={styles.prevBtn}>
            <ChevronLeft size={18} />
            <span>Kembali</span>
          </button>
        )}
        <div style={{ flex: 1 }} />
        {step < totalSteps ? (
          <button
            type="button"
            disabled={!canGoNext()}
            onClick={() => setStep(step + 1)}
            style={{ ...styles.nextBtn, opacity: canGoNext() ? 1 : 0.4 }}
          >
            <span>Lanjut</span>
            <ChevronRight size={18} />
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            style={styles.saveBtn}
          >
            {loading ? (
              <span>Menyimpan...</span>
            ) : (
              <>
                <Save size={18} />
                <span>Simpan Observasi</span>
              </>
            )}
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes successPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}

// ========== STYLES ==========
const styles = {
  wrapper: {
    display: 'flex', flexDirection: 'column', height: '100vh', height: '100dvh',
    backgroundColor: '#F8FAFC', overflow: 'hidden', maxWidth: '600px', margin: '0 auto',
    position: 'relative',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
    backgroundColor: 'white', borderBottom: '1px solid #F1F5F9',
    position: 'sticky', top: 0, zIndex: 100,
  },
  backBtn: {
    background: 'none', border: 'none', padding: '8px', cursor: 'pointer',
    borderRadius: '10px', display: 'flex', color: '#64748B',
  },
  headerCenter: { flex: 1, minWidth: 0 },
  headerTitle: { fontWeight: 900, fontSize: '1rem', color: '#0F172A' },
  headerStudent: { fontSize: '0.75rem', color: '#64748B', fontWeight: 600 },
  stepBadge: {
    backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800,
    fontSize: '0.75rem', padding: '4px 12px', borderRadius: '20px',
  },
  progressBar: {
    height: '3px', backgroundColor: '#E2E8F0', position: 'relative',
  },
  progressFill: {
    height: '100%', backgroundColor: 'var(--primary)', borderRadius: '0 3px 3px 0',
    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  stepLabels: {
    display: 'flex', justifyContent: 'space-between', padding: '12px 24px 8px',
    backgroundColor: 'white', borderBottom: '1px solid #F1F5F9',
  },
  stepLabel: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    transition: 'all 0.3s',
  },
  stepDot: {
    width: '22px', height: '22px', borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem',
    fontWeight: 800, color: 'white', transition: 'all 0.3s',
  },
  content: {
    flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: '100px',
    WebkitOverflowScrolling: 'touch',
  },
  stepContent: {
    display: 'flex', flexDirection: 'column', gap: '16px',
    animation: 'fadeSlideUp 0.3s ease',
  },
  sectionTitle: {
    display: 'flex', alignItems: 'center', gap: '8px',
    fontWeight: 900, fontSize: '1rem', color: '#0F172A', marginBottom: '4px',
  },
  roomTab: {
    padding: '8px 16px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800,
    border: '1px solid', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
  },
  studentCard: {
    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px',
    borderRadius: '16px', border: '2px solid', cursor: 'pointer',
    transition: 'all 0.2s ease', outline: 'none', background: 'none',
  },
  studentAvatar: {
    width: '36px', height: '36px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 900, fontSize: '0.9rem', flexShrink: 0,
  },
  restorationBtn: {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
    borderRadius: '16px', border: '2px solid', cursor: 'pointer', transition: 'all 0.2s',
  },
  restorationCheck: {
    width: '24px', height: '24px', borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },

  // Area grid
  areaGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px',
  },
  areaCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
    padding: '16px 8px', borderRadius: '16px', border: '2px solid',
    cursor: 'pointer', transition: 'all 0.2s ease', outline: 'none',
    background: 'none',
  },
  areaIconWrap: {
    width: '44px', height: '44px', borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s',
  },

  // Sub-area
  subLabel: {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase',
    marginBottom: '10px', letterSpacing: '0.03em',
  },
  subGrid: {
    display: 'flex', flexWrap: 'wrap', gap: '8px',
  },
  subPill: {
    padding: '10px 16px', borderRadius: '12px', fontSize: '0.8rem',
    fontWeight: 600, border: '1.5px solid', cursor: 'pointer',
    transition: 'all 0.2s ease', outline: 'none', background: 'none',
  },

  // Level groups
  breadcrumb: {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600,
    padding: '8px 12px', backgroundColor: '#F8FAFC', borderRadius: '8px',
  },
  groupCard: {
    borderRadius: '16px', overflow: 'hidden',
    border: '1px solid #E2E8F0', backgroundColor: 'white',
  },
  groupHeader: {
    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
    padding: '14px 16px', background: 'none', border: 'none',
    borderBottom: '1px solid #F1F5F9', cursor: 'pointer', outline: 'none',
    color: '#334155',
  },
  groupDot: {
    width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
  },
  groupItems: {
    padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px',
    animation: 'fadeSlideUp 0.2s ease',
  },
  levelItem: {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
    borderRadius: '12px', border: '1.5px solid', cursor: 'pointer',
    transition: 'all 0.15s ease', outline: 'none', width: '100%',
    background: 'none',
  },
  levelRadio: {
    width: '20px', height: '20px', borderRadius: '50%', border: '2px solid',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, transition: 'all 0.15s',
  },
  levelRadioInner: {
    width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white',
  },
  guideBadge: {
    width: '28px', height: '28px', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, transition: 'all 0.15s',
  },

  // Guide
  guideToggle: {
    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
    padding: '14px 16px', borderRadius: '14px', backgroundColor: '#EFF6FF',
    border: '1.5px solid #BFDBFE', cursor: 'pointer', outline: 'none',
    color: '#1E40AF', fontSize: '0.85rem',
  },
  guideContent: {
    padding: '16px', borderRadius: '0 0 14px 14px', backgroundColor: 'white',
    border: '1px solid #E2E8F0', borderTop: 'none',
    display: 'flex', flexDirection: 'column', gap: '14px',
    animation: 'fadeSlideUp 0.2s ease',
  },
  guideSection: { },
  guideSectionLabel: {
    fontSize: '0.7rem', fontWeight: 800, color: '#3B82F6',
    textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.03em',
  },
  guideSectionText: { fontSize: '0.85rem', fontWeight: 600, color: '#334155', lineHeight: 1.5 },
  guideStep: {
    display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start',
  },
  guideStepNum: {
    width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#3B82F6',
    color: 'white', fontSize: '0.7rem', fontWeight: 800, display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px',
  },
  guideStepText: { fontSize: '0.82rem', fontWeight: 500, color: '#334155', lineHeight: 1.5 },
  videoBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    backgroundColor: '#DC2626', color: 'white', padding: '12px', borderRadius: '12px',
    textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem',
  },

  // Assessment cards
  assessCard: {
    backgroundColor: 'white', borderRadius: '16px', padding: '16px',
    border: '1px solid #E2E8F0',
  },
  assessLabel: {
    display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem',
    fontWeight: 800, color: '#334155', marginBottom: '14px', textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  maturityGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px',
  },
  maturityCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    padding: '14px 8px', borderRadius: '14px', border: '2px solid',
    cursor: 'pointer', transition: 'all 0.2s ease', outline: 'none',
    background: 'none', textAlign: 'center',
  },
  focusRow: {
    display: 'flex', gap: '6px', justifyContent: 'space-between',
  },
  focusBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    padding: '10px 6px', borderRadius: '14px', border: '2px solid',
    cursor: 'pointer', transition: 'all 0.2s ease', outline: 'none',
    flex: 1, background: 'none',
  },
  indepRow: {
    display: 'flex', gap: '8px',
  },
  indepBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
    padding: '14px 8px', borderRadius: '14px', border: '2px solid',
    cursor: 'pointer', transition: 'all 0.2s ease', outline: 'none',
    flex: 1, background: 'none',
  },
  durationGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px',
  },
  durationBtn: {
    padding: '10px', borderRadius: '10px', border: '1.5px solid',
    cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
    transition: 'all 0.15s', outline: 'none', background: 'none',
    textAlign: 'center',
  },
  repControl: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
    padding: '8px 0',
  },
  repBtn: {
    width: '40px', height: '40px', borderRadius: '12px',
    border: '1.5px solid #E2E8F0', backgroundColor: 'white',
    fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#64748B', outline: 'none',
  },
  repValue: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },

  // Summary & Notes
  summaryCard: {
    backgroundColor: 'white', borderRadius: '16px', padding: '16px',
    border: '1px solid #E2E8F0',
  },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 0', borderBottom: '1px solid #F8FAFC',
  },
  summaryLabel: { fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 },
  summaryValue: { fontSize: '0.82rem', color: '#0F172A', fontWeight: 700, textAlign: 'right', maxWidth: '60%' },
  textarea: {
    width: '100%', minHeight: '180px', padding: '16px', borderRadius: '16px',
    border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.9rem',
    fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6,
    backgroundColor: 'white', color: '#334155',
    boxSizing: 'border-box',
  },

  // Bottom bar
  bottomBar: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px 16px', backgroundColor: 'white',
    borderTop: '1px solid #F1F5F9',
    position: 'sticky', bottom: 0, zIndex: 100,
    paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
  },
  prevBtn: {
    display: 'flex', alignItems: 'center', gap: '4px', padding: '12px 16px',
    borderRadius: '12px', border: '1.5px solid #E2E8F0', backgroundColor: 'white',
    fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', color: '#64748B',
    outline: 'none',
  },
  nextBtn: {
    display: 'flex', alignItems: 'center', gap: '4px', padding: '12px 28px',
    borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary)',
    color: 'white', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.35)', outline: 'none',
    transition: 'all 0.2s',
  },
  saveBtn: {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px',
    borderRadius: '12px', border: 'none', backgroundColor: '#10B981',
    color: 'white', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)', outline: 'none',
  },

  // Success
  successPage: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', minHeight: '100dvh', padding: '24px',
    backgroundColor: '#F0FDF4',
  },
  successCard: {
    textAlign: 'center', padding: '40px 28px', backgroundColor: 'white',
    borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
    maxWidth: '380px', width: '100%', animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  successIcon: {
    width: '80px', height: '80px', borderRadius: '50%',
    backgroundColor: '#DCFCE7', color: '#10B981',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px', animation: 'successPulse 2s ease infinite',
  },
  successSummary: {
    marginTop: '16px', padding: '16px', borderRadius: '14px',
    backgroundColor: '#F8FAFC', fontSize: '0.9rem', fontWeight: 600,
  },
};
