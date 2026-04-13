import sys

file_path = r'd:\Coding AI\jurnal-sditbudiluhursamarinda\src\pages\ClassSetup.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    # Match the beginning of the problematic block
    if '{filteredLevels.map((m, idx) => {' in line:
        new_lines.append(line)
        # We'll insert our new logic here and skip the old one
        new_lines.append("                        const label = typeof m === 'object' ? m.label : m;\n")
        new_lines.append("                        const isChecked = shelfItems.includes(label);\n")
        new_lines.append("                        const isMastered = masteredData.has(label);\n")
        new_lines.append("                        const cleanLabel = label.split(': ')[1]?.split(' / ')[0] || label;\n")
        new_lines.append("\n")
        new_lines.append("                        // \ud83e\udde0 INTELLIGENCE: Determine Level & Type\n")
        new_lines.append("                        const isFoundation = idx < 3;\n")
        new_lines.append("                        const isAdvanced = idx > 6;\n")
        new_lines.append("                        const isMissingPre = isChecked && idx > 0 && filteredLevels.slice(0, idx).some(pre => !shelfItems.includes(typeof pre === 'object' ? pre.label : pre));\n")
        new_lines.append("\n")
        new_lines.append("                        return (\n")
        new_lines.append("                          <div key={label} style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>\n")
        new_lines.append("                            {/* Sequence Line Connector */}\n")
        new_lines.append("                            {idx < filteredLevels.length - 1 && (\n")
        new_lines.append("                                <div style={{ \n")
        new_lines.append("                                    position: 'absolute', left: '62px', top: '70px', height: '30px', width: '3px', \n")
        new_lines.append("                                    backgroundColor: isChecked ? activeArea.color : '#E2E8F0', \n")
        new_lines.append("                                    opacity: isChecked ? 0.6 : 0.3, zIndex: 0 \n")
        new_lines.append("                                }}></div>\n")
        new_lines.append("                            )}\n")
        new_lines.append("\n")
        new_lines.append("                            <div \n")
        new_lines.append("                                onClick={() => toggleItemOnShelf(label)} \n")
        new_lines.append("                                style={{ \n")
        new_lines.append("                                    display: 'flex', alignItems: 'center', gap: '20px', padding: '16px 24px', borderRadius: '24px', \n")
        new_lines.append("                                    backgroundColor: 'white', \n")
        new_lines.append("                                    cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', \n")
        new_lines.append("                                    border: '2px solid', \n")
        new_lines.append("                                    borderColor: isChecked ? activeArea.color : '#F1F5F9', \n")
        new_lines.append("                                    boxShadow: isChecked ? `0 12px 30px ${activeArea.color}20` : 'none', \n")
        new_lines.append("                                    transform: isChecked ? 'translateX(10px)' : 'none', \n")
        new_lines.append("                                    position: 'relative', zIndex: 1,\n")
        new_lines.append("                                    marginBottom: '16px'\n")
        new_lines.append("                                }}\n")
        new_lines.append("                            >\n")
        new_lines.append("                              <div style={{ \n")
        new_lines.append("                                  width: '40px', height: '40px', borderRadius: '12px', \n")
        new_lines.append("                                  backgroundColor: isChecked ? activeArea.color : '#F8FAFC', \n")
        new_lines.append("                                  color: isChecked ? 'white' : '#94A3B8', \n")
        new_lines.append("                                  display: 'flex', alignItems: 'center', justifyContent: 'center',\n")
        new_lines.append("                                  fontSize: '0.9rem', fontWeight: 950, border: '1.5px solid',\n")
        new_lines.append("                                  borderColor: isChecked ? 'transparent' : '#E2E8F0'\n")
        new_lines.append("                              }}>\n")
        new_lines.append("                                {idx + 1}\n")
        new_lines.append("                              </div>\n")
        new_lines.append("\n")
        new_lines.append("                              <div style={{ flex: 1 }}>\n")
        new_lines.append("                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>\n")
        new_lines.append("                                    {isFoundation ? (\n")
        new_lines.append("                                        <span style={{ fontSize: '0.6rem', fontWeight: 950, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '6px' }}>PONDASI</span>\n")
        new_lines.append("                                    ) : isAdvanced ? (\n")
        new_lines.append("                                        <span style={{ fontSize: '0.6rem', fontWeight: 950, color: '#7C3AED', background: '#F5F3FF', padding: '2px 8px', borderRadius: '6px' }}>LANJUTAN</span>\n")
        new_lines.append("                                    ) : (\n")
        new_lines.append("                                        <span style={{ fontSize: '0.6rem', fontWeight: 950, color: '#2563EB', background: '#EFF6FF', padding: '2px 8px', borderRadius: '6px' }}>PENGEMBANGAN</span>\n")
        new_lines.append("                                    )}\n")
        new_lines.append("                                    {isMissingPre && (\n")
        new_lines.append("                                        <span style={{ fontSize: '0.6rem', fontWeight: 950, color: '#DC2626', background: '#FEF2F2', padding: '2px 8px', borderRadius: '6px', border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', gap: '4px' }}>\n")
        new_lines.append("                                            <AlertCircle size={10}/> BUTUH PRASYARAT\n")
        new_lines.append("                                        </span>\n")
        new_lines.append("                                    )}\n")
        new_lines.append("                                </div>\n")
        new_lines.append("\n")
        new_lines.append("                                <div style={{ fontSize: '1rem', fontWeight: 900, color: isChecked ? '#0F172A' : '#475569', display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>\n")
        new_lines.append("                                    <span>{(label.split(': ')[1] || label).split(' / ')[0]}</span>\n")
        new_lines.append("                                </div>\n")
        new_lines.append("                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', marginTop: '2px' }}>{label.split(':')[0]}</div>\n")
        new_lines.append("                              </div>\n")
        new_lines.append("\n")
        new_lines.append("                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>\n")
        new_lines.append("                                <button onClick={(e) => { e.stopPropagation(); setShowGuide(typeof m === 'object' ? m : { label }); }} style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '10px', width: '36px', height: '36px', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>\n")
        new_lines.append("                                  <Info size={18} />\n")
        new_lines.append("                                </button>\n")
        new_lines.append("                                <div style={{ \n")
        new_lines.append("                                    width: '32px', height: '32px', borderRadius: '50%', border: '2.5px solid', \n")
        new_lines.append("                                    borderColor: isChecked ? activeArea.color : '#E2E8F0', \n")
        new_lines.append("                                    display: 'flex', alignItems: 'center', justifyContent: 'center', \n")
        new_lines.append("                                    backgroundColor: isChecked ? activeArea.color : 'transparent',\n")
        new_lines.append("                                    transition: 'all 0.3s'\n")
        new_lines.append("                                }}>\n")
        new_lines.append("                                  {isChecked && <CheckCircle2 size={18} color=\"white\" />}\n")
        new_lines.append("                                </div>\n")
        new_lines.append("                              </div>\n")
        new_lines.append("                            </div>\n")
        new_lines.append("                          </div>\n")
        new_lines.append("                        );\n")
        
        skip = True
        continue
    
    if skip and 'idx < filteredLevels.length - 1 &&' in line:
        continue
    if skip and 'marginLeft: \'45px\'' in line:
        continue
    if skip and 'return (' in line:
        continue
    if skip and '});' in lines[i-1] and '}' in line: # End of map
        skip = False
        new_lines.append(line)
        continue

    if not skip:
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Replacement successful")
