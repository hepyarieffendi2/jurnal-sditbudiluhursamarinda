import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, LogOut, Bell, Search, Activity, Calendar, Sparkles, LayoutGrid, Plus, Menu, X, Heart, Book, GraduationCap, Target, Milestone, List, ShieldAlert, BarChart3, UserCog, Link2, FileText, Eye, ArrowLeftRight } from 'lucide-react';
import { useAuth, getRoleLabel, getRoleColor, ROLES, canManageContent, canManageAccounts, isKepsek } from '../context/AuthContext';

export default function DashboardLayout() {
    const { user, logout, viewAsRole, setViewAsRole, isViewingAs, realRole } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const isActive = (path) => location.pathname === path;
    const closeSidebar = () => setIsSidebarOpen(false);

    const roleColor = getRoleColor(user?.role);
    const roleLabel = getRoleLabel(user?.role);

    // Build menu items based on EFFECTIVE role (respects "View As")
    const dailyMenu = [];
    const adminMenu = [];

    // ===== MENU HARIAN =====
    dailyMenu.push({ to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' });

    // Guru menu: simplified daily workflow
    if (user?.role === ROLES.GURU) {
        dailyMenu.push({ to: '/presensi', icon: Calendar, label: 'Presensi' });
        dailyMenu.push({ to: '/eksplorasi', icon: GraduationCap, label: 'Sesi Sentra' });
        dailyMenu.push({ to: '/ibadah', icon: Heart, label: 'Rutinitas & Ibadah' });
        dailyMenu.push({ to: '/tilawati', icon: Book, label: 'Tilawati' });
        dailyMenu.push({ to: '/jurnal-harian', icon: List, label: 'Rekap Jurnal' });
    }

    // Kurikulum menu: daily + curriculum tools
    if (user?.role === ROLES.KURIKULUM) {
        dailyMenu.push({ to: '/presensi', icon: Calendar, label: 'Presensi' });
        dailyMenu.push({ to: '/eksplorasi', icon: GraduationCap, label: 'Sesi Sentra' });
        dailyMenu.push({ to: '/ibadah', icon: Heart, label: 'Rutinitas & Ibadah' });
        dailyMenu.push({ to: '/tilawati', icon: Book, label: 'Tilawati' });
        dailyMenu.push({ to: '/jurnal-harian', icon: List, label: 'Rekap Jurnal' });
    }

    // Kepsek: monitoring menus
    if (user?.role === ROLES.KEPSEK) {
        dailyMenu.push({ to: '/laporan', icon: BarChart3, label: 'Laporan Sekolah' });
        dailyMenu.push({ to: '/presensi', icon: Calendar, label: 'Presensi' });
        dailyMenu.push({ to: '/jurnal-harian', icon: List, label: 'Rekap Jurnal' });
    }

    // ===== MENU ADMINISTRASI =====
    if (user?.role !== ROLES.GURU) {
        adminMenu.push({ to: '/students', icon: Users, label: 'Data Siswa & Rombel' });
    }
    adminMenu.push({ to: '/rapor/preview', icon: FileText, label: 'Rapor Digital (Kumer)' });

    // Guru: only basic admin tools
    if (user?.role === ROLES.GURU) {
        adminMenu.push({ to: '/cetak-lkpd', icon: Sparkles, label: 'Generator Kartu (LKPD)' });
        adminMenu.push({ to: '/disiplin-positif', icon: ShieldAlert, label: 'Disiplin Positif' });
    }

    // Kurikulum: full curriculum management tools
    if (user?.role === ROLES.KURIKULUM) {
        adminMenu.push({ to: '/manajemen-kurikulum', icon: BookOpen, label: 'Kurikulum / Album' });
        adminMenu.push({ to: '/cetak-lkpd', icon: Sparkles, label: 'Generator Kartu (LKPD)' });
        adminMenu.push({ to: '/disiplin-positif', icon: ShieldAlert, label: 'Disiplin Positif' });
    }

    // Manajemen Akun — kurikulum & kepsek only
    if (canManageAccounts(realRole || user?.role)) {
        adminMenu.push({ to: '/manajemen-akun', icon: UserCog, label: 'Manajemen Akun' });
        adminMenu.push({ to: '/mapping-kumer', icon: Link2, label: 'Mapping Kumer' });
    }

    // Can the current REAL user switch roles?
    const canSwitchView = realRole === ROLES.KURIKULUM || realRole === ROLES.KEPSEK;

    return (
        <div className="app-layout" style={{ minHeight: '100vh', position: 'relative' }}>

            {/* 🔄 VIEW-AS BANNER (sticky top) */}
            {isViewingAs && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: 'white', padding: '10px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                    fontSize: '0.85rem', fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
                }}>
                    <Eye size={18} />
                    <span>Mode Preview: Tampilan <strong>{getRoleLabel(viewAsRole)}</strong></span>
                    <button 
                        onClick={() => setViewAsRole(null)} 
                        style={{ 
                            background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)', 
                            color: 'white', padding: '6px 16px', borderRadius: '100px', 
                            fontWeight: 900, cursor: 'pointer', fontSize: '0.75rem',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                    >
                        <X size={14} /> Kembali ke {getRoleLabel(realRole)}
                    </button>
                </div>
            )}

            {/* 🚀 SIDEBAR */}
            <aside className={`app-sidebar ${isSidebarOpen ? 'open' : ''}`} style={isViewingAs ? { paddingTop: '52px' } : {}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src="/logo-budiluhur.png" alt="Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                        <h2 style={{ fontWeight: 900, fontSize: '1.3rem', margin: 0, color: '#1E293B' }}>Jurnal <span style={{ color: 'var(--primary)' }}>.</span></h2>
                    </div>
                    <button onClick={closeSidebar} className="desktop-hide" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={24} color="var(--text-muted)" /></button>
                </div>

                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', marginLeft: '12px' }}>
                    {user?.role === ROLES.KEPSEK ? 'Monitoring' : 'Menu Harian'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '32px' }}>
                    {dailyMenu.map(item => (
                        <Link key={item.to} to={item.to} onClick={closeSidebar} className={`sidebar-link ${isActive(item.to) ? 'active' : ''}`}>
                            <item.icon size={20} /> {item.label}
                        </Link>
                    ))}
                </div>

                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', marginLeft: '12px' }}>
                    {user?.role === ROLES.KEPSEK ? 'Pengawasan' : 'Administrasi'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {adminMenu.map(item => (
                        <Link key={item.to} to={item.to} onClick={closeSidebar} className={`sidebar-link ${isActive(item.to) ? 'active' : ''}`}>
                            <item.icon size={20} /> {item.label}
                        </Link>
                    ))}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    
                    {/* 🔄 ROLE SWITCHER (for kurikulum/kepsek only) */}
                    {canSwitchView && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginLeft: '4px' }}>
                                Lihat Tampilan Sebagai
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {[ROLES.GURU, ROLES.KURIKULUM].map(role => {
                                    const isCurrentView = (viewAsRole || realRole) === role;
                                    const rc = getRoleColor(role);
                                    return (
                                        <button
                                            key={role}
                                            onClick={() => {
                                                setViewAsRole(role === realRole ? null : role);
                                                closeSidebar();
                                            }}
                                            style={{
                                                flex: 1, padding: '8px 12px', borderRadius: '10px',
                                                border: isCurrentView ? `2px solid ${rc.text}` : '2px solid #E2E8F0',
                                                backgroundColor: isCurrentView ? rc.bg : 'white',
                                                color: isCurrentView ? rc.text : '#94A3B8',
                                                fontWeight: 900, fontSize: '0.7rem', cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                            }}
                                        >
                                            {role === realRole && <span style={{ fontSize: '0.55rem', opacity: 0.7 }}>●</span>}
                                            {getRoleLabel(role).split(' ').pop()}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0 }}>
                            {user?.displayName?.charAt(0) || 'B'}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1E293B', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.displayName || 'Bunda Sari'}</span>
                            <span style={{ 
                                fontSize: '0.7rem', 
                                fontWeight: 800, 
                                color: roleColor.text,
                                backgroundColor: roleColor.bg,
                                border: `1px solid ${roleColor.border}`,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                width: 'fit-content',
                                marginTop: '2px'
                            }}>
                                {roleLabel}
                                {isViewingAs && <span style={{ opacity: 0.7 }}> (preview)</span>}
                            </span>
                        </div>
                    </div>
                    <button onClick={() => { logout(); closeSidebar(); }} style={{ width: '100%', color: 'var(--danger)', fontWeight: 800, background: 'var(--danger-light)', padding: '12px', borderRadius: '12px', border: 'none', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', transition: 'all 0.2s' }}>
                        <LogOut size={18} /> Keluar Aplikasi
                    </button>
                </div>
            </aside>

            {/* 🌑 OVERLAY FOR MOBILE SIDEBAR */}
            {isSidebarOpen && <div className="sidebar-overlay desktop-hide" onClick={closeSidebar} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1999, backdropFilter: 'blur(2px)' }} />}

            <div className="app-main" style={isViewingAs ? { paddingTop: '44px' } : {}}>
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
            <nav className="bottom-nav desktop-hide" style={isViewingAs ? { bottom: 0 } : {}}>
                {user?.role !== ROLES.KEPSEK ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
                            <LayoutDashboard size={22} color={isActive('/dashboard') ? 'var(--primary)' : 'var(--text-muted)'} />
                            <span>Home</span>
                        </Link>
                        <Link to="/laporan" className={`nav-item ${isActive('/laporan') ? 'active' : ''}`}>
                            <BarChart3 size={22} color={isActive('/laporan') ? 'var(--primary)' : 'var(--text-muted)'} />
                            <span>Laporan</span>
                        </Link>

                        <Link to="/disiplin-positif" style={{ textDecoration: 'none' }}>
                            <div className={`fab-center ${isActive('/disiplin-positif') ? 'active' : ''}`} style={{ backgroundColor: isActive('/disiplin-positif') ? 'var(--primary)' : '#2D3436' }}>
                                <ShieldAlert size={32} color="white" />
                            </div>
                        </Link>

                        <Link to="/manajemen-akun" className={`nav-item ${isActive('/manajemen-akun') ? 'active' : ''}`}>
                            <UserCog size={22} color={isActive('/manajemen-akun') ? 'var(--primary)' : 'var(--text-muted)'} />
                            <span>Akun</span>
                        </Link>
                    </>
                )}

                <button onClick={() => setIsSidebarOpen(true)} className="nav-item" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Menu size={22} color="var(--text-muted)" />
                    <span>Menu</span>
                </button>
            </nav>
        </div>
    );
}
