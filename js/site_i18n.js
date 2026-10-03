/**
 * LUFFY HOME - BILINGUAL (VI / EN) i18n ENGINE
 * Seamless client-side language switching without page reload
 */

const SiteI18n = (function () {
  const dictionary = {
    vi: {
      // Header
      nav_home: 'TRANG CHỦ',
      nav_about: 'GIỚI THIỆU',
      nav_location: 'VỊ TRÍ',
      nav_amenities: 'TIỆN ÍCH DỰ ÁN',
      nav_design: 'THIẾT KẾ',
      nav_gallery: 'THƯ VIỆN',
      nav_news: 'TIN TỨC',
      nav_contact: 'LIÊN HỆ',
      nav_tour360: 'VIRTUAL TOUR 360',
      btn_choose_unit: 'Chọn căn hộ',
      btn_request_callback: 'Yêu cầu gọi lại',

      // Hero / Banners
      hero_title_1: 'kim cương từ vị trí',
      hero_title_2: 'phú quý ở tầm nhìn',
      hero_cta_tour: 'KHÁM PHÁ VIRTUAL TOUR 360° & 3D',
      hero_art_tour: 'VIRTUAL TOUR 360° & 3D TÒA NHÀ',
      hero_art_model: 'CĂN HỘ MẪU VÀ TIỆN ÍCH',

      // Apartment Selector
      apt_1pn: 'căn hộ 1 phòng ngủ',
      apt_2pn: 'căn hộ 2 phòng ngủ',
      apt_3pn: 'căn hộ 3 phòng ngủ',
      apt_1pn_sub: 'Studio Deluxe (55m²)',
      apt_2pn_sub: 'Tiêu Chuẩn (75-82m²)',
      apt_3pn_sub: 'Penthouse (110-145m²)',

      // CTA Banner
      cta_explore_3d: 'XEM MÔ HÌNH 3D & ĐỒ NỘI THẤT CĂN HỘ NGAY ➔',

      // Mobile Bottom Bar
      mb_call: 'Gọi Ngay',
      mb_zalo: 'Chat Zalo',
      mb_price: 'Báo Giá',
      mb_tour: 'Tour 360°',

      // Mobile Drawer Form
      drawer_title: 'ĐĂNG KÝ NHẬN BÁO GIÁ & ƯU ĐÃI',
      drawer_subtitle: 'Nhận bảng giá gốc & chính sách ưu đãi trực tiếp từ Chủ Đầu Tư',
      drawer_name_label: 'Họ và tên quý khách',
      drawer_name_placeholder: 'Nguyễn Văn A...',
      drawer_phone_label: 'Số điện thoại liên hệ (Zalo)',
      drawer_phone_placeholder: '0905 xxx xxx...',
      drawer_need_label: 'Loại căn hộ quý khách quan tâm:',
      drawer_btn_submit: 'GỬI YÊU CẦU TƯ VẤN NGAY',
      drawer_submitting: 'Đang gửi...',
      drawer_success_title: 'Gửi yêu cầu thành công!',
      drawer_success_desc: 'Chuyên viên LUFFY HOME sẽ liên hệ tư vấn trong 5 phút.',

      // Footer
      footer_copyright: 'Copyright © 2026 LUFFY HOME. Tòa Nhà 9 Tầng Cao Cấp. All rights reserved.'
    },
    en: {
      // Header
      nav_home: 'HOME',
      nav_about: 'ABOUT US',
      nav_location: 'LOCATION',
      nav_amenities: 'AMENITIES',
      nav_design: 'FLOORPLANS',
      nav_gallery: 'GALLERY',
      nav_news: 'NEWS',
      nav_contact: 'CONTACT',
      nav_tour360: '360° VIRTUAL TOUR',
      btn_choose_unit: 'Select Unit',
      btn_request_callback: 'Request Callback',

      // Hero / Banners
      hero_title_1: 'PRIME COASTAL LOCATION',
      hero_title_2: 'PANORAMIC OCEAN HORIZON',
      hero_cta_tour: 'EXPLORE 360° TOUR & 3D',
      hero_art_tour: '360° TOUR & 3D ARCHITECTURE',
      hero_art_model: 'SAMPLE SUITES & AMENITIES',

      // Apartment Selector
      apt_1pn: '1-Bedroom Studio',
      apt_2pn: '2-Bedroom Suite',
      apt_3pn: '3-Bedroom Penthouse',
      apt_1pn_sub: 'Studio Deluxe (55m²)',
      apt_2pn_sub: 'Standard Suite (75-82m²)',
      apt_3pn_sub: 'Luxury Penthouse (110-145m²)',

      // CTA Banner
      cta_explore_3d: 'EXPLORE 3D MODEL & INTERIORS NOW ➔',

      // Mobile Bottom Bar
      mb_call: 'Call Now',
      mb_zalo: 'Zalo Chat',
      mb_price: 'Price Quote',
      mb_tour: '360° Tour',

      // Mobile Drawer Form
      drawer_title: 'GET EXCLUSIVE PRICE QUOTE',
      drawer_subtitle: 'Receive official price list & premier offers directly from Developer',
      drawer_name_label: 'Full Name',
      drawer_name_placeholder: 'John Doe...',
      drawer_phone_label: 'Phone Number (WhatsApp / Zalo)',
      drawer_phone_placeholder: '+84 905 xxx xxx...',
      drawer_need_label: 'Apartment type of interest:',
      drawer_btn_submit: 'SUBMIT REQUEST NOW',
      drawer_submitting: 'Submitting...',
      drawer_success_title: 'Request Sent Successfully!',
      drawer_success_desc: 'Our LUFFY HOME consultant will contact you within 5 minutes.',

      // Footer
      footer_copyright: 'Copyright © 2026 LUFFY HOME. 9-Story Luxury Residence. All rights reserved.'
    }
  };

  let currentLang = 'vi';

  function init() {
    const saved = localStorage.getItem('preferred_site_lang');
    if (saved === 'en' || saved === 'vi') {
      currentLang = saved;
    }

    bindLanguageButtons();
    applyLanguage(currentLang);
  }

  function bindLanguageButtons() {
    const langContainers = document.querySelectorAll('.lang');
    langContainers.forEach(container => {
      // Find or create EN and VIE buttons
      let enBtn = container.querySelector('.en');
      let viBtn = container.querySelector('.vi');

      if (enBtn) {
        enBtn.onclick = (e) => {
          e.preventDefault();
          setLanguage('en');
        };
      }
      if (viBtn) {
        viBtn.onclick = (e) => {
          e.preventDefault();
          setLanguage('vi');
        };
      }
    });
  }

  function setLanguage(lang) {
    if (lang !== 'vi' && lang !== 'en') return;
    currentLang = lang;
    localStorage.setItem('preferred_site_lang', lang);
    applyLanguage(lang);
  }

  function applyLanguage(lang) {
    const t = dictionary[lang];
    if (!t) return;

    // 1. Update Language Button Active State
    document.querySelectorAll('.lang .en').forEach(el => {
      el.classList.toggle('active', lang === 'en');
    });
    document.querySelectorAll('.lang .vi').forEach(el => {
      el.classList.toggle('active', lang === 'vi');
    });

    // 2. Translate Navigation Links
    translateTextBySelector('.header_nav li a[href="./"] span, .header_nav li a[href="index.html"] span', t.nav_home);
    translateTextBySelector('.header_nav li a[href*="gioi-thieu"] span', t.nav_about);
    translateTextBySelector('.header_nav li a[href*="vi-tri"] span', t.nav_location);
    translateTextBySelector('.header_nav li a[href*="tien-ich"] span', t.nav_amenities);
    translateTextBySelector('.header_nav li a[href*="thiet-ke"] span, .header_nav li a[href*="#thiet-ke"] span', t.nav_design);
    translateTextBySelector('.header_nav li a[href*="thu-vien"] span, .header_nav li a[href*="#thu-vien"] span', t.nav_gallery);
    translateTextBySelector('.header_nav li a[href*="tin-tuc"] span, .header_nav li a[href*="#tin-tuc"] span', t.nav_news);
    translateTextBySelector('.header_nav li a[href*="lien-he"] span', t.nav_contact);
    translateTextBySelector('.header_nav li a[href*="tong-quan-360"] span', t.nav_tour360);

    // 3. Header Buttons
    translateTextBySelector('.choose span', t.btn_choose_unit);
    translateTextBySelector('.call_agains span', t.btn_request_callback);

    // 4. Hero & Banners
    translateTextBySelector('.banner_text h2:nth-child(1)', t.hero_title_1);
    translateTextBySelector('.banner_text h2:nth-child(2)', t.hero_title_2);
    translateTextBySelector('.banner_text a span', t.hero_cta_tour);

    // 5. Art Boxes
    translateTextBySelector('.art_2_1 .art_t', t.hero_art_tour);
    translateTextBySelector('.art_2_2 .art_t', t.hero_art_model);

    // 6. Bottom CTA
    translateTextBySelector('a.btn[href*="tong-quan-360"] span:last-child', t.cta_explore_3d);

    // 7. Mobile Bar & Drawer
    translateTextBySelector('.mb-btn-call span', t.mb_call);
    translateTextBySelector('.mb-btn-zalo span', t.mb_zalo);
    translateTextBySelector('.mb-btn-form span', t.mb_price);
    translateTextBySelector('.mb-btn-360 span', t.mb_tour);

    translateTextBySelector('#drawerTitle', t.drawer_title);
    translateTextBySelector('#drawerSubtitle', t.drawer_subtitle);
    translateTextBySelector('#drawerNameLabel', t.drawer_name_label);
    translateTextBySelector('#drawerPhoneLabel', t.drawer_phone_label);
    translateTextBySelector('#drawerNeedLabel', t.drawer_need_label);
    translateTextBySelector('#drawerSubmitBtn span', t.drawer_btn_submit);

    const nameInput = document.getElementById('drawerCustName');
    if (nameInput) nameInput.placeholder = t.drawer_name_placeholder;
    const phoneInput = document.getElementById('drawerCustPhone');
    if (phoneInput) phoneInput.placeholder = t.drawer_phone_placeholder;

    // 8. Footer
    translateTextBySelector('.copyright', t.footer_copyright);

    // 9. Elements with explicit data-i18n attributes
    document.querySelectorAll('[data-vi][data-en]').forEach(el => {
      el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-vi');
    });
  }

  function translateTextBySelector(selector, text) {
    if (!text) return;
    document.querySelectorAll(selector).forEach(el => {
      el.textContent = text;
    });
  }

  return {
    init: init,
    setLanguage: setLanguage,
    getCurrentLanguage: () => currentLang
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  SiteI18n.init();
});
