import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Sparkles, CheckCircle2, User, Search, Zap, AlertCircle, PlayCircle, Info, X, ChevronRight, Sun, Moon, Sunrise, Sprout, Droplets, Wind, Home, Smile, SunMedium, Backpack } from 'lucide-react';
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function RutinitasHarian() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRombel, setSelectedRombel] = useState('Semua Kelas');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [saved, setSaved] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  // 🕒 SMART TIME DETECTION: Mendeteksi rutinitas apa yang aktif (Datang/Pulang)
  const [timeContext, setTimeContext] = useState('datang'); // 'datang' atau 'pulang'
  const [activeTopic, setActiveTopic] = useState('sasuke_awal');

  useEffect(() => {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 5=Fri
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTimeMinutes = hour * 60 + minute;

    // Batasan Jam Pulang (WITA)
    // Jum'at 10:30 (630 menit), Hari Lain 11:15 (675 menit)
    const dismissalLimit = (day === 5) ? 630 : 675;

    if (currentTimeMinutes >= dismissalLimit - 15) { // Mulai persiapan pulang 15 menit sebelumnya
        setTimeContext('pulang');
        setActiveTopic('sasuke_akhir');
    } else {
        setTimeContext('datang');
        setActiveTopic('sasuke_awal');
    }
  }, []);

  // Konfigurasi Rutinitas Berdasarkan Waktu
  const morningRoutines = [
    { id: 'sasuke_awal', label: 'SASUKE Pagi', icon: Sparkles, color: '#4A90E2', bg: '#D8EEFF', detail: 'Membersihkan tempat sendiri saat datang' },
    { id: 'sakura', label: 'SAKURA', icon: Sprout, color: '#34C759', bg: '#D1F5E6', detail: 'Merawat 1 pot tanaman pribadi' },
    { id: 'wudhu', label: 'Wudhu', icon: Droplets, color: '#007AFF', bg: '#EBF4FF', detail: 'Adab & antre wudhu' },
    { id: 'dhuha', label: 'Sholat Dhuha', icon: Sun, color: '#FF9500', bg: '#FFF7EB', detail: 'Kekhusyukan Sholat Dhuha' },
  ];

  const dismissalRoutines = [
    { id: 'sasuke_akhir', label: 'SASUKE Pulang', icon: Sparkles, color: '#4A90E2', bg: '#D8EEFF', detail: 'Merapikan kelas & barang pribadi sebelum pulang' },
    { id: 'adab_pulang', label: 'Adab Pulang', icon: Backpack, color: '#AF52DE', bg: '#F5EBFA', detail: 'Menunggu jemputan & berpamitan' },
  ];

  const currentRoutines = timeContext === 'datang' ? morningRoutines : dismissalRoutines;

  const statusOptions = [
    { id: 'segera', label: 'Segera', detail: 'Sigap, Mandiri & Tertib (Fokus)', icon: <Zap size={18} />, color: '#10B981', bg: '#D1FAE5' },
    { id: 'diingatkan', label: 'Diingatkan', detail: 'Patuh tapi butuh 1-2x pengingat verbal', icon: <AlertCircle size={18} />, color: '#F59E0B', bg: '#FEF3C7' },
    { id: 'bermain', label: 'Bermain', detail: 'Terdistraksi, bercanda, atau menunda', icon: <PlayCircle size={18} />, color: '#EF4444', bg: '#FEE2E2' },
  ];

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'students'),
          where('status', '==', 'active')
        );
        const snapshot = await getDocs(q);
        const allStudents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          records: { sasuke_awal: 'segera', sakura: 'segera', wudhu: 'segera', dhuha: 'segera', sasuke_akhir: 'segera' }
        }));
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

  const updateStatus = (studentId, statusId) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, records: { ...s.records, [activeTopic]: statusId } } : s));
  };

  const handleBulkUpdate = (statusId) => {
    setStudents(prev => prev.map(s => ({ ...s, records: { ...s.records, [activeTopic]: statusId } })));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const currentTopicData = currentRoutines.find(r => r.id === activeTopic);
  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRombel = selectedRombel === 'Semua Kelas' || s.rombel === selectedRombel;
    return matchSearch && matchRombel;
  });
  const uniqueRombels = ['Semua Kelas', ...new Set(students.map(s => s.rombel).filter(Boolean))];

  return (
    <div className="page-container" style={{ paddingBottom: '120px' }}>
      
      {/* 👑 GLOBAL HEADER & SCOPE FITLERS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px', color: '#2D3436', marginTop: 0 }}>Log Rutinitas & Ibadah</h1>
              <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1.1rem', margin: 0 }}>Pantau kemandirian dan adab harian.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: 'white', padding: '12px 20px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tanggal Perekaman</label>
                  <input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      style={{ border: 'none', outline: 'none', fontWeight: 800, fontFamily: 'inherit', color: 'var(--primary)', padding: 0, fontSize: '0.9rem' }}
                  />
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--border-color)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filter Kelas</label>
                  <select 
                     value={selectedRombel}
                     onChange={e => setSelectedRombel(e.target.value)}
                     style={{ border: 'none', outline: 'none', fontWeight: 800, fontFamily: 'inherit', color: 'var(--primary)', padding: 0, backgroundColor: 'transparent', fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                     {uniqueRombels.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
              </div>
          </div>
      </div>

      {/* 🧭 NAVIGATION: RUTINITAS UTAMA (DATANG vs PULANG) */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', backgroundColor: '#E2E8F0', padding: '6px', borderRadius: '16px' }}>
          <button 
            onClick={() => { setTimeContext('datang'); setActiveTopic('sasuke_awal'); }}
            style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 800, backgroundColor: timeContext === 'datang' ? 'white' : 'transparent', color: timeContext === 'datang' ? 'var(--primary)' : '#64748B', boxShadow: timeContext === 'datang' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}
          >
              <Sunrise size={20} /> RUTINITAS DATANG
          </button>
          <button 
            onClick={() => { setTimeContext('pulang'); setActiveTopic('sasuke_akhir'); }}
            style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 800, backgroundColor: timeContext === 'pulang' ? 'white' : 'transparent', color: timeContext === 'pulang' ? 'var(--primary)' : '#64748B', boxShadow: timeContext === 'pulang' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}
          >
              <Moon size={20} /> RUTINITAS PULANG
          </button>
      </div>

      {/* 🎯 TOPIC SELECTOR (SUB-TABS) */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
          {currentRoutines.map(routine => {
              const RoutineIcon = routine.icon;
              return (
                <button 
                  key={routine.id}
                  onClick={() => setActiveTopic(routine.id)}
                  style={{ 
                      minWidth: '160px', padding: '12px 16px', borderRadius: '18px', border: 'none',
                      backgroundColor: activeTopic === routine.id ? 'white' : 'transparent',
                      boxShadow: activeTopic === routine.id ? 'var(--shadow-out)' : 'none',
                      color: activeTopic === routine.id ? 'var(--text-main)' : 'var(--text-muted)',
                      fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', transition: 'all 0.3s'
                  }}
                >
                    <div style={{ backgroundColor: activeTopic === routine.id ? routine.bg : '#EEE', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RoutineIcon size={20} color={activeTopic === routine.id ? routine.color : '#8E8E93'} />
                    </div>
                    {routine.label}
                </button>
              );
          })}
      </div>

      {/* ℹ️ QUICK GUIDE (Informative Header) */}
      <div className="card" style={{ marginBottom: '24px', backgroundColor: '#F8FAFC', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div className="card-soft" style={{ width: '64px', height: '64px', borderRadius: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'white' }}>
                    {currentTopicData && React.createElement(currentTopicData.icon, { size: 32, color: currentTopicData.color })}
                </div>
                <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>
                         Fokus {currentTopicData?.label}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>{currentTopicData?.detail}</p>
                </div>
            </div>
            <button onClick={() => setShowGuide(!showGuide)} style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
               {showGuide ? 'Tutup Indikator' : 'Bantuan Indikator'}
            </button>
          </div>
          
          {showGuide && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '16px', animation: 'fadeIn 0.3s' }}>
                {statusOptions.map(opt => (
                    <div key={opt.id} style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', borderLeft: `6px solid ${opt.color}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 900, color: opt.color, fontSize: '0.75rem', marginBottom: '4px' }}>
                            {opt.icon} {opt.label.toUpperCase()}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>{opt.detail}</p>
                    </div>
                ))}
            </div>
          )}
      </div>

      {/* 🔍 SEARCH & BULK ACTION */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Cari nama murid..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', fontWeight: 600 }} />
          </div>
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'white', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              {statusOptions.map(opt => (
                  <button key={opt.id} onClick={() => handleBulkUpdate(opt.id)} style={{ padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: opt.bg, color: opt.color, cursor: 'pointer', display: 'flex' }} title={`Set Semua ${opt.label}`}>{opt.icon}</button>
              ))}
          </div>
      </div>

      {/* 🧩 KUNCI IKON MINI (LEGEND) */}
      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', display: 'flex', gap: '16px', marginBottom: '16px', justifyContent: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={14} color="#10B981" /> Segera</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} color="#F59E0B" /> Diingatkan</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><PlayCircle size={14} color="#EF4444" /> Main-main</span>
      </div>

      {/* 📋 LIGHTNING LIST: FOKUS 3-ICON (Mobile Mastery) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'var(--border-color)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', backgroundColor: 'white' }}>
                  <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
                  <p style={{ fontWeight: 800 }}>Memuat Data Siswa Aktif...</p>
              </div>
          ) : filteredStudents.map(student => {
              const currentStatus = student.records[activeTopic];
              return (
                  <div key={student.id} style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '140px', flex: 1, paddingRight: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem' }}>{student.name.charAt(0)}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: 0, lineHeight: 1.2, color: 'var(--text-main)' }}>{student.name}</h4>
                            {student.rombel && <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748B', backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>{student.rombel}</span>}
                          </div>
                      </div>

                      {/* PIANO-STYLE INPUT (3 ICON) */}
                      <div style={{ display: 'flex', gap: '4px', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '12px' }}>
                          {statusOptions.map(option => {
                              const isSelected = currentStatus === option.id;
                              return (
                                  <button 
                                      key={option.id} 
                                      onClick={() => updateStatus(student.id, option.id)} 
                                      style={{ 
                                          width: '54px', height: '52px', borderRadius: '10px', border: 'none', 
                                          backgroundColor: isSelected ? option.color : 'transparent', 
                                          color: isSelected ? 'white' : '#94A3B8', 
                                          cursor: 'pointer', transition: 'all 0.1s', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                      }}
                                  >
                                      {option.icon}
                                  </button>
                              );
                          })}
                      </div>
                  </div>
              );
          })}
      </div>

      {/* 🚀 FLOATING PREMIUM SAVE (Standardized for all modules) */}
      <div className="premium-save-bar">
          <button onClick={handleSave} style={{ 
              color: 'white', border: 'none', padding: '14px 48px', 
              borderRadius: '35px', fontWeight: 900, cursor: 'pointer', display: 'flex', 
              alignItems: 'center', gap: '12px', 
              fontSize: '1rem', whiteSpace: 'nowrap', minWidth: '220px', justifyContent: 'center' 
          }}>
            {saved ? <CheckCircle2 size={22} color="#5AE2A3" /> : <Save size={22} />}
            {saved ? 'Tersimpan!' : `Simpan ${currentTopicData?.label}`}
          </button>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (max-width: 640px) {
            .mobile-hide { display: none !important; }
            .card h3 { font-size: 1rem !important; }
        }
      `}</style>
    </div>
  );
}
