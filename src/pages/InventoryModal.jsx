import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, X, ClipboardList, BookOpen, Hash, Leaf, Globe2, Moon, Wand2, ChevronDown, Cloud, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { db } from '../firebase-config';
import { collection, onSnapshot, doc, setDoc, getDocs, writeBatch } from 'firebase/firestore';

const getIcon = (iconName, size = 18) => {
  switch (iconName) {
    case 'Moon': return <Moon size={size} />;
    case 'Hash': return <Hash size={size} />;
    case 'BookOpen': return <BookOpen size={size} />;
    case 'Leaf': return <Leaf size={size} />;
    case 'Globe2': return <Globe2 size={size} />;
    case 'Wand2': return <Wand2 size={size} />;
    default: return <BookOpen size={size} />;
  }
};

const ACQUISITION_TYPES = {
  authentic: { id: 'authentic', label: '💎 WAJIB BELI', color: '#10B981', bg: '#ECFDF5', desc: 'Aparatus Autentik (Preisi & Sensorik)' },
  diy: { id: 'diy', label: '🖨️ BISA BUAT', color: '#8B5CF6', bg: '#F5F3FF', desc: 'Printable / LaminATING / Karya Guru' },
  substitute: { id: 'substitute', label: '🛠️ SUBSTITUSI', color: '#F59E0B', bg: '#FFFBEB', desc: 'Barang Umum / Toko Kelontong / Pasar' }
};

const categorizeTool = (name, area = '') => {
  const n = name.toLowerCase();
  
  // 1. AUTHENTIC (WAJIB BELI) - Specialized Montessori materials
  const keywordsAuthentic = [
    'beads', 'golden', 'stamp game', 'bead cabinet', 'frame', 'checkerboard', 'board', 'papan', 
    'cabinet', 'laci', 'box', 'kotak kayu', 'cube', 'kubus', 'puzzle map', 'insets', 'stand', 
    'rack', 'wooden', 'cylinder', 'geometris', 'fraksi', 'sandpaper', 'alphabet'
  ];
  
  // 2. DIY (BISA BUAT) - Document/Card based
  const keywordsDIY = [
    'card', 'kartu', 'nomenclature', 'nomenclature', 'label', 'picture', 'gambar', 'chart', 'tabel', 
    'timeline', 'garis waktu', 'book', 'buku', 'command', 'perintah', 'folder', 'atlas', 'sheet', 
    'peta (kertas)', 'kertas', 'laminating', 'print', 'poster', 'klasifikasi'
  ];
  
  // 3. SUBSTITUTE (SUBSTITUSI) - General household/school items
  const keywordsSubstitute = [
    'tali', 'gunting', 'kain', 'baskom', 'botol', 'pipet', 'garam', 'gula', 'kacang', 'pasir', 
    'spidol', 'pensil', 'penghapus', 'lem', 'tape', 'selotip', 'wadah', 'mangkuk', 'nampan', 
    'tray', 'sendok', 'garpu', 'sumpit', 'pinset', 'kacang hijau', 'beras', 'air'
  ];

  if (keywordsAuthentic.some(k => n.includes(k)) || area === 'Mathematics' || area === 'Geometry') return 'authentic';
  if (keywordsDIY.some(k => n.includes(k)) || area === 'Language' || area === 'History') return 'diy';
  if (keywordsSubstitute.some(k => n.includes(k)) || area === 'Practical Life') return 'substitute';
  
  return 'authentic'; // Default to authentic to be safe
};

function splitTools(toolString) {
  if (!toolString) return [];
  const tools = [];
  let current = '';
  let depth = 0;
  for (const char of toolString) {
    if (char === '(') depth++;
    if (char === ')') depth--;
    if (char === ',' && depth === 0) {
      const trimmed = current.trim();
      if (trimmed && trimmed.length > 2) tools.push(trimmed);
      current = '';
    } else {
      current += char;
    }
  }
  const last = current.trim();
  if (last && last.length > 2) tools.push(last);
  return tools;
}

const norm = (n) => n.toLowerCase().replace(/\s+/g, ' ').trim();

export default function InventoryModal({ curriculum, onClose }) {
  const [gradeTab, setGradeTab] = useState('Semua');
  const [areaTab, setAreaTab] = useState('Semua');
  const [typeFilter, setTypeFilter] = useState('Semua'); // New: authentic, diy, substitute
  const [search, setSearch] = useState('');
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [invData, setInvData] = useState({});
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [localToCloudPrompt, setLocalToCloudPrompt] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);

  // 0. FIRESTORE SYNC
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'inventaris_ape'), (snap) => {
      const data = {};
      snap.forEach(d => data[d.id] = d.data());
      setInvData(data);
      setIsCloudSynced(true);
      
      // Check if we need to sync OLD local data to NEW cloud
      const oldLocal = localStorage.getItem('sdit_inventory');
      if (oldLocal && snap.empty) {
        setLocalToCloudPrompt(true);
      }
    }, (err) => {
      console.error("Firestore Error:", err);
      setIsCloudSynced(false);
    });
    return () => unsub();
  }, []);

  const syncLocalToCloud = async () => {
    try {
      const oldLocal = JSON.parse(localStorage.getItem('sdit_inventory') || '{}');
      const batch = writeBatch(db);
      Object.entries(oldLocal).forEach(([id, val]) => {
        const ref = doc(db, 'inventaris_ape', id);
        batch.set(ref, val);
      });
      await batch.commit();
      setLocalToCloudPrompt(false);
      localStorage.removeItem('sdit_inventory'); // Clear once moved
      alert("🎉 Data lama berhasil dipindah ke Cloud!");
    } catch (err) {
      alert("Gagal sinkronisasi data lokal ke cloud.");
    }
  };

  // 1. DATA PROCESSING (MEMO)
  const allItems = useMemo(() => {
    const map = new Map();
    curriculum.forEach(area => {
      area.subAreas?.forEach(sa => {
        sa.levels.forEach(lvl => {
          const isObj = typeof lvl === 'object';
          const label = isObj ? lvl.label : lvl;
          const presentation = isObj ? lvl.presentation : null;
          
          if (!presentation) return;

          // PRIORITIZE Item-by-Item array (toolsList), fallback to legacy string (tool)
          let extractedTools = [];
          if (presentation.toolsList && Array.isArray(presentation.toolsList)) {
              extractedTools = presentation.toolsList;
          } else if (presentation.tool && typeof presentation.tool === 'string') {
              extractedTools = splitTools(presentation.tool);
          }

          if (extractedTools.length === 0) return;

          const gm = label.match(/^(K\d|3Y|K1\/K2|K2\/K3)/);
          const grade = gm ? gm[1] : '';
          const mat = label.split(': ').slice(1).join(': ').split(' / ')[0] || label;

          extractedTools.forEach(t => {
            const nk = norm(t);
            if (!map.has(nk)) map.set(nk, { displayName: t, areas: new Map(), grades: new Set(), materials: [], count: 0 });
            const e = map.get(nk);
            
            // Prefer the longer/better cased name for display
            if (t.length > e.displayName.length) e.displayName = t;
            
            if (!e.areas.has(area.name)) e.areas.set(area.name, { color: area.color, icon: area.icon, cnt: 0 });
            e.areas.get(area.name).cnt++;
            e.grades.add(grade);
            e.materials.push({ material: mat, area: area.name, grade, subArea: sa.name });
            e.count++;
          });
        });
      });
    });
    return Array.from(map.entries()).map(([id, d]) => {
      const mainArea = Array.from(d.areas.keys())[0] || '';
      return {
        id, 
        name: d.displayName,
        areas: Array.from(d.areas.entries()).map(([n, info]) => ({ name: n, ...info })),
        grades: Array.from(d.grades),
        materials: d.materials,
        count: d.count,
        baseType: categorizeTool(d.displayName, mainArea)
      };
    }).sort((a, b) => b.count - a.count);
  }, [curriculum]);

  const filtered = useMemo(() => {
    return allItems.filter(item => {
      if (gradeTab !== 'Semua') {
        if (gradeTab === '3Y') { if (!item.grades.includes('3Y')) return false; }
        else { if (!item.grades.includes(gradeTab) && !item.grades.includes('3Y')) return false; }
      }
      if (areaTab !== 'Semua' && !item.areas.some(a => a.name === areaTab)) return false;
      
      const statusData = invData[item.id] || {};
      const actualType = statusData.type || item.baseType;
      
      if (typeFilter !== 'Semua' && actualType !== typeFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.materials.some(m => m.material.toLowerCase().includes(q));
      }
      return true;
    }).map(item => ({ ...item, ...(invData[item.id] || { status: 'belum', qty: 1, price: 0, type: item.baseType }) }));
  }, [allItems, gradeTab, areaTab, typeFilter, search, invData]);

  const stats = useMemo(() => {
    const t = filtered.length;
    const p = filtered.filter(i => i.status === 'punya').length;
    const r = filtered.filter(i => i.status === 'rusak').length;
    const b = t - p - r;
    const budget = filtered.filter(i => i.status !== 'punya').reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
    return { total: t, punya: p, rusak: r, belum: b, budget };
  }, [filtered]);

  // 2. CALLBACKS
  const toggleCheck = useCallback((id) => {
    setCheckedItems(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }, []);

  const updateItem = useCallback(async (id, field, value) => {
    // Optimistic UI update
    setInvData(prev => ({ ...prev, [id]: { ...(prev[id] || { status: 'belum', qty: 1, price: 0 }), [field]: value } }));
    
    // Save to Firestore
    try {
      const itemRef = doc(db, 'inventaris_ape', id);
      await setDoc(itemRef, { 
        ...(invData[id] || { status: 'belum', qty: 1, price: 0 }), 
        [field]: value,
        updatedAt: new Date()
      }, { merge: true });
    } catch (err) {
      console.error("Save Error:", err);
    }
  }, [invData]);

  const toggleAll = useCallback(() => {
    const visibleIds = filtered.map(i => i.id);
    const allVisibleChecked = visibleIds.every(id => checkedItems.has(id));
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (allVisibleChecked) visibleIds.forEach(id => next.delete(id));
      else visibleIds.forEach(id => next.add(id));
      return next;
    });
  }, [filtered, checkedItems]);

  const exportCSV = useCallback(() => {
    const selected = filtered.filter(i => checkedItems.has(i.id));
    const target = selected.length > 0 ? selected : filtered;
    const BOM = '\uFEFF';
    const h = 'No,Nama Alat,Status,Jumlah,Estimasi Harga (Rp),Area,Grade,Materi\n';
    const rows = target.map((it, i) =>
      `${i + 1},"${it.name.replace(/"/g, '""')}",${it.status === 'punya' ? 'Dimiliki' : it.status === 'rusak' ? 'Rusak' : 'Belum'}` +
      `,${it.qty},${it.price},"${it.areas.map(a => a.name).join('; ')}","${it.grades.join('; ')}","${it.materials.map(m => m.material).join('; ')}"`
    ).join('\n');
    const blob = new Blob([BOM + h + rows], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `inventaris_APE_${gradeTab}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }, [filtered, checkedItems, gradeTab]);

  const printChecklist = useCallback(() => {
    let items = filtered.filter(i => checkedItems.has(i.id));
    if (items.length === 0) {
      alert('Silakan centang alat yang ingin dicetak terlebih dahulu.');
      return;
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Checklist Belanja APE</title>
    <style>
      body{font-family:'Segoe UI',sans-serif;padding:40px;color:#1e293b;font-size:12px}
      h1{font-size:16px;margin-bottom:2px}h2{font-size:12px;color:#64748b;font-weight:normal;margin-bottom:20px}
      table{width:100%;border-collapse:collapse}th{background:#f1f5f9;text-align:left;padding:6px 10px;border:1px solid #e2e8f0;font-weight:700}
      td{padding:6px 10px;border:1px solid #e2e8f0;vertical-align:top}tr:nth-child(even){background:#f8fafc}
      .ck{width:14px;height:14px;border:2px solid #cbd5e1;border-radius:3px;display:inline-block}
      .b{display:inline-block;padding:1px 6px;border-radius:3px;font-size:10px;font-weight:700}
      .bb{background:#fef2f2;color:#dc2626}.br{background:#fefce8;color:#ca8a04}.bp{background:#ecfdf5;color:#059669}
      .ft{margin-top:24px;font-size:10px;color:#94a3b8;text-align:center}
    </style></head><body>
    <h1>📦 Checklist Belanja APE — SDIT Budi Luhur Samarinda</h1>
    <h2>Filter: ${gradeTab} | ${areaTab} | ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</h2>
    <table><thead><tr><th style="width:24px">✓</th><th>No</th><th>Nama Alat</th><th>Status</th><th>Qty</th><th>Est. Harga</th><th>Area</th></tr></thead>
    <tbody>${items.map((it, i) => `<tr><td><span class="ck"></span></td><td>${i + 1}</td><td><b>${it.name}</b></td>
    <td><span class="b ${it.status === 'punya' ? 'bp' : it.status === 'rusak' ? 'br' : 'bb'}">${it.status === 'punya' ? 'Dimiliki' : it.status === 'rusak' ? 'Rusak' : 'Belum'}</span></td>
    <td>${it.qty}</td><td>${it.price ? 'Rp ' + it.price.toLocaleString('id-ID') : '-'}</td>
    <td>${it.areas.map(a => a.name).join(', ')}</td></tr>`).join('')}</tbody></table>
    <div style="margin-top:12px;text-align:right;font-weight:700">Total: ${items.length} item | Budget: Rp ${items.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0).toLocaleString('id-ID')}</div>
    <div class="ft">Dicetak dari Sistem Jurnal Aktivitas — SDIT Budi Luhur Samarinda</div></body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html); w.document.close(); w.setTimeout(() => w.print(), 500);
  }, [filtered, checkedItems, gradeTab, areaTab]);

  const SC = { punya: { bg: '#ECFDF5', c: '#059669', l: '✅ Dimiliki' }, rusak: { bg: '#FFFBEB', c: '#D97706', l: '⚠️ Rusak' }, belum: { bg: '#FEF2F2', c: '#DC2626', l: '❌ Belum' } };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.7)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(16px)' }} onClick={onClose}>
      <div style={{ backgroundColor: '#F8FAFC', width: '1200px', maxWidth: '96vw', height: '94vh', borderRadius: '32px', display: 'flex', flexDirection: 'column', animation: 'popIn 0.3s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 50px 120px rgba(0,0,0,0.5)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

        {/* 1. HEADER */}
        <div style={{ padding: '24px 36px', backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: 0, color: '#0F172A' }}>📦 Inventaris Sarpras APE</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              {isCloudSynced ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 700, color: '#10B981', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '20px' }}>
                  <Cloud size={12} /> Cloud Real-time Synced
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 700, color: '#F59E0B', backgroundColor: '#FFFBEB', padding: '2px 8px', borderRadius: '20px' }}>
                  <RefreshCw size={12} className="spin" /> Connecting to Cloud...
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '14px', gap: '2px' }}>
            {['Semua', 'K1', 'K2', 'K3', '3Y'].map(g => (
              <button key={g} onClick={() => setGradeTab(g)}
                style={{ padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: gradeTab === g ? 'white' : 'transparent', color: gradeTab === g ? '#0F172A' : '#64748B', fontWeight: 800, fontSize: '0.82rem', transition: 'all 0.2s', boxShadow: gradeTab === g ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }}>
                {g === 'Semua' ? '🌐 Semua' : g === '3Y' ? '🔄 3Y' : `K${g[1]}`}
              </button>
            ))}
          </div>

          <button onClick={onClose} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}><X size={22} color="#64748B" /></button>
        </div>

        {/* 🚀 DATA MIGRATION ALERT */}
        {localToCloudPrompt && (
          <div style={{ 
            backgroundColor: '#FF7E5F', 
            background: 'linear-gradient(45deg, #FF7E5F, #FEB47B)',
            padding: '16px 24px', 
            borderRadius: '24px', 
            margin: '20px 36px 0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            boxShadow: '0 20px 40px rgba(255, 126, 95, 0.3)',
            color: 'white',
            zIndex: 10,
            animation: 'slideIn 0.5s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '16px' }}>
                <Cloud size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '0.5px' }}>DATA LOKAL TERDETEKSI! ☁️</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 500 }}>Bunda punya catatan inventaris lama di laptop ini. Pindah ke Cloud agar bisa diakses dari HP ustadzah lain?</div>
              </div>
            </div>
            <button 
              onClick={syncLocalToCloud}
              style={{ 
                backgroundColor: 'white', 
                color: '#FF7E5F', 
                border: 'none', 
                padding: '12px 24px', 
                borderRadius: '16px', 
                fontWeight: 900, 
                fontSize: '0.85rem', 
                cursor: 'pointer',
                boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                flexShrink: 0,
                marginLeft: '20px'
              }}
            >
              MIGRASI SEKARANG
            </button>
          </div>
        )}

        {/* 2. BODY */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* SIDEBAR */}
          <div className="inv-sidebar" style={{ width: '240px', backgroundColor: 'white', borderRight: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ padding: '18px 20px 10px', fontSize: '0.68rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Filter Area</div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px 20px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <button onClick={() => setAreaTab('Semua')}
                style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', backgroundColor: areaTab === 'Semua' ? '#0F172A' : 'transparent', color: areaTab === 'Semua' ? 'white' : '#475569', fontWeight: 700, fontSize: '0.82rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.15s' }}>
                🌍 Semua Area
              </button>
              {curriculum.map(area => (
                <button key={area.id} onClick={() => setAreaTab(area.name)}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', backgroundColor: areaTab === area.name ? area.color : 'transparent', color: areaTab === area.name ? 'white' : '#475569', fontWeight: 700, fontSize: '0.82rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.15s' }}>
                  <div style={{ color: areaTab === area.name ? 'white' : area.color }}>{getIcon(area.icon, 16)}</div>
                  {area.shortName || area.name}
                </button>
              ))}
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid #F1F5F9', backgroundColor: '#FAFBFC' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Estimasi Budget</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 950, color: '#0F172A' }}>Rp {stats.budget.toLocaleString('id-ID')}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>{stats.belum + stats.rusak} item belanja</div>
            </div>
          </div>

          {/* LIST */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* Search */}
            <div style={{ padding: '14px 28px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: 'white', flexShrink: 0 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input type="text" placeholder="Cari alat peraga..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '12px', border: '1.5px solid #E2E8F0', backgroundColor: '#F8FAFC', outline: 'none', fontSize: '0.85rem', fontWeight: 600 }} />
              </div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: '#F1F5F9', padding: '4px 8px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748B' }}>SUMBER:</span>
                {['Semua', 'authentic', 'diy', 'substitute'].map(t => (
                  <button key={t} onClick={() => setTypeFilter(t)} 
                    style={{ 
                      padding: '6px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      backgroundColor: typeFilter === t ? 'white' : 'transparent',
                      color: typeFilter === t ? '#0F172A' : '#64748B',
                      fontSize: '0.7rem', fontWeight: 800, transition: 'all 0.2s',
                      boxShadow: typeFilter === t ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                    }}>
                    {t === 'Semua' ? '🌈 ALL' : ACQUISITION_TYPES[t].label.split(' ')[0]}
                  </button>
                ))}
              </div>

              <button onClick={exportCSV} style={{ padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #E2E8F0', backgroundColor: 'white', color: '#475569', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>📥 Export</button>
              <button onClick={printChecklist} style={{ padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #E2E8F0', backgroundColor: 'white', color: '#475569', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>🖨️ Cetak</button>
            </div>

            {/* Table Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 28px', fontSize: '0.66rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', backgroundColor: '#FAFBFC', borderBottom: '1px solid #F1F5F9', flexShrink: 0 }}>
              <div style={{ width: '28px', display: 'flex', justifyContent: 'center' }}>
                <div onClick={toggleAll}
                  style={{ width: '18px', height: '18px', borderRadius: '5px', border: filtered.length > 0 && filtered.every(i => checkedItems.has(i.id)) ? '2px solid #0F172A' : '2px solid #CBD5E1', backgroundColor: filtered.length > 0 && filtered.every(i => checkedItems.has(i.id)) ? '#0F172A' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  {filtered.length > 0 && filtered.every(i => checkedItems.has(i.id)) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
              </div>
              <div style={{ flex: 1 }}>Nama Alat</div>
              <div style={{ width: '150px', textAlign: 'center' }}>Area</div>
              <div style={{ width: '130px', textAlign: 'center' }}>Tipe/Sumber</div>
              <div style={{ width: '110px', textAlign: 'center' }}>Status</div>
              <div style={{ width: '52px', textAlign: 'center' }}>Qty</div>
              <div style={{ width: '110px', textAlign: 'center' }}>Est. Harga</div>
              <div style={{ width: '28px' }}></div>
            </div>

            {/* List Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 80px' }}>
              {filtered.map(item => {
                const isExp = expandedItem === item.id;
                const sc = SC[item.status] || SC.belum;
                const typeInfo = ACQUISITION_TYPES[item.type || item.baseType];
                
                return (
                  <div key={item.id} style={{ backgroundColor: 'white', borderRadius: '12px', border: isExp ? '2px solid #6366F120' : '1px solid #F1F5F9', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', cursor: 'pointer' }} onClick={() => setExpandedItem(isExp ? null : item.id)}>
                      <div onClick={e => { e.stopPropagation(); toggleCheck(item.id); }}
                        style={{ width: '26px', height: '26px', borderRadius: '8px', border: checkedItems.has(item.id) ? '2px solid #0F172A' : '2px solid #D1D5DB', backgroundColor: checkedItems.has(item.id) ? '#0F172A' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                        {checkedItems.has(item.id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: isExp ? 'normal' : 'nowrap' }}>{item.name}</div>
                      </div>
                      <div style={{ width: '150px', display: 'flex', gap: '3px', justifyContent: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
                        {item.areas.slice(0, 2).map(a => (
                          <div key={a.name} style={{ padding: '2px 7px', borderRadius: '5px', backgroundColor: `${a.color}14`, fontSize: '0.62rem', fontWeight: 800, color: a.color }}>{a.name.split(' ')[0]}</div>
                        ))}
                      </div>
                      
                      <div style={{ width: '130px', textAlign: 'center', flexShrink: 0 }}>
                        <select 
                          value={item.type || item.baseType} 
                          onClick={e => e.stopPropagation()} 
                          onChange={e => updateItem(item.id, 'type', e.target.value)}
                          style={{ 
                            padding: '5px 8px', borderRadius: '8px', border: 'none', 
                            backgroundColor: typeInfo.bg, 
                            color: typeInfo.color, 
                            fontWeight: 800, fontSize: '0.62rem', cursor: 'pointer', outline: 'none' 
                          }}>
                          {Object.values(ACQUISITION_TYPES).map(t => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ width: '110px', textAlign: 'center', flexShrink: 0 }}>
                        <select value={item.status} onClick={e => e.stopPropagation()} onChange={e => updateItem(item.id, 'status', e.target.value)}
                          style={{ padding: '5px 8px', borderRadius: '8px', border: 'none', backgroundColor: sc.bg, color: sc.c, fontWeight: 800, fontSize: '0.72rem', cursor: 'pointer', outline: 'none' }}>
                          <option value="belum">❌ Belum</option>
                          <option value="punya">✅ Punya</option>
                          <option value="rusak">⚠️ Rusak</option>
                        </select>
                      </div>

                      <div style={{ width: '52px', textAlign: 'center', flexShrink: 0 }}>
                         <input type="number" min="1" value={item.qty} onClick={e => e.stopPropagation()} onChange={e => updateItem(item.id, 'qty', parseInt(e.target.value) || 1)}
                           style={{ width: '44px', padding: '5px 2px', borderRadius: '8px', border: '1.5px solid #E2E8F0', textAlign: 'center', fontWeight: 700, fontSize: '0.82rem' }} />
                      </div>
                      
                      <div style={{ width: '110px', textAlign: 'center', flexShrink: 0 }}>
                         <input type="number" step="5000" placeholder="Rp" value={item.price || ''} onClick={e => e.stopPropagation()} onChange={e => updateItem(item.id, 'price', parseInt(e.target.value) || 0)}
                           style={{ width: '100px', padding: '5px 6px', borderRadius: '8px', border: '1.5px solid #E2E8F0', textAlign: 'right', fontSize: '0.78rem' }} />
                      </div>
                      
                      <div style={{ width: '28px', color: '#94A3B8', transform: isExp ? 'rotate(180deg)' : 'none', flexShrink: 0 }}><ChevronDown size={16} /></div>
                    </div>
                    {isExp && (
                      <div style={{ padding: '0 14px 14px', borderTop: '1px solid #F8FAFC' }}>
                        <div style={{ marginTop: '10px', padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '10px', fontSize: '0.78rem' }}>
                          <div style={{ fontWeight: 800, color: '#64748B', fontSize: '0.65rem', marginBottom: '6px' }}>📚 DIGUNAKAN DI:</div>
                          {item.materials.map((m, mi) => (
                            <div key={mi} style={{ color: '#475569', marginBottom: '2px' }}>• {m.grade}: {m.material} ({m.subArea})</div>
                          ))}
                        </div>
                        <div style={{ marginTop: '10px', display: 'flex', gap: '6px' }}>
                           <button onClick={() => window.open(`https://www.tokopedia.com/search?st=product&q=${encodeURIComponent('montessori ' + item.name)}`, '_blank')} style={subBtn}>🛒 Tokopedia</button>
                           <button onClick={() => window.open(`https://shopee.co.id/search?keyword=${encodeURIComponent('montessori ' + item.name)}`, '_blank')} style={subBtn}>🛒 Shopee</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. FOOTER */}
        <div style={{ padding: '16px 36px', borderTop: '1px solid #E2E8F0', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '24px' }}>
             <Stat label="Total" value={stats.total} />
             <Stat label="Dibeli" value={stats.belum + stats.rusak} color="#EF4444" />
             <Stat label="Budget" value={`Rp ${stats.budget.toLocaleString('id-ID')}`} />
          </div>
          <button onClick={printChecklist} style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', background: '#0F172A', color: 'white', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer' }}>🖨️ Cetak Checklist Terpilih</button>
        </div>
      </div>
    </div>
  );
}

const subBtn = { padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' };

function Stat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: color || '#0F172A' }}>{value}</div>
    </div>
  );
}
