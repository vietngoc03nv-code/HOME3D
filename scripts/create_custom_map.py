import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_luffy_map(output_path, width=1810, height=1204):
    # Create high-res canvas
    # Using a refined luxury navy / dark cyan / champagne theme
    img = Image.new('RGBA', (width, height), (15, 23, 42, 255)) # Dark slate navy
    draw = ImageDraw.Draw(img)

    # 1. Subtle grid background pattern
    grid_size = 60
    for x in range(0, width, grid_size):
        draw.line([(x, 0), (x, height)], fill=(30, 41, 59, 100), width=1)
    for y in range(0, height, grid_size):
        draw.line([(0, y), (width, y)], fill=(30, 41, 59, 100), width=1)

    # 2. Draw Ocean (East Sea / Biển Đông) on the East side
    # Coastline runs from top-right to bottom-right
    coastline_x = []
    for y in range(height + 1):
        # Organic curved coastline
        # Starts around x=1150 at top, bulges to 1250, curves to 1180, down to 1300 at bottom
        curve = math.sin(y / 250.0) * 45 + math.cos(y / 450.0) * 35
        base_x = 1200 + (y / height) * 60 + curve
        coastline_x.append(base_x)

    # Ocean polygon
    ocean_poly = [(width, 0)]
    for y in range(0, height + 1, 10):
        ocean_poly.append((coastline_x[y], y))
    ocean_poly.append((width, height))
    
    # Fill ocean with deep luxury oceanic gradient
    ocean_img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    ocean_draw = ImageDraw.Draw(ocean_img)
    ocean_draw.polygon(ocean_poly, fill=(12, 74, 96, 255)) # Deep teal ocean
    
    # Water ripples/depth lines
    for offset in [40, 100, 180, 300, 450]:
        ripple_poly = []
        for y in range(0, height + 1, 15):
            bx = coastline_x[y] + offset + math.sin((y + offset) / 60.0) * 12
            if bx < width:
                ripple_poly.append((bx, y))
        if len(ripple_poly) > 1:
            ocean_draw.line(ripple_poly, fill=(20, 110, 140, 90), width=2)

    img = Image.alpha_composite(img, ocean_img)
    draw = ImageDraw.Draw(img)

    # Sand beach strip along coastline
    beach_strip = []
    for y in range(0, height + 1, 8):
        beach_strip.append((coastline_x[y] - 8, y))
    for y in range(height, -1, -8):
        beach_strip.append((coastline_x[y] + 8, y))
    draw.polygon(beach_strip, fill=(194, 155, 96, 180)) # Golden sand tone

    # 3. Draw Sông Cổ Cò (meandering river parallel to coast)
    river_pts = []
    for y in range(0, height + 1, 10):
        rx = 980 + math.sin(y / 180.0) * 55 + math.cos(y / 320.0) * 40 + (y / height) * 80
        river_pts.append((rx, y))
    draw.line(river_pts, fill=(18, 55, 84, 255), width=24) # River base
    draw.line(river_pts, fill=(35, 95, 135, 230), width=16) # River inner water

    # Draw Han River & Da Nang Bay branch at north
    han_pts = [
        (450, 0), (520, 100), (600, 180), (660, 240), (740, 310), (820, 380), (950, 440)
    ]
    draw.line(han_pts, fill=(28, 78, 112, 240), width=20)

    # 4. Major Road Arteries
    # Arterial 1: Võ Nguyên Giáp - Trường Sa (Coastal Boulevard)
    ts_road = []
    for y in range(0, height + 1, 10):
        road_x = coastline_x[y] - 110 + math.sin(y / 280.0) * 15
        ts_road.append((road_x, y))
    # Road glow
    draw.line(ts_road, fill=(212, 175, 55, 60), width=18)
    draw.line(ts_road, fill=(245, 158, 11, 230), width=8) # Gold road
    draw.line(ts_road, fill=(255, 255, 255, 220), width=2) # Road center line

    # Arterial 2: Lê Văn Hiến - Trần Đại Nghĩa (DT607)
    dt_road = []
    for y in range(0, height + 1, 10):
        dt_x = 760 + math.sin(y / 240.0) * 20 + (y / height) * 60
        dt_road.append((dt_x, y))
    draw.line(dt_road, fill=(100, 116, 139, 180), width=8)
    draw.line(dt_road, fill=(203, 213, 225, 200), width=2)

    # Arterial 3: Nam Kỳ Khởi Nghĩa / Vành Đai Phía Nam (connecting DT607 to Trường Sa)
    conn_road1 = [(600, 680), (780, 690), (980, 700), (ts_road[70][0], 700)]
    draw.line(conn_road1, fill=(148, 163, 184, 200), width=6)
    
    # Arterial 4: Đường Võ Chí Công / Cầu Cổ Cò
    conn_road2 = [(500, 480), (700, 490), (880, 500), (ts_road[50][0], 510)]
    draw.line(conn_road2, fill=(148, 163, 184, 200), width=6)

    # Arterial 5: Đường An Dương Vương / Cầu Tiên Sơn
    conn_road3 = [(400, 260), (620, 270), (780, 280), (ts_road[28][0], 290)]
    draw.line(conn_road3, fill=(148, 163, 184, 200), width=6)

    # 5. Golf Courses & Green Zones (Parks / Nature)
    # Legend Danang Golf Course & BRG / Montgomerie
    golf_pts = [(ts_road[66][0] - 120, 630), (ts_road[66][0] + 50, 640), 
                (ts_road[80][0] + 60, 790), (ts_road[80][0] - 130, 770)]
    draw.polygon(golf_pts, fill=(22, 101, 52, 120), outline=(34, 197, 94, 180), width=2)
    
    # Marble Mountains (Ngũ Hành Sơn) natural zone
    nhs_pts = [(780, 410), (870, 390), (910, 450), (840, 480)]
    draw.polygon(nhs_pts, fill=(51, 65, 85, 200), outline=(148, 163, 184, 220), width=2)

    # Fonts
    try:
        font_xl = ImageFont.truetype("arialbd.ttf", 36)
        font_lg = ImageFont.truetype("arialbd.ttf", 26)
        font_md = ImageFont.truetype("arialbd.ttf", 20)
        font_sm = ImageFont.truetype("arial.ttf", 16)
        font_badge = ImageFont.truetype("arialbd.ttf", 15)
        font_title = ImageFont.truetype("arialbd.ttf", 46)
        font_sub = ImageFont.truetype("arial.ttf", 22)
    except:
        font_xl = font_lg = font_md = font_sm = font_badge = font_title = font_sub = ImageFont.load_default()

    # 6. Water Body Labels
    draw.text((1400, 450), "BIỂN ĐÔNG", fill=(78, 186, 219, 190), font=font_xl)
    draw.text((1370, 500), "DA NANG EAST SEA", fill=(56, 140, 168, 160), font=font_md)
    
    draw.text((1020, 220), "Sông Cổ Cò", fill=(96, 165, 250, 200), font=font_sm)
    draw.text((ts_road[18][0] + 30, 170), "BÃI BIỂN MỸ KHÊ", fill=(253, 230, 138, 220), font=font_lg)
    draw.text((ts_road[55][0] + 30, 540), "BÃI BIỂN NON NƯỚC", fill=(253, 230, 138, 200), font=font_md)

    # 7. Road Labels (angled / along roads)
    draw.text((ts_road[40][0] - 180, 380), "ĐƯỜNG TRƯỜNG SA", fill=(251, 191, 36, 255), font=font_md)
    draw.text((ts_road[95][0] - 180, 930), "ĐƯỜNG TRƯỜNG SA", fill=(251, 191, 36, 255), font=font_md)
    draw.text((790, 850), "ĐƯỜNG TRẦN ĐẠI NGHĨA", fill=(148, 163, 184, 220), font=font_sm)

    # 8. Landmark Badges helper
    def draw_landmark_badge(x, y, title, subtitle="", time_str="5 Phút", is_hero=False):
        badge_w = 260
        badge_h = 56 if subtitle else 44
        if is_hero:
            badge_w = 340
            badge_h = 80
            
        bx = int(x - badge_w // 2)
        by = int(y - badge_h // 2)
        
        # Glow / Shadow
        draw.rounded_rectangle([bx - 3, by - 3, bx + badge_w + 3, by + badge_h + 3], radius=10, fill=(0, 0, 0, 120))
        
        if is_hero:
            # Luxury Gold Gradient Box
            draw.rounded_rectangle([bx, by, bx + badge_w, by + badge_h], radius=10, fill=(245, 158, 11, 240), outline=(255, 255, 255, 255), width=3)
            # Radar pulse rings
            for r, alpha in [(30, 180), (55, 120), (80, 60)]:
                draw.ellipse([x - r, y - r, x + r, y + r], outline=(245, 158, 11, alpha), width=2)
            draw.ellipse([x - 12, y - 12, x + 12, y + 12], fill=(255, 255, 255, 255), outline=(220, 38, 38, 255), width=4)
            # Text inside hero card
            draw.text((bx + 16, by + 12), title, fill=(15, 23, 42, 255), font=font_lg)
            draw.text((bx + 16, by + 44), subtitle, fill=(30, 41, 59, 255), font=font_badge)
        else:
            # Standard Dark Glass Card
            draw.rounded_rectangle([bx, by, bx + badge_w, by + badge_h], radius=8, fill=(15, 23, 42, 220), outline=(59, 130, 246, 180), width=1)
            # Pin icon dot
            draw.ellipse([bx + 12, by + 14, bx + 26, by + 28], fill=(59, 130, 246, 255), outline=(255, 255, 255, 220), width=2)
            # Time badge tag
            if time_str:
                tag_w = 68
                draw.rounded_rectangle([bx + badge_w - tag_w - 8, by + 8, bx + badge_w - 8, by + 28], radius=4, fill=(30, 58, 138, 240))
                draw.text((bx + badge_w - tag_w - 4, by + 10), time_str, fill=(219, 234, 254, 255), font=font_badge)
            draw.text((bx + 34, by + 10), title, fill=(248, 250, 252, 255), font=font_sm)
            if subtitle:
                draw.text((bx + 34, by + 30), subtitle, fill=(148, 163, 184, 220), font=font_badge)

    # 9. Place Landmark Pins
    # Da Nang Airport (North-West)
    draw_landmark_badge(340, 140, "Sân Bay Quốc Tế", "Đà Nẵng", "20 Phút")
    # Dragon Bridge / Center
    draw_landmark_badge(620, 110, "Trung Tâm Đà Nẵng", "Cầu Rồng • Sông Hàn", "15 Phút")
    # East Sea Park
    draw_landmark_badge(ts_road[8][0] - 60, 80, "Công Viên Biển Đông", "Bãi tắm Phạm Văn Đồng", "10 Phút")
    # Marble Mountains
    draw_landmark_badge(760, 420, "Ngũ Hành Sơn", "Di tích danh thắng", "5 Phút")
    # FPT University
    draw_landmark_badge(660, 720, "Làng ĐH Quốc Tế", "Đại học FPT Đà Nẵng", "5 Phút")
    # Sheraton Resort
    draw_landmark_badge(ts_road[60][0] + 160, 590, "Sheraton Grand", "5-Star Luxury Resort", "0 Phút")
    # Legend Golf Resort
    draw_landmark_badge(ts_road[75][0] - 160, 740, "Legend Danang Golf", "Sân golf 36 hố ven biển", "0 Phút")
    # Hoi An Ancient Town (South)
    draw_landmark_badge(1060, 1120, "Phố Cổ Hội An", "Di sản văn hóa UNESCO", "20 Phút")

    # 10. *** HERO PIN: LUFFY HOME ***
    luffy_x = ts_road[68][0]
    luffy_y = 660
    draw_landmark_badge(luffy_x + 120, luffy_y - 20, "LUFFY HOME", "TÒA NHÀ 9 TẦNG CAO CẤP • TÂM ĐIỂM KẾT NỐI", is_hero=True)
    # Connecting line from badge to pin on Trường Sa
    draw.line([(luffy_x, luffy_y), (luffy_x + 40, luffy_y - 20)], fill=(245, 158, 11, 255), width=3)

    # 11. Header & Branding Banner
    # Top-Left Header card
    draw.rounded_rectangle([40, 30, 460, 120], radius=12, fill=(15, 23, 42, 230), outline=(212, 175, 55, 180), width=2)
    draw.text((60, 45), "LUFFY HOME", fill=(245, 158, 11, 255), font=font_title)
    draw.text((60, 95), "BẢN ĐỒ VỊ TRÍ CHIẾN LƯỢC • ĐÀ NẴNG - HỘI AN", fill=(203, 213, 225, 230), font=font_sm)

    # 12. Compass Rose (Top Right)
    cx, cy = 1680, 110
    draw.ellipse([cx - 45, cy - 45, cx + 45, cy + 45], fill=(15, 23, 42, 200), outline=(212, 175, 55, 200), width=2)
    draw.polygon([(cx, cy - 38), (cx - 10, cy), (cx, cy - 6)], fill=(239, 68, 68, 255))
    draw.polygon([(cx, cy - 38), (cx + 10, cy), (cx, cy - 6)], fill=(248, 113, 113, 255))
    draw.polygon([(cx, cy + 38), (cx - 10, cy), (cx, cy + 6)], fill=(148, 163, 184, 255))
    draw.polygon([(cx, cy + 38), (cx + 10, cy), (cx, cy + 6)], fill=(203, 213, 225, 255))
    draw.text((cx - 7, cy - 65), "B", fill=(255, 255, 255, 255), font=font_lg)
    draw.text((cx - 6, cy + 45), "N", fill=(148, 163, 184, 255), font=font_md)

    # 13. Distance Legend Strip (Bottom Left)
    legend_y = height - 70
    draw.rounded_rectangle([40, legend_y - 10, 820, legend_y + 45], radius=8, fill=(15, 23, 42, 240), outline=(51, 65, 85, 200), width=1)
    legends = [
        ("0 Phút", "Bãi Biển & Sân Golf", (245, 158, 11)),
        ("5 Phút", "Ngũ Hành Sơn & Làng ĐH", (59, 130, 246)),
        ("10 Phút", "Mỹ Khê & Biển Đông", (16, 185, 129)),
        ("20 Phút", "Sân Bay & Phố Cổ Hội An", (168, 85, 247)),
    ]
    cur_lx = 60
    for time_t, desc_t, col in legends:
        draw.ellipse([cur_lx, legend_y + 10, cur_lx + 14, legend_y + 24], fill=col)
        draw.text((cur_lx + 22, legend_y + 8), f"{time_t}:", fill=col, font=font_badge)
        draw.text((cur_lx + 70, legend_y + 8), desc_t, fill=(203, 213, 225, 220), font=font_badge)
        cur_lx += 185

    # Save final high-res map
    img = img.convert('RGB')
    img.save(output_path, quality=95)
    print(f"Map created successfully at {output_path} (size: {width}x{height})")

if __name__ == "__main__":
    create_luffy_map(r"D:\Home3D\assets\vi-tri\map_vi_tri.png")
    create_luffy_map(r"D:\Home3D\assets\trang-chu\map_luffy_home.png")
