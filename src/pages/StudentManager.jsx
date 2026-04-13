import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import { Search, Save, User, MapPin, Loader2, CheckCircle2, ChevronLeft, Plus, X, Settings2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StudentManager() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Rombel CRUD states
  const [showRoomManager, setShowRoomManager] = useState(false);
  const JENJANG_LIST = ['K1', 'K2', 'K3', 'K4', 'K5', 'K6'];
  const [newRoomLevel, setNewRoomLevel] = useState('K1');
  const [newRoomName, setNewRoomName] = useState('');

  // Room EDIT states
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [tempRoomName, setTempRoomName] = useState('');
  const [tempRoomLevel, setTempRoomLevel] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Students
      let sData = [];
      try {
        const qS = query(collection(db, 'students'), where('status', '==', 'active'));
        const snapS = await getDocs(qS);
        sData = snapS.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) {}
      
      if (sData.length > 0) {
          sData.sort((a, b) => a.name.localeCompare(b.name));
          setStudents(sData);
      }

      // 2. Fetch Master Rombel
      try {
        const snapR = await getDocs(collection(db, 'master_rombel'));
        let rData = snapR.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // SORT BY JENJANG then NAME
        rData.sort((a, b) => {
            if ((a.level || '') !== (b.level || '')) return (a.level || '').localeCompare(b.level || '');
            return (a.name || '').localeCompare(b.name || '');
        });

        setRooms(rData);
        localStorage.setItem('master_rombel_local', JSON.stringify(rData));
      } catch (e) {
        const legacy = localStorage.getItem('master_rombel_local');
        setRooms(legacy ? JSON.parse(legacy) : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStudentRombel = async (id, value) => {
    try {
      const selectedRoom = rooms.find(r => r.name === value);
      const levelNum = selectedRoom?.level?.replace('K', '') || '';

      setStudents(prev => prev.map(s => s.id === id ? { ...s, rombel: value, grade: levelNum } : s));
      try {
        await updateDoc(doc(db, 'students', id), { 
            rombel: value,
            grade: levelNum // Sync grade with selected room level
        });
      } catch (e) {}
      triggerSuccess();
    } catch (err) { console.error(err); }
  };

  const handleAddRoom = async () => {
    const val = newRoomName.trim();
    if(!val) return;

    try {
        await addDoc(collection(db, 'master_rombel'), { name: val, level: newRoomLevel });
        setNewRoomName('');
        fetchData();
        triggerSuccess();
    } catch (e) { 
        // Fallback local if firebase fails
        const newRoomObj = { id: 'temp_' + Date.now(), name: val, level: newRoomLevel };
        const updatedRooms = [...rooms, newRoomObj].sort((a,b) => (a.level||'').localeCompare(b.level||''));
        setRooms(updatedRooms);
        localStorage.setItem('master_rombel_local', JSON.stringify(updatedRooms));
        setNewRoomName('');
        triggerSuccess(); 
    }
  };

  const handleUpdateRoom = async (roomId) => {
    try {
        await updateDoc(doc(db, 'master_rombel', roomId), { name: tempRoomName, level: tempRoomLevel });
        setEditingRoomId(null);
        fetchData();
        triggerSuccess();
    } catch (e) { console.error(e); }
  };

  const handleDeleteRoom = async (roomId) => {
    if(!window.confirm('Hapus nama kelas ini?')) return;
    try {
        if (!String(roomId).startsWith('temp_')) await deleteDoc(doc(db, 'master_rombel', roomId));
        fetchData();
    } catch (e) {
        const updatedRooms = rooms.filter(r => r.id !== roomId);
        setRooms(updatedRooms);
        localStorage.setItem('master_rombel_local', JSON.stringify(updatedRooms));
    }
  };

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  }

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.rombel && s.rombel.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.5s' }}>
      
      {showSuccess && (
        <div style={{ position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#10B981', color: 'white', padding: '12px 24px', borderRadius: '100px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', zIndex: 9999, boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)' }}>
            <CheckCircle2 size={20} /> Perubahan Berhasil Disimpan!
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: 'white', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#64748B' }}>
               <ChevronLeft size={20} />
            </button>
            <div>
               <h1 style={{ fontSize: '1.8rem', fontWeight: 950, margin: 0, color: '#1E293B' }}>Manajemen Siswa</h1>
               <p style={{ color: '#64748B', fontWeight: 600, marginTop: '4px' }}>Data Administrasi Rombel & Jenjang Sekolah.</p>
            </div>
         </div>
         <button 
           onClick={() => setShowRoomManager(!showRoomManager)}
           style={{ backgroundColor: showRoomManager ? '#4F46E5' : 'white', color: showRoomManager ? 'white' : '#4F46E5', border: '1px solid #C7D2FE', padding: '12px 20px', borderRadius: '16px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
         >
            <Settings2 size={18} /> {showRoomManager ? 'Tutup Pengaturan' : 'Kelola Daftar Kelas'}
         </button>
      </div>

      {/* 🏛️ ROOM MANAGER PANEL (CRUD) */}
      {showRoomManager && (
          <div style={{ backgroundColor: '#EEF2FF', borderRadius: '24px', padding: '32px', marginBottom: '32px', border: '1px solid #C7D2FE', animation: 'slideDown 0.3s' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 950, color: '#1E293B' }}>Kelola Daftar Kelas & Jenjang</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px', fontWeight: 600 }}>Tentukan jenjang (K1-K6) dan nama kelas spesifik untuk mempermudah monitoring.</p>
                
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '120px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#4F46E5', marginBottom: '4px', display: 'block' }}>JENJANG</label>
                      <select 
                        value={newRoomLevel} 
                        onChange={e => setNewRoomLevel(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #C7D2FE', fontWeight: 700, outline: 'none' }}
                      >
                         {JENJANG_LIST.map(j => <option key={j} value={j}>{j}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 3, minWidth: '200px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#4F46E5', marginBottom: '4px', display: 'block' }}>NAMA KELAS (ROMBEL)</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Kelas 1 (A), Al-Fatih 1, dsb" 
                        value={newRoomName} 
                        onChange={e => setNewRoomName(e.target.value)}
                        style={{ width: '100%', padding: '12px 20px', borderRadius: '14px', border: '1px solid #C7D2FE', fontWeight: 700, outline: 'none' }}
                      />
                    </div>
                    <button onClick={handleAddRoom} style={{ backgroundColor: '#4F46E5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: 900, cursor: 'pointer', marginTop: 'auto', alignSelf: 'flex-end', height: '48px' }}>
                        + Tambah
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                    {rooms.map(room => (
                        <div key={room.id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #C7D2FE', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            {editingRoomId === room.id ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <select 
                                      value={tempRoomLevel} 
                                      onChange={e => setTempRoomLevel(e.target.value)}
                                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #4F46E5', fontWeight: 700 }}
                                    >
                                        {JENJANG_LIST.map(j => <option key={j} value={j}>{j}</option>)}
                                    </select>
                                    <input 
                                      value={tempRoomName} 
                                      onChange={e => setTempRoomName(e.target.value)}
                                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #4F46E5', fontWeight: 700 }}
                                    />
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                        <button onClick={() => handleUpdateRoom(room.id)} style={{ flex: 1, backgroundColor: '#4F46E5', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>Simpan</button>
                                        <button onClick={() => setEditingRoomId(null)} style={{ flex: 1, backgroundColor: '#F1F5F9', color: '#64748B', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>Batal</button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ backgroundColor: '#4F46E5', color: 'white', fontSize: '0.7rem', fontWeight: 900, padding: '4px 8px', borderRadius: '6px' }}>{room.level}</div>
                                    <span style={{ fontWeight: 800, color: '#1E293B', flex: 1 }}>{room.name}</span>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button 
                                          onClick={() => { setEditingRoomId(room.id); setTempRoomName(room.name); setTempRoomLevel(room.level); }}
                                          style={{ border: 'none', background: 'none', color: '#4F46E5', cursor: 'pointer', fontWeight: 800, fontSize: '0.75rem' }}
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteRoom(room.id)} style={{ border: 'none', background: 'none', color: '#F43F5E', cursor: 'pointer', display: 'flex' }}>
                                            <X size={16}/>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
          </div>
      )}

      {/* SEARCH BAR */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
          <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={20} />
          <input 
            type="text" 
            placeholder="Cari nama siswa..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '16px 16px 16px 52px', border: '1px solid #E2E8F0', borderRadius: '24px', fontSize: '1rem', fontWeight: 700, outline: 'none', color: '#1E293B' }}
          />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
           <Loader2 size={32} className="animate-spin" color="#4F46E5" />
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 240px', fontSize: '0.75rem', fontWeight: 900, color: '#64748B', letterSpacing: '1px' }}>
             <span>NAMA SISWA</span>
             <span>SETEL JENJANG & ROMBEL</span>
          </div>
          {filteredStudents.map((s, idx) => (
            <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1fr 240px', alignItems: 'center', padding: '16px 24px', borderBottom: idx === filteredStudents.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', fontWeight: 900 }}>
                     {s.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ fontWeight: 800, color: '#1E293B' }}>{s.name}</div>
                        {s.grade && (
                            <div style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', fontSize: '0.65rem', fontWeight: 900, padding: '2px 6px', borderRadius: '4px' }}>
                                K{s.grade}
                            </div>
                        )}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>{s.nis || `ID: ${s.id.substring(0,6)}`}</div>
                  </div>
               </div>

               <div>
                   <select 
                     value={s.rombel || ''} 
                     onChange={(e) => handleUpdateStudentRombel(s.id, e.target.value)}
                     style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '2px solid transparent', backgroundColor: s.rombel ? '#F0FDF4' : '#FFF1F2', color: s.rombel ? '#047857' : '#E11D48', fontWeight: 900, fontSize: '0.82rem', cursor: 'pointer', outline: 'none', transition: 'all 0.2s' }}
                     onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                     onBlur={(e) => e.target.style.borderColor = 'transparent'}
                   >
                       <option value="">-- Pilih Rombel --</option>
                       {rooms.map(r => (
                           <option key={r.id} value={r.name}>
                               {r.level ? `${r.level} - ` : ''}{r.name}
                           </option>
                       ))}
                   </select>
               </div>
            </div>
          ))}
          {filteredStudents.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontWeight: 700 }}>Data tidak ditemukan.</div>}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
