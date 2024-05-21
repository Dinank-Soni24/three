import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';

import { UnrealBloomPass } from '//unpkg.com/three@0.123.0/examples/jsm/postprocessing/UnrealBloomPass.js';

const main = async () => {
  // create Scene
  const scene = new THREE.Scene();

  // Set up camera
  const camera = await windowCamera();
  // Set up renderer
  const renderer = await windowRenderer();

  // const sun = await windowSphere(
  //   scene,
  //   'standard',
  //   false,
  //   10,
  //   32,
  //   32,
  //   0xe6e600,
  //   0,
  //   0,
  //   0
  // );
  // sun.name = 'sun';
  // Create a glowing effect for the Sun
  const vertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

  const fragmentShader = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0) * intensity;
  }
`;

  const glowMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    // transparent: true,
  });

  const glowGeometry = new THREE.SphereGeometry(10 * 1.5, 32, 32); // Slightly larger than the Sun
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  scene.add(glow);

  const mercury = await windowSphere(
    scene,
    'standard',
    false,
    0.38,
    32,
    32,
    0x8b8680,
    0,
    0,
    39
  );
  const mercuryOrbit = await windowRing(
    scene,
    'basic',
    39,
    39.1,
    64,
    0,
    0x8b8680,
    0,
    0,
    0
  );
  mercury.orbitalPeriod = 88;
  mercury.distance = mercury.position.z;
  mercuryOrbit.orbitalPeriod = 88;
  mercuryOrbit.name = 'Orbit';
  const venus = await windowSphere(
    scene,
    'standard',
    false,
    0.95,
    32,
    32,
    0xeed5b7,
    0,
    0,
    72
  );
  const venusOrbit = await windowRing(
    scene,
    'basic',
    72,
    72.2,
    64,
    0,
    0xeed5b7,
    0,
    0,
    0
  );
  venus.orbitalPeriod = 225;
  venus.distance = venus.position.z;
  venusOrbit.orbitalPeriod = 225;
  venusOrbit.name = 'Orbit';
  const earth = await windowSphere(
    scene,
    'standard',
    false,
    1,
    32,
    32,
    0x2b65ec,
    0,
    0,
    100
  );
  const earthOrbit = await windowRing(
    scene,
    'basic',
    100,
    100.3,
    64,
    0,
    0x2b65ec,
    0,
    0,
    0
  );
  earth.orbitalPeriod = 365;
  earth.distance = earth.position.z;
  earthOrbit.orbitalPeriod = 365;
  earthOrbit.name = 'Orbit';
  const mars = await windowSphere(
    scene,
    'standard',
    false,
    0.53,
    32,
    32,
    0xa52a2a,
    0,
    0,
    152
  );
  const marsOrbit = await windowRing(
    scene,
    'basic',
    152,
    152.4,
    64,
    0,
    0xa52a2a,
    0,
    0,
    0
  );
  mars.orbitalPeriod = 687;
  mars.distance = mars.position.z;
  marsOrbit.orbitalPeriod = 687;
  marsOrbit.name = 'Orbit';
  const jupiter = await windowSphere(
    scene,
    'standard',
    false,
    11,
    32,
    32,
    0xf4a460,
    0,
    0,
    300
  );
  const jupiterOrbit = await windowRing(
    scene,
    'basic',
    300,
    300.5,
    64,
    0,
    0xf4a460,
    0,
    0,
    0
  );
  jupiter.orbitalPeriod = 4333;
  jupiter.distance = jupiter.position.z;
  jupiterOrbit.orbitalPeriod = 4333;
  jupiterOrbit.name = 'Orbit';
  const saturn = await windowSphere(
    scene,
    'standard',
    false,
    9.5,
    32,
    32,
    0xd2b48c,
    0,
    0,
    450
  );
  const saturnOrbit = await windowRing(
    scene,
    'basic',
    450,
    450.9,
    64,
    0,
    0xd2b48c,
    0,
    0,
    0
  );
  saturn.orbitalPeriod = 10759;
  saturn.distance = saturn.position.z;
  saturnOrbit.orbitalPeriod = 10759;
  saturnOrbit.name = 'Orbit';
  const uranus = await windowSphere(
    scene,
    'standard',
    false,
    4,
    32,
    32,
    0xafeeee,
    0,
    0,
    550
  );
  const uranusOrbit = await windowRing(
    scene,
    'basic',
    550,
    550.9,
    64,
    0,
    0xafeeee,
    0,
    0,
    0
  );
  uranus.orbitalPeriod = 30687;
  uranus.distance = uranus.position.z;
  uranusOrbit.orbitalPeriod = 30687;
  uranusOrbit.name = 'Orbit';
  const neptune = await windowSphere(
    scene,
    'standard',
    false,
    3.88,
    32,
    32,
    0x0000ff,
    0,
    0,
    650
  );
  const neptuneOrbit = await windowRing(
    scene,
    'basic',
    650,
    650.9,
    64,
    0,
    0x0000ff,
    0,
    0,
    0
  );
  neptune.orbitalPeriod = 60190;
  neptune.distance = neptune.position.z;
  neptuneOrbit.orbitalPeriod = 60190;
  neptuneOrbit.name = 'Orbit';

  // Create the star field
  createStarField(scene);

  // Light source
  const light = new THREE.PointLight(0xffffff, 1, 0);
  light.position.set(0, 0, 0); // Position the light at the center (Sun)
  scene.add(light);

  // Add ambient light to illuminate the scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add mouse interaction for rotating the torus
  addMouseInteraction(renderer.domElement, scene, camera);

  // animate(scene, sun, camera, renderer, 0, 0.1, 0);
  animate(scene, mercury, camera, renderer, 0, 0, 0);
  animate(scene, mercuryOrbit, camera, renderer, 0, 0, 0);
  animate(scene, venus, camera, renderer, 0, 0, 0);
  animate(scene, venusOrbit, camera, renderer, 0, 0, 0);
  animate(scene, earth, camera, renderer, 0, 0, 0);
  animate(scene, earthOrbit, camera, renderer, 0, 0, 0);
  animate(scene, mars, camera, renderer, 0, 0, 0);
  animate(scene, marsOrbit, camera, renderer, 0, 0, 0);
  animate(scene, jupiter, camera, renderer, 0, 0, 0);
  animate(scene, jupiterOrbit, camera, renderer, 0, 0, 0);
  animate(scene, saturn, camera, renderer, 0, 0, 0);
  animate(scene, saturnOrbit, camera, renderer, 0, 0, 0);
  animate(scene, uranus, camera, renderer, 0, 0, 0);
  animate(scene, uranusOrbit, camera, renderer, 0, 0, 0);
  animate(scene, neptune, camera, renderer, 0, 0, 0);
  animate(scene, neptuneOrbit, camera, renderer, 0, 0, 0);
};

const windowCamera = async () => {
  // create Camera for viewing the scene
  const camera = new THREE.PerspectiveCamera(
    75, // angle of view (FOV) in degree (0 ~ 180)
    window.innerWidth / window.innerHeight, // aspect ratio (width / height) of the canvas element
    0.1, // near clipping plane
    3000 // far clipping plane
  );

  camera.position.set(0, 10, 40); // camera position

  return camera;
};

const windowRenderer = async () => {
  const canvas = document.querySelector('#canva'); // get canvas element from DOM
  const renderer = new THREE.WebGLRenderer({ canvas }); // create WebGLRenderer instance to render the scene in the canvas element using the WebGL API
  renderer.setSize(window.innerWidth, window.innerHeight); // set the size of the renderer to match the size of the canvas element

  return renderer;
};

const windowSphere = async (
  scene,
  materials,
  streetLight,
  radius,
  width,
  height,
  color,
  px,
  py,
  pz
) => {
  const geometry = new THREE.SphereGeometry(radius, width, height);
  const material =
    materials == 'standard'
      ? new THREE.MeshStandardMaterial({ color })
      : new THREE.MeshBasicMaterial({ color });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(px, py, pz);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  if (streetLight) {
    sphere.material.color.r = 1.6;
    sphere.material.color.g = 1.6;
    sphere.material.color.b = 1.6;
    streetLight.add(sphere);
  } else {
    scene.add(sphere);
  }

  return sphere;
};

const windowRing = async (
  scene,
  materials,
  innerRadius,
  outerRadius,
  thetaSegments,
  phiSegments,
  color,
  px,
  py,
  pz
) => {
  const geometry = new THREE.RingGeometry(
    innerRadius,
    outerRadius,
    thetaSegments,
    phiSegments,
    3.14,
    2
  );
  const material =
    materials == 'standard'
      ? new THREE.MeshStandardMaterial({
          color,
          side: THREE.DoubleSide,
        })
      : new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(geometry, material);
  ring.position.set(px, py, pz);
  ring.rotation.x = Math.PI / 2;
  ring.rotation.y = Math.PI;
  scene.add(ring);

  return ring;
};

// Function to create a star field
const createStarField = (scene) => {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

  const starVertices = [];
  for (let i = 0; starVertices?.length < 10000; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(2000);

    // Calculate the distance from the origin
    const distance = Math.sqrt(x * x + y * y + z * z);

    // Only push to array if distance is greater than 500
    if (distance > 1000) {
      starVertices.push(x, y, z);
    }
  }

  starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starVertices, 3)
  );

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
};

const addMouseInteraction = (canvas, object, camera) => {
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  const onMouseMove = (event) => {
    const { offsetX, offsetY } = event;
    const deltaMove = {
      x: offsetX - previousMousePosition.x,
      y: offsetY - previousMousePosition.y,
    };

    if (isDragging) {
      const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          (deltaMove.y * Math.PI) / 180,
          (deltaMove.x * Math.PI) / 180,
          0,
          'XYZ'
        )
      );

      object.quaternion.multiplyQuaternions(
        deltaRotationQuaternion,
        object.quaternion
      );
    }

    previousMousePosition = { x: offsetX, y: offsetY };
  };

  const onMouseDown = (event) => {
    if (event.button === 0) {
      // Left mouse button
      isDragging = true;
      previousMousePosition = { x: event.offsetX, y: event.offsetY };
    }
  };

  const onMouseUp = () => {
    isDragging = false;
  };

  const onMouseWheel = (event) => {
    const zoomSpeed = 0.1;
    camera.position.z += event.deltaY * zoomSpeed;
  };

  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('wheel', onMouseWheel);
};

const animate = (scene, cube, camera, renderer, x, y, z) => {
  let animationCount = 0;

  const animateLoop = () => {
    requestAnimationFrame(animateLoop);
    const time = Date.now() * 0.0001;

    if (cube?.visible && cube?.name == 'sun') {
      // Rotate the cube
      cube.rotation.x += x;
      cube.rotation.y += y;
      cube.rotation.z += z;
    } else if (cube?.distance && cube?.orbitalPeriod) {
      // rotate planets around the sun
      const angle = time * (365 / cube.orbitalPeriod); // Speed based on orbital period

      cube.position.x = cube?.distance * Math.cos(angle);
      cube.position.z = cube?.distance * Math.sin(angle);
    }
    if (cube?.name == 'Orbit') {
      const angle = time * (365 / cube.orbitalPeriod);
      cube.rotation.z = -angle;
    }

    renderer.render(scene, camera);
    animationCount++; // Increment the animation loop counter
  };
  animateLoop();
};

main();
