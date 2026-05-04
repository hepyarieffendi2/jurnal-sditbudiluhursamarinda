import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { BarChart3, ChevronLeft, Users, Calendar, GraduationCap, Loader2, BookOpen, Activity, TrendingUp, Eye } from 'lucide-react';
import { useAuth, ROLES, isKepsek } from '../context/AuthContext';

export default function LaporanSekolah() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [rooms, setRooms] = useState([]);
    const [students, setStudents] = useState([]);
    const [jurnalStats, setJurnalStats] = useState({ today: 0, week: 0, total: 0 });
    const [selectedRoom, setSelectedRoom] = useState('Semua');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Rooms
                const snapR = await getDocs(collection(db, 'master_rombel'));
                let rData = snapR.docs.map(d => ({ id: d.id, ...d.data() }));
                rData.sort((a, b) => (a.level || '').localeCompare(b.level || ''));
                setRooms(rData);

                // Students
                const qS = query(collection(db, 'students'), where('status', '==', 'active'));
                const snapS = await getDocs(qS);
                setStudents(snapS.docs.map(d => ({ id: d.id, ...d.data() })));

                // Jurnal stats
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                weekAgo.setHours(0, 0, 0, 0);

                try {
                    const snapAll = await getDocs(collection(db, 'jurnal_aktivitas'));
                    const allJurnals = snapAll.docs.map(d => d.data());
                    const todayCount = allJurnals.filter(j => j.tanggal?.toDate?.() >= today || (j.tanggal && new Date(j.tanggal) >= today)).length;
                    const weekCount = allJurnals.filter(j => j.tanggal?.toDate?.() >= weekAgo || (j.tanggal && new Date(j.tanggal) >= weekAgo)).length;
                    setJurnalStats({ today: todayCount, week: weekCount, total: allJurnals.length });
                } catch (e) {}
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredStudents = selectedRoom === 'Semua' 
        ? students 
        : students.filter(s => s.rombel === selectedRoom);

    const studentsPerRoom = rooms.map(r => ({
        ...r,
        count: students.filter(s => s.rombel === r.name).length
    }));

    return (
        <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto', animation: 'fadeIn 0.5s', fontFamily: "'Inter', sans-serif" }}>
            
            {/* HEADER */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'white', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#64748B' }}>
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', padding: '10px', borderRadius: '14px', color: 'white', display: 'flex' }}>
                            <BarChart3 size={24} />
                        </div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 950, margin: 0, color: '#1E293B' }}>Laporan Sekolah</h1>
                    </div>
                    <p style={{ color: '#64748B', fontWeight: 600, margin: 0 }}>Ringkasan data operasional seluruh kelas.</p>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <Loader2 size={32} color="#7C3AED" className="animate-spin" />
                    <span style={{ fontWeight: 700, color: '#64748B' }}>Memuat laporan...</span>
                </div>
            ) : (
                <>
                    {/* 📊 SUMMARY STATS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                        {[
                            { title: 'Total Murid', value: students.length, icon: Users, color: '#10B981' },
                            { title: 'Jumlah Kelas', value: rooms.length, icon: GraduationCap, color: '#F59E0B' },
                            { title: 'Jurnal Hari Ini', value: jurnalStats.today, icon: Activity, color: '#6366F1' },
                            { title: 'Jurnal Minggu Ini', value: jurnalStats.week, icon: TrendingUp, color: '#EC4899' },
                        ].map((item, i) => (
                            <div key={i} style={{ padding: '20px', background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <item.icon size={22} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 950, color: '#1E293B' }}>{item.value}</div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>{item.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 🏫 PER-ROOM BREAKDOWN */}
                    <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: '32px' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <GraduationCap size={20} color="#7C3AED" />
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#1E293B' }}>Distribusi Murid per Kelas</h3>
                            </div>
                        </div>
                        <div style={{ padding: '24px' }}>
                            {studentsPerRoom.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                    {studentsPerRoom.map(room => (
                                        <div key={room.id} style={{ padding: '16px 20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ backgroundColor: '#EDE9FE', color: '#7C3AED', fontSize: '0.7rem', fontWeight: 900, padding: '4px 8px', borderRadius: '6px' }}>{room.level}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.9rem' }}>{room.name}</div>
                                            </div>
                                            <div style={{ fontWeight: 950, color: '#7C3AED', fontSize: '1.2rem' }}>{room.count}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontWeight: 700 }}>Belum ada kelas terdaftar.</div>
                            )}
                        </div>
                    </div>

                    {/* 📋 STUDENT TABLE BY ROOM */}
                    <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Eye size={20} color="#7C3AED" />
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#1E293B' }}>Data Murid</h3>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8' }}>({filteredStudents.length} murid)</span>
                            </div>
                            <select value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)}
                                style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontWeight: 700, outline: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                                <option value="Semua">Semua Kelas</option>
                                {rooms.map(r => (
                                    <option key={r.id} value={r.name}>{r.level ? `${r.level} - ` : ''}{r.name}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {filteredStudents.map((s, idx) => (
                                <div key={s.id} style={{ padding: '14px 24px', borderBottom: idx < filteredStudents.length - 1 ? '1px solid #F8FAFC' : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#475569', fontSize: '0.8rem' }}>
                                        {s.name?.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.9rem' }}>{s.name}</div>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', background: '#F1F5F9', padding: '4px 10px', borderRadius: '6px' }}>
                                        {s.rombel || 'Belum ada kelas'}
                                    </span>
                                </div>
                            ))}
                            {filteredStudents.length === 0 && (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontWeight: 700 }}>Tidak ada data murid.</div>
                            )}
                        </div>
                    </div>
                </>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
