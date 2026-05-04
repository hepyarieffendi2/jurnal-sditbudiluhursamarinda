import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ChevronLeft, 
  Award, 
  BookOpen, 
  Heart, 
  CheckCircle2, 
  Circle, 
  PlayCircle,
  Users,
  Sun,
  Activity
} from 'lucide-react';

const StudentReport = () => {
  const [activeTab, setActiveTab] = useState('ami');
  
  const [student] = useState({
    name: "Ahmad Fatih Al-Farabi",
    grade: "Lower Elementary (Fase A)",
    nis: "2024001",
    semester: "Semester 1",
    year: "2025/2026",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad"
  });

  // --- DATA STANDAR AMI (Association Montessori Internationale) ---
  
  // Status Skala AMI
  // P (Presented) = Diperkenalkan. Anak sudah melihat presentasi awal.
  // W (Working) = Sedang Berlatih. Anak sedang dalam tahap eksplorasi dan repetisi mandiri.
  // M (Mastered) = Sudah Menguasai. Anak menunjukkan pemahaman penuh dan mampu menerapkannya/mengajarkan.
  
  const workHabits = [
    { name: "Kemandirian dalam mengambil dan menyimpan material (Independence)", status: "M" },
    { name: "Kemampuan untuk fokus dan konsentrasi (Concentration)", status: "W" },
    { name: "Inisiatif dalam memilih pekerjaan sendiri (Initiative)", status: "W" },
    { name: "Ketekunan menyelesaikan siklus kerja (Follow-through)", status: "W" },
    { name: "Menjaga keteraturan lingkungan kelas (Sense of Order)", status: "M" }
  ];

  const socialDevelopment = [
    { name: "Praktik kesopanan dan etiket (Grace and Courtesy)", status: "M" },
    { name: "Menunjukkan rasa hormat pada teman dan pendidik", status: "M" },
    { name: "Kemampuan bekerja dalam kelompok kecil", status: "W" },
    { name: "Kemandirian dalam menyelesaikan konflik (Problem Solving)", status: "P" }
  ];

  const amiAcademic = [
    {
      category: "Language (Bahasa)",
      items: [
        { name: "Spoken Language & Vocabulary (Kosakata)", status: "M" },
        { name: "Sandpaper Letters / Phonetics", status: "M" },
        { name: "Word Building (Large Moveable Alphabet)", status: "W" },
        { name: "Handwriting (Metal Insets Preparation)", status: "W" },
        { name: "Reading Comprehension (Pemahaman Membaca)", status: "P" },
        { name: "Arabic Writing & Hijaiyah", status: "W" }
      ]
    },
    {
      category: "Mathematics (Matematika)",
      items: [
        { name: "Numeration 1-10 (Number Rods, Spindle Boxes)", status: "M" },
        { name: "Decimal System Intro (Golden Beads)", status: "M" },
        { name: "Linear Counting (Teen & Ten Boards)", status: "M" },
        { name: "Static Addition & Subtraction (Golden Beads)", status: "W" },
        { name: "Dynamic Addition (Stamp Game)", status: "P" },
        { name: "Fractions (Sensorial Introduction)", status: "P" }
      ]
    },
    {
      category: "Cosmic Education (Budaya, Geografi, Sains)",
      items: [
        { name: "Geography: Map of The World (Continents)", status: "M" },
        { name: "Geography: Land and Water Forms", status: "M" },
        { name: "Biology: Botany Cabinet & Leaf Anatomy", status: "W" },
        { name: "Biology: Vertebrates & Invertebrates", status: "W" },
        { name: "History: Concept of Time (Personal Timeline)", status: "M" },
        { name: "Science: States of Matter (Solid, Liquid, Gas)", status: "P" }
      ]
    }
  ];

  // --- DATA KUMER (Untuk Sinkronisasi Pemerintah) ---
  const kumerData = [
    { subject: 'Pendidikan Agama Islam', cp: 'Mengenal huruf hijaiyah dan mempraktikkan doa harian.', score: 'Sangat Baik' },
    { subject: 'Matematika', cp: 'Menentukan nilai tempat puluhan dan satuan dengan benda konkret.', score: 'Baik' },
    { subject: 'Bahasa Indonesia', cp: 'Memahami instruksi lisan dan menceritakan kembali kisah naratif.', score: 'Sangat Baik' },
    { subject: 'Pendidikan Pancasila', cp: 'Mengenal simbol Pancasila dan berempati pada sesama.', score: 'Sangat Baik' },
  ];

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'M': return <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 size={16} className="fill-emerald-100" /><span className="font-bold text-sm">M</span></div>;
      case 'W': return <div className="flex items-center gap-2 text-indigo-500"><PlayCircle size={16} className="fill-indigo-50" /><span className="font-bold text-sm">W</span></div>;
      case 'P': return <div className="flex items-center gap-2 text-slate-400"><Circle size={16} /><span className="font-bold text-sm">P</span></div>;
      default: return null;
    }
  };

  return (
    <div className="report-page bg-[#F8F9FA] min-h-screen p-4 md:p-8 font-sans">
      {/* Header Actions */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 no-print gap-4">
        <button className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm">
          <ChevronLeft size={20} /> Kembali ke Dashboard
        </button>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white text-slate-700 px-6 py-2.5 rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50">
            <Download size={18} /> Ekspor PDF
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl shadow-md hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Printer size={18} /> Cetak Dokumen
          </button>
        </div>
      </div>

      {/* Document Target */}
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-sm border border-slate-200 print:shadow-none print:border-none print:m-0 print:p-0">
        
        {/* Academic Header (Formal AMI Style) */}
        <div className="pt-12 px-12 pb-8 border-b-2 border-indigo-900 border-double">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <img src="/logo-budiluhur.png" alt="School Logo" className="w-16 h-16 object-contain" />
              <div>
                <h1 className="text-2xl font-black text-indigo-950 uppercase tracking-widest">Sekolah Dasar IT Budi Luhur</h1>
                <p className="text-slate-600 tracking-wider">Montessori Elementary Progress Evaluation</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 mb-1">Tahun Ajaran: <span className="font-bold text-slate-800">{student.year}</span></p>
              <p className="text-sm text-slate-500">Semester: <span className="font-bold text-slate-800">{student.semester}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Nama Siswa</span>
              <span className="font-bold text-slate-900">{student.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Fase / Kelas</span>
              <span className="font-bold text-slate-900">{student.grade}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Guru Utama (Guide)</span>
              <span className="font-bold text-slate-900">Ust. Kurniawan, S.Pd</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Kehadiran</span>
              <span className="font-bold text-slate-900">95 / 98 Hari</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Hidden on Print) */}
        <div className="flex bg-slate-50 border-b border-slate-200 no-print">
          <button 
            onClick={() => setActiveTab('ami')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'ami' ? 'bg-white text-indigo-700 border-t-2 border-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            AMI Progress Report (Montessori)
          </button>
          <button 
            onClick={() => setActiveTab('kumer')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'kumer' ? 'bg-white text-indigo-700 border-t-2 border-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            Capaian Kurikulum Merdeka (Nasional)
          </button>
        </div>

          {/* Report Content Section */}
        <div className="p-6 md:p-12 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
          
          {/* TAB 1: AMI PROGRESS REPORT (The Real Montessori Way) */}
          {activeTab === 'ami' && (
            <div className="anim-fade-in">
              {/* Legend: Enhanced Mastery Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 no-print">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">P</div>
                    <div>
                        <p className="text-xs font-bold text-slate-800 uppercase">Presented</p>
                        <p className="text-[10px] text-slate-500">Materi diperkenalkan</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">W</div>
                    <div>
                        <p className="text-xs font-bold text-indigo-700 uppercase">Working</p>
                        <p className="text-[10px] text-indigo-500">Sedang aktif berlatih</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">M</div>
                    <div>
                        <p className="text-xs font-bold text-emerald-700 uppercase">Mastered</p>
                        <p className="text-[10px] text-emerald-500">Telah menguasai penuh</p>
                    </div>
                </div>
              </div>

              {/* Section 1: Personal & Social Growth (Work Habits) */}
              <div className="mb-12">
                <h2 className="text-xl font-bold text-indigo-950 uppercase tracking-widest flex items-center gap-3 mb-6">
                  <Sun size={24} className="text-amber-500" />
                  Personal and Social Growth
                </h2>
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">Work Habits (Kebiasaan Kerja)</h3>
                    <ul className="space-y-3">
                      {workHabits.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center text-sm py-1 border-b border-slate-50 border-dashed">
                          <span className="text-slate-700 w-3/4 leading-snug">{item.name}</span>
                          <StatusIcon status={item.status} />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">Social Development (Perkembangan Sosial)</h3>
                    <ul className="space-y-3">
                      {socialDevelopment.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center text-sm py-1 border-b border-slate-50 border-dashed">
                          <span className="text-slate-700 w-3/4 leading-snug">{item.name}</span>
                          <StatusIcon status={item.status} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 2: Academic Progress (Curriculum Areas) */}
              <div className="mb-12">
                <h2 className="text-xl font-bold text-indigo-950 uppercase tracking-widest flex items-center gap-3 mb-6">
                  <BookOpen size={24} className="text-blue-500" />
                  Academic Progress
                </h2>
                
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {amiAcademic.map((area, idx) => (
                    <div key={idx} className="bg-white border text-sm border-slate-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-bold text-indigo-950 uppercase tracking-wider text-xs">
                        {area.category}
                      </div>
                      <ul className="divide-y divide-slate-100">
                        {area.items.map((item, idy) => (
                          <li key={idy} className="px-4 py-3 flex justify-between items-start">
                            <span className="text-slate-600 w-4/5 leading-snug">{item.name}</span>
                            <StatusIcon status={item.status} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Teacher's Narrative (The Core of Montessori Eval) */}
              <div className="mb-12">
                <h2 className="text-xl font-bold text-indigo-950 uppercase tracking-widest flex items-center gap-3 mb-4">
                  <FileText size={24} className="text-indigo-500" />
                  Guide's Narrative Reflection
                </h2>
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed italic text-sm text-justify">
                  "Ahmad has shown remarkable growth in his independence and concentration this term. He consistently chooses challenging works in Mathematics, specifically drawn to the Golden Beads and understanding place values up to thousands. He handles materials with great respect and eagerly helps younger students (Grace and Courtesy). During Cosmic Education, his interest in Geography has blossomed; he successfully traced and labeled the Map of The World independently. We will continue to gently encourage him to practice his reading comprehension skills using phonetic storybooks in the coming semester."
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KURIKULUM MERDEKA VIEW (Nasional) */}
          {activeTab === 'kumer' && (
            <div className="anim-fade-in">
              <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm flex items-start gap-3">
                <Activity className="shrink-0 mt-0.5" size={18} />
                <p>Halaman ini merupakan konversi capaian Montessori ke dalam format Capaian Pembelajaran (CP) Standar Pendidikan Nasional Kurikulum Merdeka Fase A.</p>
              </div>

              <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-600 uppercase text-xs tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4 border-b border-slate-200">Mata Pelajaran</th>
                    <th className="px-6 py-4 border-b border-slate-200">Capaian Kompetensi (Kumer)</th>
                    <th className="px-6 py-4 border-b border-slate-200 text-center">Predikat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kumerData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-indigo-950 w-1/4 align-top">
                        {row.subject}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 leading-relaxed align-top">
                        {row.cp}
                      </td>
                      <td className="px-6 py-4 w-1/6 text-center align-top">
                        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded border border-emerald-200">
                          {row.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed italic text-sm">
                <strong>Catatan Wali Kelas:</strong> Ananda mencapai kompetensi yang ditetapkan secara sangat baik. Proses belajarnya berkembang secara natural sesuai ketertarikannya yang tinggi pada bidang logika dan literasi.
              </div>
            </div>
          )}

          {/* Signature Block */}
          <div className="mt-20 flex justify-between items-end pb-8">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-20 uppercase tracking-widest">Orang Tua / Wali Siswa</p>
              <div className="w-56 border-b border-slate-400"></div>
            </div>
            
            <div className="text-center relative">
              <p className="text-xs text-slate-500 mb-1">Samarinda, 20 Desember 2025</p>
              <p className="text-xs text-slate-500 mb-20 uppercase tracking-widest">Kepala Sekolah / Guide</p>
              <div className="w-56 border-b border-slate-400"></div>
              <p className="mt-2 text-sm font-bold text-slate-800">Ust. Kurniawan, S.Pd</p>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .anim-fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .report-page { background: white !important; padding: 0 !important; }
          .bg-slate-50 { background: white !important; }
          @page { size: A4; margin: 1cm; }
        }
      `}</style>
    </div>
  );
};

export default StudentReport;
