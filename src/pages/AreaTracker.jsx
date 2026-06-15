import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../firebase-config';
import {
  collection, getDocs, doc, setDoc, getDoc, query, where, limit, addDoc, serverTimestamp, Timestamp, deleteDoc, writeBatch
} from 'firebase/firestore';
import { AREA_SENTRA, MATURITY_LEVELS, CONCENTRATION_EMOJIS } from '../data/areaSentra';
import {
  ArrowLeft, Save, CheckCircle2, Star, X, Info, History, Search,
  Moon, Hash, BookOpen, Leaf, Globe2, Wand2, MapPin, PackageOpen, Loader2, ClipboardList,
  MessageSquare, Package, AlertCircle, TrendingUp, Target, Sparkles, Settings2, RotateCcw, CalendarDays, Printer,
  LayoutGrid, Book, Globe, Home, Briefcase, Calendar, Activity, Award, Zap, User, Users, Heart, ArrowRightCircle, Eye, EyeOff, AlertTriangle,
  PackageSearch, ChevronRight, GraduationCap, ShieldCheck, Flame, Users2, HeartHandshake, Smile, SmilePlus, HelpCircle, Video
} from 'lucide-react';

const IconMap = { Moon, Hash, BookOpen, Leaf, Globe2, Wand2 };

const getYTThumbnail = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`;
  }
  return null;
};

const renderParentheses = (text) => {
  if (typeof text !== 'string') return text;
  
  const parts = text.split(/\(([^)]+)\)/);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <span 
          key={index} 
          style={{
            fontStyle: 'italic',
            color: '#64748B', // Elegant muted slate gray
            fontSize: '0.88em',
            fontWeight: 500,
            marginLeft: '4px',
            marginRight: '4px'
          }}
        >
          ({part})
        </span>
      );
    }
    return part;
  });
};

const renderTextWithTags = (text) => {
  if (typeof text !== 'string') return text;
  
  const parts = text.split(/\[([^\]]+)\]/);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      let bgColor = '#F1F5F9';
      let textColor = '#475569';
      let borderColor = '#E2E8F0';
      
      const lowerPart = part.toLowerCase();
      if (lowerPart.includes('berkesadaran')) {
        bgColor = '#EEF2FF'; // Indigo
        textColor = '#4338CA';
        borderColor = '#C7D2FE';
      } else if (lowerPart.includes('bermakna')) {
        bgColor = '#FFF7ED'; // Orange
        textColor = '#C2410C';
        borderColor = '#FED7AA';
      } else if (lowerPart.includes('menyenangkan')) {
        bgColor = '#FDF2F8'; // Pink
        textColor = '#BE185D';
        borderColor = '#FBCFE8';
      }
      
      return (
        <span 
          key={index} 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '8px',
            fontSize: '0.7rem',
            fontWeight: 855,
            backgroundColor: bgColor,
            color: textColor,
            border: `1px solid ${borderColor}`,
            marginLeft: '6px',
            marginRight: '2px',
            verticalAlign: 'middle',
            letterSpacing: '0.2px',
            textTransform: 'uppercase'
          }}
        >
          ✨ {part}
        </span>
      );
    }
    return renderParentheses(part);
  });
};

const DAILY_GUIDES = {
  1: {
    theme: 'Fisik & Lingkungan Kelas (Aku & Kelasku)',
    days: [
      {
        day: 'Senin',
        focus: 'Adab Berjalan di Dalam Kelas (Walking in the Classroom)',
        circleTime: 'Ustadz/Ustadzah memperagakan berjalan pelan dan tenang di sela-sela meja. Kakak Kelas 2 memodelkan. Guru memperagakan anti-behavior (berlari, menabrak) lalu bertanya secara nalar: "Apa yang akan terjadi pada aparatus jika kita bergerak seperti itu?"',
        workCycle: 'Latihan berdiri dari lingkaran, berjalan tenang mengambil pensil/buku, lalu kembali tanpa bersuara.',
        closing: 'Evaluasi bersama: "Apakah ada karpet teman yang terinjak hari ini?"'
      },
      {
        day: 'Selasa',
        focus: 'Merapikan Karpet & Kursi (Restoring Workspace & Chair)',
        circleTime: 'Demonstrasi cara membawa karpet tegak lurus di dada, membentang perlahan tanpa suara deburan, dan menggulung karpet rapi (tidak longgar, ujungnya sejajar). Cara mengangkat kursi (pegang dudukan & sandaran), bukan diseret berdecit.',
        workCycle: 'Kakak Kelas 2 mendampingi adiknya melatih menggulung karpet berkali-kali secara bergantian.',
        closing: 'Game: Guru membunyikan bel hening, anak-anak harus memasukkan kursi mereka ke kolong meja tanpa suara decitan sedikit pun.'
      },
      {
        day: 'Rabu',
        focus: 'Adab Membawa & Menyimpan Alat APE (Carrying & Returning)',
        circleTime: 'Demonstrasi cara membawa nampan/baki kayu menggunakan dua tangan di bawah dada. Cara berjalan membawa beban tanpa goyang, dan meletakkan kembali ke rak dengan posisi presisi (tidak miring, tidak menonjol keluar).',
        workCycle: 'Latihan mengambil baki kosong/material praktikal dari rak, membawanya ke karpet sendiri, lalu mengembalikannya secara bergantian.',
        closing: 'Inspeksi rak bersama: "Mari kita lihat apakah rak kita hari ini sudah tersusun rapi dan siap istirahat?"'
      },
      {
        day: 'Kamis',
        focus: 'Integrasi & Latihan Keseimbangan (Graceful Movement)',
        circleTime: 'Walking on the Line. Anak-anak berjalan berurutan di atas garis lantai membawa cangkir berisi air (latihan agar tidak tumpah) atau sendok berisi kelereng. Melatih koordinasi tubuh yang anggun (graceful movement).',
        workCycle: 'Fokus penuh pada kerja mandiri area Practical Life dasar (menuangkan air, meronce, memindahkan kancing) dengan mempraktikkan adab berjalan, karpet, dan rak secara serempak.',
        closing: 'Apresiasi: Kakak Kelas 2 memberikan umpan balik positif tentang kemajuan adiknya.'
      },
      {
        day: 'Jumat',
        focus: 'Simulasi Rintangan & Evaluasi Mingguan',
        circleTime: 'Game Rintangan Karpet. Guru membentang beberapa karpet acak di lantai. Anak-anak bergiliran berjalan membawa baki melintasi kelas tanpa menyentuh, menyenggol, ataupun melangkahi karpet-karpet tersebut.',
        workCycle: 'Gotong royong membersihkan loker pribadi dan merapikan seluruh kelas menjelang akhir pekan.',
        closing: 'Refleksi Mingguan: Bersama-sama menyepakati bahwa kelas telah resmi menguasai "Tertib Fisik" dan siap naik level ke "Tertib Suara".'
      }
    ]
  },
  2: {
    theme: 'Ketenangan & Konsentrasi (Aku & Diriku)',
    days: [
      {
        day: 'Senin',
        focus: 'Volume Bicara (4 Level Suara)',
        circleTime: 'Mengenalkan 4 Level Suara: Level 0 (Hening/Silence), Level 1 (Bisikan/Buddy Voice), Level 2 (Suara Kelas/Montessori Voice), Level 3 (Suara Luar/Outdoor). Latihan memperagakan Level 1 & 2 secara bergantian.',
        workCycle: 'Guru memantau tingkat kebisingan. Jika ada anak bersuara keras, guru mengetuk lembut pundaknya dan berbisik: "Ustadz/Ustadzah kesulitan mendengar suara hening, bisakah kita kembali ke Level 1?"',
        closing: 'Silence Game pertama (menutup mata selama 1-2 menit, mendengarkan detak jam atau suara burung di luar).'
      },
      {
        day: 'Selasa',
        focus: 'Mendengar & Memperhatikan (Active Listening)',
        circleTime: 'Adab Majelis. Cara duduk tegak melingkar, bersedekap tenang, mata fokus pada Ustadz/Ustadzah atau teman yang sedang bicara, dan tidak memotong pembicaraan. Guru memperagakan drama orang yang diajak bicara tetapi memalingkan muka, lalu mendiskusikan dampaknya.',
        workCycle: 'Mempraktikkan instruksi lisan berantai yang diberikan guru secara akurat.',
        closing: 'Silence Game: Guru membisikkan nama anak dengan sangat lembut dari kejauhan. Anak yang namanya dipanggil harus berdiri tanpa suara, menggulung karpetnya, lalu bersiap pulang.'
      },
      {
        day: 'Rabu',
        focus: 'Adab Menonton Teman Bekerja (Watching a Friend Work)',
        circleTime: 'Bagaimana cara mengamati teman yang sedang konsentrasi tanpa mengganggunya. Aturannya: Berdiri dengan jarak 1 meter (tangan ditaruh di belakang punggung), tidak menyentuh aparatus teman, dan wajib bertanya sopan sebelum menonton: "Bolehkah aku mengamati caramu bekerja?"',
        workCycle: 'Latihan menonton langsung secara tertib saat siklus kerja berlangsung.',
        closing: 'Diskusi refleksi: "Bagaimana rasanya ketika kita sedang fokus bekerja, lalu ada yang menonton dengan sopan vs ada yang mengganggu?"'
      },
      {
        day: 'Kamis',
        focus: 'Kalibrasi Kebisingan Kelas',
        circleTime: 'Silence Game Bel Kecil. Anak-anak melingkar dan mengoper bel kecil yang sangat sensitif dari tangan ke tangan tanpa boleh membunyikan bel tersebut sama sekali. Melatih kesadaran motorik dan keheningan kolektif.',
        workCycle: 'Mempertahankan level suara kelas di Level 1 sepanjang siklus kerja praktikal.',
        closing: 'Evaluasi grafik kebisingan kelas hari ini bersama anak-anak.'
      },
      {
        day: 'Jumat',
        focus: 'Simulasi Fokus & Refleksi Batin',
        circleTime: 'Meditasi/Dzikir Pagi Hening. Anak-anak duduk hening pejam mata selama 3-5 menit untuk menenangkan batin dan memusatkan pikiran sebelum beraktivitas.',
        workCycle: 'Siklus kerja penuh tanpa instruksi verbal klasikal dari guru. Guru hanya bergerak memberikan kode non-verbal jika diperlukan.',
        closing: 'Apresiasi mingguan: Merayakan keberhasilan kelas yang mampu bekerja tenang seperti "lebah pekerja yang produktif".'
      }
    ]
  },
  3: {
    theme: 'Hubungan Sosial & Harmoni (Aku & Temanku)',
    days: [
      {
        day: 'Senin',
        focus: 'Adab Menunggu Giliran (Antre Alat)',
        circleTime: 'Mengingat keterbatasan alat (hanya ada 1 set per rombel). Cara mengantre secara visual: Anak meletakkan kartu namanya sendiri atau sebuah batu kecil penanda di sudut karpet teman yang sedang menggunakan alat tersebut. Ini berarti: "Aku mengantre setelah kamu selesai."',
        workCycle: 'Melatih langsung sistem antrean batu/kartu nama selama siklus kerja.',
        closing: 'Evaluasi: "Apakah sistem antre batu kita hari ini berjalan lancar?"'
      },
      {
        day: 'Selasa',
        focus: 'Adab Interupsi (Teknik AMI)',
        circleTime: 'Cara mendekati Ustadz/Ustadzah atau teman yang sedang berbicara. Teknik AMI: Anak berjalan tenang mendekati guru, meletakkan satu tangannya di pundak guru secara lembut, lalu menunggu dalam diam tanpa bersuara. Guru akan meletakkan tangannya di atas tangan anak sebagai sinyal melihat.',
        workCycle: 'Simulasi langsung di mana anak-anak melatih adab interupsi saat guru sedang memandu anak lain.',
        closing: 'Tanya jawab: "Kenapa kita tidak boleh memanggil Ustadz... Ustadz! dengan berteriak?"'
      },
      {
        day: 'Rabu',
        focus: 'Resolusi Konflik (Peace Rose / Mawar Perdamaian)',
        circleTime: 'Mengenalkan Peace Rose. Jika terjadi konflik, ambil mawar fisik di sudut damai. Pegang mawar, katakan: "Aku merasa sedih/marah saat kamu...". Oper mawar ke teman, teman mendengar aktif lalu merespons: "Aku minta maaf karena...". Letakkan kembali dan bersalaman.',
        workCycle: 'Guru memandu langsung anak-anak yang berkonflik untuk menggunakan Peace Rose di Sudut Damai (Peace Corner).',
        closing: 'Role-play penyelesaian konflik menggunakan Peace Rose di depan kelas oleh perwakilan Kakak & Adik.'
      },
      {
        day: 'Kamis',
        focus: 'Simulasi Kolaborasi Buddy',
        circleTime: 'Diskusi penalaran sosial: "Apa yang harus kita lakukan jika kita tidak sengaja merusak atau menyenggol hasil karya teman hingga berantakan?" Latihan menyampaikan maaf secara tulus (kontak mata, menyebutkan kesalahan, dan menawarkan bantuan).',
        workCycle: 'Anak-anak diberikan tugas kerja kolaboratif berpasangan bersama Buddynya yang membutuhkan kerja sama erat.',
        closing: 'Lingkaran Apresiasi: Setiap anak bergiliran menyampaikan satu perbuatan baik yang dilakukan oleh pasangan Buddynya hari ini.'
      },
      {
        day: 'Jumat',
        focus: 'Perayaan & Piagam Kesepakatan',
        circleTime: 'Deklarasi Kelas Damai. Seluruh anak menyepakati "Piagam Kesepakatan Kelas". Setiap anak membubuhkan cap jempol berwarna di piagam sebagai komitmen bersama.',
        workCycle: 'Simulasi Siklus Kerja Mandiri Penuh (2 jam penuh) tanpa interupsi, membuktikan bahwa kelas telah sepenuhnya Ternormalisasi.',
        closing: 'Perayaan Kelulusan Normalisasi: Ustadz/Ustadzah memberikan selamat kepada Rombel karena telah resmi siap memulai petualangan materi sains/matematika minggu depan!'
      }
    ]
  }
};

const AreaIcon = ({ name, color, size = 18 }) => {
  const IconComp = IconMap[name] || Star;
  return <IconComp size={size} color={color} />;
};

export default function AreaTracker() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomParam = searchParams.get('room');
  
  const [viewMode, setViewMode] = useState(searchParams.get('mode') === 'kelola' ? 'kelola' : 'observasi');
  const [activeRoom, setActiveRoom] = useState(roomParam || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [curriculum, setCurriculum] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAreaId, setActiveAreaId] = useState(null);
  const [shelfItems, setShelfItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [repetitions, setRepetitions] = useState({});
  const [observedToday, setObservedToday] = useState([]);
  const [roomList, setRoomList] = useState([]);

  const [activeSubAreaId, setActiveSubAreaId] = useState(null);
  const [mapFocusGrade, setMapFocusGrade] = useState('All');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showGuide, setShowGuide] = useState(null);
  const [showPrepSheet, setShowPrepSheet] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [activeDrawerMateri, setActiveDrawerMateri] = useState(null);
  const [activePilarHelp, setActivePilarHelp] = useState(null); // 🚀 Help Tooltip State
  const [showDailyGuideWeek, setShowDailyGuideWeek] = useState(null);
  const [activeDailyDay, setActiveDailyDay] = useState(0);
  
  const [selectedKids, setSelectedKids] = useState([]);
  const [showFullGrid, setShowFullGrid] = useState(false);
  const [activityType, setActivityType] = useState('auto');
  const [loadingAction, setLoadingAction] = useState(false);

  // 📝 5 Pilar Observasi Sentra (AMI Indonesia Labels)
  const [maturity, setMaturity] = useState('P');
  const [concentration, setConcentration] = useState('Exploration');
  const [socialContext, setSocialContext] = useState('Individual');
  const [independence, setIndependence] = useState('Independent');
  const [restoration, setRestoration] = useState(true);

  const [masteredCount, setMasteredCount] = useState({});
  const [popularData, setPopularData] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const roomSnap = await getDocs(collection(db, 'master_rombel'));
        const rooms = roomSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        rooms.sort((a, b) => (a.level || '').localeCompare(b.level || ''));
        setRoomList(rooms);
        if (!activeRoom && rooms.length > 0) setActiveRoom(rooms[0].name);

        const studQuery = query(collection(db, 'students'), where('status', '==', 'active'));
        const studSnap = await getDocs(studQuery);
        const studData = studSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        studData.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(studData);

        const curSnap = await getDocs(collection(db, 'kurikulum_pusat'));
        let curData = curSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (curData.length === 0) curData = AREA_SENTRA;
        else {
          const orderMap = {};
          AREA_SENTRA.forEach((item, idx) => orderMap[item.id] = idx);
          curData.sort((a, b) => (orderMap[a.id] ?? 99) - (orderMap[b.id] ?? 99));
        }
        setCurriculum(curData);
        if (!activeAreaId) setActiveAreaId(curData[0].id);

        const actSnap = await getDocs(collection(db, 'jurnal_aktivitas'));
        const reps = {};
        const pCounts = {};
        const mCounts = {};
        actSnap.docs.forEach(d => {
            const data = d.data();
            const key = `${data.muridId}_${data.pencapaian}`;
            const level = data.kematangan || 'P';
            if (!reps[key]) reps[key] = { count: 1, level };
            else {
                reps[key].count++;
                if (level === 'M' || level === 'Mahir') reps[key].level = 'M';
            }
            if (level === 'M' || level === 'Mahir') mCounts[data.pencapaian] = (mCounts[data.pencapaian] || 0) + 1;
            pCounts[data.pencapaian] = (pCounts[data.pencapaian] || 0) + 1;
        });
        setRepetitions(reps);
        setMasteredCount(mCounts);
        setPopularData(pCounts);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (loading || !activeRoom) return;
    const syncContext = async () => {
        try {
            const shelfDoc = await getDoc(doc(db, 'setelan_rak', activeRoom));
            if (shelfDoc.exists()) setShelfItems(shelfDoc.data().items || []);
            else setShelfItems([]);

            const q = query(collection(db, 'jurnal_aktivitas'));
            const snap = await getDocs(q);
            const observed = new Set();
            snap.docs.forEach(doc => {
                const d = doc.data();
                const dStr = d.tanggal?.toDate ? d.tanggal.toDate().toISOString().split('T')[0] : new Date(d.tanggal).toISOString().split('T')[0];
                if (dStr === selectedDate) observed.add(d.muridId);
            });
            setObservedToday(Array.from(observed));
        } catch (e) {}
    };
    syncContext();
  }, [activeRoom, selectedDate, loading]);

  useEffect(() => {
    if (!activeRoom || roomList.length === 0) return;
    const roomInfo = roomList.find(r => r.name === activeRoom);
    if (roomInfo?.level) setMapFocusGrade(roomInfo.level);
  }, [activeRoom, roomList]);

  const toggleItemOnShelf = (label) => {
    setShelfItems(prev => prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]);
  };

  const handleSaveShelf = async () => {
    setLoadingAction(true);
    try {
        await setDoc(doc(db, 'setelan_rak', activeRoom), {
            items: shelfItems,
            updatedAt: serverTimestamp(),
            updatedBy: 'Sistem Guru (Integrated)'
        });
        setShowSuccess(true);
        setTimeout(() => { setShowSuccess(false); setViewMode('observasi'); }, 1500);
    } catch (e) { console.error(e); }
    finally { setLoadingAction(false); }
  };

  const hasTPL = (materi) => {
    if (typeof materi !== 'object' || !materi.presentation?.steps) return false;
    return materi.presentation.steps.some(step => 
       step.toUpperCase().includes('TPL') || 
       step.toUpperCase().includes('THREE PERIOD LESSON')
    );
  };

  const lookupTool = (materiLabel) => {
    let result = { area: "Umum", activity: "Eksplorasi", presentation: null, color: 'var(--primary)', areaObj: null, itemObj: null };
    curriculum.forEach(a => a.subAreas?.forEach(sa => sa.levels?.forEach(lvl => {
        const label = typeof lvl === 'object' ? lvl.label : lvl;
        if (label === materiLabel) result = { area: a.name, activity: sa.name, color: a.color, presentation: typeof lvl === 'object' ? lvl.presentation : null, areaObj: a, itemObj: lvl };
    })));
    return result;
  };

  const getAparatusList = () => {
    const list = {};
    curriculum.forEach(area => {
        area.subAreas.forEach(sub => {
            sub.levels.forEach(lvl => {
                const label = typeof lvl === 'object' ? lvl.label : lvl;
                if (shelfItems.includes(label) && lvl.presentation?.toolsList) {
                    if (!list[area.name]) list[area.name] = new Set();
                    lvl.presentation.toolsList.forEach(tool => list[area.name].add(tool));
                }
            });
        });
    });
    return list;
  };

  const toggleKidSelection = (id) => {
    setSelectedKids(prev => {
        const isCurrentlySelected = prev.includes(id);
        const next = isCurrentlySelected ? prev.filter(k => k !== id) : [...prev, id];
        
        if (!isCurrentlySelected && next.length === 1 && activeDrawerMateri) {
            const kidRep = repetitions[`${id}_${activeDrawerMateri}`];
            const isPractice = (kidRep?.count > 0);
            setMaturity(isPractice ? 'W' : 'P');
            setConcentration(isPractice ? 'Asyik' : 'Exploration');
            setSocialContext('Individual');
            setIndependence('Independent');
            setRestoration(true);
        }
        return next;
    });
  };

  const handleInstantSave = async () => {
    if (!activeDrawerMateri || selectedKids.length === 0) return;
    setLoadingAction(true);
    const toolInfo = lookupTool(activeDrawerMateri);
    const batch = writeBatch(db);
    
    try {
        selectedKids.forEach(sId => {
            const student = students.find(s => s.id === sId);
            const isPractice = (activityType === 'practice' || (activityType === 'auto' && repetitions[`${sId}_${activeDrawerMateri}`]?.count > 0));
            
            const finalMaturity = showSheet ? maturity : (isPractice ? 'W' : 'P');
            const finalConcentration = showSheet ? concentration : (isPractice ? 'Asyik' : 'Exploration');

            const newDocRef = doc(collection(db, 'jurnal_aktivitas'));
            batch.set(newDocRef, {
                murid: student.name, muridId: sId, area: toolInfo.area, aktivitas: toolInfo.activity, pencapaian: activeDrawerMateri,
                kematangan: finalMaturity, 
                konsentrasi: finalConcentration, 
                sosial: showSheet ? socialContext : 'Individual',
                emosional: showSheet ? independence : 'Independent',
                restorasi: showSheet ? restoration : true,
                durasi: 15, guru: "Ustadzah",
                tanggal: selectedDate === new Date().toISOString().split('T')[0] ? serverTimestamp() : Timestamp.fromDate(new Date(selectedDate)),
                mode: 'pilar_sentra_v2'
            });
        });

        await batch.commit();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        setSelectedKids([]);
        setActiveDrawerMateri(null);
        setShowSheet(false);
    } catch (e) { 
        console.error("Save error:", e);
        alert("Gagal menyimpan: " + e.message);
    }
    finally { setLoadingAction(false); }
  };

  const activeArea = curriculum.find(a => a.id === activeAreaId) || curriculum[0];
  const currentRoomStudents = students.filter(s => s.rombel === activeRoom);

  const getProgressData = (itemLabel) => {
    const mastered = [], working = [], waiting = [];
    currentRoomStudents.forEach(s => {
        const rep = repetitions[`${s.id}_${itemLabel}`];
        if (rep) {
            if (rep.level === 'M') mastered.push(s);
            else working.push(s);
        } else waiting.push(s);
    });
    const total = currentRoomStudents.length || 1;
    return { mastered, working, waiting, masteredPct: Math.round((mastered.length / total) * 100), workingPct: Math.round((working.length / total) * 100) };
  };

  if (loading) return <div className="loading-screen"><Loader2 className="animate-spin" /> <p>Menyiapkan Command Center...</p></div>;

  const aparatusList = getAparatusList();
  const activeToolInfo = activeDrawerMateri ? lookupTool(activeDrawerMateri) : null;
  const activeProgress = activeDrawerMateri ? getProgressData(activeDrawerMateri) : null;

  // 🚀 Pilar Guidance Data (AMI Standard)
  const PILAR_GUIDE = {
    maturity: {
      title: "Kematangan (P-W-M-N)",
      text: "P: Presentasi pertama guru.\nW: Anak memilih & mengulang sendiri.\nM: Anak sudah menguasai & tuntas.\nN: Anak kesulitan, menyalahgunakan alat, atau butuh demo ulang."
    },
    concentration: {
      title: "Konsentrasi",
      text: "Eksplorasi: Baru tahap coba-coba/penasaran.\nAsyik Bekerja: Anak mulai fokus meski ada distraksi.\nDeep Focus: Konsentrasi mendalam, anak 'tenggelam' dalam kerjanya."
    },
    social: {
      title: "Konteks Sosial",
      text: "Individual: Bekerja sendiri dengan dunianya.\nBerpasangan: Bekerja berdampingan (Parallel play/Shared).\nKelompok: Berbagi peran untuk satu tujuan."
    },
    independence: {
      title: "Kemandirian",
      text: "Mandiri: Memilih, memproses & mengakhiri sendiri.\nButuh Dorongan: Anak ragu, menunggu perintah, atau mencari persetujuan guru terus-menerus."
    },
    restoration: {
      title: "Restorasi Alat",
      text: "YA: Dikembalikan ke rak sesuai urutan & rapi.\nTIDAK: Ditinggal di meja/karpet tanpa dirapikan."
    }
  };

  return (
    <div className="unified-sentra-container" style={{ paddingBottom: '100px' }}>
      
      <div className="control-center-header" style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', padding: '12px 16px', borderBottom: '1.5px solid #F1F5F9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                <div className="room-badge" style={{ background: '#EEF2FF', color: 'var(--primary)', padding: '6px 10px', borderRadius: '12px', fontWeight: 950, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #C7D2FE', width: '100%', minWidth: 0 }}>
                    <MapPin size={13} style={{ flexShrink: 0 }} /> 
                    <select value={activeRoom} onChange={e => setActiveRoom(e.target.value)} style={{ background: 'transparent', border: 'none', fontWeight: 950, color: 'inherit', outline: 'none', cursor: 'pointer', width: '100%', minWidth: 0, textOverflow: 'ellipsis' }}>
                        {roomList.map(r => (
                            <option key={r.id} value={r.name}>{r.level ? `${r.level} - ` : ''}{r.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '14px', border: '1px solid #E2E8F0', flexShrink: 0 }}>
                <button onClick={() => setViewMode('observasi')} style={{ padding: '7px 12px', borderRadius: '11px', border: 'none', background: viewMode === 'observasi' ? 'white' : 'transparent', color: viewMode === 'observasi' ? 'var(--primary)' : '#64748B', fontWeight: 950, fontSize: '0.65rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, boxShadow: viewMode === 'observasi' ? '0 4px 12px rgba(0,0,0,0.08)' : 'none', transition: '0.3s' }}>
                    <LayoutGrid size={13} /> RAK
                </button>
                <button onClick={() => setViewMode('kelola')} style={{ padding: '7px 12px', borderRadius: '11px', border: 'none', background: viewMode === 'kelola' ? 'white' : 'transparent', color: viewMode === 'kelola' ? 'var(--primary)' : '#64748B', fontWeight: 950, fontSize: '0.65rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, boxShadow: viewMode === 'kelola' ? '0 4px 12px rgba(0,0,0,0.08)' : 'none', transition: '0.3s' }}>
                    <Settings2 size={13} /> ATUR
                </button>
            </div>
        </div>

        <div className="area-navbar-wrapper" style={{ margin: '0 -4px', padding: '0 4px' }}>
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
            {curriculum.map(area => {
              const isActive = activeAreaId === area.id;
              const countOnShelf = area.subAreas?.reduce((sum, sub) => sum + sub.levels.filter(l => shelfItems.includes(typeof l === 'object' ? l.label : l)).length, 0) || 0;
              const shortLabel = (() => {
                  const n = area.name.toLowerCase();
                  if (n.includes('agama') || n.includes('pai')) return 'PAI';
                  if (n.includes('matematika') || n.includes('math')) return 'MATH';
                  if (n.includes('bahasa')) return 'BHSA';
                  if (n.includes('budaya') || n.includes('culture')) return 'BDYA';
                  if (n.includes('practical') || n.includes('praktis')) return 'PRAC';
                  if (n.includes('seni') || n.includes('art')) return 'SENI';
                  if (n.includes('indrawi') || n.includes('sensorial')) return 'SAINS';
                  return area.name.substring(0, 4).toUpperCase();
              })();
              return (
                <button key={area.id} onClick={() => setActiveAreaId(area.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '6px 2px', borderRadius: '10px', background: isActive ? `${area.color}15` : 'transparent', border: 'none', color: isActive ? area.color : '#94A3B8', cursor: 'pointer', transition: '0.2s', minWidth: 0, position: 'relative' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: isActive ? area.color : '#F1F5F9', color: isActive ? 'white' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AreaIcon name={area.icon} color={isActive ? 'white' : '#94A3B8'} size={14} />
                  </div>
                  <span style={{ fontSize: '0.55rem', fontWeight: 950 }}>{shortLabel}</span>
                  {countOnShelf > 0 && <span style={{ position: 'absolute', top: 0, right: 0, fontSize: '0.45rem', background: '#0F172A', color: 'white', padding: '1px 3px', borderRadius: '4px' }}>{countOnShelf}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {viewMode === 'kelola' ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                    {['All', 'K1', 'K2', 'K3', 'K4', 'K5', 'K6'].map(g => (
                        <button key={g} onClick={() => setMapFocusGrade(g)} style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: mapFocusGrade === g ? activeArea.color : '#F1F5F9', color: mapFocusGrade === g ? 'white' : '#64748B', fontWeight: 900, fontSize: '0.6rem' }}>{g}</button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {shelfItems.length > 0 && (
                        <button onClick={() => setShowPrepSheet(true)} style={{ background: '#EEF2FF', color: 'var(--primary)', border: '1px solid #C7D2FE', padding: '8px 12px', borderRadius: '10px', fontWeight: 950, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}><PackageSearch size={16} /> CEK ALAT</button>
                    )}
                    <button onClick={handleSaveShelf} className="btn-save-master" style={{ background: 'var(--primary)', color: 'white', padding: '8px 16px', borderRadius: '10px', border: 'none', fontWeight: 950, fontSize: '0.75rem' }}>{loadingAction ? '...' : 'SIMPAN'}</button>
                </div>
            </div>
        ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F8FAFC', padding: '5px 12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <Calendar size={12} color="#64748B" />
                    <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ border: 'none', background: 'transparent', fontWeight: 950, fontSize: '0.75rem', color: '#1E293B', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    {['All', 'K1', 'K2', 'K3', 'K4', 'K5', 'K6'].map(g => (
                        <button key={g} onClick={() => setMapFocusGrade(g)} style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: mapFocusGrade === g ? activeArea.color : '#F1F5F9', color: mapFocusGrade === g ? 'white' : '#64748B', fontWeight: 900, fontSize: '0.6rem' }}>{g}</button>
                    ))}
                </div>
            </div>
        )}
      </div>

      <div style={{ padding: '24px 20px', maxWidth: '850px', margin: '0 auto' }}>
          <div key={`${viewMode}-${activeAreaId}`} className="animate-content-switch" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeArea?.subAreas.map(sub => {
                const isExpanded = activeSubAreaId === sub.id;
                const filteredLevels = sub.levels.filter(m => {
                    const label = typeof m === 'object' ? m.label : m;
                    const matchesGrade = mapFocusGrade === 'All' || label.includes(mapFocusGrade);
                    const matchesMode = viewMode === 'kelola' || shelfItems.includes(label);
                    return matchesGrade && matchesMode;
                });
                if (filteredLevels.length === 0) return null;
                const countInSubAreaOnShelf = sub.levels.filter(l => shelfItems.includes(typeof l === 'object' ? l.label : l)).length;

                const gradeRange = (() => {
                    const grades = new Set();
                    sub.levels.forEach(lvl => {
                        const label = typeof lvl === 'object' ? lvl.label : lvl;
                        if (label.includes('K1')) grades.add('K1');
                        if (label.includes('K2')) grades.add('K2');
                        if (label.includes('K3')) grades.add('K3');
                    });
                    const sorted = Array.from(grades).sort();
                    if (sorted.length === 0) return 'All';
                    if (sorted.length === 1) return sorted[0];
                    return `${sorted[0]}-${sorted[sorted.length - 1]}`;
                })();

                const subIndo = sub.name.split(' / ')[1] || sub.name.split(' / ')[0];
                const subEng = sub.name.split(' / ')[1] ? sub.name.split(' / ')[0] : '';

                return (
                    <div key={sub.id} style={{ backgroundColor: 'white', borderRadius: '24px', border: '1.5px solid #F1F5F9', overflow: 'hidden' }}>
                        <div onClick={() => setActiveSubAreaId(isExpanded ? null : sub.id)} style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isExpanded ? `${activeArea.color}05` : 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ minWidth: '40px', height: '40px', borderRadius: '50%', background: isExpanded ? activeArea.color : '#F1F5F9', color: isExpanded ? 'white' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: '0.65rem', border: '1.5px solid', borderColor: isExpanded ? 'rgba(255,255,255,0.3)' : '#E2E8F0', flexShrink: 0 }}>{gradeRange}</div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 950, color: '#1E293B' }}>{subIndo}</h3>
                                            {subEng && <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, fontStyle: 'italic' }}>{subEng}</span>}
                                        </div>
                                        {countInSubAreaOnShelf > 0 && <span style={{ fontSize: '0.6rem', fontWeight: 950, background: `${activeArea.color}15`, color: activeArea.color, padding: '2px 8px', borderRadius: '6px' }}>{countInSubAreaOnShelf} AKTIF</span>}
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800 }}>{filteredLevels.length} Materi</span>
                                </div>
                            </div>
                            <ArrowLeft style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(-90deg)', transition: '0.3s', color: '#CBD5E1' }} size={18} />
                        </div>
                        {isExpanded && (
                            <div style={{ padding: '8px 20px 24px 20px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9' }}>
                                {(sub.name.toLowerCase().includes('adab') || sub.name.toLowerCase().includes('komunitas')) && (
                                    <div style={{ background: 'linear-gradient(135deg, #F0F9FF, #E0F2FE)', padding: '16px 20px', borderRadius: '16px', marginBottom: '16px', border: '1.5px solid #BAE6FD', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <CalendarDays size={20} color="#0284C7" />
                                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 950, color: '#0369A1' }}>Panduan Harian Masa Normalisasi</h4>
                                            </div>
                                            <button onClick={() => navigate('/training-manual')} style={{ background: 'white', color: '#0284C7', border: '1.5px solid #BAE6FD', padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F0F9FF'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                                <Printer size={14} /> Cetak 1 Bendel
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {[1, 2, 3].map(w => (
                                                <button key={w} onClick={() => { setShowDailyGuideWeek(w); setActiveDailyDay(0); }} style={{ flex: 1, minWidth: '100px', padding: '10px', borderRadius: '12px', border: 'none', background: 'white', color: '#0284C7', fontWeight: 900, fontSize: '0.75rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                    Minggu ke-{w}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {filteredLevels.map((m, idx) => {
                                    const label = typeof m === 'object' ? m.label : m;
                                    const isChecked = shelfItems.includes(label);
                                    const isFoundation = idx < 3;
                                    const isAdvanced = idx > 6;
                                    
                                    const mPartsFromLabel = label.split(': ')[1] || label;
                                    const mIndo = mPartsFromLabel.split(' / ')[1] || mPartsFromLabel.split(' / ')[0];
                                    const mEng = mPartsFromLabel.split(' / ')[1] ? mPartsFromLabel.split(' / ')[0] : '';

                                    return (
                                        <div key={label} onClick={() => { if (viewMode === 'kelola') toggleItemOnShelf(label); else { setActiveDrawerMateri(label); setSelectedKids([]); } }} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 18px', borderRadius: '18px', backgroundColor: 'white', border: '2px solid', borderColor: isChecked ? activeArea.color : '#F1F5F9', cursor: 'pointer', transition: '0.2s', marginBottom: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: isChecked ? activeArea.color : '#F1F5F9', color: isChecked ? 'white' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 950 }}>{idx + 1}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', gap: 4, marginBottom: 4, flexWrap: 'wrap' }}>
                                                    {isFoundation ? <span style={{ fontSize: '0.5rem', fontWeight: 950, color: '#059669', background: '#ECFDF5', padding: '1px 5px', borderRadius: '4px' }}>PONDASI</span> 
                                                    : isAdvanced ? <span style={{ fontSize: '0.5rem', fontWeight: 950, color: '#7C3AED', background: '#F5F3FF', padding: '1px 5px', borderRadius: '4px' }}>LANJUTAN</span> 
                                                    : <span style={{ fontSize: '0.5rem', fontWeight: 950, color: '#2563EB', background: '#EFF6FF', padding: '1px 5px', borderRadius: '4px' }}>PENGEMBANGAN</span>}
                                                    {hasTPL(m) && <span style={{ fontSize: '0.5rem', fontWeight: 950, color: 'white', background: '#F43F5E', padding: '1px 5px', borderRadius: '4px' }}>WAJIB TPL</span>}
                                                    {viewMode === 'kelola' && popularData[label] >= 3 && <span style={{ fontSize: '0.5rem', fontWeight: 950, color: '#D97706', background: '#FFFBEB', padding: '1px 5px', borderRadius: '4px' }}>🔥 POPULER</span>}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1E293B' }}>{mIndo}</div>
                                                    {mEng && <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, fontStyle: 'italic' }}>{mEng}</span>}
                                                </div>
                                            </div>
                                            {viewMode === 'kelola' ? (
                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid', borderColor: isChecked ? activeArea.color : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isChecked ? activeArea.color : 'transparent' }}>{isChecked && <CheckCircle2 size={14} color="white" />}</div>
                                            ) : <ChevronRight size={18} color="#CBD5E1" />}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
          </div>
      </div>

      {showSuccess && (
        <div style={{ position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)', zIndex: 12000, background: '#0F172A', color: 'white', padding: '12px 24px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <CheckCircle2 color="#10B981" /> <b>Berhasil Disimpan!</b>
        </div>
      )}

      {/* 🚀 SIDE DRAWER FOR ASSESSMENT */}
      {activeDrawerMateri && (
          <div className="side-drawer-overlay" onClick={() => setActiveDrawerMateri(null)}>
              <div className="side-drawer-content" onClick={e => e.stopPropagation()}>
                    <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', background: `${activeToolInfo.color}05` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <div style={{ background: activeToolInfo.color, color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '0.6rem', fontWeight: 950 }}>{activeToolInfo.area.toUpperCase()}</div>
                                {hasTPL(activeToolInfo.itemObj) && <div style={{ background: '#F43F5E', color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '0.6rem', fontWeight: 950 }}>WAJIB TPL</div>}
                            </div>
                            <button onClick={() => setActiveDrawerMateri(null)} style={{ background: 'white', border: '1px solid #E2E8F0', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}><X size={18}/></button>
                        </div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 950, color: '#1E293B', lineHeight: 1.2 }}>
                            {activeDrawerMateri.split(' / ')[1] || activeDrawerMateri.split(' / ')[0]}
                        </h2>
                        <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, fontStyle: 'italic', marginTop: 4 }}>
                            {activeDrawerMateri.split(' / ')[0]}
                        </p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                            <button onClick={() => setShowGuide(activeToolInfo.itemObj)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #E2E8F0', padding: '6px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900, color: '#64748B' }}><Info size={14}/> PANDUAN</button>
                            <div style={{ flex: 1, height: '4px', background: '#E2E8F0', borderRadius: 10, alignSelf: 'center', overflow: 'hidden', display: 'flex' }}>
                                <div style={{ width: `${activeProgress.masteredPct}%`, background: '#10B981' }} />
                                <div style={{ width: `${activeProgress.workingPct}%`, background: '#3B82F6' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748B' }}>{showFullGrid ? 'SEMUA MURID' : 'BELUM PRESENTASI'}</span>
                            <button onClick={() => setShowFullGrid(!showFullGrid)} style={{ background: '#F1F5F9', border: 'none', padding: '4px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 950, color: 'var(--primary)' }}>{showFullGrid ? 'Filter Belum' : 'Lihat Semua'}</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {(showFullGrid ? currentRoomStudents : activeProgress.waiting).map(kid => {
                                const isKidSelected = selectedKids.includes(kid.id);
                                const kidRep = repetitions[`${kid.id}_${activeDrawerMateri}`];
                                return (
                                    <div key={kid.id} onClick={() => toggleKidSelection(kid.id)} style={{ padding: '12px 16px', borderRadius: '16px', border: '1.5px solid', borderColor: isKidSelected ? 'var(--primary)' : '#F1F5F9', background: isKidSelected ? '#EEF2FF' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: isKidSelected ? 'var(--primary)' : '#F1F5F9', color: isKidSelected ? 'white' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 950 }}>{isKidSelected ? '✓' : kid.name.charAt(0)}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: isKidSelected ? 'var(--primary)' : '#1E293B', lineHeight: 1.2 }}>{kid.name}</div>
                                            {kidRep?.level && <div style={{ fontSize: '0.6rem', color: kidRep.level === 'M' ? '#10B981' : '#3B82F6', fontWeight: 950, marginTop: 2 }}>{kidRep.level === 'M' ? '🎓 MASTERED' : '⚙️ WORKING'}</div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ padding: '24px', borderTop: '1px solid #F1F5F9', background: 'white', display: 'flex', gap: 12 }}>
                        <button 
                            disabled={selectedKids.length === 0}
                            onClick={() => setShowSheet(true)}
                            style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '1.5px dashed #C7D2FE', background: '#F8FAFC', color: 'var(--primary)', fontWeight: 950, fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                            OPSI LANJUT
                        </button>
                        <button 
                            disabled={selectedKids.length === 0 || loadingAction}
                            onClick={handleInstantSave}
                            style={{ flex: 2, padding: '16px', borderRadius: '16px', border: 'none', background: selectedKids.length > 0 ? 'var(--primary)' : '#CBD5E1', color: 'white', fontWeight: 950, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: selectedKids.length > 0 ? '0 10px 20px -5px rgba(59, 130, 246, 0.3)' : 'none', cursor: 'pointer' }}
                        >
                            {loadingAction ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                            SIMPAN {selectedKids.length > 0 ? `(${selectedKids.length} Murid)` : ''}
                        </button>
                    </div>
              </div>
          </div>
      )}

      {/* 🚀 5 PILAR AMI OBSERVASI MODAL (BOTTOM) */}
      {showSheet && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 13000, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowSheet(false)}>
             <div style={{ background: 'white', width: '100%', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '32px 24px 48px', animation: 'slideUp 0.4s ease', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                    <div style={{ width: 40, height: 4, background: '#CBD5E1', borderRadius: 10, margin: '0 auto 24px' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                           <h2 style={{ fontSize: '1.2rem', fontWeight: 950, color: '#1E293B' }}>Fokus Observasi ({selectedKids.length} Murid)</h2>
                           <p style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700, marginTop: 2, maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {selectedKids.map(id => students.find(s => s.id === id)?.name).join(', ')}
                           </p>
                        </div>
                        <button onClick={() => setShowSheet(false)} style={{ background: '#F1F5F9', border: 'none', padding: '8px', borderRadius: '50%' }}><X size={20}/></button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* 1. Kematangan (P-W-M-N) */}
                        <div style={{ padding: '16px', background: '#FFF7ED', borderRadius: '24px', border: '1px solid #FFEDD5', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Sparkles size={18} color="#D97706" />
                                    <p style={{ fontSize: '0.75rem', fontWeight: 950, color: '#9A3412', margin: 0, letterSpacing: '0.5px' }}>1. KEMATANGAN (P-W-M-N)</p>
                                </div>
                                <button onClick={() => setActivePilarHelp(activePilarHelp === 'maturity' ? null : 'maturity')} style={{ border: 'none', background: 'white', borderRadius: '50%', padding: '4px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                    <HelpCircle size={15} color="#D97706" />
                                </button>
                            </div>
                            {activePilarHelp === 'maturity' && (
                                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', fontSize: '0.7rem', color: '#9A3412', border: '1px solid #FFEDD5', marginBottom: 12, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{PILAR_GUIDE.maturity.text}</div>
                            )}
                            <div style={{ display: 'flex', gap: 8 }}>
                                {[
                                    {id: 'P', label: 'Presentasi'}, 
                                    {id: 'W', label: 'Berlatih'}, 
                                    {id: 'M', label: 'Mahir'},
                                    {id: 'N', label: 'Bantuan'}
                                ].map(l => (
                                    <button key={l.id} onClick={() => setMaturity(l.id)} style={{ flex: 1, padding: '12px 4px', borderRadius: '14px', border: '2px solid', borderColor: maturity === l.id ? '#D97706' : '#FFEDD5', background: maturity === l.id ? '#D97706' : 'white', fontWeight: 950, color: maturity === l.id ? 'white' : '#9A3412', fontSize: '0.7rem' }}>
                                        {l.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Konsentrasi */}
                        <div style={{ padding: '16px', background: '#FEF2F2', borderRadius: '24px', border: '1px solid #FEE2E2' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Flame size={18} color="#DC2626" />
                                    <p style={{ fontSize: '0.75rem', fontWeight: 950, color: '#991B1B', margin: 0, letterSpacing: '0.5px' }}>2. KONSENTRASI</p>
                                </div>
                                <button onClick={() => setActivePilarHelp(activePilarHelp === 'concentration' ? null : 'concentration')} style={{ border: 'none', background: 'white', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
                                    <HelpCircle size={15} color="#DC2626" />
                                </button>
                            </div>
                            {activePilarHelp === 'concentration' && (
                                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', fontSize: '0.7rem', color: '#991B1B', border: '1px solid #FEE2E2', marginBottom: 12, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{PILAR_GUIDE.concentration.text}</div>
                            )}
                            <div style={{ display: 'flex', gap: 8 }}>
                                {[
                                    {id: 'Exploration', label: 'Eksplorasi'}, 
                                    {id: 'Asyik', label: 'Asyik Bekerja'}, 
                                    {id: 'Deep', label: 'Deep Focus'}
                                ].map(c => (
                                    <button key={c.id} onClick={() => setConcentration(c.id)} style={{ flex: 1, padding: '12px 4px', borderRadius: '14px', border: '2px solid', borderColor: concentration === c.id ? '#DC2626' : '#FEE2E2', background: concentration === c.id ? '#DC2626' : 'white', fontWeight: 950, color: concentration === c.id ? 'white' : '#991B1B', fontSize: '0.7rem' }}>
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Konteks Sosial */}
                        <div style={{ padding: '16px', background: '#F5F3FF', borderRadius: '24px', border: '1px solid #EDE9FE' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Users2 size={18} color="#7C3AED" />
                                    <p style={{ fontSize: '0.75rem', fontWeight: 950, color: '#5B21B6', margin: 0, letterSpacing: '0.5px' }}>3. KONTEKS SOSIAL</p>
                                </div>
                                <button onClick={() => setActivePilarHelp(activePilarHelp === 'social' ? null : 'social')} style={{ border: 'none', background: 'white', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
                                    <HelpCircle size={15} color="#7C3AED" />
                                </button>
                            </div>
                            {activePilarHelp === 'social' && (
                                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', fontSize: '0.7rem', color: '#5B21B6', border: '1px solid #EDE9FE', marginBottom: 12, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{PILAR_GUIDE.social.text}</div>
                            )}
                            <div style={{ display: 'flex', gap: 8 }}>
                                {[
                                    {id: 'Individual', label: 'Individual'}, 
                                    {id: 'Pair', label: 'Berpasangan'}, 
                                    {id: 'Collaborative', label: 'Kelompok'}
                                ].map(s => (
                                    <button key={s.id} onClick={() => setSocialContext(s.id)} style={{ flex: 1, padding: '12px 4px', borderRadius: '14px', border: '2px solid', borderColor: socialContext === s.id ? '#7C3AED' : '#EDE9FE', background: socialContext === s.id ? '#7C3AED' : 'white', fontWeight: 950, color: socialContext === s.id ? 'white' : '#5B21B6', fontSize: '0.7rem' }}>
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 4. Kemandirian */}
                        <div style={{ padding: '16px', background: '#EFF6FF', borderRadius: '24px', border: '1px solid #DBEAFE' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <HeartHandshake size={18} color="#2563EB" />
                                    <p style={{ fontSize: '0.75rem', fontWeight: 950, color: '#1E40AF', margin: 0, letterSpacing: '0.5px' }}>4. KEMANDIRIAN</p>
                                </div>
                                <button onClick={() => setActivePilarHelp(activePilarHelp === 'independence' ? null : 'independence')} style={{ border: 'none', background: 'white', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
                                    <HelpCircle size={15} color="#2563EB" />
                                </button>
                            </div>
                            {activePilarHelp === 'independence' && (
                                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', fontSize: '0.7rem', color: '#1E40AF', border: '1px solid #DBEAFE', marginBottom: 12, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{PILAR_GUIDE.independence.text}</div>
                            )}
                            <div style={{ display: 'flex', gap: 8 }}>
                                {[
                                    {id: 'Independent', label: 'Mandiri'}, 
                                    {id: 'NeedsPush', label: 'Butuh Dorongan'}
                                ].map(i => (
                                    <button key={i.id} onClick={() => setIndependence(i.id)} style={{ flex: 1, padding: '12px 4px', borderRadius: '14px', border: '2px solid', borderColor: independence === i.id ? '#2563EB' : '#DBEAFE', background: independence === i.id ? '#2563EB' : 'white', fontWeight: 950, color: independence === i.id ? 'white' : '#1E40AF', fontSize: '0.7rem' }}>
                                        {i.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 5. Restorasi */}
                        <div style={{ padding: '16px 20px', background: '#ECFDF5', borderRadius: '24px', border: '1px solid #D1FAE5' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <RotateCcw size={18} color="#059669" />
                                    <p style={{ fontSize: '0.85rem', fontWeight: 950, color: '#065F46', margin: 0 }}>5. RESTORASI ALAT</p>
                                </div>
                                <button onClick={() => setActivePilarHelp(activePilarHelp === 'restoration' ? null : 'restoration')} style={{ border: 'none', background: 'white', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
                                    <HelpCircle size={15} color="#059669" />
                                </button>
                            </div>
                            {activePilarHelp === 'restoration' && (
                                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', fontSize: '0.7rem', color: '#065F46', border: '1px solid #D1FAE5', marginBottom: 12, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{PILAR_GUIDE.restoration.text}</div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.7rem', color: '#065F46', fontWeight: 700 }}>Anak merapikan kembali ke rak sesuai urutan.</span>
                                <button onClick={() => setRestoration(!restoration)} style={{ background: restoration ? '#059669' : '#D1FAE5', border: 'none', width: 68, height: 32, borderRadius: '100px', position: 'relative', transition: '0.3s' }}>
                                    <div style={{ position: 'absolute', top: 4, left: restoration ? 40 : 4, width: 24, height: 24, background: 'white', borderRadius: '50%', transition: '0.3s' }} />
                                    <span style={{ fontSize: '0.6rem', fontWeight: 950, color: restoration ? 'white' : '#065F46', position: 'absolute', left: restoration ? 8 : 34, top: '50%', transform: 'translateY(-50%)' }}>{restoration ? 'YA' : 'TDK'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleInstantSave} style={{ width: '100%', marginTop: 32, padding: '20px', borderRadius: '24px', background: 'var(--primary)', color: 'white', fontWeight: 950, fontSize: '1rem', border: 'none', boxShadow: '0 15px 30px -10px rgba(37,99,235,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                        {loadingAction ? <Loader2 className="animate-spin" size={20}/> : <ShieldCheck size={22}/>}
                        SIMPAN OBSERVASI 5 PILAR
                    </button>
             </div>
          </div>
      )}

      {/* 🛠️ APARATUS PREP MODAL (CENTERED) */}
      {showPrepSheet && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowPrepSheet(false)}>
             <div style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '32px', padding: '32px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 950, color: '#1E293B' }}>Daftar Persiapan Alat</h2>
                            <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 700, marginTop: 4 }}>Siapkan benda fisik berikut untuk diletakkan di rak.</p>
                        </div>
                        <button onClick={() => setShowPrepSheet(false)} style={{ background: '#F1F5F9', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', cursor: 'pointer' }}><X size={20}/></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {Object.keys(aparatusList).length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>Belum ada alat yang diaktifkan di rak.</div>
                        ) : Object.entries(aparatusList).map(([areaName, tools]) => (
                            <div key={areaName}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 950, color: 'white', background: '#0F172A', padding: '3px 10px', borderRadius: '6px', display: 'inline-block', marginBottom: 12 }}>{areaName.toUpperCase()}</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                                    {Array.from(tools).map(tool => (
                                        <div key={tool} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
                                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155' }}>{tool}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => setShowPrepSheet(false)} style={{ width: '100%', marginTop: 32, padding: '16px', background: 'var(--primary)', color: 'white', borderRadius: '16px', border: 'none', fontWeight: 950, fontSize: '1rem', cursor: 'pointer', transition: '0.2s' }}>Selesai Menyiapkan</button>
             </div>
          </div>
      )}

      {/* 📘 GUIDE MODAL (SIDE DRAWER STYLE FOR PREMIUM FEEL) */}
      {showGuide && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 20000, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'flex-end' }} onClick={() => setShowGuide(null)}>
             <div 
                style={{ 
                    background: 'white', width: '100%', maxWidth: '500px', height: '100%', 
                    boxShadow: '-10px 0 40px rgba(0,0,0,0.1)', animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden'
                }} 
                onClick={e => e.stopPropagation()}
             >
                    {/* Header: High Impact */}
                    <div style={{ padding: '32px 40px 24px', borderBottom: '1px solid #F1F5F9', background: `${activeToolInfo?.color || '#3B82F6'}05` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <div style={{ background: activeToolInfo?.color || '#3B82F6', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 950, letterSpacing: '0.5px' }}>
                                    ALBUM PANDUAN
                                </div>
                                {hasTPL(showGuide) && (
                                    <div style={{ background: '#F43F5E', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 950 }}>
                                        WAJIB TPL
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setShowGuide(null)} style={{ background: 'white', border: '1px solid #E2E8F0', width: 36, height: 36, borderRadius: '50%', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={20}/></button>
                        </div>
                        
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 950, color: '#0F172A', lineHeight: 1.2, margin: 0 }}>
                            {showGuide.label?.split(': ')[1]?.split(' / ')[0] || showGuide.label}
                        </h2>
                        {showGuide.label?.includes(' / ') && (
                            <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 700, fontStyle: 'italic', marginTop: 6 }}>
                                {showGuide.label.split(' / ')[1]}
                            </p>
                        )}
                    </div>

                    {/* Content: Scrollable */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px 48px' }}>
                        
                        {/* 1. Apparatus / Alat */}
                        {(showGuide.presentation?.toolDisplay || showGuide.presentation?.tool || (showGuide.presentation?.toolsList?.length > 0)) && (
                            <div style={{ marginBottom: '32px', padding: '20px', backgroundColor: '#FFFBEB', borderRadius: '20px', border: '1px solid #FEF3C7' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 950, color: '#D97706', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Package size={14} /> Alat / Apparatus (APE)
                                </div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#92400E', lineHeight: '1.6' }}>
                                    {showGuide.presentation.toolDisplay || (showGuide.presentation.toolsList?.join(', ')) || showGuide.presentation.tool}
                                </div>
                            </div>
                        )}

                        {/* 2. Direct Aim / Tujuan */}
                        {showGuide.presentation?.directAim && (
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 950, color: activeToolInfo?.color || '#3B82F6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Zap size={14} /> Tujuan Pembelajaran
                                </div>
                                <p style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
                                    {showGuide.presentation.directAim}
                                </p>
                            </div>
                        )}

                        {/* 3. Presentation Steps: GRANULAR DETAIL UI */}
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 950, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Activity size={12} /> Langkah Presentasi AMI
                            </div>
                            
                            {showGuide.presentation?.steps?.length > 0 ? (
                                <div className="modern-steps-container">
                                    {(() => {
                                        let stepCounter = 0;
                                        return showGuide.presentation.steps.map((step, si) => {
                                            const isHeader = typeof step === 'string' && (step.startsWith('I.') || step.startsWith('--') || step.startsWith('II.') || step.startsWith('III.') || step.startsWith('IV.') || step.startsWith('V.'));

                                            if (isHeader) {
                                                return (
                                                    <div key={si} className="modern-step-header" style={{ marginTop: si === 0 ? 0 : 24 }}>
                                                        <div className="modern-header-dot" style={{ backgroundColor: activeToolInfo?.color || '#3B82F6' }}></div>
                                                        {step.replace(/---/g, '').replace(/^[IVX]+\.\s*/, '').trim()}
                                                    </div>
                                                );
                                            }

                                            stepCounter++;
                                            const stepMatch = typeof step === 'string' ? step.match(/^(\d+\.)\s(.*)/) : null;
                                            const stepNum = stepMatch ? stepMatch[1] : `${stepCounter}.`;
                                            const stepText = stepMatch ? stepMatch[2] : step;

                                            return (
                                                <div key={si} className="modern-step-row">
                                                    <div className="modern-step-num">{stepNum}</div>
                                                    <div className="modern-step-content">
                                                        {typeof stepText === 'string' ? stepText.split(/'([^']+)'/).map((part, index) =>
                                                            index % 2 === 1 ? (
                                                                <div key={index} className="modern-dialogue-box">
                                                                    <MessageSquare size={12} style={{ marginTop: 4, flexShrink: 0 }} />
                                                                    <span>"{part}"</span>
                                                                </div>
                                                            ) : renderTextWithTags(part)
                                                        ) : stepText}
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            ) : (
                                <div style={{ padding: '32px 20px', background: '#F8FAFC', borderRadius: '24px', border: '1px dashed #E2E8F0', textAlign: 'center', color: '#94A3B8' }}>
                                    <AlertCircle size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
                                    <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>Belum ada langkah presentasi mendetail.</p>
                                </div>
                            )}
                        </div>

                        {/* 4. Control of Error */}
                        {showGuide.presentation?.error && (
                            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#FEF2F2', borderRadius: '24px', border: '1px solid #FEE2E2' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 950, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ShieldCheck size={14} /> Kontrol Kesalahan
                                </div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#991B1B', lineHeight: '1.5' }}>
                                    {showGuide.presentation.error}
                                </div>
                            </div>
                        )}
                        
                        {/* 5. Video Preview Section (New Granular UI Feature) */}
                        {showGuide.presentation?.videoUrl && (
                            <div style={{ marginTop: '32px' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 950, color: '#E11D48', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Video size={14} /> Video Tutorial Tersemat
                                </div>
                                
                                <div 
                                    onClick={() => window.open(showGuide.presentation.videoUrl, '_blank')}
                                    style={{ 
                                        position: 'relative', width: '100%', borderRadius: '24px', 
                                        overflow: 'hidden', cursor: 'pointer', aspectRatio: '16/9',
                                        background: '#0F172A', border: '1px solid #E2E8F0',
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {getYTThumbnail(showGuide.presentation.videoUrl) ? (
                                        <>
                                            <img 
                                                src={getYTThumbnail(showGuide.presentation.videoUrl)} 
                                                alt="Video Thumbnail" 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                                            />
                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                                                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
                                                    <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '16px solid #EF4444', marginLeft: 4 }}></div>
                                                </div>
                                            </div>
                                            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, background: 'rgba(255,255,255,0.95)', padding: '8px 16px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, color: '#0F172A', textAlign: 'center', backdropFilter: 'blur(4px)' }}>
                                                KLIK UNTUK NONTON DI YOUTUBE
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                                            <Video size={48} color="white" opacity={0.5} />
                                            <span style={{ color: 'white', fontWeight: 900, fontSize: '0.8rem' }}>NONTON VIDEO DEMO</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
             </div>
          </div>
      )}

      {/* 📅 DAILY GUIDE MODAL (Migrated from Timeline) */}
      {showDailyGuideWeek !== null && (() => {
        const guide = DAILY_GUIDES[showDailyGuideWeek];
        const currentDay = guide.days[activeDailyDay];
        
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 14000, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowDailyGuideWeek(null)}>
            <div style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '24px', overflow: 'hidden', animation: 'scaleIn 0.3s ease' }} onClick={e => e.stopPropagation()}>
              <div style={{ background: '#10B981', color: 'white', padding: '24px', position: 'relative' }}>
                <button onClick={() => setShowDailyGuideWeek(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.2)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900, marginBottom: '12px' }}>
                  <CalendarDays size={14} /> MINGGU KE-{showDailyGuideWeek}
                </div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950, lineHeight: 1.3 }}>{guide.theme}</h2>
              </div>
              
              <div style={{ display: 'flex', borderBottom: '1.5px solid #F1F5F9', overflowX: 'auto', scrollbarWidth: 'none' }}>
                {guide.days.map((d, i) => (
                  <button
                    key={d.day}
                    onClick={() => setActiveDailyDay(i)}
                    style={{ flex: 1, minWidth: '80px', padding: '16px 12px', background: 'transparent', border: 'none', borderBottom: activeDailyDay === i ? '3px solid #10B981' : '3px solid transparent', color: activeDailyDay === i ? '#10B981' : '#64748B', fontWeight: 950, fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s' }}
                  >
                    {d.day}
                  </button>
                ))}
              </div>
              
              <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 900, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={20} color="#10B981" /> {currentDay.focus}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={14} /> Circle Time (Klasikal)
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>{currentDay.circleTime}</p>
                  </div>
                  
                  <div style={{ background: '#F0FDF4', padding: '16px', borderRadius: '16px', border: '1px solid #DCFCE7' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#166534', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <LayoutGrid size={14} /> Work Cycle (Siklus Kerja)
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#166534', lineHeight: 1.6 }}>{currentDay.workCycle}</p>
                  </div>
                  
                  <div style={{ background: '#FFF7ED', padding: '16px', borderRadius: '16px', border: '1px solid #FFEDD5' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#9A3412', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Heart size={14} /> Closing & Refleksi
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#9A3412', lineHeight: 1.6 }}>{currentDay.closing}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <style>{`
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
        
        .side-drawer-overlay {
            position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); 
            backdrop-filter: blur(4px); z-index: 10000; display: flex; justify-content: flex-end;
        }
        .side-drawer-content {
            background: white; width: 100%; maxWidth: 450px; height: 100%;
            animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex; flexDirection: column;
            boxShadow: -10px 0 30px rgba(0,0,0,0.1);
        }

        /* Modern Steps Styles from CurriculumManager */
        .modern-steps-container { position: relative; padding-left: 20px; }
        .modern-steps-container::before { 
            content: ''; position: absolute; left: 6px; top: 10px; bottom: 10px; 
            width: 2px; background: #F1F5F9; border-radius: 2px;
        }
        .modern-step-header { 
            position: relative; margin-top: 24px; margin-bottom: 16px;
            font-size: 0.85rem; font-weight: 950; color: #0F172A; text-transform: uppercase;
            padding-left: 10px; letter-spacing: 0.5px;
        }
        .modern-header-dot { 
            position: absolute; left: -20px; top: 50%; transform: translateY(-50%);
            width: 14px; height: 14px; border: 3px solid white; border-radius: 50%;
            box-shadow: 0 0 0 2px #F1F5F9;
        }
        .modern-step-row { position: relative; display: flex; gap: 16px; margin-bottom: 20px; }
        .modern-step-num { 
            font-size: 0.8rem; font-weight: 950; color: #94A3B8; 
            width: 24px; flex-shrink: 0; text-align: right; margin-top: 2px;
        }
        .modern-step-content { font-size: 0.95rem; font-weight: 600; color: #334155; line-height: 1.6; flex: 1; }
        .modern-dialogue-box { 
            background: #F1F5F9; padding: 12px 16px; border-radius: 12px; 
            margin: 10px 0; color: #4F46E5; font-weight: 800; font-size: 0.9rem;
            display: flex; gap: 10px; align-items: flex-start;
            border-left: 4px solid #4F46E5;
        }
        .modern-dialogue-box span { font-style: italic; }
      `}</style>
    </div>
  );
}
