/**
 * LUFFY HOME - MOBILE STICKY BOTTOM BAR & DRAWER LEAD FORM
 * Injected automatically on all pages for seamless 1-tap mobile conversions
 */

const SiteMobileForm = (function () {
  let selectedUnitType = 'Căn hộ 2PN (75m²)';

  function init() {
    renderMarkup();
    bindEvents();
  }

  function renderMarkup() {
    // 1. Check if already injected
    if (document.getElementById('mobileBottomBar')) return;

    // 2. Inject Sticky Mobile Bottom Bar
    const bottomBar = document.createElement('div');
    bottomBar.id = 'mobileBottomBar';
    bottomBar.className = 'mobile-bottom-bar';
    bottomBar.innerHTML = `
      <a href="tel:0905123456" class="mb-btn mb-btn-call" title="Gọi hotline ngay">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
        <span>Gọi Ngay</span>
      </a>

      <a href="https://zalo.me" target="_blank" class="mb-btn mb-btn-zalo" title="Chat Zalo tư vấn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span>Chat Zalo</span>
      </a>

      <button type="button" class="mb-btn mb-btn-form" onclick="SiteMobileForm.openDrawer()" title="Nhận báo giá ưu đãi">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span>Báo Giá</span>
      </button>

      <a href="tong-quan-360" class="mb-btn mb-btn-360" title="Khám phá 360 độ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span>Tour 360°</span>
      </a>
    `;
    document.body.appendChild(bottomBar);

    // 3. Inject Slide-Up Drawer Form Modal
    const drawerOverlay = document.createElement('div');
    drawerOverlay.id = 'mobileDrawerOverlay';
    drawerOverlay.className = 'mobile-drawer-overlay';
    drawerOverlay.innerHTML = `
      <div class="mobile-drawer-card">
        <div class="drawer-drag-pill"></div>
        <button type="button" class="drawer-close-btn" onclick="SiteMobileForm.closeDrawer()" aria-label="Đóng">✕</button>

        <div class="drawer-header">
          <h3 id="drawerTitle">ĐĂNG KÝ NHẬN BÁO GIÁ & ƯU ĐÃI</h3>
          <p id="drawerSubtitle">Nhận bảng giá gốc & chính sách ưu đãi trực tiếp từ Chủ Đầu Tư</p>
        </div>

        <form id="drawerLeadForm" onsubmit="SiteMobileForm.submitForm(event)">
          <div class="drawer-form-group">
            <label class="drawer-form-label" id="drawerNameLabel" for="drawerCustName">Họ và tên quý khách</label>
            <input type="text" id="drawerCustName" class="drawer-input" placeholder="Nguyễn Văn A..." required />
          </div>

          <div class="drawer-form-group">
            <label class="drawer-form-label" id="drawerPhoneLabel" for="drawerCustPhone">Số điện thoại liên hệ (Zalo)</label>
            <input type="tel" id="drawerCustPhone" class="drawer-input" inputmode="tel" placeholder="0905 xxx xxx..." pattern="[0-9+ ]{8,15}" required />
          </div>

          <div class="drawer-form-group">
            <label class="drawer-form-label" id="drawerNeedLabel">Loại căn hộ quý khách quan tâm:</label>
            <div class="drawer-chips">
              <div class="chip-btn" data-type="Studio / 1PN (55m²)" onclick="SiteMobileForm.selectChip(this)">1 Phòng Ngủ</div>
              <div class="chip-btn active" data-type="Căn hộ 2PN (75m²)" onclick="SiteMobileForm.selectChip(this)">2 Phòng Ngủ</div>
              <div class="chip-btn" data-type="Căn hộ 3PN (108m²)" onclick="SiteMobileForm.selectChip(this)">3 Phòng Ngủ</div>
              <div class="chip-btn" data-type="Penthouse / Tầng 9" onclick="SiteMobileForm.selectChip(this)">Penthouse</div>
            </div>
          </div>

          <button type="submit" id="drawerSubmitBtn" class="drawer-submit-btn">
            <span>GỬI YÊU CẦU TƯ VẤN NGAY</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(drawerOverlay);

    // Close when clicking overlay backdrop
    drawerOverlay.addEventListener('click', (e) => {
      if (e.target === drawerOverlay) {
        closeDrawer();
      }
    });

    // 4. Inject Success Toast Notification
    const toast = document.createElement('div');
    toast.id = 'siteToastModal';
    toast.className = 'toast-success-modal';
    toast.innerHTML = `
      <div class="toast-icon">✓</div>
      <div class="toast-text" id="toastMessage">Đã gửi yêu cầu thành công! Chúng tôi sẽ liên hệ trong 5 phút.</div>
    `;
    document.body.appendChild(toast);
  }

  function bindEvents() {
    // Bind all ".call_agains" buttons on the page to open drawer
    document.querySelectorAll('.call_agains').forEach(btn => {
      btn.style.cursor = 'pointer';
      btn.onclick = (e) => {
        e.preventDefault();
        openDrawer();
      };
    });

    // Bind any element with data-open-drawer
    document.querySelectorAll('[data-open-drawer]').forEach(el => {
      el.style.cursor = 'pointer';
      el.onclick = (e) => {
        e.preventDefault();
        openDrawer();
      };
    });
  }

  function openDrawer() {
    const overlay = document.getElementById('mobileDrawerOverlay');
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      const phoneInput = document.getElementById('drawerCustPhone');
      if (phoneInput && window.innerWidth > 768) {
        phoneInput.focus();
      }
    }
  }

  function closeDrawer() {
    const overlay = document.getElementById('mobileDrawerOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function selectChip(el) {
    document.querySelectorAll('.drawer-chips .chip-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    el.classList.add('active');
    selectedUnitType = el.getAttribute('data-type');
  }

  function submitForm(e) {
    e.preventDefault();
    const name = document.getElementById('drawerCustName').value.trim();
    const phone = document.getElementById('drawerCustPhone').value.trim();
    const submitBtn = document.getElementById('drawerSubmitBtn');

    if (!phone || phone.length < 8) {
      alert('Vui lòng nhập số điện thoại hợp lệ để nhận báo giá.');
      return;
    }

    // Button loading state
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Đang gửi thông tin...</span>`;

    // Simulate instant asynchronous dispatch & persist to localStorage
    setTimeout(() => {
      const submission = {
        name: name,
        phone: phone,
        unitType: selectedUnitType,
        submittedAt: new Date().toISOString(),
        url: window.location.href
      };

      try {
        const stored = JSON.parse(localStorage.getItem('luffy_leads') || '[]');
        stored.push(submission);
        localStorage.setItem('luffy_leads', JSON.stringify(stored));
      } catch (err) {
        console.warn('Could not save to localStorage:', err);
      }

      // Reset form & restore button
      document.getElementById('drawerLeadForm').reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;

      // Close drawer & show luxury toast
      closeDrawer();
      showToast('Gửi thông tin thành công! Chuyên viên sẽ liên hệ lại quý khách sau 5 phút.');
    }, 600);
  }

  function showToast(msg) {
    const toast = document.getElementById('siteToastModal');
    const msgEl = document.getElementById('toastMessage');
    if (!toast) return;

    if (msg && msgEl) msgEl.textContent = msg;

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  return {
    init: init,
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
    selectChip: selectChip,
    submitForm: submitForm,
    showToast: showToast
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  SiteMobileForm.init();
});
