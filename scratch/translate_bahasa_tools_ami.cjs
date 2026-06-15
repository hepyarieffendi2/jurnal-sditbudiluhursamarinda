const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
    apiKey: "AIzaSyAbh1AMSDPXcAlS7hfbo7tlAe14CGfZjuw",
    authDomain: "sditbudiluhursamarinda-cc15a.firebaseapp.com",
    projectId: "sditbudiluhursamarinda-cc15a",
    storageBucket: "sditbudiluhursamarinda-cc15a.firebasestorage.app",
    messagingSenderId: "795444212164",
    appId: "1:795444212164:web:ddf70f43dcb61548df3491",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const translationMap = [
    // Pink/Blue/Green Series
    { from: /Kotak mainan\/objek Pink.*?suku kata terbuka.*?/gi, to: 'Pink Series Object Boxes' },
    { from: /Kotak mainan\/objek Pink/gi, to: 'Pink Series Object Boxes' },
    { from: /Kartu kata berkode merah muda/gi, to: 'Pink Series Word Cards' },
    { from: /Kartu gambar berkode merah muda/gi, to: 'Pink Series Picture Cards' },
    { from: /Daftar kata berkode merah muda/gi, to: 'Pink Series Word Lists' },
    { from: /Buklet kata berkode merah muda/gi, to: 'Pink Series Booklets' },
    { from: /Kotak mainan\/objek Blue.*?suku kata tertutup.*?/gi, to: 'Blue Series Object Boxes' },
    { from: /Kotak mainan\/objek Blue/gi, to: 'Blue Series Object Boxes' },
    { from: /Kartu kata berkode warna biru/gi, to: 'Blue Series Word Cards' },
    { from: /Kartu gambar berkode warna biru/gi, to: 'Blue Series Picture Cards' },
    { from: /Buklet kata berkode warna biru/gi, to: 'Blue Series Booklets' },
    { from: /Kartu kata fonogram Green.*?/gi, to: 'Green Series Phonogram Cards' },
    { from: /Laci fonogram hijau/gi, to: 'Green Phonogram Boxes' },
    { from: /Buklet kata fonogram bergambar hijau/gi, to: 'Green Series Picture Booklets' },

    // Grammar Symbols
    { from: /Simbol Noun \(Piramida Hitam\)/gi, to: 'Grammar Symbol: Noun (Black Pyramid)' },
    { from: /Simbol Article \(Segitiga Biru Muda\)/gi, to: 'Grammar Symbol: Article (Light Blue Triangle)' },
    { from: /Simbol Adjective \(Segitiga Biru Tua\)/gi, to: 'Grammar Symbol: Adjective (Dark Blue Triangle)' },
    { from: /Simbol Verb \(Bola Merah\)/gi, to: 'Grammar Symbol: Verb (Red Sphere)' },
    { from: /Simbol Preposisi \(Jembatan Hijau\)/gi, to: 'Grammar Symbol: Preposition (Green Bridge)' },
    { from: /Simbol Adverb \(Lingkaran Oranye Kecil\)/gi, to: 'Grammar Symbol: Adverb (Small Orange Circle)' },
    { from: /Simbol Pronoun \(Segitiga Ungu Besar\)/gi, to: 'Grammar Symbol: Pronoun (Large Purple Triangle)' },
    { from: /Simbol Konjungsi \(Balok Pink\)/gi, to: 'Grammar Symbol: Conjunction (Pink Rectangle)' },
    { from: /Simbol Interjection \(Bunga Emas\)/gi, to: 'Grammar Symbol: Interjection (Gold Keyhole)' },
    { from: /Kotak Kartu Perintah Membaca berwarna merah \(Command Cards\)/gi, to: 'Red Command Cards' },
    { from: /Kotak Kartu Perintah Membaca/gi, to: 'Reading Command Cards' },

    // Word Study
    { from: /Kartu Imbuhan \(Biru\)/gi, to: 'Suffix/Prefix Cards (Blue)' },
    { from: /Kartu Kata Dasar \(Merah\)/gi, to: 'Root Word Cards (Red)' },
    { from: /Kartu Kata Majemuk/gi, to: 'Compound Word Cards' },
    { from: /Puzzle Kata/gi, to: 'Word Puzzles' },
    { from: /Papan Pohon Rumpun Kata/gi, to: 'Word Family Trees' },
    { from: /Kartu Sinonim & Antonim/gi, to: 'Synonym & Antonym Cards' },
    { from: /Kartu Homonim/gi, to: 'Homonym Cards' },
    { from: /Kartu Etimologi \(Warna-warni berdasarkan asal bahasa\)/gi, to: 'Etymology Cards' },

    // Sentence Analysis
    { from: /Papan Analisis Kalimat \(Sentence Analysis Chart\)/gi, to: 'Sentence Analysis Chart' },
    { from: /Papan Analisis Kalimat/gi, to: 'Sentence Analysis Chart' },
    { from: /Lingkaran Subjek \(Hitam Besar\)/gi, to: 'Subject Circle (Large Black)' },
    { from: /Lingkaran Predikat \(Merah\)/gi, to: 'Predicate Circle (Red)' },
    { from: /Lingkaran Objek Langsung \(Hitam Sedang\)/gi, to: 'Direct Object Circle (Medium Black)' },
    { from: /Lingkaran Objek Tidak Langsung \(Abu-abu Sedang\)/gi, to: 'Indirect Object Circle (Medium Grey)' },
    { from: /Panah pertanyaan/gi, to: 'Question Arrows' },

    // Writing & Literature
    { from: /Huruf Raba Cursive/gi, to: 'Sandpaper Letters (Cursive)' },
    { from: /Nampan Garam/gi, to: 'Sand Tray' },
    { from: /Movable Alphabet Box \(Kotak Huruf Kayu\)/gi, to: 'Movable Alphabet' },
    { from: /Papan visual struktur paragraf \(Gagasan Utama \+ Gagasan Penjelas\)/gi, to: 'Paragraph Graphic Organizer' },
    { from: /Papan visual struktur paragraf/gi, to: 'Paragraph Graphic Organizer' },
    { from: /Buku bergaris tiga/gi, to: 'Three-lined Paper' },
    { from: /Buku Antologi Puisi/gi, to: 'Poetry Anthology' },
    { from: /Buku Cerita Rakyat/gi, to: 'Folktale Books' },
    { from: /Kartu skenario peran bersosialisasi \(Roleplay Cards\)/gi, to: 'Roleplay Cards' },
    { from: /Kartu skenario peran bersosialisasi/gi, to: 'Roleplay Cards' }
];

function translateText(text) {
    if (!text) return text;
    let newText = text;
    translationMap.forEach(mapping => {
        newText = newText.replace(mapping.from, mapping.to);
    });
    return newText;
}

async function runTranslation() {
    try {
        console.log("Authenticating...");
        await signInWithEmailAndPassword(auth, "temp_admin@sditbudiluhursamarinda.sch.id", "temp_password_123");
        console.log("Authentication successful.");

        console.log("Fetching 'bahasa' document from Firestore...");
        const docRef = doc(db, 'kurikulum_pusat', 'bahasa');
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            console.error("Document 'bahasa' not found!");
            return;
        }
        
        const data = docSnap.data();
        let changeCount = 0;

        data.subAreas.forEach(sa => {
            sa.levels.forEach(lvl => {
                if (lvl.presentation) {
                    // Translate singular tool string
                    if (lvl.presentation.tool) {
                        const original = lvl.presentation.tool;
                        const translated = translateText(original);
                        if (original !== translated) {
                            lvl.presentation.tool = translated;
                            changeCount++;
                        }
                    }
                    
                    // Translate toolDisplay string
                    if (lvl.presentation.toolDisplay) {
                        const original = lvl.presentation.toolDisplay;
                        const translated = translateText(original);
                        if (original !== translated) {
                            lvl.presentation.toolDisplay = translated;
                            changeCount++;
                        }
                    }
                    
                    // Translate toolsList array
                    if (Array.isArray(lvl.presentation.toolsList)) {
                        lvl.presentation.toolsList = lvl.presentation.toolsList.map(t => {
                            const original = t;
                            const translated = translateText(original);
                            if (original !== translated) {
                                changeCount++;
                            }
                            return translated;
                        });
                    }
                }
            });
        });

        if (changeCount > 0) {
            console.log(`Found ${changeCount} tool terms to translate. Updating Firestore...`);
            await setDoc(docRef, data);
            console.log("Firestore 'bahasa' document successfully updated with English AMI terms!");
        } else {
            console.log("No translatable terms found. It may have already been translated.");
        }
    } catch (error) {
        console.error("Error running script:", error);
    }
    
    process.exit(0);
}

runTranslation();
