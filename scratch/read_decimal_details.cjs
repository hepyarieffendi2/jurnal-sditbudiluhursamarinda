const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('scratch/math_firestore_full.json', 'utf8'));
  const sub = data.subAreas.find(s => s.id === 'math_decimal_gb');
  
  if (!sub) {
    console.error("sub-area math_decimal_gb not found");
    process.exit(1);
  }
  
  let md = `# Presentation Details for Subarea: ${sub.name}\n\n`;
  
  sub.levels.forEach((lvl, i) => {
    md += `## ${i + 1}. ${lvl.label}\n\n`;
    md += `* **Grades**: ${lvl.grades ? lvl.grades.join(', ') : 'None'}\n`;
    if (lvl.presentation) {
      const p = lvl.presentation;
      md += `* **Tool / APE**: ${p.tool || '-'}\n`;
      md += `* **Prerequisites**: ${p.prerequisites || '-'}\n`;
      md += `* **Direct Aim**: ${p.directAim || '-'}\n`;
      md += `* **Indirect Aim**: ${p.indirectAim || '-'}\n`;
      md += `* **Control of Error**: ${p.error || '-'}\n`;
      md += `* **Video URL**: ${p.videoUrl || '-'}\n\n`;
      md += `### Presentation Steps:\n\n`;
      if (p.steps && p.steps.length > 0) {
        p.steps.forEach(step => {
          md += `* ${step}\n`;
        });
      } else {
        md += `*(No steps)*\n`;
      }
    } else {
      md += `*(No presentation)*\n`;
    }
    md += `\n---\n\n`;
  });
  
  fs.writeFileSync('scratch/decimal_details.md', md, 'utf8');
  console.log("Details written to scratch/decimal_details.md");
} catch (err) {
  console.error(err);
}
