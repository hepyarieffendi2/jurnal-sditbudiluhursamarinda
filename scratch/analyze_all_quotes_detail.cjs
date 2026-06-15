const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

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

function extractQuotes(obj, pathStr = '') {
  let results = [];
  if (typeof obj === 'string') {
    if (obj.includes("'")) {
      results.push({ path: pathStr, val: obj });
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      results = results.concat(extractQuotes(item, `${pathStr}[${idx}]`));
    });
  } else if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(key => {
      results = results.concat(extractQuotes(obj[key], `${pathStr}.${key}`));
    });
  }
  return results;
}

async function runAnalysis() {
  try {
    const docRef = doc(db, 'kurikulum_pusat', 'matematika');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log("Document not found");
      return;
    }
    const data = docSnap.data();
    const results = extractQuotes(data);
    
    console.log(`Found ${results.length} strings containing single quotes.`);
    fs.writeFileSync(
      path.join(__dirname, 'all_quotes_analysis.json'),
      JSON.stringify(results, null, 2),
      'utf8'
    );
    console.log("Written all results to scratch/all_quotes_analysis.json");
  } catch (err) {
    console.error("Error analyzing:", err);
  }
}

runAnalysis();
