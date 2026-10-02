/**
 * Main Application Orchestrator - LUFFY HOME
 * Connects 3D Building Exterior with Detailed Furniture, 360 Tour Interiors, and UI Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('canvas-container');
  let currentMode = '3d_building'; // '3d_building' | 'tour_360'
  let currentFloor = 5;
  let isNight = false;

  // DOM Elements
  const btnMode3D = document.getElementById('btn-mode-3d');
  const btnModeTour = document.getElementById('btn-mode-tour');
  const btnExplode = document.getElementById('btn-explode');
  const btnNight = document.getElementById('btn-night');
  const btnAutoRotate = document.getElementById('btn-auto-rotate');
  const btnFloorplan = document.getElementById('btn-floorplan');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnInfo = document.getElementById('btn-info');
  const btnContact = document.getElementById('btn-contact');

  const buildingControlsBar = document.getElementById('building-controls');
  const floorElevator = document.getElementById('floor-elevator');
  const bottomRoomBar = document.getElementById('bottom-room-bar');
  const floorplanBox = document.getElementById('floorplan-box');
  const floor3dPopup = document.getElementById('floor-3d-popup');
  const fBadgeTitle = document.getElementById('f-badge-title');
  const fBadgeSub = document.getElementById('f-badge-sub');
  const fBadgeFurn = document.getElementById('f-badge-furn');
  const btnEnterTour = document.getElementById('btn-enter-tour');

  // Modals
  const modalInfo = document.getElementById('modal-info');
  const modalContact = document.getElementById('modal-contact');
  const modalCloses = document.querySelectorAll('.modal-close');

  // Check URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const paramFloor = parseInt(urlParams.get('floor'), 10);
  const paramMode = urlParams.get('mode');

  if (paramFloor && paramFloor >= 1 && paramFloor <= 9) {
    currentFloor = paramFloor;
  }

  if (paramMode === 'tour') {
    init360TourMode();
  } else {
    init3DBuildingMode();
  }

  function init3DBuildingMode() {
    currentMode = '3d_building';
    btnMode3D.classList.add('active');
    btnModeTour.classList.remove('active');

    buildingControlsBar.style.display = 'flex';
    bottomRoomBar.style.display = 'none';
    floorplanBox.classList.add('hidden');
    document.getElementById('hotspots-layer').innerHTML = '';

    Building3D.init(container, (floorInfo) => {
      currentFloor = floorInfo.floor;
      updateElevatorActive(currentFloor);
      showFloor3DPopup(floorInfo);
    });

    Building3D.setNightMode(isNight);
    Building3D.selectFloor(currentFloor);
  }

  function init360TourMode() {
    currentMode = 'tour_360';
    btnModeTour.classList.add('active');
    btnMode3D.classList.remove('active');

    buildingControlsBar.style.display = 'none';
    bottomRoomBar.style.display = 'flex';
    floor3dPopup.classList.add('hidden');

    if (Building3D.dispose) Building3D.dispose();
    else if (Building3D.destroy) Building3D.destroy();

    Tour360.init(container, (room) => {
      updateActiveRoomCard(room.id);
    });

    renderRoomThumbnails();
  }

  function showFloor3DPopup(info) {
    fBadgeTitle.textContent = `Tầng ${info.floor}: ${info.title}`;
    fBadgeSub.textContent = `${info.type} • ${info.area}`;
    if (fBadgeFurn && info.furniture) {
      fBadgeFurn.textContent = `Nội thất & Tiện nghi: ${info.furniture}`;
    }
    floor3dPopup.classList.remove('hidden');
  }

  function updateElevatorActive(floorNum) {
    document.querySelectorAll('.floor-btn').forEach(btn => {
      const f = parseInt(btn.getAttribute('data-floor'), 10);
      btn.classList.toggle('active', f === floorNum);
    });
  }

  function renderRoomThumbnails() {
    bottomRoomBar.innerHTML = '';
    const rooms = Tour360.getRooms();

    Object.keys(rooms).forEach(key => {
      const r = rooms[key];
      const card = document.createElement('div');
      card.className = 'room-card';
      card.id = `room-card-${r.id}`;
      card.innerHTML = `
        <img src="${r.thumb}" alt="${r.title}" />
        <span>${r.title}</span>
      `;
      card.addEventListener('click', () => {
        Tour360.loadRoom(r.id);
      });
      bottomRoomBar.appendChild(card);
    });
  }

  function updateActiveRoomCard(roomId) {
    document.querySelectorAll('.room-card').forEach(card => {
      card.classList.remove('active');
    });
    const activeCard = document.getElementById(`room-card-${roomId}`);
    if (activeCard) {
      activeCard.classList.add('active');
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // Mode Switching
  btnMode3D.addEventListener('click', () => {
    if (currentMode === '3d_building') return;
    Tour360.dispose();
    init3DBuildingMode();
  });

  btnModeTour.addEventListener('click', () => {
    if (currentMode === 'tour_360') return;
    init360TourMode();
  });

  btnEnterTour.addEventListener('click', () => {
    init360TourMode();
  });

  // Elevator buttons
  document.querySelectorAll('.floor-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = parseInt(btn.getAttribute('data-floor'), 10);
      currentFloor = f;
      updateElevatorActive(f);

      if (currentMode === '3d_building') {
        Building3D.selectFloor(f);
      } else {
        const curtain = document.getElementById('curtain-fade');
        curtain.classList.add('active');
        setTimeout(() => {
          curtain.classList.remove('active');
          if (f === 1) Tour360.loadRoom('living_room');
          else if (f === 9) Tour360.loadRoom('balcony');
          else if (f >= 7) Tour360.loadRoom('master_bedroom');
          else Tour360.loadRoom('living_room');
        }, 300);
      }
    });
  });

  // Exploded View Button
  btnExplode.addEventListener('click', () => {
    if (currentMode === '3d_building') {
      const exploded = Building3D.toggleExploded();
      btnExplode.classList.toggle('active', exploded);
    }
  });

  // Day/Night switch
  btnNight.addEventListener('click', () => {
    isNight = !isNight;
    btnNight.textContent = isNight ? '🌙' : '☀️';
    btnNight.classList.toggle('active', !isNight);
    if (currentMode === '3d_building') {
      Building3D.setNightMode(isNight);
    }
  });

  // Auto Rotate in 360 Tour
  btnAutoRotate.addEventListener('click', () => {
    if (currentMode === 'tour_360') {
      const auto = Tour360.toggleAutoRotate();
      btnAutoRotate.classList.toggle('active', auto);
    }
  });

  // Floorplan Toggle
  btnFloorplan.addEventListener('click', () => {
    floorplanBox.classList.toggle('hidden');
    btnFloorplan.classList.toggle('active', !floorplanBox.classList.contains('hidden'));
  });

  const fpClose = document.querySelector('.floorplan-close');
  if (fpClose) {
    fpClose.addEventListener('click', () => {
      floorplanBox.classList.add('hidden');
      btnFloorplan.classList.remove('active');
    });
  }

  // Fullscreen Toggle
  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Modals
  btnInfo.addEventListener('click', () => {
    modalInfo.classList.add('active');
  });

  btnContact.addEventListener('click', () => {
    modalContact.classList.add('active');
  });

  modalCloses.forEach(btn => {
    btn.addEventListener('click', () => {
      modalInfo.classList.remove('active');
      modalContact.classList.remove('active');
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  const contactForm = document.getElementById('booking-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Cảm ơn bạn đã gửi yêu cầu! Ban quản lý LUFFY HOME sẽ gọi lại tư vấn và hỗ trợ bạn trong ít phút.');
      modalContact.classList.remove('active');
    });
  }
});
