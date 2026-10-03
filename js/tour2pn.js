/**
 * 360 Virtual Tour Viewer - CĂN HỘ 2PN (LUFFY HOME DANANG)
 * Powered by Three.js with High-Res Cube Texture & 3D Interactive Hotspots
 */

const Tour2PN = (function () {
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
  let onRoomChangeCallback = null;

  // 8 Rooms Configuration for Căn Hộ 2PN
  const roomsData = {
    phong_khach: {
      id: 'phong_khach',
      title: 'Phòng Khách Sang Trọng',
      thumb: 'assets/panoramas_2pn/phong_khach/thumbnail.jpg',
      radarPos: { x: 45, y: 55 },
      hotspots: [
        { title: 'Ra Ban Công View Biển', targetRoom: 'ban_cong', lon: -15, lat: -6 },
        { title: 'Khu Vực Bếp Hiện Đại', targetRoom: 'bep', lon: 155, lat: -8 },
        { title: 'Bàn Ăn Gia Đình', targetRoom: 'ban_an', lon: 130, lat: -6 },
        { title: 'Phòng Ngủ Master', targetRoom: 'phong_master', lon: -110, lat: -5 },
        { title: 'Phòng Ngủ 2', targetRoom: 'phong_ngu_2', lon: -60, lat: -5 },
        { title: 'WC Chung', targetRoom: 'wc_chung', lon: 175, lat: -6 }
      ]
    },
    ban_cong: {
      id: 'ban_cong',
      title: 'Ban Công View Biển Mỹ Khê',
      thumb: 'assets/panoramas_2pn/ban_cong/thumbnail.jpg',
      radarPos: { x: 45, y: 22 },
      hotspots: [
        { title: 'Trở Vào Phòng Khách', targetRoom: 'phong_khach', lon: 180, lat: -5 }
      ]
    },
    bep: {
      id: 'bep',
      title: 'Khu Vực Bếp Hiện Đại',
      thumb: 'assets/panoramas_2pn/bep/thumbnail.jpg',
      radarPos: { x: 75, y: 72 },
      hotspots: [
        { title: 'Bàn Ăn Gia Đình', targetRoom: 'ban_an', lon: -30, lat: -5 },
        { title: 'Phòng Khách', targetRoom: 'phong_khach', lon: -150, lat: -6 }
      ]
    },
    ban_an: {
      id: 'ban_an',
      title: 'Bàn Ăn Gia Đình',
      thumb: 'assets/panoramas_2pn/ban_an/thumbnail.jpg',
      radarPos: { x: 65, y: 58 },
      hotspots: [
        { title: 'Khu Vực Bếp', targetRoom: 'bep', lon: 120, lat: -6 },
        { title: 'Phòng Khách', targetRoom: 'phong_khach', lon: -60, lat: -5 }
      ]
    },
    phong_master: {
      id: 'phong_master',
      title: 'Phòng Ngủ Master',
      thumb: 'assets/panoramas_2pn/phong_master/thumbnail.jpg',
      radarPos: { x: 25, y: 40 },
      hotspots: [
        { title: 'Phòng Tắm & WC Master', targetRoom: 'wc_master', lon: -130, lat: -8 },
        { title: 'Lối Ra Phòng Khách', targetRoom: 'phong_khach', lon: 70, lat: -5 }
      ]
    },
    phong_ngu_2: {
      id: 'phong_ngu_2',
      title: 'Phòng Ngủ 2',
      thumb: 'assets/panoramas_2pn/phong_ngu_2/thumbnail.jpg',
      radarPos: { x: 25, y: 75 },
      hotspots: [
        { title: 'Lối Ra Phòng Khách', targetRoom: 'phong_khach', lon: 110, lat: -6 }
      ]
    },
    wc_chung: {
      id: 'wc_chung',
      title: 'Phòng Tắm & WC Chung',
      thumb: 'assets/panoramas_2pn/wc_chung/thumbnail.jpg',
      radarPos: { x: 80, y: 35 },
      hotspots: [
        { title: 'Trở Lại Phòng Khách', targetRoom: 'phong_khach', lon: 0, lat: -5 }
      ]
    },
    wc_master: {
      id: 'wc_master',
      title: 'Phòng Tắm & WC Master',
      thumb: 'assets/panoramas_2pn/wc_master/thumbnail.jpg',
      radarPos: { x: 15, y: 25 },
      hotspots: [
        { title: 'Trở Lại Phòng Master', targetRoom: 'phong_master', lon: -40, lat: -5 }
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

    // Event listeners
    containerEl.addEventListener('mousedown', onPointerStart, false);
    containerEl.addEventListener('mousemove', onPointerMove, false);
    containerEl.addEventListener('mouseup', onPointerEnd, false);
    containerEl.addEventListener('wheel', onDocumentWheel, { passive: false });

    containerEl.addEventListener('touchstart', onTouchStart, { passive: false });
    containerEl.addEventListener('touchmove', onTouchMove, { passive: false });
    containerEl.addEventListener('touchend', onTouchEnd, false);

    window.addEventListener('resize', onResize);

    // Load default room
    loadRoom('phong_khach');

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
      const basePath = `assets/panoramas_2pn/${roomId}/`;
      
      // Krpano cube face order mapped to Three.js:
      // px: 1.jpg (right), nx: 3.jpg (left)
      // py: 4.jpg (up),    ny: 5.jpg (down)
      // pz: 0.jpg (front), nz: 2.jpg (back)
      const urls = [
        basePath + '1.jpg',
        basePath + '3.jpg',
        basePath + '4.jpg',
        basePath + '5.jpg',
        basePath + '0.jpg',
        basePath + '2.jpg'
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
    const oldContainer = document.getElementById('hotspots-layer');
    if (oldContainer) {
      oldContainer.innerHTML = '';
    }
    if (!hotspots || !hotspots.length) return;

    hotspots.forEach(h => {
      const el = document.createElement('div');
      el.className = 'hotspot-point';
      el.dataset.targetRoom = h.targetRoom;
      el.dataset.lon = h.lon;
      el.dataset.lat = h.lat;

      el.innerHTML = `
        <div class="hotspot-pulse"></div>
        <div class="hotspot-inner">➤</div>
        <div class="hotspot-tooltip">${h.title}</div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        loadRoom(h.targetRoom);
      });

      oldContainer.appendChild(el);
    });

    updateHotspotsDOM();
  }

  function updateHotspotsDOM() {
    const container = document.getElementById('hotspots-layer');
    if (!container || !camera) return;

    const markers = container.getElementsByClassName('hotspot-point');
    const widthHalf = containerEl.clientWidth / 2;
    const heightHalf = containerEl.clientHeight / 2;

    for (let i = 0; i < markers.length; i++) {
      const el = markers[i];
      const hLon = parseFloat(el.dataset.lon);
      const hLat = parseFloat(el.dataset.lat);

      const hPhi = THREE.MathUtils.degToRad(90 - hLat);
      const hTheta = THREE.MathUtils.degToRad(hLon);

      const radius = 50;
      const x = radius * Math.sin(hPhi) * Math.cos(hTheta);
      const y = radius * Math.cos(hPhi);
      const z = radius * Math.sin(hPhi) * Math.sin(hTheta);

      const vector = new THREE.Vector3(x, y, z);
      vector.project(camera);

      if (vector.z < 1) {
        const sx = (vector.x * widthHalf) + widthHalf;
        const sy = -(vector.y * heightHalf) + heightHalf;

        el.style.display = 'flex';
        el.style.left = `${sx}px`;
        el.style.top = `${sy}px`;
      } else {
        el.style.display = 'none';
      }
    }
  }

  function onPointerStart(e) {
    isUserInteracting = true;
    onMouseDownMouseX = e.clientX;
    onMouseDownMouseY = e.clientY;
    onMouseDownLon = lon;
    onMouseDownLat = lat;
  }

  function onPointerMove(e) {
    if (!isUserInteracting) return;
    lon = (onMouseDownMouseX - e.clientX) * 0.15 + onMouseDownLon;
    lat = (e.clientY - onMouseDownMouseY) * 0.15 + onMouseDownLat;
    lat = Math.max(-85, Math.min(85, lat));
  }

  function onPointerEnd() {
    isUserInteracting = false;
  }

  function onTouchStart(e) {
    if (e.touches.length === 1) {
      isUserInteracting = true;
      onMouseDownMouseX = e.touches[0].pageX;
      onMouseDownMouseY = e.touches[0].pageY;
      onMouseDownLon = lon;
      onMouseDownLat = lat;
    }
  }

  function onTouchMove(e) {
    if (!isUserInteracting || e.touches.length !== 1) return;
    lon = (onMouseDownMouseX - e.touches[0].pageX) * 0.18 + onMouseDownLon;
    lat = (e.touches[0].pageY - onMouseDownMouseY) * 0.18 + onMouseDownLat;
    lat = Math.max(-85, Math.min(85, lat));
  }

  function onTouchEnd() {
    isUserInteracting = false;
  }

  function onDocumentWheel(e) {
    e.preventDefault();
    targetFov += e.deltaY * 0.05;
    targetFov = Math.max(40, Math.min(95, targetFov));
  }

  function onResize() {
    if (!containerEl || !camera || !renderer) return;
    camera.aspect = containerEl.clientWidth / containerEl.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(containerEl.clientWidth, containerEl.clientHeight);
  }

  function animate() {
    animId = requestAnimationFrame(animate);

    if (autoRotate && !isUserInteracting) {
      lon += 0.08;
    }

    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov += (targetFov - camera.fov) * 0.1;
      camera.updateProjectionMatrix();
    }

    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);

    const targetX = 500 * Math.sin(phi) * Math.cos(theta);
    const targetY = 500 * Math.cos(phi);
    const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(targetX, targetY, targetZ);
    renderer.render(scene, camera);

    updateHotspotsDOM();
  }

  function toggleAutoRotate() {
    autoRotate = !autoRotate;
    return autoRotate;
  }

  function getRooms() {
    return roomsData;
  }

  function getCurrentRoom() {
    return roomsData[currentRoomId];
  }

  function getCameraHeading() {
    let heading = lon % 360;
    if (heading < 0) heading += 360;
    return heading;
  }

  function destroy() {
    if (animId) cancelAnimationFrame(animId);
    if (renderer && renderer.domElement && containerEl) {
      containerEl.removeChild(renderer.domElement);
    }
  }

  return {
    init: init,
    loadRoom: loadRoom,
    toggleAutoRotate: toggleAutoRotate,
    getRooms: getRooms,
    getCurrentRoom: getCurrentRoom,
    getCameraHeading: getCameraHeading,
    destroy: destroy
  };
})();
