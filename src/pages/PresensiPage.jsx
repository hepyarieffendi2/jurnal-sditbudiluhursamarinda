import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, UserCheck, UserX, Clock, Search, CheckCircle2, ListChecks, RotateCcw } from 'lucide-react';
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

  React.useEffect(() => {
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
          status: 'hadir' // Default to hadir for UI initialization
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

  const updateStatus = (id, newStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
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

  return (
    <div className="page-container">
      {/* 👑 GLOBAL HEADER & SCOPE FITLERS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ padding: '0 8px' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px', color: '#2D3436', marginTop: 0 }}>Presensi Harian</h1>
              <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1.1rem', margin: 0 }}>Pencatatan otomatis kehadiran siswa.</p>
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

      {/* TOOLS & BULK ACTIONS */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                  type="text" 
                  placeholder="Cari nama murid..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'white', fontSize: '1rem', fontWeight: 600 }}
              />
          </div>

          {/* Bulk Update Controls */}
          <div style={{ display: 'flex', backgroundColor: 'white', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-color)', gap: '4px' }}>
              <button 
                onClick={() => handleBulkUpdate('hadir')}
                style={{ border: 'none', background: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', color: 'var(--secondary)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Tandai semua hadir"
              >
                  <ListChecks size={18} /> Semua Hadir
              </button>
              <div style={{ width: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />
              <button 
                onClick={() => handleBulkUpdate('alpa')}
                style={{ border: 'none', background: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', color: 'var(--danger)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Reset semua alpa"
              >
                  <RotateCcw size={16} /> Reset Alpa
              </button>
          </div>
      </div>

      {/* STUDENT LIST GRID */}
      {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
              <p style={{ fontWeight: 800 }}>Memuat Data Siswa Aktif...</p>
          </div>
      ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '12px' }}>
              {filteredStudents.map(student => (
              <div key={student.id} style={{ 
                display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: '16px', 
                border: '1px solid',
                borderColor: student.status === 'hadir' ? 'var(--border-color)' : (student.status === 'sakit' ? 'var(--warning)' : 'var(--danger)'),
                backgroundColor: student.status === 'hadir' ? 'white' : (student.status === 'sakit' ? '#FFFBEB' : '#FEF2F2'),
                boxShadow: student.status === 'hadir' ? '0 2px 4px rgba(0,0,0,0.02)' : 'none',
                transition: 'all 0.2s ease'
              }}>
                  {/* Student Info Area */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0, paddingRight: '12px' }}>
                      <div style={{ 
                        width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                        backgroundColor: student.status === 'hadir' ? '#F1F5F9' : (student.status === 'sakit' ? '#FEF3C7' : '#FEE2E2'), 
                        color: student.status === 'hadir' ? '#64748B' : (student.status === 'sakit' ? '#D97706' : '#DC2626'), 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900 
                      }}>
                          {student.name.charAt(0)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: 1.2 }}>{student.name}</h3>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginTop: '2px' }}>
                            {student.rombel && <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748B', backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>{student.rombel}</span>}
                            {student.status !== 'hadir' && (
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: student.status === 'sakit' ? 'var(--warning)' : 'var(--danger)' }}>
                                    {student.status === 'sakit' ? 'Sakit / Izin' : 'Tanpa Keterangan'}
                                </span>
                            )}
                        </div>
                      </div>
                  </div>

                  {/* Segmented Control Area */}
                  <div style={{ display: 'flex', gap: '2px', backgroundColor: student.status === 'hadir' ? '#F1F5F9' : 'white', borderRadius: '12px', padding: '4px', flexShrink: 0 }}>
                      <button 
                          onClick={() => updateStatus(student.id, 'hadir')}
                          style={{ 
                            padding: '6px 16px', borderRadius: '8px', border: 'none', outline: 'none',
                            backgroundColor: student.status === 'hadir' ? 'var(--secondary)' : 'transparent', 
                            color: student.status === 'hadir' ? 'white' : '#64748B', 
                            fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: student.status === 'hadir' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                          }}
                      >Hadir</button>
                      <button 
                          onClick={() => updateStatus(student.id, 'sakit')}
                          style={{ 
                            padding: '6px 16px', borderRadius: '8px', border: 'none', outline: 'none',
                            backgroundColor: student.status === 'sakit' ? 'var(--warning)' : 'transparent', 
                            color: student.status === 'sakit' ? 'white' : '#64748B', 
                            fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: student.status === 'sakit' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                          }}
                      >Sakit</button>
                      <button 
                          onClick={() => updateStatus(student.id, 'alpa')}
                          style={{ 
                            padding: '6px 16px', borderRadius: '8px', border: 'none', outline: 'none',
                            backgroundColor: student.status === 'alpa' ? 'var(--danger)' : 'transparent', 
                            color: student.status === 'alpa' ? 'white' : '#64748B', 
                            fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: student.status === 'alpa' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                          }}
                      >Alpa</button>
                  </div>
              </div>
              ))}
          </div>
      )}
      {/* 🚀 FLOATING PREMIUM SAVE (Standardized for all modules) */}
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
