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

  const solarSystem = new THREE.Group();
  const sun = await windowSphere(
    solarSystem,
    'phong',
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
  solarSystem.name = 'solarSystem';
  scene.add(solarSystem);
  // sun.castShadow = true;

  // Bloom effect setup
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    3, // strength
    0.5, // radius
    0 // threshold
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

  const belt = new THREE.Group();
  // Generate the asteroid belt between Earth and Mars
  generateAsteroidBelt(belt, 200, 260, 500);
  solarSystem.add(belt);

  const mercuryGroup = new THREE.Group();
  const mercury = await windowSphere(
    mercuryGroup,
    'standard',
    false,
    0.38,
    32,
    32,
    0x8b8680,
    0,
    0,
    0
  );
  mercuryGroup.position.set(0, 0, 39);
  mercuryGroup.orbitalPeriod = 88;
  mercuryGroup.distance = mercuryGroup.position.z;
  mercuryGroup.name = 'Orbit';
  mercuryGroup.PlanetName = 'mercury';
  solarSystem.add(mercuryGroup);

  const venusGroup = new THREE.Group();
  const venus = await windowSphere(
    venusGroup,
    'standard',
    false,
    0.95,
    32,
    32,
    0xeed5b7,
    0,
    0,
    0
  );
  solarSystem.add(venusGroup);
  venusGroup.position.set(0, 0, 72);
  venusGroup.orbitalPeriod = 225;
  venusGroup.distance = venusGroup.position.z;
  venusGroup.name = 'Orbit';
  venusGroup.PlanetName = 'venus';

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
  // const earthOrbit = await windowRing(
  //   scene,
  //   'basic',
  //   100,
  //   0.2,
  //   0x090909,
  //   0,
  //   0,
  //   0
  // );
  // Create Moon
  const moon = await windowSphere(
    earthGroup,
    'standard',
    false,
    0.27, // Moon's radius relative to Earth
    32,
    32,
    0xffffff,
    0,
    0,
    0 // Distance from Earth
  );
  solarSystem.add(earthGroup);
  earthGroup.position.set(0, 0, 100);
  // moon.layers.enable(1);
  moon.orbitalPeriod = 88;
  console.log(moon);
  moon.name = 'Moon';
  earthGroup.orbitalPeriod = 365;
  earthGroup.distance = earthGroup.position.z;
  earthGroup.name = 'Orbit';

  const marsGroup = new THREE.Group();
  const mars = await windowSphere(
    marsGroup,
    'standard',
    false,
    0.53,
    32,
    32,
    0xa52a2a,
    0,
    0,
    0
  );
  marsGroup.position.set(0, 0, 152);
  marsGroup.orbitalPeriod = 687;
  marsGroup.distance = marsGroup.position.z;
  marsGroup.name = 'Orbit';
  marsGroup.PlanetName = 'mars';
  solarSystem.add(marsGroup);

  const jupiterGroup = new THREE.Group();
  const jupiter = await windowSphere(
    jupiterGroup,
    'standard',
    false,
    11,
    32,
    32,
    0xf4a460,
    0,
    0,
    0
  );
  jupiterGroup.position.set(0, 0, 300);
  jupiterGroup.orbitalPeriod = 4333;
  jupiterGroup.distance = jupiterGroup.position.z;
  jupiterGroup.name = 'Orbit';
  jupiterGroup.PlanetName = 'jupiter';
  solarSystem.add(jupiterGroup);

  const saturnGroup = new THREE.Group();
  const saturn = await windowSphere(
    saturnGroup,
    'standard',
    false,
    9.5,
    32,
    32,
    0xd2b48c,
    0,
    0,
    0
  );
  saturnGroup.position.set(0, 0, 450);
  saturnGroup.orbitalPeriod = 10759;
  saturnGroup.distance = saturnGroup.position.z;
  saturnGroup.name = 'Orbit';
  saturnGroup.PlanetName = 'saturn';
  solarSystem.add(saturnGroup);

  const uranusGroup = new THREE.Group();
  const uranus = await windowSphere(
    uranusGroup,
    'standard',
    false,
    4,
    32,
    32,
    0xafeeee,
    0,
    0,
    0
  );
  uranusGroup.position.set(0, 0, 550);
  uranusGroup.orbitalPeriod = 30687;
  uranusGroup.distance = uranusGroup.position.z;
  uranusGroup.name = 'Orbit';
  uranusGroup.PlanetName = 'uranus';
  solarSystem.add(uranusGroup);

  const neptuneGroup = new THREE.Group();
  const neptune = await windowSphere(
    neptuneGroup,
    'standard',
    false,
    3.88,
    32,
    32,
    0x0000ff,
    0,
    0,
    0
  );
  neptuneGroup.position.set(0, 0, 650);
  neptuneGroup.orbitalPeriod = 60190;
  neptuneGroup.distance = neptuneGroup.position.z;
  neptuneGroup.name = 'Orbit';
  neptuneGroup.PlanetName = 'neptune';
  solarSystem.add(neptuneGroup);

  const starts = new THREE.Group();
  // Create the star field
  createStarField(starts);
  solarSystem.add(starts);

  // Light source
  const light = new THREE.PointLight(0xffffff, 0.7, 0);
  light.position.set(0, 0, 0); // Position the light at the center (Sun)
  light.castShadow = true; // Enable shadows for the light
  light.shadow.mapSize.width = 1024; // Shadow map resolution
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 500;
  solarSystem.add(light);
  // light.castShadow = true;

  // Add ambient light to illuminate the scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  solarSystem.add(ambientLight);

  // Add mouse interaction for rotating the torus
  addMouseInteraction(renderer.domElement, scene, camera);

  const animateSun = {
    scene,
    camera,
    renderer,
    cube: sun,
    bloomComposer,
    finalComposer,
    bloomLayer,
    materials,
    group: solarSystem,
  };
  animate(animateSun);
  const animateMercury = {
    cube: mercuryGroup,
  };
  animate(animateMercury);
  const animateVenus = {
    cube: venusGroup,
  };
  animate(animateVenus);
  const animateEarth = {
    cube: earthGroup,
  };
  animate(animateEarth);
  const animateMars = {
    cube: marsGroup,
  };
  animate(animateMars);
  const animateJupiter = {
    cube: jupiterGroup,
  };
  animate(animateJupiter);
  const animateSaturn = {
    cube: saturnGroup,
  };
  animate(animateSaturn);
  const animateUranus = {
    cube: uranusGroup,
  };
  animate(animateUranus);
  const animateNeptune = {
    cube: neptuneGroup,
  };
  animate(animateNeptune);
  const animateMoon = {
    cube: moon,
  };
  animate(animateMoon);
  const animateSolarSystem = {
    cube: solarSystem,
  };
  animate(animateSolarSystem);
  // const animateBelt = {
  //   cube: belt,
  //   x: 0,
  //   y: 0.00005,
  //   z: 0,
  // };
  // animate(animateBelt);
  // const animateStarts = {
  //   cube: starts,
  //   x: 0,
  //   y: 0.000001,
  //   z: 0,
  // };
  // animate(animateStarts);
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
      : materials == 'phong'
      ? new THREE.MeshPhongMaterial({
          color,
          emissive: 0x000000,
        })
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

const generateAsteroidBelt = (scene, innerRadius, outerRadius, count) => {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = (Math.random() - 0.5) * 10; // Slight vertical spread

    const asteroid = new THREE.Mesh(
      new THREE.SphereGeometry(Math.random() * 0.3, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x0080ff })
    );
    asteroid.position.set(x, y, z);
    asteroid.castShadow = true;
    asteroid.receiveShadow = true;
    asteroid.layers.enable(1);
    scene.add(asteroid);
  }
};

// const windowShape = (scene, shapePoints) => {
//   const shape = new THREE.Shape(shapePoints);
//   // Define settings for extrusion
//   const extrudeSettings = {
//     depth: 0.1, // Depth of extrusion
//     bevelEnabled: false, // Disable bevel
//     bevelThickness: 1,
//     bevelSize: 1,
//     bevelOffset: 0,
//     bevelSegments: 1,
//   };

//   // Create a geometry by extruding the shape
//   const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

//   // Create a material
//   const material = new THREE.MeshBasicMaterial({ color: 0x0f0f0f });

//   // Create a mesh using the geometry and material
//   const mesh = new THREE.Mesh(geometry, material);
//   // mesh.position.set(0, 0, 0);
//   mesh.rotation.x = Math.PI / 2;
//   // Add the mesh to the scene
//   mesh.layers.enable(1);
//   scene.add(mesh);

//   return mesh;
// };

const windowShape = (scene, shapePoints) => {
  const geometry = new THREE.BufferGeometry().setFromPoints(shapePoints);

  const material = new THREE.LineBasicMaterial({ color: 0x0f0f0f });

  const line = new THREE.Line(geometry, material);
  line.layers.enable(1);
  scene.add(line);

  return line;
};

let scene;
let shapePoints = {};
let cameraNearPlanet = false; // Flag to toggle camera movement
let cameraPathRadius = 150; // Distance from the solar system
let cameraPathAngle = 0; // Initial angle
const animate = (animateCube) => {
  let animationCount = 0;
  let oldShapeMesh = null;
  let yPoint = 0;
  if (animateCube.scene) {
    scene = animateCube.scene;
  }

  console.log(animateCube, 'animateCube');
  console.log(scene, 'scene');
  const animateLoop = () => {
    // if (animationCount >= 200) {
    //   // Check if the animation loop has run 10 times
    //   return; // Exit the animation loop if the limit is reached
    // }
    requestAnimationFrame(animateLoop);
    const time = Date.now() * 0.0001;
    // rotate planets around the sun
    const angle = time * (365 / animateCube.cube.orbitalPeriod); // Speed based on orbital period

    if (
      animateCube?.x >= 0 &&
      animateCube?.y >= 0 &&
      animateCube?.z >= 0
      // animateCube.cube?.name == 'sun'
    ) {
      // Rotate the cube
      animateCube.cube.rotation.x += animateCube.x;
      animateCube.cube.rotation.y += animateCube.y;
      animateCube.cube.rotation.z += animateCube.z;
    } else if (animateCube.cube?.distance && animateCube.cube?.orbitalPeriod) {
      animateCube.cube.position.x =
        animateCube.cube?.distance * Math.cos(angle);
      animateCube.cube.position.z =
        animateCube.cube?.distance * Math.sin(angle);

      let name = animateCube?.cube?.PlanetName;
      yPoint = yPoint + animateCube.cube.position.y + 0.1;
      const point = new THREE.Vector3(
        animateCube.cube.position.x,
        yPoint,
        animateCube.cube.position.z
      );
      if (!shapePoints[name]) {
        shapePoints[name] = [];
      }
      const shapePointsLength = shapePoints[name].length;
      if (shapePointsLength == 0) {
        shapePoints[name].push(point);
        shapePoints[name].push(point);
      } else if (shapePointsLength >= animateCube.cube.distance * 10) {
        shapePoints[name].shift();
        shapePoints[name].pop();
      } else {
        shapePoints[name].splice(shapePointsLength / 2, 0, point);
        shapePoints[name].splice(shapePointsLength / 2, 0, point);
      }
    }
    if (animateCube?.cube?.name == 'Moon') {
      animateCube.cube.position.z = 3 * Math.sin(angle); // - max start
      animateCube.cube.position.x = 3 * Math.cos(angle); // + min start
    }
    if (animateCube?.cube?.name == 'Orbit') {
      // const angle = time * (365 / animateCube.cube.orbitalPeriod);
      // animateCube.cube.rotation.z = -angle + Math.PI;
      if (oldShapeMesh) {
        scene.remove(oldShapeMesh);
        oldShapeMesh.geometry.dispose();
        oldShapeMesh.material.dispose();
      }

      let name = animateCube?.cube?.PlanetName;
      // console.log('first', shapePoints);
      // console.log('cdc', name);
      // console.log('cdc', shapePoints.mercury);
      oldShapeMesh = windowShape(scene, shapePoints[name]);
    }
    if (
      animateCube?.bloomComposer &&
      animateCube?.finalComposer &&
      animateCube?.bloomLayer &&
      animateCube?.materials
    ) {
      animateCube?.scene.traverse((obj) =>
        darkenMaterial(obj, animateCube.bloomLayer, animateCube.materials)
      );
      animateCube.bloomComposer.render();
      animateCube?.scene.traverse((obj) =>
        restoreMaterial(obj, animateCube.materials)
      );
      animateCube.finalComposer.render();
    }

    if (animateCube?.cube?.name == 'solarSystem') {
      animateCube.cube.position.y += 0.1;
    }

    if (animateCube?.camera) {
      // Camera movement
      if (!cameraNearPlanet) {
        cameraPathAngle += 0.01; // Adjust this for speed of rotation
        animateCube.camera.position.x =
          cameraPathRadius * Math.cos(cameraPathAngle);
        animateCube.camera.position.z =
          cameraPathRadius * Math.sin(cameraPathAngle);
        animateCube.camera.position.y += 0.1; // Fixed height
        animateCube.camera.lookAt(
          new THREE.Vector3(0, animateCube.camera.position.y, 0)
        ); // Look at the center of the solar system

        animateCube.camera.rotation.z += 1;
      } else {
        // Move camera closer to the selected planet (e.g., Earth)
        const targetPlanet = scene.getObjectByName('earth'); // Adjust as necessary
        if (targetPlanet) {
          animateCube.camera.position.lerp(
            targetPlanet.position.clone().add(new THREE.Vector3(10, 10, 10)),
            0.05
          ); // Adjust distance
          animateCube?.camera.lookAt(targetPlanet.position);
        }
      }
    }

    // document.addEventListener('keydown', (event) => {
    //   if (event.key === 'p') {
    //     // Press 'p' to toggle camera movement near planet
    //     cameraNearPlanet = !cameraNearPlanet;
    //   }
    // });

    // animateCube.renderer.render(animateCube.scene, animateCube.camera);
    animationCount++; // Increment the animation loop counter
  };
  animateLoop();
};

main();
