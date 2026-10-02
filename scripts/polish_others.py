import re

for filename in ['tien-ich.html', 'vi-tri.html']:
    with open(f'D:/Home3D/{filename}', 'r', encoding='utf-8') as f:
        c = f.read()

    # 1. Clean up </undefined> and multiple empty lines
    c = re.sub(r'</undefined>', '', c)
    c = re.sub(r'\n[\t ]*\n[\t ]*\n+', '\n\n', c)

    # 2. Meta og:site_name
    c = re.sub(r'content="NEWTOWN DIAMOND[^"]*"', 'content="LUFFY HOME - Tòa Nhà 9 Tầng Cao Cấp | Nghệ Thuật Sống Cân Bằng Ven Biển Đà Nẵng"', c)

    # 3. Headings
    c = re.sub(r'<p>TRỤC ĐẠI LỘ[\s\n]*KIM CƯƠNG</p>', '<p>TRỤC ĐẠI LỘ VEN BIỂN TRƯỜNG SA</p>', c)
    c = re.sub(r'<p>VỊ TRÍ KIM CƯƠNG</p>', '<p>VỊ TRÍ CHIẾN LƯỢC VEN BIỂN</p>', c)

    with open(f'D:/Home3D/{filename}', 'w', encoding='utf-8') as f:
        f.write(c)

    print(f'Cleaned and polished {filename}!')
