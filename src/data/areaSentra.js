/**
 * areaSentra.js — Data observasi Sesi Sentra
 * SINKRON OTOMATIS dari areaSentraCycle2.js (Kurikulum Manager)
 * 
 * Jangan edit file ini langsung — edit areaSentraCycle2.js
 * lalu data di sini akan otomatis mengikuti.
 */

import { AREA_SENTRA_CYCLE2 } from './areaSentraCycle2';

// Re-export langsung dari database kurikulum
export const AREA_SENTRA = AREA_SENTRA_CYCLE2;

// Sentra assessment levels (AMI Elementary 6-9 Standard)
export const CONCENTRATION_LEVELS = ['Exploration', 'Working', 'Deep Focus'];
export const SOCIAL_CONTEXTS = ['Individual', 'Pair', 'Collaborative'];

// Sentra Maturity Progression (P-W-M-N)
export const MATURITY_LEVELS = [
  { v: 'P', l: 'Presented', emoji: '📢' },
  { v: 'W', l: 'Working', emoji: '⚙️' },
  { v: 'M', l: 'Mastered', emoji: '🌟' },
  { v: 'N', l: 'Needs Support', emoji: '🆘' }
];

// Live observation focus indicators (Normalization States)
export const CONCENTRATION_EMOJIS = [
  { emoji: '🌱', label: 'Exploration' },
  { emoji: '⚙️', label: 'Working' },
  { emoji: '🔥', label: 'Deep Focus' },
];
