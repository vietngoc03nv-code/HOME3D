import re

files = ['index.html', 'gioi-thieu.html', 'vi-tri.html', 'tien-ich.html', 'thiet-ke.html', 'thu-vien.html', 'tour.html']

for fn in files:
    with open('D:/Home3D/' + fn, 'r', encoding='utf-8', errors='ignore') as f:
        c = f.read()

    # Find where <link> ends
    head_match = re.search(r'<head>(.*?)</head>', c, flags=re.DOTALL)
    if head_match:
        print(f"=== {fn} HEAD ===")
        links = re.findall(r'<link[^>]+>', head_match.group(1))
        for l in links:
            if 'css' in l:
                print("  ", l)
