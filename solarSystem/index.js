import * as THREE from 'https://cdn.skypack.dev/three@0.133.1';

import { OrbitControls } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/UnrealBloomPass.js';

const main = async () => {
  // create Scene
  const scene = new THREE.Scene();

  // Set up camera
  const camera = await windowCamera();
  // Set up renderer
  const renderer = await windowRenderer();

  const sun = await windowSphere(
    scene,
    'basic',
    false,
    10,
    32,
    32,
    0xe6e600,
    0,
    0,
    0
  );
  sun.name = 'sun';
  sun.layers.enable(1);
  // sun.castShadow = true;

  // Bloom effect setup
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    3,
    0.5,
    0
  );
  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.renderToScreen = false;
  bloomComposer.addPass(new RenderPass(scene, camera));
  bloomComposer.addPass(bloomPass);

  // Shader pass for final rendering
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      baseTexture: { value: null },
      bloomTexture: { value: bloomComposer.renderTarget2.texture },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
    fragmentShader: `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;
        varying vec2 vUv;
        void main() {
          gl_FragColor = texture2D(baseTexture, vUv) + vec4(1.0) * texture2D(bloomTexture, vUv);
        }
      `,
  });
  const finalPass = new ShaderPass(shaderMaterial, 'baseTexture');
  const finalComposer = new EffectComposer(renderer);
  finalComposer.addPass(new RenderPass(scene, camera));
  finalComposer.addPass(finalPass);

  // Bloom layer setup
  const bloomLayer = new THREE.Layers();
  bloomLayer.set(1);

  //   // OrbitControls setup
  // const controls = new OrbitControls(camera, renderer.domElement);

  // Store original materials
  const materials = [];

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
    0.1,
    0x090909,
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
    0.2,
    0x090909,
    0,
    0,
    0
  );
  venus.orbitalPeriod = 225;
  venus.distance = venus.position.z;
  venusOrbit.orbitalPeriod = 225;
  venusOrbit.name = 'Orbit';

  const earthGroup = new THREE.Group();
  const earth = await windowSphere(
    earthGroup,
    'standard',
    false,
    1,
    32,
    32,
    0x2b65ec,
    0,
    0,
    0
  );
  const earthOrbit = await windowRing(
    scene,
    'basic',
    100,
    0.2,
    0x090909,
    0,
    0,
    0
  );
  // Create Moon
  const moon = await windowSphere(
    earthGroup,
    'standard',
    false,
    0.27, // Moon's radius relative to Earth
    32,
    32,
    0xff0000,
    0,
    0,
    0 // Distance from Earth
  );
  scene.add(earthGroup);
  earthGroup.position.set(0, 0, 100);
  // moon.layers.enable(1);
  moon.orbitalPeriod = 88;
  // moon.distance = moon.position.z;
  console.log(moon);
  moon.name = 'Moon';
  earthGroup.orbitalPeriod = 365;
  earthGroup.distance = earthGroup.position.z;
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
    0.2,
    0x090909,
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
    0.2,
    0x090909,
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
    0.2,
    0x090909,
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
    0.2,
    0x090909,
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
    0.2,
    0x090909,
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
  const light = new THREE.PointLight(0xffffff, 0.7, 0);
  light.position.set(0, 0, 0); // Position the light at the center (Sun)
  light.castShadow = true; // Enable shadows for the light
  light.shadow.mapSize.width = 1024; // Shadow map resolution
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 500;
  scene.add(light);
  // light.castShadow = true;

  // Add ambient light to illuminate the scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add mouse interaction for rotating the torus
  addMouseInteraction(renderer.domElement, scene, camera);

  animate(
    scene,
    bloomComposer,
    finalComposer,
    sun,
    camera,
    renderer,
    0,
    0.1,
    0,
    bloomLayer,
    materials
  );
  animate(
    scene,
    false,
    false,
    mercury,
    camera,
    renderer,
    0,
    0,
    0,
    false,
    false
  );
  animate(
    scene,
    false,
    false,
    mercuryOrbit,
    camera,
    renderer,
    0,
    0,
    0,
    false,
    false
  );
  animate(scene, false, false, venus, camera, renderer, 0, 0, 0), false, false;
  animate(
    scene,
    false,
    false,
    venusOrbit,
    camera,
    renderer,
    0,
    0,
    0,
    false,
    false
  );
  animate(
    scene,
    false,
    false,
    earthGroup,
    camera,
    renderer,
    0,
    0,
    0,
    false,
    false
  );
  animate(scene, false, false, moon, camera, renderer, 0, 0, 0, false, false);
  animate(
    scene,
    false,
    false,
    earthOrbit,
    camera,
    renderer,
    0,
    0,
    0,
    false,
    false
  );
  animate(scene, false, false, mars, camera, renderer, 0, 0, 0, false, false);
  animate(
    scene,
    false,
    false,
    marsOrbit,
    camera,
    renderer,
    0,
    0,
    0,
    false,
    false
  );
  animate(
    scene,
    false,
    false,
    jupiter,
    camera,
    renderer,
    0,
    0,
    0,
    false,
    false
  );
  animate(
    scene,
    false,
    false,
    jupiterOrbit,
    camera,
    renderer,
    0,
    0,
    0,
    false,
    false
  );
  animate(scene, false, false, saturn, camera, renderer, 0, 0, 0, false, false);
  animate(
    scene,
    false,
    false,
    saturnOrbit,
    camera,
    renderer,
    0,
    0,
    0,
    false,
    false
  );
  animate(scene, false, false, uranus, camera, renderer, 0, 0, 0, false, false);
  animate(
    scene,
    false,
    false,
    uranusOrbit,
    camera,
    renderer,
    0,
    0,
    0,
    false,
    false
  );
  animate(
    scene,
    false,
    false,
    neptune,
    camera,
    renderer,
    0,
    0,
    0,
    false,
    false
  );
  animate(
    scene,
    false,
    false,
    neptuneOrbit,
    camera,
    renderer,
    0,
    0,
    0,
    false,
    false
  );
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

  renderer.shadowMap.enabled = true; // Enable shadow maps
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: Soft shadows

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
      : new THREE.MeshBasicMaterial({
          color,
        });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(px, py, pz);
  if (materials == 'standard') {
    sphere.castShadow = true;
    sphere.receiveShadow = true;
  }
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
  radius,
  tubeRadius,
  color,
  px,
  py,
  pz
) => {
  const geometry = new THREE.TorusGeometry(radius, tubeRadius, 12, 48, 2.5);
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
    if (distance > 1000 && distance < 2000) {
      starVertices.push(x, y, z);
    }
  }

  starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starVertices, 3)
  );

  const stars = new THREE.Points(starGeometry, starMaterial);
  stars.layers.enable(1);
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

// Darken objects not in the bloom layer
const darkenMaterial = (obj, bloomLayer, materials) => {
  if (!bloomLayer.test(obj.layers)) {
    materials[obj.uuid] = obj.material;
    obj.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
  }
};

// Restore original materials
const restoreMaterial = (obj, materials) => {
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid];
    delete materials[obj.uuid];
  }
};

const animate = (
  scene,
  bloomComposer,
  finalComposer,
  cube,
  camera,
  renderer,
  x,
  y,
  z,
  bloomLayer,
  materials
) => {
  let animationCount = 0;

  const animateLoop = () => {
    requestAnimationFrame(animateLoop);
    const time = Date.now() * 0.0001;
    // rotate planets around the sun
    const angle = time * (365 / cube.orbitalPeriod); // Speed based on orbital period

    if (cube?.visible && cube?.name == 'sun') {
      // Rotate the cube
      cube.rotation.x += x;
      cube.rotation.y += y;
      cube.rotation.z += z;
    } else if (cube?.distance && cube?.orbitalPeriod) {
      cube.position.x = cube?.distance * Math.cos(angle);
      cube.position.z = cube?.distance * Math.sin(angle);
    }
    if (cube?.name == 'Moon') {
      cube.position.z = 3 * Math.sin(angle); // - max start
      cube.position.x = 3 * Math.cos(angle); // + min start
    }
    if (cube?.name == 'Orbit') {
      const angle = time * (365 / cube.orbitalPeriod);
      cube.rotation.z = -angle + Math.PI;
    }
    if (bloomComposer && finalComposer && bloomLayer && materials) {
      scene.traverse((obj) => darkenMaterial(obj, bloomLayer, materials));
      bloomComposer.render();
      scene.traverse((obj) => restoreMaterial(obj, materials));
      finalComposer.render();
    }

    // renderer.render(scene, camera);
    animationCount++; // Increment the animation loop counter
  };
  animateLoop();
};

main();
