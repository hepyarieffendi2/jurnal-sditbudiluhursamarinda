import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, ChevronRight, Sparkles, 
  Target, Info, BookOpen, Layers, Milestone,
  CheckCircle2, Clock, MapPin, Search, Filter, Heart,
  Sprout, Gem, Globe, Palette,
  VolumeX, Footprints, Handshake, Archive, Hourglass, Wind,
  MessageSquareOff, Ear, Package, LayoutGrid, Eye,
  Video, Zap, Activity, ShieldCheck, MessageSquare, AlertCircle, X, Loader2
} from 'lucide-react';
import { db } from '../firebase-config';
import { collection, query, where, getDocs, doc, getDoc, setDoc, onSnapshot, limit } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { AREA_SENTRA_CYCLE2 } from '../data/areaSentraCycle2';

const TERMS = [
  { id: 1, name: 'Term 1', label: 'Orientasi & Pondasi', icon: Sprout, color: '#10B981', description: 'Fokus pada kemandirian, keteraturan, dan koordinasi dasar.' },
  { id: 2, name: 'Term 2', label: 'Simbol & Abstraksi', icon: Gem, color: '#6366F1', description: 'Mulai masuk ke pengenalan simbol angka dan bunyi huruf.' },
  { id: 3, name: 'Term 3', label: 'Eksplorasi Kosmik', icon: Globe, color: '#0EA5E9', description: 'Menjelajah asal-usul semesta, geografi, dan operasi matematika.' },
  { id: 4, name: 'Term 4', label: 'Ekspresi & Refleksi', icon: Palette, color: '#F43F5E', description: 'Pengayaan bahasa, seni, dan pemahaman mendalam tentang alam.' }
];

const NORMALIZATION_ITEMS = [
  // --- TIER 1: PHYSICAL & ENVIRONMENT ---
  { 
    id: 'walking', 
    icon: Footprints, 
    color: '#10B981', 
    label: 'Adab Berjalan di Dalam Kelas', 
    desc: 'Walking in the Classroom',
    timing: 'Transisi Sesi',
    guidance: 'Pondasi keselamatan. Dilakukan saat anak berpindah dari Circle Time ke rak materi.'
  },
  { 
    id: 'restoring', 
    icon: LayoutGrid, 
    color: '#06B6D4', 
    label: 'Merapikan Karpet & Kursi', 
    desc: 'Restoring Workspace & Chair',
    timing: 'Selesai Kerja',
    guidance: 'Pondasi keteraturan. Karpet digulung rapi dan kursi didorong masuk agar jalur tetap aman.'
  },
  { 
    id: 'carrying', 
    icon: Package, 
    color: '#F43F5E', 
    label: 'Adab Membawa & Menyimpan Alat', 
    desc: 'Carrying & Returning Materials',
    timing: 'Waktu Kerja',
    guidance: 'Pondasi tanggung jawab. Cara memegang nampan dengan dua tangan dan meletakkan kembali dengan presisi.'
  },

  // --- TIER 2: COMMUNICATION & FOCUS ---
  { 
    id: 'voice', 
    icon: VolumeX, 
    color: '#6366F1', 
    label: 'Volume Bicara & Silence Game', 
    desc: 'Voice Volume & Silence Game',
    timing: 'Awal & Akhir',
    guidance: 'Kalibrasi ketenangan di awal dan refleksi kesyukuran di akhir sesi.'
  },
  { 
    id: 'listening', 
    icon: Ear, 
    color: '#8B5CF6', 
    label: 'Mendengar & Memperhatikan', 
    desc: 'Active Listening',
    timing: 'Circle Time',
    guidance: 'Adab majelis saat guru memberikan presentasi atau instruksi klasikal.'
  },
  { 
    id: 'watching', 
    icon: Eye, 
    color: '#F59E0B', 
    label: 'Adab Menonton Teman Bekerja', 
    desc: 'Watching a Friend Work',
    timing: 'Waktu Kerja',
    guidance: 'Mengamati tanpa menyentuh alat atau menginterupsi proses kerja teman.'
  },

  // --- TIER 3: SOCIAL & HARMONY ---
  { 
    id: 'waiting', 
    icon: Hourglass, 
    color: '#0EA5E9', 
    label: 'Adab Menunggu Giliran', 
    desc: 'Waiting for a Turn',
    timing: 'Waktu Kerja',
    guidance: 'Dipraktikkan saat anak ingin menggunakan alat yang sedang dipakai teman.'
  },
  { 
    id: 'interrupt', 
    icon: MessageSquareOff, 
    color: '#EC4899', 
    label: 'Interupsi & Memotong Pembicaraan', 
    desc: 'Interrupting Courteously',
    timing: 'Presentasi',
    guidance: 'Cara mendekati guru saat guru sedang memberikan presentasi pada anak lain.'
  },
  { 
    id: 'apology', 
    icon: Handshake, 
    color: '#D946EF', 
    label: 'Meminta Maaf & Tabayyun', 
    desc: 'Apology & Conflict Resolution',
    timing: 'Situasional',
    guidance: 'Puncak kecerdasan sosial. Gunakan Peace Rose saat terjadi konflik atau perbedaan pendapat.'
  }
];

const WEEKS_PER_TERM = 10;

export default function CurriculumTimeline() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTerm, setActiveTerm] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  
  // 🔄 Firebase States
  const [normalizationStatus, setNormalizationStatus] = useState({});
  const [progressMap, setProgressMap] = useState({});
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeRoom, setActiveRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showGuide, setShowGuide] = useState(null);

  const getYTThumbnail = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`;
    }
    return null;
  };

  // 🔍 LOOKUP FUNCTION: Maps label to full level object from database
  const lookupFullLevel = (label) => {
    let result = null;
    if (!label) return null;
    
    const searchLabel = label.toLowerCase().trim();
    
    // Exact match first
    AREA_SENTRA_CYCLE2.forEach(area => {
      area.subAreas.forEach(sub => {
        sub.levels.forEach(lvl => {
          const lvlLabel = typeof lvl === 'object' ? lvl.label : lvl;
          if (lvlLabel === label) {
            result = { 
              ...lvl, 
              areaColor: area.color, 
              areaName: area.name,
              subAreaName: sub.name
            };
          }
        });
      });
    });
    
    if (result) return result;

    // Fuzzy match if no exact match
    AREA_SENTRA_CYCLE2.forEach(area => {
      area.subAreas.forEach(sub => {
        sub.levels.forEach(lvl => {
          const lvlLabel = typeof lvl === 'object' ? lvl.label : lvl;
          if (lvlLabel && (
            lvlLabel.toLowerCase().includes(searchLabel) || 
            searchLabel.includes(lvlLabel.toLowerCase())
          )) {
            result = { 
              ...lvl, 
              areaColor: area.color, 
              areaName: area.name,
              subAreaName: sub.name
            };
          }
        });
      });
    });
    
    return result;
  };

  // 📡 Step 1: Identify Active Room & Fetch Class Size
  useEffect(() => {
    if (!user) return;
    
    const findRoom = async () => {
      // Logic: Find which room this teacher belongs to by checking first student
      const q = query(collection(db, 'students'), where('status', '==', 'active'), limit(50));
      const snap = await getDocs(q);
      const students = snap.docs.map(d => d.data());
      
      // Heuristic: If teacher's name matches a student's guru, that's the room
      const myStudents = students.filter(s => s.guru === user.displayName);
      if (myStudents.length > 0) {
        const room = myStudents[0].rombel;
        setActiveRoom(room);
        setTotalStudents(myStudents.length);
      }
    };
    findRoom();
  }, [user]);

  // 📡 Step 2: Sync Normalization Checklist
  useEffect(() => {
    if (!activeRoom) return;
    const docRef = doc(db, 'class_status', activeRoom);
    
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setNormalizationStatus(docSnap.data().normalization || {});
      }
    });
    return () => unsub();
  }, [activeRoom]);

  // 📡 Step 3: Fetch Live Progress (Student Counts)
  useEffect(() => {
    if (!activeRoom) return;
    
    const fetchProgress = async () => {
      // Fetch all activity journals for this class
      // Note: In a real production app, we might want to index this better
      const q = query(collection(db, 'jurnal_aktivitas'));
      const snap = await getDocs(q);
      
      const counts = {};
      snap.docs.forEach(d => {
        const data = d.data();
        // Only count if student is in this room
        // Simplified: Count unique students per pencapaian
        const key = data.pencapaian;
        if (!counts[key]) counts[key] = new Set();
        counts[key].add(data.murid);
      });

      const finalMap = {};
      Object.keys(counts).forEach(k => {
        finalMap[k] = counts[k].size;
      });
      setProgressMap(finalMap);
      setLoading(false);
    };
    fetchProgress();
  }, [activeRoom]);

  const handleToggleNormalization = async (id) => {
    if (!activeRoom) return;
    const newStatus = { ...normalizationStatus, [id]: !normalizationStatus[id] };
    setNormalizationStatus(newStatus);
    
    await setDoc(doc(db, 'class_status', activeRoom), {
      normalization: newStatus,
      updatedAt: new Date(),
      updatedBy: user.displayName
    }, { merge: true });
  };

  // 🧠 Logic: Filter all K1 lessons and distribute them across 40 weeks
  const k1Lessons = useMemo(() => {
    const lessons = [];
    AREA_SENTRA_CYCLE2.forEach(area => {
      area.subAreas.forEach(sub => {
        sub.levels.forEach(level => {
          const label = typeof level === 'object' ? level.label : level;
          if (label.startsWith('K1:') || label.startsWith('K1-K2:') || label.startsWith('K1-K3:')) {
            
            // 🚀 TRANSITION LOGIC (For late starters/K2)
            let transitionType = 'Normal';
            if (area.id === 'math' || area.id === 'bahasa') {
              // Foundational Montessori materials that MUST be seen even by K2
              if (label.includes('Golden Beads') || label.includes('Sandpaper') || label.includes('Moveable Alphabet') || label.includes('Number Rods')) {
                transitionType = 'Essential';
              } else {
                transitionType = 'Skippable';
              }
            } else if (area.id === 'practical') {
              // Adab and Community are essential for everyone
              if (sub.id === 'adab' || sub.id === 'komunitas') transitionType = 'Essential';
              else transitionType = 'Skippable';
            }

            lessons.push({
              areaId: area.id,
              areaName: area.name,
              areaColor: area.color,
              subAreaName: sub.name,
              label: label,
              cleanLabel: label.split(': ')[1]?.split(' / ')[0] || label,
              priority: sub.id === 'diri' || sub.id === 'lingkungan' || sub.id === 'adab' || sub.id === 'komunitas' ? 'High' : 'Normal',
              transitionType
            });
          }
        });
      });
    });

    // Pedagogical Sort: Practical Life -> Language/Math -> Science/Culture
    const areaOrder = { 'practical': 1, 'bahasa': 2, 'math': 3, 'sosial': 4, 'sains': 5, 'seni': 6 };
    return lessons.sort((a, b) => (areaOrder[a.areaId] || 99) - (areaOrder[b.areaId] || 99));
  }, []);

  // 📅 Distribute lessons to weeks
  const timelineData = useMemo(() => {
    const distribution = {};
    
    // 🏷️ PEDAGOGICAL SHIFT: Reserve Week 1 & 2 for Practical Life (Normalization)
    const practicalLessons = k1Lessons.filter(l => l.areaId === 'practical');
    const otherLessons = k1Lessons.filter(l => l.areaId !== 'practical');

    // We take about 6-8 practical lessons for the first 2 weeks (3 per week)
    const earlyNormalizationPractical = practicalLessons.slice(0, 6);
    const restOfPractical = practicalLessons.slice(6);

    // Re-assemble: Practical (W1-2) -> Academics & Rest of Practical (W3-40)
    const reorderedLessons = [
      ...earlyNormalizationPractical,
      ...otherLessons,
      ...restOfPractical
    ];

    reorderedLessons.forEach((lesson, index) => {
      let week = Math.floor(index / 3) + 1;
      if (week > 40) week = 40;
      if (!distribution[week]) distribution[week] = [];
      distribution[week].push(lesson);
    });

    return distribution;
  }, [k1Lessons]);

  const categories = ['Semua', ...new Set(k1Lessons.map(l => l.areaName))];

  return (
    <div className="timeline-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* 🚀 HEADER SECTION */}
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 950, letterSpacing: '-1px', color: '#1E293B', marginBottom: '8px' }}>
              Timeline <span style={{ color: 'var(--primary)' }}>K1</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Milestone size={18} color="var(--primary)" /> Panduan alur presentasi materi Montessori selama 1 tahun ajaran.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div className="status-badge">
            <Sparkles size={14} /> Kurikulum Transisi v2.0
          </div>
          <button 
            onClick={() => setShowSchedule(!showSchedule)}
            className={`schedule-toggle-btn ${showSchedule ? 'active' : ''}`}
          >
            <Clock size={16} /> {showSchedule ? 'Tutup Jadwal' : 'Lihat Jadwal Harian'}
          </button>
        </div>
      </header>

      {/* 📅 JADWAL HARIAN (CONDITIONAL SECTION) */}
      {showSchedule && (
        <div className="daily-schedule-panel">
          <div className="schedule-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={20} color="var(--primary)" />
              <h3 style={{ margin: 0, fontWeight: 900 }}>Rekomendasi Jadwal Harian: Fase Total Normalization</h3>
            </div>
            <div className="phase-pill">2 Minggu Pertama</div>
          </div>
          
          <div className="schedule-grid">
            <div className="schedule-slot">
              <div className="slot-time">07:15 - 08:00</div>
              <div className="slot-content">
                <div className="slot-title">Morning Circle & Greeting</div>
                <div className="slot-adab">Fokus: Adab Mendengar, Greeting, Cek Kesiapan Diri</div>
              </div>
            </div>
            <div className="schedule-slot highlight">
              <div className="slot-time">08:00 - 08:15</div>
              <div className="slot-content">
                <div className="slot-title">Normalization Focus 1</div>
                <div className="slot-adab">Silence Game & Adab Berjalan (Latihan Kolektif)</div>
              </div>
            </div>
            <div className="schedule-slot">
              <div className="slot-time">08:15 - 10:15</div>
              <div className="slot-content">
                <div className="slot-title">Main Work Cycle (Practical Life Only)</div>
                <div className="slot-adab">Presentasi: Membawa Alat, Merapikan Karpet, Menonton Teman</div>
              </div>
            </div>
            <div className="schedule-slot">
              <div className="slot-time">10:15 - 10:45</div>
              <div className="slot-content">
                <div className="slot-title">Snack Time & Cleanup</div>
                <div className="slot-adab">Fokus: Adab Makan & Membersihkan Bekas Makan Sendiri</div>
              </div>
            </div>
            <div className="schedule-slot highlight">
              <div className="slot-time">10:45 - 11:15</div>
              <div className="slot-content">
                <div className="slot-title">Normalization Focus 2</div>
                <div className="slot-adab">Walking on the Line / Gross Motor Control</div>
              </div>
            </div>
            <div className="schedule-slot">
              <div className="slot-time">11:15 - 11:45</div>
              <div className="slot-content">
                <div className="slot-title">Closing Circle & Reflection</div>
                <div className="slot-adab">Silence Game (Refleksi) & Adab Dismissal (Izin Pulang)</div>
              </div>
            </div>
          </div>
          
          <div className="schedule-footer">
            <Info size={14} /> <span><b>Catatan Pedagogis:</b> Kurangi instruksi verbal yang panjang. Gunakan bahasa tubuh dan modeling untuk mengajarkan 9 Pondasi Ketenangan.</span>
          </div>
        </div>
      )}

      {/* 🧘 PONDASI KETENANGAN (NORMALIZATION CHECKLIST) */}
      <div className="normalization-section" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="foundation-icon"><Heart size={20} color="var(--primary)" /></div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 950, color: '#1E293B' }}>Pondasi Ketenangan & Adab Dasar</h2>
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748B', background: '#F1F5F9', padding: '6px 14px', borderRadius: '100px' }}>
                  Status: Masa Transisi
              </div>
          </div>
          <div className="normalization-grid">
              {NORMALIZATION_ITEMS.map((item, idx) => (
                <div key={idx} className="norm-item-wrapper">
                  <button 
                      className={`norm-item ${normalizationStatus[item.id] ? 'checked' : ''}`}
                      onClick={() => handleToggleNormalization(item.id)}
                  >
                      <div className="norm-icon-box" style={{ backgroundColor: normalizationStatus[item.id] ? 'white' : `${item.color}15` }}>
                          <item.icon size={18} color={normalizationStatus[item.id] ? item.color : item.color} />
                      </div>
                      
                      <div className="norm-content">
                          <div className="norm-top-row">
                            <span className="norm-label">{item.label}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const fullData = lookupFullLevel(item.label);
                                  if (fullData) {
                                    setShowGuide(fullData);
                                  } else {
                                    alert(`Panduan untuk "${item.label}" sedang dalam penyusunan.`);
                                  }
                                }}
                                className="guide-btn-mini"
                                title="Lihat Panduan Pedagogis"
                              >
                                <Eye size={12} />
                              </button>
                              <span className="timing-badge">
                                {item.timing}
                              </span>
                            </div>
                          </div>
                          <span className="norm-desc">{item.desc}</span>
                      </div>

                      <div className="norm-check-wrapper">
                        {normalizationStatus[item.id] ? (
                          <div className="check-active"><CheckCircle2 size={18} /></div>
                        ) : (
                          <div className="check-empty" />
                        )}
                      </div>
                  </button>
                  <div className="guidance-tooltip">
                    <Sparkles size={12} style={{ marginBottom: '4px', display: 'block' }} />
                    {item.guidance}
                  </div>
                </div>
              ))}
          </div>
      </div>

      {/* 🏆 TERM NAVIGATOR */}
      <div className="term-tabs">
        {TERMS.map(term => (
          <button 
            key={term.id} 
            onClick={() => setActiveTerm(term.id)}
            className={`term-card ${activeTerm === term.id ? 'active' : ''}`}
          >
            <div className="term-icon">
                <term.icon size={24} color={activeTerm === term.id ? 'white' : '#64748B'} />
            </div>
            <div className="term-info">
              <span className="term-name">{term.name}</span>
              <span className="term-label">{term.label}</span>
            </div>
            {activeTerm === term.id && <div className="active-dot" />}
          </button>
        ))}
      </div>

      {/* 🧩 DESCRIPTION CARD */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <div className="description-card" style={{ flex: 1 }}>
            <Info size={24} color="var(--primary)" />
            <p>{TERMS.find(t => t.id === activeTerm).description}</p>
          </div>
          <div className="legend-card">
              <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', color: '#64748B' }}>Indikator Transisi</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="legend-item"><span className="badge essential">WAJIB</span> <span style={{fontSize: '0.75rem'}}>Pondasi Montessori</span></div>
                  <div className="legend-item"><span className="badge skippable">JEMBATAN</span> <span style={{fontSize: '0.75rem'}}>Bisa dilewati K2 mahir</span></div>
              </div>
          </div>
      </div>


      {/* 🔍 SEARCH & FILTER */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Cari materi spesifik..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="category-scroll">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 📅 WEEKLY TIMELINE */}
      <div className="weeks-grid">
        {Array.from({ length: 10 }).map((_, i) => {
          const weekNum = (activeTerm - 1) * 10 + (i + 1);
          const lessons = (timelineData[weekNum] || []).filter(l => 
            (activeCategory === 'Semua' || l.areaName === activeCategory) &&
            (searchQuery === '' || l.cleanLabel.toLowerCase().includes(searchQuery.toLowerCase()))
          );

          if (lessons.length === 0 && searchQuery !== '') return null;

          return (
            <div key={weekNum} className="week-card">
              <div className="week-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="week-badge">Minggu {weekNum}</div>
                  {(Number(weekNum) === 1 || Number(weekNum) === 2) && (
                    <div className="normalization-badge">
                      <Sparkles size={10} /> Total Normalization
                    </div>
                  )}
                </div>
                <button 
                   onClick={() => navigate('/rencana')}
                   className="plan-btn" title="Masukkan ke Lesson Plan"
                >
                  <Target size={16} />
                </button>
              </div>
              
              <div className="lessons-list">
                {lessons.length > 0 ? lessons.map((lesson, idx) => (
                  <div key={idx} className="lesson-item" style={{ borderLeft: `4px solid ${lesson.areaColor}` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: lesson.areaColor, marginBottom: '2px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{lesson.areaName}</span>
                        {totalStudents > 0 && (
                            <span style={{color: '#94A3B8'}}>{progressMap[lesson.label] || 0}/{totalStudents}</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                        {lesson.cleanLabel}
                      </div>
                      
                      {/* Progres Bar */}
                      {totalStudents > 0 && (
                          <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '100px', overflow: 'hidden' }}>
                              <div style={{ 
                                  height: '100%', 
                                  background: lesson.areaColor, 
                                  width: `${((progressMap[lesson.label] || 0) / totalStudents) * 100}%`,
                                  transition: 'width 1s ease'
                              }} />
                          </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button 
                                onClick={() => {
                                    const fullLevel = lookupFullLevel(lesson.label);
                                    setShowGuide(fullLevel || lesson);
                                }}
                                style={{ 
                                    background: '#F1F5F9', border: 'none', borderRadius: '8px', 
                                    width: '32px', height: '32px', display: 'flex', 
                                    alignItems: 'center', justifyContent: 'center', 
                                    cursor: 'pointer', color: lesson.areaColor 
                                }}
                                title="Lihat Panduan & Video"
                            >
                                <Eye size={16} />
                            </button>
                            {lesson.priority === 'High' && (
                                <span className="priority-tag">Prioritas</span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {lesson.transitionType === 'Essential' && (
                                <span className="badge essential">WAJIB</span>
                            )}
                            {lesson.transitionType === 'Skippable' && (
                                <span className="badge skippable">JEMBATAN</span>
                            )}
                        </div>
                    </div>
                  </div>
                )) : (
                  <div className="empty-week">Tidak ada target baru. Fokus pada pengulangan materi sebelumnya.</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 📘 GUIDE MODAL (SIDE DRAWER STYLE FOR PREMIUM FEEL) */}
      {showGuide && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 20000, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'flex-end' }} onClick={() => setShowGuide(null)}>
             <div 
                style={{ 
                    background: 'white', width: '100%', maxWidth: '500px', height: '100%', 
                    boxShadow: '-10px 0 40px rgba(0,0,0,0.1)', animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden'
                }} 
                onClick={e => e.stopPropagation()}
             >
                    {/* Header */}
                    <div style={{ padding: '32px 40px 24px', borderBottom: '1px solid #F1F5F9', background: `${showGuide.areaColor || '#3B82F6'}05` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <div style={{ background: showGuide.areaColor || '#3B82F6', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 950, letterSpacing: '0.5px' }}>
                                    ALBUM PANDUAN
                                </div>
                                {showGuide.label?.toLowerCase().includes('tpl') && (
                                    <div style={{ background: '#F43F5E', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 950 }}>
                                        WAJIB TPL
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setShowGuide(null)} style={{ background: 'white', border: '1px solid #E2E8F0', width: 36, height: 36, borderRadius: '50%', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={20}/></button>
                        </div>
                        
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 950, color: '#0F172A', lineHeight: 1.2, margin: 0 }}>
                            {showGuide.label?.split(': ')[1]?.split(' / ')[0] || showGuide.label}
                        </h2>
                        {showGuide.label?.includes(' / ') && (
                            <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 700, fontStyle: 'italic', marginTop: 6 }}>
                                {showGuide.label.split(' / ')[1]}
                            </p>
                        )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px 48px' }}>
                        
                        {/* 1. Apparatus */}
                        {(showGuide.presentation?.toolDisplay || showGuide.presentation?.tool || (showGuide.presentation?.toolsList?.length > 0)) && (
                            <div style={{ marginBottom: '32px', padding: '20px', backgroundColor: '#FFFBEB', borderRadius: '20px', border: '1px solid #FEF3C7' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 950, color: '#D97706', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Package size={14} /> Alat / Apparatus (APE)
                                </div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#92400E', lineHeight: '1.6' }}>
                                    {showGuide.presentation.toolDisplay || (showGuide.presentation.toolsList?.join(', ')) || showGuide.presentation.tool}
                                </div>
                            </div>
                        )}

                        {/* 2. Direct Aim */}
                        {showGuide.presentation?.directAim && (
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 950, color: showGuide.areaColor || '#3B82F6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Zap size={14} /> Tujuan Pembelajaran
                                </div>
                                <p style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
                                    {showGuide.presentation.directAim}
                                </p>
                            </div>
                        )}

                        {/* 3. Steps */}
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 950, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Activity size={12} /> Langkah Presentasi AMI
                            </div>
                            
                            {showGuide.presentation?.steps?.length > 0 ? (
                                <div className="modern-steps-container">
                                    {(() => {
                                        let stepCounter = 0;
                                        return showGuide.presentation.steps.map((step, si) => {
                                            const isHeader = typeof step === 'string' && (step.startsWith('I.') || step.startsWith('--') || step.startsWith('II.') || step.startsWith('III.') || step.startsWith('IV.') || step.startsWith('V.'));

                                            if (isHeader) {
                                                return (
                                                    <div key={si} className="modern-step-header" style={{ marginTop: si === 0 ? 0 : 24 }}>
                                                        <div className="modern-header-dot" style={{ backgroundColor: showGuide.areaColor || '#3B82F6' }}></div>
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
                            ) : (
                                <div style={{ padding: '32px 20px', background: '#F8FAFC', borderRadius: '24px', border: '1px dashed #E2E8F0', textAlign: 'center', color: '#94A3B8' }}>
                                    <AlertCircle size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
                                    <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>Belum ada langkah presentasi mendetail.</p>
                                </div>
                            )}
                        </div>

                        {/* 4. Error */}
                        {showGuide.presentation?.error && (
                            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#FEF2F2', borderRadius: '24px', border: '1px solid #FEE2E2' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 950, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ShieldCheck size={14} /> Kontrol Kesalahan
                                </div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#991B1B', lineHeight: '1.5' }}>
                                    {showGuide.presentation.error}
                                </div>
                            </div>
                        )}
                        
                        {/* 5. Video */}
                        {showGuide.presentation?.videoUrl && (
                            <div style={{ marginTop: '32px' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 950, color: '#E11D48', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Video size={14} /> Video Tutorial Tersemat
                                </div>
                                
                                <div 
                                    onClick={() => window.open(showGuide.presentation.videoUrl, '_blank')}
                                    style={{ 
                                        position: 'relative', width: '100%', borderRadius: '24px', 
                                        overflow: 'hidden', cursor: 'pointer', aspectRatio: '16/9',
                                        background: '#0F172A', border: '1px solid #E2E8F0',
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {getYTThumbnail(showGuide.presentation.videoUrl) ? (
                                        <>
                                            <img 
                                                src={getYTThumbnail(showGuide.presentation.videoUrl)} 
                                                alt="Video Thumbnail" 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                                            />
                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                                                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
                                                    <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '16px solid #EF4444', marginLeft: 4 }}></div>
                                                </div>
                                            </div>
                                            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, background: 'rgba(255,255,255,0.95)', padding: '8px 16px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, color: '#0F172A', textAlign: 'center', backdropFilter: 'blur(4px)' }}>
                                                KLIK UNTUK NONTON DI YOUTUBE
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                                            <Video size={48} color="white" opacity={0.5} />
                                            <span style={{ color: 'white', fontWeight: 900, fontSize: '0.8rem' }}>NONTON VIDEO DEMO</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
             </div>
          </div>
      )}

      <style>{`
        .back-btn { background: white; border: 2.5px solid #F1F5F9; border-radius: 16px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; color: #64748B; }
        .back-btn:hover { background: #F8FAFC; border-color: var(--primary); color: var(--primary); transform: translateX(-4px); }
        
        .status-badge { background: #EEF2FF; color: #6366F1; padding: 6px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 900; display: flex; align-items: center; gap: 6px; border: 1px solid #C7D2FE; }
        
        .term-tabs { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .term-card { background: white; border: 2.5px solid #F1F5F9; border-radius: 24px; padding: 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; text-align: left; }
        .term-card.active { border-color: var(--primary); background: var(--primary); transform: translateY(-4px); box-shadow: 0 12px 24px rgba(99, 102, 241, 0.2); }
        .term-card.active .term-name { color: rgba(255,255,255,0.7); }
        .term-card.active .term-label { color: white; }
        .term-icon { background: #F8FAFC; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 14px; transition: all 0.2s; }
        .term-card.active .term-icon { background: rgba(255,255,255,0.2); }
        .term-info { display: flex; flex-direction: column; }
        .term-name { font-size: 0.7rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
        .term-label { font-size: 1.05rem; font-weight: 950; color: #1E293B; }
        .active-dot { position: absolute; bottom: 12px; right: 12px; width: 8px; height: 8px; background: var(--primary); border-radius: 50%; }

        .description-card { background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 20px; padding: 20px; display: flex; align-items: center; gap: 16px; margin-bottom: 32px; color: #475569; font-weight: 700; line-height: 1.5; font-size: 0.95rem; }

        .filter-bar { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
        .search-box { background: white; border: 2.5px solid #F1F5F9; border-radius: 18px; padding: 12px 20px; display: flex; align-items: center; gap: 12px; }
        .search-box input { border: none; background: transparent; outline: none; font-size: 1rem; font-weight: 700; width: 100%; color: #1E293B; }
        .category-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .cat-btn { background: white; border: 2px solid #F1F5F9; padding: 8px 18px; border-radius: 100px; font-size: 0.85rem; font-weight: 800; color: #64748B; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .cat-btn.active { background: var(--primary); border-color: var(--primary); color: white; }

        .weeks-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .week-card { background: white; border: 2px solid #F1F5F9; border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 20px; transition: all 0.2s; }
        .week-card:hover { border-color: #E2E8F0; transform: scale(1.01); }
        .week-header { display: flex; justify-content: space-between; align-items: center; }
        .week-badge { background: #1E293B; color: white; padding: 6px 14px; border-radius: 10px; font-size: 0.75rem; font-weight: 900; letter-spacing: 0.5px; }
        .plan-btn { background: #F1F5F9; border: none; border-radius: 10px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748B; transition: all 0.2s; }
        .plan-btn:hover { background: var(--primary-light); color: var(--primary); }

        .lessons-list { display: flex; flex-direction: column; gap: 12px; }
        .lesson-item { background: #F8FAFC; padding: 12px 16px; border-radius: 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .priority-tag { background: #FFF7ED; color: #C2410C; border: 1px solid #FFEDD5; font-size: 0.6rem; font-weight: 900; text-transform: uppercase; padding: 2px 6px; border-radius: 6px; }
        .badge { font-size: 0.55rem; font-weight: 900; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; display: inline-block; white-space: nowrap; }
        .badge.essential { background: #FEE2E2; color: #DC2626; border: 1px solid #FECACA; }
        .badge.skippable { background: #DCFCE7; color: #16A34A; border: 1px solid #BBF7D0; }
        
        .legend-card { background: white; border: 2.5px solid #F1F5F9; border-radius: 20px; padding: 16px; width: 240px; }
        .legend-item { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #475569; }
        
        .empty-week { font-size: 0.85rem; color: #94A3B8; text-align: center; padding: 20px; border: 1px dashed #E2E8F0; border-radius: 14px; font-style: italic; font-weight: 600; }
        .normalization-section { background: #FFFFFF; border: 2.5px solid #F1F5F9; border-radius: 32px; padding: 32px; margin-bottom: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.03); }
        .normalization-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
          gap: 16px; 
          width: 100%;
        }
        .norm-item-wrapper { position: relative; }
        .norm-item { 
          width: 100%; text-align: left; background: #F8FAFC; border: 2px solid #F1F5F9; 
          border-radius: 20px; padding: 14px 18px; display: flex; align-items: center; 
          gap: 14px; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; outline: none; 
        }
        .norm-item:hover { border-color: var(--primary); background: white; transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
        .norm-item.checked { background: var(--primary); border-color: var(--primary); box-shadow: 0 10px 20px rgba(99, 102, 241, 0.25); }
        
        .norm-icon-box { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.3s; }
        .norm-content { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .norm-top-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; }
        .guide-btn-mini { 
          background: #EEF2FF; 
          color: #6366F1; 
          border: 1px solid #C7D2FE; 
          width: 24px; 
          height: 24px; 
          border-radius: 6px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          cursor: pointer; 
          transition: all 0.2s;
        }
        .guide-btn-mini:hover { background: #E0E7FF; transform: scale(1.1); }
        .norm-label { font-size: 0.85rem; font-weight: 900; color: #1E293B; line-height: 1.3; transition: color 0.3s; word-break: break-word; }
        .norm-item.checked .norm-label { color: white; }
        .norm-desc { font-size: 0.65rem; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; transition: color 0.3s; }
        .norm-item.checked .norm-desc { color: rgba(255,255,255,0.8); }

        .timing-badge { 
          font-size: 0.55rem; font-weight: 900; padding: 3px 8px; border-radius: 6px; 
          text-transform: uppercase; white-space: nowrap; background: #F1F5F9; color: #64748B;
          border: 1px solid rgba(0,0,0,0.03); transition: all 0.3s;
        }
        .norm-item.checked .timing-badge { background: rgba(255,255,255,0.2); color: white; border-color: transparent; }

        .norm-check-wrapper { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .check-empty { width: 18px; height: 18px; border: 2px solid #CBD5E1; border-radius: 50%; transition: all 0.2s; }
        .check-active { color: white; animation: pulse 0.3s ease-out; }
        .norm-item:hover .check-empty { border-color: var(--primary); border-width: 2.5px; }

        .guidance-tooltip { 
          position: absolute; bottom: calc(100% + 12px); left: 0; right: 0; 
          background: #1E293B; color: white; padding: 14px; border-radius: 16px; 
          font-size: 0.75rem; font-weight: 700; line-height: 1.5; 
          opacity: 0; pointer-events: none; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); 
          box-shadow: 0 15px 30px rgba(0,0,0,0.2); z-index: 50;
          transform: translateY(10px) scale(0.95);
        }
        .guidance-tooltip::after { 
          content: ''; position: absolute; top: 100%; left: 24px; 
          border: 7px solid transparent; border-top-color: #1E293B; 
        }
        .norm-item-wrapper:hover .guidance-tooltip { opacity: 1; transform: translateY(0) scale(1); }

        .normalization-badge { background: #F5F3FF; color: #7C3AED; border: 1px solid #DDD6FE; font-size: 0.6rem; font-weight: 900; text-transform: uppercase; padding: 2px 8px; border-radius: 6px; display: flex; align-items: center; gap: 4px; }
        
        .schedule-toggle-btn { 
          background: #F8FAFC; border: 2px solid #F1F5F9; border-radius: 12px; padding: 8px 16px; 
          font-size: 0.8rem; font-weight: 800; color: #64748B; display: flex; align-items: center; 
          gap: 8px; cursor: pointer; transition: all 0.2s; 
        }
        .schedule-toggle-btn:hover { border-color: var(--primary); color: var(--primary); background: white; }
        .schedule-toggle-btn.active { background: var(--primary); border-color: var(--primary); color: white; }

        .daily-schedule-panel { 
          background: #F8FAFC; border: 2.5px solid #F1F5F9; border-radius: 28px; padding: 24px; 
          margin-bottom: 40px; animation: slideDown 0.3s ease-out;
        }
        .schedule-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .phase-pill { background: #FFF7ED; color: #C2410C; padding: 4px 12px; border-radius: 100px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; border: 1px solid #FFEDD5; }
        .schedule-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px; }
        .schedule-slot { background: white; border: 1px solid #F1F5F9; border-radius: 16px; padding: 14px; display: flex; gap: 16px; align-items: center; }
        .schedule-slot.highlight { border-color: #DDD6FE; background: #F5F3FF; }
        .slot-time { font-size: 0.75rem; font-weight: 950; color: #6366F1; background: #EEF2FF; padding: 6px 10px; border-radius: 10px; white-space: nowrap; }
        .slot-title { font-size: 0.85rem; font-weight: 900; color: #1E293B; margin-bottom: 2px; }
        .slot-adab { font-size: 0.7rem; font-weight: 700; color: #64748B; line-height: 1.4; }
        .schedule-footer { margin-top: 16px; padding-top: 16px; border-top: 1px dashed #E2E8F0; display: flex; gap: 8px; color: #64748B; font-size: 0.75rem; line-height: 1.5; }
        
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }

        /* Modern Steps Styles from CurriculumManager */
        .modern-steps-container { position: relative; padding-left: 20px; }
        .modern-steps-container::before { 
            content: ''; position: absolute; left: 6px; top: 10px; bottom: 10px; 
            width: 2px; background: #F1F5F9; border-radius: 2px;
        }
        .modern-step-header { 
            position: relative; margin-top: 24px; margin-bottom: 16px;
            font-size: 0.85rem; font-weight: 950; color: #0F172A; text-transform: uppercase;
            padding-left: 10px; letter-spacing: 0.5px;
        }
        .modern-header-dot { 
            position: absolute; left: -20px; top: 50%; transform: translateY(-50%);
            width: 14px; height: 14px; border: 3px solid white; border-radius: 50%;
            box-shadow: 0 0 0 2px #F1F5F9;
        }
        .modern-step-row { position: relative; display: flex; gap: 16px; margin-bottom: 20px; }
        .modern-step-num { 
            font-size: 0.8rem; font-weight: 950; color: #94A3B8; 
            width: 24px; flex-shrink: 0; text-align: right; margin-top: 2px;
        }
        .modern-step-content { font-size: 0.95rem; font-weight: 600; color: #334155; line-height: 1.6; flex: 1; }
        .modern-dialogue-box { 
            background: #F1F5F9; padding: 12px 16px; border-radius: 12px; 
            margin: 10px 0; color: #4F46E5; font-weight: 800; font-size: 0.9rem;
            display: flex; gap: 10px; align-items: flex-start;
            border-left: 4px solid #4F46E5;
        }
        .modern-dialogue-box span { font-style: italic; }
        
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
