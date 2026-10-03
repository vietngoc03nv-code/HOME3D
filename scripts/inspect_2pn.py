import urllib.request
import re

url = 'https://newtowndiamond.vn/public/360NewTownDaNang/CanHo2PN/indexdata/index.xml'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        xml = resp.read().decode('utf-8', errors='ignore')

    scene_blocks = re.findall(r'<scene name="([^"]+)"[\s\S]*?</scene>', xml)
    for s in scene_blocks:
        name_m = re.search(r'name="([^"]+)"', s)
        name = name_m.group(1) if name_m else 'unknown'
        thumb_m = re.search(r'thumburl="([^"]+)"', s)
        thumb = thumb_m.group(1) if thumb_m else ''
        spots = re.findall(r'<hotspot name="([^"]+)"[\s\S]*?tooltip="([^"]+)"', s)
        print(f"Scene: {name} (Thumb: {thumb}) - Hotspots: {len(spots)}")
        for sp in spots:
            print(f"   -> {sp}")
except Exception as e:
    print('Error:', e)
