import re, os, sys
sys.stdout.reconfigure(encoding='utf-8')

pages = ['index.html', 'gioi-thieu.html', 'vi-tri.html', 'tien-ich.html', 'thiet-ke.html']

for p in pages:
    if not os.path.exists(p): continue
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    print(f"\n==================== {p} ====================")
    # Check for Newtown or Diamond in visible text (ignore css/js URLs)
    # Remove script and style tags
    clean = re.sub(r'<script.*?</script>', '', content, flags=re.DOTALL)
    clean = re.sub(r'<style.*?</style>', '', clean, flags=re.DOTALL)
    clean = re.sub(r'href="[^"]*"', '', clean)
    clean = re.sub(r'src="[^"]*"', '', clean)

    matches = re.findall(r'([^<>\n]{0,60}(?:Newtown|Diamond|dolce far|An Phú|Vĩnh Khang|Vĩnh Lộc|tháp|36 tầng|tổ hợp)[^<>\n]{0,60})', clean, re.IGNORECASE)
    print(f"Text matches count: {len(matches)}")
    for m in matches:
        print("  ->", m.strip())
