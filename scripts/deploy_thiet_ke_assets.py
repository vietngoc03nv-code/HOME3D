import os, shutil
from PIL import Image, ImageEnhance

ART_DIR = r"C:\Users\DELL\.gemini\antigravity\brain\c16e9157-dce1-40f0-9733-2e3277f7e203"
TK_DIR = r"D:\Home3D\assets\thiet-ke"
RENDER_DIR = r"D:\Home3D\render_test"
TC_DIR = r"D:\Home3D\assets\trang-chu"

# 1. Process Bedroom 2 to 16:9
b2_path = r"D:\Home3D\assets\panoramas\bedroom_2\0.jpg"
im_b2 = Image.open(b2_path)
target_h = int(im_b2.width * 9 / 16)
top = int((im_b2.height - target_h) * 0.45)
cropped_b2 = im_b2.crop((0, top, im_b2.width, top + target_h))
resized_b2 = cropped_b2.resize((1920, 1080), Image.Resampling.LANCZOS)
resized_b2 = ImageEnhance.Color(resized_b2).enhance(1.1)
resized_b2 = ImageEnhance.Contrast(resized_b2).enhance(1.08)
b2_out = os.path.join(TK_DIR, "bedroom_natural_light_3.jpg")
resized_b2.save(b2_out, quality=95)
print(f"Created {b2_out}")

# 2. Hero Banner & Facade
HERO_9STORY = os.path.join(ART_DIR, "luffy_9story_hero_1790970028407.jpg")
shutil.copyfile(HERO_9STORY, os.path.join(TK_DIR, "banner_thiet_ke.jpg"))
shutil.copyfile(HERO_9STORY, os.path.join(TK_DIR, "thiet_ke_facade.jpg"))

# 3. Design 1 slider images
shutil.copyfile(os.path.join(RENDER_DIR, "balcony_0.jpg"), os.path.join(TK_DIR, "thiet_ke_balcony.jpg"))
shutil.copyfile(os.path.join(RENDER_DIR, "living_room_0.jpg"), os.path.join(TK_DIR, "thiet_ke_living.jpg"))

# 4. Design 2 (100% natural light bedrooms)
shutil.copyfile(os.path.join(RENDER_DIR, "master_bedroom_0.jpg"), os.path.join(TK_DIR, "bedroom_natural_light_1.jpg"))
shutil.copyfile(os.path.join(RENDER_DIR, "master_bedroom_5.jpg"), os.path.join(TK_DIR, "bedroom_natural_light_2.jpg"))

# 5. Design 3 (View panorama & Low-E glass)
shutil.copyfile(os.path.join(RENDER_DIR, "living_room_5.jpg"), os.path.join(TK_DIR, "panorama_view_1.jpg"))
shutil.copyfile(os.path.join(RENDER_DIR, "dining_0.jpg"), os.path.join(TK_DIR, "panorama_view_2.jpg"))
shutil.copyfile(os.path.join(RENDER_DIR, "master_bedroom_0.jpg"), os.path.join(TK_DIR, "panorama_view_3.jpg"))
shutil.copyfile(os.path.join(RENDER_DIR, "balcony_5.jpg"), os.path.join(TK_DIR, "panorama_view_4.jpg"))

# 6. Brand SVGs and menu modal assets
shutil.copyfile(os.path.join(TC_DIR, "logo.svg"), os.path.join(TK_DIR, "logo.svg"))
shutil.copyfile(os.path.join(TC_DIR, "logo_white.svg"), os.path.join(TK_DIR, "logo_white.svg"))
shutil.copyfile(os.path.join(TC_DIR, "favicon.svg"), os.path.join(TK_DIR, "favicon.svg"))
shutil.copyfile(os.path.join(TC_DIR, "design-1.png"), os.path.join(TK_DIR, "design-1.png"))
shutil.copyfile(os.path.join(TC_DIR, "ds-3.png"), os.path.join(TK_DIR, "ds-3.png"))
shutil.copyfile(os.path.join(TC_DIR, "inspiration-1.png"), os.path.join(TK_DIR, "inspiration-1.png"))
shutil.copyfile(os.path.join(TC_DIR, "interior_1.jpg"), os.path.join(TK_DIR, "interior_1.jpg"))
shutil.copyfile(os.path.join(TC_DIR, "pool.jpg"), os.path.join(TK_DIR, "pool.jpg"))
shutil.copyfile(os.path.join(TC_DIR, "amenity_1.jpg"), os.path.join(TK_DIR, "amenity_1.jpg"))
shutil.copyfile(os.path.join(TC_DIR, "tang1_image10.jpg"), os.path.join(TK_DIR, "tang1_image10.jpg"))
shutil.copyfile(os.path.join(TC_DIR, "tang1_image18.jpg"), os.path.join(TK_DIR, "tang1_image18.jpg"))

print("All assets for assets/thiet-ke deployed successfully!")
