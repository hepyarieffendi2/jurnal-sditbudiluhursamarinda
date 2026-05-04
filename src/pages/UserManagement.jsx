import React, { useState, useEffect } from 'react';
import { useAuth, ROLES, getRoleLabel, getRoleColor, canManageAccounts } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserCog, Search, Shield, ChevronLeft, Loader2, CheckCircle2, AlertTriangle, User, Mail, MapPin, Edit3, Save, X, Plus, Eye, EyeOff } from 'lucide-react';
import { db, auth } from '../firebase-config';
import { collection, getDocs, doc, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

export default function UserManagement() {
  const { user, getAllUsers, updateUserRole, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // New account form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({ email: '', password: '', displayName: '', role: ROLES.GURU, kelasName: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [addingAccount, setAddingAccount] = useState(false);

  // Only kurikulum/kepsek can access this page
  useEffect(() => {
    if (user && !canManageAccounts(user.role)) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers.sort((a, b) => {
        const roleOrder = { kepsek: 0, kurikulum: 1, guru: 2 };
        if ((roleOrder[a.role] || 2) !== (roleOrder[b.role] || 2)) return (roleOrder[a.role] || 2) - (roleOrder[b.role] || 2);
        return (a.displayName || '').localeCompare(b.displayName || '');
      }));

      // Fetch rooms for assignment
      try {
        const snapR = await getDocs(collection(db, 'master_rombel'));
        let rData = snapR.docs.map(d => ({ id: d.id, ...d.data() }));
        rData.sort((a, b) => (a.level || '').localeCompare(b.level || ''));
        setRooms(rData);
      } catch (e) {}
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerSuccess = (msg) => {
    setShowSuccess(msg);
    setTimeout(() => setShowSuccess(''), 3000);
  };

  const handleRoleChange = async (uid, newRole) => {
    // Prevent changing own role
    if (uid === user.uid) {
      alert('Tidak dapat mengubah role akun sendiri.');
      return;
    }
    const result = await updateUserRole(uid, newRole);
    if (result.success) {
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
      triggerSuccess(`Role berhasil diubah menjadi ${getRoleLabel(newRole)}`);
    } else {
      alert('Gagal mengubah role: ' + result.message);
    }
  };

  const handleSaveEdit = async (uid) => {
    const result = await updateUserProfile(uid, editForm);
    if (result.success) {
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, ...editForm } : u));
      setEditingUserId(null);
      triggerSuccess('Profil berhasil diperbarui');
    } else {
      alert('Gagal memperbarui profil: ' + result.message);
    }
  };

  const handleToggleStatus = async (uid, currentStatus) => {
    if (uid === user.uid) {
      alert('Tidak dapat menonaktifkan akun sendiri.');
      return;
    }
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const result = await updateUserProfile(uid, { status: newStatus });
    if (result.success) {
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, status: newStatus } : u));
      triggerSuccess(`Akun berhasil ${newStatus === 'active' ? 'diaktifkan' : 'dinonaktifkan'}`);
    }
  };

  const handleAddAccount = async () => {
    if (!newAccount.email || !newAccount.password || !newAccount.displayName) {
      alert('Email, kata sandi, dan nama wajib diisi.');
      return;
    }
    if (newAccount.password.length < 6) {
      alert('Kata sandi minimal 6 karakter.');
      return;
    }

    setAddingAccount(true);
    try {
      // We need to use Firebase Admin or a Cloud Function to create users
      // For client-side, we use a workaround: create temp auth, store profile, then restore current session
      // NOTE: This will sign in as the new user temporarily - not ideal but works for MVP
      
      // Save current user state
      const currentUser = auth.currentUser;
      
      // Create the new user in Firestore directly (profile only)
      // The actual Firebase Auth account creation should ideally be done via Cloud Functions
      // For now, we'll store the profile and the user can be created via Firebase Console
      
      const newUserDoc = {
        email: newAccount.email,
        displayName: newAccount.displayName,
        role: newAccount.role,
        kelasName: newAccount.kelasName || null,
        kelasId: null,
        status: 'active',
        createdAt: new Date().toISOString(),
        createdBy: user.uid,
        pendingAuth: true // Flag: needs Firebase Auth account creation
      };

      // Use email as doc ID (replacing special chars)
      const docId = newAccount.email.replace(/[^a-zA-Z0-9]/g, '_');
      await setDoc(doc(db, 'pending_users', docId), newUserDoc);
      
      triggerSuccess(`Profil "${newAccount.displayName}" berhasil didaftarkan. Akun Firebase Auth perlu dibuat di Firebase Console.`);
      setShowAddForm(false);
      setNewAccount({ email: '', password: '', displayName: '', role: ROLES.GURU, kelasName: '' });
      
      // Add to local state for immediate display
      setUsers(prev => [...prev, { ...newUserDoc, uid: docId, isPending: true }]);
    } catch (error) {
      console.error("Error creating account:", error);
      alert('Gagal membuat akun: ' + error.message);
    } finally {
      setAddingAccount(false);
    }
  };

  const filteredUsers = users.filter(u =>
    (u.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleStats = {
    total: users.length,
    guru: users.filter(u => u.role === ROLES.GURU).length,
    kurikulum: users.filter(u => u.role === ROLES.KURIKULUM).length,
    kepsek: users.filter(u => u.role === ROLES.KEPSEK).length,
    active: users.filter(u => u.status !== 'inactive').length,
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', animation: 'fadeIn 0.5s', fontFamily: "'Inter', sans-serif" }}>

      {/* Success Toast */}
      {showSuccess && (
        <div style={{ position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#10B981', color: 'white', padding: '12px 24px', borderRadius: '100px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', zIndex: 9999, boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)', fontSize: '0.9rem' }}>
          <CheckCircle2 size={20} /> {showSuccess}
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'white', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#64748B' }}>
            <ChevronLeft size={20} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', padding: '10px', borderRadius: '14px', color: 'white', display: 'flex' }}>
                <UserCog size={24} />
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 950, margin: 0, color: '#1E293B' }}>Manajemen Akun</h1>
            </div>
            <p style={{ color: '#64748B', fontWeight: 600, margin: 0 }}>Kelola akun guru, kurikulum, dan kepala sekolah.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '14px', 
            border: 'none', background: showAddForm ? '#F1F5F9' : 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', 
            color: showAddForm ? '#64748B' : 'white', fontWeight: 800, cursor: 'pointer', 
            boxShadow: showAddForm ? 'none' : '0 4px 12px rgba(79, 70, 229, 0.3)',
            fontSize: '0.9rem'
          }}
        >
          {showAddForm ? <><X size={18} /> Batal</> : <><Plus size={18} /> Daftarkan Akun Baru</>}
        </button>
      </div>

      {/* ROLE STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total Akun', value: roleStats.total, color: '#1E293B', bg: '#F8FAFC' },
          { label: getRoleLabel(ROLES.GURU), value: roleStats.guru, ...getRoleColor(ROLES.GURU) },
          { label: getRoleLabel(ROLES.KURIKULUM), value: roleStats.kurikulum, ...getRoleColor(ROLES.KURIKULUM) },
          { label: getRoleLabel(ROLES.KEPSEK), value: roleStats.kepsek, ...getRoleColor(ROLES.KEPSEK) },
        ].map((stat, i) => (
          <div key={i} style={{ 
            padding: '16px 20px', borderRadius: '16px', 
            background: stat.bg, border: `1px solid ${stat.border || '#E2E8F0'}`,
            display: 'flex', flexDirection: 'column', gap: '4px'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 950, color: stat.text || stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: stat.text || stat.color, textTransform: 'uppercase', opacity: 0.8 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ADD NEW ACCOUNT FORM */}
      {showAddForm && (
        <div style={{ background: '#F8F7FF', borderRadius: '24px', padding: '32px', marginBottom: '24px', border: '1px solid #DDD6FE', animation: 'slideDown 0.3s' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 950, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} color="#7C3AED" /> Daftarkan Akun Baru
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: '#7C3AED', marginBottom: '6px', textTransform: 'uppercase' }}>Nama Lengkap</label>
              <input type="text" placeholder="Ustadzah Sari" value={newAccount.displayName} onChange={e => setNewAccount(p => ({...p, displayName: e.target.value}))}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #DDD6FE', fontWeight: 700, outline: 'none', fontSize: '0.9rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: '#7C3AED', marginBottom: '6px', textTransform: 'uppercase' }}>Email</label>
              <input type="email" placeholder="sari@sditbudiluhur.sch.id" value={newAccount.email} onChange={e => setNewAccount(p => ({...p, email: e.target.value}))}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #DDD6FE', fontWeight: 700, outline: 'none', fontSize: '0.9rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: '#7C3AED', marginBottom: '6px', textTransform: 'uppercase' }}>Kata Sandi</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} placeholder="Minimal 6 karakter" value={newAccount.password} onChange={e => setNewAccount(p => ({...p, password: e.target.value}))}
                  style={{ width: '100%', padding: '12px 42px 12px 16px', borderRadius: '12px', border: '1px solid #DDD6FE', fontWeight: 700, outline: 'none', fontSize: '0.9rem' }} />
                <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: '#7C3AED', marginBottom: '6px', textTransform: 'uppercase' }}>Role / Jabatan</label>
              <select value={newAccount.role} onChange={e => setNewAccount(p => ({...p, role: e.target.value}))}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #DDD6FE', fontWeight: 700, outline: 'none', fontSize: '0.9rem', cursor: 'pointer' }}>
                <option value={ROLES.GURU}>{getRoleLabel(ROLES.GURU)}</option>
                <option value={ROLES.KURIKULUM}>{getRoleLabel(ROLES.KURIKULUM)}</option>
                <option value={ROLES.KEPSEK}>{getRoleLabel(ROLES.KEPSEK)}</option>
              </select>
            </div>
            {newAccount.role === ROLES.GURU && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: '#7C3AED', marginBottom: '6px', textTransform: 'uppercase' }}>Kelas (Rombel)</label>
                <select value={newAccount.kelasName} onChange={e => setNewAccount(p => ({...p, kelasName: e.target.value}))}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #DDD6FE', fontWeight: 700, outline: 'none', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <option value="">Belum ditentukan</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.name}>{r.level ? `${r.level} - ` : ''}{r.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button onClick={handleAddAccount} disabled={addingAccount}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '14px', border: 'none', background: '#7C3AED', color: 'white', fontWeight: 800, cursor: addingAccount ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)', fontSize: '0.9rem', opacity: addingAccount ? 0.7 : 1 }}>
              {addingAccount ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} {addingAccount ? 'Mendaftarkan...' : 'Daftarkan Akun'}
            </button>
          </div>
          <div style={{ marginTop: '16px', padding: '12px 16px', background: '#FEF3C7', borderRadius: '12px', border: '1px solid #FDE68A', fontSize: '0.8rem', color: '#92400E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} />
            Setelah mendaftarkan, akun Firebase Auth perlu dibuat secara manual di Firebase Console dengan email dan kata sandi yang sama.
          </div>
        </div>
      )}

      {/* SEARCH BAR */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={20} />
        <input 
          type="text" 
          placeholder="Cari akun berdasarkan nama, email, atau role..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '16px 16px 16px 52px', border: '1px solid #E2E8F0', borderRadius: '24px', fontSize: '1rem', fontWeight: 700, outline: 'none', color: '#1E293B' }}
        />
      </div>

      {/* USER LIST */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <Loader2 size={32} color="#7C3AED" className="animate-spin" />
          <span style={{ fontWeight: 700, color: '#64748B' }}>Memuat data akun...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredUsers.map(u => {
            const rc = getRoleColor(u.role);
            const isEditing = editingUserId === u.uid;
            const isCurrentUser = u.uid === user.uid;
            const isInactive = u.status === 'inactive';

            return (
              <div key={u.uid || u.id} style={{ 
                background: 'white', borderRadius: '20px', border: '1px solid #E2E8F0', 
                overflow: 'hidden', opacity: isInactive ? 0.5 : 1,
                boxShadow: isEditing ? '0 8px 24px rgba(0,0,0,0.06)' : '0 2px 4px rgba(0,0,0,0.02)',
                transition: 'all 0.2s'
              }}>
                <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  
                  {/* Avatar */}
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: rc.bg, border: `2px solid ${rc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, color: rc.text, fontSize: '1.1rem', flexShrink: 0 }}>
                    {(u.displayName || 'X').charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    {isEditing ? (
                      <input type="text" value={editForm.displayName || ''} onChange={e => setEditForm(p => ({...p, displayName: e.target.value}))}
                        style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', border: '2px solid #7C3AED', borderRadius: '8px', padding: '6px 10px', outline: 'none', width: '100%', marginBottom: '4px' }} />
                    ) : (
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {u.displayName || 'Tanpa Nama'}
                        {isCurrentUser && <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10B981', background: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>ANDA</span>}
                        {u.isPending && <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#D97706', background: '#FFFBEB', padding: '2px 6px', borderRadius: '4px' }}>PENDING</span>}
                        {isInactive && <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#EF4444', background: '#FEF2F2', padding: '2px 6px', borderRadius: '4px' }}>NONAKTIF</span>}
                      </div>
                    )}
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>{u.email}</div>
                    {u.kelasName && <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, marginTop: '2px' }}>📍 {u.kelasName}</div>}
                  </div>

                  {/* Role Badge / Selector */}
                  <div style={{ minWidth: '170px' }}>
                    {isCurrentUser ? (
                      <span style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, background: rc.bg, color: rc.text, border: `1px solid ${rc.border}` }}>
                        {getRoleLabel(u.role)}
                      </span>
                    ) : (
                      <select value={u.role} onChange={e => handleRoleChange(u.uid, e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '10px', border: `2px solid ${rc.border}`, background: rc.bg, color: rc.text, fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', outline: 'none', width: '100%' }}>
                        <option value={ROLES.GURU}>{getRoleLabel(ROLES.GURU)}</option>
                        <option value={ROLES.KURIKULUM}>{getRoleLabel(ROLES.KURIKULUM)}</option>
                        <option value={ROLES.KEPSEK}>{getRoleLabel(ROLES.KEPSEK)}</option>
                      </select>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {isEditing ? (
                      <>
                        <button onClick={() => handleSaveEdit(u.uid)} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#10B981', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                          <Save size={14} /> Simpan
                        </button>
                        <button onClick={() => setEditingUserId(null)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', color: '#64748B', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}>Batal</button>
                      </>
                    ) : (
                      <>
                        {!isCurrentUser && (
                          <>
                            <button onClick={() => { setEditingUserId(u.uid); setEditForm({ displayName: u.displayName, kelasName: u.kelasName || '' }); }}
                              style={{ padding: '8px', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', color: '#64748B', cursor: 'pointer' }}>
                              <Edit3 size={16} />
                            </button>
                            <button onClick={() => handleToggleStatus(u.uid, u.status)}
                              style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: isInactive ? '#ECFDF5' : '#FEF2F2', color: isInactive ? '#10B981' : '#EF4444', fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem' }}>
                              {isInactive ? 'Aktifkan' : 'Nonaktifkan'}
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Edit Row: Kelas Assignment */}
                {isEditing && u.role === ROLES.GURU && (
                  <div style={{ padding: '12px 24px 20px', borderTop: '1px solid #F1F5F9', background: '#FAFAFA' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#7C3AED', marginBottom: '6px', display: 'block' }}>KELAS (ROMBEL)</label>
                    <select value={editForm.kelasName || ''} onChange={e => setEditForm(p => ({...p, kelasName: e.target.value}))}
                      style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #DDD6FE', fontWeight: 700, outline: 'none', width: '100%', maxWidth: '300px' }}>
                      <option value="">Belum ditentukan</option>
                      {rooms.map(r => (
                        <option key={r.id} value={r.name}>{r.level ? `${r.level} - ` : ''}{r.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            );
          })}

          {filteredUsers.length === 0 && (
            <div style={{ padding: '60px 24px', textAlign: 'center', color: '#94A3B8', fontWeight: 700 }}>
              Tidak ada akun yang ditemukan.
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
