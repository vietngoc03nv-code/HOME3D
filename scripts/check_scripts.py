import re

files = ['index.html', 'gioi-thieu.html', 'vi-tri.html', 'tien-ich.html', 'thiet-ke.html', 'thu-vien.html', 'tour.html']

for fn in files:
    with open('D:/Home3D/' + fn, 'r', encoding='utf-8', errors='ignore') as f:
        c = f.read()
    scripts = re.findall(r'<script[^>]*src="([^"]+)"[^>]*>', c)
    print(f"=== {fn} SCRIPTS ===")
    for s in scripts:
        print("  ", s)
