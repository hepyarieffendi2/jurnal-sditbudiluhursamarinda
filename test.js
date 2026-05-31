import { AREA_SENTRA_CYCLE2 } from './src/data/areaSentraCycle2.js';

console.log('IsArray:', Array.isArray(AREA_SENTRA_CYCLE2));
if (Array.isArray(AREA_SENTRA_CYCLE2)) {
    console.log('Keys of [0]:', Object.keys(AREA_SENTRA_CYCLE2[0]));
    if (AREA_SENTRA_CYCLE2[0].categories) {
        console.log('Has categories. Keys of [0].categories[0]:', Object.keys(AREA_SENTRA_CYCLE2[0].categories[0]));
        if (AREA_SENTRA_CYCLE2[0].categories[0].levels) {
             console.log('Has levels in categories');
        }
    }
}
