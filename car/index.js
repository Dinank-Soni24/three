import * as THREE from 'https://cdn.skypack.dev/three@0.133.1';

import { OrbitControls } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GUI } from 'https://cdn.skypack.dev/dat.gui';

const main = async () => {
  // create Scene
  const scene = new THREE.Scene();

  // Set up camera
  const camera = await windowCamera();
  // Set up renderer
  const renderer = await windowRenderer();

  const shapePoints = [
    // new THREE.Vector2(-20, 0),
    // new THREE.Vector2(-20, 6),
    // new THREE.Vector2(-16, 6),
    // new THREE.Vector2(-12, 10),
    // new THREE.Vector2(0, 10),
    // new THREE.Vector2(4, 6),
    // new THREE.Vector2(8, 6),
    // new THREE.Vector2(8, 0),
    // new THREE.Vector2(2.934442802201417, 0.623735072453278),
    // new THREE.Vector2(2.7406363729278027, 1.2202099292274005),
    // new THREE.Vector2(2.4270509831248424, 1.7633557568774194),
    // new THREE.Vector2(2.0073918190765747, 2.229434476432183),
    // new THREE.Vector2(1.5000000000000004, 2.598076211353316),
    // new THREE.Vector2(0.9270509831248424, 2.8531695488854605),
    // new THREE.Vector2(0.31358538980296036, 2.9835656861048196),
    // new THREE.Vector2(-0.31358538980296, 2.98356568610482),
    // new THREE.Vector2(-0.927050983124842, 2.853169548885461),
    // new THREE.Vector2(-1.4999999999999993, 2.598076211353316),
    // new THREE.Vector2(-2.007391819076574, 2.2294344764321834),
    // new THREE.Vector2(-2.427050983124842, 1.7633557568774196),
    // new THREE.Vector2(-2.7406363729278027, 1.2202099292274),
    // new THREE.Vector2(-2.934442802201417, 0.623735072453278),
    // new THREE.Vector2(-3, 3.6739403974420594e-16),
    // new THREE.Vector2(-11, 0),
    // new THREE.Vector2(-11.065557197798583, 0.623735072453278),
    // new THREE.Vector2(-11.259363627072197, 1.2202099292274005),
    // new THREE.Vector2(-11.572949016875157, 1.7633557568774194),
    // new THREE.Vector2(-11.992608180923426, 2.229434476432183),
    // new THREE.Vector2(-12.5, 2.598076211353316),
    // new THREE.Vector2(-13.072949016875157, 2.8531695488854605),
    // new THREE.Vector2(-13.68641461019704, 2.9835656861048196),
    // new THREE.Vector2(-14.31358538980296, 2.98356568610482),
    // new THREE.Vector2(-14.927050983124841, 2.853169548885461),
    // new THREE.Vector2(-15.5, 2.598076211353316),
    // new THREE.Vector2(-16.007391819076574, 2.2294344764321834),
    // new THREE.Vector2(-16.427050983124843, 1.7633557568774196),
    // new THREE.Vector2(-16.740636372927803, 1.2202099292274),
    // new THREE.Vector2(-16.934442802201417, 0.623735072453278),
    // new THREE.Vector2(-17, 3.6739403974420594e-16),
  ];
  shapePoints.push(new THREE.Vector2(-24, 0));
  shapePoints.push(new THREE.Vector2(-24, 4.5));
  // Define control points for the bezier curve
  const controlPoint = new THREE.Vector2(-24, 5); // Adjust this control point to change the curvature

  // Add the bezier curve points to the shape
  const numPoints = 30; // Number of points to generate along the curve
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const x =
      (1 - t) * (1 - t) * -24 +
      2 * (1 - t) * t * controlPoint.x +
      t * t * -23.5;
    const y =
      (1 - t) * (1 - t) * 4.5 + 2 * (1 - t) * t * controlPoint.y + t * t * 5;
    shapePoints.push(new THREE.Vector2(x, y));
  }
  shapePoints.push(new THREE.Vector2(-23.5, 5));

  shapePoints.push(new THREE.Vector2(-16, 6));

  shapePoints.push(new THREE.Vector2(-12, 10));

  shapePoints.push(new THREE.Vector2(0, 10));
  shapePoints.push(new THREE.Vector2(4, 6));
  shapePoints.push(new THREE.Vector2(7.5, 6));
  // Define control points for the bezier curve
  const controlPointB = new THREE.Vector2(8, 6); // Adjust this control point to change the curvature

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const x =
      (1 - t) * (1 - t) * +7.5 + 2 * (1 - t) * t * controlPointB.x + t * t * +8;
    const y =
      (1 - t) * (1 - t) * 6 + 2 * (1 - t) * t * controlPointB.y + t * t * 5.5;
    shapePoints.push(new THREE.Vector2(x, y));
  }
  shapePoints.push(new THREE.Vector2(8, 5.5));
  shapePoints.push(new THREE.Vector2(8, 0));

  for (let i = 0; i <= 30 / 2; i++) {
    const theta = (i / 30) * Math.PI * 2;
    const x = 3 * Math.cos(theta);
    const y = 3 * Math.sin(theta);
    shapePoints.push(new THREE.Vector2(x, y));
  }
  for (let i = 0; i <= 30 / 2; i++) {
    const theta = (i / 30) * Math.PI * 2;
    const x = 3 * Math.cos(theta) - 14;
    const y = 3 * Math.sin(theta);
    shapePoints.push(new THREE.Vector2(x, y));
  }

  const shape = await windowShape(scene, 0xe6e6e6, shapePoints, 13, 0, 0, 0);

  const tireGroup = new THREE.Group();
  const tireGroup1 = new THREE.Group();
  const tire = await windowTorus(tireGroup1, 90, 0x0d0d0d, 0, 0, 0);
  const ring1 = await windowRing(
    tireGroup1,
    'standard',
    0.3,
    1.8,
    0xbfbfbf,
    0,
    0,
    0
  );
  tireGroup.add(tireGroup1);
  const tireGroup2 = tireGroup1.clone();
  tireGroup2.position.set(0, 0, 12.5);
  tireGroup.add(tireGroup2);
  const tireGroup3 = tireGroup1.clone();
  tireGroup3.position.set(-14, 0, 12.5);
  tireGroup.add(tireGroup3);
  const tireGroup4 = tireGroup1.clone();
  tireGroup4.position.set(-14, 0, 0);
  tireGroup.add(tireGroup4);
  scene.add(tireGroup);

  const underBoxShapePoints = [
    new THREE.Vector2(3, 0),
    new THREE.Vector2(3, 3),
    new THREE.Vector2(-3, 3),
    new THREE.Vector2(-3, 0),
  ];

  // underBox
  const underBox = await windowShape(
    scene,
    0xffffff,
    underBoxShapePoints,
    10,
    0,
    0,
    1.5
  );

  const underBoxF = underBox.clone();
  underBoxF.position.set(-14, 0, 1.5);
  scene.add(underBoxF);

  // line
  shapePoints.push(new THREE.Vector2(-24, 0));
  console.log(shapePoints, 'shapePoints');
  const line = await windowShapeLine(scene, shapePoints);
  const line2 = await windowShapeLine(scene, shapePoints);
  line2.position.set(0, 0, 13);

  const lineShapePoints = [new THREE.Vector2(0, 0), new THREE.Vector2(0, 13)];
  const line3 = await windowShapeLine(scene, lineShapePoints);
  line3.rotation.x = THREE.MathUtils.degToRad(90);
  line3.position.set(4.01, 6.01, 0);

  const line4 = line3.clone();
  line4.position.set(.01, 10.01, 0);
  scene.add(line4);
  const line5 = line3.clone();
  line5.position.set(-12.01, 10.01, 0);
  scene.add(line5);
  const line6 = line3.clone();
  line6.position.set(-16.01, 6.01, 0);
  scene.add(line6);

  // Add ambient light to illuminate the scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0xffffff, 0.5);
  spotLight.position.set(40, 40, 40); // Position the light
  spotLight.castShadow = true; // Enable shadow casting
  spotLight.penumbra = 0.15;
  scene.add(spotLight);

  // // GUI
  // const gui = new GUI();
  // const shapePointsFolder = gui.addFolder('Shape Points');
  // shapePointsFolder.add(shapePoints[0], 'x', -10, 10, 1).name('X');
  // shapePointsFolder.add(shapePoints[0], 'y', -10, 10, 1).name('Y');
  // shapePointsFolder.add(shapePoints[0], 'z', -10, 10, 1).name('Z');
  // shapePointsFolder.open();

  // Add mouse interaction for rotating the torus
  addMouseInteraction(renderer.domElement, scene, camera);

  animate({ scene, camera, renderer });
  animate({ cube: tireGroup1, x: 0, y: 0, z: 0.1 });
  animate({ cube: tireGroup2, x: 0, y: 0, z: 0.1 });
  animate({ cube: tireGroup3, x: 0, y: 0, z: 0.1 });
  animate({ cube: tireGroup4, x: 0, y: 0, z: 0.1 });
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

const windowShapeLine = (scene, shapePoints) => {
  const geometry = new THREE.BufferGeometry().setFromPoints(shapePoints);

  const material = new THREE.LineBasicMaterial({ color: 0x000000 }); //ignored by WebGLRenderer });

  const line = new THREE.Line(geometry, material);
  line.layers.enable(1);
  scene.add(line);

  return line;
};

const windowShape = async (
  scene,
  color,
  shapePoints,
  depth,
  px,
  py,
  pz,
  rotation
) => {
  // Create a shape from the points
  const shape = new THREE.Shape(shapePoints);

  // Define settings for extrusion
  const extrudeSettings = {
    depth, // Depth of extrusion
    bevelEnabled: false, // Disable bevel
    bevelThickness: 1,
    bevelSize: 1,
    bevelOffset: 0,
    bevelSegments: 1,
  };

  // Create a geometry by extruding the shape
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Create a material
  const material = new THREE.MeshStandardMaterial({
    color,
    // wireframe: true
  });

  // Create a mesh using the geometry and material
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.set(px, py, pz);
  // mesh.rotation.y = rotation == 0 ? 0 : -Math.PI / rotation;
  // Add the mesh to the scene
  scene.add(mesh);

  return mesh;
};

const windowTorus = async (scene, angle, color, px, py, pz) => {
  const torusGeometry = new THREE.TorusGeometry(2, .8, 12, 98, angle); // create a torus geometry with radius 10, tube radius 1.6, radial segments 16, tubular segments 100
  const torusMaterial = new THREE.MeshBasicMaterial({
    color,
    // wireframe: true,
  });
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.position.set(px, py, pz);
  scene.add(torus);

  return torus;
};

const windowRing = async (
  scene,
  materials,
  innerRadius,
  outerRadius,
  color,
  px,
  py,
  pz
) => {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 1, 1);
  const material =
    materials == 'standard'
      ? new THREE.MeshStandardMaterial({
          color,
          side: THREE.DoubleSide,
        })
      : new THREE.MeshBasicMaterial({
          color,
          side: THREE.DoubleSide,
        });
  const ring = new THREE.Mesh(geometry, material);
  ring.position.set(px, py, pz);
  // ring.rotation.x = Math.PI / 2;
  // ring.rotation.y = Math.PI;
  ring.layers.enable(1);
  scene.add(ring);

  return ring;
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

let scene;
let camera;
let renderer;
const animate = (animateCube) => {
  let animationCount = 0;
  if (animateCube.scene) {
    scene = animateCube.scene;
  }
  if (animateCube.camera) {
    camera = animateCube.camera;
  }
  if (animateCube.renderer) {
    renderer = animateCube.renderer;
  }
  const animateLoop = () => {
    // if (animationCount >= 200) {
    //   // Check if the animation loop has run 10 times
    //   return; // Exit the animation loop if the limit is reached
    // }
    requestAnimationFrame(animateLoop);

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
    }

    renderer?.render(scene, camera);
    animationCount++; // Increment the animation loop counter
  };

  if (animateCube?.cube) {
    animateLoop();
  }
};

main();
