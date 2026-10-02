import re

files = ['index.html', 'gioi-thieu.html', 'tien-ich.html', 'vi-tri.html']

for fn in files:
    with open(fn, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace any https://newtowndiamond.vn/thiet-ke or ./#thiet-ke or thiet-ke.html with thiet-ke
    new_content = re.sub(r'href="https://newtowndiamond\.vn/thiet-ke"', 'href="thiet-ke"', content)
    new_content = re.sub(r'href="\./#thiet-ke"', 'href="thiet-ke"', new_content)
    new_content = re.sub(r'href="thiet-ke\.html"', 'href="thiet-ke"', new_content)

    if new_content != content:
        with open(fn, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated navigation links in {fn}")
    else:
        print(f"No changes needed in {fn}")
