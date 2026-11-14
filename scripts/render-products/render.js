import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { models } from './models.js';

const params = new URLSearchParams(location.search);
const id = params.get('id') ?? 'd18';
const W = Number(params.get('w') ?? 1200), H = Number(params.get('h') ?? 900);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 0.95;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.8;

const spec = models[id];
if (!spec) throw new Error(`Unknown product id: ${id}`);
const model = spec.build();
scene.add(model);

// Centre the model on the floor.
const box = new THREE.Box3().setFromObject(model);
const centre = box.getCenter(new THREE.Vector3());
model.position.sub(new THREE.Vector3(centre.x, box.min.y, centre.z));
box.setFromObject(model);
const size = box.getSize(new THREE.Vector3());

// Soft studio light from upper left plus a warm rim from behind.
const key = new THREE.DirectionalLight(0xffffff, 2.6);
key.position.set(-2.5, 9, 3.5);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.radius = 8;
key.shadow.bias = -0.0004;
const s = Math.max(size.x, size.z) * 1.2;
Object.assign(key.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 0.1, far: 30 });
scene.add(key);
const rim = new THREE.DirectionalLight(0xffd2b0, 1.4);
rim.position.set(4, 3, -5);
scene.add(rim);
scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8478, 0.55));

const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.22 }));
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Frame the model from the product's preferred viewing direction.
const camera = new THREE.PerspectiveCamera(spec.fov ?? 30, W / H, 0.1, 100);
const target = box.getCenter(new THREE.Vector3());
const dir = new THREE.Vector3(...(spec.view ?? [1, 0.7, 1.4])).normalize();
const radius = size.length() / 2;
const dist = (radius / Math.sin(THREE.MathUtils.degToRad(camera.fov) / 2)) * (spec.zoom ?? 0.92);
camera.position.copy(target).addScaledVector(dir, dist);
camera.lookAt(target);

renderer.render(scene, camera);
window.__rendered = true;
