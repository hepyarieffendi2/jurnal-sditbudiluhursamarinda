import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { Book, Save, RefreshCcw, ChevronDown, CheckCircle2, LayoutGrid, Users, History, ArrowUpDown, Clock, Calendar, AlertCircle } from 'lucide-react';

export default function TilawatiTracker() {
  const [students, setStudents] = useState([]);
  const [historyMap, setHistoryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [sortType, setSortType] = useState('name'); // 'name' or 'progress'
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch Students and Their History
  useEffect(() => {
    const fetchTilawatiData = async () => {
      setLoading(true);
      try {
        // 1. Get active students
        const qS = query(collection(db, 'students'), where('status', '==', 'active'));
        const snapS = await getDocs(qS);
        const allStudents = snapS.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 2. Get Presence for today (to identify non-present students)
        const presensi = JSON.parse(localStorage.getItem('presensi_hari_ini') || '[]');
        
        // 3. Fetch History for each student (Fallback sorting in-memory to avoid Index requirements)
        const historyObj = {};
        const updatedStudents = await Promise.all(allStudents.map(async (student) => {
            try {
                // Fetch records without orderBy first to bypass composite index error
                const qH = query(
                    collection(db, 'jurnal_tilawati'),
                    where('muridId', '==', student.id)
                );
                const snapH = await getDocs(qH);
                
                // Sort in memory (last 10)
                const allHistory = snapH.docs.map(d => ({ id: d.id, ...d.data() }));
                allHistory.sort((a, b) => {
                    const timeA = a.tanggal?.seconds || 0;
                    const timeB = b.tanggal?.seconds || 0;
                    return timeB - timeA; // Descending (Newest first)
                });

                const history = allHistory.slice(0, 10);
                historyObj[student.id] = [...history].reverse(); // Chronological for dots

                // Auto-logic for Page Recommendation
                const lastRecord = history.find(h => h.status === 'naik' || h.status === 'ulang');
                let suggestedJilid = student.tilawatiJilid || 'Jilid 1';
                let suggestedHal = student.tilawatiHal || '1';

                if (lastRecord) {
                    suggestedJilid = lastRecord.jilid;
                    if (lastRecord.status === 'naik') {
                        const nextHal = parseInt(lastRecord.hal) + 1;
                        suggestedHal = isNaN(nextHal) ? lastRecord.hal : nextHal.toString();
                    } else {
                        suggestedHal = lastRecord.hal;
                    }
                }

                const pStatus = presensi.find(p => p.id === student.id)?.status || 'hadir';

                return {
                    ...student,
                    jilid: suggestedJilid,
                    hal: suggestedHal,
                    inputStatus: 'belum',
                    presenceStatus: pStatus
                };
            } catch (err) {
                console.warn(`History failed for ${student.name}:`, err.message);
                return { ...student, jilid: 'Jilid 1', hal: '1', inputStatus: 'belum', presenceStatus: 'hadir' };
            }
        }));

        setHistoryMap(historyObj);
        setStudents(updatedStudents);
      } catch (err) {
        console.error("Error fetching tilawati:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTilawatiData();
  }, []);

  const updateStudent = (id, field, value) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleAction = (id, result) => {
    updateStudent(id, 'inputStatus', result);
  };

  const handleSaveAll = async () => {
    const toSave = students.filter(s => s.inputStatus !== 'belum');
    if (toSave.length === 0) return;

    setLoading(true);
    try {
        for (const s of toSave) {
            await addDoc(collection(db, 'jurnal_tilawati'), {
                muridId: s.id,
                murid: s.name,
                jilid: s.jilid,
                hal: s.hal,
                status: s.inputStatus,
                tanggal: serverTimestamp(),
                guru: "Ustadzah"
            });
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    } catch (e) {
        console.error(e);
        alert("Gagal menyimpan data.");
    } finally {
        setLoading(false);
    }
  };

  // Sorting Logic
  const jilidOrder = ['Jilid 1', 'Jilid 2', 'Jilid 3', 'Jilid 4', 'Jilid 5', 'Jilid 6', 'Al-Quran'];
  const sortedStudents = [...students].sort((a, b) => {
      if (sortType === 'name') return a.name.localeCompare(b.name);
      
      const aIdx = jilidOrder.indexOf(a.jilid);
      const bIdx = jilidOrder.indexOf(b.jilid);
      if (aIdx !== bIdx) return bIdx - aIdx; // Highest progress first
      return (parseInt(b.hal) || 0) - (parseInt(a.hal) || 0);
  });

  // History Dot Component
  const HistoryDots = ({ muridId, currentPresence }) => {
      const history = historyMap[muridId] || [];
      // If student is Sakit/Izin today, we can show it as the last dot (hypothetically)
      // but usually history is past records.
      return (
          <div style={{ display: 'flex', gap: '3px', marginTop: '8px' }}>
              {history.map((h, i) => {
                  const color = h.status === 'naik' ? '#10B981' : (h.status === 'ulang' ? '#EF4444' : '#94A3B8');
                  const label = h.status === 'naik' ? 'N' : 'U';
                  return (
                      <div key={i} title={`${h.jilid} Hal ${h.hal}`} style={{ 
                          width: '18px', height: '18px', borderRadius: '4px', background: color, 
                          color: 'white', fontSize: '0.6rem', fontWeight: 900, display: 'flex', 
                          alignItems: 'center', justifyContent: 'center' 
                      }}>
                          {label}
                      </div>
                  );
              })}
              {history.length === 0 && <span style={{ fontSize: '0.6rem', color: '#94A3B8', fontStyle: 'italic' }}>Belum ada histori</span>}
          </div>
      );
  };

  return (
    <div className="page-container" style={{ paddingBottom: '120px' }}>
      
      {/* 🟢 HEADER & SORTING TOOLBAR */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: 900, marginBottom: '8px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
               <Book size={16} /> Sesi Tilawati Quran
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#1E293B', margin: 0 }}>Progress Mengaji</h2>
            <p style={{ color: '#64748B', fontWeight: 700, marginTop: '4px' }}>Halaman direkomendasikan otomatis dari rekam terakhir.</p>
          </div>

          <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <button 
                onClick={() => setSortType('name')}
                style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: sortType === 'name' ? 'white' : 'transparent', color: sortType === 'name' ? 'var(--primary)' : '#64748B', fontWeight: 900, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: sortType === 'name' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none' }}
              >
                  <ArrowUpDown size={14} /> NAMA A-Z
              </button>
              <button 
                onClick={() => setSortType('progress')}
                style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: sortType === 'progress' ? 'white' : 'transparent', color: sortType === 'progress' ? 'var(--primary)' : '#64748B', fontWeight: 900, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: sortType === 'progress' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none' }}
              >
                  <TrendingUpIcon size={14} /> PROGRESS TERJAUH
              </button>
          </div>
      </div>

      {/* 🔴 STUDENT GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {loading ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0' }}>
                  <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
                  <p style={{ fontWeight: 800, color: '#64748B' }}>Menyiapkan Daftar Simakan...</p>
              </div>
          ) : sortedStudents.map(student => {
              const isNotPresent = student.presenceStatus && student.presenceStatus !== 'hadir';
              
              return (
              <div key={student.id} style={{ 
                  backgroundColor: isNotPresent ? '#F8FAFC' : 'white', 
                  borderRadius: '24px', 
                  border: '1.5px solid',
                  borderColor: student.inputStatus === 'naik' ? '#10B981' : (student.inputStatus === 'ulang' ? '#EF4444' : '#F1F5F9'),
                  padding: '24px',
                  opacity: isNotPresent ? 0.7 : 1,
                  position: 'relative',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s'
              }}>
                  {/* Presence Status Overlay for absent kids */}
                  {isNotPresent && (
                      <div style={{ position: 'absolute', top: 12, right: 12, background: '#FEE2E2', color: '#EF4444', padding: '4px 8px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', border: '1px solid #FECACA' }}>
                        {student.presenceStatus === 'izin' ? 'IZIN' : student.presenceStatus === 'sakit' ? 'SAKIT' : 'ALFA'}
                      </div>
                  )}

                  <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: isNotPresent ? '#E2E8F0' : 'var(--primary-light)', color: isNotPresent ? '#94A3B8' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 950, border: '1.5px solid rgba(0,0,0,0.05)' }}>
                          {student.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 950, color: '#1E293B', margin: 0, lineHeight: 1.2 }}>{student.name}</h3>
                          <HistoryDots muridId={student.id} currentPresence={student.presenceStatus} />
                      </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px', marginBottom: '24px' }}>
                      <div style={{ position: 'relative' }}>
                          <select 
                              value={student.jilid}
                              disabled={isNotPresent}
                              onChange={(e) => updateStudent(student.id, 'jilid', e.target.value)}
                              style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #F1F5F9', backgroundColor: '#F8FAFC', fontWeight: 800, color: '#334155', appearance: 'none', fontSize: '0.9rem' }}
                          >
                              {jilidOrder.map(j => <option key={j} value={j}>{j}</option>)}
                          </select>
                          <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94A3B8' }} />
                      </div>
                      <div style={{ position: 'relative' }}>
                          <input 
                              type="number" placeholder="Hal" 
                              disabled={isNotPresent}
                              value={student.hal}
                              onChange={(e) => updateStudent(student.id, 'hal', e.target.value)}
                              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #F1F5F9', backgroundColor: '#F8FAFC', fontWeight: 900, color: '#1E293B', textAlign: 'center', fontSize: '0.9rem' }} 
                          />
                          <div style={{ position: 'absolute', top: -8, left: 10, background: 'white', padding: '0 4px', fontSize: '0.6rem', fontWeight: 900, color: 'var(--primary)' }}>HALAMAN</div>
                      </div>
                  </div>

                  <div style={{ borderTop: '1.5px solid #F1F5F9', paddingTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <button 
                          disabled={isNotPresent}
                          onClick={() => handleAction(student.id, 'ulang')}
                          style={{ 
                              padding: '12px', borderRadius: '12px', border: 'none',
                              backgroundColor: student.inputStatus === 'ulang' ? '#EF4444' : '#FEF2F2',
                              color: student.inputStatus === 'ulang' ? 'white' : '#EF4444',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 900, cursor: 'pointer', fontSize: '0.75rem', transition: '0.2s'
                          }}
                      >
                          <RefreshCcw size={16} /> ULANG
                      </button>
                      <button 
                          disabled={isNotPresent}
                          onClick={() => handleAction(student.id, 'naik')}
                          style={{ 
                              padding: '12px', borderRadius: '12px', border: 'none',
                              backgroundColor: student.inputStatus === 'naik' ? '#10B981' : '#ECFDF5',
                              color: student.inputStatus === 'naik' ? 'white' : '#10B981',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 900, cursor: 'pointer', fontSize: '0.75rem', transition: '0.2s'
                          }}
                      >
                          <CheckCircle2 size={16} /> NAIK
                      </button>
                  </div>
              </div>
              );
          })}
      </div>

      {/* 🚀 FLOATING PREMIUM SAVE */}
      <div className="premium-save-bar">
          <button onClick={handleSaveAll} disabled={loading || students.every(s => s.inputStatus === 'belum')} style={{ 
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
              color: 'white', border: 'none', padding: '16px 48px', 
              borderRadius: '40px', fontWeight: 900, cursor: 'pointer', display: 'flex', 
              alignItems: 'center', gap: '14px', 
              fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(79, 70, 229, 0.4)', transition: 'all 0.3s'
          }}>
            {saved ? <CheckCircle2 size={24} color="#5AE2A3" /> : (loading ? <RefreshCcw size={24} className="animate-spin" /> : <Save size={24} />)}
            {saved ? 'Tersimpan!' : 'Simpan Semua Progress'}
          </button>
      </div>

      <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}

const TrendingUpIcon = ({ size }) => <Users size={size} />; // Fallback icon for progress

// File cleaned and verified by AI.
