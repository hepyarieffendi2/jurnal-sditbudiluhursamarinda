import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {
    Users, UserCheck, BookOpen, TrendingUp, ChevronRight, MessageSquare,
    Search, MoreHorizontal, Target, LayoutGrid, GraduationCap,
    Sparkles, CheckCircle2, ArrowRightCircle, Info, Calendar as LucideCalendar, Heart, Book, Activity, Clock as LucideClock
} from 'lucide-react';

const QuickStat = ({ title, value, icon: Icon, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'white', borderRadius: '20px', flex: 1, border: '1px solid #F1F5F9' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={20} />
        </div>
        <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#2D3436' }}>{value}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{title}</div>
        </div>
    </div>
);

export default function GuruDashboard() {
    const [shelfCount, setShelfCount] = useState(0);
    const [studentCount, setStudentCount] = useState(0);
    const [presentCount, setPresentCount] = useState(0);
    const [jurnalCount, setJurnalCount] = useState(0);
    const [observedIds, setObservedIds] = useState(new Set());
    const [logs, setLogs] = useState([]);
    const [showGuideModal, setShowGuideModal] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Load Presence & Student Stats
                const presence = JSON.parse(localStorage.getItem('presensi_hari_ini') || '[]');
                setPresentCount(presence.filter(p => p.status === 'hadir').length);

                const qStudents = query(collection(db, 'students'), where('status', '==', 'active'));
                const snapStudents = await getDocs(qStudents);
                setStudentCount(snapStudents.size);

                // 2. Shelf Stats (Current Room Fallback)
                const s1 = JSON.parse(localStorage.getItem('sentra_shelf_Kelas 1') || '[]');
                setShelfCount(s1.length);

                // 3. Fetch Today's Jurnal Logs
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const qJurnal = query(
                    collection(db, 'jurnal_aktivitas'),
                    where('tanggal', '>=', today)
                );
                const snapJurnal = await getDocs(qJurnal);
                const dataJurnal = snapJurnal.docs.map(d => d.data());

                const uniqueObserved = new Set(dataJurnal.map(l => l.muridId));
                setObservedIds(uniqueObserved);
                setLogs(dataJurnal);
                setJurnalCount(snapJurnal.size);
            } catch (err) {
                console.error("Error dashboard:", err);
            }
        };
        fetchDashboardData();
    }, []);

    const progressPercent = studentCount > 0 ? Math.round((observedIds.size / studentCount) * 100) : 0;

    return (
        <div style={{ animation: 'fadeIn 0.5s', maxWidth: '1200px', margin: '0 auto', paddingBottom: '120px' }}>

            {/* 🌟 PREMIUM HEADER: PROGRESS COMMAND */}
            <div style={{ marginBottom: '40px', background: 'white', padding: '32px', borderRadius: '32px', border: '1.5px solid #F1F5F9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px' }}>
                            <Sparkles size={16} /> Dashboard Guru Pendidik
                        </div>
                        <h1 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#0F172A', margin: 0, letterSpacing: '-1px' }}>
                            Siklus Observasi <span style={{ color: 'var(--primary)' }}>Hari Ini</span>
                        </h1>
                        <p style={{ color: '#64748B', fontWeight: 700, marginTop: '8px', fontSize: '1.05rem' }}>
                            Kelola lingkungan dan rekam perkembangan jiwa murid Anda.
                        </p>
                    </div>

                    {/* Progress Tracker Widget */}
                    <div style={{ width: '280px', background: '#F8FAFC', padding: '24px', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontWeight: 900, fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase' }}>Progres Observasi</span>
                            <span style={{ fontWeight: 950, fontSize: '1.1rem', color: 'var(--primary)' }}>{progressPercent}%</span>
                        </div>
                        <div style={{ height: '10px', background: '#E2E8F0', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
                            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #6366F1, #4F46E5)', borderRadius: '10px', transition: 'width 1s ease' }}></div>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B' }}>
                            {observedIds.size} dari {studentCount} murid telah terekam.
                        </div>
                    </div>
                </div>
            </div>

            {/* 🚀 TEACHER CYCLE (CENTERED ACTION) */}
            <div style={{ marginBottom: '48px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                       <LucideClock size={14} /> Siklus Harian (Selesaikan Sesi)
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    {/* Card 1: THE BIG HERO (Action) */}
                    <Link to="/eksplorasi" style={{ textDecoration: 'none', flex: '2', minWidth: '350px' }}>
                        <div className="card-soft cycle-card hero-action" style={{
                            padding: '40px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                            color: 'white', borderRadius: '32px', height: '100%', position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, color: 'white' }}>
                                <Activity size={200} />
                            </div>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Target size={28} />
                                    </div>
                                    <span style={{ fontWeight: 900, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.7 }}>Aksi Observasi</span>
                                </div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '12px' }}>Radar Observasi</h2>
                                <p style={{ fontSize: '1.1rem', opacity: 0.8, fontWeight: 600, maxWidth: '400px', lineHeight: 1.5 }}>
                                    Input data harian murid segera setelah sesi sentra berakhir untuk menjaga akurasi 5 Pilar AMI.
                                </p>
                                <div style={{ marginTop: '32px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'white', color: '#0F172A', borderRadius: '100px', fontWeight: 950 }}>
                                    Input Jurnal Harian <ArrowRightCircle size={20} />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Sidebar Actions Column */}
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '300px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '1px', margin: '8px 0' }}>
                           <LayoutGrid size={14} /> Persiapan Lingkungan
                        </div>

                        <Link to="/eksplorasi" style={{ textDecoration: 'none' }}>
                            <div className="card-soft cycle-card" style={{ padding: '20px', background: '#F8FAFC', border: '1.5px solid #F1F5F9' }}>
                                <LayoutGrid size={20} color="#64748B" style={{ marginBottom: '12px' }} />
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 900, color: '#1E293B' }}>Siapkan Rak Kelas</h3>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Update isi aparatus fisik di rak sentra Bunda.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 📊 PEDAGOGICAL INSIGHTS (CLASS SNAPSHOT) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <QuickStat title="Kehadiran Murid" value={`${presentCount}/${studentCount || '...'}`} icon={UserCheck} color="#10B981" />
                <QuickStat title="Log Sesi Ini" value={jurnalCount} icon={Activity} color="#6366F1" />
                <QuickStat title="Ketenangan Kelas" value={logs.filter(l => l.mood === 'Tenang').length > logs.filter(l => l.mood === 'Frustrasi').length ? 'Kondusif' : 'Perlu Pendampingan'} icon={Heart} color="#EC4899" />
            </div>


            {/* 📘 TEACHER LEARNING & MISSION (THE SPIRIT) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
                <div className="card-soft" style={{ padding: '32px', background: '#F0F9FF', border: '2px solid #B9E6FE', borderRadius: '32px' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#0EA5E9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <GraduationCap size={32} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 950, color: '#0369A1', margin: '0 0 4px 0' }}>Panduan Observasi Sentra</h3>
                            <p style={{ fontSize: '0.9rem', color: '#075985', fontWeight: 700, margin: '0 0 16px 0' }}>Pelajari standar observasi khusus melalui 5 pilar utama.</p>
                            <button onClick={() => setShowGuideModal(true)} style={{ background: 'white', color: '#0369A1', border: '1.5px solid #0EA5E9', padding: '10px 20px', borderRadius: '14px', fontWeight: 900, cursor: 'pointer', fontSize: '0.85rem' }}>Buka Panduan</button>
                        </div>
                    </div>
                </div>

                <div className="card-soft" style={{ padding: '32px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#475569', fontStyle: 'italic', margin: 0, fontWeight: 600 }}>
                        "Bantulah aku untuk melakukannya sendiri."
                    </p>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, marginTop: '12px', color: '#94A3B8', textTransform: 'uppercase' }}>— Kedewasaan & Mandiri</div>
                </div>
            </div>

            {/* 📗 AMI PILLARS MODAL (REUSED) */}
            {showGuideModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)', zIndex: 9999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowGuideModal(false)}>
                    <div style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '40px', padding: '40px', maxHeight: '95vh', overflowY: 'auto', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 950, color: '#1E293B', margin: 0 }}>5 Pilar Observasi Sentra</h2>
                            <p style={{ color: '#64748B', fontWeight: 600, marginTop: '8px' }}>Esensi dari mencatat perkembangan jiwa anak harian.</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { title: '1. Kematangan (P-W-M-N)', desc: 'Menilai apakah materi baru (P), sedang berlatih (W), sudah mahir (M), atau butuh bantuan guru (N).', icon: '🌟', color: '#FDF2F2' },
                                { title: '2. Konsentrasi', desc: 'Mencatat tingkat fokus: apakah baru eksplorasi, mulai asyik bekerja, atau sudah konsentrasi mendalam (Deep Focus).', icon: '🔥', color: '#FFFBEB' },
                                { title: '3. Konteks Sosial', desc: 'Melihat interaksi: apakah anak bekerja sendiri (Individual), berpasangan, atau bekerja kelompok (Collaborative).', icon: '👥', color: '#F0F9FF' },
                                { title: '4. Mood & Emosi', desc: 'Mendeteksi kondisi hati: Tenang, Ceria (sejahtera), atau Frustrasi (membutuhkan observasi lebih lanjut).', icon: '🧘', color: '#F0FDF4' },
                                { title: '5. Siklus & Restorasi', desc: 'Memastikan siklus kerja tuntas: apakah alat kembali dirapikan ke tempat asalnya dengan hormat.', icon: '✅', color: '#E0F2FE' }
                            ].map((pilar, i) => (
                                <div key={i} style={{ display: 'flex', gap: '16px', padding: '20px', background: pilar.color, borderRadius: '24px' }}>
                                    <div style={{ fontSize: '1.8rem' }}>{pilar.icon}</div>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 900, color: '#1E293B' }}>{pilar.title}</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, fontWeight: 600 }}>{pilar.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowGuideModal(false)} style={{ width: '100%', padding: '18px', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '20px', fontSize: '1.1rem', fontWeight: 900, marginTop: '24px', cursor: 'pointer' }}>Masya Allah, Mengerti</button>
                    </div>
                </div>
            )}

            <style>{`
          .cycle-card { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; }
          .cycle-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); }
          .hero-action:hover { transform: translateY(-8px) scale(1.01); box-shadow: 0 30px 60px rgba(15, 23, 42, 0.2); }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
        </div>
    );
}
