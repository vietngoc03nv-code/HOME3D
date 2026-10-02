import re, os

files = ['index.html', 'gioi-thieu.html', 'tien-ich.html', 'vi-tri.html', 'tour.html']
all_img_refs = {}

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
            content = fp.read()
        pattern = r'(assets/[a-zA-Z0-9_\-\./]+\.(?:jpg|jpeg|png|webp|svg))'
        matches = re.findall(pattern, content)
        all_img_refs[f] = sorted(list(set(matches)))

for f, refs in all_img_refs.items():
    print(f'=== {f} ===')
    for r in refs:
        print(' ', r)
