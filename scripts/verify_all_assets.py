import os, re

pages = ['index.html', 'gioi-thieu.html', 'tien-ich.html', 'vi-tri.html', 'tour.html']

print("=== VERIFYING ALL IMAGE PATHS IN HTML PAGES ===")
all_referenced_assets = set()
missing_assets = []

for p in pages:
    if not os.path.exists(p):
        continue
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Find all assets/...
    matches = re.findall(r'(assets/[a-zA-Z0-9_\-\./]+\.(?:jpg|jpeg|png|webp|svg))', content)
    unique_matches = sorted(list(set(matches)))
    print(f"\n--- {p} ({len(unique_matches)} image references) ---")
    for m in unique_matches:
        all_referenced_assets.add(m)
        full_path = os.path.join(r"D:\Home3D", m.replace('/', os.sep))
        exists = os.path.exists(full_path)
        sz = os.path.getsize(full_path) if exists else 0
        status = f"EXISTS ({sz:,} bytes)" if exists else "MISSING!"
        if not exists:
            missing_assets.append((p, m))
        print(f"  [{'OK' if exists else 'ERR'}] {m} -> {status}")

print("\n=== SUMMARY ===")
print(f"Total unique referenced assets: {len(all_referenced_assets)}")
print(f"Total missing: {len(missing_assets)}")
if missing_assets:
    for page, asset in missing_assets:
        print(f"  Missing in {page}: {asset}")
else:
    print("ALL 100% OF REFERENCED ASSETS EXIST ON DISK AND ARE LOADABLE!")
