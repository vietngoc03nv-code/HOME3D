# 🏢 LUFFY HOME - HỆ THỐNG WEBSITE BẤT ĐỘNG SẢN CAO CẤP & TOUR 3D 360°

> Hệ thống website bất động sản hạng sang và nền tảng trải nghiệm không gian thực tế ảo 3D & 360° toàn diện dành cho **LUFFY HOME** — Tòa nhà 9 tầng cao cấp ven biển Đà Nẵng.

---

## 🌟 CÁC TRANG CHÍNH TRONG HỆ THỐNG

| Trang | Tệp tin | URL sạch | Điểm nổi bật |
| :--- | :--- | :--- | :--- |
| **Trang Chủ** | `index.html` | `/` | Giao diện chuẩn sang trọng, bản đồ định vị, preview 3D, danh mục bàn giao 5 sao |
| **Giới Thiệu** | `gioi-thieu.html` | `/gioi-thieu` | Phân tầng kiến trúc 9 tầng, thông số tổng quan Coteccons, kết nối Tour 3D |
| **Vị Trí** | `vi-tri.html` | `/vi-tri` | Tọa độ vàng ven biển Đà Nẵng, kết nối 8 danh thắng danh lam và hạ tầng giao thông |
| **Tiện Ích** | `tien-ich.html` | `/tien-ich` | Hồ bơi vô cực chân mây, Sky Bar, Gym & Spa 5 sao, Beach Club, Vườn nhiệt đới |
| **Thiết Kế** | `thiet-ke.html` | `/thiet-ke` | Kính Low-E cản nhiệt, 100% căn hộ đón sáng tự nhiên, mặt bằng các tầng |
| **Thư Viện** | `thu-vien.html` | `/thu-vien` | Bộ sưu tập hình ảnh 4 phân khu chuyên biệt kèm Lightbox phóng to sắc nét |
| **Tour 3D & 360°** | `tour.html` | `/tour` | Tòa nhà 3D tương tác (Three.js), tách tầng (exploded view), chế độ Ngày/Đêm, 360° Radar |

---

## 📂 CẤU TRÚC THƯ MỤC & TÀI NGUYÊN (ASSETS)

Tất cả hình ảnh đã được chuẩn hóa 100% tài nguyên độc quyền, phân chia rõ ràng theo từng phân hệ chức năng:

```text
D:\Home3D\
├── index.html                   # Trang chủ chính thức
├── gioi-thieu.html              # Trang Giới thiệu dự án
├── vi-tri.html                  # Trang Vị trí kim cương
├── vi-tri-du-an.html            # Alias định tuyến vị trí
├── tien-ich.html                # Trang Hệ thống tiện ích 5 sao
├── thiet-ke.html                # Trang Kiến trúc & Thiết kế
├── thu-vien.html                # Trang Thư viện hình ảnh
├── thu-vien-hinh-anh.html       # Alias định tuyến thư viện
├── tour.html                    # Ứng dụng thực tế ảo Tour 3D & 360°
├── server.py                    # Web server Python hỗ trợ Clean URLs (bỏ .html)
├── start_server.bat             # Khởi chạy server 1 chạm trên Windows
├── vercel.json                  # Cấu hình triển khai Vercel (Clean URLs & Headers)
├── nginx.conf                   # Cấu hình triển khai Nginx Production
├── .htaccess                    # Cấu hình triển khai Apache Production
├── README.md                    # Tài liệu dự án
├── HUONG_DAN.txt                # Hướng dẫn nhanh người dùng
├── assets/                      # Toàn bộ hình ảnh & tài nguyên độc quyền
│   ├── trang-chu/               # Ảnh banner & giao diện Trang chủ
│   ├── gioi-thieu/              # Ảnh tòa nhà, phối cảnh Giới thiệu
│   ├── vi-tri/                  # Ảnh bản đồ định vị & 8 danh thắng Đà Nẵng
│   ├── tien-ich/                # Ảnh tiện ích (Hồ bơi, Sky Bar, Gym, Spa...)
│   ├── thiet-ke/                # Ảnh kiến trúc, vật liệu Low-E, mặt bằng
│   ├── thu-vien/                # Kho ảnh chất lượng cao 4 chủ đề
│   ├── home/                    # Tài nguyên giao diện chung
│   └── panoramas/               # Ảnh 360° Panorama cho Tour VR
├── css/                         # Thư viện Stylesheets
├── js/                          # Thư viện Three.js & Scripts tương tác 3D
└── scripts/                     # Các công cụ kiểm thử & triển khai tự động
```

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY CỤC BỘ (LOCAL)

### Cách 1: Khởi động 1 chạm (Khuyên dùng trên Windows)
- Nhấp đúp chuột vào file **`start_server.bat`**.
- Trình duyệt sẽ tự động mở tại địa chỉ: **`http://localhost:8080`**.

### Cách 2: Khởi động bằng dòng lệnh
```bash
python server.py
```
Sau đó truy cập: `http://localhost:8080` trên trình duyệt. Server tự động định tuyến các URL sạch (không cần đuôi `.html`).

---

## ☁️ TRIỂN KHAI LÊN MÔI TRƯỜNG PRODUCTION

- **Vercel / Netlify**: Đã có sẵn file `vercel.json` cấu hình Clean URLs tự động.
- **Nginx Server**: Sử dụng cấu hình mẫu `nginx.conf` với cơ chế `try_files $uri $uri.html $uri/ =404;`.
- **Apache / CPanel**: File `.htaccess` đã được thiết lập sẵn quy tắc `RewriteEngine` hỗ trợ URL thân thiện SEO.

---

© 2026 **LUFFY HOME** — Kiệt tác kiến trúc ven biển Đà Nẵng.
