import re

with open('D:/Home3D/gioi-thieu.html', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Clean meta og:site_name
c = re.sub(r'content="NEWTOWN DIAMOND[^"]*"', 'content="LUFFY HOME - Nghệ thuật hưởng thụ cuộc sống cân bằng | Tòa Nhà 9 Tầng Cao Cấp"', c)

# 2. Clean up </undefined> and multiple empty lines
c = re.sub(r'</undefined>', '', c)
c = re.sub(r'\n[\t ]*\n[\t ]*\n+', '\n\n', c)

# 3. Clean heading
c = re.sub(r'<p>TRỤC ĐẠI LỘ[\s\n]*KIM CƯƠNG</p>', '<p>TRỤC ĐẠI LỘ VEN BIỂN TRƯỜNG SA</p>', c)
c = re.sub(r'BIỂU TƯỢNG[\s\n]*KIẾN TRÚC MỚI CỦA', 'BIỂU TƯỢNG KIẾN TRÚC ĐƯƠNG ĐẠI TRÊN', c)

# 4. Clean description
old_desc = 'Cùng nguồn cảm hứng bất tận từ màu xanh & những đường cong mềm mại của của sóng biển, của núi, đèo và sân gôn, LUFFY HOME được kiến tạo bằng sự tận tâm và thấu hiểu tiêu chuẩn sống của giới tinh anh, cũng như sự trân trọng và nâng niu vẻ đẹp của thiên nhiên thơ mộng.'
new_desc = 'Lấy cảm hứng từ vẻ đẹp bất tận của đại dương và những đường nét kiến trúc đương đại tinh tế, <strong>LUFFY HOME</strong> được kiến tạo bằng tâm huyết và sự thấu hiểu sâu sắc tiêu chuẩn sống thượng lưu của giới tinh hoa. Tòa nhà 9 tầng cao cấp mang đến không gian nghỉ dưỡng cân bằng hoàn hảo giữa thiên nhiên biển trời, sân golf quốc tế và tiện nghi thông minh chuẩn 5 sao.'
c = c.replace(old_desc, new_desc)

with open('D:/Home3D/gioi-thieu.html', 'w', encoding='utf-8') as f:
    f.write(c)

print('Cleaned and polished gioi-thieu.html!')
