/**
 * Professional Enterprise Website Interactive Script
 * Clean Corporate Architecture
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Header scroll behavior
  const header = document.querySelector('header.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Drawer Navigation
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = mobileDrawer.style.display === 'block';
      mobileDrawer.style.display = isVisible ? 'none' : 'block';
    });

    // Close when clicking mobile links
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.style.display = 'none';
      });
    });
  }

  // 3. Residence Floor Plans & Apartment Tabs
  const tabItems = document.querySelectorAll('.residence-tab-item');
  const panels = document.querySelectorAll('.residence-panel');

  tabItems.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      // Update tab active state
      tabItems.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update panel visibility
      panels.forEach(panel => {
        if (panel.id === `panel-${target}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // 4. Form Submission Handler
  const inquiryForm = document.getElementById('corporate-inquiry-form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Yêu cầu đã được tiếp nhận thành công. Chuyên viên kinh doanh của tòa nhà sẽ liên hệ trực tiếp với quý khách trong vòng 15 phút.');
      inquiryForm.reset();
    });
  }

  // 5. Active Nav link on scroll
  const navLinks = document.querySelectorAll('nav.desktop-nav a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

});
