import os, re, sys

sys.stdout.reconfigure(encoding='utf-8')

keywords = [
    'newtown', 'new town', 'newtowndiamond', '36 tầng', '36 tang',
    '3 tòa', '3 toa', 'tháp', 'b-diamond', 'vĩnh khang', 'vĩnh lộc',
    'an phú', 'cskh@newtown'
]

html_files = [f for f in os.listdir('D:/Home3D') if f.endswith('.html')]

for f in sorted(html_files):
    fp = os.path.join('D:/Home3D', f)
    with open(fp, 'r', encoding='utf-8', errors='ignore') as fp_in:
        content = fp_in.read()
    
    print(f'=== {f} ===')
    found_any = False
    for kw in keywords:
        matches = list(re.finditer(re.escape(kw), content, re.IGNORECASE))
        if matches:
            found_any = True
            print(f'  Found "{kw}": {len(matches)} times')
            for m in matches[:3]:
                start = max(0, m.start() - 50)
                end = min(len(content), m.end() + 50)
                snip = content[start:end].replace('\n', ' ')
                print(f'    [{m.start()}]: ...{snip}...')
    if not found_any:
        print('  CLEAN! No keywords found.')
