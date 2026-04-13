import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {
    Calendar, Clock, User, ChevronRight, ChevronDown, List, Filter, Search,
    ArrowLeft, GraduationCap, MapPin, Sparkles, BookOpen, AlertCircle, Info, Hash, X, Activity, Trash2, Edit2, Save,
    Heart, Award, Zap, Users, CheckCircle2, RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DailyJournal() {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('timeline'); // 'timeline' atau 'student'
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingLog, setEditingLog] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const dateObj = new Date(selectedDate);
            const startOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 0, 0, 0);
            const endOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 23, 59, 59);

            const q = query(
                collection(db, 'jurnal_aktivitas'),
                where('tanggal', '>=', startOfDay),
                where('tanggal', '<=', endOfDay)
            );

            const snap = await getDocs(q);
            const data = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timeStr: dataToTimeStr(doc.data().tanggal)
            }));

            // Sort by time descending
            data.sort((a, b) => {
                const timeA = a.tanggal?.seconds || 0;
                const timeB = b.tanggal?.seconds || 0;
                return timeB - timeA;
            });

            setLogs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const dataToTimeStr = (ts) => {
        if (!ts) return "--:--";
        const d = ts.toDate ? ts.toDate() : new Date(ts);
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const formatAchievement = (text) => {
        if (!text) return null;
        if (!text.includes(' / ')) return <span style={{ fontWeight: 800 }}>{text}</span>;
        
        const [indo, eng] = text.split(' / ');
        const [prefix, mainIndo] = indo.includes(': ') ? indo.split(': ') : ['', indo];
        
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ color: '#1E293B', fontWeight: 850, fontSize: '0.9rem', lineHeight: 1.2 }}>
                    {prefix && <span style={{ color: '#6366F1', marginRight: '4px' }}>{prefix}:</span>}
                    {mainIndo}
                </div>
                <div style={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', fontStyle: 'italic', opacity: 0.8 }}>
                    {eng}
                </div>
            </div>
        );
    };

    const groupedByStudent = logs.reduce((acc, log) => {
        if (!acc[log.murid]) acc[log.murid] = [];
        acc[log.murid].push(log);
        return acc;
    }, {});

    const studentNames = Object.keys(groupedByStudent).sort();

    const filteredLogs = logs.filter(l =>
        l.murid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.pencapaian && l.pencapaian.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredStudents = studentNames.filter(name =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'jurnal_aktivitas', id));
            setLogs(logs.filter(l => l.id !== id));
            setShowDeleteConfirm(null);
        } catch (err) {
            console.error(err);
            alert("Gagal menghapus data");
        }
    };

    const handleUpdate = async () => {
        if (!editingLog) return;
        try {
            const { id, ...data } = editingLog;
            await updateDoc(doc(db, 'jurnal_aktivitas', id), data);
            setLogs(logs.map(l => l.id === id ? { ...l, ...data } : l));
            setEditingLog(null);
        } catch (err) {
            console.error(err);
            alert("Gagal memperbarui data");
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.5s' }}>

            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'white', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#64748B' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 950, margin: 0, color: '#1E293B' }}>Rekap Jurnal</h1>
                        <p style={{ color: '#64748B', fontWeight: 600, marginTop: '4px' }}>Review aktivitas sentra {selectedDate === new Date().toISOString().split('T')[0] ? 'hari ini' : 'silam'}.</p>
                    </div>
                </div>

                <div style={{
                    background: '#F1F5F9', padding: '4px', borderRadius: '100px',
                    display: 'flex', position: 'relative', width: 'fit-content',
                    border: '1px solid #E2E8F0', height: '48px', alignItems: 'center'
                }}>
                    <div style={{
                        position: 'absolute', top: '4px', bottom: '4px',
                        width: 'calc(50% - 4px)', background: 'white',
                        borderRadius: '100px', zIndex: 1,
                        transform: viewMode === 'timeline' ? 'translateX(0)' : 'translateX(100%)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                    }} />
                    <button
                        onClick={() => setViewMode('timeline')}
                        style={{
                            flex: 1, border: 'none', background: 'transparent', padding: '0 20px',
                            borderRadius: '100px', fontSize: '0.85rem', fontWeight: 800,
                            color: viewMode === 'timeline' ? '#4F46E5' : '#64748B',
                            cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center', gap: '8px', minWidth: '130px', justifyContent: 'center'
                        }}
                    >
                        <Clock size={16} /> Timeline
                    </button>
                    <button
                        onClick={() => setViewMode('student')}
                        style={{
                            flex: 1, border: 'none', background: 'transparent', padding: '0 20px',
                            borderRadius: '100px', fontSize: '0.85rem', fontWeight: 800,
                            color: viewMode === 'student' ? '#4F46E5' : '#64748B',
                            cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center', gap: '8px', minWidth: '130px', justifyContent: 'center'
                        }}
                    >
                        <User size={16} /> Per Murid
                    </button>
                </div>
            </div>

            {/* DATE & SEARCH */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
                    <Calendar size={18} color="#4F46E5" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: 700, color: '#1E293B', width: '100%' }}
                    />
                </div>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', flex: 2, minWidth: '280px' }}>
                    <Search size={18} color="#94A3B8" />
                    <input
                        type="text"
                        placeholder="Cari nama anak atau materi..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: 700, color: '#1E293B', width: '100%' }}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <Loader2 size={40} className="animate-spin" color="#4F46E5" />
                    <p style={{ marginTop: '16px', color: '#64748B', fontWeight: 600 }}>Tunggu sebentar...</p>
                </div>
            ) : logs.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '32px', padding: '80px 40px', textAlign: 'center', border: '1px dashed #E2E8F0' }}>
                    <div style={{ width: '80px', height: '80px', background: '#F8FAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#CBD5E1' }}>
                        <BookOpen size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B', margin: '0 0 8px' }}>Belum ada catatan</h3>
                    <p style={{ color: '#64748B', fontWeight: 600, margin: '0 0 24px' }}>Silakan isi jurnal di menu Sesi Sentra hari ini.</p>
                    <button onClick={() => navigate('/eksplorasi')} style={{ background: '#4F46E5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: 800, cursor: 'pointer' }}>Buka Sesi Sentra</button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {viewMode === 'timeline' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {filteredLogs.map((log, idx) => (
                                <div key={log.id} style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px', flexShrink: 0 }}>
                                        <div style={{ background: '#EEF2FF', color: '#4F46E5', fontSize: '0.75rem', fontWeight: 950, padding: '4px 8px', borderRadius: '8px', border: '1px solid #C7D2FE' }}>{log.timeStr}</div>
                                        {idx !== filteredLogs.length - 1 && <div style={{ width: '2px', flex: 1, background: '#E2E8F0', margin: '6px 0' }} />}
                                    </div>
                                    <div style={{ flex: 1, background: 'white', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '16px', marginBottom: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem' }}>{log.murid?.charAt(0) || '?'}</div>
                                                <span style={{ fontWeight: 800, color: '#1E293B' }}>{log.murid}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => setEditingLog(log)} style={{ border: 'none', background: '#F8FAFC', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: '#64748B' }}><Edit2 size={16} /></button>
                                                <button onClick={() => setShowDeleteConfirm(log.id)} style={{ border: 'none', background: '#FEF2F2', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px' }}>
                                            <Hash size={18} color="#94A3B8" style={{ marginTop: '2px' }} /> 
                                            {formatAchievement(log.pencapaian)}
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                            <span style={{ 
                                                fontSize: '0.7rem', 
                                                background: log.kematangan === 'P' ? '#EEF2FF' : log.kematangan === 'W' ? '#FFFBEB' : log.kematangan === 'M' ? '#ECFDF5' : '#FEF2F2',
                                                color: log.kematangan === 'P' ? '#4F46E5' : log.kematangan === 'W' ? '#D97706' : log.kematangan === 'M' ? '#059669' : '#DC2626',
                                                padding: '4px 10px', borderRadius: '8px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid currentColor'
                                            }}>
                                                {log.kematangan === 'P' ? <CheckCircle2 size={12}/> : log.kematangan === 'W' ? <Activity size={12}/> : log.kematangan === 'M' ? <Award size={12}/> : <AlertCircle size={12}/>} {log.kematangan}
                                            </span>
                                            <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 750, display: 'flex', alignItems: 'center', gap: '4px', background: '#F8FAFC', padding: '4px 10px', borderRadius: '8px' }}>
                                                {log.konsentrasi === 'Exploration' ? <Sparkles size={12}/> : log.konsentrasi === 'Deep Focus' ? <Zap size={12}/> : <Activity size={12}/>} {log.konsentrasi}
                                            </span>
                                            <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 750, display: 'flex', alignItems: 'center', gap: '4px', background: '#F8FAFC', padding: '4px 10px', borderRadius: '8px' }}>
                                                {(log.sosial||'Individual') === 'Individual' ? <User size={12}/> : <Users size={12}/>} {log.sosial || 'Individual'}
                                            </span>
                                            <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 750, display: 'flex', alignItems: 'center', gap: '4px', background: '#F8FAFC', padding: '4px 10px', borderRadius: '8px' }}>
                                                {log.mood === 'Tenang' ? <Zap size={12}/> : log.mood === 'Ceria' ? <Sparkles size={12}/> : <AlertCircle size={12}/>} {log.mood || 'Tenang'}
                                            </span>
                                            <span style={{ 
                                                fontSize: '0.7rem', 
                                                background: log.restorasi ? '#ECFDF5' : '#FEF2F2', 
                                                color: log.restorasi ? '#059669' : '#DC2626',
                                                padding: '4px 10px', borderRadius: '8px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '4px'
                                            }}>
                                                {log.restorasi ? <CheckCircle2 size={12}/> : <X size={12}/>} {log.restorasi ? 'Cycle Complete' : 'Incomplete'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                            {filteredStudents.map(name => (
                                <div key={name} style={{ background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                                    <div style={{ padding: '20px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'white', border: '1px solid #E2E8F0', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: '1.2rem' }}>{name.charAt(0)}</div>
                                        <div>
                                            <div style={{ fontWeight: 900, color: '#1E293B', fontSize: '1.1rem' }}>{name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>{groupedByStudent[name].length} Aktivitas</div>
                                        </div>
                                    </div>
                                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {groupedByStudent[name].map(act => (
                                            <div key={act.id} style={{ padding: '12px', background: '#F1F5F9', borderRadius: '14px', border: '1px solid transparent', position: 'relative' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#4F46E5' }}>{act.timeStr}</span>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <Edit2 size={12} onClick={() => setEditingLog(act)} style={{ cursor: 'pointer', color: '#94A3B8' }} />
                                                        <Trash2 size={12} onClick={() => setShowDeleteConfirm(act.id)} style={{ cursor: 'pointer', color: '#EF4444' }} />
                                                    </div>
                                                </div>
                                                <div style={{ marginBottom: '8px' }}>{formatAchievement(act.pencapaian)}</div>
                                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: '0.55rem', fontWeight: 900, background: 'white', padding: '2px 6px', borderRadius: '4px', color: '#64748B', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        {act.kematangan === 'P' ? <CheckCircle2 size={10}/> : act.kematangan === 'W' ? <Activity size={10}/> : act.kematangan === 'M' ? <Award size={10}/> : <AlertCircle size={10}/>} {act.kematangan}
                                                    </span>
                                                    <span style={{ fontSize: '0.55rem', fontWeight: 900, background: act.restorasi ? '#D1FAE5' : '#FEE2E2', padding: '2px 6px', borderRadius: '4px', color: act.restorasi ? '#059669' : '#DC2626', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        {act.restorasi ? <CheckCircle2 size={10}/> : <X size={10}/>}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* EDIT MODAL MODERN */}
            {editingLog && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setEditingLog(null)}>
                    <div style={{ background: 'white', padding: '28px', borderRadius: '28px', width: '100%', maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h2 style={{ fontWeight: 950, margin: 0, fontSize: '1.4rem' }}>Edit Observasi</h2>
                            <button onClick={() => setEditingLog(null)} style={{ background: '#F1F5F9', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Maturity Edit */}
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 900, color: '#64748B', marginBottom: '10px' }}>
                                    <Award size={14} color="#8B5CF6" /> KEMATANGAN
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                    {[
                                        { v: 'P', c: '#3B82F6', i: <CheckCircle2 size={16} />, g: 'Baru menerima presentasi.' },
                                        { v: 'W', c: '#F59E0B', i: <Activity size={16} />, g: 'Tahap mengulang & berlatih.' },
                                        { v: 'M', c: '#10B981', i: <Award size={16} />, g: 'Mahir, tuntas, & mandiri.' },
                                        { v: 'N', c: '#EF4444', i: <AlertCircle size={16} />, g: 'Macet/butuh bantuan guru.' }
                                    ].map(m => (
                                        <button key={m.v} onClick={() => setEditingLog({ ...editingLog, kematangan: m.v })} style={{
                                            padding: '10px 8px', borderRadius: '12px', border: '2px solid',
                                            borderColor: editingLog.kematangan === m.v ? m.c : '#F1F5F9',
                                            background: editingLog.kematangan === m.v ? m.c + '10' : 'white',
                                            color: editingLog.kematangan === m.v ? m.c : '#94A3B8',
                                            fontWeight: 900, cursor: 'pointer', textAlign: 'left',
                                            display: 'flex', alignItems: 'center', gap: '10px'
                                        }}>
                                            <div style={{ background: editingLog.kematangan === m.v ? m.c : '#F1F5F9', color: editingLog.kematangan === m.v ? 'white' : '#CBD5E1', padding: 6, borderRadius: 8, display: 'flex' }}>{m.i}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.8rem' }}>{m.v}</div>
                                                <div style={{ fontSize: '0.55rem', fontWeight: 700, opacity: 0.8, lineHeight: 1 }}>{m.g}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Concentration Edit */}
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 900, color: '#64748B', marginBottom: '10px' }}>
                                    <Zap size={14} color="#F59E0B" /> KONSENTRASI
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                    {[
                                        { v: 'Exploration', i: <Sparkles size={16} />, c: '#94A3B8', g: 'Baru menjajaki minat.' },
                                        { v: 'Working', i: <Activity size={16} />, c: '#3B82F6', g: 'Fokus & asyik bekerja.' },
                                        { v: 'Deep Focus', i: <Zap size={16} />, c: '#8B5CF6', g: 'Khusyuk & kebal gangguan.' }
                                    ].map(f => (
                                        <button key={f.v} onClick={() => setEditingLog({ ...editingLog, konsentrasi: f.v })} style={{
                                            padding: '10px 4px', borderRadius: '12px', border: '2px solid',
                                            borderColor: editingLog.konsentrasi === f.v ? f.c : '#F1F5F9',
                                            background: editingLog.konsentrasi === f.v ? f.c + '10' : 'white',
                                            color: editingLog.konsentrasi === f.v ? f.c : '#94A3B8',
                                            fontWeight: 900, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                                        }}>
                                            {f.i}
                                            <div style={{ fontSize: '0.65rem', textAlign: 'center' }}>{f.v === 'Deep Focus' ? 'Deep' : f.v}</div>
                                            <div style={{ fontSize: '0.5rem', fontWeight: 700, opacity: 0.7, textAlign: 'center', lineHeight: 1 }}>{f.g}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Social & Restoration Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 900, color: '#64748B', marginBottom: '10px' }}>
                                        <Users size={14} color="#8B5CF6" /> SOSIAL
                                    </label>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {[
                                            { v: 'Individual', i: <User size={14} />, g: 'Sendiri' },
                                            { v: 'Pair', i: <Users size={14} />, g: 'Berdua' },
                                            { v: 'Collaborative', i: <Users size={14} />, g: 'Grup' }
                                        ].map(s => (
                                            <button key={s.v} onClick={() => setEditingLog({ ...editingLog, sosial: s.v })} style={{
                                                flex: 1, padding: '8px 2px', borderRadius: '10px', border: '2px solid',
                                                borderColor: (editingLog.sosial || 'Individual') === s.v ? '#4F46E5' : '#F1F5F9',
                                                background: (editingLog.sosial || 'Individual') === s.v ? '#EEF2FF' : 'white',
                                                color: (editingLog.sosial || 'Individual') === s.v ? '#4F46E5' : '#CBD5E1',
                                                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2
                                            }}>
                                                {s.i}
                                                <div style={{ fontSize: '0.5rem', fontWeight: 800 }}>{s.g}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 900, color: '#64748B', marginBottom: '10px' }}>
                                        <RotateCcw size={14} color="#10B981" /> SIKLUS KERJA
                                    </label>
                                    <button
                                        onClick={() => setEditingLog({ ...editingLog, restorasi: !editingLog.restorasi })}
                                        style={{
                                            width: '100%', padding: '8px', borderRadius: '10px', border: 'none',
                                            background: editingLog.restorasi ? '#ECFDF5' : '#FEF2F2',
                                            color: editingLog.restorasi ? '#059669' : '#DC2626',
                                            fontWeight: 900, fontSize: '0.7rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            {editingLog.restorasi ? <CheckCircle2 size={12} /> : <X size={12} />}
                                            {editingLog.restorasi ? 'Tuntas' : 'Belum'}
                                        </div>
                                        <div style={{ fontSize: '0.45rem', opacity: 0.8 }}>{editingLog.restorasi ? 'Alat Rapi' : 'Berantakan'}</div>
                                    </button>
                                </div>
                            </div>

                            {/* Mood Edit */}
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 900, color: '#64748B', marginBottom: '10px' }}>
                                    <Heart size={14} color="#EF4444" /> EMOSI (MOOD)
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                    {[
                                        { v: 'Tenang', e: <Zap size={16} />, c: '#3B82F6', g: 'Hati tenang' },
                                        { v: 'Ceria', e: <Sparkles size={16} />, c: '#F59E0B', g: 'Senang' },
                                        { v: 'Frustrasi', e: <AlertCircle size={16} />, c: '#EF4444', g: 'Lelah' }
                                    ].map(m => {
                                        const isSelected = (editingLog.mood || 'Tenang') === m.v;
                                        return (
                                            <button key={m.v} onClick={() => setEditingLog({ ...editingLog, mood: m.v })} style={{
                                                padding: '8px 4px', borderRadius: '12px', border: '2px solid',
                                                borderColor: isSelected ? m.c : '#F1F5F9',
                                                background: isSelected ? m.c + '10' : 'white',
                                                color: isSelected ? m.c : '#94A3B8',
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer'
                                            }}>
                                                {m.e}
                                                <div style={{ fontSize: '0.6rem', fontWeight: 900 }}>{m.v}</div>
                                                <div style={{ fontSize: '0.5rem', fontWeight: 700, opacity: 0.7, textAlign: 'center' }}>{m.g}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                <button onClick={() => setEditingLog(null)} style={{ flex: 1, padding: '14px', borderRadius: '16px', border: '1px solid #E2E8F0', background: 'white', fontWeight: 900, color: '#64748B' }}>Batal</button>
                                <button onClick={handleUpdate} style={{ flex: 1, padding: '14px', borderRadius: '16px', border: 'none', background: '#4F46E5', color: 'white', fontWeight: 900, boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>Simpan Perubahan</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {showDeleteConfirm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
                        <h3 style={{ fontWeight: 950, marginBottom: '8px' }}>Hapus Catatan?</h3>
                        <p style={{ color: '#64748B', fontWeight: 600, fontSize: '0.9rem', marginBottom: '24px' }}>Data ini akan dihapus permanen.</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', fontWeight: 900 }}>Batal</button>
                            <button onClick={() => handleDelete(showDeleteConfirm)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#EF4444', color: 'white', fontWeight: 900 }}>Hapus</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

const Loader2 = ({ size, className, color }) => (
    <Activity size={size} className={className} color={color} />
);
