const admin = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const sa = require('./serviceAccountKey.json');
const app = admin.initializeApp({ credential: admin.cert(sa) });
const db = getFirestore();

(async () => {
    const doc = await db.collection('kurikulum_pusat').doc('bahasa').get();
    const data = doc.data();
    const cats = data.categories || [];
    
    console.log('=== BAHASA CATEGORIES ===\n');
    cats.forEach((cat, i) => {
        console.log(`\n--- [${i}] ${cat.name} ---`);
        const levels = cat.levels || [];
        levels.forEach((lvl, j) => {
            const label = typeof lvl === 'string' ? lvl : (lvl.label || lvl.title || '?');
            const grades = typeof lvl === 'object' ? (lvl.grades || []) : [];
            const stepsCount = typeof lvl === 'object' ? (lvl.presentation?.steps?.length || 0) : 0;
            const tool = typeof lvl === 'object' ? (lvl.presentation?.tool || '-') : '-';
            console.log(`  [${j}] ${label}`);
            console.log(`      grades: ${JSON.stringify(grades)} | steps: ${stepsCount}`);
            console.log(`      tool: ${tool.substring(0, 80)}`);
        });
    });
    
    process.exit(0);
})();
