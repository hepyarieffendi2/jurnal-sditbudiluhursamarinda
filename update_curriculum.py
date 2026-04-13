import re
import os

file_path = r'd:\Coding AI\jurnal-sditbudiluhursamarinda\src\data\areaSentraCycle2.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

def process_steps(match):
    steps_block = match.group(1)
    # Split by lines and remove empty/whitespace
    raw_lines = [line.strip().strip('"').strip("'").strip(',') for line in steps_block.split('\n') if line.strip()]
    
    new_steps = []
    current_step_num = 1
    
    # Define mapping for headers
    header_map = {
        "I. PERSIAPAN & UNDANGAN:": "I. KEGIATAN AWAL: [Berkesadaran]",
        "II. PROSEDUR INTI (PRESENTASI):": "II. KEGIATAN INTI: [Bermakna] - MEMAHAMI",
        "III. TANTANGAN & LATIHAN MANDIRI:": "III. KEGIATAN INTI: [Bermakna] - MENGAPLIKASIKAN",
        "IV. MERAPIKAN & MENGEMBALIKAN ALAT:": "V. KEGIATAN PENUTUP: [Menyenangkan]"
    }
    
    # Temporary storage for original content excluding headers
    awal_steps = []
    memahami_steps = []
    mengaplikasikan_steps = []
    penutup_steps = []
    
    current_section = None
    
    for line in raw_lines:
        clean_line = line.strip()
        if clean_line in header_map:
            current_section = clean_line
            continue
        
        # Strip lead numeric index like "1. " or "2. "
        content_line = re.sub(r'^\d+\.\s*', '', clean_line)
        
        if current_section == "I. PERSIAPAN & UNDANGAN:":
            awal_steps.append(content_line)
        elif current_section == "II. PROSEDUR INTI (PRESENTASI):":
            memahami_steps.append(content_line)
        elif current_section == "III. TANTANGAN & LATIHAN MANDIRI:":
            mengaplikasikan_steps.append(content_line)
        elif current_section == "IV. MERAPIKAN & MENGEMBALIKAN ALAT:":
            penutup_steps.append(content_line)
        else:
            # Fallback for unexpected lines
            memahami_steps.append(content_line)

    # Build the final array
    final_output = []
    final_output.append(f'"{header_map["I. PERSIAPAN & UNDANGAN:"]}"')
    for s in awal_steps:
        final_output.append(f'"{current_step_num}. {s}"')
        current_step_num += 1
        
    final_output.append(f'"{header_map["II. PROSEDUR INTI (PRESENTASI):"]}"')
    for s in memahami_steps:
        final_output.append(f'"{current_step_num}. {s}"')
        current_step_num += 1
        
    final_output.append(f'"{header_map["III. TANTANGAN & LATIHAN MANDIRI:"]}"')
    for s in mengaplikasikan_steps:
        final_output.append(f'"{current_step_num}. {s}"')
        current_step_num += 1
        
    # Inject the MEREFLEKSIKAN section (taking from the end of Memahami or adding new)
    final_output.append('"IV. KEGIATAN INTI: [Berkesadaran] - MEREFLEKSIKAN"')
    final_output.append(f'"{current_step_num}. Memberikan apresiasi atas usaha, ketelitian, dan kejujuran anak dalam belajar."')
    current_step_num += 1
    final_output.append(f'"{current_step_num}. Mengajak anak bersyukur atas ilmu baru dan kemampuan yang Allah anugerahkan."')
    current_step_num += 1
    final_output.append(f'"{current_step_num}. Menanyakan perasaan anak: \'Bagaimana perasaanmu setelah berhasil menyelesaikan tantangan ini?\'"')
    current_step_num += 1

    final_output.append(f'"{header_map["IV. MERAPIKAN & MENGEMBALIKAN ALAT:"]}"')
    for s in penutup_steps:
        final_output.append(f'"{current_step_num}. {s}"')
        current_step_num += 1
        
    return 'steps: [\n                ' + ',\n                '.join(final_output) + '\n              ]'

# Regex to match steps: [ ... ]
# We use re.DOTALL to match across lines, and non-greedy matching.
new_content = re.sub(r'steps:\s*\[(.*?)\]', process_steps, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Curriculum steps updated successfully.")
