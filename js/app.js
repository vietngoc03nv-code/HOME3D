/**
 * TourApp - Main Application Orchestrator for LUFFY HOME
 * Seamlessly connects 360° Panorama Tour with 3D Architectural Building
 * Matching 1:1 Reference Architecture (krpano / 3DVista Style)
 */

const TourApp = (function () {
  let currentMode = 'tour_360'; // default: 'tour_360' (Căn hộ 3PN 360)
  let currentRoomId = 'living_room';
  let menuVisible = true;
  let isNight = false;
  let isExploded = false;
  let activePopup = null;
  let currentFloor = 5;

  let container = null;

  function init() {
    container = document.getElementById('canvas-container');

    // Launch default 360 mode
    init360Tour();

    // Setup global keyboard listeners
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePopup();
      }
    });

    // Close popup when clicking backdrop
    document.querySelectorAll('.popup').forEach(popup => {
      popup.addEventListener('click', (e) => {
        if (e.target === popup) {
          closePopup();
        }
      });
    });
  }

  // --------------------------------------------------
  // MODE 1: 360° PANORAMA VIRTUAL TOUR
  // --------------------------------------------------
  function init360Tour() {
    currentMode = 'tour_360';

    // Update Top Navigation
    const btn3pn = document.getElementById('nav-btn-3pn');
    const btn3d = document.getElementById('nav-btn-3d');
    if (btn3pn && btn3d) {
      btn3pn.parentElement.classList.add('active');
      btn3d.parentElement.classList.remove('active');
    }

    // Toggle Mode UI elements
    const menuScroll = document.getElementById('menu-scroll');
    const toggleBtn = document.getElementById('toggle-menu-btn');
    const buildingControls = document.getElementById('building-controls');
    const floorElevator = document.getElementById('floor-elevator');

    if (menuScroll) menuScroll.style.display = 'flex';
    if (toggleBtn) toggleBtn.style.display = 'flex';
    if (buildingControls) buildingControls.style.display = 'none';
    if (floorElevator) floorElevator.style.display = 'none';

    // Dispose 3D Building if active
    if (typeof Building3D !== 'undefined' && Building3D.destroy) {
      Building3D.destroy();
    }

    // Init 360 Viewer
    Tour360.init(container, (room) => {
      currentRoomId = room.id;
      updateActiveCard(room.id);
      updateFloorplanBeacon(room.id);
    });

    // Load initial room
    goToRoom(currentRoomId);
  }

  // --------------------------------------------------
  // MODE 2: 3D ARCHITECTURAL 9-STORY BUILDING
  // --------------------------------------------------
  function init3DBuilding() {
    currentMode = '3d_building';

    // Update Top Navigation
    const btn3pn = document.getElementById('nav-btn-3pn');
    const btn3d = document.getElementById('nav-btn-3d');
    if (btn3pn && btn3d) {
      btn3pn.parentElement.classList.remove('active');
      btn3d.parentElement.classList.add('active');
    }

    // Toggle Mode UI elements
    const menuScroll = document.getElementById('menu-scroll');
    const toggleBtn = document.getElementById('toggle-menu-btn');
    const buildingControls = document.getElementById('building-controls');
    const floorElevator = document.getElementById('floor-elevator');

    if (menuScroll) menuScroll.style.display = 'none';
    if (toggleBtn) toggleBtn.style.display = 'none';
    if (buildingControls) buildingControls.style.display = 'flex';
    if (floorElevator) floorElevator.style.display = 'flex';

    // Dispose 360 Tour if active
    if (typeof Tour360 !== 'undefined' && Tour360.dispose) {
      Tour360.dispose();
    }

    // Init 3D Building
    Building3D.init(container, (floorInfo) => {
      currentFloor = floorInfo.floor;
      updateElevatorActive(currentFloor);
    });

    Building3D.setNightMode(isNight);
    Building3D.selectFloor(currentFloor);
  }

  function switchMode(mode) {
    if (mode === currentMode) return;
    if (mode === 'tour_360') {
      init360Tour();
    } else {
      init3DBuilding();
    }
  }

  function toggle3D() {
    if (currentMode === 'tour_360') {
      switchMode('3d_building');
    } else {
      switchMode('tour_360');
    }
  }

  // --------------------------------------------------
  // ROOM NAVIGATION
  // --------------------------------------------------
  function goToRoom(roomId) {
    if (currentMode !== 'tour_360') {
      switchMode('tour_360');
    }
    currentRoomId = roomId;
    Tour360.loadRoom(roomId);
    updateActiveCard(roomId);
    updateFloorplanBeacon(roomId);
  }

  function updateActiveCard(roomId) {
    document.querySelectorAll('.room-card').forEach(card => {
      if (card.getAttribute('data-room') === roomId) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else {
        card.classList.remove('active');
      }
    });
  }

  function toggleMenuScroll() {
    const menu = document.getElementById('menu-scroll');
    const btn = document.getElementById('toggle-menu-btn');
    if (!menu || !btn) return;

    menuVisible = !menuVisible;
    if (menuVisible) {
      menu.style.transform = 'translateX(-50%) translateY(0)';
      menu.style.opacity = '1';
      menu.style.pointerEvents = 'auto';
      btn.classList.remove('up');
    } else {
      menu.style.transform = 'translateX(-50%) translateY(160%)';
      menu.style.opacity = '0';
      menu.style.pointerEvents = 'none';
      btn.classList.add('up');
    }
  }

  // --------------------------------------------------
  // POPUP MODALS (INFO, VIDEO, FLOORPLAN)
  // --------------------------------------------------
  function showPopup(popupId) {
    closePopup();
    const target = document.getElementById(popupId);
    if (target) {
      target.classList.add('show');
      activePopup = target;
    }
  }

  function closePopup() {
    if (activePopup) {
      activePopup.classList.remove('show');
      // If video, pause iframe
      const ifr = activePopup.querySelector('iframe');
      if (ifr) {
        const src = ifr.src;
        ifr.src = src; // reset to stop playback
      }
      activePopup = null;
    }
    document.querySelectorAll('.popup').forEach(p => p.classList.remove('show'));
  }

  function updateFloorplanBeacon(roomId) {
    document.querySelectorAll('.fp-marker').forEach(marker => {
      if (marker.getAttribute('data-room') === roomId) {
        marker.querySelector('.fp-marker-dot').style.background = '#22c55e';
        marker.querySelector('.fp-marker-dot').style.boxShadow = '0 0 15px #22c55e';
      } else {
        marker.querySelector('.fp-marker-dot').style.background = '#EC741B';
        marker.querySelector('.fp-marker-dot').style.boxShadow = '0 0 10px rgba(236,116,27,0.8)';
      }
    });
  }

  // --------------------------------------------------
  // 3D BUILDING HELPERS
  // --------------------------------------------------
  function toggleExploded() {
    isExploded = !isExploded;
    Building3D.toggleExploded(isExploded);
    const btn = document.getElementById('btn-explode');
    if (btn) {
      btn.classList.toggle('active', isExploded);
      btn.innerHTML = isExploded ? '<span>🧩</span> Thu Gọn Tòa Nhà' : '<span>🧩</span> Tách Tầng Xem Nội Thất';
    }
  }

  function toggleNight() {
    isNight = !isNight;
    Building3D.setNightMode(isNight);
    const btn = document.getElementById('btn-night');
    if (btn) {
      btn.classList.toggle('active', isNight);
      btn.innerHTML = isNight ? '<span>🌙</span> Ban Đêm' : '<span>☀️</span> Ban Ngày';
    }
  }

  function selectFloor(floorNum) {
    currentFloor = floorNum;
    Building3D.selectFloor(floorNum);
    updateElevatorActive(floorNum);
  }

  function updateElevatorActive(floorNum) {
    document.querySelectorAll('.floor-btn').forEach(btn => {
      const f = parseInt(btn.getAttribute('data-floor'), 10);
      btn.classList.toggle('active', f === floorNum);
    });
  }

  function toggleAutoRotate() {
    Tour360.toggleAutoRotate();
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen error:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  return {
    init,
    switchMode,
    toggle3D,
    goToRoom,
    toggleMenuScroll,
    showPopup,
    closePopup,
    toggleExploded,
    toggleNight,
    selectFloor,
    toggleAutoRotate,
    toggleFullscreen
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  TourApp.init();
});
