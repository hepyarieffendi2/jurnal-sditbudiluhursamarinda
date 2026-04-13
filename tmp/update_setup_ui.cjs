const fs = require('fs');
const path = require('path');

const filePath = 'd:/Coding AI/jurnal-sditbudiluhursamarinda/src/pages/ClassSetup.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetRegex = /return\s+\(\s*<div key=\{label\}\s+style=\{\{\s*display:\s*'flex',\s*flexDirection:\s*'column'\s*\}\}>\s*<div onClick=\{[^}]+\}\s+style=\{\{\s*display:\s*'flex',[^}]+\}\}>\s*<div style=\{\{\s*fontSize:\s*'0.8rem',[^}]+\}\}>#\{idx\s+\+\s+1\}<\/div>[\s\S]+?<\/div>\s*\{idx\s+<\s+filteredLevels\.length\s+-\s+1\s+&&\s+<div[^>]+><\/div>\}\s*<\/div>\s*\);/m;

const replacement = `return (
                          <div key={label} style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            {/* Sequence Line Connector */}
                            {idx < filteredLevels.length - 1 && (
                                <div style={{ 
                                    position: 'absolute', left: '62px', top: '70px', height: '30px', width: '3px', 
                                    backgroundColor: isChecked ? activeArea.color : '#E2E8F0', 
                                    opacity: isChecked ? 0.6 : 0.3, zIndex: 0 
                                }}></div>
                            )}

                            <div 
                                onClick={() => toggleItemOnShelf(label)} 
                                style={{ 
                                    display: 'flex', alignItems: 'center', gap: '20px', padding: '16px 24px', borderRadius: '24px', 
                                    backgroundColor: 'white', 
                                    cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                                    border: '2px solid', 
                                    borderColor: isChecked ? activeArea.color : '#F1F5F9', 
                                    boxShadow: isChecked ? \`0 12px 30px \${activeArea.color}20\` : 'none', 
                                    transform: isChecked ? 'translateX(10px)' : 'none',
                                    position: 'relative', zIndex: 1,
                                    marginBottom: '16px'
                                }}
                            >
                              <div style={{ 
                                  width: '40px', height: '40px', borderRadius: '12px', 
                                  backgroundColor: isChecked ? activeArea.color : '#F8FAFC', 
                                  color: isChecked ? 'white' : '#94A3B8', 
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '0.9rem', fontWeight: 950, border: '1.5px solid',
                                  borderColor: isChecked ? 'transparent' : '#E2E8F0'
                              }}>
                                {idx + 1}
                              </div>

                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    {isFoundation ? (
                                        <span style={{ fontSize: '0.6rem', fontWeight: 950, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '6px' }}>PONDASI</span>
                                    ) : isAdvanced ? (
                                        <span style={{ fontSize: '0.6rem', fontWeight: 950, color: '#7C3AED', background: '#F5F3FF', padding: '2px 8px', borderRadius: '6px' }}>LANJUTAN</span>
                                    ) : (
                                        <span style={{ fontSize: '0.6rem', fontWeight: 950, color: '#2563EB', background: '#EFF6FF', padding: '2px 8px', borderRadius: '6px' }}>PENGEMBANGAN</span>
                                    )}
                                    {isMissingPre && (
                                        <span style={{ fontSize: '0.6rem', fontWeight: 950, color: '#DC2626', background: '#FEF2F2', padding: '2px 8px', borderRadius: '6px', border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <AlertCircle size={10}/> BUTUH PRASYARAT
                                        </span>
                                    )}
                                </div>

                                <div style={{ fontSize: '1rem', fontWeight: 900, color: isChecked ? '#0F172A' : '#475569', display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
                                    <span>{(label.split(': ')[1] || label).split(' / ')[0]}</span>
                                </div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', marginTop: '2px' }}>{label.split(':')[0]}</div>
                              </div>

                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <button onClick={(e) => { e.stopPropagation(); setShowGuide(typeof m === 'object' ? m : { label }); }} style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '10px', width: '36px', height: '36px', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                                  <Info size={18} />
                                </button>
                                <div style={{ 
                                    width: '32px', height: '32px', borderRadius: '50%', border: '2.5px solid', 
                                    borderColor: isChecked ? activeArea.color : '#E2E8F0', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    backgroundColor: isChecked ? activeArea.color : 'transparent',
                                    transition: 'all 0.3s'
                                }}>
                                  {isChecked && <CheckCircle2 size={18} color="white" />}
                                </div>
                              </div>
                            </div>
                          </div>
                        );`;

const newContent = content.replace(targetRegex, replacement);

if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Successfully updated ClassSetup.jsx');
} else {
    console.error('Failed to match the target code pattern.');
}
