import * as THREE from 'https://cdn.skypack.dev/three@0.133.1';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/UnrealBloomPass.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(100, 100, 100);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Sun geometry and material
const sphereGeometry = new THREE.SphereGeometry(20, 32, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  emissive: 0x000000,
  specular: 0xffffff,
  shininess: 100,
  flatShading: true,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

// Rings around the sun
const RingInsideGeometry = new THREE.RingGeometry(22.23, 24.7, 30, 30);
const RingMaterial = new THREE.MeshBasicMaterial({ color: 0x331a00, side: 2 });
const ringInside = new THREE.Mesh(RingInsideGeometry, RingMaterial);
ringInside.layers.enable(1); // Enable bloom layer

const RingMiddleGeometry = new THREE.RingGeometry(25.7, 31.51, 30, 30);
const ringMiddle = new THREE.Mesh(RingMiddleGeometry, RingMaterial);
ringMiddle.layers.enable(1); // Enable bloom layer

const RingMiddle2Geometry = new THREE.RingGeometry(32.51, 39.95, 30, 30);
const ringMiddle2 = new THREE.Mesh(RingMiddle2Geometry, RingMaterial);
ringMiddle2.layers.enable(1); // Enable bloom layer

const RingMiddle3Geometry = new THREE.RingGeometry(41, 46, 30, 30);
const ringMiddle3 = new THREE.Mesh(RingMiddle3Geometry, RingMaterial);
ringMiddle3.layers.enable(1); // Enable bloom layer

const RingMiddle4Geometry = new THREE.RingGeometry(46.5, 48, 30, 30);
const ringMiddle4 = new THREE.Mesh(RingMiddle4Geometry, RingMaterial);
ringMiddle4.layers.enable(1); // Enable bloom layer

const RingOutsideGeometry = new THREE.RingGeometry(48.5, 55 + 0.2, 30, 30);
const ringOutside = new THREE.Mesh(RingOutsideGeometry, RingMaterial);
ringOutside.layers.enable(1); // Enable bloom layer

const ringGroup = new THREE.Object3D();
ringGroup.rotation.x = THREE.MathUtils.degToRad(90);
ringGroup.add(
  ringInside,
  ringMiddle,
  ringMiddle2,
  ringMiddle3,
  ringMiddle4,
  ringOutside
);

// Group the sun and rings together
const planet = new THREE.Group();
planet.add(sphere, ringGroup);
planet.rotation.x = THREE.MathUtils.degToRad(-30);
planet.rotation.y = THREE.MathUtils.degToRad(-10);
scene.add(planet);

// Create star particles without loading an external image
const geometry = new THREE.BufferGeometry();
const particleAmount = 2000;
const vertices = [];
for (let i = 0; i < particleAmount; i++) {
  vertices.push(
    2000 * Math.random() - 1000,
    2000 * Math.random() - 1000,
    2000 * Math.random() - 1000
  );
}
geometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(vertices, 3)
);
const material = new THREE.PointsMaterial({
  size: 1,
  sizeAttenuation: true,
  color: 0xffffe6,
});
const particles = new THREE.Points(geometry, material);
particles.layers.enable(1);
scene.add(particles);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0x666666);
scene.add(ambientLight);

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

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);

// Bloom layer setup
const bloomLayer = new THREE.Layers();
bloomLayer.set(1);

// Store original materials
const materials = [];

// Darken objects not in the bloom layer
const darkenMaterial = (obj) => {
  if (!bloomLayer.test(obj.layers)) {
    materials[obj.uuid] = obj.material;
    obj.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
  }
};

// Restore original materials
const restoreMaterial = (obj) => {
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid];
    delete materials[obj.uuid];
  }
};

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.01;
  ringInside.rotation.z += 0.01;
  ringMiddle.rotation.z += -0.01;
  ringOutside.rotation.z += 0.01;
  scene.traverse(darkenMaterial);
  bloomComposer.render();
  scene.traverse(restoreMaterial);
  finalComposer.render();
};
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  bloomComposer.setSize(window.innerWidth, window.innerHeight);
  finalComposer.setSize(window.innerWidth, window.innerHeight);
});
