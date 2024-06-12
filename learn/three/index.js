import * as THREE from '../../../node_modules/three/build/three.module.js';

// import { OrbitControls } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js';
// import { EffectComposer } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/ShaderPass.js';
// import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GUI } from 'https://cdn.skypack.dev/dat.gui';

const main = async () => {
  // create Scene
  const scene = new THREE.Scene();

  // Set up camera
  const camera = await windowCamera();
  // Set up renderer
  const renderer = await windowRenderer();

  // const torusPoints = {
  //   scene,
  //   radius: 2,
  //   tubeRadius: 0.5,
  //   radialSegments: 2,
  //   tubularSegments: 10,
  //   angle: Math.PI * 2,
  //   color: 0x00ff00,
  //   wireframe: false,
  //   px: 0,
  //   py: 0,
  //   pz: 0,
  //   segmentMove: false,
  //   segmentMoveData: {
  //     moveTimes: 2,
  //     movePoints: [10, 0,2,4,6,8],
  //   },
  // };
  // // Add torus to the scene
  // const torus = await windowTorus(torusPoints);

  const planePoints = {
    scene,
    width: 50,
    height: 50,
    widthSegments: 30,
    heightSegments: 30,
    color: 0x00aaff,
    wireframe: true,
    rotation: -90,
    px: 0,
    py: 0,
    pz: 0,
    segmentMove: true,
  };
  const plane = await windowPlan(planePoints);
  // const plane2 = await windowPlan(planePoints);
  // plane2.position.y = -.2;
  // const plane3 = await windowPlan(planePoints);
  // plane3.position.y = -.4;
  // const plane4 = await windowPlan(planePoints);
  // plane4.position.y = -.6;

  // const cylinderPoints = {
  //   scene,
  //   radiusTop: 1,
  //   radiusBottom: 1,
  //   height: 40,
  //   radialSegments: 30,
  //   heightSegments: 50,
  //   color: 0x00ff00,
  //   wireframe: true,
  //   px: 0,
  //   py: 0,
  //   pz: 0,
  //   rotation:90
  // };
  // const cylinder = await windowCylinder(cylinderPoints);
  // console.log(cylinder);

  // particles
  // const points = await particles(scene);

  // Add ambient light to illuminate the scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  // Add mouse interaction for rotating the torus
  addMouseInteraction(renderer.domElement, scene, camera);

  const gui = new GUI();

  animate({ scene, camera, renderer });
  animate({ cube: plane, rotation: { x: 0, y: 0.0, z: 0 } });
  // animate({ cube: plane2, rotation: { x: 0, y: 0.0, z: 0 } });
  // animate({ cube: plane3, rotation: { x: 0, y: 0.0, z: 0 } });
  // animate({ cube: plane4, rotation: { x: 0, y: 0.0, z: 0 } });
};

const windowCamera = async () => {
  // create Camera for viewing the scene
  const camera = new THREE.PerspectiveCamera(
    75, // angle of view (FOV) in degree (0 ~ 180)
    window.innerWidth / window.innerHeight, // aspect ratio (width / height) of the canvas element
    0.1, // near clipping plane
    3000 // far clipping plane
  );

  camera.position.set(0, 0, 20); // camera position

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

// const windowTorus = async (data) => {
//   const torusGeometry = new THREE.TorusGeometry(
//     data.radius,
//     data.tubeRadius,
//     data.radialSegments,
//     data.tubularSegments
//   ); // create a torus geometry with radius 10, tube radius 1.6, radial segments 16, tubular segments 100
//   const torusMaterial = new THREE.MeshPhongMaterial({
//     color: data.color,
//     wireframe: data.wireframe,
//     flatShading: true,
//     shininess: 100,
//     // side: THREE.DoubleSide,
//     emissive: 0x000000,
//     specular: 0xff0000,
//     transparent: false,
//     opacity: 0.5,
//   });
//   const torus = new THREE.Mesh(torusGeometry, torusMaterial);
//   torus.position.set(data.px, data.py, data.pz);
//   data.scene.add(torus);

//   if (data.segmentMove) {
//     // Modify vertices of 1/4 of the torus segments
//     const vertices = torusGeometry.attributes.position.array;

//     // Apply some transformation to these vertices
//     const array = data.segmentMoveData.movePoints;
//     if (
//       !array.every(
//         (currentValue) =>
//           currentValue <= data.tubularSegments && currentValue >= 0
//       )
//     ) {
//       console.error(
//         'error in array values not in range. it should be less than tubularSegments and greater than 0'
//       );
//       return torus;
//     }
//     if (array.length > data.tubularSegments) {
//       console.error('error in array length not greater than tubularSegments.');
//       return torus;
//     }

//     for (let i = 0; i < array.length; i++) {
//       for (
//         let j = data.tubularSegments * 3 - array[i] * 3;
//         j < vertices.length;
//         j += 3 + data.tubularSegments * 3
//       ) {
//         // Apply some transformation to these vertices
//         vertices[j] *= 2; // Move x
//         vertices[j + 1] *= 2; // Move y
//         vertices[j + 2] *= 2; // Move z
//       }
//     }

//     torusGeometry.attributes.position.needsUpdate = true;
//   }

//   return torus;
// };

const windowPlan = async (data) => {
  const planeGeometry = new THREE.PlaneGeometry(
    data.width,
    data.height,
    data.widthSegments - 1,
    data.heightSegments - 1
  );
  const planeMaterial = new THREE.MeshPhongMaterial({
    color: data.color,
    wireframe: data.wireframe,
    flatShading: false,
    shininess: 100,
    side: THREE.DoubleSide,
    emissive: 0x000000,
    specular: 0xff0000,
    transparent: true,
    opacity: 0.4,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.set(data.px, data.py, data.pz);
  plane.rotation.x = THREE.MathUtils.degToRad(data.rotation);
  data.scene.add(plane);

  const heights = new Float32Array(data.widthSegments * data.heightSegments);

  // if (data.segmentMove) {
  //   for (
  //     let i = 0;
  //     i < data.widthSegments * data.heightSegments;
  //     i += data.widthSegments
  //   ) {
  //     // if (i%5 == 0 || i% 5 == 1) {
  //     heights[i] = Math.sin(i / 10);
  //     heights[i+1] = Math.sin(i / 10);
  //     heights[i+2] = Math.sin(i / 10) ;
  //     // heights[i+3] += Math.random() * 1.5 + 10;
  //     // heights[i+4] += Math.random() * 1.5 + 10;
  //     // i = i +
  //     // }
  //   }
  //   const position = plane.geometry.attributes.position;
  //   for (let i = 0; i < position.count; i++) {
  //     position.setZ(i, heights[i]);
  //   }

  //   position.needsUpdate = true;
  //   plane.geometry.computeVertexNormals();
  // }

  return plane;
};

// const windowCylinder = async (data) => {
//   const cylinderGeometry = new THREE.CylinderGeometry(
//     data.radiusTop,
//     data.radiusBottom,
//     data.height,
//     data.radialSegments - 1,
//     data.heightSegments - 1
//   );
//   const cylinderMaterial = new THREE.MeshPhongMaterial({
//     color: data.color,
//     wireframe: data.wireframe,
//     side: THREE.DoubleSide,
//   });
//   const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
//   cylinder.position.set(data.px, data.py, data.pz);
//   cylinder.rotation.x = THREE.MathUtils.degToRad(data.rotation);

//   data.scene.add(cylinder);

//   const position = cylinder.geometry.attributes.position;
//   const start = 240;
//   const end = 300;

//   if ((end - start) % data.radialSegments != 0 && start < end) {
//     console.error('error in start end points');
//     return cylinder;
//   }

//   // Calculate the center of the vertices to be modified
//   let centerY = 0;
//   for (let i = start; i < end; i++) {
//     centerY += position.getY(i);
//   }
//   centerY /= end - start; // Average y position of vertices 20 to 39
//   let stepOfIncrements = (end - start) / data.radialSegments - 1;

//   for (let i = start; i < end; i++) {
//     position.setX(i, position.getX(i) * 1.1);
//     position.setY(
//       i,
//       position.getY(i) -
//         centerY +
//         ((position.getY(i) - centerY) * 2) / stepOfIncrements +
//         centerY
//     );
//     position.setZ(i, position.getZ(i) * 1.1);
//   }
//   cylinder.geometry.attributes.position.needsUpdate = true;
//   cylinder.geometry.computeVertexNormals();

//   // Remove lines between the outer points by modifying the index array
//   const index = cylinder.geometry.index.array;
//   const newIndex = [];

//   for (let i = 0; i < index.length; i += 3) {
//     const a = index[i];
//     const b = index[i + 1];
//     const c = index[i + 2];

//     // Check if any of the vertices are in the range 20 to 59
//     const isModified = (v) => v >= start && v < end;

//     // If none of the vertices are in the modified range, keep the face
//     if (isModified(a) && isModified(b) && isModified(c)) {
//       newIndex.push(a, b, c);
//     }
//     if (!isModified(a) && !isModified(b) && !isModified(c)) {
//       newIndex.push(a, b, c);
//     }
//   }

//   // Update the geometry index with the new indices
//   cylinder.geometry.setIndex(newIndex);

//   cylinder.start = start;
//   cylinder.end = end;
//   return cylinder;
// };

// const particles = (scene) => {
//   // const pointGeometry = new THREE.BufferGeometry();
//   const geometry = new THREE.PlaneGeometry(20, 20, 40, 40);
//   const pointMaterial = new THREE.PointsMaterial({
//     color: 0xffffff,
//     size: 2,
//     sizeAttenuation: false,
//   });

//   const stars = new THREE.Points(geometry, pointMaterial);
//   stars.rotation.x = THREE.MathUtils.degToRad(-90);
//   // stars.layers.enable(1);
//   scene.add(stars);

//   const starPosition = stars.geometry.attributes.position.getZ(1);

//   stars.geometry.attributes.position.array[2] = 2;

//   for (let i = 0; i < array.length; i++) {
//     const element = array[i];

//   }
//   // stars.geometry.attributes.position.setZ(1, starPosition * 2);
//   stars.geometry.attributes.position.needsUpdate = true;

//   return stars;
// };

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
const animate = (animated) => {
  let animationCount = 0;
  if (animated.scene) {
    scene = animated.scene;
  }
  if (animated.camera) {
    camera = animated.camera;
  }
  if (animated.renderer) {
    renderer = animated.renderer;
  }
  let back = false;
  let theta = 0; // Angle in radians
  const animateLoop = () => {
    requestAnimationFrame(animateLoop);
    // if (animationCount>10) {
    //   return;
    // }

    if (
      animated?.rotation?.x >= 0 &&
      animated?.rotation?.y >= 0 &&
      animated?.rotation?.z >= 0 &&
      animated.cube
      // animated.cube?.name == 'sun'
    ) {
      // Rotate the cube
      animated.cube.rotation.x += animated.rotation.x;
      animated.cube.rotation.y += animated.rotation.y;
      animated.cube.rotation.z += animated.rotation.z;
    }

    // Increment theta and wrap around after 2π radians (360 degrees)
    theta = (theta + 0.05) % (2 * Math.PI);
    // Update time
    if (animated?.cube) {
      // console.log(theta)
      const heights = new Float32Array(30 * 30);
      const position = animated.cube.geometry.attributes.position;
      const vertexCount = position.count;
      let dc = 0;
      // for (let i = 0; i < 30 * 30; i += 30) {
      //   heights[i] = Math.sin(dc / 5 + theta);
      //   heights[i + 1] = Math.sin(dc / 5 + theta);
      //   heights[i + 2] = Math.sin(dc / 5 + theta);
      //   heights[i + 3] = Math.sin(dc / 5 + theta);
      //   heights[i + 4] = Math.sin(dc / 5 + theta);
      //   dc++;
      // }
      for (let i = 0; i < vertexCount; i++) {
        const x = position.getX(i);
        const y = position.getY(i);

        // Calculate the distance from the center (0, 0)
        const distance = Math.sqrt(x * x + (y -10) * (y-10));

        // Calculate the height using a sine wave based on the distance and theta
        heights[i] = Math.sin(distance - theta);
      }

      for (let i = 0; i < position.count; i++) {
        position.setZ(i, heights[i]);
      }
      position.needsUpdate = true;
      animated.cube.geometry.computeVertexNormals();
    }

    renderer.render(scene, camera);
    animationCount += 0.01; // Increment the animation loop counter
  };
  // Start the animation loop
  animateLoop();
};

main();
