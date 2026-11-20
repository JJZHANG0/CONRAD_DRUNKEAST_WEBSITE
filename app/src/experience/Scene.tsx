import { useEffect, useRef, useState } from "react";
import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import {
  makeCollector,
  makeTreatment,
  makeTerrain,
  makeShip,
  pipe,
  box,
} from "./models";
import { makeOcean } from "./ocean";
import { particlePosition, microPosition, seed } from "./particle-model.mjs";
export type View =
  | "home"
  | "challenge"
  | "technology"
  | "system"
  | "simulation"
  | "validation"
  | "partnership";
export type SceneProps = {
  view: View;
  progress: number;
  paused: boolean;
  step: number;
  explode: boolean;
  cutaway: boolean;
  selected: number;
  flow: number;
  aggregation: number;
  split: number;
  reset: number;
  lang: "en" | "zh";
  onSelect: (id: number) => void;
};
const frames = [
  { p: [20, 18, 36], t: [-4, 13, -22] },
  { p: [13, -4, 25], t: [0, -21, -7] },
  { p: [-15, -19, 16], t: [-4, -25, -1] },
  { p: [-1, -23, 10], t: [-3, -25, -1] },
  { p: [15, -20, 14], t: [5, -25, -1] },
  { p: [16, -16, 24], t: [1, -25, -1] },
  { p: [28, -9, 39], t: [0, -24, -2] },
];
export default function Scene(props: SceneProps) {
  const host = useRef<HTMLDivElement>(null),
    state = useRef(props);
  state.current = props;
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    const container = host.current!;
    let renderer: T.WebGLRenderer;
    try {
      renderer = new T.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      setStatus("fallback");
      return;
    }
    let ready = false,
      disposed = false,
      raf = 0,
      last = 0,
      time = 0,
      smoothProgress = 0,
      lastReset = -1,
      visible = true,
      slowFrames = 0,
      quality = 1;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    renderer.setPixelRatio(
      Math.min(devicePixelRatio, innerWidth < 700 ? 1.25 : 1.65),
    );
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = innerWidth > 700;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.setClearColor("#04131b");
    container.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.setAttribute(
      "aria-label",
      props.lang === "en"
        ? "Conceptual 3D ocean and seabed treatment scene"
        : "海洋与海底处理系统三维概念场景",
    );
    const scene = new T.Scene();
    scene.background = new T.Color("#04131b");
    scene.fog = new T.FogExp2("#071e29", 0.018);
    const camera = new T.PerspectiveCamera(44, 1, 0.1, 500);
    camera.position.set(20, 18, 36);
    const control = new OrbitControls(camera, renderer.domElement);
    control.enableDamping = true;
    control.enablePan = false;
    control.minDistance = 6;
    control.maxDistance = 27;
    control.maxPolarAngle = Math.PI * 0.8;
    control.enabled = false;
    const pmrem = new T.PMREMGenerator(renderer),
      room = new RoomEnvironment(),
      environment = pmrem.fromScene(room, 0.025);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.55;
    room.dispose();
    const hemi = new T.HemisphereLight("#9ccad1", "#152a30", 2.2);
    scene.add(hemi);
    const sun = new T.DirectionalLight("#c5e0df", 2.4);
    sun.position.set(-10, 5, 10);
    sun.target.position.set(0, -27, 0);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -28;
    sun.shadow.camera.right = 28;
    sun.shadow.camera.top = 28;
    sun.shadow.camera.bottom = -28;
    sun.shadow.camera.near = 0.1;
    sun.shadow.camera.far = 90;
    sun.shadow.normalBias = 0.035;
    scene.add(sun, sun.target);
    const rim = new T.DirectionalLight("#5a9cae", 2.0);
    rim.position.set(7, -15, -10);
    scene.add(rim);
    const stageLight = new T.PointLight("#d1ece7", 45, 40, 1.6);
    stageLight.position.set(7, -19, 5);
    scene.add(stageLight);
    const world = new T.Group();
    scene.add(world);
    const terrain = makeTerrain();
    world.add(terrain);
    const collector = makeCollector();
    world.add(collector);
    const rotors: T.Object3D[] = [];
    collector.traverse((o) => {
      if (o.userData.spin) rotors.push(o);
    });
    const treatment = makeTreatment();
    treatment.root.position.set(6, -26.9, -1);
    world.add(treatment.root);
    const connection = pipe(
      world,
      [
        [-6, -26, -1],
        [-1, -26.2, -1],
        [1, -26.2, -1],
        [1.4, -26.3, -1],
      ],
      0.16,
      new T.MeshStandardMaterial({ color: "#172d34", roughness: 0.7 }),
    );
    const ocean = makeOcean();
    world.add(ocean.mesh, ocean.sky, ocean.beams);
    const ship = makeShip();
    world.add(ship);
    const dustGeometry = new T.BufferGeometry();
    const dustPositions = new Float32Array(700 * 3);
    for (let i = 0; i < 700; i++) {
      dustPositions[i * 3] = (seed(i, 40) - 0.5) * 75;
      dustPositions[i * 3 + 1] = seed(i, 41) * 55 - 30;
      dustPositions[i * 3 + 2] = (seed(i, 42) - 0.5) * 65;
    }
    dustGeometry.setAttribute(
      "position",
      new T.BufferAttribute(dustPositions, 3),
    );
    const dust = new T.Points(
      dustGeometry,
      new T.PointsMaterial({
        color: "#aac4c5",
        size: 0.035,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      }),
    );
    world.add(dust);
    const count = innerWidth < 700 ? 1000 : 2200;
    const plumeGeo = new T.BufferGeometry();
    const plumePositions = new Float32Array(count * 3),
      sizes = new Float32Array(count),
      phases = new Float32Array(count);
    for (let i = 0; i < count; i++) sizes[i] = 0.05 + seed(i, 43) * 0.48;
    plumeGeo.setAttribute("position", new T.BufferAttribute(plumePositions, 3));
    plumeGeo.setAttribute("aSize", new T.BufferAttribute(sizes, 1));
    plumeGeo.setAttribute("aPhase", new T.BufferAttribute(phases, 1));
    const plumeMat = new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uScale: { value: 650 } },
      vertexShader: `attribute float aSize;attribute float aPhase;uniform float uScale;varying float vA;void main(){vec4 p=modelViewMatrix*vec4(position,1.);vA=smoothstep(0.,.08,aPhase)*(1.-smoothstep(.88,1.,aPhase));gl_PointSize=clamp(aSize*uScale/-p.z,1.,70.);gl_Position=projectionMatrix*p;}`,
      fragmentShader: `varying float vA;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;float a=exp(-d*d*4.)*.18*vA;gl_FragColor=vec4(.46,.49,.44,a);}`,
    });
    const plume = new T.Points(plumeGeo, plumeMat);
    world.add(plume);
    function updatePlume(treated: boolean) {
      for (let i = 0; i < count; i++) {
        const p = particlePosition(i, time, state.current.flow, treated);
        plumePositions[i * 3] = p.x;
        plumePositions[i * 3 + 1] = p.y;
        plumePositions[i * 3 + 2] = p.z;
        phases[i] = p.phase;
      }
      plumeGeo.attributes.position.needsUpdate = true;
      plumeGeo.attributes.aPhase.needsUpdate = true;
    }
    const micro = new T.Group();
    scene.add(micro);
    micro.visible = false;
    const microCount = 360;
    const grains = new T.InstancedMesh(
      new T.IcosahedronGeometry(0.065, 1),
      new T.MeshStandardMaterial({
        color: "#c6c1a1",
        metalness: 0.12,
        roughness: 0.55,
      }),
      microCount,
    );
    micro.add(grains);
    const dummy = new T.Object3D();
    const bridgesData = new Float32Array(microCount * 6),
      bridgesGeo = new T.BufferGeometry();
    bridgesGeo.setAttribute("position", new T.BufferAttribute(bridgesData, 3));
    const bridges = new T.LineSegments(
      bridgesGeo,
      new T.LineBasicMaterial({
        color: "#b5b68d",
        transparent: true,
        opacity: 0.22,
      }),
    );
    micro.add(bridges);
    const waterData = new Float32Array(100 * 3),
      waterGeo = new T.BufferGeometry();
    waterGeo.setAttribute("position", new T.BufferAttribute(waterData, 3));
    const waterTrace = new T.Points(
      waterGeo,
      new T.PointsMaterial({
        color: "#a3dbd3",
        size: 0.04,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
      }),
    );
    micro.add(waterTrace);
    const chamber = new T.Mesh(
      new T.BoxGeometry(8.5, 5.5, 4.5),
      new T.MeshPhysicalMaterial({
        color: "#73a4ac",
        transparent: true,
        opacity: 0.055,
        roughness: 0.15,
        metalness: 0.1,
        side: T.DoubleSide,
        depthWrite: false,
      }),
    );
    micro.add(chamber);
    const chamberEdges = new T.LineSegments(
      new T.EdgesGeometry(chamber.geometry),
      new T.LineBasicMaterial({
        color: "#648f99",
        transparent: true,
        opacity: 0.3,
      }),
    );
    micro.add(chamberEdges);
    const tray = box(
      micro,
      [8.5, 0.12, 4.5],
      [0, -2.75, 0],
      new T.MeshStandardMaterial({
        color: "#1d3a44",
        metalness: 0.7,
        roughness: 0.3,
      }),
    );
    const membrane = box(
      micro,
      [0.08, 4.8, 4],
      [2.6, 0, 0],
      new T.MeshStandardMaterial({
        color: "#5d888c",
        metalness: 0.7,
        roughness: 0.3,
        transparent: true,
        opacity: 0.45,
      }),
    );
    const microLight = new T.PointLight("#c4dfd7", 70, 25);
    microLight.position.set(3, 5, 7);
    scene.add(microLight);
    const resize = () => {
      const w = container.clientWidth,
        h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      plumeMat.uniforms.uScale.value = h * renderer.getPixelRatio();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    const intersection = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    intersection.observe(container);
    const lost = (e: Event) => {
      e.preventDefault();
      setStatus("fallback");
      visible = false;
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    const ray = new T.Raycaster(),
      pointer = new T.Vector2();
    let pointerStart = [0, 0];
    const pointerDown = (e: PointerEvent) => {
      pointerStart = [e.clientX, e.clientY];
    };
    const pointerUp = (e: PointerEvent) => {
      if (
        state.current.view !== "system" ||
        Math.hypot(e.clientX - pointerStart[0], e.clientY - pointerStart[1]) > 7
      )
        return;
      const r = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        (-(e.clientY - r.top) / r.height) * 2 + 1,
      );
      ray.setFromCamera(pointer, camera);
      const hit = ray
        .intersectObjects(treatment.modules, true)
        .find((h) => h.object.userData.moduleId !== undefined);
      if (hit) state.current.onSelect(hit.object.userData.moduleId);
    };
    renderer.domElement.addEventListener("pointerdown", pointerDown);
    renderer.domElement.addEventListener("pointerup", pointerUp);
    const target = new T.Vector3(),
      desiredCamera = new T.Vector3();
    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      const dt = Math.min((now - last) / 1000, 0.08);
      last = now;
      if (!visible || document.hidden || disposed) return;
      if (dt > 0.04) slowFrames++;
      else slowFrames = Math.max(0, slowFrames - 1);
      if (slowFrames > 90 && quality === 1) {
        quality = 0.7;
        renderer.setPixelRatio(1);
        resize();
      }
      const s = state.current;
      if (!s.paused && !reduced.matches) time += dt;
      const isSystem = s.view === "system",
        isMicro = s.view === "technology",
        isHome = s.view === "home";
      control.enabled = isSystem;
      world.visible = !isMicro;
      micro.visible = isMicro;
      ocean.update(time, Math.max(0, 14 - camera.position.y));
      rotors.forEach((o) => (o.rotation.y = time * 0.4));
      dust.rotation.y = time * 0.003;
      ship.rotation.z = Math.sin(time * 0.35) * 0.012;
      ship.position.y = 14 + Math.sin(time * 0.45) * 0.1;
      connection.visible = !isSystem;
      terrain.visible = !isSystem;
      collector.visible = !isSystem;
      ocean.mesh.visible = !isSystem;
      ocean.sky.visible = !isSystem;
      ocean.beams.visible = !isSystem && camera.position.y < 12;
      ship.visible = !isSystem;
      plume.visible = !isSystem;
      if (isSystem) {
        scene.fog = null;
        treatment.root.position.set(0, -1.6, 0);
        stageLight.position.set(4, 7, 5);
        hemi.intensity = 2.1;
        if (lastReset !== s.reset) {
          camera.position.set(10, 6, 13);
          control.target.set(0, 0, 0);
          lastReset = s.reset;
        }
        control.autoRotate = !s.paused && !reduced.matches;
        control.autoRotateSpeed = 0.35;
        control.update();
        treatment.update(s.explode ? 1 : 0, s.selected, s.cutaway);
      } else if (isMicro) {
        scene.fog = null;
        camera.position.set(8, 4, 12);
        camera.lookAt(0, -0.2, 0);
        hemi.intensity = 2.2;
        stageLight.position.set(4, 7, 5);
        for (let i = 0; i < microCount; i++) {
          const p = microPosition(i, time, s.step, s.aggregation);
          dummy.position.set(p.x, p.y, p.z);
          dummy.scale.setScalar(0.65 + seed(i, 44) * 0.7);
          dummy.updateMatrix();
          grains.setMatrixAt(i, dummy.matrix);
          const center = microPosition(
            Math.floor(i / 10) * 10,
            time,
            s.step,
            s.aggregation,
          );
          const distance = Math.hypot(
            p.x - center.x,
            p.y - center.y,
            p.z - center.z,
          );
          bridgesData.set(
            [
              p.x,
              p.y,
              p.z,
              distance < 0.85 ? center.x : p.x,
              distance < 0.85 ? center.y : p.y,
              distance < 0.85 ? center.z : p.z,
            ],
            i * 6,
          );
        }
        grains.instanceMatrix.needsUpdate = true;
        bridges.visible = s.step > 0;
        bridgesGeo.attributes.position.needsUpdate = true;
        waterTrace.visible = s.step === 3;
        for (let i = 0; i < 100; i++) {
          waterData[i * 3] = -4.3 + ((time * 0.13 + seed(i, 50)) % 1) * 9;
          waterData[i * 3 + 1] = 0.1 + seed(i, 51) * 1.6;
          waterData[i * 3 + 2] = (seed(i, 52) - 0.5) * 3;
        }
        waterGeo.attributes.position.needsUpdate = true;
        membrane.visible = s.step >= 2;
        tray.visible = true;
        micro.rotation.y = Math.sin(time * 0.07) * 0.09;
      } else {
        const destination = isHome
          ? s.progress
          : s.view === "challenge"
            ? 3.1
            : s.view === "simulation"
              ? 5
              : 6;
        smoothProgress = T.MathUtils.lerp(
          smoothProgress,
          destination,
          reduced.matches ? 1 : 0.045,
        );
        const a = Math.min(5, Math.floor(smoothProgress)),
          b = a + 1,
          p = T.MathUtils.smoothstep(smoothProgress - a, 0, 1);
        desiredCamera
          .fromArray(frames[a].p)
          .lerp(new T.Vector3().fromArray(frames[b].p), p);
        target
          .fromArray(frames[a].t)
          .lerp(new T.Vector3().fromArray(frames[b].t), p);
        if (!isHome) {
          desiredCamera.fromArray(frames[Math.round(destination)].p);
          target.fromArray(frames[Math.round(destination)].t);
        }
        if (camera.aspect < 0.8) {
          desiredCamera.sub(target).multiplyScalar(1.35).add(target);
        }
        camera.position.copy(desiredCamera);
        camera.lookAt(target);
        if (isHome) {
          // Reserve space for the chapter copy without moving equipment in the world.
          const offsets = [0, 0.12, -0.1, -0.15, 0.2, -0.12, -0.05];
          const mobile = container.clientWidth < 700;
          const shiftX = mobile ? 0 : T.MathUtils.lerp(offsets[a], offsets[b], p);
          const shiftY = mobile && smoothProgress > 1.5 ? -0.14 : 0;
          camera.setViewOffset(
            container.clientWidth, container.clientHeight,
            container.clientWidth * shiftX, container.clientHeight * shiftY,
            container.clientWidth, container.clientHeight,
          );
        }
        scene.fog = new T.FogExp2(
          camera.position.y > 13 ? "#233c45" : "#071e29",
          camera.position.y > 13 ? 0.006 : 0.029,
        );
        hemi.intensity = camera.position.y > 10 ? 1.6 : 0.48;
        sun.intensity = camera.position.y > 10 ? 2.4 : 1.15;
        stageLight.position.set(7, -19, 5);
        treatment.root.position.set(6, -26.9, -1);
        treatment.update(0, -1, s.progress > 4.2 && s.progress < 4.8);
        treatment.root.visible = !isHome || smoothProgress > 3.7;
        plume.visible = !isHome || smoothProgress > 1.7;
      }
      if (s.view === "simulation") {
        const w = container.clientWidth,
          h = container.clientHeight,
          left = (w * s.split) / 100;
        renderer.setScissorTest(true);
        renderer.setScissor(0, 0, left, h);
        treatment.root.visible = false;
        connection.visible = false;
        updatePlume(false);
        renderer.render(scene, camera);
        renderer.setScissor(left, 0, w - left, h);
        treatment.root.visible = true;
        connection.visible = true;
        updatePlume(true);
        renderer.render(scene, camera);
        renderer.setScissorTest(false);
      } else {
        if (!isSystem && !isMicro)
          updatePlume(s.view === "home" && smoothProgress > 3.8);
        renderer.render(scene, camera);
      }
      if (!ready) {
        ready = true;
        setStatus("ready");
      }
    }
    raf = requestAnimationFrame(draw);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      intersection.disconnect();
      control.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      renderer.domElement.removeEventListener("pointerdown", pointerDown);
      renderer.domElement.removeEventListener("pointerup", pointerUp);
      const geometries = new Set<T.BufferGeometry>(),
        materials = new Set<T.Material>(),
        textures = new Set<T.Texture>();
      scene.traverse((o) => {
        if (
          o instanceof T.Mesh ||
          o instanceof T.Points ||
          o instanceof T.LineSegments
        ) {
          geometries.add(o.geometry);
          for (const m of Array.isArray(o.material)
            ? o.material
            : [o.material]) {
            materials.add(m);
            for (const v of Object.values(m))
              if (v instanceof T.Texture) textures.add(v);
          }
        }
      });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [props.view]);
  return (
    <div className={`world-scene ${status}`} data-scene={status}>
      <div ref={host} className="world-canvas" />
      {status === "loading" && (
        <div className="world-loading">
          <span />
          {props.lang === "en" ? "Entering the deep" : "正在进入深海"}
        </div>
      )}
      {status === "fallback" && (
        <div className="world-fallback">
          <img
            src="./seabed-fallback.svg"
            alt={
              props.lang === "en"
                ? "Conceptual seabed collector connected to a treatment system"
                : "海底采集设备与处理系统相连接的概念示意图"
            }
          />
          <p>
            {props.lang === "en"
              ? "3D unavailable. The full project remains accessible below."
              : "当前设备无法显示 3D，可继续浏览完整项目内容。"}
          </p>
        </div>
      )}
    </div>
  );
}
