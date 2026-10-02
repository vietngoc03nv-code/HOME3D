import re

files = ['index.html', 'gioi-thieu.html', 'vi-tri.html', 'tien-ich.html', 'thiet-ke.html', 'thu-vien.html', 'tour.html']

for f in files:
    with open('D:/Home3D/' + f, 'r', encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    
    # Check link hrefs
    css_links = re.findall(r'<link[^>]+rel=[\"\']stylesheet[\"\'][^>]*>', c)
    print(f"=== {f} ===")
    for cl in css_links:
        print("  ", cl)
