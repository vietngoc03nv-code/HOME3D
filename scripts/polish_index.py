import re

with open('D:/Home3D/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Clean up </undefined> and multiple empty lines
c = re.sub(r'</undefined>', '', c)
c = re.sub(r'\n[\t ]*\n[\t ]*\n+', '\n\n', c)

# 2. Headings & Đại lộ Kim Cương
c = re.sub(r'<p>TRỤC ĐẠI LỘ[\s\n]*KIM CƯƠNG</p>', '<p>TRỤC ĐẠI LỘ VEN BIỂN TRƯỜNG SA</p>', c)
c = re.sub(r'BIỂU TƯỢNG[\s\n]*KIẾN TRÚC MỚI CỦA', 'BIỂU TƯỢNG KIẾN TRÚC ĐƯƠNG ĐẠI TRÊN', c)
c = re.sub(r'<p>VỊ TRÍ KIM CƯƠNG</p>', '<p>VỊ TRÍ CHIẾN LƯỢC VEN BIỂN</p>', c)

# 3. Dolce far niente rewrites
old_dolce_1 = "Điều gì tạo nên chất sống dolce far niente của người Ý? Không chỉ là một mùa hè rực rỡ bên bờ biển hay một tách café tại quán nhỏ ven đường, đó là sự tự do & cân bằng toàn vẹn về cả vật chất và tinh thần, sự thảnh thơi trong mọi khía cạnh của cuộc sống."
new_dolce_1 = "Điều gì tạo nên đẳng cấp sống khác biệt tại <strong>LUFFY HOME</strong>? Không chỉ là một kỳ nghỉ rực rỡ bên bờ biển Đà Nẵng, mà đó là sự cân bằng trọn vẹn giữa cuộc sống riêng tư tĩnh lặng và nhịp sống nghỉ dưỡng đỉnh cao, mở ra phong cách sống thảnh thơi, trọn vẹn từng khoảnh khắc đắt giá giữa thiên nhiên biển trời và tiện nghi chuẩn 5 sao."
c = c.replace(old_dolce_1, new_dolce_1)

# Regex replace for any other variant of dolce far niente
c = re.sub(r'Lấy cảm hứng từ phong cách sống[^,]*dolce far niente[^,]*,?\s*LUFFY HOME là biểu tượng của chất sống',
           'Được kiến tạo từ nguồn cảm hứng bất tận của phong cách kiến trúc đương đại kết hợp tinh hoa nghỉ dưỡng ven biển Đà Nẵng, <strong>LUFFY HOME</strong> là biểu tượng của chất sống thượng lưu', c)

# 4. Old typos from original site
old_desc = "Cùng nguồn cảm hứng bất tận từ màu xanh & những đường cong mềm mại của của sóng biển, của núi, đèo và sân gôn, LUFFY HOME được kiến tạo bằng sự tận tâm và thấu hiểu tiêu chuẩn sống của giới tinh anh, cũng như sự trân trọng và nâng niu vẻ đẹp của thiên nhiên thơ mộng."
new_desc = "Lấy cảm hứng từ vẻ đẹp bất tận của đại dương và những đường nét kiến trúc đương đại tinh tế, <strong>LUFFY HOME</strong> được kiến tạo bằng tâm huyết và sự thấu hiểu sâu sắc tiêu chuẩn sống thượng lưu của giới tinh hoa. Tòa nhà 9 tầng cao cấp mang đến không gian nghỉ dưỡng cân bằng hoàn hảo giữa thiên nhiên biển trời, sân golf quốc tế và tiện nghi thông minh chuẩn 5 sao."
c = c.replace(old_desc, new_desc)

# 5. Copyright & footer
c = re.sub(r'Copyright © 2026 New Town Diamond[^<]*', 'Copyright © 2026 LUFFY HOME. Tòa Nhà 9 Tầng Cao Cấp. All rights reserved.', c)

with open('D:/Home3D/index.html', 'w', encoding='utf-8') as f:
    f.write(c)

print('Cleaned and polished index.html!')
