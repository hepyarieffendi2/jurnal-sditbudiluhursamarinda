const fs = require('fs');
const path = require('path');
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

function fixQuotes(str) {
  if (typeof str !== 'string') return str;
  
  let newStr = str;
  
  // 1. Replace known apostrophes with curly ones
  const apostrophes = [
    { pattern: /Al-Ma'idah/g, replacement: "Al-Ma’idah" },
    { pattern: /Al-An'am/g, replacement: "Al-An’am" },
    { pattern: /Al-A'raf/g, replacement: "Al-A’raf" },
    { pattern: /Ali 'Imran/g, replacement: "Ali ’Imran" },
    { pattern: /Al-Qur'an/g, replacement: "Al-Qur’an" },
    { pattern: /Qur'an/g, replacement: "Qur’an" },
    { pattern: /Al-Qari'ah/g, replacement: "Al-Qari’ah" },
    { pattern: /Al-Isra'/g, replacement: "Al-Isra’" },
    { pattern: /Isra'/g, replacement: "Isra’" },
    { pattern: /Mi'raj/g, replacement: "Mi’raj" },
    { pattern: /Ka'bah/g, replacement: "Ka’bah" },
    { pattern: /Ar-Ra'd/g, replacement: "Ar-Ra’d" },
    { pattern: /rabbil 'alamin/gi, replacement: "rabbil ’alamin" },
    { pattern: /rabbil 'alamiin/gi, replacement: "rabbil ’alamiin" },
    { pattern: /rabbil 'aalamiin/gi, replacement: "rabbil ’aalamiin" },
    { pattern: /Bird's/g, replacement: "Bird’s" },
    { pattern: /Montessori's/g, replacement: "Montessori’s" },
    { pattern: /child's/g, replacement: "child’s" }
  ];
  
  apostrophes.forEach(r => {
    newStr = newStr.replace(r.pattern, r.replacement);
  });
  
  newStr = newStr.replace(/Al-An am/g, "Al-An’am");
  
  // 2. Replace specific quoted terms with double quotes
  const terms = [
    "1", "2", "10", "345", "0,1", "1.000.000", "Partial Products",
    "ekor", "memakan", "makan-memakan", "ular kebaikan",
    "Addition Control Chart", "Subtraction Control Chart", "Subtraction Table",
    "Multiplication Control Chart", "Division Control Chart", "Multiplication Booklet",
    "Sisa", "4", "8", "16", "12", "lima kuadrat", "lima pangkat dua",
    "lima kubik", "lima pangkat tiga", "The Magic Slide", "Magic Slide",
    "Three Period Lesson", "Equivalence Control Chart", "=",
    "setengah dari sepertiga", "satu setengah", "Stereognostic", "Tracer",
    "Garis Pandu Hitam", "Matahari"
  ];
  
  terms.forEach(t => {
    const regex = new RegExp(`'${t}'`, 'g');
    newStr = newStr.replace(regex, `"${t}"`);
  });
  
  return newStr;
}

function processObject(obj) {
  if (typeof obj === 'string') {
    return fixQuotes(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(item => processObject(item));
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    Object.keys(obj).forEach(key => {
      newObj[key] = processObject(obj[key]);
    });
    return newObj;
  }
  return obj;
}

function findOddQuotes(obj, pathStr = '', oddList = []) {
  if (typeof obj === 'string') {
    const quoteCount = (obj.match(/'/g) || []).length;
    if (quoteCount % 2 !== 0) {
      oddList.push({ path: pathStr, val: obj, count: quoteCount });
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      findOddQuotes(item, `${pathStr}[${idx}]`, oddList);
    });
  } else if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(key => {
      findOddQuotes(obj[key], `${pathStr}.${key}`, oddList);
    });
  }
  return oddList;
}

async function runMigration() {
  try {
    const docRef = doc(db, 'kurikulum_pusat', 'matematika');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log("Error: kurikulum_pusat/matematika document not found.");
      return;
    }
    
    const originalData = docSnap.data();
    
    // Backup original data to a file
    const backupPath = path.join(__dirname, 'backup_matematika_before_quotes_fix.json');
    fs.writeFileSync(backupPath, JSON.stringify(originalData, null, 2), 'utf8');
    console.log(`Successfully created backup at: ${backupPath}`);
    
    // Process and clean quotes
    console.log("Processing and cleaning quotes...");
    const cleanedData = processObject(originalData);
    
    // Validate that no odd quotes remain
    const oddQuotes = findOddQuotes(cleanedData);
    if (oddQuotes.length > 0) {
      console.error(`Validation Failed: Found ${oddQuotes.length} strings with odd single quote count after processing:`);
      oddQuotes.forEach(item => {
        console.error(`- ${item.path}: ${item.val} (Quotes: ${item.count})`);
      });
      console.log("Migration aborted to prevent corruption.");
      return;
    }
    
    console.log("Validation passed! No strings with odd quotes found in the cleaned data.");
    
    // Write back to Firestore
    await setDoc(docRef, cleanedData);
    console.log("Successfully updated kurikulum_pusat/matematika in Firestore!");
    
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

runMigration();
