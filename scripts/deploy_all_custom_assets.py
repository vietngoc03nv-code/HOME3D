import os, shutil
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter

ART_DIR = r"C:\Users\DELL\.gemini\antigravity\brain\c16e9157-dce1-40f0-9733-2e3277f7e203"
ASSETS_DIR = r"D:\Home3D\assets"
RENDER_DIR = r"D:\Home3D\render_test"

# Paths to newly generated custom assets
HERO_9STORY = os.path.join(ART_DIR, "luffy_9story_hero_1790970028407.jpg")
BEACH_POOL = os.path.join(ART_DIR, "beach_resort_pool_1790972569446.jpg")
GOLF_COAST = os.path.join(ART_DIR, "golf_course_coastal_1790972553262.jpg")
BEACH_CLUB = os.path.join(ART_DIR, "luxury_beach_club_1790972807344.jpg")
BALLROOM = os.path.join(ART_DIR, "grand_ballroom_luxury_1790972820245.jpg")
GARDEN = os.path.join(ART_DIR, "tropical_residence_garden_1790972836613.jpg")
GYM_SPA = os.path.join(ART_DIR, "luxury_gym_spa_wellness_1790972862332.jpg")
AIRPORT = os.path.join(ART_DIR, "danang_airport_dusk_1790972692617.jpg")
UNIVERSITY = os.path.join(ART_DIR, "danang_university_campus_1790972603648.jpg")
EAST_SEA = os.path.join(ART_DIR, "east_sea_park_danang_1790972644181.jpg")
HOI_AN = os.path.join(ART_DIR, "hoi_an_ancient_town_1790972666049.jpg")
MARBLE_MTN = os.path.join(ART_DIR, "marble_mountains_danang_1790972586281.jpg")
MY_KHE = os.path.join(ART_DIR, "my_khe_beach_danang_1790972621514.jpg")

# 3D interior renders of LUFFY HOME
LIVING_ROOM = os.path.join(RENDER_DIR, "living_room_0.jpg")
MASTER_BED = os.path.join(RENDER_DIR, "master_bedroom_0.jpg")
BALCONY = os.path.join(RENDER_DIR, "balcony_0.jpg")
DINING = os.path.join(RENDER_DIR, "dining_0.jpg")
KITCHEN = os.path.join(RENDER_DIR, "kitchen_0.jpg")

def create_architectural_floorplan(output_path, width=1055, height=682, title="MẶT BẰNG CĂN HỘ CAO CẤP - LUFFY HOME"):
    # Luxury dark blueprint aesthetic
    img = Image.new('RGBA', (width, height), (15, 23, 42, 255))
    draw = ImageDraw.Draw(img)

    # Grid
    for x in range(0, width, 40):
        draw.line([(x, 0), (x, height)], fill=(30, 41, 59, 120), width=1)
    for y in range(0, height, 40):
        draw.line([(0, y), (width, y)], fill=(30, 41, 59, 120), width=1)

    try:
        font_t = ImageFont.truetype("arialbd.ttf", 26)
        font_m = ImageFont.truetype("arialbd.ttf", 18)
        font_s = ImageFont.truetype("arial.ttf", 14)
    except:
        font_t = font_m = font_s = ImageFont.load_default()

    # Outer wall bounds
    ox, oy, ow, oh = 120, 80, 820, 520
    draw.rectangle([ox, oy, ox + ow, oy + oh], fill=(30, 41, 59, 180), outline=(212, 175, 55, 255), width=4)

    # Rooms layout
    # 1. Balcony (Right side)
    bx, by, bw, bh = ox + ow - 160, oy, 160, oh
    draw.rectangle([bx, by, bx + bw, by + bh], fill=(22, 101, 52, 90), outline=(212, 175, 55, 200), width=2)
    draw.text((bx + 30, by + bh//2 - 20), "BAN CÔNG", fill=(253, 230, 138, 255), font=font_m)
    draw.text((bx + 40, by + bh//2 + 5), "VIEW BIỂN", fill=(148, 163, 184, 220), font=font_s)
    draw.text((bx + 45, by + bh//2 + 25), "12.5 m²", fill=(212, 175, 55, 255), font=font_s)

    # 2. Living Room (Center Right)
    lx, ly, lw, lh = ox + 360, oy, 300, 320
    draw.rectangle([lx, ly, lx + lw, ly + lh], fill=(15, 23, 42, 200), outline=(212, 175, 55, 200), width=2)
    draw.text((lx + 65, ly + 110), "PHÒNG KHÁCH", fill=(255, 255, 255, 255), font=font_m)
    draw.text((lx + 90, ly + 140), "SANG TRỌNG", fill=(148, 163, 184, 220), font=font_s)
    draw.text((lx + 105, ly + 165), "28.6 m²", fill=(212, 175, 55, 255), font=font_s)

    # 3. Dining & Kitchen (Center Bottom)
    kx, ky, kw, kh = ox + 360, oy + 320, 300, 200
    draw.rectangle([kx, ky, kx + kw, ky + kh], fill=(15, 23, 42, 200), outline=(212, 175, 55, 200), width=2)
    draw.text((kx + 75, ky + 70), "BẾP & BÀN ĂN", fill=(255, 255, 255, 255), font=font_m)
    draw.text((kx + 110, ky + 100), "18.2 m²", fill=(212, 175, 55, 255), font=font_s)

    # 4. Master Bedroom (Top Left)
    mx, my, mw, mh = ox, oy, 360, 270
    draw.rectangle([mx, my, mx + mw, my + mh], fill=(30, 58, 138, 70), outline=(212, 175, 55, 200), width=2)
    draw.text((mx + 90, my + 95), "PHÒNG NGỦ MASTER", fill=(255, 255, 255, 255), font=font_m)
    draw.text((mx + 130, my + 125), "ENSUITE", fill=(148, 163, 184, 220), font=font_s)
    draw.text((mx + 135, my + 150), "24.5 m²", fill=(212, 175, 55, 255), font=font_s)

    # 5. Bedroom 2 (Bottom Left)
    b2x, b2y, b2w, b2h = ox, oy + 270, 240, 250
    draw.rectangle([b2x, b2y, b2x + b2w, b2y + b2h], fill=(30, 58, 138, 70), outline=(212, 175, 55, 200), width=2)
    draw.text((b2x + 45, b2y + 95), "PHÒNG NGỦ 2", fill=(255, 255, 255, 255), font=font_m)
    draw.text((b2x + 85, b2y + 125), "16.8 m²", fill=(212, 175, 55, 255), font=font_s)

    # 6. Bathrooms (Between Bed 2 and Kitchen)
    wc_x, wc_y, wc_w, wc_h = ox + 240, oy + 270, 120, 250
    draw.rectangle([wc_x, wc_y, wc_x + wc_w, wc_y + wc_h], fill=(15, 23, 42, 220), outline=(212, 175, 55, 200), width=2)
    draw.text((wc_x + 28, wc_y + 105), "2 WC", fill=(255, 255, 255, 255), font=font_m)
    draw.text((wc_x + 30, wc_y + 135), "8.4 m²", fill=(212, 175, 55, 255), font=font_s)

    # Header Card
    draw.rounded_rectangle([ox, 20, ox + 600, 65], radius=6, fill=(15, 23, 42, 240), outline=(212, 175, 55, 220), width=1)
    draw.text((ox + 20, 28), title, fill=(245, 158, 11, 255), font=font_t)

    # Dimension marks & Total Area Badge
    draw.rounded_rectangle([width - 240, 20, width - 40, 65], radius=6, fill=(245, 158, 11, 240))
    draw.text((width - 220, 30), "TỔNG DIỆN TÍCH: 108 m²", fill=(15, 23, 42, 255), font=font_m)

    img = img.convert('RGB')
    img.save(output_path, quality=95)
    print(f"Created floorplan at {output_path}")

def create_building_elevation(output_path, width=1254, height=850):
    # Architectural 9-story facade elevation schematic
    img = Image.new('RGBA', (width, height), (15, 23, 42, 255))
    draw = ImageDraw.Draw(img)

    for x in range(0, width, 40):
        draw.line([(x, 0), (x, height)], fill=(30, 41, 59, 100), width=1)
    for y in range(0, height, 40):
        draw.line([(0, y), (width, y)], fill=(30, 41, 59, 100), width=1)

    try:
        font_t = ImageFont.truetype("arialbd.ttf", 32)
        font_m = ImageFont.truetype("arialbd.ttf", 18)
        font_s = ImageFont.truetype("arial.ttf", 14)
    except:
        font_t = font_m = font_s = ImageFont.load_default()

    # Title
    draw.text((80, 40), "SƠ ĐỒ PHÂN BỔ TẦNG • TÒA NHÀ 9 TẦNG LUFFY HOME", fill=(245, 158, 11, 255), font=font_t)
    draw.text((80, 85), "TIÊU CHUẨN CĂN HỘ NGHỈ DƯỠNG & KHÁCH SẠN 5 SAO QUỐC TẾ", fill=(148, 163, 184, 220), font=font_s)

    # 9 floors tower graphic
    tower_x = 200
    tower_w = 680
    ground_y = height - 100
    floor_h = 60

    floors = [
        ("TẦNG 9", "Hồ Bơi Vô Cực Chân Mây & Sky Bar Lounge Ngắm Biển", (245, 158, 11)),
        ("TẦNG 8", "Penthouse Duplex Hoàng Gia • View Toàn Cảnh", (217, 119, 6)),
        ("TẦNG 7", "Căn Hộ 3 Phòng Ngủ Panorama Ocean View", (59, 130, 246)),
        ("TẦNG 6", "Căn Hộ 2 Phòng Ngủ Cao Cấp • Full Nội Thất", (37, 99, 235)),
        ("TẦNG 5", "Căn Hộ 2 Phòng Ngủ Tiêu Chuẩn Nghỉ Dưỡng", (29, 78, 216)),
        ("TẦNG 4", "Căn Hộ 2 Phòng Ngủ Tiêu Chuẩn Nghỉ Dưỡng", (29, 78, 216)),
        ("TẦNG 3", "Căn Hộ Studio Deluxe Ban Công Thoáng Đãng", (14, 165, 233)),
        ("TẦNG 2", "Căn Hộ Studio Deluxe Ban Công Thoáng Đãng", (14, 165, 233)),
        ("TẦNG 1", "Grand Lobby 5 Sao, Trung Tâm Thể Thao & Café Lounge", (16, 185, 129)),
    ]

    for i, (fname, fdesc, color) in enumerate(floors):
        fy = ground_y - (9 - i) * floor_h
        # Floor block
        draw.rectangle([tower_x, fy, tower_x + tower_w, fy + floor_h - 6], fill=(30, 41, 59, 220), outline=color, width=2)
        # Floor badge
        draw.rounded_rectangle([tower_x + 12, fy + 8, tower_x + 120, fy + floor_h - 14], radius=6, fill=color)
        draw.text((tower_x + 24, fy + 14), fname, fill=(15, 23, 42, 255), font=font_m)
        # Floor description
        draw.text((tower_x + 140, fy + 16), fdesc, fill=(248, 250, 252, 255), font=font_m)

    # Basement block
    by = ground_y + 8
    draw.rectangle([tower_x - 30, by, tower_x + tower_w + 30, by + 50], fill=(51, 65, 85, 240), outline=(100, 116, 139, 255), width=2)
    draw.text((tower_x + 160, by + 14), "TẦNG HẦM: BÃI ĐỖ XE THÔNG MINH & HỆ THỐNG KỸ THUẬT", fill=(203, 213, 225, 255), font=font_m)

    img = img.convert('RGB')
    img.save(output_path, quality=95)
    print(f"Created building elevation at {output_path}")

def create_inspiration_facade(output_path, width=714, height=824):
    # Crop and frame the 9-story luxury building hero render
    hero_im = Image.open(HERO_9STORY)
    # Target aspect ratio 714:824 (vertical/portrait)
    # Crop central tower from hero_im
    hw, hh = hero_im.size
    crop_w = int(hh * (width / height))
    left = (hw - crop_w) // 2
    cropped = hero_im.crop((left, 0, left + crop_w, hh))
    resized = cropped.resize((width, height), Image.Resampling.LANCZOS)
    
    # Enhance contrast and luxury saturation
    resized = ImageEnhance.Contrast(resized).enhance(1.1)
    resized = ImageEnhance.Color(resized).enhance(1.15)
    resized.save(output_path, quality=95)
    print(f"Created inspiration facade at {output_path}")

def create_video_preview(output_path):
    # Living room with luxury play button overlay
    base = Image.open(LIVING_ROOM)
    draw = ImageDraw.Draw(base)
    cx, cy = base.width // 2, base.height // 2
    
    # Play circle
    draw.ellipse([cx - 55, cy - 55, cx + 55, cy + 55], fill=(245, 158, 11, 220), outline=(255, 255, 255, 255), width=4)
    # Play triangle
    draw.polygon([(cx - 15, cy - 25), (cx + 25, cy), (cx - 15, cy + 25)], fill=(15, 23, 42, 255))
    
    # Text badge at bottom
    try:
        font = ImageFont.truetype("arialbd.ttf", 36)
    except:
        font = ImageFont.load_default()
    draw.rounded_rectangle([cx - 240, base.height - 120, cx + 240, base.height - 50], radius=10, fill=(15, 23, 42, 230), outline=(212, 175, 55, 220), width=2)
    draw.text((cx - 190, base.height - 105), "VIRTUAL TOUR 360 & 3D", fill=(255, 255, 255, 255), font=font)
    
    base.save(output_path, quality=95)
    print(f"Created video preview at {output_path}")

def create_news_luffy(output_path):
    # News graphic for LUFFY HOME
    base = Image.open(HERO_9STORY).resize((677, 372), Image.Resampling.LANCZOS)
    draw = ImageDraw.Draw(base)
    # Bottom banner
    draw.rectangle([0, 372 - 70, 677, 372], fill=(15, 23, 42, 220))
    try:
        font = ImageFont.truetype("arialbd.ttf", 18)
    except:
        font = ImageFont.load_default()
    draw.text((20, 372 - 50), "LUFFY HOME • CƠ HỘI SỞ HỮU & ĐẦU TƯ SINH LỜI VÀNG", fill=(245, 158, 11, 255), font=font)
    base.save(output_path, quality=95)
    print(f"Created news graphic at {output_path}")

def deploy_all_assets():
    # 1. Create custom vector/render assets first
    create_architectural_floorplan(os.path.join(ASSETS_DIR, "trang-chu", "design-1.png"))
    create_architectural_floorplan(os.path.join(ASSETS_DIR, "gioi-thieu", "design-1.png"))
    
    create_building_elevation(os.path.join(ASSETS_DIR, "trang-chu", "ds-3.png"))
    create_building_elevation(os.path.join(ASSETS_DIR, "gioi-thieu", "ds-3.png"))
    
    create_inspiration_facade(os.path.join(ASSETS_DIR, "trang-chu", "inspiration-1.png"))
    create_inspiration_facade(os.path.join(ASSETS_DIR, "gioi-thieu", "inspiration-1.png"))
    
    create_video_preview(os.path.join(ASSETS_DIR, "gioi-thieu", "about_video.jpg"))
    create_news_luffy(os.path.join(ASSETS_DIR, "trang-chu", "news_luffy_1.png"))
    
    # 2. Deploy trang-chu assets
    tc = os.path.join(ASSETS_DIR, "trang-chu")
    shutil.copyfile(HERO_9STORY, os.path.join(tc, "banner_hero_9story.jpg"))
    shutil.copyfile(GARDEN, os.path.join(tc, "canh-quan-xanh.jpg"))
    shutil.copyfile(GYM_SPA, os.path.join(tc, "suc-khoe.jpg"))
    shutil.copyfile(BEACH_CLUB, os.path.join(tc, "am-thuc.jpg"))
    shutil.copyfile(UNIVERSITY, os.path.join(tc, "giao-duc.jpg"))
    shutil.copyfile(BALLROOM, os.path.join(tc, "amenity_2.jpg"))
    shutil.copyfile(BEACH_POOL, os.path.join(tc, "amenity_1.jpg"))
    shutil.copyfile(BEACH_POOL, os.path.join(tc, "pool.jpg"))
    shutil.copyfile(LIVING_ROOM, os.path.join(tc, "interior_1.jpg"))
    shutil.copyfile(BALCONY, os.path.join(tc, "diamond-2.png"))
    shutil.copyfile(MASTER_BED, os.path.join(tc, "news_can_3pn.jpg"))
    shutil.copyfile(MY_KHE, os.path.join(tc, "image-4.jpeg"))
    shutil.copyfile(BALLROOM, os.path.join(tc, "tang1_image10.jpg"))
    shutil.copyfile(GYM_SPA, os.path.join(tc, "tang1_image18.jpg"))
    shutil.copyfile(BALCONY, os.path.join(tc, "bg_art_2.png"))
    shutil.copyfile(BALCONY, os.path.join(tc, "bg_art_3.png"))

    # 3. Deploy gioi-thieu assets
    gt = os.path.join(ASSETS_DIR, "gioi-thieu")
    shutil.copyfile(HERO_9STORY, os.path.join(gt, "banner_gioi_thieu.jpg"))
    shutil.copyfile(BEACH_POOL, os.path.join(gt, "about_zone_bg.jpg"))
    shutil.copyfile(BALLROOM, os.path.join(gt, "tang1_image10.jpg"))
    shutil.copyfile(GYM_SPA, os.path.join(gt, "tang1_image18.jpg"))

    # 4. Deploy tien-ich assets
    ti = os.path.join(ASSETS_DIR, "tien-ich")
    shutil.copyfile(HERO_9STORY, os.path.join(ti, "banner_hero_9story.jpg"))
    shutil.copyfile(BEACH_POOL, os.path.join(ti, "banner_tien_ich.jpg"))
    shutil.copyfile(BEACH_CLUB, os.path.join(ti, "la-plage.jpg"))
    shutil.copyfile(BALLROOM, os.path.join(ti, "grand-ballroom.jpg"))
    shutil.copyfile(BEACH_POOL, os.path.join(ti, "resort-overview.jpg"))
    shutil.copyfile(BEACH_POOL, os.path.join(ti, "infinity-pool.jpg"))
    shutil.copyfile(GOLF_COAST, os.path.join(ti, "golf-nicklaus-2.jpg"))
    shutil.copyfile(GOLF_COAST, os.path.join(ti, "golf-nicklaus-52.jpg"))
    shutil.copyfile(GOLF_COAST, os.path.join(ti, "golf-norman-16.jpg"))
    shutil.copyfile(GOLF_COAST, os.path.join(ti, "golf-norman-18.jpg"))
    shutil.copyfile(GARDEN, os.path.join(ti, "canh-quan-xanh.jpg"))
    shutil.copyfile(GYM_SPA, os.path.join(ti, "suc-khoe.jpg"))
    shutil.copyfile(BEACH_CLUB, os.path.join(ti, "am-thuc.jpg"))
    shutil.copyfile(UNIVERSITY, os.path.join(ti, "giao-duc.jpg"))
    shutil.copyfile(BEACH_POOL, os.path.join(ti, "amenity_1.jpg"))
    shutil.copyfile(BALLROOM, os.path.join(ti, "amenity_2.jpg"))
    shutil.copyfile(LIVING_ROOM, os.path.join(ti, "interior_1.jpg"))

    # 5. Deploy vi-tri remaining assets
    vt = os.path.join(ASSETS_DIR, "vi-tri")
    shutil.copyfile(HERO_9STORY, os.path.join(vt, "banner_vi_tri.jpg"))
    shutil.copyfile(LIVING_ROOM, os.path.join(vt, "interior_1.jpg"))
    shutil.copyfile(BEACH_POOL, os.path.join(vt, "pool.jpg"))
    shutil.copyfile(BEACH_CLUB, os.path.join(vt, "amenity_1.jpg"))

    print("ALL ASSETS DEPLOYED SUCCESSFULLY ACROSS ALL DIRECTORIES!")

if __name__ == "__main__":
    deploy_all_assets()
