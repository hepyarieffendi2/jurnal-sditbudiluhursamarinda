import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Sparkles, CheckCircle2, Search, Zap, AlertCircle, PlayCircle, RotateCcw, Sunrise, Moon, Sprout, Droplets, Backpack, Check, X, Clock, HelpCircle, Minus } from 'lucide-react';
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function RutinitasHarian() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRombel, setSelectedRombel] = useState('Semua Kelas');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [saved, setSaved] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  const [timeContext, setTimeContext] = useState('datang');

  useEffect(() => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTimeMinutes = hour * 60 + minute;
    const dismissalLimit = (day === 5) ? 630 : 675;

    if (currentTimeMinutes >= dismissalLimit - 15) {
        setTimeContext('pulang');
    } else {
        setTimeContext('datang');
    }
  }, []);

  const morningRoutines = [
    { id: 'sasuke_awal', label: 'SASUKE Pagi', icon: Sparkles, color: '#3B82F6', bg: '#EFF6FF', detail: 'Membersihkan meja dan tempat sendiri saat datang' },
    { id: 'sakura', label: 'SAKURA', icon: Sprout, color: '#10B981', bg: '#ECFDF5', detail: 'Merawat pot tanaman kelas masing-masing' },
    { id: 'wudhu', label: 'Wudhu', icon: Droplets, color: '#06B6D4', bg: '#ECFEFF', detail: 'Tertib mengantre dan melaksanakan wudhu secara mandiri' },
    { id: 'dhuha', label: 'Dhuha', icon: Sparkles, color: '#F59E0B', bg: '#FFFBEB', detail: 'Kekhusyukan dan adab dalam Sholat Dhuha' },
  ];

  const dismissalRoutines = [
    { id: 'sasuke_akhir', label: 'SASUKE Pulang', icon: Sparkles, color: '#3B82F6', bg: '#EFF6FF', detail: 'Merapikan kembali kelas dan loker pribadi sebelum pulang' },
    { id: 'adab_pulang', label: 'Pamitan', icon: Backpack, color: '#8B5CF6', bg: '#F5F3FF', detail: 'Menunggu jemputan dengan tenang dan bersalaman berpamitan' },
  ];

  const activeRoutines = timeContext === 'datang' ? morningRoutines : dismissalRoutines;

  const statusOptions = [
    { id: 'segera', label: 'Mandiri', detail: 'Sigap & Mandiri menyelesaikan rutinitas tanpa kendala', icon: <Zap size={16} />, color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
    { id: 'diingatkan', label: 'Diingatkan', detail: 'Menyelesaikan setelah butuh 1-2x pengingat verbal dari guru', icon: <AlertCircle size={16} />, color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
    { id: 'bermain', label: 'Belum Fokus', detail: 'Masih terdistraksi, bercanda, menunda, atau butuh bantuan penuh', icon: <PlayCircle size={16} />, color: '#EF4444', bg: '#FEF2F2', border: '#FEE2E2' },
  ];

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'students'), where('status', '==', 'active'));
        const snapshot = await getDocs(q);
        const allStudents = snapshot.docs.map(doc => {
          const defaultRecords = {
            sasuke_awal: 'belum_diisi',
            sakura: 'belum_diisi',
            wudhu: 'belum_diisi',
            dhuha: 'belum_diisi',
            sasuke_akhir: 'belum_diisi',
            adab_pulang: 'belum_diisi'
          };
          return {
            id: doc.id,
            ...doc.data(),
            records: {
              ...defaultRecords,
              ...(doc.data().records || {})
            }
          };
        });
        allStudents.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(allStudents);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const cycleStatus = (studentId, routineId) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const currentStatus = s.records[routineId] || 'belum_diisi';
        const nextStatus = currentStatus === 'belum_diisi' 
          ? 'segera' 
          : (currentStatus === 'segera' 
              ? 'diingatkan' 
              : (currentStatus === 'diingatkan' 
                  ? 'bermain' 
                  : 'segera'));
        return { ...s, records: { ...s.records, [routineId]: nextStatus } };
      }
      return s;
    }));
  };

  const handleBulkUpdate = (statusId) => {
    setStudents(prev => prev.map(s => {
      const updatedRecords = { ...s.records };
      activeRoutines.forEach(r => { updatedRecords[r.id] = statusId; });
      return { ...s, records: updatedRecords };
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRombel = selectedRombel === 'Semua Kelas' || s.rombel === selectedRombel;
    return matchSearch && matchRombel;
  });

  const uniqueRombels = ['Semua Kelas', ...new Set(students.map(s => s.rombel).filter(Boolean))];

  const stats = students.reduce((acc, curr) => {
    acc.total++;
    const statuses = activeRoutines.map(r => curr.records[r.id] || 'belum_diisi');
    if (statuses.includes('bermain')) acc.belumFokus++;
    else if (statuses.includes('diingatkan')) acc.diingatkan++;
    else if (statuses.every(s => s === 'belum_diisi')) acc.belumDiisi++;
    else acc.mandiri++;
    return acc;
  }, { total: 0, belumFokus: 0, diingatkan: 0, mandiri: 0, belumDiisi: 0 });

  const getStatusConfig = (statusId) => {
    switch (statusId) {
      case 'segera': return { label: 'Mandiri', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', icon: Check };
      case 'diingatkan': return { label: 'Diingatkan', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', icon: Clock };
      case 'bermain': return { label: 'Belum Fokus', color: '#EF4444', bg: '#FEF2F2', border: '#FEE2E2', icon: X };
      case 'belum_diisi':
      default: return { label: 'Belum Diisi', color: '#64748B', bg: '#F1F5F9', border: '#E2E8F0', icon: Minus };
    }
  };

  const getCardAccentColor = (records) => {
    const statuses = activeRoutines.map(r => records[r.id] || 'belum_diisi');
    if (statuses.includes('bermain')) return '#EF4444';
    if (statuses.includes('diingatkan')) return '#F59E0B';
    if (statuses.every(s => s === 'belum_diisi')) return '#64748B';
    return '#10B981';
  };

  return (
    <div className="page-container" style={{ paddingBottom: '140px' }}>
      <div style={{ display: 'flex', justifySelf: 'start', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '4px', color: '#1E293B', marginTop: 0 }}>Log Rutinitas & Ibadah</h1>
              <p style={{ color: '#64748B', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>Pantau tingkat kemandirian dan kesadaran disiplin siswa SD.</p>
          </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', backgroundColor: '#E2E8F0', padding: '6px', borderRadius: '16px' }}>
          <button onClick={() => setTimeContext('datang')} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 800, backgroundColor: timeContext === 'datang' ? 'white' : 'transparent', color: timeContext === 'datang' ? 'var(--primary)' : '#64748B', boxShadow: timeContext === 'datang' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}>
              <Sunrise size={20} /> RUTINITAS DATANG (PAGI)
          </button>
          <button onClick={() => setTimeContext('pulang')} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 800, backgroundColor: timeContext === 'pulang' ? 'white' : 'transparent', color: timeContext === 'pulang' ? 'var(--primary)' : '#64748B', boxShadow: timeContext === 'pulang' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}>
              <Moon size={20} /> RUTINITAS PULANG (SIANG)
          </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap', backgroundColor: 'white', padding: '16px', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ position: 'relative', flex: '2 1 280px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input type="text" placeholder="Cari nama murid..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', backgroundColor: '#F8FAFC', fontSize: '0.95rem', fontWeight: 600, color: '#1E293B' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', flex: '1 1 auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: '#F8FAFC', padding: '6px 14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tanggal</span>
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ border: 'none', outline: 'none', fontWeight: 800, fontFamily: 'inherit', color: 'var(--primary)', padding: 0, fontSize: '0.85rem', backgroundColor: 'transparent', cursor: 'pointer' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: '#F8FAFC', padding: '6px 14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filter Kelas</span>
                  <select value={selectedRombel} onChange={e => setSelectedRombel(e.target.value)} style={{ border: 'none', outline: 'none', fontWeight: 800, fontFamily: 'inherit', color: 'var(--primary)', padding: 0, backgroundColor: 'transparent', fontSize: '0.85rem', cursor: 'pointer' }}>
                     {uniqueRombels.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
              </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button onClick={() => handleBulkUpdate('segera')} style={{ border: '1.5px solid #A7F3D0', backgroundColor: '#ECFDF5', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', color: '#10B981', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                  <Zap size={16} /> Semua Mandiri
              </button>
              <button onClick={() => handleBulkUpdate('belum_diisi')} style={{ border: '1.5px solid #E2E8F0', backgroundColor: '#F1F5F9', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', color: '#64748B', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                  <RotateCcw size={14} /> Reset Belum Diisi
              </button>
          </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', backgroundColor: '#F8FAFC', padding: '16px 20px', borderRadius: '18px', border: '1px solid #E2E8F0', alignItems: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '8px' }}>Kemandirian Sesi:</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                  { label: 'Total Siswa', value: stats.total, color: '#475569', bg: '#E2E8F0', border: '#CBD5E1' },
                  { label: 'Belum Diisi', value: stats.belumDiisi, color: '#64748B', bg: '#F1F5F9', border: '#E2E8F0' },
                  { label: 'Mandiri', value: stats.mandiri, color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
                  { label: 'Pengingat', value: stats.diingatkan, color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
                  { label: 'Belum Fokus', value: stats.belumFokus, color: '#EF4444', bg: '#FEF2F2', border: '#FEE2E2' }
              ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: item.bg, border: `1.5px solid ${item.border}`, color: item.color, padding: '6px 14px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800 }}>
                      <span>{item.label}:</span>
                      <strong style={{ fontSize: '0.9rem', fontWeight: 950 }}>{item.value}</strong>
                  </div>
              ))}
          </div>
          <button onClick={() => setShowGuide(!showGuide)} style={{ marginLeft: 'auto', backgroundColor: 'white', border: '1px solid #E2E8F0', padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B' }}>
             <HelpCircle size={14} /> {showGuide ? 'Sembunyikan Panduan' : 'Bantuan'}
          </button>
      </div>

      {showGuide && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '24px', animation: 'fadeIn 0.3s' }}>
            {statusOptions.map(opt => (
                <div key={opt.id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0', borderLeft: `6px solid ${opt.color}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 900, color: opt.color, fontSize: '0.8rem', marginBottom: '6px' }}>{opt.icon} {opt.label.toUpperCase()}</div>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0, lineHeight: 1.4, fontWeight: 600 }}>{opt.detail}</p>
                </div>
            ))}
        </div>
      )}

      {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', backgroundColor: 'white', borderRadius: '20px' }}>
              <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
              <p style={{ fontWeight: 800 }}>Memuat Data Siswa...</p>
          </div>
      ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
              {filteredStudents.map(student => {
                  const accentColor = getCardAccentColor(student.records);
                  return (
                      <div key={student.id} style={{ display: 'flex', flexDirection: 'column', padding: '16px 20px', borderRadius: '20px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderLeft: `5px solid ${accentColor}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', transition: 'all 0.2s ease' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.95rem' }}>{student.name.charAt(0)}</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0, lineHeight: 1.3, color: '#1E293B', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{student.name}</h4>
                                {student.rombel && <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748B', backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '6px', width: 'fit-content' }}>{student.rombel}</span>}
                              </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
                              {activeRoutines.map(routine => {
                                  const routineStatus = student.records[routine.id] || 'belum_diisi';
                                  const conf = getStatusConfig(routineStatus);
                                  const RoutineIcon = routine.icon;
                                  return (
                                      <button key={routine.id} onClick={() => cycleStatus(student.id, routine.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '10px', border: `1.5px solid ${conf.border}`, backgroundColor: conf.bg, color: conf.color, fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.15s ease', outline: 'none' }} title={`${routine.detail} - Klik untuk mengubah status`}>
                                          <RoutineIcon size={14} color={conf.color} />
                                          <span style={{ fontWeight: 900 }}>{routine.label}:</span>
                                          <span>{conf.label}</span>
                                      </button>
                                  );
                              })}
                          </div>
                      </div>
                  );
              })}
          </div>
      )}

      <div className="premium-save-bar">
          <button onClick={handleSave} style={{ color: 'white', border: 'none', padding: '14px 48px', borderRadius: '35px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', whiteSpace: 'nowrap', minWidth: '220px', justifyContent: 'center' }}>
            {saved ? <CheckCircle2 size={22} color="#5AE2A3" /> : <Save size={22} />}
            {saved ? 'Tersimpan!' : `Simpan ${timeContext === 'datang' ? 'Pagi' : 'Pulang'}`}
          </button>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
