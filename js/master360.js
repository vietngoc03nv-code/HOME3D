/**
 * Master 360 Virtual Tour Engine - LUFFY HOME DANANG
 * High-performance Three.js WebGL Panoramic Sphere with 3D Projected Hotspots
 */

const Master360App = (function () {
  let scene, camera, renderer;
  let containerEl;
  let isUserInteracting = false;
  let onMouseDownMouseX = 0, onMouseDownMouseY = 0;
  let lon = 15, onMouseDownLon = 15;
  let lat = -10, onMouseDownLat = -10;
  let phi = 0, theta = 0;
  let targetFov = 75;
  let autoRotate = false;
  let animId = null;

  // 11 Master Hotspots matching Reference Layout & Da Nang geography
  const hotspotsData = [
    {
      id: 'building',
      title: 'TÒA THÁP LUFFY HOME',
      subtitle: '👉 Bấm để Khám Phá Căn Hộ Mẫu 360°',
      isHero: true,
      lon: 8,
      lat: -14,
      onClick: function () {
        zoomAndNavigate('tour');
      }
    },
    {
      id: 'ngu_hanh_son',
      title: '⛰️ Núi Ngũ Hành Sơn',
      subtitle: 'Danh thắng quốc gia đặc biệt',
      isHero: false,
      lon: 155,
      lat: -6
    },
    {
      id: 'bien_my_khe',
      title: '🏖️ Bãi Tắm Tân Trà & Biển Mỹ Khê',
      subtitle: 'Bãi biển cát trắng tuyệt đẹp',
      isHero: false,
      lon: -48,
      lat: -12
    },
    {
      id: 'danang_golf',
      title: '⛳ Legend Danang Golf Resort',
      subtitle: 'Sân gôn 36 hố đẳng cấp quốc tế',
      isHero: false,
      lon: 38,
      lat: -16
    },
    {
      id: 'sheraton',
      title: '🏨 Sheraton Grand Danang Resort',
      subtitle: 'Tổ hợp nghỉ dưỡng 5 sao ven biển',
      isHero: false,
      lon: 65,
      lat: -10
    },
    {
      id: 'duong_truong_sa',
      title: '🛣️ Đường Trường Sa',
      subtitle: 'Tuyến đại lộ du lịch biển tỷ đô',
      isHero: false,
      lon: -3,
      lat: -28
    },
    {
      id: 'huong_hoi_an',
      title: '⛩️ Hướng Đi Phố Cổ Hội An',
      subtitle: 'Khoảng cách 15 phút di chuyển',
      isHero: false,
      lon: -20,
      lat: -2
    },
    {
      id: 'huong_san_bay',
      title: '✈️ Sân Bay Quốc Tế Đà Nẵng',
      subtitle: 'Khoảng cách 15 phút di chuyển',
      isHero: false,
      lon: 215,
      lat: 6
    },
    {
      id: 'cau_rong',
      title: '🌉 Trung Tâm TP & Cầu Rồng',
      subtitle: 'Kết nối trực tiếp trung tâm thành phố',
      isHero: false,
      lon: 185,
      lat: 2
    },
    {
      id: 'canh_quan_sanh',
      title: '🌴 Sảnh Đón & Cảnh Quan Nhiệt Đới',
      subtitle: 'Không gian sống xanh chuẩn resort',
      isHero: false,
      lon: 18,
      lat: -30
    }
  ];

  const hotspotElements = [];

  function init(container) {
    containerEl = container;

    // Scene & Camera
    scene = new THREE.Scene();
    const aspect = containerEl.clientWidth / containerEl.clientHeight;
    camera = new THREE.PerspectiveCamera(targetFov, aspect, 0.1, 1000);
    camera.position.set(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(containerEl.clientWidth, containerEl.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerEl.appendChild(renderer.domElement);

    // Build 360 Sphere Panorama
    const sphereGeo = new THREE.SphereGeometry(500, 60, 40);
    sphereGeo.scale(-1, 1, 1); // Invert normals so texture faces inwards

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/panoramas/master_aerial/aerial_360_master.jpg', function (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      const sphereMat = new THREE.MeshBasicMaterial({ map: texture });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(sphereMesh);

      // Remove loading curtain
      const curtain = document.getElementById('curtain-fade');
      if (curtain) {
        curtain.classList.remove('active');
      }
    });

    // Create Hotspots DOM elements & register 3D positions
    createHotspots();

    // Event listeners
    containerEl.addEventListener('mousedown', onPointerStart, false);
    window.addEventListener('mousemove', onPointerMove, false);
    window.addEventListener('mouseup', onPointerEnd, false);
    containerEl.addEventListener('wheel', onDocumentWheel, { passive: false });

    containerEl.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, false);

    window.addEventListener('resize', onResize);

    animate();
  }

  function createHotspots() {
    const layer = document.getElementById('hotspots-layer');
    if (!layer) return;
    layer.innerHTML = '';
    hotspotElements.length = 0;

    hotspotsData.forEach(item => {
      // Calculate 3D sphere coordinate
      const phiRad = THREE.MathUtils.degToRad(90 - item.lat);
      const thetaRad = THREE.MathUtils.degToRad(item.lon);
      const radius = 450;
      const pos3D = new THREE.Vector3(
        radius * Math.sin(phiRad) * Math.cos(thetaRad),
        radius * Math.cos(phiRad),
        radius * Math.sin(phiRad) * Math.sin(thetaRad)
      );

      // Create DOM element
      const beacon = document.createElement('div');
      beacon.className = 'hotspot-beacon ' + (item.isHero ? 'hotspot-building' : '');

      let html = `
        <div class="hotspot-inner"></div>
        <div class="hotspot-pulse"></div>
        <div class="hotspot-card">
          <div style="font-size: ${item.isHero ? '14px' : '13px'}; font-weight: 700;">${item.title}</div>
          <div style="font-size: 11px; opacity: 0.85; margin-top: 2px;">${item.subtitle}</div>
        </div>
      `;
      beacon.innerHTML = html;

      if (item.onClick) {
        beacon.addEventListener('click', item.onClick);
      }

      layer.appendChild(beacon);

      hotspotElements.push({
        domEl: beacon,
        pos3D: pos3D
      });
    });
  }

  function updateHotspots() {
    if (!containerEl || !camera) return;
    const width = containerEl.clientWidth;
    const height = containerEl.clientHeight;

    hotspotElements.forEach(item => {
      const v = item.pos3D.clone();
      v.project(camera);

      // Only show if in front of camera
      if (v.z < 1) {
        const x = (v.x * 0.5 + 0.5) * width;
        const y = (-(v.y * 0.5) + 0.5) * height;

        // Clip within screen bounds
        if (x >= -50 && x <= width + 50 && y >= -50 && y <= height + 50) {
          item.domEl.style.display = 'block';
          item.domEl.style.left = `${x}px`;
          item.domEl.style.top = `${y}px`;
        } else {
          item.domEl.style.display = 'none';
        }
      } else {
        item.domEl.style.display = 'none';
      }
    });
  }

  function zoomAndNavigate(targetUrl) {
    const curtain = document.getElementById('curtain-fade');
    if (curtain) {
      curtain.classList.add('active');
    }
    // Animate zoom in
    const startTime = performance.now();
    const startFov = camera.fov;
    function zoomStep(now) {
      const elapsed = (now - startTime) / 600;
      if (elapsed < 1) {
        camera.fov = startFov + (35 - startFov) * elapsed;
        camera.updateProjectionMatrix();
        requestAnimationFrame(zoomStep);
      } else {
        window.location.href = targetUrl;
      }
    }
    requestAnimationFrame(zoomStep);
  }

  function onPointerStart(e) {
    isUserInteracting = true;
    onMouseDownMouseX = e.clientX;
    onMouseDownMouseY = e.clientY;
    onMouseDownLon = lon;
    onMouseDownLat = lat;
    if (containerEl) containerEl.classList.add('grabbing');
  }

  function onPointerMove(e) {
    if (!isUserInteracting) return;
    lon = (onMouseDownMouseX - e.clientX) * 0.15 + onMouseDownLon;
    lat = (e.clientY - onMouseDownMouseY) * 0.15 + onMouseDownLat;
    lat = Math.max(-85, Math.min(85, lat));
  }

  function onPointerEnd() {
    isUserInteracting = false;
    if (containerEl) containerEl.classList.remove('grabbing');
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
    targetFov = Math.max(45, Math.min(95, targetFov));
  }

  function onResize() {
    if (!containerEl || !camera || !renderer) return;
    camera.aspect = containerEl.clientWidth / containerEl.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(containerEl.clientWidth, containerEl.clientHeight);
  }

  function animate() {
    animId = requestAnimationFrame(animate);

    // Auto rotate
    if (autoRotate && !isUserInteracting) {
      lon += 0.08;
    }

    // Smooth FOV zoom
    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov += (targetFov - camera.fov) * 0.1;
      camera.updateProjectionMatrix();
    }

    // Smooth spherical lookAt
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);

    const targetX = 500 * Math.sin(phi) * Math.cos(theta);
    const targetY = 500 * Math.cos(phi);
    const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(targetX, targetY, targetZ);
    renderer.render(scene, camera);

    // Update hotspots
    updateHotspots();
  }

  function toggleAutoRotate() {
    autoRotate = !autoRotate;
    return autoRotate;
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  function showPopup(type) {
    const popup = document.getElementById('popup');
    const info = document.getElementById('popupInfo');
    const video = document.getElementById('popupVideo');
    const floorplan = document.getElementById('popupFloorplan');

    if (!popup) return;

    if (info) info.classList.remove('show');
    if (video) video.classList.remove('show');
    if (floorplan) floorplan.classList.remove('show');

    if (type === 'popupInfo' && info) info.classList.add('show');
    if (type === 'popupVideo' && video) video.classList.add('show');
    if (type === 'popupFloorplan' && floorplan) floorplan.classList.add('show');

    popup.classList.add('show');
  }

  function togglePopup(show) {
    const popup = document.getElementById('popup');
    if (popup) {
      if (show) popup.classList.add('show');
      else popup.classList.remove('show');
    }
  }

  return {
    init: init,
    toggleAutoRotate: toggleAutoRotate,
    toggleFullscreen: toggleFullscreen,
    showPopup: showPopup,
    togglePopup: togglePopup
  };
})();
