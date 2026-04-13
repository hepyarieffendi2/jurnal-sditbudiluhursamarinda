import React, { useState } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { Book, Trash2, Save, RefreshCcw, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function TilawatiTracker() {
  const [activeTab, setActiveTab] = useState('bacaan');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

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
          type: doc.data().tilawatiType || 'TILAWATI',
          jilid: doc.data().tilawatiJilid || 'Jilid 1',
          hal: doc.data().tilawatiHal || '',
          status: 'belum'
        }));
        
        // Filter by presence from localStorage
        const presensi = JSON.parse(localStorage.getItem('presensi_hari_ini') || '[]');
        if (presensi.length > 0) {
            const hadirIds = presensi.filter(p => p.status === 'hadir').map(p => p.id);
            setStudents(allStudents.filter(s => hadirIds.includes(s.id)));
        } else {
            setStudents(allStudents);
        }
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const updateStudent = (id, field, value) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleAction = (id, result) => {
    updateStudent(id, 'status', result);
  };

  const handleSaveAll = async () => {
    setSaved(true);
    setTimeout(() => {
        setSaved(false);
    }, 2000);
  };

  return (
    <div className="page-container" style={{ paddingBottom: '100px' }}>
      {/* Tab Menu Internal (Sticky di bawah topbar) */}
      <div style={{ display: 'flex', gap: '8px', maxWidth: '1000px', marginBottom: '32px' }}>
          <button 
              onClick={() => setActiveTab('presensi')}
              style={{ borderRadius: '12px', padding: '12px 24px', border: 'none', backgroundColor: activeTab === 'presensi' ? 'var(--primary)' : 'white', color: activeTab === 'presensi' ? 'white' : '#64748B', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border-color)' }}
          >
              Presensi
          </button>
          <button 
              onClick={() => setActiveTab('bacaan')}
              style={{ borderRadius: '12px', padding: '12px 24px', border: 'none', backgroundColor: activeTab === 'bacaan' ? 'var(--primary)' : 'white', color: activeTab === 'bacaan' ? 'white' : '#64748B', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border-color)' }}
          >
              Penilaian Bacaan
          </button>
          <button style={{ borderRadius: '12px', padding: '12px 24px', border: 'none', backgroundColor: 'white', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, border: '1px solid var(--border-color)', cursor: 'pointer' }}>Materi</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Book color="var(--primary)" /> Penilaian Bacaan Tilawati
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Hanya menampilkan anak yang hadir hari ini.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ padding: '8px 24px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'white', fontWeight: 600, cursor: 'pointer' }}>Buka Semua</button>
              <button style={{ padding: '8px', borderRadius: '10px', border: '1px solid #FEE2E2', backgroundColor: '#FEF2F2', color: '#EF4444', cursor: 'pointer' }}>
                  <Trash2 size={20} />
              </button>
          </div>
      </div>

      {/* Status Bar */}
      <div style={{ backgroundColor: 'white', padding: '16px 24px', borderRadius: '12px', marginBottom: '32px', border: '1px solid var(--border-color)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', gap: '24px' }}>
          <span style={{ color: 'var(--text-muted)' }}>RINGKASAN:</span>
          <span style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>● {students.filter(s => s.status === 'naik').length} Naik</span>
          <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>● {students.filter(s => s.status === 'ulang').length} Ulang</span>
          <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>● {students.filter(s => s.status === 'belum').length} Belum Dinilai</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {loading ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                  <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
                  <p style={{ fontWeight: 800 }}>Memuat Data Siswa Aktif...</p>
              </div>
          ) : students.map(student => (
              <div key={student.id} style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  border: '1px solid',
                  borderColor: student.status === 'naik' ? 'var(--secondary)' : (student.status === 'ulang' ? 'var(--danger)' : 'var(--border-color)'),
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)'
              }}>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700 }}>
                          {student.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{student.name}</h3>
                          <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 800 }}>{student.type}</span>
                      </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                      <div style={{ position: 'relative' }}>
                          <select 
                              value={student.jilid}
                              onChange={(e) => updateStudent(student.id, 'jilid', e.target.value)}
                              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', fontWeight: 600, appearance: 'none' }}
                          >
                              {['Jilid 1', 'Jilid 2', 'Jilid 3', 'Jilid 4', 'Jilid 5', 'Jilid 6', 'Al-Quran'].map(j => <option key={j} value={j}>{j}</option>)}
                          </select>
                          <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                      </div>
                      <input 
                          type="text" placeholder="Hal" 
                          value={student.hal}
                          onChange={(e) => updateStudent(student.id, 'hal', e.target.value)}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', fontWeight: 600, textAlign: 'center' }} 
                      />
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <button 
                          onClick={() => handleAction(student.id, 'ulang')}
                          style={{ 
                              padding: '10px', borderRadius: '8px', border: '1px solid',
                              borderColor: student.status === 'ulang' ? 'var(--danger)' : '#FEE2E2',
                              backgroundColor: student.status === 'ulang' ? 'var(--danger)' : 'transparent',
                              color: student.status === 'ulang' ? 'white' : 'var(--danger)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700, cursor: 'pointer'
                          }}
                      >
                          <RefreshCcw size={14} /> ULANG
                      </button>
                      <button 
                          onClick={() => handleAction(student.id, 'naik')}
                          style={{ 
                              padding: '10px', borderRadius: '8px', border: '1px solid',
                              borderColor: student.status === 'naik' ? 'var(--secondary)' : '#D1FAE5',
                              backgroundColor: student.status === 'naik' ? 'var(--secondary)' : 'transparent',
                              color: student.status === 'naik' ? 'white' : 'var(--secondary)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700, cursor: 'pointer'
                          }}
                      >
                          <Save size={14} /> NAIK
                      </button>
                  </div>
              </div>
          ))}
      </div>

      {/* 🚀 FLOATING PREMIUM SAVE (Standardized for all modules) */}
      <div className="premium-save-bar">
          <button onClick={handleSaveAll} style={{ 
              color: 'white', border: 'none', padding: '14px 48px', 
              borderRadius: '35px', fontWeight: 900, cursor: 'pointer', display: 'flex', 
              alignItems: 'center', gap: '12px', 
              fontSize: '1rem', whiteSpace: 'nowrap', minWidth: '220px', justifyContent: 'center' 
          }}>
            {saved ? <CheckCircle2 size={22} color="#5AE2A3" /> : <Save size={22} />}
            {saved ? 'Tersimpan!' : 'Simpan Semua Nilai'}
          </button>
      </div>
      <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
