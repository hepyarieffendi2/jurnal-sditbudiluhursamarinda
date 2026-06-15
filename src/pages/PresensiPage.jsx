import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Search, CheckCircle2, ListChecks, RotateCcw, Check, X, Clock, Minus } from 'lucide-react';
import { db } from '../firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function PresensiPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRombel, setSelectedRombel] = useState('Semua Kelas');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [saved, setSaved] = useState(false);
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'students'),
          where('status', '==', 'active')
        );
        const snapshot = await getDocs(q);
        const studData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          status: 'belum_diisi' // Default to neutral on fetch
        }));
        studData.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(studData);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const cycleStatus = (id) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'belum_diisi' ? 'hadir' : (s.status === 'hadir' ? 'sakit' : (s.status === 'sakit' ? 'alpa' : 'hadir'));
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const handleBulkUpdate = (newStatus) => {
    setStudents(prev => prev.map(s => ({ ...s, status: newStatus })));
  };

  const handleSave = () => {
    setSaved(true);
    localStorage.setItem('presensi_hari_ini', JSON.stringify(students));
    setTimeout(() => {
        setSaved(false);
    }, 2000);
  };

  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRombel = selectedRombel === 'Semua Kelas' || s.rombel === selectedRombel;
    return matchSearch && matchRombel;
  });

  const uniqueRombels = ['Semua Kelas', ...new Set(students.map(s => s.rombel).filter(Boolean))];

  // Calculate real-time stats
  const stats = students.reduce((acc, curr) => {
    acc.total++;
    if (curr.status === 'hadir') acc.hadir++;
    else if (curr.status === 'sakit') acc.sakit++;
    else if (curr.status === 'alpa') acc.alpa++;
    else acc.belumDiisi++;
    return acc;
  }, { total: 0, hadir: 0, sakit: 0, alpa: 0, belumDiisi: 0 });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'hadir':
        return {
          label: 'Hadir',
          bg: '#ECFDF5',
          color: '#10B981',
          border: '#A7F3D0',
          icon: Check
        };
      case 'sakit':
        return {
          label: 'Sakit/Izin',
          bg: '#FFFBEB',
          color: '#F59E0B',
          border: '#FDE68A',
          icon: Clock
        };
      case 'alpa':
        return {
          label: 'Alpa',
          bg: '#FEF2F2',
          color: '#EF4444',
          border: '#FEE2E2',
          icon: X
        };
      case 'belum_diisi':
      default:
        return {
          label: 'Belum Diisi',
          bg: '#F1F5F9',
          color: '#64748B',
          border: '#E2E8F0',
          icon: Minus
        };
    }
  };

  return (
    <div className="page-container" style={{ paddingBottom: '140px' }}>
      {/* 👑 GLOBAL HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '4px', color: '#1E293B', marginTop: 0 }}>Presensi Harian</h1>
              <p style={{ color: '#64748B', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>Pencatatan kehadiran siswa secara berkala.</p>
          </div>
      </div>

      {/* 👑 PANEL KONTROL TERINTEGRASI */}
      <div style={{ 
          display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center', 
          flexWrap: 'wrap', backgroundColor: 'white', padding: '16px', 
          borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
      }}>
          {/* Kolom Pencarian */}
          <div style={{ position: 'relative', flex: '2 1 280px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                  type="text" 
                  placeholder="Cari nama murid..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', backgroundColor: '#F8FAFC', fontSize: '0.95rem', fontWeight: 600, color: '#1E293B' }}
              />
          </div>

          {/* Filter Tanggal & Kelas */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', flex: '1 1 auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: '#F8FAFC', padding: '6px 14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tanggal</span>
                  <input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      style={{ border: 'none', outline: 'none', fontWeight: 800, fontFamily: 'inherit', color: 'var(--primary)', padding: 0, fontSize: '0.85rem', backgroundColor: 'transparent', cursor: 'pointer' }}
                  />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: '#F8FAFC', padding: '6px 14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filter Kelas</span>
                  <select 
                     value={selectedRombel}
                     onChange={e => setSelectedRombel(e.target.value)}
                     style={{ border: 'none', outline: 'none', fontWeight: 800, fontFamily: 'inherit', color: 'var(--primary)', padding: 0, backgroundColor: 'transparent', fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                     {uniqueRombels.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
              </div>
          </div>

          {/* Tombol Aksi Massal (Bulk) */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => handleBulkUpdate('hadir')}
                style={{ 
                    border: 'none', backgroundColor: '#ECFDF5', padding: '10px 16px', 
                    borderRadius: '12px', cursor: 'pointer', color: '#10B981', 
                    fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px',
                    border: '1.5px solid #A7F3D0', transition: 'all 0.2s'
                }}
              >
                  <ListChecks size={16} /> Semua Hadir
              </button>
              <button 
                onClick={() => handleBulkUpdate('alpa')}
                style={{ 
                    border: 'none', backgroundColor: '#FEF2F2', padding: '10px 16px', 
                    borderRadius: '12px', cursor: 'pointer', color: '#EF4444', 
                    fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px',
                    border: '1.5px solid #FEE2E2', transition: 'all 0.2s'
                }}
              >
                  <RotateCcw size={14} /> Reset Alpa
              </button>
          </div>
      </div>

      {/* 📊 REAL-TIME SUMMARY STATS WIDGET */}
      <div style={{ 
          display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', 
          backgroundColor: '#F8FAFC', padding: '16px 20px', borderRadius: '18px', 
          border: '1px solid #E2E8F0', alignItems: 'center'
      }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '8px' }}>
              Ringkasan Kelas:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                  { label: 'Total Siswa', value: stats.total, color: '#475569', bg: '#E2E8F0', border: '#CBD5E1' },
                  { label: 'Belum Diisi', value: stats.belumDiisi, color: '#64748B', bg: '#F1F5F9', border: '#E2E8F0' },
                  { label: 'Hadir', value: stats.hadir, color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
                  { label: 'Sakit / Izin', value: stats.sakit, color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
                  { label: 'Alpa', value: stats.alpa, color: '#EF4444', bg: '#FEF2F2', border: '#FEE2E2' }
              ].map((item, i) => (
                  <div key={i} style={{ 
                      display: 'flex', alignItems: 'center', gap: '8px', 
                      backgroundColor: item.bg, border: `1.5px solid ${item.border}`, 
                      color: item.color, padding: '6px 14px', borderRadius: '12px', 
                      fontSize: '0.8rem', fontWeight: 800 
                  }}>
                      <span>{item.label}:</span>
                      <strong style={{ fontSize: '0.9rem', fontWeight: 950 }}>{item.value}</strong>
                  </div>
              ))}
          </div>
      </div>

      {/* STUDENT LIST GRID */}
      {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
              <p style={{ fontWeight: 800 }}>Memuat Data Siswa Aktif...</p>
          </div>
      ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {filteredStudents.map(student => {
                const conf = getStatusConfig(student.status);
                const IconComponent = conf.icon;
                
                return (
                  <div key={student.id} style={{ 
                    display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px', borderRadius: '16px', 
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0',
                    borderLeft: `5px solid ${conf.color}`,
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)',
                    transition: 'all 0.2s ease',
                  }}>
                      {/* Student Info Area */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0, paddingRight: '12px' }}>
                          <div style={{ 
                            width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
                            backgroundColor: conf.bg, 
                            color: conf.color, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 900 
                          }}>
                              {student.name.charAt(0)}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1E293B', margin: 0, lineHeight: 1.3 }}>{student.name}</h3>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                {student.rombel && <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '6px' }}>{student.rombel}</span>}
                            </div>
                          </div>
                      </div>

                      {/* Click-to-Cycle Status Pill */}
                      <button 
                        onClick={() => cycleStatus(student.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          borderRadius: '30px',
                          border: `1.5px solid ${conf.border}`,
                          backgroundColor: conf.bg,
                          color: conf.color,
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          outline: 'none',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                      >
                        <IconComponent size={14} />
                        <span>{conf.label}</span>
                      </button>
                  </div>
                );
              })}
          </div>
      )}

      {/* 🚀 FLOATING PREMIUM SAVE */}
      <div className="premium-save-bar">
          <button onClick={handleSave} style={{ 
              color: 'white', border: 'none', padding: '14px 48px', 
              borderRadius: '35px', fontWeight: 900, cursor: 'pointer', display: 'flex', 
              alignItems: 'center', gap: '12px', 
              fontSize: '1rem', whiteSpace: 'nowrap', minWidth: '220px', justifyContent: 'center' 
          }}>
            {saved ? <CheckCircle2 size={22} color="#5AE2A3" /> : <Save size={22} />}
            {saved ? 'Tersimpan!' : 'Simpan Presensi Hari Ini'}
          </button>
      </div>
    </div>
  );
}
