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
const outputPath = path.join(__dirname, 'stamp_game_details.txt');

async function run() {
  try {
    const docRef = doc(db, 'kurikulum_pusat', 'matematika');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log("Document not found!");
      return;
    }
    const currentData = docSnap.data();
    const stampSub = currentData.subAreas.find(sa => sa.id === 'math_stamp_game');
    
    if (stampSub) {
      let output = `Sub-Area: ${stampSub.name}\nTotal Levels: ${stampSub.levels.length}\n\n`;
      
      stampSub.levels.forEach((l, i) => {
        output += `================================================================================\n`;
        output += `LEVEL ${i + 1}: ${l.label}\n`;
        output += `Grades: ${JSON.stringify(l.grades)}\n`;
        if (l.presentation) {
          output += `Tool: ${l.presentation.tool || ''}\n`;
          output += `Prerequisites: ${l.presentation.prerequisites || ''}\n`;
          output += `Direct Aim: ${l.presentation.directAim || ''}\n`;
          output += `Indirect Aim: ${l.presentation.indirectAim || ''}\n`;
          output += `Error Control: ${l.presentation.error || ''}\n`;
          output += `Steps:\n`;
          if (l.presentation.steps) {
            l.presentation.steps.forEach((s) => {
              output += `  ${s}\n`;
            });
          }
        }
        output += `================================================================================\n\n`;
      });
      
      fs.writeFileSync(outputPath, output, 'utf8');
      console.log(`Saved live details to ${outputPath}`);
    } else {
      console.log('math_stamp_game not found!');
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
