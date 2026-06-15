const fs = require('fs');
const backup = JSON.parse(fs.readFileSync('scratch/backup_bahasa_before_restruct.json', 'utf8'));
const grammarSub = backup.subAreas.find(s => s.id === 'lang_grammar');
if (grammarSub) {
  console.log("=== BACKUP GRAMMAR LEVELS ===");
  grammarSub.levels.forEach((l, idx) => console.log(`${idx + 1}. ${l.label}`));
} else {
  console.log("No grammar subarea found in backup!");
}
