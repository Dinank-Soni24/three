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

  // Add cube to the scene
  // const cube = await windowCube(scene, 2, 2, 2, 0x000000, 0, 0, 0);
  const building = await windowCube(scene, 5, 10, 5, 0xff0000, 0, 5, 0);
  // const cubeBorder = await windowCubeBorder(
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
  const circle = await windowSphere(scene, 3, 32, 32, 0xff00ff, -10, 5, -10);
  circle.name = 'circle';
  // const circle2 = await windowSphere(scene, 0.5, 32, 32, 0x00ffff, 4, 10, 2);

  const floor = await windowPlane(scene);
  const spotLight = await windowSpotLight(scene, group);
  const cylinder = await windowCylinder(scene, group);
  console.log(spotLight, 'spotLight');
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
  group.rotation.y = 0.5;
  group.position.set(3, 0, 5);

  // // Add mouse interaction for rotating the torus
  // addMouseInteraction(renderer.domElement, torus);
  // addMouseInteraction(renderer.domElement, cube);
  // addMouseInteraction(renderer.domElement, cubeBorder);
  addMouseInteraction(renderer.domElement, group, camera);

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
  // animate(scene, camera, renderer, cylinder, 0.0, 0.01, 0.0);
  animate(scene, camera, renderer, building, 0.0, -0.01, 0.0);
  animate(scene, camera, renderer, floor, 0.0, 0.0, 0.01);
  animate(scene, camera, renderer, group, 0.0, 0.01, 0.0);
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

const windowCube = async (scene, x, y, z, color, px, py, pz) => {
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

const windowCubeBorder = async (scene) => {
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
  radius,
  width,
  height,
  color,
  px,
  py,
  pz
) => {
  const geometry = new THREE.SphereGeometry(radius, width, height);
  const material = new THREE.MeshStandardMaterial({ color, wireframe: true });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(px, py, pz);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  scene.add(sphere);

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

const windowPlane = async (scene) => {
  // Create a floor to receive shadows
  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080,
    side: THREE.DoubleSide,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = Math.PI / 2; // Rotate the floor to lie flat
  floor.receiveShadow = true; // Enable shadow receiving
  floor.position.set(0, -1, -10);
  scene.add(floor);

  return floor;
};

const windowSpotLight = async (scene, group) => {
  // Create a spotlight
  const spotLight = new THREE.SpotLight(0xffffff); // White light
  spotLight.position.set(10, 20, 10); // Position the light
  spotLight.castShadow = true; // Enable shadow casting
  group.add(spotLight);
  spotLight.penumbra = 0.15;
  // // Set up shadow properties for the spotlight
  // spotLight.shadow.mapSize.width = 1024;
  // spotLight.shadow.mapSize.height = 1024;
  // spotLight.shadow.camera.near = 1;
  // spotLight.shadow.camera.far = 100;
  // spotLight.shadow.camera.fov = 45;

  // Create a line to visualize spotlight direction
  // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  // scene.add(spotLightHelper);
  // console.log(spotLightHelper, 'spotLightHelper');

  return spotLight;
};

const windowCylinder = async (scene, group) => {
  const geometry = new THREE.CylinderGeometry(2, 3, 5, 10, 1, true);
  const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  const cylinder = new THREE.Mesh(geometry, material);
  group.add(cylinder);
  cylinder.position.set(10, 20, 10);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;

  // Set rotation of the cylinder
  // cylinder.rotation.x = 100;
  cylinder.rotation.y = -20;
  cylinder.rotation.z = -10;

  return cylinder;
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
