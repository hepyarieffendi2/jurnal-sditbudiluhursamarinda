import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, getDocs, query, where, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import {
    Users, UserCheck, TrendingUp, ChevronRight, GraduationCap,
    Sparkles, CheckCircle2, ArrowRightCircle, Calendar as LucideCalendar,
    Heart, Book, Activity, Clock as LucideClock, AlertCircle, Megaphone,
    Footprints, LayoutGrid, Package, VolumeX, Ear, Eye, Hourglass,
    MessageSquareOff, Handshake, Save, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Pondasi Ketenangan items (shared with CurriculumTimeline)
const NORMALIZATION_ITEMS = [
  { id: 'walking', icon: Footprints, color: '#10B981', label: 'Adab Berjalan di Dalam Kelas' },
  { id: 'restoring', icon: LayoutGrid, color: '#06B6D4', label: 'Merapikan Karpet & Kursi' },
  { id: 'carrying', icon: Package, color: '#F43F5E', label: 'Adab Membawa & Menyimpan Alat' },
  { id: 'voice', icon: VolumeX, color: '#6366F1', label: 'Volume Bicara & Silence Game' },
  { id: 'listening', icon: Ear, color: '#8B5CF6', label: 'Mendengar & Memperhatikan' },
  { id: 'watching', icon: Eye, color: '#F59E0B', label: 'Adab Menonton Teman Bekerja' },
  { id: 'waiting', icon: Hourglass, color: '#0EA5E9', label: 'Adab Menunggu Giliran' },
  { id: 'interrupt', icon: MessageSquareOff, color: '#EC4899', label: 'Interupsi & Memotong Pembicaraan' },
  { id: 'apology', icon: Handshake, color: '#D946EF', label: 'Meminta Maaf & Tabayyun' },
];

const RUTINITAS_STATUS = [
  { id: 'lancar', label: 'Lancar', emoji: '✅', color: '#10B981', bg: '#ECFDF5' },
  { id: 'perhatian', label: 'Perlu Perhatian', emoji: '⚠️', color: '#F59E0B', bg: '#FFFBEB' },
  { id: 'bermasalah', label: 'Bermasalah', emoji: '🔴', color: '#EF4444', bg: '#FEF2F2' },
];

export default function GuruDashboard() {
    const { user } = useAuth();
    const [studentCount, setStudentCount] = useState(0);
    const [presentCount, setPresentCount] = useState(0);
    const [jurnalCount, setJurnalCount] = useState(0);
    const [observedNames, setObservedNames] = useState(new Set());
    const [normStatus, setNormStatus] = useState({});
    const [shelfCount, setShelfCount] = useState(0);

    // Hutang presentasi summary
    const [hutangSummary, setHutangSummary] = useState(null);

    // Rutinitas state
    const [rutinPagi, setRutinPagi] = useState(null);
    const [rutinPulang, setRutinPulang] = useState(null);
    const [rutinNote, setRutinNote] = useState('');
    const [rutinSaved, setRutinSaved] = useState(false);

    const today = new Date();
    const dateStr = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const hour = today.getHours();
    const greeting = hour < 10 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : 'Selamat Sore';
    const todayKey = today.toISOString().split('T')[0];

    useEffect(() => {
        const fetchAll = async () => {
            // 1. Load Local Storage data first (instant & offline-friendly)
            const presence = JSON.parse(localStorage.getItem('presensi_hari_ini') || '[]');
            setPresentCount(presence.filter(p => p.status === 'hadir').length);

            const s1 = JSON.parse(localStorage.getItem('sentra_shelf_Kelas 1') || '[]');
            setShelfCount(s1.length);

            const savedRutin = JSON.parse(localStorage.getItem(`rutin_${todayKey}`) || 'null');
            if (savedRutin) {
                setRutinPagi(savedRutin.pagi || null);
                setRutinPulang(savedRutin.pulang || null);
                setRutinNote(savedRutin.note || '');
                setRutinSaved(true);
            }

            let allStudents = [];

            // 2. Fetch Students from Firestore
            try {
                const qS = query(collection(db, 'students'), where('status', '==', 'active'));
                const snapS = await getDocs(qS);
                allStudents = snapS.docs.map(d => ({ id: d.id, ...d.data() }));
                setStudentCount(allStudents.length);
            } catch (err) {
                console.warn("Firestore: Gagal mengambil data murid:", err);
            }

            // 3. Fetch Today's Journals from Firestore
            try {
                const todayStart = new Date(); todayStart.setHours(0,0,0,0);
                const qJ = query(collection(db, 'jurnal_aktivitas'), where('tanggal', '>=', todayStart));
                const snapJ = await getDocs(qJ);
                const journals = snapJ.docs.map(d => d.data());
                setJurnalCount(snapJ.size);
                const names = new Set(journals.map(j => j.murid));
                setObservedNames(names);
            } catch (err) {
                console.warn("Firestore: Gagal mengambil catatan jurnal hari ini:", err);
            }

            // 4. Hutang Presentasi Calculation
            try {
                if (s1.length > 0 && allStudents.length > 0) {
                    const allJournals = await getDocs(collection(db, 'jurnal_aktivitas'));
                    const presentedMap = {}; // { materialLabel: Set(studentName) }
                    allJournals.docs.forEach(d => {
                        const data = d.data();
                        if (!presentedMap[data.pencapaian]) presentedMap[data.pencapaian] = new Set();
                        presentedMap[data.pencapaian].add(data.murid);
                    });

                    // Find materials with most students NOT presented
                    let maxGap = 0;
                    let gapMaterial = null;
                    let gapStudents = [];
                    const studentNames = allStudents.map(s => s.name);

                    s1.forEach(label => {
                        const presented = presentedMap[label] || new Set();
                        const notPresented = studentNames.filter(n => !presented.has(n));
                        if (notPresented.length > maxGap) {
                            maxGap = notPresented.length;
                            gapMaterial = label;
                            gapStudents = notPresented.slice(0, 5);
                        }
                    });

                    if (gapMaterial && maxGap > 0) {
                        const cleanLabel = gapMaterial.split(': ')[1]?.split(' / ')[0] || gapMaterial;
                        setHutangSummary({ material: cleanLabel, fullLabel: gapMaterial, count: maxGap, students: gapStudents, total: studentNames.length });
                    }
                }
            } catch (err) {
                console.warn("Firestore: Gagal memproses saran presentasi:", err);
            }
        };
        fetchAll();
    }, []);

    // Normalization listener with robust error handling callback
    useEffect(() => {
        const room = user?.kelasName || 'Kelas 1';
        const unsub = onSnapshot(
            doc(db, 'class_status', room), 
            snap => {
                if (snap.exists()) setNormStatus(snap.data().normalization || {});
            },
            err => {
                console.warn(`Firestore: Real-time listener class_status untuk ${room} gagal atau tidak diizinkan:`, err);
            }
        );
        return () => unsub();
    }, [user]);

    const normDone = NORMALIZATION_ITEMS.filter(i => normStatus[i.id]).length;
    const normTotal = NORMALIZATION_ITEMS.length;
    const normAllDone = normDone >= normTotal;
    const progressPct = studentCount > 0 ? Math.round((observedNames.size / studentCount) * 100) : 0;

    const saveRutinitas = () => {
        const data = { pagi: rutinPagi, pulang: rutinPulang, note: rutinNote, savedAt: new Date().toISOString() };
        localStorage.setItem(`rutin_${todayKey}`, JSON.stringify(data));
        setRutinSaved(true);
        setTimeout(() => setRutinSaved(false), 2000);
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s', maxWidth: '900px', margin: '0 auto', paddingBottom: '120px' }}>

            {/* ① HEADER */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                    <Sparkles size={14} /> Command Center Guru
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 950, color: '#0F172A', margin: '0 0 4px 0' }}>
                    {greeting}, <span style={{ color: 'var(--primary)' }}>{user?.displayName?.split(' ')[0] || 'Ustadzah'}</span>
                </h1>
                <p style={{ color: '#64748B', fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>{dateStr}</p>
            </div>

            {/* ② KEHADIRAN RINGKAS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                <StatCard icon={UserCheck} label="Hadir" value={`${presentCount}/${studentCount}`} color="#10B981" link="/presensi" />
                <StatCard icon={Activity} label="Observasi" value={`${observedNames.size} anak`} color="#6366F1" link="/eksplorasi" />
                <StatCard icon={LayoutGrid} label="Di Rak" value={`${shelfCount} materi`} color="#F59E0B" link="/eksplorasi?mode=kelola" />
            </div>

            {/* ③ PONDASI KETENANGAN (Conditional) */}
            {!normAllDone && (
                <div style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #F0F9FF, #EFF6FF)', padding: '24px', borderRadius: '24px', border: '1.5px solid #BAE6FD' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Heart size={20} color="#0EA5E9" />
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 950, color: '#0369A1' }}>Pondasi Ketenangan</h3>
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#0EA5E9', background: 'white', padding: '4px 12px', borderRadius: '100px' }}>
                            {normDone}/{normTotal}
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.8)', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                        <div style={{ width: `${(normDone/normTotal)*100}%`, height: '100%', background: 'linear-gradient(90deg, #0EA5E9, #6366F1)', borderRadius: '8px', transition: 'width 0.5s' }} />
                    </div>
                    {/* Remaining items */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {NORMALIZATION_ITEMS.filter(i => !normStatus[i.id]).slice(0, 4).map(item => (
                            <span key={item.id} style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0369A1', background: 'white', padding: '6px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #BAE6FD' }}>
                                <item.icon size={12} color={item.color} /> {item.label.split(' & ')[0]}
                            </span>
                        ))}
                    </div>
                    <Link to="/eksplorasi?mode=kelola" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '0.8rem', fontWeight: 900, color: '#0369A1', textDecoration: 'none' }}>
                        Siapkan Materi di Rak <ChevronRight size={14} />
                    </Link>
                </div>
            )}

            {/* ④ AGENDA PRESENTASI (SMART SUGGESTION) */}
            <div style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: '28px', borderRadius: '28px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, right: -30, opacity: 0.06 }}><Megaphone size={180} /></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', opacity: 0.7, fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <Megaphone size={14} /> Saran Presentasi Hari Ini
                    </div>
                    {hutangSummary ? (
                        <>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 950, margin: '0 0 8px 0' }}>{hutangSummary.material}</h2>
                            <p style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: 600, margin: '0 0 16px 0', lineHeight: 1.5 }}>
                                <strong>{hutangSummary.count}</strong> dari {hutangSummary.total} anak belum pernah mendapat presentasi materi ini.
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                                {hutangSummary.students.map(name => (
                                    <span key={name} style={{ fontSize: '0.75rem', fontWeight: 800, background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.2)' }}>
                                        {name.split(' ')[0]}
                                    </span>
                                ))}
                                {hutangSummary.count > 5 && (
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.6, padding: '6px 12px' }}>
                                        +{hutangSummary.count - 5} lainnya
                                    </span>
                                )}
                            </div>
                            <Link to="/eksplorasi" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'white', color: '#0F172A', borderRadius: '100px', fontWeight: 950, fontSize: '0.85rem', textDecoration: 'none' }}>
                                Mulai Observasi <ArrowRightCircle size={18} />
                            </Link>
                        </>
                    ) : (
                        <>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 950, margin: '0 0 8px 0' }}>Semua Anak Teramati! 🎉</h2>
                            <p style={{ fontSize: '0.9rem', opacity: 0.7, fontWeight: 600, margin: '0 0 16px 0' }}>
                                Belum ada materi di rak, atau semua anak sudah mendapat presentasi. Luar biasa!
                            </p>
                            <Link to="/eksplorasi" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'white', color: '#0F172A', borderRadius: '100px', fontWeight: 950, fontSize: '0.85rem', textDecoration: 'none' }}>
                                Buka Sesi Sentra <ArrowRightCircle size={18} />
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* ⑤ RUTINITAS HARIAN (2 TAP) */}
            <div style={{ marginBottom: '24px', background: 'white', padding: '24px', borderRadius: '24px', border: '1.5px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <Heart size={18} color="#EC4899" />
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 950, color: '#1E293B' }}>Rutinitas Hari Ini</h3>
                    {rutinSaved && <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#10B981', background: '#ECFDF5', padding: '3px 10px', borderRadius: '100px', marginLeft: 'auto' }}>✓ Tersimpan</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                    {/* Pagi */}
                    <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>🌅 Pagi</div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {RUTINITAS_STATUS.map(s => (
                                <button key={s.id} onClick={() => setRutinPagi(s.id)} style={{
                                    flex: 1, padding: '10px 6px', borderRadius: '12px', border: '2px solid',
                                    borderColor: rutinPagi === s.id ? s.color : '#E2E8F0',
                                    backgroundColor: rutinPagi === s.id ? s.bg : 'white',
                                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '1.2rem' }}>{s.emoji}</div>
                                    <div style={{ fontSize: '0.6rem', fontWeight: 900, color: rutinPagi === s.id ? s.color : '#94A3B8', marginTop: '2px' }}>{s.label.split(' ')[0]}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Pulang */}
                    <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>🌙 Pulang</div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {RUTINITAS_STATUS.map(s => (
                                <button key={`p-${s.id}`} onClick={() => setRutinPulang(s.id)} style={{
                                    flex: 1, padding: '10px 6px', borderRadius: '12px', border: '2px solid',
                                    borderColor: rutinPulang === s.id ? s.color : '#E2E8F0',
                                    backgroundColor: rutinPulang === s.id ? s.bg : 'white',
                                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '1.2rem' }}>{s.emoji}</div>
                                    <div style={{ fontSize: '0.6rem', fontWeight: 900, color: rutinPulang === s.id ? s.color : '#94A3B8', marginTop: '2px' }}>{s.label.split(' ')[0]}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Catatan opsional */}
                <input
                    type="text"
                    placeholder="📝 Catatan khusus (opsional)..."
                    value={rutinNote}
                    onChange={e => setRutinNote(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '0.85rem', fontWeight: 600, outline: 'none', marginBottom: '10px', boxSizing: 'border-box' }}
                />
                {(rutinPagi || rutinPulang) && (
                    <button onClick={saveRutinitas} style={{
                        width: '100%', padding: '10px', borderRadius: '12px', border: 'none',
                        background: 'var(--primary)', color: 'white', fontWeight: 900, fontSize: '0.85rem',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}>
                        <Save size={16} /> Simpan Rutinitas
                    </button>
                )}
            </div>

            {/* ⑥ RINGKASAN OBSERVASI */}
            <div style={{ marginBottom: '24px', background: 'white', padding: '24px', borderRadius: '24px', border: '1.5px solid #F1F5F9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 950, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={18} color="var(--primary)" /> Observasi Hari Ini
                    </h3>
                    <span style={{ fontSize: '1.1rem', fontWeight: 950, color: 'var(--primary)' }}>{progressPct}%</span>
                </div>
                <div style={{ height: '10px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #6366F1, #4F46E5)', borderRadius: '10px', transition: 'width 1s' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748B' }}>
                        {observedNames.size} dari {studentCount} anak · {jurnalCount} catatan
                    </span>
                    <Link to="/eksplorasi" style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Lanjut <ChevronRight size={14} />
                    </Link>
                </div>
            </div>

            {/* ⑦ QUICK ACTIONS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <QuickAction to="/eksplorasi" icon={GraduationCap} label="Catat Observasi" desc="Input data sentra" color="#6366F1" />
                <QuickAction to="/tilawati" icon={Book} label="Tilawati" desc="Progress mengaji" color="#10B981" />
                <QuickAction to="/jurnal-harian" icon={MessageSquare} label="Rekap Jurnal" desc="Lihat semua catatan" color="#F59E0B" />
                <QuickAction to="/presensi" icon={LucideCalendar} label="Presensi" desc="Kehadiran murid" color="#0EA5E9" />
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color, link }) {
    return (
        <Link to={link} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', background: 'white', borderRadius: '18px', border: '1.5px solid #F1F5F9', transition: 'all 0.2s', cursor: 'pointer' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}15`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} />
                </div>
                <div>
                    <div style={{ fontSize: '1rem', fontWeight: 950, color: '#1E293B' }}>{value}</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>{label}</div>
                </div>
            </div>
        </Link>
    );
}

function QuickAction({ to, icon: Icon, label, desc, color }) {
    return (
        <Link to={to} style={{ textDecoration: 'none' }}>
            <div style={{
                padding: '20px', background: 'white', borderRadius: '20px', border: '1.5px solid #F1F5F9',
                transition: 'all 0.3s', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px'
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.06)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${color}15`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} />
                </div>
                <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 950, color: '#1E293B' }}>{label}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8' }}>{desc}</div>
                </div>
            </div>
        </Link>
    );
}
