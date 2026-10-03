/**
 * Master 360 Virtual Tour Engine - LUFFY HOME DANANG
 * 1:1 Exact Match to Reference Design (Flycam Aerial Ocean Perspective)
 */

const Master360App = (function () {
  let scene, camera, renderer;
  let containerEl;
  let isUserInteracting = false;
  let onMouseDownMouseX = 0, onMouseDownMouseY = 0;
  let lon = 0, onMouseDownLon = 0;
  let lat = -5, onMouseDownLat = -5;
  let phi = 0, theta = 0;
  let targetFov = 90;
  let autoRotate = false;
  let animId = null;

  // Exact landmarks matching Image 2 reference layout
  const landmarksData = [
    {
      id: 'huong_hoi_an',
      title: 'Hướng Đi Hội An <',
      lon: -75.0,
      lat: -10.0,
      dotAtEnd: true
    },
    {
      id: 'sheraton',
      title: 'Sheraton Grand Danang Resort',
      lon: -38.0,
      lat: -15.0,
      dotAtEnd: false
    },
    {
      id: 'marriott',
      title: 'Marriott Resort',
      lon: -58.0,
      lat: -4.0,
      dotAtEnd: false
    },
    {
      id: 'duong_truong_sa',
      title: 'Đường Trường Sa',
      lon: 14.0,
      lat: -26.0,
      dotAtEnd: false
    },
    {
      id: 'huong_san_bay',
      title: 'Hướng Đi Sân Bay Quốc Tế Đà Nẵng >',
      lon: 35.0,
      lat: -18.0,
      dotAtEnd: false
    },
    {
      id: 'bai_tam_tan_tra',
      title: 'Bãi Tắm Tân Trà',
      lon: 26.0,
      lat: -38.0,
      dotAtEnd: false
    },
    {
      id: 'danang_golf',
      title: 'Legend Danang Golf Resort',
      lon: 60.0,
      lat: -12.0,
      dotAtEnd: false
    },
    {
      id: 'ngu_hanh_son',
      title: 'Núi Ngũ Hành Sơn',
      lon: 85.0,
      lat: 12.0,
      dotAtEnd: false
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

    // Build 360 Sphere Panorama with high-res texture
    const sphereGeo = new THREE.SphereGeometry(500, 64, 40);
    sphereGeo.scale(-1, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/panoramas/master_aerial/aerial_360_master.jpg', function (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      const sphereMat = new THREE.MeshBasicMaterial({ map: texture });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      // Align texture center (u = 0.5) perfectly with lon = 0
      sphereMesh.rotation.y = Math.PI;
      scene.add(sphereMesh);

      // Remove loading curtain
      const curtain = document.getElementById('curtain-fade');
      if (curtain) {
        curtain.classList.remove('active');
      }
    });

    // Create 3D Projected Hotspots matching Reference
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

  function get3DPos(lonDeg, latDeg, radius = 450) {
    const phiRad = THREE.MathUtils.degToRad(90 - latDeg);
    const thetaRad = THREE.MathUtils.degToRad(lonDeg);
    return new THREE.Vector3(
      radius * Math.sin(phiRad) * Math.cos(thetaRad),
      radius * Math.cos(phiRad),
      radius * Math.sin(phiRad) * Math.sin(thetaRad)
    );
  }

  function createHotspots() {
    const layer = document.getElementById('hotspots-layer');
    if (!layer) return;
    layer.innerHTML = '';
    hotspotElements.length = 0;

    // 1. Central Hero Building Badge (Clean Emblem + Pin Line directly on top of LUFFY HOME)
    const heroEl = document.createElement('div');
    heroEl.className = 'hero-building-badge';
    heroEl.innerHTML = `
      <div class="hero-circle-logo">
        <img src="assets/trang-chu/logo_badge_emblem.svg" alt="LUFFY HOME" />
        <div class="hero-name">LUFFY HOME</div>
        <div class="hero-sub">DANANG</div>
      </div>
      <div class="hero-pin-line"></div>
      <div class="hero-pin-dot"></div>
      <div class="hero-slogan-label">CĂN HỘ MẶT BIỂN SỞ HỮU LÂU DÀI CAO CẤP TẠI ĐÀ NẴNG</div>
    `;
    heroEl.addEventListener('click', () => zoomAndNavigate('tour'));
    layer.appendChild(heroEl);
    hotspotElements.push({
      domEl: heroEl,
      pos3D: get3DPos(0, 12.0)
    });

    // 2. "Xem Căn Mẫu" Isometric Roof Beacon (Down in the sea water in front of building)
    const sampleEl = document.createElement('div');
    sampleEl.className = 'view-sample-hotspot';
    sampleEl.innerHTML = `
      <div class="roof-icon-box">
        <svg viewBox="0 0 48 32" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="4 22 24 10 44 22"></polyline>
          <polyline points="10 26 24 17 38 26"></polyline>
          <polyline points="16 30 24 24 32 30"></polyline>
        </svg>
      </div>
      <div class="view-sample-text">Xem Căn Mẫu</div>
    `;
    sampleEl.addEventListener('click', () => zoomAndNavigate('tour'));
    layer.appendChild(sampleEl);
    hotspotElements.push({
      domEl: sampleEl,
      pos3D: get3DPos(0, -45.0)
    });

    // 3. Surrounding Landmark Hotspots
    landmarksData.forEach(item => {
      const el = document.createElement('div');
      el.className = 'landmark-hotspot';
      if (item.dotAtEnd) {
        el.innerHTML = `<span>${item.title}</span><div class="landmark-dot"></div>`;
      } else {
        el.innerHTML = `<div class="landmark-dot"></div><span>${item.title}</span>`;
      }
      layer.appendChild(el);
      hotspotElements.push({
        domEl: el,
        pos3D: get3DPos(item.lon, item.lat)
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

      // Only display if in front of camera view
      if (v.z < 1) {
        const x = (v.x * 0.5 + 0.5) * width;
        const y = (-(v.y * 0.5) + 0.5) * height;

        if (x >= -120 && x <= width + 120 && y >= -120 && y <= height + 120) {
          item.domEl.style.display = item.domEl.classList.contains('hero-building-badge') ? 'flex' : (item.domEl.classList.contains('view-sample-hotspot') ? 'flex' : 'flex');
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
    if (curtain) curtain.classList.add('active');

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
    lat = Math.max(-80, Math.min(80, lat));
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
    lat = Math.max(-80, Math.min(80, lat));
  }

  function onTouchEnd() {
    isUserInteracting = false;
  }

  function onDocumentWheel(e) {
    e.preventDefault();
    targetFov += e.deltaY * 0.05;
    targetFov = Math.max(55, Math.min(105, targetFov));
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
      lon += 0.06;
    }

    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov += (targetFov - camera.fov) * 0.1;
      camera.updateProjectionMatrix();
    }

    lat = Math.max(-80, Math.min(80, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);

    const targetX = 500 * Math.sin(phi) * Math.cos(theta);
    const targetY = 500 * Math.cos(phi);
    const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(targetX, targetY, targetZ);
    renderer.render(scene, camera);

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
