/**
 * smartKumerMapping.js
 * Database otomatis yang menghubungkan CP Kumer ke Granul Montessori AMI
 * Referensi Grantul: areaSentraCycle2.js (Database Lengkap)
 */

export const SMART_KUMER_MAPPING = {
  // --- PAI & BP ---
  'pai-a-qh': [
    'K1: Sandpaper Hijaiyah Tunggal / Single Sandpaper Hijaiyah',
    'K1: Menulis Arab: Tracing Hijaiyah / Arabic Writing: Hijaiyah Tracing',
    'K1: Menulis Arab: Menyalin di Baki Pasir / Arabic Writing: Sand Tray Copying',
    'K1: Tahfidz Mandiri: Surah Al-Fatihah / Independent Hifz: Surah Al-Fatihah'
  ],
  'pai-a-fi': [
    'K1: Tata Cara Berwudhu / Procedure for Wudhu (Thaharah)',
    'K1: Praktik Sholat 2 Rakaat / 2-Rakaat Prayer Practice (Fajr)'
  ],

  // --- MATEMATIKA ---
  'mat-a-bi': [
    'K1: Pengenalan Jumlah / Introduction to Quantity (1, 10, 100, 1000)',
    'K1: Pengenalan Simbol / Introduction to Symbols (The Cards)',
    'K1: Asosiasi Jumlah & Simbol / Association of Quantity & Symbols',
    'K1: Pembentukan Angka / Formation of Numbers (The Magic Slide)',
    'K1: Number Rods (1-10)',
    'K1: Sandpaper Numbers (0-9)',
    'K1: Spindle Boxes',
    'K1: Cards and Counters'
  ],

  // --- BAHASA INDONESIA ---
  'ind-a-ms': [
    'K2: Adab Berbicara & Mendengar / Etiquette of Speaking & Listening',
    'K1: Kisah Nabi Adam a.s. / Story of Prophet Adam a.s.',
    'K1: Kisah Nabi Nuh a.s. / Story of Prophet Nuh a.s.'
  ],
  'ind-a-me': [
    'K1: Metal Insets',
    'K1: Sandpaper Letters',
    'K1: Alat Jahit Kayu (Lacing) / Lacing Tool (Pre-writing)'
  ],

  // --- IPAS (Sains & Sosial) ---
  'ips-b-ps': [
    'K1-K2: Morfologi Pohon / The Tree Puzzle & Anatomy',
    'K2-K3: Struktur Daun: Helai, Tangkai & Pelepah / Parts of a Leaf',
    'K2-K3: Struktur Akar / The Root System (Searchers for Water)',
    'K3: Struktur & Perkecambahan Biji / Seed Germination',
    'K1-K2: Klasifikasi Makhluk Hidup (Hidup, Mati, Tak Hidup) / Living, Dead, Non-Living'
  ],
  'ips-b-sz': [
    'K1-K2: Wujud Zat / States of Matter (Solid, Liquid, Gas)',
    'K2-K3: Campuran & Larutan / Solutions & Basic Chemistry'
  ],
  'ips-b-gj': [
    'K1-K2: Gaya & Gravitasi / Introduction to Gravity (The Earth Pull)',
    'K2-K3: Gaya & Magnetisme / The Laws of Magnetism (Attract & Repel)',
    'K2-K3: Cahaya & Refraksi / Light & Refraction (The Broken Pencil)'
  ],

  // --- PENDIDIKAN PANCASILA ---
  'pkn-a-pa': [
    'K1: Kartu 3 Bagian Simbol Pancasila / Pancasila Symbols 3-Part Cards',
    'K1-K2: Menghafal Sila dengan Gerakan / Sila Memorization with Gestures'
  ],
  'pkn-a-nk': [
    'K1-K2: Mewarnai & Mengenal Bendera Merah Putih / The Indonesian Flag'
  ],

  // --- SENI RUPA ---
  'snr-a-ml': [
    'K1-K2: Laci Morfologi Daun / The Leaf Cabinet Shapes',
    'K1: Color Tablets (Box 1, 2, 3): Primary and Secondary Colors'
  ],

  // --- PJOK ---
  'pjok-a-gr': [
    'K1-K2: Menghafal Sila dengan Gerakan / Sila Memorization with Gestures',
    'K1: Carry a Chair or Tray without sound / Precise Movement'
  ],
  'pjok-a-kb': [
    'K1: Tata Cara Berwudhu / Procedure for Wudhu (Thaharah)',
    'K1-K2: Kebutuhan Dasar Tumbuhan / The Basic Needs of Plants (Outdoor work)'
  ]
};

/**
 * Fungsi untuk mendapatkan CP ID berdasarkan label granul
 */
export const getKumerCPByMateri = (materiLabel) => {
  const normalizedLabel = materiLabel.trim();
  for (const [cpId, granules] of Object.entries(SMART_KUMER_MAPPING)) {
    // Exact or loose matching
    if (granules.some(g => g.toLowerCase() === normalizedLabel.toLowerCase() || 
                           g.includes(normalizedLabel) || 
                           normalizedLabel.includes(g))) {
        return cpId;
    }
  }
  return null;
};
