import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {
    Users, UserCheck, BarChart3, TrendingUp, ChevronRight,
    Search, GraduationCap, Sparkles, CheckCircle2, ArrowRightCircle,
    Calendar, Heart, Book, Activity, Clock, ShieldAlert, Eye, AlertTriangle, Award
} from 'lucide-react';
import { useAuth, ROLES, getRoleLabel, getRoleColor } from '../context/AuthContext';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div style={{ padding: '24px', background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', flex: 1, minWidth: '200px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} />
            </div>
            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</div>
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 950, color: '#1E293B', lineHeight: 1 }}>{value}</div>
        {subtitle && <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginTop: '6px' }}>{subtitle}</div>}
    </div>
);

export default function KepsekDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        todayPresent: 0,
        todayJurnals: 0,
        totalRooms: 0
    });
    const [loading, setLoading] = useState(true);
    const [teacherActivity, setTeacherActivity] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Total students
                const qStudents = query(collection(db, 'students'), where('status', '==', 'active'));
                const snapStudents = await getDocs(qStudents);
                
                // 2. Total users/teachers
                const snapUsers = await getDocs(collection(db, 'users'));
                const allUsers = snapUsers.docs.map(d => ({ id: d.id, ...d.data() }));
                const teachers = allUsers.filter(u => u.role === ROLES.GURU && u.status !== 'inactive');
                
                // 3. Total rooms
                const snapRooms = await getDocs(collection(db, 'master_rombel'));

                // 4. Today's jurnal logs
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                let jurnalCount = 0;
                try {
                    const qJurnal = query(
                        collection(db, 'jurnal_aktivitas'),
                        where('tanggal', '>=', today)
                    );
                    const snapJurnal = await getDocs(qJurnal);
                    jurnalCount = snapJurnal.size;
                } catch (e) {}

                setStats({
                    totalStudents: snapStudents.size,
                    totalTeachers: teachers.length,
                    todayPresent: '-',
                    todayJurnals: jurnalCount,
                    totalRooms: snapRooms.size,
                    totalUsers: allUsers.length
                });

                // Build teacher activity summary
                const teacherSummary = teachers.map(t => ({
                    name: t.displayName || t.email,
                    role: t.role,
                    kelas: t.kelasName || 'Belum ditentukan',
                    status: t.status || 'active'
                }));
                setTeacherActivity(teacherSummary);
            } catch (err) {
                console.error("Error fetching kepsek dashboard:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div style={{ animation: 'fadeIn 0.5s', maxWidth: '1200px', margin: '0 auto', paddingBottom: '120px' }}>

            {/* 🌟 KEPSEK HEADER */}
            <div style={{ marginBottom: '40px', background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', padding: '40px', borderRadius: '32px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, right: -30, opacity: 0.1 }}><Award size={200} /></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.8, marginBottom: '12px' }}>
                        <Sparkles size={16} /> Dashboard Kepala Sekolah
                    </div>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 950, margin: '0 0 8px 0', letterSpacing: '-1px' }}>
                        Assalamu'alaikum, {user?.displayName?.split(' ')[0] || 'Ustadz/ah'}
                    </h1>
                    <p style={{ fontSize: '1.05rem', fontWeight: 600, opacity: 0.8, maxWidth: '600px', lineHeight: 1.5 }}>
                        Pantau ringkasan operasional sekolah dan progres guru secara real-time.
                    </p>
                </div>
            </div>

            {/* 📊 KPI OVERVIEW */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
                <StatCard title="Total Murid Aktif" value={stats.totalStudents} icon={Users} color="#10B981" />
                <StatCard title="Total Guru" value={stats.totalTeachers} icon={UserCheck} color="#6366F1" />
                <StatCard title="Jumlah Kelas" value={stats.totalRooms} icon={GraduationCap} color="#F59E0B" />
                <StatCard title="Jurnal Hari Ini" value={stats.todayJurnals} icon={Activity} color="#EC4899" />
            </div>

            {/* 📋 QUICK ACTIONS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <Link to="/laporan" style={{ textDecoration: 'none' }}>
                    <div className="card-soft cycle-card" style={{ padding: '28px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '24px', height: '100%' }}>
                        <BarChart3 size={28} color="#7C3AED" style={{ marginBottom: '16px' }} />
                        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 900, color: '#1E293B' }}>Laporan Sekolah</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Lihat rekap kehadiran, jurnal, dan progres kurikulum seluruh kelas.</p>
                    </div>
                </Link>
                <Link to="/disiplin-positif" style={{ textDecoration: 'none' }}>
                    <div className="card-soft cycle-card" style={{ padding: '28px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '24px', height: '100%' }}>
                        <ShieldAlert size={28} color="#059669" style={{ marginBottom: '16px' }} />
                        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 900, color: '#1E293B' }}>Standar Disiplin Positif</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Tinjau SOP dan panduan disiplin positif sekolah.</p>
                    </div>
                </Link>
                <Link to="/manajemen-akun" style={{ textDecoration: 'none' }}>
                    <div className="card-soft cycle-card" style={{ padding: '28px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '24px', height: '100%' }}>
                        <Users size={28} color="#F59E0B" style={{ marginBottom: '16px' }} />
                        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 900, color: '#1E293B' }}>Manajemen Akun</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Kelola akun guru, kurikulum, dan lihat status aktivitas.</p>
                    </div>
                </Link>
            </div>

            {/* 👥 TEACHER ROSTER */}
            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <UserCheck size={20} color="#7C3AED" />
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#1E293B' }}>Daftar Guru Aktif</h3>
                    <span style={{ marginLeft: 'auto', fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8' }}>{teacherActivity.length} guru</span>
                </div>
                {teacherActivity.length > 0 ? (
                    <div>
                        {teacherActivity.map((t, i) => (
                            <div key={i} style={{ padding: '16px 24px', borderBottom: i < teacherActivity.length - 1 ? '1px solid #F8FAFC' : 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#7C3AED', fontSize: '0.9rem' }}>
                                    {t.name.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.9rem' }}>{t.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>📍 {t.kelas}</div>
                                </div>
                                <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, background: '#F0FDF4', color: '#15803D', border: '1px solid #DCFCE7' }}>
                                    Aktif
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontWeight: 700 }}>
                        {loading ? 'Memuat...' : 'Belum ada guru terdaftar.'}
                    </div>
                )}
            </div>

            {/* Montessori Quote */}
            <div style={{ marginTop: '40px', padding: '32px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '24px', textAlign: 'center' }}>
                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#475569', fontStyle: 'italic', margin: 0, fontWeight: 600 }}>
                    "The greatest sign of success for a teacher is to be able to say, 'The children are now working as if I did not exist.'"
                </p>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, marginTop: '12px', color: '#94A3B8', textTransform: 'uppercase' }}>— Maria Montessori</div>
            </div>

            <style>{`
                .cycle-card { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; }
                .cycle-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
