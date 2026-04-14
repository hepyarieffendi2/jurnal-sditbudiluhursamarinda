import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, XCircle, CheckCircle2, AlertTriangle, Lightbulb, Save, Edit3, Plus, Trash2, X, Loader, ChevronDown, ChevronUp, Download, Search } from 'lucide-react';
import { db } from '../firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const defaultCases = [
  {
    id: 1,
    kategori: "Pembelajaran",
    title: "Mengobrol Saat Penjelasan",
    kasus: "Saat guru sedang menerangkan materi di depan kelas, dua orang siswa terus-menerus mengobrol sendiri di belakang.",
    tradisional: "Budi, Anton! Coba diam! Kalau kalian bicara terus, silakan keluar dari kelas!",
    positif: "Berhenti sejenak, tatap mata anak. 'Bapak lihat kalian sedang asyik berdiskusi. Waktunya Bapak yang bicara, obrolannya disimpan dulu untuk jam istirahat ya.'",
    konsekuensi: "Anak diminta menjelaskan ulang poin penting terakhir yang disampaikan guru kepada teman sekelasnya."
  },
  {
    id: 2,
    kategori: "Pembelajaran",
    title: "Menolak Mengerjakan Tugas / Jurnal",
    kasus: "Saat sesi tugas mandiri, seorang siswi menelungkupkan kepalanya di meja dan menolak menyentuh bukunya.",
    tradisional: "Kamu malas sekali! Teman-temanmu sudah setengah jalan. Kerjakan sekarang kalau tidak, tidak boleh istirahat!",
    positif: "Menghampiri privat. 'Ibu lihat kamu kurang bersemangat. Terasa terlalu sulit? Mari kita kerjakan 1 soal sama-sama, sisanya Ibu yakin kamu bisa.'",
    konsekuensi: "Tetap harus menyelesaikan sisa tugas tersebut pada saat jam istirahat (sebagai ganti membuang waktu belajar)."
  },
  {
    id: 3,
    kategori: "Sosial & Empati",
    title: "Bercanda Kasar",
    kasus: "Anak laki-laki bercanda saling dorong, yang satu kelewat batas sehingga temannya jatuh dan menangis.",
    tradisional: "Sudah Ibu bilang jangan main kasar! Sini kamu, minta maaf sekarang! Menangis saja kalian ini.",
    positif: "Pisahkan dulu (cooling-down). 'Bapak lihat bercandanya merugikan teman. Tadi awalnya bagaimana? Lalu apa yang bisa kamu lakukan agar temanmu merasa mendingan?'",
    konsekuensi: "Tidak diizinkan mengikuti permainan fisik hari itu, dan membantu pemulihan temannya (misal: mengambilkan air minum/obat)."
  },
  {
    id: 4,
    kategori: "Ketertiban",
    title: "Membuang Sampah Sembarangan",
    kasus: "Anak memakan kemasan jajan lalu membuang bungkusnya diam-diam di laci meja.",
    tradisional: "Siapa yang buang ini?! Kalian ini jorok sekali, sudah masuk SD tapi buang sampah saja harus diajari!",
    positif: "Wah, Ibu menemukan ada sampah yang salah tempat. Di mana tempat sampah kita? Tolong periksa laci masing-masing dan selamatkan sampah yang salah tempat terbang ke tongnya.",
    konsekuensi: "Bertanggung jawab merapikan dan memastikan kebersihan laci mejanya, serta satu baris meja di sekitarnya sebelum pulang sekolah."
  },
  {
    id: 5,
    kategori: "Ketertiban",
    title: "Terlambat Datang ke Sekolah",
    kasus: "Siswa datang terlambat 15 menit ketika kegiatan ikrar dan instruksi pagi sudah selesai.",
    tradisional: "Kenapa telat terus? Sekarang kamu berdiri di lapangan hormat bendera, atau disetrap berdiri di depan kelas!",
    positif: "Sambut secara netral tanpa menyindir. 'Selamat pagi, Budi. Silakan masuk, tenangkan diri, dan gabung dengan kelompok. Nanti saat istirahat kita ngobrol sebentar ya.'",
    konsekuensi: "Memotong waktu istirahat si anak sebesar waktu keterlambatannya guna mengejar jurnal/kegiatan yang tertinggal (kompensasi waktu hilang)."
  },
  {
    id: 6,
    kategori: "Perilaku Kritis",
    title: "Membentak Balik / Tidak Sopan pada Guru",
    kasus: "Saat ditegur peringatan pertama, siswa menolak instruksi dan membentak balik gurunya di depan teman-teman.",
    tradisional: "Kamu berani melawan?! Kamu nggak ada sopan santunnya ya sama guru! Keluar kelas sekarang!",
    positif: "Jangan terpancing egonya (stay cool). 'Bapak lihat kamu sangat marah, tapi nada bicaramu tidak sopan. Bapak tidak akan berdebat sekarang. Silakan menjauh (Time-Out) ke sudut tenang kelas sampai emosimu reda.'",
    konsekuensi: "Siswa tidak akan difasilitasi atau diajak bicara lebih lanjut oleh guru sebelum ia bisa menetralkan nada bicaranya dan siap membahas penyelesaian."
  },
  {
    id: 7,
    kategori: "Sosial & Empati",
    title: "Menyembunyikan/Melempar Barang Teman",
    kasus: "Beberapa siswa iseng mengoper kotak pensil temannya seperti bola voli sambil tertawa, sementara pemiliknya panik.",
    tradisional: "Kalian jahil terus! Kembalikan cepat! Nanti Ibu laporkan kalian semua ke wali murid biar dimarahi di rumah!",
    positif: "Hentikan aktivitas tegas. 'Barang teman bukan mainan lempar tangkap. Ini merugikan dan membuat khawatir pemiliknya. Tolong hentikan sekarang.'",
    konsekuensi: "Para pelaku diminta mengecek apakah ada pulpen yang patah/rusak akibat dilempar, mengumpulkannya kembali dengan rapi, dan mengembalikannya ke pemiliknya secara langsung."
  },
  {
    id: 8,
    kategori: "Karakter & Ibadah",
    title: "Bolos Jamaah Shalat (Dhuha/Dzuhur)",
    kasus: "Siswa bersembunyi di toilet atau kantin dengan berbagai alasan agar terhindar dari jamaah shalat.",
    tradisional: "Kamu ini bikin dosa saja! Sana wudhu, Ibu hukum kamu shalat berdiri paling depan dan disetrap 10 menit setelahnya!",
    positif: "Jangan buat ibadah jadi hukuman. 'Bapak lihat kamu menghindar. Apa yang membuatmu kurang nyaman? Jika sedang kurang sehat, kamu boleh shalat sambil duduk, kita menghadap Tuhan sama-sama.'",
    konsekuensi: "Karena meninggalkan hak jamaah, maka anak tersebut tetap harus mengqadha (mengganti) shalatnya sendiri di waktu istirahat utama sebelum ia diizinkan bermain."
  },
  {
    id: 9,
    kategori: "Karakter & Ibadah",
    title: "Bercanda Membatalkan Shalat",
    kasus: "Siswa sengaja menginjak kaki teman sebelah atau menarik pecinya saat sedang shalat.",
    tradisional: "Yang bercanda sana keluar barisan! Minta ampun sama Allah, batal shalat kalian semua gara-gara kamu!",
    positif: "Setelah selesai shalat, dekati pelan-pelan. 'Bapak lihat kamu kesulitan menjaga lisan dan tanganmu untuk diam saat menghadap Ilahi. Besok kamu shalat merapat di samping Bapak ya agar bantu fokus.'",
    konsekuensi: "Siswa ditugaskan menjaga ketertiban shaf shalat keesokan harinya, bertugas merapikan sajadah, atau dikondisikan shalat tepat di samping guru (Shadowing)."
  },
  {
    id: 10,
    kategori: "Ketertiban Akademis",
    title: "Mencontek Saat Ujian / Tugas",
    kasus: "Guru memergoki siswa secara sembunyi-sembunyi menyalin jawaban di kertas milik temannya.",
    tradisional: "Berani kamu mencontek! Nol nilaimu! Ibu sobek kertasmu sekarang juga, pembohong!",
    positif: "Pisahkan secara diam-diam. 'Ibu lihat kamu memilih menyalin kertas teman karena ragu dengan kemampuanmu sendiri. Tolong tutup kertasnya, temui Ibu sebentar pas istirahat.'",
    konsekuensi: "Kertas tugas tersebut dibatalkan, namun anak diberikan lembar tugas pengganti dengan soal berbeda untuk dikerjakan sambil diawasi langsung oleh guru."
  },
  {
    id: 11,
    kategori: "Sosial & Empati",
    title: "Mengejek Nama Orang Tua",
    kasus: "Siswa saling memanggil dengan nama bapaknya/ibunya sambil tertawa, hingga ada teman yang sakit hati/menangis.",
    tradisional: "Sudah, diam! Kenapa bawa-bawa nama bapak? Mau Ibu laporkan guru BK biar dipanggil orang orangtua kalian?!",
    positif: "Validasi secara tegas. 'Nama orang tua kita itu hadiah dan terhormat, bukan bahan tertawaan kelas. Perkataanmu baru saja membuat temanmu sangat sedih jatuhnya.'",
    konsekuensi: "Pelaku harus membuat satu kartu ucapan maaf khusus dan karya kecil buatan tangan, ditujukan untuk orang tua teman yang ia ejek namanya tersebut."
  },
  {
    id: 12,
    kategori: "Sosial & Empati",
    title: "Pilih Kasih / Menolak Teman Sekelompok",
    kasus: "Saat pembagian grup, siswa terang-terangan berteriak 'Aku nggak mau sama dia, dia lelet/bodoh!'",
    tradisional: "Nggak boleh pilih-pilih teman! Harus mau semuanya, kalau nggak mau kelompoknya Ibu batalkan biar kalian kerjakan tugas sendirian semua!",
    positif: "Tatap mata penjawab dengan tenang. 'Kalimatmu sangat melukai perasaannya. Di kelas ini semua anak berharga dan punya keunikannya, kita berlatih bekerja sama dengan siapa saja.'",
    konsekuensi: "Anak yang menolak diajak bicara 4 mata untuk melatih mengeluarkan opini dengan 'I-Statement' (kalimat asertif), dan ia harus maju sebagai presentator utama yang mewakili kerja keras teman yang ia tolak tadi."
  },
  {
    id: 13,
    kategori: "Regulasi Emosi",
    title: "Tantrum Keluar Ruangan (Meltdown)",
    kasus: "Siswa menangis histeris, menolak instruksi guru, atau mengurung diri di bawah meja/keluar kelas.",
    tradisional: "Ayo bangun! Jangan manja! Sudah besar kok nangis kayak anak TK, memalukan dilihat kelas sebelah! (Sambil ditarik paksa).",
    positif: "Duduk rileks sejajar atau beri jarak aman. 'Bapak ada di sini menjagamu. Tumpahkan saja tangismu kalau memang sedang sedih. Bapak tunggu di kursi ini sampai badanmu lebih rileks.'",
    konsekuensi: "Setelah reda (bisa memakan waktu 30 menit), tanyakan perasaannya. Konsekuensi naturalnya adalah anak kehilangan waktu bermainnya karena ia harus menyalin catatan kelas yang tertinggal saat ia menangis."
  },
  {
    id: 14,
    kategori: "Ketertiban",
    title: "Menyerobot Antrean (Wudhu / Cuci Tangan)",
    kasus: "Siswa tidak mau bersabar dan memaksa maju melewati teman-temannya yang sudah antre lebih dulu.",
    tradisional: "Hayo! Kenapa kamu nyerobot barisan?! Mundur sana! Nggak bisa apa disuruh antre sabar sedikit?!",
    positif: "Tegur dengan nada datar dan tegas. 'Ibu lihat kamu berjalan ke depan padahal teman-temanmu sudah berbaris. Di sekolah kita berlatih budaya antre.'",
    konsekuensi: "Anak dialihkan BUKAN ke urutan berdirinya yang awal semula, melainkan *harus mengantre ulang dari urutan paling belakang (terakhir)* sebagai harga atas ketidaksabarannya."
  },
  {
    id: 15,
    kategori: "Keselamatan",
    title: "Berlari di Kelas / Tangga Sekolah",
    kasus: "Siswa berkejaran/berlari saat jam pelajaran di dalam kelas, atau turun berlari di tangga koridor.",
    tradisional: "Heh, jangan lari-lari! Kalau jatuh dan bocor kepalanya baru tahu rasa kamu nanti! Berhenti!",
    positif: "Beri sentuhan lembut di bahunya untuk menghentikan larinya. 'Peraturan sekolah kita, ruangan dan tangga adalah tempat pejalan kaki. Berlari sangat berbahaya untuk keselamatanmu.'",
    konsekuensi: "Penerapan konsep *Walk It Again* (Jalan Ulang). Anak disuruh kembali mundur/naik ke titik sebelum ia mulai berlari, lalu mengulangi rutenya dengan cara 'berjalan kaki lambat' sambil disaksikan guru."
  },
  {
    id: 16,
    kategori: "Karakter & Ibadah",
    title: "Lambat / Menunda Berbaris Shalat",
    kasus: "Saat instruksi Shalat Dhuha/Dzuhur berkumandang, siswa malah asyik mengobrol, bermain santai, atau lambat mengambil wudhu sehingga membuang waktu jamaah.",
    tradisional: "Guru berteriak dari jauh: 'Ayo cepat baris! 1... 2... 3... yang belum baris Bapak hukum!' (Dan pada akhirnya guru marah-marah hingga merusak *mood* ibadah).",
    positif: "Biasakan *SOP Transisi* (misal: menyalakan lagu nasyid/murottal tanpa meneriaki). Datangi personal siswa yang lalai: 'Waktu transisi sudah hampir habis. Menghadap Tuhan tidak dengan bermalas-malasan. Simpan obrolanmu sekarang.'",
    konsekuensi: "Waktu istirahat pribadi/bermainnya akan dipotong untuk dikompensasikan dengan waktu yang ia hilangkan tadi, ATAU ia harus bertugas membereskan dan menggulung semua sajadah paling akhir di saat temannya yang lain boleh kembali ke kelas."
  }
];

export default function DisiplinPositifPage() {
  const { user } = useAuth();
  const isKurikulum = user?.role === 'Kurikulum' || user?.role === 'admin';
  const [isEditing, setIsEditing] = useState(false);
  const [cases, setCases] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editSearchTerm, setEditSearchTerm] = useState("");
  const [expandedEditId, setExpandedEditId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, 'settings', 'disiplinPositif');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().cases && docSnap.data().cases.length > 0) {
          setCases(docSnap.data().cases);
        } else {
          setCases(defaultCases); // Fallback jika kosong/pertama kali
        }
      } catch (error) {
        console.error("Firebase fetch error:", error);
        setCases(defaultCases);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsEditing(false);
    try {
      const docRef = doc(db, 'settings', 'disiplinPositif');
      await setDoc(docRef, { cases });
      alert('Selesai! Aturan Kesepakatan Disiplin Positif berhasil disimpan ke database (Firebase) secara global.');
    } catch (error) {
      console.error("Firebase save error:", error);
      alert("Gagal menyimpan ke database. Periksa koneksi internet dan Rules Firebase Anda.");
      setIsEditing(true); // Kembalikan state edit jika gagal
    }
  };

  const handleAddKasus = () => {
    const newId = cases.length > 0 ? Math.max(...cases.map(c => c.id)) + 1 : 1;
    setCases([{
      id: newId, 
      kategori: 'Pembelajaran', 
      title: 'Judul Kasus Baru', 
      kasus: 'Penjelasan situasi...', 
      tradisional: 'Respons lama...', 
      positif: 'Respons positif...', 
      konsekuensi: 'Konsekuensi logis...'
    }, ...cases]);
    setExpandedEditId(newId);
    setEditSearchTerm(""); // Reset search so new case is visible
  };

  const handleRemoveKasus = (id) => {
    if(window.confirm('Hapus kasus penyelesaian ini?')) {
      setCases(cases.filter(c => c.id !== id));
    }
  };

  const handleChange = (id, field, value) => {
    setCases(cases.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const categories = ["Semua", ...new Set(cases.map(item => item.kategori))];
  const filteredCases = activeFilter === "Semua" ? cases : cases.filter(c => c.kategori === activeFilter);

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      {/* Header Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #1E40AF 100%)', padding: '12px', borderRadius: '16px', color: 'white', display: 'flex', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)' }}>
                <ShieldAlert size={28} />
              </div>
              <h1 style={{ margin: 0, color: '#0F172A', fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
                Disiplin Positif
              </h1>
            </div>
            <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', lineHeight: '1.6' }}>
              Kesepakatan intervensi guru untuk menjamin penanganan siswa yang <strong style={{color: 'var(--primary)'}}>Satu Bahasa</strong>, Berfokus Solusi, & Memulihkan.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {isKurikulum && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '14px', border: '1px solid #E2E8F0', background: 'white', color: '#1E293B', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#1E293B' }}
              >
                <Edit3 size={18} /> Master Edit Aturan
              </button>
            )}
            {isKurikulum && isEditing && (
              <button 
                onClick={handleSave}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '14px', border: 'none', background: '#10B981', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
              >
                <Save size={18} /> Simpan Kesepakatan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* View Mode */}
      {!isEditing ? (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px', scrollbarWidth: 'none' }}>
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveFilter(cat)}
                style={{ 
                  padding: '10px 20px', borderRadius: '24px', whiteSpace: 'nowrap', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: activeFilter === cat ? 'none' : '1px solid #E2E8F0',
                  background: activeFilter === cat ? 'var(--primary)' : 'white',
                  color: activeFilter === cat ? 'white' : '#64748B',
                  boxShadow: activeFilter === cat ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '30vh', gap: '16px', color: 'var(--text-muted)' }}>
               <Loader size={36} color="var(--primary)" />
               <span style={{ fontWeight: 600 }}>Memuat aturan main dari server...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredCases.map(item => {
                const isExpanded = expandedId === item.id;
                return (
                  <div key={item.id} style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: isExpanded ? '0 10px 25px -5px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.3s' }}>
                     
                     {/* Accordion Header */}
                     <div 
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: isExpanded ? '#F8FAFC' : 'white', borderBottom: isExpanded ? '1px solid #E2E8F0' : 'none', transition: 'background 0.2s' }}
                     >
                        <div>
                           <div style={{ display: 'inline-block', padding: '4px 10px', background: '#E2E8F0', color: '#475569', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                              {item.kategori}
                           </div>
                           <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0F172A', fontWeight: 800 }}>{item.title}</h3>
                        </div>
                        <div style={{ background: isExpanded ? 'var(--primary)' : '#F1F5F9', color: isExpanded ? 'white' : '#64748B', borderRadius: '50%', padding: '6px', display: 'flex', transition: 'all 0.3s' }}>
                           {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                     </div>
                     
                     {/* Accordion Body */}
                     {isExpanded && (
                       <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                         {/* Card Header (Kasus) */}
                         <div style={{ padding: '24px', borderBottom: '1px dashed #E2E8F0' }}>
                           <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: '#FFFBEB', padding: '16px', borderRadius: '12px' }}>
                               <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                               <p style={{ margin: 0, fontSize: '0.95rem', color: '#92400E', lineHeight: '1.6' }}>{item.kasus}</p>
                           </div>
                         </div>
                         {/* Card Responses Comparison */}
                         <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1px', background: '#F1F5F9' }}>
                           <div style={{ background: '#FFF1F2', padding: '20px' }}>
                              <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 10px 0', color: '#BE123C', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}><XCircle size={16} /> Tradisional</h4>
                              <p style={{ margin: 0, fontSize: '0.85rem', color: '#881337', lineHeight: '1.6' }}>"{item.tradisional}"</p>
                           </div>
                           <div style={{ background: '#F0FDF4', padding: '20px' }}>
                              <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 10px 0', color: '#15803D', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}><CheckCircle2 size={16} /> Disiplin Positif</h4>
                              <p style={{ margin: 0, fontSize: '0.85rem', color: '#166534', lineHeight: '1.6' }}>"{item.positif}"</p>
                           </div>
                         </div>
                         {/* Card Footer: Konsekuensi Logis */}
                         <div style={{ background: 'linear-gradient(to right, #F8FAFC, #EFF6FF)', padding: '20px 24px', borderTop: '1px dashed #E2E8F0' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase' }}>
                              <Lightbulb size={16} /> Konsekuensi Logis
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.95rem', color: '#1E40AF', lineHeight: '1.6', fontWeight: 500 }}>
                              {item.konsekuensi}
                            </p>
                         </div>
                       </div>
                     )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Edit Mode */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Editor Header & Control */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#F1F5F9', padding: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontWeight: 800, color: '#334155', fontSize: '1.2rem' }}>Daftar Kasus (Mode Edit)</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                 <button onClick={() => {
                    if(window.confirm('Aksi ini akan me-reset daftar aturan kembali ke Template Standar. Lanjutkan?')) {
                       setCases(defaultCases);
                    }
                 }} style={{ background: 'white', color: '#475569', border: '1px solid #CBD5E1', padding: '10px 16px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
                   <Download size={16} /> Reset Template
                 </button>
                 <button onClick={handleAddKasus} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
                   <Plus size={16} /> Kasus Baru
                 </button>
              </div>
            </div>
            
            {/* Search Bar */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={20} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Cari berdasarkan judul kasus, kategori, atau deskripsi..." 
                value={editSearchTerm}
                onChange={(e) => setEditSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '12px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cases.filter(item => 
              item.title.toLowerCase().includes(editSearchTerm.toLowerCase()) || 
              item.kategori.toLowerCase().includes(editSearchTerm.toLowerCase()) ||
              item.kasus.toLowerCase().includes(editSearchTerm.toLowerCase())
            ).map((item) => {
              const isEditExpanded = expandedEditId === item.id;
              
              return (
                <div key={item.id} style={{ background: 'white', borderRadius: '16px', border: isEditExpanded ? '2px solid var(--primary)' : '1px solid #E2E8F0', overflow: 'hidden', transition: 'all 0.2s', boxShadow: isEditExpanded ? '0 8px 20px rgba(0,0,0,0.06)' : 'none' }}>
                  {/* Compact Header for Edit */}
                  <div 
                    onClick={() => setExpandedEditId(isEditExpanded ? null : item.id)}
                    style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: isEditExpanded ? '#F8FAFC' : 'white' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>{item.kategori}</span>
                      <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '1.05rem' }}>{item.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRemoveKasus(item.id); }}
                        style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
                        title="Hapus Kasus"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div style={{ color: '#94A3B8' }}>
                         {isEditExpanded ? <ChevronUp size={20} /> : <Edit3 size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Form for Editing */}
                  {isEditExpanded && (
                    <div style={{ padding: '24px', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s ease-in-out' }}>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>Judul & Kategori</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                          <input type="text" value={item.title} onChange={e => handleChange(item.id, 'title', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', fontWeight: 600, boxSizing: 'border-box' }} placeholder="Judul Kasus" />
                          <input type="text" value={item.kategori} onChange={e => handleChange(item.id, 'kategori', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }} placeholder="Kategori" />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>Situasi (Kasus)</span>
                        <textarea value={item.kasus} onChange={e => handleChange(item.id, 'kasus', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', resize: 'vertical', minHeight: '80px', boxSizing: 'border-box' }} placeholder="Jelaskan deskripsi situasinya..." />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>Perbandingan Respons</span>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontSize: '0.85rem', color: '#E11D48', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}><XCircle size={16}/> Tradisional (Hindari)</span>
                          <textarea value={item.tradisional} onChange={e => handleChange(item.id, 'tradisional', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #FECACA', background: '#FFF1F2', outline: 'none', resize: 'vertical', minHeight: '80px', color: '#9F1239', boxSizing: 'border-box' }} />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontSize: '0.85rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16}/> Disiplin Positif (Lakukan)</span>
                          <textarea value={item.positif} onChange={e => handleChange(item.id, 'positif', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #A7F3D0', background: '#F0FDF4', outline: 'none', resize: 'vertical', minHeight: '80px', color: '#166534', boxSizing: 'border-box' }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', paddingTop: '16px', borderTop: '1px dashed #E2E8F0' }}>
                        <span style={{ fontWeight: 700, color: '#2563EB', fontSize: '0.9rem' }}>Konsekuensi Logis</span>
                        <textarea value={item.konsekuensi} onChange={e => handleChange(item.id, 'konsekuensi', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #BFDBFE', background: '#EFF6FF', outline: 'none', resize: 'vertical', minHeight: '80px', color: '#1E40AF', fontWeight: 500, boxSizing: 'border-box' }} placeholder="Jelaskan konsekuensi logis untuk pemulihan..." />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                         <button 
                             onClick={() => setExpandedEditId(null)}
                             style={{ background: '#F8FAFC', color: '#334155', border: '1px solid #CBD5E1', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                         >Tutup Editor</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {cases.filter(item => 
              item.title.toLowerCase().includes(editSearchTerm.toLowerCase()) || 
              item.kategori.toLowerCase().includes(editSearchTerm.toLowerCase()) ||
              item.kasus.toLowerCase().includes(editSearchTerm.toLowerCase())
            ).length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                Tidak ada kasus yang sesuai dengan pencarian "{editSearchTerm}".
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
