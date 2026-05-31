import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, Target, Clock, Loader2 } from 'lucide-react';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { AREA_SENTRA_CYCLE2 as STATIC_DATA } from '../data/areaSentraCycle2';

const GRANULES = [
  {
    id: 1, day: 1, dayTitle: "Physical Mastery & Environment",
    title: "1. Adab Berjalan di Dalam Kelas", searchKey: "Adab Berjalan di Dalam Kelas",
    enTitle: "Walking in the Classroom",
    purpose: "Membangun kesadaran batasan ruang (spatial awareness), kontrol motorik kasar, dan rasa hormat pada area kerja.",
    timing: "Masa Orientasi (Hari ke-1) / Transisi antar aktivitas"
  },
  {
    id: 2, day: 1, dayTitle: "Physical Mastery & Environment",
    title: "2. Merapikan Karpet & Kursi", searchKey: "Membersihkan & Menata Rak Materi",
    enTitle: "Rolling a Mat & Tucking a Chair",
    purpose: "Menanamkan tanggung jawab, kemandirian memelihara keteraturan kelas, dan presisi gerakan tangan.",
    timing: "Setelah selesai menggunakan alat / Sebelum transisi"
  },
  {
    id: 3, day: 1, dayTitle: "Physical Mastery & Environment",
    title: "3. Adab Membawa & Menyimpan Alat", searchKey: "Adab Membawa & Menyimpan Alat",
    enTitle: "Carrying & Storing Materials",
    purpose: "Melatih keseimbangan, fokus visual, dan kehati-hatian (Tuma'ninah) dalam menjaga amanah barang.",
    timing: "Setiap mengambil dan mengembalikan alat sentra"
  },
  {
    id: 4, day: 2, dayTitle: "Focus & Voice Calibration",
    title: "4. Volume Bicara & Silence Game", searchKey: "Volume Bicara & Silence Game",
    enTitle: "Voice Calibration & Silence Game",
    purpose: "Meningkatkan regulasi diri, kontrol impuls (menahan diri), dan kepekaan pendengaran.",
    timing: "Saat kelas terlalu berisik / Sebelum sesi hening"
  },
  {
    id: 5, day: 2, dayTitle: "Focus & Voice Calibration",
    title: "5. Mendengar & Memperhatikan", searchKey: "Mendengar & Memperhatikan",
    enTitle: "Listening & Observing",
    purpose: "Membangun adab menuntut ilmu, kontak mata, dan keterampilan menyimak aktif (Active Listening).",
    timing: "Saat instruksi klasikal / circle time"
  },
  {
    id: 6, day: 3, dayTitle: "Social Harmony & Respect",
    title: "6. Adab Menonton Teman Bekerja", searchKey: "Adab Menonton Teman Bekerja",
    enTitle: "Observing Others Work",
    purpose: "Menghargai privasi teman, melatih kesabaran, dan belajar dari observasi tanpa mengganggu.",
    timing: "Saat ingin bergabung dengan teman yang sedang bekerja"
  },
  {
    id: 7, day: 3, dayTitle: "Social Harmony & Respect",
    title: "7. Adab Menunggu Giliran", searchKey: "Adab Menunggu Giliran",
    enTitle: "Waiting for a Turn",
    purpose: "Melatih regulasi emosi (menunda kepuasan), toleransi, dan memahami konsep antrean adil.",
    timing: "Saat alat yang diinginkan sedang digunakan teman"
  },
  {
    id: 8, day: 3, dayTitle: "Social Harmony & Respect",
    title: "8. Interupsi & Memotong Pembicaraan", searchKey: "Interupsi & Memotong Pembicaraan",
    enTitle: "How to Interrupt Politely",
    purpose: "Membangun kesantunan sosial, kontrol impuls verbal, dan rasa hormat.",
    timing: "Saat butuh bantuan namun guru/teman sedang bicara"
  },
  {
    id: 9, day: 3, dayTitle: "Social Harmony & Respect",
    title: "9. Meminta Maaf & Tabayyun", searchKey: "Meminta Maaf & Tabayyun",
    enTitle: "Apology & Conflict Resolution",
    purpose: "Mengembangkan empati, keberanian mengakui kesalahan, dan resolusi konflik sehat.",
    timing: "Saat terjadi perselisihan atau ketidaksengajaan"
  }
];

export default function TrainingManual() {
  const navigate = useNavigate();
  const [curriculumData, setCurriculumData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const curSnap = await getDocs(collection(db, 'kurikulum_pusat'));
        if (!curSnap.empty) {
          const curData = curSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          setCurriculumData(curData);
        } else {
          setCurriculumData(STATIC_DATA);
        }
      } catch (err) {
        console.error("Error fetching kurikulum_pusat:", err);
        setCurriculumData(STATIC_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchCurriculum();
  }, []);

  const findStepsInDatabase = (searchKey, data) => {
    let result = { steps: [], enTitle: "" };
    function search(items) {
      if (!Array.isArray(items)) return false;
      for (const item of items) {
        if (item.label && item.label.toLowerCase().includes(searchKey.toLowerCase())) {
          if (item.presentation && item.presentation.steps) {
            result.steps = item.presentation.steps;
            const parts = item.label.split('/');
            if (parts.length > 1) {
              result.enTitle = parts[1].trim();
            }
            return true;
          }
        }
        if (item.levels && search(item.levels)) return true;
        if (item.subAreas && search(item.subAreas)) return true;
      }
      return false;
    }
    search(data);
    return result;
  };

  const pagesData = useMemo(() => {
    if (loading) return [];
    return GRANULES.map(granul => {
      const dbData = findStepsInDatabase(granul.searchKey, curriculumData);
      return {
        ...granul,
        steps: dbData.steps,
        enTitle: dbData.enTitle || granul.enTitle
      };
    });
  }, [loading, curriculumData]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', color: '#64748B', background: '#F8FAFC' }}>
        <Loader2 size={32} className="animate-spin" />
        <p style={{ fontWeight: 800 }}>Membangun Manual Pelatihan...</p>
      </div>
    );
  }

  return (
    <div className="manual-root">
      <style>{`
        .manual-root {
          --primary: #1E3A8A;
          --accent: #D97706;
          --bg: #F8FAFC;
          --text: #1E293B;
          --border: #E2E8F0;
          background-color: #E2E8F0;
          min-height: 100vh;
        }

        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .manual-root { 
            background-color: white !important; 
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print { display: none !important; }
          .page {
            box-shadow: none !important;
            margin: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            padding: 8mm 12mm 15mm 12mm !important;
            border: none !important;
            page-break-after: always !important;
          }
          .cover-page {
            height: 297mm !important;
            width: 210mm !important;
            margin: 0 !important;
          }
        }

        .cover-page {
          height: 100vh;
          background-color: white;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          page-break-after: always;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .cover-bg-shape {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 60%;
          background: var(--primary);
          clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);
          z-index: 1;
        }

        .cover-accent-blob {
          position: absolute;
          top: 45%;
          right: -10%;
          width: 400px;
          height: 400px;
          background: rgba(217, 119, 6, 0.1);
          border-radius: 50%;
          z-index: 0;
        }

        .cover-header {
          position: relative;
          z-index: 2;
          height: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding-top: 40px;
        }

        .cover-logo-container {
          background: white;
          padding: 30px;
          border-radius: 30px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          margin-bottom: -60px;
          z-index: 3;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .cover-logo-img {
          width: 140px;
        }

        .cover-content {
          flex: 1;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          text-align: center;
          padding: 80px 20mm 60px;
        }

        .series-tag {
          background: var(--accent);
          color: white;
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
        }

        .cover-page h1 {
          font-size: 4.5rem;
          font-weight: 950;
          margin: 0;
          letter-spacing: -4px;
          color: var(--primary);
          line-height: 0.9;
          text-transform: uppercase;
        }

        .cover-subtitle {
          font-size: 1.4rem;
          font-weight: 500;
          color: #64748B;
          margin-top: 15px;
          letter-spacing: 4px;
          text-transform: uppercase;
          border-top: 1px solid #E2E8F0;
          padding-top: 15px;
          width: 100%;
        }

        .cover-footer-branding {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .branding-line {
          height: 2px;
          width: 40px;
          background: var(--accent);
        }

        .branding-text {
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--primary);
          letter-spacing: 2px;
        }

        .page {
          background-color: white;
          padding: 8mm 12mm 15mm 12mm;
          min-height: 297mm;
          width: 210mm;
          margin: 40px auto;
          box-sizing: border-box;
          position: relative;
          page-break-after: always;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .header-mini {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          border-bottom: 2px solid var(--border);
          padding-bottom: 8px;
          color: var(--primary);
        }

        .header-logo { height: 40px; }

        .section-title { margin-bottom: 12px; }
        .day-badge {
          background: var(--primary);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 6px;
          display: inline-block;
        }

        .presentation-box {
          background: white;
          border-radius: 12px;
          border: 1px solid var(--border);
          padding: 12px 16px;
        }

        .en-title {
          display: inline-block;
          background: rgba(30, 58, 138, 0.08);
          color: var(--primary);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .meta-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 12px;
        }

        .meta-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .steps-list {
          column-count: 2;
          column-gap: 24px;
          display: block;
        }

        .step-item {
          display: flex;
          gap: 6px;
          font-size: 0.72rem;
          line-height: 1.25;
          margin-bottom: 4px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .step-num {
          font-weight: 800;
          color: var(--primary);
          opacity: 0.5;
          min-width: 20px;
        }

        .dialogue {
          color: var(--primary);
          font-weight: 700;
          font-style: italic;
        }

        .guide-card {
          border-left: 4px solid var(--primary);
          padding-left: 20px;
          margin-bottom: 25px;
        }
        .guide-card h4 {
          color: var(--primary);
          margin-bottom: 5px;
          font-weight: 800;
          font-size: 1.1rem;
        }
        .guide-card p {
          margin: 0;
          font-size: 0.95rem;
          color: #475569;
        }

        .page-footer {
          position: absolute;
          bottom: 6mm;
          left: 12mm;
          right: 12mm;
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #94a3b8;
          border-top: 1px dashed #cbd5e1;
          padding-top: 10px;
        }

        .print-fab {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: var(--primary);
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 50px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(30, 58, 138, 0.3);
          z-index: 1000;
        }

        .back-fab {
          position: fixed;
          bottom: 30px;
          left: 30px;
          background: white;
          color: var(--text);
          border: 1px solid var(--border);
          padding: 16px 24px;
          border-radius: 50px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          z-index: 1000;
        }
      `}</style>

      <button className="back-fab no-print" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Kembali
      </button>

      <button className="print-fab no-print" onClick={() => window.print()}>
        <Printer size={20} /> Cetak Manual (PDF)
      </button>

      {/* COVER PAGE */}
      <div className="cover-page">
        <div className="cover-bg-shape" />
        <div className="cover-accent-blob" />
        
        <div className="cover-header">
          <div className="cover-logo-container">
            <img src="/logo-budiluhur.png" alt="Logo" className="cover-logo-img" />
          </div>
        </div>
        
        <div className="cover-content">
          <div className="series-tag">Training Series 2026</div>
          <h1>Pondasi<br/>Ketenangan</h1>
          <div className="cover-subtitle">Manual Pelatihan Guru</div>
          
          <div className="cover-footer-branding">
            <div className="branding-line" />
            <span className="branding-text">SDIT BUDI LUHUR SAMARINDA</span>
            <div className="branding-line" />
          </div>
        </div>
      </div>

      {/* PEDAGOGICAL GUIDE PAGE */}
      <div className="page">
        <div className="header-mini">
          <img src="/logo-budiluhur.png" alt="Logo" className="header-logo" />
          <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Panduan Pelaksanaan</span>
          <span style={{ fontWeight: 800 }}>PEDAGOGI</span>
        </div>

        <div style={{ padding: '0 2mm' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '20px', borderBottom: '4px solid var(--accent)', display: 'inline-block' }}>
            Standar Pelaksanaan Pondasi Ketenangan
          </h2>

          <div style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#334155' }}>
            <p style={{ marginBottom: '20px', fontSize: '1rem' }}>
              Untuk modul <strong>Pondasi Ketenangan (Normalization)</strong>, standarnya adalah dilakukan secara <strong>Klasikal (Satu Kelas)</strong>, bukan keseluruhan sekolah atau satu-satu (individual).
            </p>

            <h3 style={{ color: 'var(--primary)', marginTop: '20px', marginBottom: '12px', fontWeight: 900, textTransform: 'uppercase', fontSize: '1rem' }}>Mengapa Harus Klasikal (Per Kelas)?</h3>

            <div className="guide-card" style={{ marginBottom: '12px' }}>
              <h4 style={{ fontSize: '1rem' }}>1. Membangun "Kontrak Sosial" Kelas</h4>
              <p style={{ fontSize: '0.85rem' }}>Setiap kelas memiliki tata letak rak, jalur jalan, dan jenis karpet yang berbeda. Dengan melakukannya bersama-sama, Anda membangun budaya kolektif. Anak-anak belajar: <em>"Di kelas ini, kita semua bersepakat untuk berjalan dengan cara seperti ini."</em></p>
            </div>

            <div className="guide-card" style={{ marginBottom: '12px' }}>
              <h4 style={{ fontSize: '1rem' }}>2. Kekuatan "Kolektifitas"</h4>
              <p style={{ fontSize: '0.85rem' }}>Khusus untuk Silence Game dan Adab Berjalan, keberhasilannya bergantung pada atmosfer kelompok. Jika 20 anak berusaha tenang, anak yang gaduh akan merasa "terpanggil" oleh energi ketenangan kelompok tersebut.</p>
            </div>

            <div className="guide-card" style={{ marginBottom: '12px' }}>
              <h4 style={{ fontSize: '1rem' }}>3. Efisiensi Masa Orientasi</h4>
              <p style={{ fontSize: '0.85rem' }}>Ditargetkan tuntas dalam 3-10 hari pertama, presentasi klasikal memberikan standar dasar yang sama kepada seluruh siswa sebelum mereka mulai bekerja mandiri.</p>
            </div>

            <h3 style={{ color: 'var(--primary)', marginTop: '20px', marginBottom: '12px', fontWeight: 900, textTransform: 'uppercase', fontSize: '1rem' }}>Strategi Pelaksanaan di Kelas</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li style={{ marginBottom: '6px', display: 'flex', gap: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 900 }}>•</span>
                <span><strong>Circle Time:</strong> Gunakan waktu lingkaran di pagi hari (Morning Circle) untuk presentasi utama.</span>
              </li>
              <li style={{ marginBottom: '6px', display: 'flex', gap: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 900 }}>•</span>
                <span><strong>Modeling Bersama:</strong> Guru memberi contoh, lalu undang 1-2 anak mencoba di depan teman-temannya, baru kemudian seluruh kelas mencoba bergantian.</span>
              </li>
              <li style={{ marginBottom: '6px', display: 'flex', gap: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 900 }}>•</span>
                <span><strong>Refleksi Klasikal:</strong> Di akhir hari (Closing Circle), evaluasi bersama: <em>"Bagaimana tadi cara kita berjalan? Apakah kelas kita sudah terasa tenang?"</em></span>
              </li>
            </ul>

            <div style={{ marginTop: '15px', padding: '12px 16px', background: '#F8FAFC', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid #E2E8F0', color: '#64748B' }}>
              <span style={{ fontWeight: 900, color: 'var(--primary)', display: 'block', marginBottom: '2px' }}>💡 SARAN TAMBAHAN:</span>
              Meskipun presentasinya klasikal, jika ada 1-2 anak yang masih kesulitan setelah sesi selesai, Guru bisa memberikan penguatan individu di sela-sela waktu kerja mandiri nanti.
            </div>
          </div>
        </div>

        <div className="page-footer">
          <span>SDIT Budi Luhur Samarinda © 2026</span>
          <span>Panduan Pedagogi | Pondasi Ketenangan</span>
        </div>
      </div>

      {/* CONTENT PAGES */}
      {pagesData.map((page, index) => (
        <div key={page.id} className="page">
          <div className="header-mini">
            <img src="/logo-budiluhur.png" alt="Logo" className="header-logo" />
            <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Pondasi Ketenangan</span>
            <span style={{ fontWeight: 800 }}>HALAMAN {String(index + 1).padStart(2, '0')}</span>
          </div>

          <div className="section-title">
            <div className="day-badge">Hari {page.day}</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)', margin: 0 }}>{page.dayTitle}</h2>
          </div>

          <div className="presentation-box">
            <h3 style={{ fontSize: '1.4rem', marginBottom: '5px' }}>{page.title}</h3>
            <span className="en-title">{page.enTitle}</span>

            <div className="meta-cards">
              <div className="meta-card">
                <Target size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase' }}>Tujuan :</div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>{page.purpose}</p>
                </div>
              </div>
              <div className="meta-card">
                <Clock size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase' }}>Penerapan :</div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>{page.timing}</p>
                </div>
              </div>
            </div>

            <div className="steps-list">
              {page.steps.filter(s => /^\d+\./.test(s)).map((step, si) => {
                const match = step.match(/^(\d+)\.\s*(.*)/);
                const num = match ? match[1] : si + 1;
                const text = match ? match[2] : step;

                return (
                  <div key={si} className="step-item">
                    <span className="step-num">{num}</span>
                    <span>
                      {text.split(/["']([^"']+)["']/).map((part, pi) =>
                        pi % 2 === 1 ? <span key={pi} className="dialogue">"{part}"</span> : part
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="page-footer">
            <span>SDIT Budi Luhur Samarinda © 2026</span>
            <span>Modul Pondasi Ketenangan | Generated: {new Date().toLocaleDateString('id-ID')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
