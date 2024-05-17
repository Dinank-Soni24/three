import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';

const main = async () => {
  // create Scene
  const scene = new THREE.Scene();

  // movement variables
  const keyState = {
    moveForward: false,
    moveBackward: false,
    rotateLeft: false,
    rotateRight: false,
  };

  // camera ball
  const ball = await windowSphere(scene, false, 3, 32, 32, 0xff0000, 0, 5, 0);

  // Set up camera
  const camera = await windowCamera(ball);

  // Set up renderer
  const renderer = await windowRenderer();

  // Add cube to the scene
  const footPath = await windowBox(scene, 50, 5, 500, 0x1a1a1a, 0, 0, -100, 0);
  const floor = await windowPlane(scene, 0x86592d, 500, 500, 0, 0, -100, 2);
  const roomFloor = await windowPlane(scene, 0x808080, 500, 500, 0, 0, -650, 2);

  // Walls
  const roomBox = new THREE.Group();
  const wallShapePoints = [
    new THREE.Vector2(-250, 0), // Start point
    new THREE.Vector2(-25, 0), // Second point
    new THREE.Vector2(-25, 50), // Third point
    new THREE.Vector2(25, 50), // Fourth point
    new THREE.Vector2(25, 0), // Fifth point
    new THREE.Vector2(250, 0), // 6 point
    new THREE.Vector2(250, 100), // 7 point
    new THREE.Vector2(-250, 100), // 8 point
  ];
  const sideWallShapePoints = [
    new THREE.Vector3(-250, 0), // Fifth point
    new THREE.Vector3(250, 0), // 6 point
    new THREE.Vector3(250, 100), // 7 point
    new THREE.Vector3(-250, 100), // 8 point
  ];

  const wallShape = await windowShape(
    roomBox,
    0x595959,
    wallShapePoints,
    5,
    0,
    0,
    -400,
    0
  );
  const lSideWallShape = await windowShape(
    roomBox,
    0x595959,
    sideWallShapePoints,
    5,
    -250,
    0,
    -650,
    2
  );
  const rSideWallShape = await windowShape(
    roomBox,
    0x595959,
    sideWallShapePoints,
    5,
    250,
    0,
    -650,
    2
  );
  const bSideWallShape = await windowShape(
    roomBox,
    0x595959,
    sideWallShapePoints,
    5,
    0,
    0,
    -900,
    0
  );
  scene.add(roomBox);

  // door
  const doorGroup = new THREE.Group();
  const doorShapePoints = [
    new THREE.Vector2(-24, 0), // Start point
    new THREE.Vector2(0, 0), // Second point
    new THREE.Vector2(0, 50), // Third point
    new THREE.Vector2(0, 0), // Fourth point
    new THREE.Vector2(24, 0), // Fifth point
    new THREE.Vector2(24, 50), // 6 point
    new THREE.Vector2(-24, 50), // 7 point
    // new THREE.Vector2(-250, 100), // 8 point
  ];

  const doorShape = await windowShape(
    doorGroup,
    0xac7339,
    doorShapePoints,
    5,
    0,
    0,
    -400,
    0
  );
  doorShape.name = 'door';
  doorShape.degreeCount = 0;

  const doorRBorder = await windowCylinder(
    doorGroup,
    5,
    5,
    50,
    10,
    10,
    false,
    0x000000,
    30,
    25,
    -390,
    0,
    0,
    0
  );
  const doorLBorder = await windowCylinder(
    doorGroup,
    5,
    5,
    50,
    10,
    10,
    false,
    0x000000,
    -30,
    25,
    -390,
    0,
    0,
    0,
    0
  );
  const doorUBorder = await windowCylinder(
    doorGroup,
    5,
    5,
    70,
    10,
    10,
    false,
    0x000000,
    0,
    55,
    -390,
    0,
    0,
    2
  );
  const doorDBorder = await windowCylinder(
    doorGroup,
    5,
    5,
    58,
    10,
    10,
    false,
    0x000000,
    0,
    0,
    -390,
    0,
    0,
    2
  );
  scene.add(doorGroup);

  // Add ambient light to illuminate the scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  //streetLight
  const streetLightBasic = new THREE.Group();
  const streetLight = new THREE.Group();
  const lightSource = await windowSphere(
    scene,
    streetLightBasic,
    1.3,
    32,
    32,
    0xffffff,
    0,
    21,
    0
  );
  const lightSourceClosedUpside = await windowCircle(
    streetLightBasic,
    0x808000,
    2,
    32,
    Math.PI * 2,
    2,
    0,
    25,
    0
  );
  const spotLight = await windowSpotLight(
    streetLightBasic,
    0xffffff,
    3,
    0,
    20,
    0
  );
  const lightSourceCover = await windowCylinder(
    streetLightBasic,
    2,
    3,
    5,
    10,
    1,
    true,
    0x663300,
    0,
    22.5,
    0,
    0,
    0,
    0
  );
  const lightSourceHead = await windowCylinder(
    streetLightBasic,
    0.5,
    0.5,
    3,
    10,
    1,
    false,
    0x734d26,
    0,
    26.5,
    0,
    0,
    0,
    0
  );
  const lightSourceSupport = await windowCylinder(
    streetLightBasic,
    1,
    1,
    30,
    10,
    1,
    false,
    0x734d26,
    10,
    15,
    0,
    0,
    0,
    0
  );
  const lightSourceSupportMain = await windowCylinder(
    streetLight,
    0.5,
    0.5,
    10,
    10,
    1,
    false,
    0x734d26,
    5,
    26.5,
    0,
    0,
    0,
    2
  );
  streetLight.add(streetLightBasic);

  // multiply the streetLight with multiple streetLights
  const streetsLight = new THREE.Group();
  const multipleStreetsLights = await multipleStreetLights(
    streetLight,
    streetsLight,
    -2,
    6
  );
  multipleStreetsLights.position.set(5, 0, 0);
  scene.add(streetsLight);

  const globalLight = await windowSpotLight(
    scene,
    0xffffff,
    0.1,
    400,
    100,
    200
  );
  scene.add(globalLight);
  const spotLightHelper = new THREE.SpotLightHelper(globalLight);
  scene.add(spotLightHelper);

  // tree
  const tree = new THREE.Group();
  const treeLeaf = new THREE.Group();
  const ball1 = await windowSphere(
    treeLeaf,
    false,
    15,
    32,
    32,
    0x00ff00,
    0,
    25,
    0
  );
  const ball2 = await windowSphere(
    treeLeaf,
    false,
    15,
    32,
    32,
    0x00ff00,
    7.5,
    20,
    0
  );
  const ball3 = await windowSphere(
    treeLeaf,
    false,
    15,
    32,
    32,
    0x00ff00,
    -7.5,
    20,
    0
  );
  const ball4 = await windowSphere(
    treeLeaf,
    false,
    15,
    32,
    32,
    0x00ff00,
    0,
    20,
    7.5
  );
  const ball5 = await windowSphere(
    treeLeaf,
    false,
    15,
    32,
    32,
    0x00ff00,
    0,
    20,
    -7.5
  );
  tree.add(treeLeaf);

  const treeRoot = await windowCylinder(
    tree,
    4,
    4,
    40,
    10,
    1,
    false,
    0x8b4513,
    0,
    0,
    0,
    0,
    0,
    0
  );
  // scene.add(tree);

  const trees = new THREE.Group();
  // const multipletres = await multipleTree(tree, trees, 10);
  scene.add(trees);

  // // Text writing
  // const text = await windowText(
  //   scene,
  //   'Welcome to My World',
  //   0xff0000,
  //   -5,
  //   0,
  //   -40
  // );
  // console.log(text, 'text');

  // Add the streetLight to the scene

  // Add mouse interaction for rotating the torus
  // addMouseInteraction(renderer.domElement, scene, camera);

  // Event listeners for keyboard controls
  document.addEventListener(
    'keydown',
    (event) => onDocumentKeyDown(event, keyState),
    false
  );
  document.addEventListener(
    'keyup',
    (event) => onDocumentKeyUp(event, keyState),
    false
  );

  // scene.fog = new THREE.Fog(0xcccccc, 1, 500);
  renderer.shadowMap.enabled = true;

  // Start the animation loop
  animate(scene, camera, renderer, ball, {}, keyState, 0.0, 0.0, 0.0);
  animate(scene, camera, renderer, doorShape, ball, {}, 0.0, 0.0, 0.0);
};

const windowCamera = async (ball) => {
  // create Camera for viewing the scene
  const camera = new THREE.PerspectiveCamera(
    75, // angle of view (FOV) in degree (0 ~ 180)
    window.innerWidth / window.innerHeight, // aspect ratio (width / height) of the canvas element
    0.1, // near clipping plane
    1000 // far clipping plane
  );

  camera.position.set(0, 10, 40); // camera position
  ball.add(camera);

  return camera;
};

const onDocumentKeyDown = (event, keyState) => {
  switch (event.code) {
    case 'ArrowUp':
      keyState.moveForward = true;
      break;
    case 'ArrowDown':
      keyState.moveBackward = true;
      break;
    case 'ArrowLeft':
      keyState.rotateLeft = true;
      break;
    case 'ArrowRight':
      keyState.rotateRight = true;
      break;
  }
};

const onDocumentKeyUp = (event, keyState) => {
  switch (event.code) {
    case 'ArrowUp':
      keyState.moveForward = false;
      break;
    case 'ArrowDown':
      keyState.moveBackward = false;
      break;
    case 'ArrowLeft':
      keyState.rotateLeft = false;
      break;
    case 'ArrowRight':
      keyState.rotateRight = false;
      break;
  }
};

const windowRenderer = async () => {
  const canvas = document.querySelector('#canva'); // get canvas element from DOM
  const renderer = new THREE.WebGLRenderer({ canvas }); // create WebGLRenderer instance to render the scene in the canvas element using the WebGL API
  renderer.setSize(window.innerWidth, window.innerHeight); // set the size of the renderer to match the size of the canvas element

  return renderer;
};

const windowBox = async (scene, x, y, z, color, px, py, pz, rotation) => {
  const geometry = new THREE.BoxGeometry(x, y, z); // create a cube geometry
  const material = new THREE.MeshStandardMaterial({ color }); // create a material for the cube geometry

  const cube = new THREE.Mesh(geometry, material); // create a mesh from the cube geometry and the material
  cube.castShadow = true; // Enable shadow casting for the cube
  cube.receiveShadow = true; // Enable shadow receiving for the cube
  cube.rotation.y = rotation == 0 ? 0 : -Math.PI / rotation;

  scene.add(cube); // add the cube mesh to the scene

  cube.position.set(px, py, pz);
  // cube.visible = false;
  return cube;
};

const windowBoxBorder = async (scene) => {
  const geometry = new THREE.BoxGeometry(2.1, 2.1, 2.1); // create a cube geometry
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff, // white color
    wireframe: true, // enable wireframe that give only border line in cube
  }); // create a material for the cube geometry

  const cube = new THREE.Mesh(geometry, material); // create a mesh from the cube geometry and the material

  scene.add(cube); // add the cube mesh to the scene

  return cube;
};

const windowTorus = async (scene, angle, color, px, py, pz) => {
  const torusGeometry = new THREE.TorusGeometry(10, 1.6, 16, angle); // create a torus geometry with radius 10, tube radius 1.6, radial segments 16, tubular segments 100
  const torusMaterial = new THREE.MeshBasicMaterial({
    color,
    wireframe: true,
  });
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.position.set(px, py, pz);
  scene.add(torus);

  return torus;
};

const windowSphere = async (
  scene,
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
  const material = new THREE.MeshStandardMaterial({ color });
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

const windowText = async (scene, text, color, x, y, z) => {
  return new Promise((resolve, reject) => {
    // Load a built-in font
    const loader = new THREE.FontLoader();
    loader.load(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
      function (font) {
        // Create a text geometry
        const textGeometry = new THREE.TextGeometry(text, {
          font: font, // Load your font data here or use a built-in font
          size: 1, // Size of the text
          height: 0.1, // Thickness of the text
          curveSegments: 12, // Number of segments for curves
          bevelEnabled: false, // Whether to enable beveling
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color }); // Material for the text
        const textMesh = new THREE.Mesh(textGeometry, textMaterial); // Create a mesh with the text geometry
        textMesh.position.set(x, y, z);
        scene.add(textMesh); // Add the text mesh to the scene
        textMesh.visible = false;
        textMesh.name = 'textMesh';
        resolve(textMesh); // Resolve the Promise with the textMesh
      }
    );
  });
};

const windowPlane = async (scene, color, x, y, px, py, pz, rotation) => {
  // Create a floor to receive shadows
  const floorGeometry = new THREE.PlaneGeometry(x, y);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color,
    side: THREE.DoubleSide,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = Math.PI / rotation; // Rotate the floor to lie flat
  floor.receiveShadow = true; // Enable shadow receiving
  floor.position.set(px, py, pz);
  scene.add(floor);

  return floor;
};

const windowSpotLight = async (scene, color, density, px, py, pz) => {
  // Create a spotlight
  const spotLight = new THREE.SpotLight(color, density); // White light
  spotLight.position.set(px, py, pz); // Position the light
  spotLight.castShadow = true; // Enable shadow casting
  spotLight.penumbra = 0.15;
  // spotLight.target.position.set(0, -10, 0); // Set the target of the spotlight to a point below the scene
  scene.add(spotLight);

  // spotLight.target.updateMatrixWorld(); // Update the target's matrix world to reflect its position
  // spotLight.target.updateWorldMatrix(true, false); // Update the world matrix of the target
  // spotLight.target.updateMatrix(); // Update the matrix of the target

  // Create a line to visualize spotlight direction
  // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  // scene.add(spotLightHelper);
  // streetLight.add(light.target);

  return spotLight;
};

const multipleStreetLights = async (basicScene, mainScene, min, max) => {
  for (let i = min; i < max; i++) {
    const streetLightClone = basicScene.clone();
    streetLightClone.position.set(0, 0, -i * 60);
    mainScene.add(streetLightClone);

    // Set the target of the spotlight to a point below the mainScene
    const target = new THREE.Object3D();
    target.position.copy(streetLightClone.position);
    streetLightClone.children[1].children[2].target = target;
    mainScene.add(target);
  }

  return mainScene;
};

// const multipleTree = async (basicScene, mainScene, max) => {
//   const positions = [];
//   for (let i = 0; i < max; i++) {
//     const treeClone = basicScene.clone();
//     const { x, y, z } = await generatePosition(
//       { max: -40, min: -210 },
//       { max: 40, min: -300 },
//       20
//     );
//     positions.push({ x, y, z });
//     for (let j = 0; j < positions.length; j++) {
//       console.log(treeClone.position.distanceTo(positions[j]));
//       // treeClone.position.distanceTo(positions[j]);
//       if (treeClone.position.distanceTo(positions[j]) >= 20) {
//         treeClone.position.set(x, y, z);
//         mainScene.add(treeClone);
//       }
//     }
//   }
//   return mainScene;
// };

const generatePosition = async (xRange, zRange, yPosition) => {
  const x = Math.random() * (xRange.max - xRange.min) + xRange.min;
  const z = Math.random() * (zRange.max - zRange.min) + zRange.min;
  return { x, y: yPosition, z };
};

const windowCylinder = async (
  scene,
  radiusTop,
  radiusBottom,
  height,
  radialSegments,
  heightSegments,
  openEnded,
  color,
  px,
  py,
  pz,
  rotationX,
  rotationY,
  rotationZ
) => {
  const geometry = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    radialSegments,
    heightSegments,
    openEnded
  );
  const material = new THREE.MeshStandardMaterial({ color });
  const cylinder = new THREE.Mesh(geometry, material);
  scene.add(cylinder);
  cylinder.position.set(px, py, pz);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  cylinder.rotation.x = rotationX == 0 ? 0 : -Math.PI / rotationX;
  cylinder.rotation.y = rotationY == 0 ? 0 : -Math.PI / rotationY;
  cylinder.rotation.z = rotationZ == 0 ? 0 : -Math.PI / rotationZ;
  // cylinder.rotation.y = rotation == 0 ? 0 : -Math.PI / rotation;

  // Set rotation of the cylinder
  // cylinder.rotation.x = 100;
  // cylinder.rotation.y = -20;
  // cylinder.rotation.z = -10;

  return cylinder;
};

const windowCircle = async (
  scene,
  color,
  radius,
  segments,
  thetaLength,
  rotation,
  px,
  py,
  pz
) => {
  const geometry = new THREE.CircleGeometry(radius, segments, 0, thetaLength);
  const material = new THREE.MeshBasicMaterial({ color });
  const circle = new THREE.Mesh(geometry, material);
  circle.position.set(px, py, pz);
  circle.rotation.x = rotation == 0 ? 0 : -Math.PI / rotation;
  scene.add(circle);

  return circle;
};

const windowPartial = async (scene) => {
  // Create particle geometry
  const particleCount = 1000;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3); // Each particle has 3 coordinates (x, y, z)

  for (let i = 0; i < particleCount; i++) {
    // Randomly generate positions within a range
    positions[i * 3] = Math.random() * 10 - 5; // x position
    positions[i * 3 + 1] = Math.random() * 10 - 5; // y position
    positions[i * 3 + 2] = Math.random() * 10 - 5; // z position
  }

  // Set positions attribute
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Create particle material
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff, // Particle color
    size: 0.1, // Particle size
  });

  // Create particle system
  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);
  particleSystem.name = 'particleSystem';
  particleSystem.position.set(0, 10, 0);
  return particleSystem;
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
    bevelEnabled: true, // Disable bevel
    bevelThickness: 1,
    bevelSize: 1,
    bevelOffset: 0,
    bevelSegments: 1,
  };

  // Create a geometry by extruding the shape
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Create a material
  const material = new THREE.MeshStandardMaterial({ color });

  // Create a mesh using the geometry and material
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(px, py, pz);
  mesh.rotation.y = rotation == 0 ? 0 : -Math.PI / rotation;
  // Add the mesh to the scene
  scene.add(mesh);

  return mesh;
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

const animate = (scene, camera, renderer, cube, cube2, key, x, y, z) => {
  let animationCount = 0;
  // Define the animation loop function
  let time = 0;
  const animateLoop = () => {
    // if (animationCount >= 300) {
    //   // Check if the animation loop has run 10 times
    //   return; // Exit the animation loop if the limit is reached
    // }

    // Calculate the distance between the cube and the camera
    let distance;
    if (cube?.name == 'door' && cube2?.position) {
      distance = cube?.position?.distanceTo(cube2?.position);
      // Door rotation
      if (cube?.degreeCount < 90 && cube?.degreeCount >= 0 && distance <= 150) {
        // Rotate the door by 1 degree around its pivot point
        cube.rotation.x += Math.PI / 180; // Rotate by 1 degree
        cube.degreeCount += 1;
      } else if (
        cube?.degreeCount <= 90 &&
        cube?.degreeCount > 0 &&
        distance > 150
      ) {
        // Rotate the door by 1 degree around its pivot point
        cube.rotation.x -= Math.PI / 180; // Rotate by 1 degree
        cube.degreeCount -= 1;
      }
    }

    // key movement animation
    // Movement speed and rotation speed
    const moveSpeed = 1;
    const rotateSpeed = 0.04;

    // Move ball
    if (key?.moveForward) {
      cube.translateZ(-moveSpeed);
    }
    if (key?.moveBackward) {
      cube.translateZ(moveSpeed);
    }

    // Rotate cube
    if (key?.rotateLeft) {
      cube.rotation.y += rotateSpeed;
    }
    if (key?.rotateRight) {
      cube.rotation.y -= rotateSpeed;
    }

    requestAnimationFrame(animateLoop);

    if (cube?.visible) {
      // Rotate the cube
      cube.rotation.x += x;
      cube.rotation.y += y;
      cube.rotation.z += z;
    }

    // Render the scene with the updated camera and cube positions
    renderer.render(scene, camera);
    animationCount++; // Increment the animation loop counter
  };

  // Start the animation loop
  animateLoop();
};

main();
