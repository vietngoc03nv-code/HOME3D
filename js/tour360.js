/**
 * 360 Virtual Tour Viewer
 * Powered by Three.js with High-Res Cube Texture & 3D Interactive Hotspots
 */

const Tour360 = (function () {
  let scene, camera, renderer;
  let containerEl;
  let isUserInteracting = false;
  let onMouseDownMouseX = 0, onMouseDownMouseY = 0;
  let lon = 0, onMouseDownLon = 0;
  let lat = 0, onMouseDownLat = 0;
  let phi = 0, theta = 0;
  let targetFov = 75;
  let autoRotate = false;
  let currentRoomId = null;
  let animId = null;
  let hotspotsGroup = null;
  let onRoomChangeCallback = null;

  // Rooms Data configuration
  const roomsData = {
    living_room: {
      id: 'living_room',
      title: 'Phòng Khách Sang Trọng',
      thumb: 'assets/panoramas/living_room/thumbnail.jpg',
      radarPos: { x: 50, y: 55 },
      hotspots: [
        { title: 'Ra Ban Công View Phố', targetRoom: 'balcony', lon: 15, lat: -5 },
        { title: 'Khu Bếp & Bàn Ăn', targetRoom: 'kitchen', lon: 145, lat: -6 },
        { title: 'Phòng Ngủ Master', targetRoom: 'master_bedroom', lon: -110, lat: -4 }
      ]
    },
    balcony: {
      id: 'balcony',
      title: 'Ban Công View Panorama',
      thumb: 'assets/panoramas/balcony/thumbnail.jpg',
      radarPos: { x: 50, y: 20 },
      hotspots: [
        { title: 'Trở Vào Phòng Khách', targetRoom: 'living_room', lon: 180, lat: -5 }
      ]
    },
    kitchen: {
      id: 'kitchen',
      title: 'Khu Vực Bếp Hiện Đại',
      thumb: 'assets/panoramas/kitchen/thumbnail.jpg',
      radarPos: { x: 75, y: 70 },
      hotspots: [
        { title: 'Bàn Ăn Gia Đình', targetRoom: 'dining', lon: -30, lat: -4 },
        { title: 'Phòng Khách', targetRoom: 'living_room', lon: -160, lat: -5 }
      ]
    },
    dining: {
      id: 'dining',
      title: 'Bàn Ăn Gia Đình',
      thumb: 'assets/panoramas/dining/thumbnail.jpg',
      radarPos: { x: 65, y: 60 },
      hotspots: [
        { title: 'Khu Vực Bếp', targetRoom: 'kitchen', lon: 120, lat: -6 },
        { title: 'Phòng Khách', targetRoom: 'living_room', lon: -60, lat: -4 }
      ]
    },
    master_bedroom: {
      id: 'master_bedroom',
      title: 'Phòng Ngủ Master',
      thumb: 'assets/panoramas/master_bedroom/thumbnail.jpg',
      radarPos: { x: 25, y: 40 },
      hotspots: [
        { title: 'Phòng Tắm Master', targetRoom: 'bathroom', lon: -140, lat: -8 },
        { title: 'Phòng Khách', targetRoom: 'living_room', lon: 70, lat: -4 }
      ]
    },
    bedroom_2: {
      id: 'bedroom_2',
      title: 'Phòng Ngủ 2',
      thumb: 'assets/panoramas/bedroom_2/thumbnail.jpg',
      radarPos: { x: 25, y: 75 },
      hotspots: [
        { title: 'Lối Ra Phòng Khách', targetRoom: 'living_room', lon: 110, lat: -6 }
      ]
    },
    bathroom: {
      id: 'bathroom',
      title: 'Phòng Tắm & WC Cao Cấp',
      thumb: 'assets/panoramas/bathroom/thumbnail.jpg',
      radarPos: { x: 15, y: 25 },
      hotspots: [
        { title: 'Trở Lại Phòng Master', targetRoom: 'master_bedroom', lon: -40, lat: -5 }
      ]
    }
  };

  function init(container, onRoomChange) {
    containerEl = container;
    onRoomChangeCallback = onRoomChange;

    scene = new THREE.Scene();

    const aspect = containerEl.clientWidth / containerEl.clientHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerEl.clientWidth, containerEl.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerEl.appendChild(renderer.domElement);

    hotspotsGroup = new THREE.Group();
    scene.add(hotspotsGroup);

    // Event listeners
    containerEl.addEventListener('mousedown', onPointerStart, false);
    containerEl.addEventListener('mousemove', onPointerMove, false);
    containerEl.addEventListener('mouseup', onPointerEnd, false);
    containerEl.addEventListener('wheel', onDocumentWheel, { passive: false });

    // Touch events for mobile
    containerEl.addEventListener('touchstart', onTouchStart, { passive: false });
    containerEl.addEventListener('touchmove', onTouchMove, { passive: false });
    containerEl.addEventListener('touchend', onTouchEnd, false);

    window.addEventListener('resize', onResize);

    // Load default room
    loadRoom('living_room');

    animate();
  }

  function loadRoom(roomId) {
    if (!roomsData[roomId]) return;
    currentRoomId = roomId;

    const curtain = document.getElementById('curtain-fade');
    if (curtain) {
      curtain.classList.add('active');
    }

    setTimeout(() => {
      const loader = new THREE.CubeTextureLoader();
      const basePath = `assets/panoramas/${roomId}/`;
      
      // Krpano cube face order mapped to Three.js:
      // px: 1.jpg (right)
      // nx: 3.jpg (left)
      // py: 4.jpg (up)
      // ny: 5.jpg (down)
      // pz: 0.jpg (front)
      // nz: 2.jpg (back)
      const urls = [
        basePath + '1.jpg', // px
        basePath + '3.jpg', // nx
        basePath + '4.jpg', // py
        basePath + '5.jpg', // ny
        basePath + '0.jpg', // pz
        basePath + '2.jpg'  // nz
      ];

      loader.load(urls, texture => {
        scene.background = texture;
        renderHotspots(roomsData[roomId].hotspots);

        if (curtain) {
          curtain.classList.remove('active');
        }

        if (onRoomChangeCallback) {
          onRoomChangeCallback(roomsData[roomId]);
        }
      });
    }, 250);
  }

  function renderHotspots(hotspots) {
    // Clear old HTML hotspots
    const oldContainer = document.getElementById('hotspots-layer');
    if (oldContainer) {
      oldContainer.innerHTML = '';
    }

    if (!hotspots) return;

    hotspots.forEach((hs, idx) => {
      const el = document.createElement('div');
      el.className = 'hotspot-point';
      el.id = `hs-node-${idx}`;
      el.innerHTML = `
        <div class="hotspot-pulse"></div>
        <div class="hotspot-inner">➤</div>
        <div class="hotspot-tooltip">${hs.title}</div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        loadRoom(hs.targetRoom);
      });

      if (oldContainer) {
        oldContainer.appendChild(el);
      }
    });
  }

  function updateHotspotsPosition() {
    if (!currentRoomId || !roomsData[currentRoomId]) return;
    const hotspots = roomsData[currentRoomId].hotspots;
    if (!hotspots || !camera) return;

    const widthHalf = containerEl.clientWidth / 2;
    const heightHalf = containerEl.clientHeight / 2;

    hotspots.forEach((hs, idx) => {
      const el = document.getElementById(`hs-node-${idx}`);
      if (!el) return;

      // Convert lon/lat to 3D Vector
      const phi = THREE.MathUtils.degToRad(90 - hs.lat);
      const theta = THREE.MathUtils.degToRad(hs.lon);
      const radius = 50;

      const pos = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );

      // Project 3D coordinate to 2D screen
      pos.project(camera);

      // Check if behind camera
      if (pos.z > 1) {
        el.style.display = 'none';
      } else {
        el.style.display = 'flex';
        const x = (pos.x * widthHalf) + widthHalf;
        const y = -(pos.y * heightHalf) + heightHalf;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
      }
    });
  }

  function updateRadarCone() {
    const radarCam = document.getElementById('radar-cam-cone');
    const radarDot = document.getElementById('radar-cam-dot');
    if (!radarCam || !currentRoomId) return;

    const room = roomsData[currentRoomId];
    if (room && room.radarPos) {
      if (radarDot) {
        radarDot.style.left = `${room.radarPos.x}%`;
        radarDot.style.top = `${room.radarPos.y}%`;
      }
      radarCam.style.left = `${room.radarPos.x}%`;
      radarCam.style.top = `${room.radarPos.y}%`;
      // Rotate cone with lon
      radarCam.style.transform = `translate(-50%, -100%) rotate(${(-lon + 90)}deg)`;
    }
  }

  function onPointerStart(event) {
    isUserInteracting = true;
    onMouseDownMouseX = event.clientX;
    onMouseDownMouseY = event.clientY;
    onMouseDownLon = lon;
    onMouseDownLat = lat;
  }

  function onPointerMove(event) {
    if (isUserInteracting) {
      lon = (onMouseDownMouseX - event.clientX) * 0.15 + onMouseDownLon;
      lat = (event.clientY - onMouseDownMouseY) * 0.15 + onMouseDownLat;
    }
  }

  function onPointerEnd() {
    isUserInteracting = false;
  }

  function onTouchStart(event) {
    if (event.touches.length === 1) {
      isUserInteracting = true;
      onMouseDownMouseX = event.touches[0].pageX;
      onMouseDownMouseY = event.touches[0].pageY;
      onMouseDownLon = lon;
      onMouseDownLat = lat;
    }
  }

  function onTouchMove(event) {
    if (event.touches.length === 1 && isUserInteracting) {
      event.preventDefault();
      lon = (onMouseDownMouseX - event.touches[0].pageX) * 0.2 + onMouseDownLon;
      lat = (event.touches[0].pageY - onMouseDownMouseY) * 0.2 + onMouseDownLat;
    }
  }

  function onTouchEnd() {
    isUserInteracting = false;
  }

  function onDocumentWheel(event) {
    event.preventDefault();
    targetFov += event.deltaY * 0.05;
    targetFov = Math.max(35, Math.min(95, targetFov));
  }

  function toggleAutoRotate() {
    autoRotate = !autoRotate;
    return autoRotate;
  }

  function onResize() {
    if (!containerEl || !renderer || !camera) return;
    const w = containerEl.clientWidth;
    const h = containerEl.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function animate() {
    animId = requestAnimationFrame(animate);

    if (autoRotate && !isUserInteracting) {
      lon += 0.12;
    }

    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);

    // Smooth FOV zoom
    camera.fov += (targetFov - camera.fov) * 0.1;
    camera.updateProjectionMatrix();

    // Look at target point
    const target = new THREE.Vector3();
    target.x = 500 * Math.sin(phi) * Math.cos(theta);
    target.y = 500 * Math.cos(phi);
    target.z = 500 * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(target);

    // Update screen-space hotspots and radar
    updateHotspotsPosition();
    updateRadarCone();

    renderer.render(scene, camera);
  }

  function dispose() {
    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener('resize', onResize);
    const oldContainer = document.getElementById('hotspots-layer');
    if (oldContainer) oldContainer.innerHTML = '';
    if (renderer && renderer.domElement && containerEl) {
      containerEl.removeChild(renderer.domElement);
      renderer.dispose();
    }
  }

  return {
    init,
    loadRoom,
    toggleAutoRotate,
    dispose,
    onResize,
    getRooms: () => roomsData
  };
})();
