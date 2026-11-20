import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { seed } from "./particle-model.mjs";
export const seabedY = -27;
export function metal(color: string, roughness = 0.33) {
  return new T.MeshStandardMaterial({ color, metalness: 0.78, roughness });
}
const silver = metal("#98aab0"),
  dark = metal("#172c34", 0.48),
  frameMat = metal("#40565b"),
  white = metal("#b4bfba", 0.4),
  bronze = metal("#a68c53", 0.45);
const black = new T.MeshStandardMaterial({ color: "#101819", roughness: 0.86 });
export function box(
  parent: T.Object3D,
  size: number[],
  position: number[],
  material: T.Material,
  radius = 0,
) {
  const mesh = new T.Mesh(
    new RoundedBoxGeometry(
      size[0],
      size[1],
      size[2],
      2,
      Math.min(...size) * 0.14,
    ),
    material,
  );
  mesh.position.set(position[0], position[1], position[2]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (radius) mesh.rotation.y = radius;
  parent.add(mesh);
  return mesh;
}
export function cylinder(
  parent: T.Object3D,
  radius: number,
  height: number,
  position: number[],
  material: T.Material,
  segments = 32,
) {
  const mesh = new T.Mesh(
    new T.CylinderGeometry(radius, radius, height, segments),
    material,
  );
  mesh.position.set(position[0], position[1], position[2]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
export function pipe(
  parent: T.Object3D,
  points: number[][],
  radius = 0.07,
  material: T.Material = silver,
) {
  const curve = new T.CatmullRomCurve3(
    points.map((p) => new T.Vector3(...(p as [number, number, number]))),
  );
  const mesh = new T.Mesh(
    new T.TubeGeometry(
      curve,
      Math.max(12, points.length * 10),
      radius,
      8,
      false,
    ),
    material,
  );
  parent.add(mesh);
  return mesh;
}
function label(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#203b43";
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = "#c6d6d6";
  ctx.font = "500 42px Arial";
  ctx.fillText(text, 24, 78);
  const texture = new T.CanvasTexture(canvas);
  texture.colorSpace = T.SRGBColorSpace;
  return new T.MeshBasicMaterial({ map: texture });
}
export function makeCollector() {
  const root = new T.Group();
  root.position.set(-5, seabedY + 0.15, -1);
  box(root, [5.4, 0.45, 3.2], [0, 1, 0], frameMat);
  box(root, [3.8, 1.25, 2.45], [0.35, 1.8, 0], white);
  box(root, [2.2, 0.6, 2.1], [0.9, 2.7, 0], dark);
  box(root, [2.5, 0.22, 1.25], [0.5, 2.1, 1.25], dark);
  box(
    root,
    [2.2, 0.46, 0.025],
    [0.5, 2.15, 1.27],
    label("DRUNKEAST / COLLECTOR"),
  );
  for (const side of [-1, 1]) {
    box(root, [5.3, 0.9, 0.66], [0, 0.55, side * 1.7], black);
    for (let j = 0; j < 7; j++) {
      const wheel = cylinder(
        root,
        0.4,
        0.69,
        [-2.1 + j * 0.7, 0.6, side * 1.7],
        dark,
        20,
      );
      wheel.rotation.x = Math.PI / 2;
    }
    for (let j = 0; j < 22; j++)
      box(
        root,
        [0.16, 0.09, 0.75],
        [-2.55 + j * 0.24, 1.04, side * 1.7],
        frameMat,
      );
    box(root, [3.8, 0.09, 0.08], [0.3, 3.3, side * 1.1], silver);
    for (let j = 0; j < 4; j++)
      box(root, [0.06, 0.7, 0.06], [-1.5 + j * 1.2, 2.95, side * 1.1], silver);
    const arm = box(root, [1.8, 0.18, 0.18], [-2.8, 1.3, side * 0.9], bronze);
    arm.rotation.z = 0.18;
  }
  box(root, [1.4, 0.65, 3.6], [-3.15, 0.65, 0], dark);
  const roller = cylinder(root, 0.37, 3.7, [-3.55, 0.45, 0], frameMat, 24);
  roller.rotation.x = Math.PI / 2;
  roller.userData.spin = true;
  for (let i = 0; i < 18; i++)
    box(root, [0.32, 0.2, 0.09], [-3.7, 0.32, -1.7 + i * 0.2], bronze);
  for (const side of [-1, 1]) {
    const housing = box(
      root,
      [0.35, 0.28, 0.35],
      [-2.2, 2.45, side * 0.9],
      dark,
    );
    housing.rotation.z = 0.2;
    const glass = box(
      root,
      [0.03, 0.2, 0.26],
      [-2.39, 2.44, side * 0.9],
      new T.MeshStandardMaterial({
        color: "#d7f7ee",
        emissive: "#b9eee4",
        emissiveIntensity: 3,
      }),
    );
    const light = new T.SpotLight("#b9e6dd", 65, 18, 0.5, 0.65, 1.4);
    light.position.copy(glass.position);
    light.target.position.set(-9, -1, side * 2);
    root.add(light, light.target);
  }
  // Hydraulic lines, heat-exchanger fins, pressure housings and restrained wear details.
  for (const side of [-1, 1]) {
    for (let i = 0; i < 14; i++)
      box(
        root,
        [0.09, 0.64, 0.12],
        [-0.8 + i * 0.16, 1.9, side * 1.27],
        frameMat,
      );
    for (let i = 0; i < 4; i++) {
      const port = cylinder(
        root,
        0.12,
        0.18,
        [1.8, 1.7 + i * 0.23, side * 1.3],
        silver,
        16,
      );
      port.rotation.x = Math.PI / 2;
    }
    pipe(
      root,
      [
        [-2, 1.4, side * 0.9],
        [-1.2, 2.9, side * 0.8],
        [0.8, 2.95, side * 0.8],
        [1.5, 2.1, side * 0.9],
      ],
      0.045,
      black,
    );
    const piston = cylinder(
      root,
      0.09,
      1.7,
      [-2.7, 1.4, side * 1.0],
      silver,
      16,
    );
    piston.rotation.z = 1.3;
    for (let i = 0; i < 22; i++)
      box(
        root,
        [0.16, 0.08, 0.75],
        [-2.55 + i * 0.24, 0.08, side * 1.7],
        frameMat,
      );
    for (const end of [-1, 1])
      for (let i = 0; i < 7; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 6;
        const tread = box(
          root,
          [0.18, 0.09, 0.75],
          [
            end * (2.2 + Math.cos(a) * 0.43),
            0.56 + Math.sin(a) * 0.48,
            side * 1.7,
          ],
          frameMat,
        );
        tread.rotation.z = end * a;
      }
  }
  for (let i = 0; i < 8; i++)
    cylinder(root, 0.04, 0.06, [-1.3 + i * 0.47, 2.46, 1.15], silver, 6);
  const sensor = cylinder(root, 0.23, 0.6, [-0.6, 3.25, 0], silver, 24);
  sensor.rotation.z = Math.PI / 2;
  box(
    root,
    [0.025, 0.2, 0.28],
    [-0.92, 3.25, 0],
    new T.MeshPhysicalMaterial({
      color: "#102c34",
      metalness: 0.7,
      roughness: 0.12,
      clearcoat: 1,
    }),
  );
  pipe(
    root,
    [
      [1, 2.8, 0],
      [1, 4, 0],
      [2, 4.6, 0],
      [2.8, 5, 0],
    ],
    0.16,
    dark,
  );
  return root;
}
export type TreatmentModel = {
  root: T.Group;
  modules: T.Group[];
  update: (explode: number, selected: number, cutaway: boolean) => void;
};
export function makeTreatment(): TreatmentModel {
  const root = new T.Group(),
    modules: T.Group[] = [];
  box(root, [7.9, 0.27, 3.5], [0, 0.2, 0], frameMat);
  for (const x of [-3.5, 3.5])
    for (const z of [-1.35, 1.35]) {
      box(root, [0.15, 2.9, 0.15], [x, 1.75, z], silver);
      box(root, [0.9, 0.15, 0.9], [x, 0.08, z], dark);
    }
  for (const z of [-1.35, 1.35])
    box(root, [7.15, 0.14, 0.14], [0, 3.15, z], silver);
  for (const x of [-3.5, 3.5])
    box(root, [0.14, 0.14, 2.7], [x, 3.15, 0], silver);
  const positions = [-2.45, 0, 2.45];
  for (let i = 0; i < 3; i++) {
    const group = new T.Group();
    group.position.x = positions[i];
    group.userData.moduleId = i;
    modules.push(group);
    root.add(group);
    const shell = cylinder(
      group,
      i === 1 ? 0.86 : 0.76,
      2.05,
      [0, 1.65, 0],
      i === 1 ? white : silver,
      48,
    );
    shell.userData.shell = true;
    for (const y of [0.6, 2.7]) {
      cylinder(group, 0.94, 0.12, [0, y, 0], frameMat, 48);
      for (let b = 0; b < 12; b++) {
        const a = (b / 12) * Math.PI * 2;
        cylinder(
          group,
          0.045,
          0.18,
          [Math.cos(a) * 0.82, y + 0.06, Math.sin(a) * 0.82],
          bronze,
          6,
        );
      }
    }
    const dome = new T.Mesh(
      new T.SphereGeometry(0.76, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      silver,
    );
    dome.position.y = 2.7;
    dome.scale.y = 0.35;
    group.add(dome);
    pipe(
      group,
      [
        [0, 2.95, 0],
        [0, 3.35, 0],
        [0.55, 3.35, 0],
      ],
      0.075,
    );
    box(
      group,
      [1.0, 0.36, 0.03],
      [0, 1.7, 0.79],
      label(["CAPTURE", "FLOCCULATION", "SEPARATION"][i]),
    );
    box(group, [0.55, 0.3, 0.4], [0.9, 1.1, 0.75], dark);
    const inner = new T.Mesh(
      new T.CylinderGeometry(0.48, 0.48, 1.7, 24),
      new T.MeshStandardMaterial({
        color: "#4d8b87",
        metalness: 0.4,
        roughness: 0.35,
      }),
    );
    inner.position.y = 1.65;
    inner.userData.inner = true;
    group.add(inner);
    for (let j = 0; j < 4; j++) {
      const disc = cylinder(
        group,
        0.57,
        0.04,
        [0, 0.95 + j * 0.4, 0],
        bronze,
        32,
      );
      disc.userData.inner = true;
    }
    group.traverse((o) => {
      o.userData.moduleId = i;
    });
  }
  for (let i = 0; i < 2; i++)
    pipe(
      root,
      [
        [positions[i] + 0.75, 1.2, 0],
        [positions[i] + 1.2, 1.2, 0],
        [positions[i + 1] - 0.75, 1.2, 0],
      ],
      0.12,
    );
  pipe(
    root,
    [
      [-3.2, 1.2, 0],
      [-4.2, 1.2, 0],
      [-4.6, 0.6, 0],
    ],
    0.16,
    dark,
  );
  pipe(
    root,
    [
      [3.2, 1.2, 0],
      [4, 1.2, 0],
      [4, 0.8, 1.5],
    ],
    0.13,
    silver,
  );
  box(root, [1.5, 0.4, 1.6], [2.45, 0.5, 0], dark);
  return {
    root,
    modules,
    update(explode, selected, cutaway) {
      modules.forEach((group, i) => {
        group.position.x = T.MathUtils.lerp(
          group.position.x,
          positions[i] * (1 + explode * 0.6),
          0.1,
        );
        group.position.y = T.MathUtils.lerp(
          group.position.y,
          explode * (i === 1 ? 1.4 : 0.65),
          0.1,
        );
        group.traverse((o) => {
          if (!(o instanceof T.Mesh)) return;
          if (o.userData.shell) {
            o.visible = !cutaway;
          }
          if (o.userData.inner) o.visible = cutaway;
        });
        group.scale.setScalar(
          T.MathUtils.lerp(group.scale.x, selected === i ? 1.035 : 1, 0.08),
        );
      });
    },
  };
}
export function makeTerrain() {
  const root = new T.Group();
  const geometry = new T.PlaneGeometry(180, 180, 160, 160);
  geometry.rotateX(-Math.PI / 2);
  const p = geometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i),
      z = p.getZ(i);
    const edge = T.MathUtils.smoothstep(Math.hypot(x, z), 12, 60);
    const h =
      (Math.sin(x * 0.12) * Math.cos(z * 0.15) * 2.7 +
        Math.sin(x * 0.3 + z * 0.22) * 0.65) *
        edge +
      Math.sin(x * 1.3 + z * 0.7) * 0.06;
    p.setY(i, seabedY + h);
  }
  geometry.computeVertexNormals();
  const terrainMat = new T.MeshStandardMaterial({
    color: "#283b3f",
    roughness: 0.96,
    metalness: 0.05,
  });
  terrainMat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vTerrain;")
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvTerrain=position;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vTerrain;")
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
      float grit=fract(sin(dot(floor(vTerrain.xz*33.0),vec2(12.9898,78.233)))*43758.5453);
      float ripple=sin(vTerrain.x*2.4+sin(vTerrain.z*.8)*1.5)*.035;
      diffuseColor.rgb*=.78+grit*.35+ripple;
    `,
      );
  };
  const floor = new T.Mesh(geometry, terrainMat);
  floor.receiveShadow = true;
  root.add(floor);
  const rocks = new T.InstancedMesh(
    new T.IcosahedronGeometry(1, 1),
    new T.MeshStandardMaterial({ color: "#253b43", roughness: 0.9 }),
    180,
  );
  const dummy = new T.Object3D();
  for (let i = 0; i < 180; i++) {
    const x = (seed(i, 20) - 0.5) * 80,
      z = (seed(i, 21) - 0.5) * 75;
    if (Math.abs(x) < 13 && Math.abs(z) < 8) {
      dummy.position.set(x, seabedY - 0.4, z);
      dummy.scale.set(0.2, 0.12, 0.2);
    } else {
      dummy.position.set(x, seabedY - 0.2, z);
      const s = 0.2 + seed(i, 22) * 1.3;
      dummy.scale.set(s, s * 0.55, s * 0.8);
    }
    dummy.rotation.set(seed(i, 23), seed(i, 24) * 6, seed(i, 25));
    dummy.updateMatrix();
    rocks.setMatrixAt(i, dummy.matrix);
  }
  root.add(rocks);
  const nodules = new T.InstancedMesh(
    new T.IcosahedronGeometry(0.13, 1),
    new T.MeshStandardMaterial({ color: "#1d2e36", roughness: 0.83 }),
    700,
  );
  for (let i = 0; i < 700; i++) {
    dummy.position.set(
      (seed(i, 30) - 0.5) * 50,
      seabedY + 0.04,
      (seed(i, 31) - 0.5) * 65,
    );
    dummy.scale.setScalar(0.5 + seed(i, 32));
    dummy.rotation.set(seed(i, 33), seed(i, 34), 0);
    dummy.updateMatrix();
    nodules.setMatrixAt(i, dummy.matrix);
  }
  root.add(nodules);
  return root;
}
export function makeShip() {
  const ship = new T.Group();
  ship.position.set(20, 14, -32);
  ship.scale.setScalar(0.9);
  const hull = box(ship, [9, 1.7, 2.9], [0, 0.3, 0], dark);
  const bow = new T.Mesh(new T.ConeGeometry(1.6, 3, 4), dark);
  bow.rotation.z = -Math.PI / 2;
  bow.rotation.y = Math.PI / 4;
  bow.position.set(5.5, 0.3, 0);
  ship.add(bow);
  hull.castShadow = true;
  box(ship, [7, 0.22, 2.8], [0, 1.2, 0], white);
  box(ship, [2.2, 1.5, 2.3], [-2.2, 2, 0], white);
  box(ship, [2.4, 0.6, 2.4], [-2.2, 2.9, 0], dark);
  box(ship, [0.1, 3, 0.1], [-2.2, 4, 0], silver);
  box(ship, [0.1, 0.1, 2], [-2.2, 5, 0], silver);
  box(ship, [0.2, 4, 0.2], [2, 3, 0], bronze);
  const crane = box(ship, [3.6, 0.15, 0.15], [3.4, 4.5, 0], bronze);
  crane.rotation.z = -0.3;
  return ship;
}
