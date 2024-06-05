import * as THREE from 'https://cdn.skypack.dev/three@0.133.1';

import { OrbitControls } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GUI } from 'https://cdn.skypack.dev/dat.gui';
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';

const main = async () => {
  // create Scene
  const scene = new THREE.Scene();

  // Set up camera
  const camera = await windowCamera();
  // Set up renderer
  const renderer = await windowRenderer();

  await RAPIER.init(); // This line is only needed if using the compat version
  const gravity = new RAPIER.Vector3(0.0, -9.81, 0.0);
  const world = new RAPIER.World(gravity);
  boxWorld(world, 200); // 200 size box

  // Create a static ground plane
  const groundBodyDesc = RAPIER.RigidBodyDesc.fixed();
  const groundBody = world.createRigidBody(groundBodyDesc);
  const groundColliderDesc = RAPIER.ColliderDesc.cuboid(50, 0.1, 50);
  world.createCollider(groundColliderDesc, groundBody);

  // Create a Three.js floor mesh
  const floorGeometry = new THREE.BoxGeometry(100, 0.2, 100); // Double the size of collider to match RAPIER
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.set(0, 0, 0); // Adjust the position to match the RAPIER ground plane
  floor.receiveShadow = true; // Enable shadow receiving
  scene.add(floor);

  // Add a physics box
  const boxPoints = {
    scene,
    color: 0x00ff00,
    wireframe: true,
    world,
    width: 2,
    height: 2,
    depth: 2,
    position: {
      x: 0,
      y: 10,
      z: 0,
    },
    canSleep: false,
    mass: 1,
    restitution: 1,
  };
  const boxT = boxWithPhysics(boxPoints);

  const ball = {
    scene,
    color: 0xff000f,
    wireframe: false,
    materials: 'standard',
    world,
    radius: 1,
    position: {
      x: 0,
      y: 15,
      z: 0,
    },
    canSleep: false,
    mass: 1,
    restitution: 1,
  };
  const ballT = ballWithPhysics(ball);

  // Add ambient light to illuminate the scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  // Add mouse interaction for rotating the torus
  addMouseInteraction(renderer.domElement, scene, camera);

  const gui = new GUI();

  const physicsFolder = gui.addFolder('Physics');
  physicsFolder.add(world.gravity, 'x', -10.0, 10.0, 1);
  physicsFolder.add(world.gravity, 'y', -10.0, 10.0, 1);
  physicsFolder.add(world.gravity, 'z', -10.0, 10.0, 1);

  animate({ scene, camera, renderer, world });
  animate({ cube: boxT.box2, cubeBody: boxT.cubeBody });
  animate({ cube: ballT.sphere, cubeBody: ballT.ballBody });
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

const windowTorus = async (scene, angle, color, px, py, pz) => {
  const torusGeometry = new THREE.TorusGeometry(10, 2, 12, 98, angle); // create a torus geometry with radius 10, tube radius 1.6, radial segments 16, tubular segments 100
  const torusMaterial = new THREE.MeshBasicMaterial({
    color,
    // wireframe: true,
  });
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.position.set(px, py, pz);
  scene.add(torus);

  return torus;
};

const boxWithPhysics = (cube) => {
  const geometry = new THREE.BoxGeometry(cube.width, cube.height, cube.depth);
  const material = new THREE.MeshStandardMaterial({
    color: cube.color,
    wireframe: cube.wireframe,
  });
  const box2 = new THREE.Mesh(geometry, material);
  box2.position.set(cube.position.x, cube.position.y, cube.position.z);
  cube.scene.add(box2);

  const cubePosition = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(cube.position.x, cube.position.y, cube.position.z) // position of the cube
    .setCanSleep(cube.canSleep); // Enable can sleep
  const cubeBody = cube.world.createRigidBody(cubePosition);
  const cubeShape = RAPIER.ColliderDesc.cuboid(
    cube.width / 2,
    cube.height / 2,
    cube.depth / 2
  ) // size of the cube
    .setMass(cube.mass) // mass of the cube
    .setRestitution(cube.restitution); // restitution of the cube;
  cube.world.createCollider(cubeShape, cubeBody);

  return { box2, cubeBody };
};

const ballWithPhysics = (ball) => {
  const geometry = new THREE.SphereGeometry(
    ball.radius,64,32
  );
  const material =
    ball.materials == 'standard'
      ? new THREE.MeshStandardMaterial({
          color: ball.color,
          wireframe: ball.wireframe,
        })
      : new THREE.MeshBasicMaterial({
          color: ball.color,
          wireframe: ball.wireframe,
        });

  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(ball.position.x, ball.position.y, ball.position.z);
  sphere.castShadow = true;
  sphere.receiveShadow = true;

  ball.scene.add(sphere);

  const ballPosition = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(ball.position.x, ball.position.y, ball.position.z) // position of the cube
    .setCanSleep(ball.canSleep); // Enable can sleep
  const ballBody = ball.world.createRigidBody(ballPosition);
  const ballShape = RAPIER.ColliderDesc.ball(ball.radius)
    .setMass(ball.mass) // mass of the cube
    .setRestitution(ball.restitution); // restitution of the cube;
  ball.world.createCollider(ballShape, ballBody);

  return { sphere, ballBody };
};

const boxWorld = (world, value) => {
  const x = { x: 0, y: value, z: value };
  const y = { x: value, y: 0, z: value };
  const z = { x: value, y: value, z: 0 };
  const max = value / 2;
  const min = -value / 2;
  const points = [
    {
      position: x,
      height: min,
    },
    {
      position: x,
      height: max,
    },
    {
      position: y,
      depth: min,
    },
    {
      position: y,
      depth: max,
    },
    {
      position: z,
      width: min,
    },
    {
      position: z,
      width: max,
    },
  ];

  for (let i = 0; i < points.length; i++) {
    // Create a static ground plane
    const groundBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
      points[i].height ? points[i].height : 0,
      points[i].depth ? points[i].depth : 0,
      points[i].width ? points[i].width : 0
    );
    const groundBody = world.createRigidBody(groundBodyDesc);
    const groundColliderDesc = RAPIER.ColliderDesc.cuboid(
      points[i].position.x,
      points[i].position.y,
      points[i].position.z
    );
    world.createCollider(groundColliderDesc, groundBody);
  }
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
let world;
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
  if (animateCube.world) {
    world = animateCube.world;
  }
  const animateLoop = () => {
    // if (animationCount >= 10) {
    //   // Check if the animation loop has run 10 times
    //   return; // Exit the animation loop if the limit is reached
    // }
    requestAnimationFrame(animateLoop);

    if (animateCube.cubeBody) {
      // Step the physics world
      world.step();

      // Update the position and rotation of the Three.js cube
      const cubePosition = animateCube.cubeBody.translation();
      const cubeRotation = animateCube.cubeBody.rotation();
      // console.log(cubePosition, cubeRotation)
      animateCube?.cube?.position.set(
        cubePosition.x,
        cubePosition.y,
        cubePosition.z
      );
      animateCube?.cube?.quaternion.set(
        cubeRotation.x,
        cubeRotation.y,
        cubeRotation.z,
        cubeRotation.w
      );
    }

    renderer?.render(scene, camera);
    animationCount++; // Increment the animation loop counter
  };

  animateLoop();
};

main();
