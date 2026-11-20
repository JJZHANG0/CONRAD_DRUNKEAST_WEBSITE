import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type SceneMode = "surface" | "structure" | "blueprint";
type Asset = THREE.Group & { dispose: () => Promise<void> };
type Props = {
  mode: SceneMode;
  paused: boolean;
  expanded: boolean;
  reset: number;
  language: "en" | "zh";
};

export default function OceanScene({
  mode,
  paused,
  expanded,
  reset,
  language,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const state = useRef({ mode, paused, expanded, reset });
  state.current = { mode, paused, expanded, reset };
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  useEffect(() => {
    if (!host.current) return;
    const container = host.current;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setStatus("error");
      return;
    }
    let disposed = false,
      asset: Asset | undefined,
      frame = 0,
      visible = true,
      lastReset = -1,
      lastTime = 0,
      time = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#061622", 0.032);
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(7, 3.5, 8.5);
    renderer.setPixelRatio(
      Math.min(devicePixelRatio, innerWidth < 700 ? 1.4 : 1.8),
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);
    renderer.domElement.setAttribute(
      "aria-label",
      "Interactive industrial pipe concept. Use the controls below to change the view.",
    );
    renderer.domElement.setAttribute("role", "img");
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minDistance = 6;
    controls.maxDistance = 22;
    controls.minPolarAngle = 0.3;
    controls.maxPolarAngle = Math.PI * 0.78;
    controls.autoRotateSpeed = 0.45;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    room.dispose();
    scene.add(new THREE.HemisphereLight("#a5e6ff", "#04101b", 2));
    const key = new THREE.DirectionalLight("#d9eeff", 5);
    key.position.set(3, 6, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight("#24c7f5", 5);
    rim.position.set(-5, 2, -3);
    scene.add(rim);
    const fill = new THREE.PointLight("#57f5dc", 24, 15);
    fill.position.set(2, -1, 3);
    scene.add(fill);
    const placement = new THREE.Group();
    placement.rotation.z = -0.36;
    scene.add(placement);
    const modelCenter = new THREE.Group();
    placement.add(modelCenter);
    const rings = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.3 + i * 0.65, 0.009, 6, 160),
        new THREE.MeshBasicMaterial({
          color: "#56b6c6",
          transparent: true,
          opacity: 0.13 - i * 0.025,
        }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -2.8 + i * 0.03;
      rings.add(ring);
    }
    scene.add(rings);
    const grid = new THREE.GridHelper(22, 44, "#2a7889", "#164251");
    grid.position.y = -2.85;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.15;
    scene.add(grid);
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(180 * 3);
    let seed = 47;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < dustPositions.length; i++)
      dustPositions[i] = (random() - 0.5) * 22;
    dustGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(dustPositions, 3),
    );
    const dust = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        color: "#96dcf3",
        size: 0.025,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
      }),
    );
    scene.add(dust);
    const meshes: {
      mesh: THREE.Mesh;
      origin: THREE.Vector3;
      direction: THREE.Vector3;
      materials: THREE.MeshPhysicalMaterial[];
    }[] = [];
    const resize = () => {
      const width = container.clientWidth,
        height = container.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersection.observe(container);
    const contextLost = (event: Event) => {
      event.preventDefault();
      setStatus("error");
      visible = false;
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    async function load() {
      try {
        const module = await import("../lib/model/asset.mjs");
        const loaded: Asset = await module.createAsset(THREE, {
          states: "lazy",
          sharedResources: false,
        });
        if (disposed) {
          await loaded.dispose();
          return;
        }
        asset = loaded;
        // Preserve the asset's Y-up conversion. Center and orient only outer groups.
        const bounds = new THREE.Box3().setFromObject(asset);
        const size = bounds.getSize(new THREE.Vector3()),
          center = bounds.getCenter(new THREE.Vector3());
        const scale = 4.6 / Math.max(size.x, size.y, size.z);
        modelCenter.scale.setScalar(scale);
        modelCenter.position.copy(center).multiplyScalar(-scale);
        modelCenter.add(asset);
        asset.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          const mats = (
            Array.isArray(object.material) ? object.material : [object.material]
          ) as THREE.MeshPhysicalMaterial[];
          mats.forEach((material) => {
            // A clean studio finish on the original geometry, without the baked corrosion color.
            material.map = null;
            material.metalness = 0.86;
            material.roughness = 0.28;
            material.envMapIntensity = 1.3;
            material.clearcoat = 0.32;
            material.color.set(
              /Oxidized/.test(object.name)
                ? "#174052"
                : /Sleeve_band/.test(object.name)
                  ? "#648b9a"
                  : "#afc3cb",
            );
          });
          object.matrixAutoUpdate = true;
          const direction = new THREE.Vector3();
          if (/top|upper/.test(object.name)) direction.z = 0.9;
          else if (/bottom|lower|Foot/.test(object.name)) direction.z = -0.9;
          else if (/Tie_rod/.test(object.name))
            direction.set(object.position.x * 0.6, object.position.y * 0.6, 0);
          else if (/Sleeve_band/.test(object.name))
            direction.set(
              object.position.x * 0.3,
              object.position.y * 0.3,
              (object.position.z - center.y) * 0.25,
            );
          meshes.push({
            mesh: object,
            origin: object.position.clone(),
            direction,
            materials: mats,
          });
        });
        setStatus("ready");
      } catch (error) {
        console.error("3D asset could not load:", error);
        if (!disposed) setStatus("error");
      }
    }
    void load();
    function render(now: number) {
      frame = requestAnimationFrame(render);
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (!visible || document.hidden || disposed) return;
      const {
        mode: currentMode,
        paused: isPaused,
        expanded: isExpanded,
        reset: resetId,
      } = state.current;
      const motion = !isPaused && !reduced.matches;
      if (motion) time += delta;
      if (lastReset !== resetId) {
        camera.position.set(7, 3.5, 8.5);
        controls.target.set(0, 0, 0);
        lastReset = resetId;
      }
      controls.enableZoom = isExpanded;
      controls.autoRotate = motion;
      controls.update();
      const fitScale = currentMode === "structure" ? 0.68 : 1;
      placement.scale.setScalar(
        THREE.MathUtils.lerp(
          placement.scale.x,
          fitScale,
          reduced.matches ? 1 : 0.075,
        ),
      );
      placement.position.y = motion
        ? Math.sin(time * 0.55) * 0.08
        : placement.position.y;
      dust.rotation.y = time * 0.012;
      for (const { mesh, origin, direction, materials } of meshes) {
        mesh.position.x = THREE.MathUtils.lerp(
          mesh.position.x,
          origin.x + direction.x * (currentMode === "structure" ? 1 : 0),
          reduced.matches ? 1 : 0.075,
        );
        mesh.position.y = THREE.MathUtils.lerp(
          mesh.position.y,
          origin.y + direction.y * (currentMode === "structure" ? 1 : 0),
          reduced.matches ? 1 : 0.075,
        );
        mesh.position.z = THREE.MathUtils.lerp(
          mesh.position.z,
          origin.z + direction.z * (currentMode === "structure" ? 1 : 0),
          reduced.matches ? 1 : 0.075,
        );
        for (const material of materials)
          material.wireframe = currentMode === "blueprint";
      }
      renderer.render(scene, camera);
    }
    frame = requestAnimationFrame(render);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      if (asset) {
        modelCenter.remove(asset);
        void asset.dispose();
      }
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Points ||
          object instanceof THREE.LineSegments
        ) {
          object.geometry.dispose();
          (Array.isArray(object.material)
            ? object.material
            : [object.material]
          ).forEach((material) => material.dispose());
        }
      });
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return (
    <div className={`ocean-scene ${status}`}>
      <div className="scene-glow" />
      <div className="canvas-host" ref={host} />
      {status === "loading" && (
        <div className="scene-message" role="status">
          <span className="loading-ring" />
          {language === "en" ? "Preparing the deep" : "正在潜入深海"}
        </div>
      )}
      {status === "error" && (
        <div className="scene-message fallback">
          <img
            src={`${import.meta.env.BASE_URL}model-preview.svg`}
            alt={
              language === "en"
                ? "Schematic of the industrial pipe concept"
                : "工业管道概念结构示意图"
            }
          />
          <p>
            {language === "en"
              ? "3D is unavailable on this device. Explore the engineering story below."
              : "当前设备无法显示 3D，可继续浏览下方工程介绍。"}
          </p>
        </div>
      )}
    </div>
  );
}
