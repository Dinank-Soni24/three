import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';

const main = async () => {
  // create Scene
  const scene = new THREE.Scene();

  // Set up camera
  const camera = await windowCamera();

  // Set up renderer
  const renderer = await windowRenderer();

  //group
  const group = new THREE.Group();
  const lampGroup = new THREE.Group();

  // Add cube to the scene
  // const cube = await windowBox(scene, 2, 2, 2, 0x000000, 0, 0, 0);
  const footPath = await windowBox(scene, 50, 5, 500, 0x1a1a1a, 0, 0, -100);

  const wall = await windowBox(scene, 500, 100, 10, 0xb3b3cc, 0, 45, -390);
  // const axeShape = new THREE.Shape();
  // axeShape.moveTo(0, 20, -300);
  // axeShape.lineTo(7, 20, -300);
  // axeShape.lineTo(7, 30, -300);
  // axeShape.lineTo(13, 30, -300);
  // axeShape.lineTo(13, 20, -300);
  // axeShape.lineTo(20, 20, -300);
  // axeShape.lineTo(20, 40, -300);
  // axeShape.lineTo(0, 40, -300);
  // // axeShape.lineTo(10, 10, -300);
  // // axeShape.lineTo(10, 10, -300);
  // // axeShape.lineTo(10, -10, -300);
  // // axeShape.lineTo(-10, -10, -300);
  // scene.add(
  //   new THREE.Mesh(
  //     new THREE.ShapeGeometry(axeShape),
  //     new THREE.MeshBasicMaterial({ color: 0xff0000 })
  //   )
  // );

  // Define a shape using points
  const shapePoints = [
    new THREE.Vector2(0, 20), // Start point
    new THREE.Vector2(7, 20), // Second point
    new THREE.Vector2(7, 30), // Third point
    new THREE.Vector2(13, 30), // Fourth point
    new THREE.Vector2(13, 20), // Fifth point
    new THREE.Vector2(20, 20), // 6 point
    new THREE.Vector2(20, 40), // 7 point
    new THREE.Vector2(0, 40), // 8 point
  ];
  // Create a shape from the points
  const shape = new THREE.Shape(shapePoints);

  // Define settings for extrusion
  const extrudeSettings = {
    depth: 1, // Depth of extrusion
    bevelEnabled: false, // Disable bevel
  };

  // Create a geometry by extruding the shape
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Create a material
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  // Create a mesh using the geometry and material
  const mesh = new THREE.Mesh(geometry, material);

  // Add the mesh to the scene
  scene.add(mesh);

  // const cubeBorder = await windowBoxBorder(
  //   scene,
  //   2.2,
  //   2.2,
  //   2.2,
  //   0xff0000,
  //   0,
  //   0,
  //   0
  // );
  // const torus = await windowTorus(scene, 100, 0x000000, 0, 1, 1);
  // const torus2 = await windowTorus(scene, 3, 0x000000, 0, 1, 1);
  // const circle = await windowSphere(scene, 1, 10, 10, 0x000000, 0, 0, 0);
  const circle = await windowSphere(
    scene,
    false,
    3,
    32,
    32,
    0xff00ff,
    -10,
    5,
    -10
  );
  circle.name = 'circle';
  // const circle2 = await windowSphere(scene, 0.5, 32, 32, 0x00ffff, 4, 10, 2);
  const lightSource = await windowSphere(
    scene,
    group,
    1.3,
    32,
    32,
    0xffffff,
    0,
    21,
    0
  );
  // const particle = await windowPartial(scene);

  const circle2 = await windowCircle(scene, group, 0x808000, 2, 32, 0, 25, 0);
  const floor = await windowPlane(scene, 0x808080, 500, 500, 0, 0, -100, 2);
  // const floor2 = await windowPlane(scene, 0x808000, 100, 100, 0, 0, -30, 1);
  const spotLight = await windowSpotLight(scene, group, 0xffffff, 0, 20, 0);
  const cylinder = await windowCylinder(
    scene,
    group,
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
    0
  );
  const cylinder2 = await windowCylinder(
    scene,
    group,
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
    0
  );
  const cylinder4 = await windowCylinder(
    scene,
    group,
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
    0
  );
  const cylinder3 = await windowCylinder(
    scene,
    group,
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
    2
  );
  // console.log(spotLight, 'spotLight');
  // Add ambient light to illuminate the scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  // const text = await windowText(
  //   scene,
  //   'Welcome to My World',
  //   0xff0000,
  //   -5,
  //   0,
  //   -40
  // );
  // console.log(text, 'text');

  // Add the group to the scene

  scene.add(group);

  const streetLight = group.clone();
  console.log(streetLight, 'streetLight');
  streetLight.position.set(0, 0, -60);
  scene.add(streetLight);
  streetLight.children[2].target.position.copy(streetLight.position); // Set the target of the spotlight to a point below the scene
  scene.add(streetLight.children[2].target);
  // 0
  const streetLight0 = group.clone();
  streetLight0.position.set(0, 0, 60);
  scene.add(streetLight0);
  streetLight0.children[2].target.position.copy(streetLight0.position); // Set the target of the spotlight to a point below the scene
  scene.add(streetLight0.children[2].target);
  // -1
  const streetLightm1 = group.clone();
  streetLightm1.position.set(0, 0, 120);
  scene.add(streetLightm1);
  streetLightm1.children[2].target.position.copy(streetLightm1.position); // Set the target of the spotlight to a point below the scene
  scene.add(streetLightm1.children[2].target);

  // 2
  const streetLight2 = group.clone();
  streetLight2.position.set(0, 0, -120);
  scene.add(streetLight2);
  streetLight2.children[2].target.position.copy(streetLight2.position); // Set the target of the spotlight to a point below the scene
  scene.add(streetLight2.children[2].target);

  // 3
  const streetLight3 = group.clone();
  streetLight3.position.set(0, 0, -180);
  scene.add(streetLight3);
  streetLight3.children[2].target.position.copy(streetLight3.position); // Set the target of the spotlight to a point below the scene
  scene.add(streetLight3.children[2].target);

  // 4
  const streetLight4 = group.clone();
  streetLight4.position.set(0, 0, -240);
  scene.add(streetLight4);
  streetLight4.children[2].target.position.copy(streetLight4.position); // Set the target of the spotlight to a point below the scene
  scene.add(streetLight4.children[2].target);

  // const spotLightHelpe = new THREE.SpotLightHelper(streetLight.children[]);
  // scene.add(spotLightHelpe);
  // console.log(streetLight, 'streetLight');
  // group.position.set(5, 0, 0);
  // group.rotation.z = 0.5;
  // group.rotation.x = 1.3;
  // Update the spotlight position relative to the group's world position
  // spotLight.position.copy(group.localToWorld(new THREE.Vector3(20, 0, 0)));

  // // Add mouse interaction for rotating the torus
  // addMouseInteraction(renderer.domElement, torus);
  // addMouseInteraction(renderer.domElement, cube);
  // addMouseInteraction(renderer.domElement, cubeBorder)
  addMouseInteraction(renderer.domElement, group, camera);

  // scene.fog = new THREE.Fog(0xcccccc, 1, 500);
  renderer.shadowMap.enabled = true;

  // Start the animation loop
  // animate(scene, camera, renderer, cube);
  // animate(scene, camera, renderer, cubeBorder);
  // animate(scene, camera, renderer, torus, 0, 0, 0.05);
  // animate(scene, camera, renderer, torus2, 0, 0, 0.05);
  // animate(scene, camera, renderer, circle, 0.01, 0.01, 0.01);
  // animate(scene, camera, renderer, text, 0, 0, 0);
  // animate(scene, camera, renderer, building, 0, 0, 0);
  animate(scene, camera, renderer, circle, 0.0, 0.01, 0.0);
  // animate(scene, camera, renderer, particle, 0.0, 0.0, 0.0);
  // animate(scene, camera, renderer, circle2, 0.01, 0.0, 0.0);
  // animate(scene, camera, renderer, building, 0.0, -0.01, 0.0);
  // animate(scene, camera, renderer, floor, 0.0, 0.0, 0.01);
  // animate(scene, camera, renderer, group, 0.0, 0.01, 0.0);
};

const windowCamera = async () => {
  // create Camera for viewing the scene
  const camera = new THREE.PerspectiveCamera(
    75, // angle of view (FOV) in degree (0 ~ 180)
    window.innerWidth / window.innerHeight, // aspect ratio (width / height) of the canvas element
    0.1, // near clipping plane
    1000 // far clipping plane
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

const windowBox = async (scene, x, y, z, color, px, py, pz) => {
  const geometry = new THREE.BoxGeometry(x, y, z); // create a cube geometry
  const material = new THREE.MeshStandardMaterial({ color }); // create a material for the cube geometry

  const cube = new THREE.Mesh(geometry, material); // create a mesh from the cube geometry and the material
  cube.castShadow = true; // Enable shadow casting for the cube
  cube.receiveShadow = true; // Enable shadow receiving for the cube

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
  group,
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
  if (group) {
    sphere.material.color.r = 1.6;
    sphere.material.color.g = 1.6;
    sphere.material.color.b = 1.6;
    group.add(sphere);
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

const windowSpotLight = async (scene, group, color, px, py, pz) => {
  // Create a spotlight
  const spotLight = new THREE.SpotLight(color, 3); // White light
  spotLight.position.set(px, py, pz); // Position the light
  spotLight.castShadow = true; // Enable shadow casting
  spotLight.penumbra = 0.15;
  spotLight.target.position.set(0, -10, 0); // Set the target of the spotlight to a point below the scene
  group.add(spotLight);

  // spotLight.target.updateMatrixWorld(); // Update the target's matrix world to reflect its position
  // spotLight.target.updateWorldMatrix(true, false); // Update the world matrix of the target
  // spotLight.target.updateMatrix(); // Update the matrix of the target

  // Create a line to visualize spotlight direction
  // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  // scene.add(spotLightHelper);
  // group.add(light.target);

  return spotLight;
};

const windowCylinder = async (
  scene,
  group,
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
  rotation
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
  group.add(cylinder);
  cylinder.position.set(px, py, pz);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  cylinder.rotation.z = rotation == 0 ? 0 : -Math.PI / rotation;
  // cylinder.rotation.y = rotation == 0 ? 0 : -Math.PI / rotation;

  // Set rotation of the cylinder
  // cylinder.rotation.x = 100;
  // cylinder.rotation.y = -20;
  // cylinder.rotation.z = -10;

  return cylinder;
};

const windowCircle = async (
  scene,
  group,
  color,
  radius,
  segments,
  px,
  py,
  pz
) => {
  const geometry = new THREE.CircleGeometry(radius, segments);
  const material = new THREE.MeshBasicMaterial({ color });
  const circle = new THREE.Mesh(geometry, material);
  circle.position.set(px, py, pz);
  circle.rotation.x = -Math.PI / 2;
  group.add(circle);

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

const animate = (scene, camera, renderer, cube, x, y, z) => {
  let animationCount = 0;
  // Define the animation loop function
  let time = 0;
  const animateLoop = () => {
    if (animationCount >= 300) {
      // Check if the animation loop has run 10 times
      return; // Exit the animation loop if the limit is reached
    }
    // else if (animationCount >= 100 && animationCount <= 200) {
    //   cube.visible = true;
    //   // camera.position.x -= 0.1;
    //   if (cube?.name == 'circle') {
    //     cube.position.y += 0.1;
    //     console.log(cube.position.y, 'cube.position.y');
    //   }
    // } else if (animationCount > 200) {
    //   if (cube?.name == 'circle') {
    //     cube.position.y -= 0.1;
    //   }
    // }
    // if (cube?.name == 'circle') {
    //   // Update ball position
    //   const amplitude = 2; // Amplitude of the motion
    //   const frequency = 0.1; // Frequency of the motion
    //   const offsetY = amplitude * Math.sin(time * frequency); // Calculate offset in y-direction
    //   cube.position.y += offsetY;

    //   time += 1; // Increment time for animation
    // }

    // if (cube?.name == 'particleSystem') {
    //   cube.rotation.y += 0.01;
    // }

    requestAnimationFrame(animateLoop);

    if (cube?.visible) {
      // Rotate the cube
      cube.rotation.x += x;
      cube.rotation.y += y;
      cube.rotation.z += z;
    }

    const range = camera.position.z - cube?.position?.z;

    // camera.position.z -= 0.1;

    // if (camera.position.z < ) {
    //   cube.visible = true;
    // }

    // Render the scene with the updated camera and cube positions
    renderer.render(scene, camera);
    animationCount++; // Increment the animation loop counter
  };

  // Start the animation loop
  animateLoop();
};

main();
