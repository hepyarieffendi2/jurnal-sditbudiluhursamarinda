const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

async function listDocs() {
  try {
    const colRef = collection(db, 'kurikulum_pusat');
    const snapshot = await getDocs(colRef);
    console.log("Documents in 'kurikulum_pusat' collection:");
    snapshot.forEach(doc => {
      console.log(`- ID: ${doc.id}`);
      const data = doc.data();
      console.log(`  Title/Keys: ${Object.keys(data).join(', ')}`);
      if (data.title) console.log(`  Title: ${data.title}`);
      if (data.subAreas) {
        console.log(`  SubAreas count: ${data.subAreas.length}`);
        data.subAreas.forEach(sa => console.log(`    * ${sa.id}: ${sa.title}`));
      }
    });
  } catch (err) {
    console.error("Error listing documents:", err);
  }
}

listDocs();
