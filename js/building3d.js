/**
 * 3D 9-Story Building Interactive Architecture
 * Powered by Three.js - LUFFY HOME
 * Featuring Full Architectural Interior Furniture ("Đồ nội thất chi tiết")
 */

const Building3D = (function () {
  let scene, camera, renderer, controls;
  let containerEl;
  let floorGroups = [];
  let isExploded = false;
  let isNight = false;
  let raycaster, mouse;
  let hoveredFloor = null;
  let selectedFloor = null;
  let onFloorClickCallback = null;
  let animId = null;

  const FLOOR_COUNT = 9;
  const FLOOR_HEIGHT = 4.2;
  const BUILDING_WIDTH = 26;
  const BUILDING_DEPTH = 20;

  const floorData = [
    { 
      floor: 1, 
      title: 'Sảnh Đón Khách & Lễ Tân 5 Sao', 
      type: 'Grand Lobby & Concierge', 
      area: '260 m²', 
      height: 0,
      furniture: 'Quầy lễ tân đá Marble, Sofa chờ da bò nhập khẩu, Sảnh thang máy mạ vàng, Tiểu cảnh cây xanh'
    },
    { 
      floor: 2, 
      title: 'Căn Hộ Studio Deluxe Tầng 2', 
      type: '1 Phòng Ngủ - 1 WC', 
      area: '55 m²', 
      height: 1,
      furniture: 'Giường Queen Size 1m8, Sofa văng nỉ, Bàn trà tròn, Tủ bếp Acrylic + Bar đảo, Smart TV 55 inch'
    },
    { 
      floor: 3, 
      title: 'Căn Hộ Studio Deluxe Tầng 3', 
      type: '1 Phòng Ngủ - 1 WC', 
      area: '55 m²', 
      height: 2,
      furniture: 'Full nội thất thông minh: Giường ngủ có ngăn kéo, Bàn ăn gấp gọn, Tủ áo cánh kính, Sofa giường'
    },
    { 
      floor: 4, 
      title: 'Căn Hộ Tiêu Chuẩn 2PN Tầng 4', 
      type: '2 Phòng Ngủ - 2 WC', 
      area: '78 m²', 
      height: 3,
      furniture: 'Sofa góc L da cao cấp, Bàn ăn 4 ghế gỗ Sồi, Giường Master King 2m, Giường ngủ 2, Tủ âm tường'
    },
    { 
      floor: 5, 
      title: 'Căn Hộ Tiêu Chuẩn 2PN Tầng 5', 
      type: '2 Phòng Ngủ - 2 WC', 
      area: '78 m²', 
      height: 4,
      furniture: 'Nội thất phong cách Scandinavia: Sofa màu kem, Bàn ăn mặt đá Ceramic, Bếp từ Bosch, Đèn trang trí'
    },
    { 
      floor: 6, 
      title: 'Căn Hộ Ban Công Panorama Tầng 6', 
      type: '2 Phòng Ngủ - 2 WC', 
      area: '85 m²', 
      height: 5,
      furniture: 'Sofa da Ý cao cấp, Ghế thư giãn đọc sách, Bàn ghế cafe ban công ngắm biển, 2 Giường ngủ bọc nỉ'
    },
    { 
      floor: 7, 
      title: 'Căn Hộ Gia Đình 3PN Tầng 7', 
      type: '3 Phòng Ngủ - 2 WC', 
      area: '110 m²', 
      height: 6,
      furniture: 'Sofa dài 3m nhập khẩu, Bàn ăn 6 ghế da, Bàn đảo bếp cẩm thạch Vicostone, 3 Giường ngủ, Bàn học'
    },
    { 
      floor: 8, 
      title: 'Penthouse Hoàng Gia Tầng 8', 
      type: '3 Phòng Ngủ - 3 WC (Duplex)', 
      area: '145 m²', 
      height: 7,
      furniture: 'Nội thất Luxury dát vàng, Bàn ăn cẩm thạch 8 chỗ, Phòng rượu vang, Bồn tắm sục Jacuzzi, Ban công sân vườn'
    },
    { 
      floor: 9, 
      title: 'Rooftop Infinity Pool & Sky Bar', 
      type: 'Hồ Bơi Chân Mây & Lounge', 
      area: '220 m²', 
      height: 8,
      furniture: 'Hồ bơi vô cực nước tràn, Ghế tắm nắng hồ bơi cao cấp, Quầy bar cocktail phát sáng, Giàn hoa Pergola'
    }
  ];

  function init(container, onSelectCb) {
    containerEl = container;
    onFloorClickCallback = onSelectCb;

    // 1. Scene
    scene = new THREE.Scene();
    updateBackground();

    // 2. Camera
    const aspect = containerEl.clientWidth / containerEl.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000);
    camera.position.set(45, 38, 55);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerEl.clientWidth, containerEl.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerEl.appendChild(renderer.domElement);

    // 4. Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 15;
    controls.maxDistance = 130;
    controls.target.set(0, (FLOOR_COUNT * FLOOR_HEIGHT) / 2, 0);

    // 5. Lights
    setupLights();

    // 6. Environment & Ground
    buildGround();

    // 7. Build 9-Story Building with Furniture
    buildBuilding();

    // 8. Interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    window.addEventListener('resize', onResize);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    animate();
  }

  function updateBackground() {
    if (isNight) {
      scene.background = new THREE.Color(0x0a1424);
      scene.fog = new THREE.FogExp2(0x0a1424, 0.007);
    } else {
      scene.background = new THREE.Color(0x87ceeb);
      scene.fog = new THREE.FogExp2(0xd6eaf8, 0.004);
    }
  }

  let ambientLight, dirLight, nightLights = [];

  function setupLights() {
    ambientLight = new THREE.AmbientLight(isNight ? 0x1b2e48 : 0xffffff, isNight ? 1.4 : 0.85);
    scene.add(ambientLight);

    dirLight = new THREE.DirectionalLight(isNight ? 0x223d5f : 0xfff6dd, isNight ? 0.9 : 1.45);
    dirLight.position.set(40, 60, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 160;
    const d = 40;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    // Warm amber architectural spotlights
    const spot1 = new THREE.SpotLight(0xf59e0b, 2.5, 90, Math.PI / 4, 0.4);
    spot1.position.set(-25, 0.5, 25);
    spot1.target.position.set(0, 20, 0);
    scene.add(spot1);
    scene.add(spot1.target);
    nightLights.push(spot1);

    const spot2 = new THREE.SpotLight(0xf59e0b, 2.5, 90, Math.PI / 4, 0.4);
    spot2.position.set(25, 0.5, 25);
    spot2.target.position.set(0, 20, 0);
    scene.add(spot2);
    scene.add(spot2.target);
    nightLights.push(spot2);
  }

  function buildGround() {
    // Reflective Plaza Ground
    const groundGeo = new THREE.PlaneGeometry(220, 220);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0c192b,
      roughness: 0.25,
      metalness: 0.65
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid markings
    const grid = new THREE.GridHelper(100, 50, 0xf59e0b, 0x162842);
    grid.position.y = 0.05;
    scene.add(grid);

    // Landscape Trees
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const radius = 28 + (i % 2) * 8;
      const tx = Math.cos(angle) * radius;
      const tz = Math.sin(angle) * radius;
      createTree(tx, tz);
    }
  }

  function createTree(x, z) {
    const treeGroup = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 2.5, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a2f1c, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.25;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    const foliageGeo = new THREE.ConeGeometry(2, 4.5, 8);
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x1f4728, roughness: 0.8 });
    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.y = 4.2;
    foliage.castShadow = true;
    treeGroup.add(foliage);

    treeGroup.position.set(x, 0, z);
    scene.add(treeGroup);
  }

  // ==========================================
  // 3D FURNITURE BUILDERS ("ĐỒ NỘI THẤT 3D")
  // ==========================================

  const mats = {
    wood: new THREE.MeshStandardMaterial({ color: 0x6e4a2c, roughness: 0.6 }),
    lightWood: new THREE.MeshStandardMaterial({ color: 0xc8ad8d, roughness: 0.5 }),
    leatherDark: new THREE.MeshStandardMaterial({ color: 0x272422, roughness: 0.4 }),
    leatherGold: new THREE.MeshStandardMaterial({ color: 0xbf8b3b, roughness: 0.45 }),
    fabricBlue: new THREE.MeshStandardMaterial({ color: 0x2d4b73, roughness: 0.8 }),
    fabricWhite: new THREE.MeshStandardMaterial({ color: 0xf0ede6, roughness: 0.9 }),
    marble: new THREE.MeshStandardMaterial({ color: 0xe8e8e8, roughness: 0.2, metalness: 0.1 }),
    goldMetal: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 }),
    tvScreen: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.7 }),
    water: new THREE.MeshPhysicalMaterial({ color: 0x1cb5e0, roughness: 0.05, transmission: 0.8, transparent: true, opacity: 0.85 }),
    plantGreen: new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.7 }),
    whiteCeramic: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
  };

  function addSofa(group, x, z, rotY = 0, isLarge = false) {
    const s = new THREE.Group();
    // Seat Base
    const w = isLarge ? 5.5 : 3.8;
    const baseGeo = new THREE.BoxGeometry(w, 0.4, 1.6);
    const base = new THREE.Mesh(baseGeo, mats.fabricBlue);
    base.position.y = 0.35;
    s.add(base);

    // Backrest
    const backGeo = new THREE.BoxGeometry(w, 0.9, 0.4);
    const back = new THREE.Mesh(backGeo, mats.fabricBlue);
    back.position.set(0, 0.8, -0.6);
    s.add(back);

    // Armrests
    const armGeo = new THREE.BoxGeometry(0.35, 0.6, 1.6);
    const armL = new THREE.Mesh(armGeo, mats.fabricBlue);
    armL.position.set(-w / 2 + 0.18, 0.6, 0);
    const armR = new THREE.Mesh(armGeo, mats.fabricBlue);
    armR.position.set(w / 2 - 0.18, 0.6, 0);
    s.add(armL);
    s.add(armR);

    // Cushions
    const cGeo = new THREE.BoxGeometry((w - 0.8) / 2, 0.25, 1.2);
    const c1 = new THREE.Mesh(cGeo, mats.fabricWhite);
    c1.position.set(-(w - 0.8) / 4, 0.6, 0.05);
    const c2 = new THREE.Mesh(cGeo, mats.fabricWhite);
    c2.position.set((w - 0.8) / 4, 0.6, 0.05);
    s.add(c1);
    s.add(c2);

    s.position.set(x, 0, z);
    s.rotation.y = rotY;
    group.add(s);
  }

  function addCoffeeTable(group, x, z, rotY = 0) {
    const t = new THREE.Group();
    const topGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.1, 16);
    const top = new THREE.Mesh(topGeo, mats.marble);
    top.position.y = 0.45;
    t.add(top);

    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const leg = new THREE.Mesh(legGeo, mats.goldMetal);
      leg.position.set(Math.cos(a) * 0.6, 0.2, Math.sin(a) * 0.6);
      t.add(leg);
    }
    t.position.set(x, 0, z);
    t.rotation.y = rotY;
    group.add(t);
  }

  function addTVUnit(group, x, z, rotY = 0) {
    const u = new THREE.Group();
    // Console table
    const conGeo = new THREE.BoxGeometry(4.5, 0.5, 0.8);
    const con = new THREE.Mesh(conGeo, mats.wood);
    con.position.y = 0.35;
    u.add(con);

    // TV Screen
    const tvGeo = new THREE.BoxGeometry(3.6, 2.0, 0.1);
    const tv = new THREE.Mesh(tvGeo, mats.tvScreen);
    tv.position.set(0, 1.9, 0);
    u.add(tv);

    // TV Stand
    const standGeo = new THREE.BoxGeometry(1.0, 0.4, 0.4);
    const stand = new THREE.Mesh(standGeo, mats.goldMetal);
    stand.position.set(0, 0.7, 0);
    u.add(stand);

    u.position.set(x, 0, z);
    u.rotation.y = rotY;
    group.add(u);
  }

  function addDiningSet(group, x, z, chairs = 4) {
    const d = new THREE.Group();
    // Table
    const tGeo = new THREE.BoxGeometry(2.8, 0.12, 1.6);
    const table = new THREE.Mesh(tGeo, mats.lightWood);
    table.position.y = 0.9;
    d.add(table);

    // 4 Legs
    const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.9, 8);
    [[-1.2, -0.6], [1.2, -0.6], [-1.2, 0.6], [1.2, 0.6]].forEach(pos => {
      const leg = new THREE.Mesh(legGeo, mats.goldMetal);
      leg.position.set(pos[0], 0.45, pos[1]);
      d.add(leg);
    });

    // Chairs
    const chairPositions = chairs === 4 
      ? [[-0.6, -1.0, 0], [0.6, -1.0, 0], [-0.6, 1.0, Math.PI], [0.6, 1.0, Math.PI]]
      : [[-0.9, -1.0, 0], [0, -1.0, 0], [0.9, -1.0, 0], [-0.9, 1.0, Math.PI], [0, 1.0, Math.PI], [0.9, 1.0, Math.PI]];

    chairPositions.forEach(cp => {
      const c = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.6), mats.fabricBlue);
      seat.position.y = 0.55;
      const cback = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.08), mats.fabricBlue);
      cback.position.set(0, 0.9, -0.26);
      c.add(seat);
      c.add(cback);
      c.position.set(cp[0], 0, cp[1]);
      c.rotation.y = cp[2];
      d.add(c);
    });

    d.position.set(x, 0, z);
    group.add(d);
  }

  function addBed(group, x, z, rotY = 0, isKing = true) {
    const b = new THREE.Group();
    const bw = isKing ? 3.2 : 2.5;
    const bd = isKing ? 3.6 : 3.2;

    // Bed frame
    const frameGeo = new THREE.BoxGeometry(bw, 0.35, bd);
    const frame = new THREE.Mesh(frameGeo, mats.wood);
    frame.position.y = 0.25;
    b.add(frame);

    // Mattress
    const matGeo = new THREE.BoxGeometry(bw - 0.2, 0.4, bd - 0.2);
    const mat = new THREE.Mesh(matGeo, mats.fabricWhite);
    mat.position.y = 0.55;
    b.add(mat);

    // Headboard
    const hbGeo = new THREE.BoxGeometry(bw + 0.4, 1.6, 0.3);
    const hb = new THREE.Mesh(hbGeo, mats.fabricBlue);
    hb.position.set(0, 0.9, -bd / 2);
    b.add(hb);

    // Pillows
    const pGeo = new THREE.BoxGeometry(0.9, 0.2, 0.6);
    const p1 = new THREE.Mesh(pGeo, mats.fabricWhite);
    p1.position.set(-bw / 4, 0.8, -bd / 2 + 0.6);
    const p2 = new THREE.Mesh(pGeo, mats.fabricWhite);
    p2.position.set(bw / 4, 0.8, -bd / 2 + 0.6);
    b.add(p1);
    b.add(p2);

    // Nightstands
    [-bw / 2 - 0.45, bw / 2 + 0.45].forEach(nx => {
      const nsGeo = new THREE.BoxGeometry(0.7, 0.6, 0.7);
      const ns = new THREE.Mesh(nsGeo, mats.lightWood);
      ns.position.set(nx, 0.35, -bd / 2 + 0.35);
      // Mini Lamp
      const lampGeo = new THREE.CylinderGeometry(0.18, 0.25, 0.4, 8);
      const lamp = new THREE.Mesh(lampGeo, mats.goldMetal);
      lamp.position.set(nx, 0.85, -bd / 2 + 0.35);
      b.add(ns);
      b.add(lamp);
    });

    b.position.set(x, 0, z);
    b.rotation.y = rotY;
    group.add(b);
  }

  function addKitchenIsland(group, x, z) {
    const k = new THREE.Group();
    // Counter
    const cntGeo = new THREE.BoxGeometry(4.0, 1.1, 1.4);
    const cnt = new THREE.Mesh(cntGeo, mats.marble);
    cnt.position.y = 0.6;
    k.add(cnt);

    // Bar stools
    for (let i = 0; i < 3; i++) {
      const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.7, 8), mats.leatherGold);
      stool.position.set(-1.2 + i * 1.2, 0.4, 1.1);
      k.add(stool);
    }
    k.position.set(x, 0, z);
    group.add(k);
  }

  function addPlantPot(group, x, z) {
    const p = new THREE.Group();
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 0.7, 8), mats.whiteCeramic);
    pot.position.y = 0.4;
    const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6), mats.plantGreen);
    leaves.position.y = 1.0;
    p.add(pot);
    p.add(leaves);
    p.position.set(x, 0, z);
    group.add(p);
  }

  function addReception(group, x, z) {
    const r = new THREE.Group();
    // Curved/box front counter
    const cGeo = new THREE.BoxGeometry(5.0, 1.2, 1.5);
    const counter = new THREE.Mesh(cGeo, mats.marble);
    counter.position.y = 0.65;
    r.add(counter);

    // Gold Trim
    const trim = new THREE.Mesh(new THREE.BoxGeometry(5.1, 0.1, 1.52), mats.goldMetal);
    trim.position.y = 1.25;
    r.add(trim);

    r.position.set(x, 0, z);
    group.add(r);
  }

  function addSunlounger(group, x, z, rotY = 0) {
    const sl = new THREE.Group();
    const lounger = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 2.6), mats.fabricWhite);
    lounger.position.y = 0.2;
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 0.7), mats.fabricBlue);
    head.position.set(0, 0.45, -0.9);
    head.rotation.x = -0.3;
    sl.add(lounger);
    sl.add(head);
    sl.position.set(x, 0, z);
    sl.rotation.y = rotY;
    group.add(sl);
  }

  // ==========================================
  // BUILD FULL 9-STORY BUILDING WITH FURNITURE
  // ==========================================

  function buildBuilding() {
    floorGroups = [];

    for (let i = 0; i < FLOOR_COUNT; i++) {
      const floorNum = i + 1;
      const baseY = i * FLOOR_HEIGHT;

      const group = new THREE.Group();
      group.userData = {
        floor: floorNum,
        baseY: baseY,
        targetY: baseY,
        info: floorData[i]
      };

      // 1. Concrete Floor Slab
      const slabGeo = new THREE.BoxGeometry(BUILDING_WIDTH, 0.5, BUILDING_DEPTH);
      const slabMat = new THREE.MeshStandardMaterial({
        color: 0x1f2937,
        roughness: 0.4,
        metalness: 0.3
      });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.position.y = 0.25;
      slab.castShadow = true;
      slab.receiveShadow = true;
      group.add(slab);

      // Floor Flooring (Light Wood / Marble for interior)
      const floorTile = new THREE.Mesh(
        new THREE.BoxGeometry(BUILDING_WIDTH - 1, 0.05, BUILDING_DEPTH - 1),
        floorNum === 1 || floorNum === 9 ? mats.marble : mats.lightWood
      );
      floorTile.position.y = 0.52;
      group.add(floorTile);

      // Ceiling Slab
      const ceil = slab.clone();
      ceil.position.y = FLOOR_HEIGHT - 0.2;
      group.add(ceil);

      // 2. Structural Corner Columns & Elevator Core
      const colGeo = new THREE.BoxGeometry(1.2, FLOOR_HEIGHT, 1.2);
      const colMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.4 });
      const positions = [
        [-BUILDING_WIDTH / 2 + 1, -BUILDING_DEPTH / 2 + 1],
        [BUILDING_WIDTH / 2 - 1, -BUILDING_DEPTH / 2 + 1],
        [-BUILDING_WIDTH / 2 + 1, BUILDING_DEPTH / 2 - 1],
        [BUILDING_WIDTH / 2 - 1, BUILDING_DEPTH / 2 - 1],
        [0, 0] // elevator shaft core
      ];
      positions.forEach(pos => {
        const col = new THREE.Mesh(colGeo, colMat);
        col.position.set(pos[0], FLOOR_HEIGHT / 2, pos[1]);
        col.castShadow = true;
        group.add(col);
      });

      // 3. Interior Partition Walls (Tường ngăn chia phòng mỏng)
      const wallMat = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.6 });
      const wall1 = new THREE.Mesh(new THREE.BoxGeometry(0.25, FLOOR_HEIGHT - 0.8, 8), wallMat);
      wall1.position.set(2, FLOOR_HEIGHT / 2, -4);
      group.add(wall1);

      // 4. FURNITURE INJECTION PER FLOOR ("ĐỒ NỘI THẤT TỪNG TẦNG")
      const furnGroup = new THREE.Group();
      furnGroup.position.y = 0.55;

      if (floorNum === 1) {
        // TẦNG 1: Sảnh Đón Khách Grand Lobby
        addReception(furnGroup, 0, -4);
        addSofa(furnGroup, -6, 2, Math.PI / 4, true);
        addCoffeeTable(furnGroup, -6, 4.5);
        addSofa(furnGroup, 6, 2, -Math.PI / 4, true);
        addCoffeeTable(furnGroup, 6, 4.5);
        addPlantPot(furnGroup, -10, -7);
        addPlantPot(furnGroup, 10, -7);
        addPlantPot(furnGroup, -10, 7);
        addPlantPot(furnGroup, 10, 7);
      } else if (floorNum === 2 || floorNum === 3) {
        // TẦNG 2-3: Căn Hộ Studio Deluxe 1PN
        addBed(furnGroup, -6, -4, 0, false);
        addSofa(furnGroup, 4, -4, 0, false);
        addCoffeeTable(furnGroup, 4, -2);
        addTVUnit(furnGroup, 4, 3, Math.PI);
        addKitchenIsland(furnGroup, -5, 4);
        addPlantPot(furnGroup, -10, 6);
      } else if (floorNum >= 4 && floorNum <= 6) {
        // TẦNG 4-6: Căn Hộ 2PN Tiêu Chuẩn & Ban Công View Biển
        addSofa(furnGroup, -4, -3, 0, true);
        addCoffeeTable(furnGroup, -4, -1);
        addTVUnit(furnGroup, -4, 4, Math.PI);
        addDiningSet(furnGroup, 4, -3, 4);
        addBed(furnGroup, 6, 4, Math.PI / 2, true);
        addKitchenIsland(furnGroup, 4, 4);
        addPlantPot(furnGroup, -10, 6);
        addPlantPot(furnGroup, 10, 6);
      } else if (floorNum === 7 || floorNum === 8) {
        // TẦNG 7-8: Căn Hộ Gia Đình 3PN & Penthouse
        addSofa(furnGroup, -4, -3, 0, true);
        addCoffeeTable(furnGroup, -4, -1);
        addTVUnit(furnGroup, -4, 4, Math.PI);
        addDiningSet(furnGroup, 5, -3, 6);
        addBed(furnGroup, 6, 4, Math.PI / 2, true);
        addBed(furnGroup, -7, 4, -Math.PI / 2, false);
        addKitchenIsland(furnGroup, 2, 4);
        addPlantPot(furnGroup, -10, -7);
        addPlantPot(furnGroup, 10, -7);
      } else if (floorNum === 9) {
        // TẦNG 9: Rooftop Infinity Pool & Sky Bar
        // Hồ bơi chân mây xanh biếc
        const poolGeo = new THREE.BoxGeometry(12, 0.4, 7);
        const pool = new THREE.Mesh(poolGeo, mats.water);
        pool.position.set(-4, 0.35, 1);
        furnGroup.add(pool);

        // Pool border
        const borderGeo = new THREE.BoxGeometry(13, 0.2, 8);
        const border = new THREE.Mesh(borderGeo, mats.marble);
        border.position.set(-4, 0.15, 1);
        furnGroup.add(border);

        // Sun loungers
        addSunlounger(furnGroup, -8, -5, 0);
        addSunlounger(furnGroup, -5, -5, 0);
        addSunlounger(furnGroup, -2, -5, 0);

        // Sky Bar counter
        const barCounter = new THREE.Mesh(new THREE.BoxGeometry(6, 1.2, 1.2), mats.goldMetal);
        barCounter.position.set(6, 0.6, -3);
        furnGroup.add(barCounter);

        for (let b = 0; b < 4; b++) {
          const bs = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.7, 8), mats.leatherGold);
          bs.position.set(4.5 + b * 1.0, 0.35, -1.8);
          furnGroup.add(bs);
        }

        addPlantPot(furnGroup, 9, 5);
        addPlantPot(furnGroup, 9, -6);
      }

      group.add(furnGroup);

      // 5. Exterior Glass Facade (Transparent Curtain Wall)
      const glassGeo = new THREE.BoxGeometry(BUILDING_WIDTH - 0.2, FLOOR_HEIGHT - 0.6, BUILDING_DEPTH - 0.2);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x81d3cf,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.88,
        transparent: true,
        opacity: 0.45,
        reflectivity: 0.9,
        clearcoat: 1.0
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.y = FLOOR_HEIGHT / 2;
      group.add(glass);

      // 6. Balcony (Front side)
      if (floorNum >= 2 && floorNum <= 8) {
        const balGeo = new THREE.BoxGeometry(12, 1.1, 2.5);
        const balMat = new THREE.MeshPhysicalMaterial({
          color: 0x81d3cf,
          transparent: true,
          opacity: 0.5,
          roughness: 0.1
        });
        const balcony = new THREE.Mesh(balGeo, balMat);
        balcony.position.set(0, 0.8, BUILDING_DEPTH / 2 + 1.25);
        group.add(balcony);

        // Balcony floor
        const balFloorGeo = new THREE.BoxGeometry(12, 0.3, 2.5);
        const balFloor = new THREE.Mesh(balFloorGeo, slabMat);
        balFloor.position.set(0, 0.15, BUILDING_DEPTH / 2 + 1.25);
        group.add(balFloor);

        // Outdoor furniture on balcony
        const balChair1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.7), mats.fabricWhite);
        balChair1.position.set(-3, 0.45, BUILDING_DEPTH / 2 + 1.25);
        const balChair2 = balChair1.clone();
        balChair2.position.set(3, 0.45, BUILDING_DEPTH / 2 + 1.25);
        const balTab = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.4, 8), mats.goldMetal);
        balTab.position.set(0, 0.4, BUILDING_DEPTH / 2 + 1.25);
        group.add(balChair1);
        group.add(balChair2);
        group.add(balTab);
      }

      // 7. Rooftop Specifics (Floor 9)
      if (floorNum === 9) {
        // Modern Pergola & Sky Bar elements
        const pergolaGeo = new THREE.BoxGeometry(BUILDING_WIDTH - 6, 0.25, BUILDING_DEPTH - 6);
        const pergolaMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
        const pergola = new THREE.Mesh(pergolaGeo, pergolaMat);
        pergola.position.y = FLOOR_HEIGHT + 2.5;
        group.add(pergola);

        // Glass railing
        const railGeo = new THREE.BoxGeometry(BUILDING_WIDTH, 1.2, BUILDING_DEPTH);
        const railMat = new THREE.MeshPhysicalMaterial({ color: 0x81d3cf, transparent: true, opacity: 0.4 });
        const railing = new THREE.Mesh(railGeo, railMat);
        railing.position.y = FLOOR_HEIGHT + 0.6;
        group.add(railing);
      }

      // 8. Hit Box for Raycasting
      const hitBoxGeo = new THREE.BoxGeometry(BUILDING_WIDTH + 4, FLOOR_HEIGHT, BUILDING_DEPTH + 4);
      const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
      hitBox.position.y = FLOOR_HEIGHT / 2;
      hitBox.userData = { floorNumber: floorNum, parentGroup: group };
      group.add(hitBox);

      // 9. Golden Selection Wireframe
      const outlineGeo = new THREE.BoxGeometry(BUILDING_WIDTH + 0.6, FLOOR_HEIGHT + 0.2, BUILDING_DEPTH + 0.6);
      const wireframe = new THREE.LineSegments(
        new THREE.EdgesGeometry(outlineGeo),
        new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2, transparent: true, opacity: 0 })
      );
      wireframe.position.y = FLOOR_HEIGHT / 2;
      group.add(wireframe);
      group.userData.outline = wireframe;

      group.position.y = baseY;
      scene.add(group);
      floorGroups.push(group);
    }
  }

  function setNightMode(night) {
    isNight = night;
    updateBackground();
    ambientLight.color.setHex(isNight ? 0x223355 : 0xffffff);
    ambientLight.intensity = isNight ? 1.3 : 0.85;
    dirLight.color.setHex(isNight ? 0x4a69bd : 0xfff6dd);
    dirLight.intensity = isNight ? 0.8 : 1.45;

    nightLights.forEach(spot => {
      spot.intensity = isNight ? 2.5 : 0.2;
    });
  }

  function toggleExploded() {
    isExploded = !isExploded;
    const gap = isExploded ? 5.2 : 0; // Separation distance per floor

    floorGroups.forEach((group, index) => {
      group.userData.targetY = group.userData.baseY + index * gap;
    });

    const midY = isExploded
      ? (FLOOR_COUNT * (FLOOR_HEIGHT + gap)) / 2
      : (FLOOR_COUNT * FLOOR_HEIGHT) / 2;
    controls.target.set(0, midY, 0);

    return isExploded;
  }

  function selectFloor(floorNum) {
    selectedFloor = floorNum;

    floorGroups.forEach(group => {
      const isSel = group.userData.floor === floorNum;
      if (group.userData.outline) {
        group.userData.outline.material.opacity = isSel ? 0.95 : 0;
        group.userData.outline.material.color.setHex(isSel ? 0xf59e0b : 0xffffff);
      }
    });

    const targetGroup = floorGroups.find(g => g.userData.floor === floorNum);
    if (targetGroup) {
      const curY = targetGroup.position.y + FLOOR_HEIGHT / 2;
      controls.target.set(0, curY, 0);
    }

    if (onFloorClickCallback) {
      onFloorClickCallback(floorData[floorNum - 1]);
    }
  }

  function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    let foundFloor = null;
    for (let i = 0; i < intersects.length; i++) {
      let obj = intersects[i].object;
      while (obj) {
        if (obj.userData && obj.userData.floor) {
          foundFloor = obj.userData.floor;
          break;
        }
        obj = obj.parent;
      }
      if (foundFloor) break;
    }

    if (foundFloor !== hoveredFloor) {
      if (hoveredFloor && hoveredFloor !== selectedFloor) {
        const g = floorGroups.find(fl => fl.userData.floor === hoveredFloor);
        if (g && g.userData.outline) g.userData.outline.material.opacity = 0;
      }
      hoveredFloor = foundFloor;
      if (hoveredFloor && hoveredFloor !== selectedFloor) {
        const g = floorGroups.find(fl => fl.userData.floor === hoveredFloor);
        if (g && g.userData.outline) {
          g.userData.outline.material.color.setHex(0xffffff);
          g.userData.outline.material.opacity = 0.5;
        }
      }
      renderer.domElement.style.cursor = hoveredFloor ? 'pointer' : 'default';
    }
  }

  function onClick(event) {
    if (hoveredFloor) {
      selectFloor(hoveredFloor);
    }
  }

  function onResize() {
    if (!containerEl) return;
    const width = containerEl.clientWidth;
    const height = containerEl.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    animId = requestAnimationFrame(animate);

    // Smooth floor explosion movement
    floorGroups.forEach(group => {
      group.position.y += (group.userData.targetY - group.position.y) * 0.1;
    });

    controls.update();
    renderer.render(scene, camera);
  }

  function destroy() {
    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener('resize', onResize);
    if (renderer && renderer.domElement) {
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
  }

  return {
    init: init,
    toggleExploded: toggleExploded,
    setNightMode: setNightMode,
    selectFloor: selectFloor,
    getFloorData: () => floorData,
    destroy: destroy
  };
})();
