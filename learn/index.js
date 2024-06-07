import * as THREE from '../../node_modules/three/build/three.module.js';

// import { OrbitControls } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js';
// import { EffectComposer } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/ShaderPass.js';
// import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/UnrealBloomPass.js';
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
  const groundColliderDesc = RAPIER.ColliderDesc.cuboid(100, 0.1, 100);
  world.createCollider(groundColliderDesc, groundBody);

  // Create a Three.js floor mesh
  const floorGeometry = new THREE.BoxGeometry(200, 0.2, 200); // Double the size of collider to match RAPIER
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
      y: 50,
      z: 0,
    },
    canSleep: false,
    mass: 1,
    restitution: 0.5,
  };
  const boxT = boxWithPhysics(boxPoints);

  // Add a physics sphere(ball)
  const ball = {
    scene,
    color: 0xff000f,
    wireframe: false,
    materials: 'standard',
    world,
    radius: 1,
    position: {
      x: 0,
      y: 50,
      z: -10,
    },
    canSleep: false,
    mass: 1,
    restitution: 0.5,
  };
  const ballT = ballWithPhysics(ball);

  // Add a physics capsule
  const capsule = {
    scene,
    color: 0x00ffff,
    wireframe: false,
    materials: 'standard',
    world,
    radius: 1,
    height: 2,
    position: {
      x: -10,
      y: 50,
      z: 0,
    },
    canSleep: false,
    mass: 2,
    restitution: 0.5,
  };
  const capsuleT = capsuleWithPhysics(capsule);

  // Add a physics cylinder
  const cylinder = {
    scene,
    color: 0x0000ff,
    wireframe: false,
    materials: 'standard',
    world,
    radiusTop: 1,
    radiusBottom: 1,
    radius: 1,
    height: 2,
    position: {
      x: 0,
      y: 50,
      z: 10,
    },
    canSleep: false,
    mass: 2,
    restitution: 0.5,
  };
  const cylinderT = cylinderWithPhysics(cylinder);

  // Add a physics cone
  const cone = {
    scene,
    color: 0x00ffff,
    wireframe: false,
    materials: 'standard',
    world,
    radius: 1,
    height: 2,
    position: {
      x: -5,
      y: 50,
      z: 0,
    },
    canSleep: false,
    mass: 2,
    restitution: 0.5,
  };
  const coneT = coneWithPhysics(cone);

  // // Add a physics Plane(HightField)
  // const plane = {
  //   scene,
  //   color: 0xdfbf9f,
  //   wireframe: false,
  //   materials: 'standard',
  //   world,
  //   width: 200,
  //   height: 200,
  //   heightOfPoint: 20,
  //   widthSegment: 5,
  //   heightSegment: 5,
  //   position: {
  //     x: 0,
  //     y: -10,
  //     z: 0,
  //   },
  //   canSleep: false,
  //   mass: 0,
  //   fixed: true,
  //   restitution: 0.5,
  // };
  // const planeT = planeWithPhysics(plane);

  // Create a geometry in Three.js
  const geometry = new THREE.BoxGeometry(1, 1, 1); // Example geometry
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  mesh.position.set(0, 50, 0);

  // Extract vertices from Three.js geometry
  const vertices = [];
  geometry.attributes.position.array.forEach((v, idx) => {
    if (idx % 3 === 0) {
      vertices.push({
        x: geometry.attributes.position.array[idx],
        y: geometry.attributes.position.array[idx + 1],
        z: geometry.attributes.position.array[idx + 2],
      });
    }
  });

  // Create Rapier.js Convex Mesh
  let points = new Float32Array(vertices.length);
  for (let i = 0; i < vertices.length; i++) {
    points[i] = Math.random() * 1; // Example plane.heightSegment data
    // heightsR[i] = -heights[i];
  }


  console.log(points);
  const colliderDesc = RAPIER.ColliderDesc.convexHull(points);
  const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 50, 0);
  const rigidBody = world.createRigidBody(rigidBodyDesc);
  const collider = world.createCollider(colliderDesc, rigidBody);

  const spotLight = new THREE.SpotLight(0xffffff, 0.5); // White light
  spotLight.position.set(-200, 20, 200); // Position the light
  spotLight.castShadow = true; // Enable shadow casting
  spotLight.penumbra = 0.15;
  // spotLight.target.position.set(0, -10, 0); // Set the target of the spotlight to a point below the scene
  scene.add(spotLight);

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
  animate({ cube: capsuleT.capsule2, cubeBody: capsuleT.capsuleBody });
  animate({ cube: cylinderT.cylinder2, cubeBody: cylinderT.cylinderBody });
  animate({ cube: coneT.cone2, cubeBody: coneT.coneBody });
  animate({ cube: mesh, cubeBody: rigidBody });
};

const windowCamera = async () => {
  // create Camera for viewing the scene
  const camera = new THREE.PerspectiveCamera(
    75, // angle of view (FOV) in degree (0 ~ 180)
    window.innerWidth / window.innerHeight, // aspect ratio (width / height) of the canvas element
    0.1, // near clipping plane
    3000 // far clipping plane
  );

  camera.position.set(0, 0, 240); // camera position

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
  const geometry = new THREE.SphereGeometry(ball.radius, 64, 32);
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

const capsuleWithPhysics = (capsule) => {
  const geometry = new THREE.CapsuleGeometry(
    capsule.radius,
    capsule.height,
    32,
    64
  );
  const material =
    capsule.materials == 'standard'
      ? new THREE.MeshStandardMaterial({
          color: capsule.color,
          wireframe: capsule.wireframe,
        })
      : new THREE.MeshBasicMaterial({
          color: capsule.color,
          wireframe: capsule.wireframe,
        });
  const capsule2 = new THREE.Mesh(geometry, material);
  capsule2.position.set(
    capsule.position.x,
    capsule.position.y,
    capsule.position.z
  );
  capsule.scene.add(capsule2);

  const capsulePosition = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(capsule.position.x, capsule.position.y, capsule.position.z) // position of the cube
    .setCanSleep(capsule.canSleep); // Enable can sleep
  const capsuleBody = capsule.world.createRigidBody(capsulePosition);
  const capsuleShape = RAPIER.ColliderDesc.capsule(
    capsule.height / 2,
    capsule.radius
  )
    .setMass(capsule.mass) // mass of the cube
    .setRestitution(capsule.restitution); // restitution of the cube;
  capsule.world.createCollider(capsuleShape, capsuleBody);

  return { capsule2, capsuleBody };
};

const cylinderWithPhysics = (cylinder) => {
  const geometry = new THREE.CylinderGeometry(
    cylinder.radius,
    cylinder.radius,
    cylinder.height,
    32
  );
  const material =
    cylinder.materials == 'standard'
      ? new THREE.MeshStandardMaterial({
          color: cylinder.color,
          wireframe: cylinder.wireframe,
        })
      : new THREE.MeshBasicMaterial({
          color: cylinder.color,
          wireframe: cylinder.wireframe,
        });
  const cylinder2 = new THREE.Mesh(geometry, material);
  cylinder2.position.set(
    cylinder.position.x,
    cylinder.position.y,
    cylinder.position.z
  );
  cylinder.scene.add(cylinder2);

  const cylinderPosition = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(
      cylinder.position.x,
      cylinder.position.y,
      cylinder.position.z
    ) // position of the cube
    .setCanSleep(cylinder.canSleep); // Enable can sleep
  const cylinderBody = cylinder.world.createRigidBody(cylinderPosition);
  const cylinderShape = RAPIER.ColliderDesc.cylinder(
    cylinder.height / 2,
    cylinder.radius
  )
    .setMass(cylinder.mass) // mass of the cube
    .setRestitution(cylinder.restitution); // restitution of the cube;
  cylinder.world.createCollider(cylinderShape, cylinderBody);

  return { cylinder2, cylinderBody };
};

const coneWithPhysics = (cone) => {
  const geometry = new THREE.ConeGeometry(cone.radius, cone.height, 32);
  const material =
    cone.materials == 'standard'
      ? new THREE.MeshStandardMaterial({
          color: cone.color,
          wireframe: cone.wireframe,
        })
      : new THREE.MeshBasicMaterial({
          color: cone.color,
          wireframe: cone.wireframe,
        });
  const cone2 = new THREE.Mesh(geometry, material);
  cone2.position.set(cone.position.x, cone.position.y, cone.position.z);
  cone.scene.add(cone2);

  const conePosition = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(cone.position.x, cone.position.y, cone.position.z) // position of the cube
    .setCanSleep(cone.canSleep); // Enable can sleep
  const coneBody = cone.world.createRigidBody(conePosition);
  const coneShape = RAPIER.ColliderDesc.cone(cone.height / 2, cone.radius)
    .setMass(cone.mass) // mass of the cube
    .setRestitution(cone.restitution); // restitution of the cube;
  cone.world.createCollider(coneShape, coneBody);

  return { cone2, coneBody };
};

const planeWithPhysics = (plane) => {
  const heights = new Float32Array(plane.widthSegment * plane.heightSegment); // Correctly sized array
  const heightsR = new Float32Array(plane.widthSegment * plane.heightSegment); // Correctly sized array

  for (let i = 0; i < plane.widthSegment * plane.heightSegment; i++) {
    heights[i] = -Math.random() * plane.heightOfPoint; // Example plane.heightSegment data
    heightsR[i] = -heights[i];
  }

  // Create Three.js heightfield geometry
  const geometry = new THREE.PlaneGeometry(
    plane.width,
    plane.height,
    plane.widthSegment - 1,
    plane.heightSegment - 1
  );
  // Apply rotation to Three.js geometry to match Rapier.js heightfield
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    position.setZ(i, heights[i]);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();

  const material = new THREE.MeshPhongMaterial({
    color: plane.color,
    wireframe: plane.wireframe,
    emissive: 0x000000,
    specular: 0x4f4f4f,
    shininess: 100,
    flatShading: true,
    side: THREE.DoubleSide,
  });
  const planeWithHightField = new THREE.Mesh(geometry, material);

  planeWithHightField.rotation.y = THREE.MathUtils.degToRad(-90); // Rotate to make it horizontal
  const group = new THREE.Group();
  group.add(planeWithHightField);
  group.rotation.z += THREE.MathUtils.degToRad(90); // Rotate to make it horizontal
  group.position.set(plane.position.x, plane.position.y, plane.position.z);
  plane.scene.add(group);

  // Create Rapier.js heightfield collider
  const scale = new RAPIER.Vector3(plane.width, 1, plane.height); // Ensure scale is properly defined y=1 because it multiply the heights

  const heightfieldBodyDesc =
    plane.fixed === true
      ? RAPIER.RigidBodyDesc.fixed().setTranslation(
          plane.position.x,
          plane.position.y,
          plane.position.z
        )
      : RAPIER.RigidBodyDesc.dynamic().setTranslation(
          plane.position.x,
          plane.position.y,
          plane.position.z
        );
  const heightfieldBody = plane.world.createRigidBody(heightfieldBodyDesc);

  const heightfieldColliderDesc = RAPIER.ColliderDesc.heightfield(
    plane.widthSegment - 1,
    plane.heightSegment - 1,
    heightsR,
    scale
  )
    .setMass(plane.mass)
    .setRestitution(plane.restitution);
  plane.world.createCollider(heightfieldColliderDesc, heightfieldBody);

  return { group, heightfieldBody };
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
