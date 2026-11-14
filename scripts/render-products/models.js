// Procedural ForgeWorks product models (original geometry, no third-party assets).
// Each entry: build() -> THREE.Group, plus preferred camera view direction.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const PI = Math.PI;
const phys = (o) => new THREE.MeshPhysicalMaterial(o);
const M = {
  orange: phys({ color: '#e8561a', roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.3 }),
  graphite: phys({ color: '#262b2d', roughness: 0.48, metalness: 0.15, clearcoat: 0.3 }),
  rubber: phys({ color: '#141718', roughness: 0.92 }),
  steel: phys({ color: '#c3c9cb', roughness: 0.22, metalness: 1 }),
  darkSteel: phys({ color: '#5e6568', roughness: 0.32, metalness: 1 }),
  chrome: phys({ color: '#e1e5e7', roughness: 0.1, metalness: 1 }),
  abrasive: phys({ color: '#3a3936', roughness: 0.85 }),
  label: phys({ color: '#f2efe8', roughness: 0.5 }),
  ink: phys({ color: '#16191a', roughness: 0.6 }),
  amber: phys({ color: '#f6a269', roughness: 0.3, clearcoat: 0.4 }),
  led: phys({ color: '#8ddb9d', emissive: '#31a65b', emissiveIntensity: 0.8 }),
};
M.steelDouble = M.steel.clone(); M.steelDouble.side = THREE.DoubleSide;
M.orangeDouble = M.orange.clone(); M.orangeDouble.side = THREE.DoubleSide;
M.graphiteDouble = M.graphite.clone(); M.graphiteDouble.side = THREE.DoubleSide;

function add(parent, geo, mat, pos = [0, 0, 0], rot = [0, 0, 0]) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos); m.rotation.set(...rot);
  m.castShadow = true; m.receiveShadow = true;
  parent.add(m);
  return m;
}
const rbox = (w, h, d, r = 0.08) => new RoundedBoxGeometry(w, h, d, 4, r);
const cyl = (rt, rb, h, seg = 48, open = false, ts = 0, tl = 2 * PI) => new THREE.CylinderGeometry(rt, rb, h, seg, 1, open, ts, tl);
const X = [0, 0, PI / 2], Z = [PI / 2, 0, 0];
const extrude = (shape, depth) => new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3, curveSegments: 24 });

function batteryPack(g, y, w = 0.7, d = 0.78) {
  add(g, rbox(w, 0.37, d, 0.12), M.orange, [0, y, 0]);
  add(g, rbox(w + 0.02, 0.12, d + 0.02, 0.04), M.rubber, [0, y + 0.2, 0]);
  add(g, new THREE.BoxGeometry(0.34, 0.055, 0.018), M.graphite, [0, y, d / 2 + 0.008]);
  [-0.12, -0.04, 0.04, 0.12].forEach((x, i) => add(g, new THREE.BoxGeometry(0.035, 0.025, 0.012), i === 0 ? M.led : M.graphite, [x, y, d / 2 + 0.02]));
}
function grip(g, len = 1.02) {
  add(g, rbox(0.48, len, 0.67, 0.17), M.graphite, [0, -len / 2, 0]);
  add(g, rbox(0.43, len * 0.84, 0.69, 0.16), M.rubber, [0, -len / 2 - 0.01, 0.01]);
  for (let i = 0; i < 6; i++) add(g, new THREE.BoxGeometry(0.28, 0.025, 0.013), M.graphite, [0, -0.1 - i * 0.15, 0.36]);
  add(g, rbox(0.13, 0.34, 0.22, 0.05), M.amber, [0.32, 0.16, 0], [0, 0, 0.18]);
}
function badge(g, pos) {
  add(g, rbox(0.36, 0.14, 0.025, 0.02), M.label, pos);
  add(g, new THREE.BoxGeometry(0.2, 0.045, 0.004), M.ink, [pos[0], pos[1], pos[2] + 0.015]);
}

function drill() {
  const g = new THREE.Group();
  add(g, rbox(1.45, 0.92, 0.82, 0.17), M.orange, [0, 0.42, 0]);
  add(g, rbox(0.92, 0.66, 0.84, 0.14), M.graphite, [-0.22, 0.42, 0]);
  add(g, rbox(0.42, 0.73, 0.86, 0.11), M.orange, [0.47, 0.39, 0]);
  [-0.13, -0.02, 0.09, 0.2].forEach(y => add(g, new THREE.BoxGeometry(0.08, 0.035, 0.014), M.ink, [-0.6, 0.43 + y, 0.418]));
  add(g, cyl(0.29, 0.29, 0.16), M.steel, [0.78, 0.42, 0], X);
  add(g, cyl(0.235, 0.235, 0.12), M.darkSteel, [0.92, 0.42, 0], X);
  add(g, cyl(0.17, 0.2, 0.22), M.graphite, [1.09, 0.42, 0], X);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * 2 * PI; add(g, new THREE.BoxGeometry(0.2, 0.02, 0.02), M.rubber, [1.09, 0.42 + Math.sin(a) * 0.19, Math.cos(a) * 0.19]); }
  add(g, cyl(0.07, 0.07, 0.44, 16), M.chrome, [1.31, 0.42, 0], X);
  const gr = new THREE.Group(); gr.position.set(-0.02, -0.14, 0); gr.rotation.z = -0.24; g.add(gr);
  grip(gr); batteryPack(gr, -1.09);
  add(g, new THREE.BoxGeometry(0.06, 0.42, 0.05), M.steel, [-0.48, -0.04, 0.43], [0, 0.08, -0.14]);
  badge(g, [-0.13, 0.4, 0.43]);
  return g;
}

function driver() {
  const g = new THREE.Group();
  add(g, rbox(1.15, 0.86, 0.8, 0.17), M.orange, [0, 0.42, 0]);
  add(g, rbox(0.7, 0.62, 0.82, 0.14), M.graphite, [-0.18, 0.42, 0]);
  add(g, rbox(0.14, 0.7, 0.72, 0.06), M.graphite, [-0.6, 0.42, 0]);
  [-0.1, 0, 0.1].forEach(y => add(g, new THREE.BoxGeometry(0.08, 0.03, 0.02), M.ink, [-0.6, 0.42 + y, 0.37]));
  add(g, cyl(0.3, 0.34, 0.36), M.darkSteel, [0.72, 0.42, 0], X);
  add(g, cyl(0.21, 0.27, 0.2), M.rubber, [0.98, 0.42, 0], X);
  add(g, cyl(0.12, 0.12, 0.22), M.graphite, [1.18, 0.42, 0], X);
  add(g, cyl(0.045, 0.045, 0.36, 6), M.chrome, [1.44, 0.42, 0], X);
  const gr = new THREE.Group(); gr.position.set(0, -0.12, 0); gr.rotation.z = -0.22; g.add(gr);
  grip(gr, 0.95); batteryPack(gr, -1.06, 0.8, 0.84);
  badge(g, [-0.15, 0.42, 0.42]);
  return g;
}

function grinder() {
  const g = new THREE.Group();
  add(g, cyl(0.36, 0.36, 1.5, 48), M.orange, [-0.4, 0, 0], X);
  for (let i = 0; i < 5; i++) add(g, cyl(0.372, 0.372, 0.05, 48), M.rubber, [-0.95 + i * 0.12, 0, 0], X);
  add(g, cyl(0.3, 0.36, 0.25, 48), M.graphite, [-1.27, 0, 0], X);
  add(g, cyl(0.08, 0.12, 0.4, 24), M.rubber, [-1.58, 0, 0], X);
  add(g, rbox(0.42, 0.07, 0.15, 0.03), M.graphite, [-0.45, 0.36, 0]);
  [-0.1, 0, 0.1].forEach(z => add(g, new THREE.BoxGeometry(0.22, 0.02, 0.03), M.ink, [0.12, 0.25, z * 3]));
  add(g, rbox(0.62, 0.6, 0.62, 0.12), M.graphite, [0.6, 0, 0]);
  add(g, cyl(0.06, 0.06, 0.25, 24), M.steel, [0.62, -0.38, 0]);
  add(g, cyl(0.75, 0.75, 0.035, 96), M.abrasive, [0.62, -0.5, 0]);
  add(g, cyl(0.42, 0.42, 0.004, 96), M.label, [0.62, -0.48, 0]);
  add(g, cyl(0.15, 0.15, 0.05, 32), M.steel, [0.62, -0.46, 0]);
  add(g, cyl(0.82, 0.82, 0.2, 96, true, PI, PI), M.steelDouble, [0.62, -0.42, 0]);
  add(g, new THREE.CircleGeometry(0.82, 96, PI / 2, PI), M.steelDouble, [0.62, -0.32, 0], [-PI / 2, 0, 0]);
  add(g, cyl(0.09, 0.11, 0.75, 24), M.rubber, [0.6, 0, 0.66], Z);
  add(g, cyl(0.12, 0.12, 0.06, 24), M.graphite, [0.6, 0, 1.04], Z);
  badge(g, [-0.35, 0.05, 0.36]);
  return g;
}

function saw() {
  const g = new THREE.Group();
  add(g, rbox(2.0, 0.05, 1.2, 0.02), M.steel, [0, 0.025, 0.05]);
  const c = [0.1, 0.82, 0.35];
  add(g, cyl(0.75, 0.75, 0.02, 96), M.chrome, c, Z);
  for (let i = 0; i < 40; i++) { const a = (i / 40) * 2 * PI; add(g, new THREE.BoxGeometry(0.06, 0.035, 0.03), M.darkSteel, [c[0] + Math.cos(a) * 0.765, c[1] + Math.sin(a) * 0.765, c[2]], [0, 0, a + 0.6]); }
  add(g, cyl(0.1, 0.1, 0.06, 6), M.steel, [c[0], c[1], 0.4], Z);
  add(g, cyl(0.86, 0.86, 0.16, 96, true, PI / 2, PI), M.orangeDouble, c, Z);
  add(g, new THREE.CircleGeometry(0.86, 96, 0, PI), M.orangeDouble, [c[0], c[1], c[2] + 0.08]);
  add(g, cyl(0.8, 0.8, 0.1, 96, true, -PI / 2, PI * 0.55), M.graphiteDouble, c, Z);
  add(g, cyl(0.36, 0.36, 0.6, 48), M.orange, [0.1, 0.82, -0.08], Z);
  add(g, cyl(0.3, 0.36, 0.14, 48), M.graphite, [0.1, 0.82, -0.44], Z);
  add(g, rbox(1.05, 0.42, 0.5, 0.15), M.orange, [-0.15, 1.38, 0]);
  const handle = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.62, 1.42, 0), new THREE.Vector3(-0.55, 1.85, 0), new THREE.Vector3(0.0, 1.95, 0), new THREE.Vector3(0.38, 1.6, 0)]);
  add(g, new THREE.TubeGeometry(handle, 48, 0.1, 20), M.rubber);
  add(g, rbox(0.12, 0.25, 0.18, 0.05), M.amber, [-0.15, 1.72, 0], [0, 0, 0.3]);
  add(g, cyl(0.1, 0.12, 0.35, 24), M.rubber, [0.78, 1.32, 0], [0, 0, -0.6]);
  const bat = new THREE.Group(); bat.position.set(-0.85, 1.1, 0); g.add(bat); batteryPack(bat, 0, 0.6, 0.62);
  badge(g, [-0.15, 1.38, 0.26]);
  return g;
}

function hammer() {
  const g = new THREE.Group();
  const s = new THREE.Shape();
  s.moveTo(-0.12, 0.25);
  s.lineTo(-0.12, 0.62); s.lineTo(-0.16, 0.68); s.lineTo(-0.16, 0.96); s.lineTo(0.16, 0.96); s.lineTo(0.16, 0.68); s.lineTo(0.12, 0.62);
  s.lineTo(0.12, 0.2);
  s.quadraticCurveTo(0.14, -0.22, -0.2, -0.42);
  s.lineTo(-0.2, -0.3);
  s.quadraticCurveTo(-0.06, -0.18, -0.12, 0.05);
  s.lineTo(-0.12, 0.25);
  add(g, extrude(s, 0.24), M.darkSteel, [0, 0, -0.01]);
  add(g, cyl(0.17, 0.17, 0.03, 48), M.chrome, [0, 0.985, 0.11]);
  add(g, rbox(1.9, 0.15, 0.1, 0.04), M.steel, [-1.05, 0.42, 0.11]);
  add(g, rbox(1.15, 0.23, 0.18, 0.08), M.orange, [-1.48, 0.42, 0.11]);
  for (let i = 0; i < 7; i++) add(g, rbox(0.03, 0.235, 0.185, 0.01), M.rubber, [-1.9 + i * 0.12, 0.42, 0.11]);
  add(g, rbox(0.1, 0.25, 0.2, 0.05), M.rubber, [-2.07, 0.42, 0.11]);
  g.rotation.x = -PI / 2;
  const wrap = new THREE.Group(); wrap.add(g); wrap.rotation.y = 0.5;
  return wrap;
}

function kit() {
  const g = new THREE.Group();
  add(g, rbox(2.2, 0.42, 1.5, 0.08), M.graphite, [0, 0.21, 0]);
  add(g, rbox(2.2, 0.32, 1.5, 0.08), M.orange, [0, 0.6, 0]);
  add(g, rbox(2.22, 0.06, 1.52, 0.02), M.rubber, [0, 0.44, 0]);
  [-0.42, 0.42].forEach(z => add(g, rbox(1.7, 0.05, 0.16, 0.02), M.orange, [0.1, 0.78, z]));
  add(g, rbox(0.9, 0.02, 0.42, 0.01), M.label, [-0.2, 0.765, 0]);
  [0.1, 0.0, -0.1].forEach((z, i) => add(g, new THREE.BoxGeometry(i === 0 ? 0.55 : 0.4, 0.004, 0.035), M.ink, [-0.35 + (i === 0 ? 0.07 : 0), 0.778, z]));
  add(g, rbox(0.2, 0.02, 0.2, 0.01), M.orange, [0.12, 0.777, 0]);
  add(g, cyl(0.06, 0.06, 0.8, 24), M.rubber, [0, 0.52, 0.98], X);
  [-0.42, 0.42].forEach(x => add(g, rbox(0.1, 0.1, 0.26, 0.03), M.rubber, [x, 0.52, 0.84]));
  [-0.75, 0.75].forEach(x => { add(g, rbox(0.24, 0.3, 0.06, 0.02), M.steel, [x, 0.45, 0.77]); add(g, rbox(0.1, 0.08, 0.03, 0.01), M.ink, [x, 0.52, 0.8]); });
  [-0.95, 0.95].forEach(x => [-0.6, 0.6].forEach(z => add(g, cyl(0.07, 0.07, 0.03, 24), M.rubber, [x, 0.0, z])));
  return g;
}

function bits() {
  const g = new THREE.Group();
  add(g, rbox(1.7, 0.16, 1.0, 0.05), M.graphite, [0, 0.08, 0]);
  add(g, rbox(1.6, 0.04, 0.9, 0.02), M.rubber, [0, 0.17, 0]);
  const rings = [M.orange, M.steel, M.graphite];
  [-0.3, 0, 0.3].forEach((z, r) => {
    for (let i = 0; i < 12; i++) {
      const x = -0.66 + i * 0.12;
      add(g, cyl(0.035, 0.035, 0.2, 6), r === 1 ? M.darkSteel : M.steel, [x, 0.22, z], Z);
      add(g, cyl(0.012, 0.035, 0.05, 6), M.steel, [x, 0.22, z + 0.125], Z);
      add(g, cyl(0.038, 0.038, 0.025, 6), rings[(i + r) % 3], [x, 0.22, z - 0.04], Z);
    }
  });
  const lid = new THREE.Group(); lid.position.set(0, 0.16, -0.5); lid.rotation.x = -1.95; g.add(lid);
  add(lid, rbox(1.7, 0.1, 1.0, 0.05), M.orange, [0, -0.03, 0.5]);
  add(lid, rbox(1.5, 0.03, 0.8, 0.02), M.rubber, [0, 0.03, 0.5]);
  add(lid, cyl(0.06, 0.06, 0.5, 6), M.chrome, [0, 0.08, 0.5], X);
  add(lid, cyl(0.065, 0.065, 0.12, 24), M.rubber, [-0.2, 0.08, 0.5], X);
  add(lid, rbox(0.5, 0.012, 0.18, 0.005), M.label, [0.35, -0.085, 0.75]);
  [-0.8, 0.8].forEach(x => add(g, cyl(0.03, 0.03, 0.12, 16), M.steel, [x * 0.9, 0.16, -0.5], X));
  return g;
}

function wrench() {
  const g = new THREE.Group();
  const s = new THREE.Shape();
  [[-0.3, -0.13], [-0.05, -0.2], [0.18, -0.22], [0.34, -0.16], [0.4, -0.04], [0.44, 0.04], [0.16, 0.04], [0.16, 0.18], [0.5, 0.18], [0.52, 0.3], [0.36, 0.38], [0.1, 0.38], [-0.12, 0.3], [-0.3, 0.13]]
    .forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  add(g, extrude(s, 0.09), M.chrome, [0, 0, 0]);
  add(g, rbox(1.55, 0.22, 0.09, 0.04), M.steel, [-1.0, 0.0, 0.045]);
  add(g, rbox(1.0, 0.27, 0.14, 0.06), M.orange, [-1.25, 0.0, 0.045]);
  add(g, rbox(0.06, 0.28, 0.145, 0.02), M.rubber, [-0.78, 0.0, 0.045]);
  add(g, cyl(0.05, 0.05, 0.16, 24), M.ink, [-1.68, 0, 0.045], Z);
  add(g, cyl(0.065, 0.065, 0.2, 24), M.darkSteel, [0.17, -0.09, 0.045], X);
  for (let i = 0; i < 7; i++) add(g, cyl(0.07, 0.07, 0.01, 24), M.steel, [0.08 + i * 0.03, -0.09, 0.045], X);
  g.rotation.x = -PI / 2;
  const wrap = new THREE.Group(); wrap.add(g); wrap.rotation.y = 0.45;
  return wrap;
}

export const models = {
  d18: { build: drill, view: [0.45, 0.32, 1] },
  id20: { build: driver, view: [0.45, 0.32, 1] },
  ag125: { build: grinder, view: [0.55, 0.75, 1] },
  cs185: { build: saw, view: [0.55, 0.45, 1] },
  hm2: { build: hammer, view: [0.15, 1.6, 0.75], zoom: 0.8 },
  case48: { build: kit, view: [0.75, 0.85, 1.2] },
  bit45: { build: bits, view: [0.35, 1.0, 1], zoom: 0.85 },
  wr10: { build: wrench, view: [0.1, 1.6, 0.7], zoom: 0.8 },
};
