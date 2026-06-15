import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { writeFileSync } from 'fs';

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

async function readMath() {
  const snap = await getDocs(collection(db, 'kurikulum_pusat'));
  
  for (const docSnap of snap.docs) {
    if (docSnap.id !== 'matematika') continue;
    const data = docSnap.data();
    
    let output = `=== AREA: ${data.name} ===\n`;
    output += `Doc ID: ${docSnap.id}\n`;
    output += `Total Sub-Areas: ${data.subAreas?.length || 0}\n\n`;
    
    if (data.subAreas) {
      data.subAreas.forEach((sub, i) => {
        output += `\n${'='.repeat(80)}\n`;
        output += `SUB-AREA ${i+1}: [${sub.id}] ${sub.name}\n`;
        output += `Total Levels/Granul: ${sub.levels?.length || 0}\n`;
        output += `${'='.repeat(80)}\n`;
        
        if (sub.levels) {
          sub.levels.forEach((lvl, j) => {
            if (typeof lvl === 'string') {
              output += `  ${j+1}. ${lvl} (string only, no presentation)\n`;
            } else {
              output += `  ${j+1}. ${lvl.label || 'NO LABEL'}`;
              if (lvl.grades) output += ` [Grades: ${lvl.grades.join(', ')}]`;
              output += `\n`;
              if (lvl.presentation) {
                const p = lvl.presentation;
                if (p.tool) output += `      Tool: ${p.tool}\n`;
                if (p.toolDisplay) output += `      ToolDisplay: ${p.toolDisplay}\n`;
                if (p.prerequisites) output += `      Prerequisites: ${p.prerequisites.substring(0, 120)}...\n`;
                if (p.directAim) output += `      DirectAim: ${p.directAim.substring(0, 120)}...\n`;
                if (p.steps) output += `      Steps: ${p.steps.length} langkah\n`;
                if (p.videoUrl) output += `      VideoURL: ${p.videoUrl}\n`;
              } else {
                output += `      (NO PRESENTATION DATA)\n`;
              }
            }
          });
        }
      });
    }
    
    writeFileSync('scratch/math_firestore_output.txt', output, 'utf8');
    console.log('Written to scratch/math_firestore_output.txt');
    
    // Also save the full JSON
    writeFileSync('scratch/math_firestore_full.json', JSON.stringify(data, null, 2), 'utf8');
    console.log('Full JSON written to scratch/math_firestore_full.json');
  }
  
  process.exit(0);
}

readMath().catch(err => { console.error(err); process.exit(1); });
