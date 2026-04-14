import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, LogOut, Bell, Search, Activity, Calendar, Sparkles, LayoutGrid, Plus, Menu, X, Heart, Book, GraduationCap, Target, List, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const isActive = (path) => location.pathname === path;
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="app-layout" style={{ minHeight: '100vh', position: 'relative' }}>

            {/* 🚀 SIDEBAR (Permanent Desktop / Drawer Mobile) */}
            <aside className={`app-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src="/logo-budiluhur.png" alt="Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                        <h2 style={{ fontWeight: 900, fontSize: '1.3rem', margin: 0, color: '#1E293B' }}>Jurnal <span style={{ color: 'var(--primary)' }}>.</span></h2>
                    </div>
                    <button onClick={closeSidebar} className="desktop-hide" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={24} color="var(--text-muted)" /></button>
                </div>

                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', marginLeft: '12px' }}>Menu Harian</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '32px' }}>
                    <Link to="/dashboard" onClick={closeSidebar} className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/presensi" onClick={closeSidebar} className={`sidebar-link ${isActive('/presensi') ? 'active' : ''}`}>
                        <Calendar size={20} /> Presensi
                    </Link>
                    <Link to="/eksplorasi" onClick={closeSidebar} className={`sidebar-link ${isActive('/eksplorasi') ? 'active' : ''}`}>
                        <GraduationCap size={20} /> Sesi Sentra
                    </Link>
                    <Link to="/ibadah" onClick={closeSidebar} className={`sidebar-link ${isActive('/ibadah') ? 'active' : ''}`}>
                        <Heart size={20} /> Ibadah & Rutinitas
                    </Link>
                    <Link to="/tilawati" onClick={closeSidebar} className={`sidebar-link ${isActive('/tilawati') ? 'active' : ''}`}>
                        <Book size={20} /> Tilawati
                    </Link>
                    <Link to="/jurnal-harian" onClick={closeSidebar} className={`sidebar-link ${isActive('/jurnal-harian') ? 'active' : ''}`}>
                        <List size={20} /> Rekap Jurnal
                    </Link>
                </div>

                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', marginLeft: '12px' }}>Perencanaan & Administrasi</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Link to="/students" onClick={closeSidebar} className={`sidebar-link ${isActive('/students') ? 'active' : ''}`}>
                        <Users size={20} /> Data Siswa & Rombel
                    </Link>
                    <Link to="/manajemen-kurikulum" onClick={closeSidebar} className={`sidebar-link ${isActive('/manajemen-kurikulum') ? 'active' : ''}`}>
                        <BookOpen size={20} /> Kurikulum / Album
                    </Link>
                    <Link to="/cetak-lkpd" onClick={closeSidebar} className={`sidebar-link ${isActive('/cetak-lkpd') ? 'active' : ''}`}>
                        <Sparkles size={20} /> Generator Kartu (LKPD)
                    </Link>
                    <Link to="/rencana" onClick={closeSidebar} className={`sidebar-link ${isActive('/rencana') ? 'active' : ''}`}>
                        <Target size={20} /> Jadwal & Target
                    </Link>
                    <Link to="/disiplin-positif" onClick={closeSidebar} className={`sidebar-link ${isActive('/disiplin-positif') ? 'active' : ''}`}>
                        <ShieldAlert size={20} /> Disiplin Positif
                    </Link>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0 }}>
                            {user?.displayName?.charAt(0) || 'B'}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1E293B', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.displayName || 'Bunda Sari'}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{user?.role || 'Guru Kelas'}</span>
                        </div>
                    </div>
                    <button onClick={() => { logout(); closeSidebar(); }} style={{ width: '100%', color: 'var(--danger)', fontWeight: 800, background: 'var(--danger-light)', padding: '12px', borderRadius: '12px', border: 'none', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', transition: 'all 0.2s' }}>
                        <LogOut size={18} /> Keluar Aplikasi
                    </button>
                </div>
            </aside>

            {/* 🌑 OVERLAY FOR MOBILE SIDEBAR */}
            {isSidebarOpen && <div className="sidebar-overlay desktop-hide" onClick={closeSidebar} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1999, backdropFilter: 'blur(2px)' }} />}

            <div className="app-main">
                {/* 🚀 MOBILE TOP HEADER (Hidden on Desktop) */}
                <header className="mobile-header desktop-hide" style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '24px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Menu size={26} color="var(--text-main)" /></button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img src="/logo-budiluhur.png" alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                            <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 900 }}>Jurnal</h2>
                        </div>
                    </div>
                    <div style={{ padding: '8px', borderRadius: '12px', cursor: 'pointer', backgroundColor: 'white', border: '1px solid #E2E8F0' }}>
                        <Bell size={20} color="var(--text-muted)" />
                    </div>
                </header>

                {/* 🚀 MAIN CONTENT AREA */}
                <main className="main-content-area" style={{ paddingBottom: '120px' }}>
                    <Outlet />
                </main>
            </div>

            {/* 📱 FLOATING BOTTOM NAVIGATION (Mobile only) */}
            <nav className="bottom-nav desktop-hide">
                <Link to="/presensi" className={`nav-item ${isActive('/presensi') ? 'active' : ''}`}>
                    <Calendar size={22} color={isActive('/presensi') ? 'var(--primary)' : 'var(--text-muted)'} />
                    <span>Presensi</span>
                </Link>
                <Link to="/ibadah" className={`nav-item ${isActive('/ibadah') ? 'active' : ''}`}>
                    <Heart size={22} color={isActive('/ibadah') ? 'var(--primary)' : 'var(--text-muted)'} />
                    <span>Rutin</span>
                </Link>

                {/* 🚀 ELECTRIC BLUE FAB (Central Action - Sentra) */}
                <Link to="/eksplorasi" style={{ textDecoration: 'none' }}>
                    <div className={`fab-center ${isActive('/eksplorasi') ? 'active' : ''}`} style={{ backgroundColor: isActive('/eksplorasi') ? 'var(--primary)' : '#2D3436' }}>
                        <GraduationCap size={32} color="white" />
                    </div>
                </Link>

                <Link to="/tilawati" className={`nav-item ${isActive('/tilawati') ? 'active' : ''}`}>
                    <Book size={22} color={isActive('/tilawati') ? 'var(--primary)' : 'var(--text-muted)'} />
                    <span>Tilawati</span>
                </Link>

                <button onClick={() => setIsSidebarOpen(true)} className="nav-item" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Menu size={22} color="var(--text-muted)" />
                    <span>Menu</span>
                </button>
            </nav>
        </div>
    );
}
