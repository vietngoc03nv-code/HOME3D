import re, sys

sys.stdout.reconfigure(encoding='utf-8')

pages = ['thiet-ke.html', 'gioi-thieu.html', 'tien-ich.html', 'vi-tri.html', 'index.html']

for page in pages:
    with open(page, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Strip scripts and styles
    clean = re.sub(r'<script.*?</script>', '', html, flags=re.DOTALL)
    clean = re.sub(r'<style.*?</style>', '', clean, flags=re.DOTALL)
    
    # Find text inside tags
    texts = re.findall(r'>([^<]+)<', clean)
    clean_texts = [t.strip() for t in texts if t.strip() and len(t.strip()) > 3]
    
    print(f"=== {page} (Sample text blocks: {len(clean_texts)}) ===")
    for t in clean_texts[:25]:
        print("  -", t)
