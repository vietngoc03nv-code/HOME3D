import os, re, sys
sys.stdout.reconfigure(encoding='utf-8')

patterns = [
    r'Newtown[^\s<\"\']*',
    r'Diamond[^\s<\"\']*',
    r'1\.733',
    r'36\s*tầng',
    r'3\s*tòa',
    r'cskh@',
    r'Copyright.*',
    r'An Phú',
    r'Vĩnh Khang',
    r'Vĩnh Lộc',
    r'B-Diamond'
]

pages = ['index.html', 'gioi-thieu.html', 'vi-tri.html', 'tien-ich.html', 'thiet-ke.html']

for p in pages:
    if not os.path.exists(p): continue
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    print(f'=== {p} ===')
    for pat in patterns:
        matches = list(re.finditer(pat, text, re.IGNORECASE))
        # Filter out css/js links from newtowndiamond.vn domain if any
        real_matches = []
        for m in matches:
            start = max(0, m.start() - 30)
            end = min(len(text), m.end() + 30)
            snip = text[start:end].replace('\n', ' ')
            # If it's just a css/js href link, note it separately
            real_matches.append((m, snip))
            
        if real_matches:
            print(f'  Pattern "{pat}" matched {len(real_matches)} times:')
            for m, snip in real_matches[:6]:
                print(f'    ...{snip}...')
