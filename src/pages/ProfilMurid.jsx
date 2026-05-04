import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { AREA_SENTRA } from '../data/areaSentra';
import { ArrowLeft, Calendar, BookOpen, Clock, User, Award, Filter, ChevronRight, LayoutGrid, Sparkles, TrendingUp, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export default function ProfilMurid() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);

  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('matriks'); // 'timeline' atau 'matriks'
  
  // 🧠 INTELLIGENCE: State untuk Peta Kompetensi
  const [competencyMap, setCompetencyMap] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [stagnantAreas, setStagnantAreas] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoadingStudent(true);
      try {
        const docRef = doc(db, 'students', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStudent({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Fallback to name from URL if ID not found in database (legacy)
          setStudent({ name: searchParams.get('name') || 'Murid Tidak Dikenal' });
        }
      } catch (err) {
        console.error("Error fetching student:", err);
        setStudent({ name: searchParams.get('name') || 'Profil Murid' });
      } finally {
        setLoadingStudent(false);
      }
    };
    fetchStudentData();
  }, [id, searchParams]);

  useEffect(() => {
    if (!student?.name) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'jurnal_aktivitas'),
          where('murid', '==', student.name),
          orderBy('tanggal', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setObservations(data);

        // Calculate Competency Map
        const map = {};
        const firstObsDate = {};
        const lastObsDate = {};

        data.forEach(obs => {
          const key = obs.pencapaian; // Use the specific material name
          if (!map[key]) {
              map[key] = obs.kematangan || 'P'; 
          }
          
          const obsDate = obs.tanggal?.toDate ? obs.tanggal.toDate() : new Date(obs.tanggal);
          if (!firstObsDate[key] || obsDate < firstObsDate[key]) firstObsDate[key] = obsDate;
          if (!lastObsDate[key] || obsDate > lastObsDate[key]) lastObsDate[key] = obsDate;
        });
        setCompetencyMap(map);

        // Calculate Stagnancy (Working for > 14 days without Mastery)
        const stagnant = [];
        const today = new Date();
        Object.keys(map).forEach(key => {
          if (map[key] === 'W') {
            const diffDays = Math.ceil((today - firstObsDate[key]) / (1000 * 60 * 60 * 24));
            if (diffDays > 14) {
              stagnant.push({
                item: key,
                days: diffDays
              });
            }
          }
        });
        setStagnantAreas(stagnant);

        // Calculate Next Recommendations (Top 3 un-presented items)
        const recs = [];
        for (const area of AREA_SENTRA) {
          for (const sub of area.subAreas) {
            for (const lvl of (sub.levels || [])) {
              const label = typeof lvl === 'object' ? lvl.label : lvl;
              if (!map[label] && recs.length < 3) {
                recs.push({
                  area: area.name,
                  item: label,
                  icon: area.icon
                });
              }
            }
          }
        }
        setRecommendations(recs);

      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [student]);

  // Helper untuk mendapatkan warna heatmap
  const getLevelColor = (itemLabel) => {
    const level = competencyMap[itemLabel];
    if (!level) return '#F1F5F9';
    
    if (level === 'M') return 'var(--primary)';
    if (level === 'W') return '#818CF8';
    if (level === 'P') return '#A5B4FC';
    if (level === 'N') return '#EF4444';
    return '#C7D2FE';
  };

  return (
    <div className="page-container">
      {/* Profil Header (Simplified for SPA) */}
      <div style={{ 
        backgroundColor: 'var(--primary)', 
        color: 'white', 
        padding: '32px', 
        borderRadius: '24px', 
        marginBottom: '32px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '24px', 
        position: 'relative', 
        overflow: 'hidden',
        flexWrap: 'wrap' // 📱 Responsive fix
      }}>
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }}>
            <Sparkles size={150} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, minWidth: '300px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '24px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, flexShrink: 0 }}>
              {(student?.name || 'P').charAt(0)}
            </div>
            <div>
              <h1 style={{ fontSize: '2.2rem', marginBottom: '4px', lineHeight: 1.1 }}>{student?.name || 'Memuat...'}</h1>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', opacity: 0.9 }}>
                <span>{student?.grade || 'Sentra Dasar'}</span>
                <span>•</span>
                <span>ID: {id?.substring(0, 8)}</span>
              </div>
            </div>
        </div>
        
        {/* 🚀 ACTION: CETAK RAPOR */}
        <div style={{ display: 'flex', gap: '12px' }}>
             <button 
                onClick={() => navigate(`/rapor/${id}`)}
                style={{ 
                    backgroundColor: 'white', 
                    color: 'var(--primary)', 
                    border: 'none', 
                    padding: '14px 28px', 
                    borderRadius: '16px', 
                    fontWeight: 900, 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    whiteSpace: 'nowrap'
                }}
                className="hover-pop"
             >
                <FileText size={20} /> Cetak Rapor Digital
             </button>
        </div>
      </div>

      <main>
        {/* Tab Switcher Intelligence */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', backgroundColor: 'white', padding: '8px', borderRadius: '16px', border: '1px solid var(--border-color)', width: 'max-content', flexWrap: 'wrap' }}>
            <button 
                onClick={() => setActiveTab('matriks')}
                style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, backgroundColor: activeTab === 'matriks' ? 'var(--primary)' : 'transparent', color: activeTab === 'matriks' ? 'white' : 'var(--text-muted)', transition: 'all 0.2s' }}
            >
                <LayoutGrid size={18} /> Progress Matrix (Kanban)
            </button>
            <button 
                onClick={() => setActiveTab('timeline')}
                style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, backgroundColor: activeTab === 'timeline' ? 'var(--primary)' : 'transparent', color: activeTab === 'timeline' ? 'white' : 'var(--text-muted)', transition: 'all 0.2s' }}
            >
                <Calendar size={18} /> Timeline Harian (Klasik)
            </button>
        </div>

        {activeTab === 'timeline' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '32px' }}>
            {/* Timeline Column */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.2rem' }}>Riwayat Observasi</h3>
                    <button onClick={() => navigate(`/observasi/baru?name=${encodeURIComponent(student?.name || '')}`)} style={{ fontSize: '0.85rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>+ Buat Jurnal Baru</button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Memuat data...</div>
                ) : observations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                        <p>Belum ada catatan aktivitas untuk {student?.name}.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {observations.map((obs) => (
                            <div key={obs.id} style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                        {obs.tanggal?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', backgroundColor: 'white', padding: '2px 8px', borderRadius: '10px', border: '1px solid var(--border-color)', fontWeight: 600 }}>{obs.area}</span>
                                </div>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{obs.aktivitas}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '12px' }}>"{obs.catatan}"</p>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--secondary)', fontWeight: 700 }}><CheckCircle2 size={14} /> {obs.pencapaian}</span>
                                    {obs.kematangan && (
                                        <span style={{ 
                                            fontSize: '0.65rem', 
                                            backgroundColor: obs.kematangan === 'M' ? '#ECFDF5' : obs.kematangan === 'W' ? '#FFFBEB' : obs.kematangan === 'P' ? '#EEF2FF' : '#FEF2F2', 
                                            color: obs.kematangan === 'M' ? '#059669' : obs.kematangan === 'W' ? '#D97706' : obs.kematangan === 'P' ? '#4F46E5' : '#DC2626', 
                                            padding: '2px 8px', borderRadius: '6px', fontWeight: 900, border: '1px solid currentColor'
                                        }}>
                                            {obs.kematangan === 'P' ? '📢 P' : obs.kematangan === 'W' ? '⚙️ W' : obs.kematangan === 'M' ? '🌟 M' : obs.kematangan === 'N' ? '🆘 N' : obs.kematangan}
                                        </span>
                                    )}
                                    {obs.restorasi && <span title="Cycle Complete" style={{ fontSize: '0.9rem' }}>✅</span>}
                                    {obs.konsentrasi && <span title={obs.konsentrasi} style={{ fontSize: '0.9rem' }}>{obs.konsentrasi === 'Deep Focus' ? '🔥' : obs.konsentrasi === 'Working' ? '⚙️' : '🌱'}</span>}
                                    {obs.sosial && <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700 }}>{obs.sosial === 'Individual' ? '👤' : obs.sosial === 'Pair' ? '👥' : '👨‍👩Join'}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sidebar Stats */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="card">
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>STATISTIK BULAN INI</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL KERJA</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{observations.length} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Sesi</span></div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>AREA TERAKTIF</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Practical Life</div>
                        </div>
                    </div>
                </div>

                {recommendations.length > 0 && (
                  <div className="card" style={{ border: '2px solid #EEF2FF', background: 'linear-gradient(to bottom right, #FFFFFF, #F8FAFC)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                          <TrendingUp size={20} color="var(--primary)" />
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>REKOMENDASI BERIKUTNYA</h4>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {recommendations.map((rec, i) => (
                              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>
                                      {i + 1}
                                  </div>
                                  <div>
                                      <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{rec.area}</div>
                                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{rec.item}</div>
                                  </div>
                              </div>
                          ))}
                      </div>
                      <button 
                        onClick={() => navigate('/sentra')}
                        style={{ marginTop: '20px', width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        Buka Sesi Sentra <ChevronRight size={16} />
                      </button>
                  </div>
                )}

                {stagnantAreas.length > 0 && (
                  <div className="card" style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <AlertTriangle size={20} color="#D97706" />
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#9A3412' }}>STAGNASI TERDETEKSI</h4>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#C2410C', marginBottom: '12px', lineHeight: 1.5 }}>
                        Ananda sudah berada di tahap <b>Working</b> pada materi berikut selama lebih dari 14 hari. Perlu re-presentasi atau observasi khusus.
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {stagnantAreas.map((st, i) => (
                              <div key={i} style={{ backgroundColor: 'white', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #FED7AA', display: 'flex', justifyContent: 'space-between' }}>
                                  <span>{st.item}</span>
                                  <span style={{ color: '#D97706' }}>{st.days} Hari</span>
                              </div>
                          ))}
                      </div>
                  </div>
                )}

                <div className="card" style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <Sparkles size={20} />
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>NARASI CERDAS (AI)</h4>
                    </div>
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.9 }}>
                        {observations.length > 0 
                            ? `Ananda ${student?.name} menunjukkan fokus yang sangat tinggi di area ${observations[0].area}. Terlihat mulai mencintai tantangan baru di ${observations[0].pencapaian}.`
                            : "Belum cukup data untuk membuat narasi otomatis. Terus lakukan observasi!"}
                    </p>
                    <button style={{ marginTop: '16px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'transparent', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>Salin untuk Rapor</button>
                </div>
            </aside>
          </div>
        ) : (
          /* 🔥 PROGRESS MATRIX (KANBAN) */
          <div className="card" style={{ animation: 'fadeIn 0.3s', padding: '32px' }}>
              <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', fontWeight: 900, color: 'var(--text-main)' }}>Kanban Progress Materi</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Lihat sekilas apa yang sedang dilatih, dikuasai, atau butuh bantuan saat ini tanpa harus membaca log per hari.</p>
                </div>
              </div>

              {(() => {
                // Proses Kanban Data
                const kanban = { P: [], W: [], M: [], N: [] };
                Object.keys(competencyMap).forEach(key => {
                   const status = competencyMap[key];
                   let areaIcon = '🧩';
                   let areaColor = 'var(--text-main)';
                   
                   for (const area of AREA_SENTRA) {
                      for (const sub of area.subAreas) {
                         const lvls = sub.levels || [];
                         for (const lvl of lvls) {
                             const label = typeof lvl === 'object' ? lvl.label : lvl;
                             if (label === key) {
                                areaIcon = area.icon;
                                areaColor = area.color || 'var(--primary)';
                             }
                         }
                      }
                   }
                   if (kanban[status]) kanban[status].push({ name: key, icon: areaIcon, color: areaColor });
                });

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                     {/* Column 1: Diperkenalkan (P) */}
                     <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #CBD5E1' }}>
                           <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3B82F6' }}></div>
                           <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>Diperkenalkan <span style={{ fontWeight: 400, color: '#64748B' }}>({kanban.P.length})</span></h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                           {kanban.P.length === 0 && <span style={{ color: '#94A3B8', fontSize: '0.85rem', fontStyle: 'italic' }}>Belum ada materi baru.</span>}
                           {kanban.P.map((item, i) => (
                              <div key={i} style={{ backgroundColor: 'white', padding: '12px 16px', borderRadius: '12px', borderLeft: `4px solid #3B82F6`, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                 <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{item.icon}</div>
                                 <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', lineHeight: 1.4 }}>{item.name}</div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Column 2: Sedang Dikerjakan (W) */}
                     <div style={{ backgroundColor: '#FFFBEB', borderRadius: '16px', padding: '20px', border: '1px solid #FEF3C7' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #FDE68A' }}>
                           <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></div>
                           <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#92400E' }}>Sedang Latihan <span style={{ fontWeight: 400, color: '#B45309' }}>({kanban.W.length})</span></h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                           {kanban.W.length === 0 && <span style={{ color: '#D97706', fontSize: '0.85rem', fontStyle: 'italic' }}>Tidak ada materi aktif.</span>}
                           {kanban.W.map((item, i) => {
                              const isStagnant = stagnantAreas.some(s => s.item === item.name);
                              return (
                                <div key={i} style={{ backgroundColor: 'white', padding: '12px 16px', borderRadius: '12px', borderLeft: `4px solid ${isStagnant ? '#EF4444' : '#F59E0B'}`, boxShadow: '0 4px 6px rgba(245, 158, 11, 0.05)', position: 'relative' }}>
                                   {isStagnant && <div style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#EF4444', color: 'white', padding: '4px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlertTriangle size={14} /></div>}
                                   <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{item.icon}</div>
                                   <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', lineHeight: 1.4 }}>{item.name}</div>
                                   {isStagnant && <div style={{ fontSize: '0.7rem', color: '#EF4444', fontWeight: 800, marginTop: '8px' }}>Stagnan {stagnantAreas.find(s=>s.item===item.name)?.days} Hari</div>}
                                </div>
                              )
                           })}
                        </div>
                     </div>

                     {/* Column 3: Dikuasai (M) */}
                     <div style={{ backgroundColor: '#ECFDF5', borderRadius: '16px', padding: '20px', border: '1px solid #D1FAE5' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #A7F3D0' }}>
                           <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
                           <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#065F46' }}>Dikuasai <span style={{ fontWeight: 400, color: '#047857' }}>({kanban.M.length})</span></h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                           {kanban.M.length === 0 && <span style={{ color: '#059669', fontSize: '0.85rem', fontStyle: 'italic' }}>Belum ada materi dikuasai.</span>}
                           {kanban.M.map((item, i) => (
                              <div key={i} style={{ backgroundColor: 'white', padding: '12px 16px', borderRadius: '12px', borderLeft: `4px solid #10B981`, boxShadow: '0 2px 4px rgba(16, 185, 129, 0.05)' }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{ fontSize: '1.2rem' }}>{item.icon}</div>
                                    <CheckCircle2 size={16} color="#10B981" />
                                 </div>
                                 <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', lineHeight: 1.4 }}>{item.name}</div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                );
              })}
          </div>
        )}
      </main>
    </div>
  );
}
