import re, os

files = [
    'index.html',
    'gioi-thieu.html',
    'vi-tri.html',
    'vi-tri-du-an.html',
    'tien-ich.html',
    'thiet-ke.html',
    'thu-vien.html',
    'thu-vien-hinh-anh.html'
]

correct_css_block = '''    <link media="all" type="text/css" rel="stylesheet" href="https://newtowndiamond.vn/assets/css/libs.css">
    <link media="all" type="text/css" rel="stylesheet" href="https://newtowndiamond.vn/assets/css/styles.css">
    <link media="all" type="text/css" rel="stylesheet" href="https://newtowndiamond.vn/assets/css/responsive.css">
    <link media="all" type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
    <link media="all" type="text/css" rel="stylesheet" href="https://newtowndiamond.vn/assets/customs/styles.css">'''

for fn in files:
    fp = os.path.join('D:/Home3D', fn)
    if not os.path.exists(fp):
        continue
    with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Pattern to match the corrupted CSS link block inserted by the user
    # Starts from <link.*href="css/libs.css" up to font_fix.css
    pattern = r'<link media="all" type="text/css" rel="stylesheet" href="css/libs\.css">[\s\S]*?<link media="all" type="text/css" rel="stylesheet" href="css/font_fix\.css">'
    
    if re.search(pattern, content):
        content = re.sub(pattern, correct_css_block, content)
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Restored CSS block in {fn}")
    else:
        print(f"Pattern not found in {fn}, checking manual replacement...")
        # Check if individual broken links exist
        broken_tags = [
            '<link media="all" type="text/css" rel="stylesheet" href="css/libs.css">',
            '<link media="all" type="text/css" rel="stylesheet" href="css/main_styles.css">',
            '<link media="all" type="text/css" rel="stylesheet" href="css/responsive.css">',
            '<link media="all" type="text/css" rel="stylesheet" href="css/customs_styles.css">',
            '<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400;1,600&family=Roboto+Condensed:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">',
            '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">',
            '<link media="all" type="text/css" rel="stylesheet" href="css/font_fix.css">'
        ]
        has_broken = any(b in content for b in broken_tags)
        if has_broken:
            # Replace the entire link block in head
            for b in broken_tags:
                content = content.replace(b + '\n', '').replace(b, '')
            # Insert correct_css_block after <meta property="twitter:description"...> or <meta property="og:image"...>
            insert_point = content.find('</head>')
            if insert_point != -1:
                content = content[:insert_point] + correct_css_block + '\n' + content[insert_point:]
                with open(fp, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Manually restored CSS in {fn}")

# Also restore tour.html (remove font_fix.css)
tour_fp = 'D:/Home3D/tour.html'
if os.path.exists(tour_fp):
    with open(tour_fp, 'r', encoding='utf-8', errors='ignore') as f:
        tour_c = f.read()
    tour_c = tour_c.replace('<link media="all" type="text/css" rel="stylesheet" href="css/font_fix.css">\n', '')
    tour_c = tour_c.replace('<link media="all" type="text/css" rel="stylesheet" href="css/font_fix.css">', '')
    with open(tour_fp, 'w', encoding='utf-8') as f:
        f.write(tour_c)
    print("Restored tour.html")

# Remove broken empty files and screenshot crops
for garbage in ['D:/Home3D/css/fonts.css', 'D:/Home3D/css/reset.css', 'D:/Home3D/bar_crop.png', 'D:/Home3D/btn_crop.png', 'D:/Home3D/header_crop.png']:
    if os.path.exists(garbage):
        os.remove(garbage)
        print(f"Removed {garbage}")

print("RESTORATION COMPLETE!")
