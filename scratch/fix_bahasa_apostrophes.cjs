const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyAbh1AMSDPXcAlS7hfbo7tlAe14CGfZjuw",
    authDomain: "sditbudiluhursamarinda-cc15a.firebaseapp.com",
    projectId: "sditbudiluhursamarinda-cc15a",
    storageBucket: "sditbudiluhursamarinda-cc15a.firebasestorage.app",
    messagingSenderId: "795444212164",
    appId: "1:795444212164:web:ddf70f43dcb61548df3491",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper to clean up steps quotes
function cleanStepQuotes(step) {
  if (typeof step !== 'string') return step;
  let s = step;

  // 1. Remove stray quote at the end of K1-K3 Cerita Besar 4 step 9
  s = s.replace(/Rasulullah\.',/g, "Rasulullah.");

  // 2. Convert common Arabic terms with straight quotes to curly apostrophe
  s = s.replace(/Ta'awun/g, "Ta’awun");
  s = s.replace(/Jama'ah/g, "Jama’ah");
  s = s.replace(/Nasta'in/g, "Nasta’in");
  s = s.replace(/Ma'rifat/g, "Ma’rifat");
  s = s.replace(/Ta'awudz/g, "Ta’awudz");
  s = s.replace(/Fi'il/g, "Fi’il");
  s = s.replace(/I'tibar/g, "I’tibar");
  s = s.replace(/Al-'Asr/g, "Al-’Asr");
  s = s.replace(/Assalamu'alaikum/g, "Assalamu’alaikum");
  s = s.replace(/Bismillahirrrohmanirrohim/g, "Bismillahirrohmanirrohim");

  // 3. Convert English contractions or word quotes
  s = s.replace(/I'm/g, "I’m");
  s = s.replace(/Let's/g, "Let’s");
  s = s.replace(/Let\\'s/g, "Let’s");
  s = s.replace(/let's/g, "let’s");
  s = s.replace(/don't/g, "don’t");
  s = s.replace(/didn't/g, "didn’t");

  // 4. Convert single-quoted word highlights to curly quotes so they don't break dialogue bubbles
  s = s.replace(/'Bismillah'/g, "“Bismillah”");
  s = s.replace(/'Bismillahirrrohmanirrohim'/g, "“Bismillahirrohmanirrohim”");
  s = s.replace(/'Ya'/g, "“Ya”");
  s = s.replace(/'Tidak'/g, "“Tidak”");
  s = s.replace(/'Why, How, What, Where'/g, "“Why, How, What, Where”");
  s = s.replace(/'ng'/g, "“ng”");
  s = s.replace(/'ny'/g, "“ny”");
  s = s.replace(/'sh'/g, "“sh”");
  s = s.replace(/'ch'/g, "“ch”");
  s = s.replace(/'th'/g, "“th”");
  s = s.replace(/'wh'/g, "“wh”");
  s = s.replace(/'ee'/g, "“ee”");
  s = s.replace(/'ea'/g, "“ea”");
  s = s.replace(/'oa'/g, "“oa”");
  s = s.replace(/'ai'/g, "“ai”");
  s = s.replace(/'Pisang'/g, "“Pisang”");
  s = s.replace(/'Massa'/g, "“Massa”");
  s = s.replace(/'Masa'/g, "“Masa”");
  s = s.replace(/'and'/g, "“and”");
  s = s.replace(/'karena'/g, "“karena”");
  s = s.replace(/'a cat'/g, "“a cat”");
  s = s.replace(/'the sun'/g, "“the sun”");
  s = s.replace(/'The small cat'/g, "“The small cat”");
  s = s.replace(/'The red book'/g, "“The red book”");
  s = s.replace(/'the solid table'/g, "“the solid table”");
  s = s.replace(/'Dia\/He'/g, "“Dia/He”");
  s = s.replace(/'AND', 'OR', 'BUT'/g, "“AND”, “OR”, “BUT”");
  s = s.replace(/'APA\?'/g, "“APA?”");
  s = s.replace(/'Ibu memasak\.\.\. \(Anak bingung: Masak apa\?\)'/g, "“Ibu memasak... (Anak bingung: Masak apa?)”");
  s = s.replace(/Cari huruf 'b'/g, "Cari huruf “b”");
  s = s.replace(/Cari huruf 'u'/g, "Cari huruf “u”");
  s = s.replace(/di samping 'b'/g, "di samping “b”");
  
  return s;
}

async function fixBahasaQuotes() {
  try {
    const docRef = doc(db, 'kurikulum_pusat', 'bahasa');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log("bahasa document not found!");
      return;
    }
    
    const data = docSnap.data();
    const updatedData = JSON.parse(JSON.stringify(data));
    
    updatedData.subAreas = updatedData.subAreas.map(sa => {
      if (sa.levels) {
        sa.levels = sa.levels.map(l => {
          if (l.presentation && l.presentation.steps) {
            l.presentation.steps = l.presentation.steps.map(step => cleanStepQuotes(step));
          }
          return l;
        });
      }
      return sa;
    });
    
    await setDoc(docRef, updatedData);
    console.log("Successfully cleaned and updated all single quotes in Firestore!");
  } catch (err) {
    console.error("Failed to update Firestore directly:", err);
  }
}

fixBahasaQuotes();
