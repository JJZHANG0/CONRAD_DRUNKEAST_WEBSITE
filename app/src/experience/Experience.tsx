import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  Globe2,
  Pause,
  Play,
  RotateCcw,
  Layers3,
  ScanLine,
  Download,
  ChevronDown,
  Plus,
  Check,
  Move,
  ExternalLink,
} from "lucide-react";
import type { View } from "./Scene";
import { chapters, processes, metrics, titles } from "../content/project";
import type { Lang, Copy } from "../content/project";
import "./experience.css";
const Scene = lazy(() => import("./Scene"));
const views = Object.keys(titles) as View[];
const file = location.pathname.split("/").pop()?.replace(".html", "") || "home";
const view: View = views.includes(file as View) ? (file as View) : "home";
export default function Experience() {
  const [lang, setLang] = useState<Lang>(() => {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "zh" || q === "en") return q;
    try {
      return localStorage.getItem("drunkeast-language") === "zh" ? "zh" : "en";
    } catch {
      return "en";
    }
  });
  const [menu, setMenu] = useState(false),
    [paused, setPaused] = useState(
      () => matchMedia("(prefers-reduced-motion:reduce)").matches,
    ),
    [progress, setProgress] = useState(0),
    [step, setStep] = useState(1),
    [explode, setExplode] = useState(false),
    [cutaway, setCutaway] = useState(false),
    [selected, setSelected] = useState(0),
    [flow, setFlow] = useState(1),
    [aggregation] = useState(1),
    [split, setSplit] = useState(50),
    [reset, setReset] = useState(0),
    [sent, setSent] = useState(false);
  const form = useRef<HTMLFormElement>(null),
    menuButton = useRef<HTMLButtonElement>(null);
  const t = (en: string, zh: string) => (lang === "en" ? en : zh);
  const c = (pair: Copy) => pair[lang === "en" ? 0 : 1];
  const href = (v: View) => `./${v === "home" ? "index" : v}.html?lang=${lang}`;
  const chapter = Math.min(6, Math.max(0, Math.round(progress)));
  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    document.title = `${c(titles[view])} — DRUNKEAST · 深海`;
    const url = new URL(location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
    try {
      localStorage.setItem("drunkeast-language", lang);
    } catch {
      /*optional*/
    }
  }, [lang]);
  useEffect(() => {
    const scroll = () =>
      setProgress(
        Math.min(6, Math.max(0, window.scrollY / window.innerHeight)),
      );
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    const anchor = document.getElementById(location.hash.slice(1));
    if (!anchor) return;
    const frame = requestAnimationFrame(() =>
      anchor.scrollIntoView({ behavior: "instant", block: "start" }),
    );
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!menu) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  const controls = (
    <div className="scene-actions">
      <button
        onClick={() => setPaused(!paused)}
        aria-label={
          paused
            ? t("Resume animation", "继续动画")
            : t("Pause animation", "暂停动画")
        }
        aria-pressed={paused}
      >
        {paused ? <Play size={15} /> : <Pause size={15} />}
        <span>{paused ? t("Play", "播放") : t("Pause", "暂停")}</span>
      </button>
      {view === "system" && (
        <button
          onClick={() => {
            setReset(reset + 1);
            setExplode(false);
            setCutaway(false);
          }}
          aria-label={t("Reset view", "重置视角")}
        >
          <RotateCcw size={15} />
        </button>
      )}
    </div>
  );
  const scene = (
    <Suspense
      fallback={
        <div className="world-loading">
          <span />
          {t("Entering the deep", "正在进入深海")}
        </div>
      }
    >
      <Scene
        view={view}
        progress={progress}
        paused={paused}
        step={step}
        explode={explode}
        cutaway={cutaway}
        selected={selected}
        flow={flow}
        aggregation={aggregation}
        split={split}
        reset={reset}
        lang={lang}
        onSelect={setSelected}
      />
    </Suspense>
  );
  const conceptNote = t(
    "CONCEPT VISUALIZATION · NOT MEASURED PERFORMANCE",
    "概念可视化 · 非实测性能",
  );
  function download(e: React.FormEvent) {
    e.preventDefault();
    const data = new FormData(form.current!);
    const body = `DRUNKEAST / TEAM 深海\nPartnership brief · Local draft, not sent\n\nName / Organization: ${data.get("name")}\nContact: ${data.get("email")}\nArea: ${data.get("area")}\n\n${data.get("message")}\n\nThis is a locally generated draft. It has not been submitted.\n`;
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + body], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "DRUNKEAST-collaboration.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSent(true);
  }
  return (
    <div className={`experience page-${view}`}>
      <a className="skip" href="#content">
        {t("Skip to content", "跳到正文")}
      </a>
      <header
        className={`site-header ${progress > 0.2 || view !== "home" ? "solid" : ""}`}
      >
        <a href={href("home")} className="wordmark" aria-label="DRUNKEAST home">
          <svg viewBox="0 0 38 30" aria-hidden="true">
            <path d="M2 6h12c21 0 21 18 0 18H2V6Zm8 6h6c9 0 9 6 0 6h-6v-6Z" />
          </svg>
          <span>
            DRUNKEAST<small>TEAM 深海</small>
          </span>
        </a>
        <nav
          className={menu ? "nav open" : "nav"}
          aria-label={t("Main navigation", "主导航")}
        >
          {views
            .filter((v) => v !== "home")
            .map((v) => (
              <a
                key={v}
                href={href(v)}
                aria-current={view === v ? "page" : undefined}
              >
                {c(titles[v])}
              </a>
            ))}
        </nav>
        <div className="nav-tools">
          <button
            className="lang"
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
            aria-label={lang === "en" ? "切换为中文" : "Switch to English"}
          >
            <Globe2 size={15} />
            {lang === "en" ? "中" : "EN"}
          </button>
          <button
            ref={menuButton}
            className="menu-toggle"
            onClick={() => setMenu(!menu)}
            aria-label={t("Toggle navigation", "切换导航")}
            aria-expanded={menu}
          >
            {menu ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>
      <main id="content">
        {view === "home" ? (
          <>
            <div className="journey-world">
              {scene}
              <div className="journey-shade" />
            </div>
            <nav
              className="chapter-nav"
              aria-label={t("Journey chapters", "探索章节")}
            >
              {chapters.map((ch, i) => (
                <a
                  key={i}
                  href={`#scene-${i}`}
                  className={chapter === i ? "current" : ""}
                  aria-label={c(ch.label)}
                  aria-current={chapter === i ? "step" : undefined}
                >
                  <span />
                </a>
              ))}
            </nav>
            <div className="journey-caption">
              <span>{c(chapters[chapter].label)}</span>
              <span className="concept-mark">{conceptNote}</span>
              {controls}
            </div>
            <div className="journey">
              {chapters.map((ch, i) => (
                <section
                  className={`chapter chapter-${i} ${chapter === i ? "in-view" : ""}`}
                  id={`scene-${i}`}
                  key={i}
                  aria-label={c(ch.label)}
                >
                  <div className="chapter-copy">
                    <p className="kicker">
                      {i === 0
                        ? t(
                            "TEAM 深海 / ENERGY & ENVIRONMENT",
                            "TEAM 深海 / 能源与环境",
                          )
                        : c(ch.label)}
                    </p>
                    <h1 hidden={i !== 0}>
                      {c(ch.title)
                        .split("\n")
                        .map((line, j) => (
                          <span key={j}>{line}</span>
                        ))}
                    </h1>
                    {i !== 0 && (
                      <h2>
                        {c(ch.title)
                          .split("\n")
                          .map((line, j) => (
                            <span key={j}>{line}</span>
                          ))}
                      </h2>
                    )}
                    <p className="chapter-description">{c(ch.body)}</p>
                    {i === 0 ? (
                      <a className="primary-link" href="#scene-1">
                        {t("Explore the deep", "开始深海探索")}
                        <ChevronDown size={17} />
                      </a>
                    ) : i === 4 ? (
                      <a className="text-link" href={href("technology")}>
                        {t("Inside the technology", "深入核心技术")}
                        <Plus size={16} />
                      </a>
                    ) : i === 5 ? (
                      <a className="text-link" href={href("simulation")}>
                        {t("Compare the pathways", "进入对比模拟")}
                        <Plus size={16} />
                      </a>
                    ) : i === 6 ? (
                      <div className="ending-links">
                        <a className="primary-link" href={href("system")}>
                          {t("Explore our system", "探索处理系统")}
                          <Layers3 size={17} />
                        </a>
                        <a className="text-link" href={href("partnership")}>
                          {t("Build the next chapter", "共建下一个篇章")}
                        </a>
                      </div>
                    ) : null}
                  </div>
                  {i === 0 && (
                    <div className="opening-foot">
                      <span>
                        {t(
                          "A DIFFERENT PERSPECTIVE ON DEEP-SEA OPERATIONS",
                          "从新的视角，理解深海作业",
                        )}
                      </span>
                      <span>CONRAD CHALLENGE</span>
                    </div>
                  )}
                  {i === 4 && (
                    <div className="process-ribbon">
                      {processes.slice(0, 3).map((p) => (
                        <span key={p.name[0]}>{c(p.name)}</span>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
            <section className="home-directory content-wrap">
              <p className="kicker">
                {t("CONTINUE THE EXPLORATION", "继续探索")}
              </p>
              <div>
                {views
                  .filter((v) => v !== "home")
                  .map((v) => (
                    <a href={href(v)} key={v}>
                      {c(titles[v])}
                      <Plus size={20} />
                    </a>
                  ))}
              </div>
            </section>
          </>
        ) : view === "challenge" ? (
          <>
            <section className="cinema-hero challenge-hero">
              {scene}
              <div className="page-scene-shade" />
              <div className="page-hero-copy">
                <p className="kicker">{t("THE CHALLENGE", "环境挑战")}</p>
                <h1>
                  {t("A small particle.", "一颗细微颗粒。")}
                  <br />
                  <em>{t("A wider consequence.", "影响，可能更远。")}</em>
                </h1>
                <p>
                  {t(
                    "Seabed disturbance does not end at the collector. Sediment can enter the water column, travel with currents and settle elsewhere.",
                    "海床扰动的影响并不止于采集设备。沉积物可能进入水体，随水流迁移，再沉降于其他位置。",
                  )}
                </p>
              </div>
              <div className="scene-footer">
                <span>{conceptNote}</span>
                {controls}
              </div>
            </section>
            <section className="editorial content-wrap">
              <p className="kicker">
                {t("FOLLOW THE PARTICLE", "跟随颗粒的旅程")}
              </p>
              <div className="editorial-head">
                <h2>
                  {t("Disturbance. Dispersion.", "扰动。扩散。")}
                  <br />
                  <em>{t("Deposition.", "沉降。")}</em>
                </h2>
                <p>
                  {t(
                    "The movement of sediment depends on local currents, particle properties and the seabed environment. There is no single universal plume footprint.",
                    "沉积物的运动取决于局部水流、颗粒特性和海床环境，不存在适用于所有作业的统一羽流范围。",
                  )}
                </p>
              </div>
              <div className="story-grid">
                {[
                  [
                    t("At the seabed", "海床之上"),
                    t(
                      "Collection disturbs sediments and creates a near-bed plume.",
                      "采集作业扰动沉积物，并形成近底羽流。",
                    ),
                  ],
                  [
                    t("Through the water", "水体之中"),
                    t(
                      "Fine particles can remain suspended, aggregate or move with local currents.",
                      "细颗粒可能保持悬浮、发生聚集，或随局部水流迁移。",
                    ),
                  ],
                  [
                    t("Beyond the operation", "作业区之外"),
                    t(
                      "Suspended and deposited sediment may affect habitats and organisms. Impacts must be assessed in context.",
                      "悬浮或沉降的沉积物可能影响栖息地与生物，具体影响需要结合环境评估。",
                    ),
                  ],
                ].map(([name, body]) => (
                  <article key={name}>
                    <WavesIcon />
                    <h3>{name}</h3>
                    <p>{body}</p>
                  </article>
                ))}
              </div>
            </section>
            <section className="statement content-wrap">
              <p className="kicker">
                {t("MONITORING AND INTERVENTION", "监测与干预")}
              </p>
              <h2>
                {t("Understanding the plume", "理解羽流，")}
                <br />
                <em>{t("is the beginning.", "只是开始。")}</em>
              </h2>
              <p>
                {t(
                  "Numerical modelling, surveys and sensors are essential for understanding impacts. Our concept explores an additional step: treating sediment-bearing water close to the source. This does not replace environmental assessment or address every impact of mining.",
                  "数值模拟、调查和传感器对理解环境影响至关重要。我们的概念探索额外的一步：在源头附近处理含沉积物的水体。这不能替代环境评估，也不能解决采矿的所有影响。",
                )}
              </p>
              <a className="text-link" href={href("technology")}>
                {t("Explore the proposed approach", "了解拟议方案")}
                <Plus size={17} />
              </a>
            </section>
            <Sources lang={lang} />
          </>
        ) : view === "technology" ? (
          <>
            <section className="detail-intro content-wrap">
              <p className="kicker">{t("OUR TECHNOLOGY", "核心技术")}</p>
              <h1>
                {t("Small particles.", "细小颗粒。")}
                <br />
                <em>{t("A connected process.", "完整处理路径。")}</em>
              </h1>
              <p>
                {t(
                  "Capture. Flocculate. Separate. Direct. Explore the proposed treatment sequence at the scale of a particle.",
                  "捕集、絮凝、分离、引导。从颗粒尺度，探索拟议的处理过程。",
                )}
              </p>
            </section>
            <section className="technology-lab">
              <div
                className="process-tabs"
                role="tablist"
                aria-label={t("Treatment stages", "处理阶段")}
              >
                {processes.map((p, i) => (
                  <button
                    role="tab"
                    id={`stage-tab-${i}`}
                    aria-selected={step === i}
                    aria-controls="process-panel"
                    tabIndex={step === i ? 0 : -1}
                    key={i}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        const next = (i + (e.key === "ArrowRight" ? 1 : 3)) % 4;
                        setStep(next);
                        document.getElementById(`stage-tab-${next}`)?.focus();
                      }
                    }}
                    onClick={() => setStep(i)}
                  >
                    {c(p.name)}
                  </button>
                ))}
              </div>
              <div className="technology-stage">
                <div className="micro-scene">
                  {scene}
                  <div className="scene-footer">
                    <span>
                      {t(
                        "PARTICLE-SCALE PRINCIPLE · NOT A CALIBRATED MODEL",
                        "颗粒尺度原理示意 · 非标定模型",
                      )}
                    </span>
                    {controls}
                  </div>
                </div>
                <div
                  className="process-copy"
                  role="tabpanel"
                  id="process-panel"
                  aria-labelledby={`stage-tab-${step}`}
                >
                  <p className="kicker">{c(processes[step].name)}</p>
                  <h2>{c(processes[step].title)}</h2>
                  <p>{c(processes[step].body)}</p>
                  <div className="research-note">
                    <span>{t("TO BE VALIDATED", "待验证")}</span>
                    <p>{c(processes[step].detail)}</p>
                  </div>
                </div>
              </div>
            </section>
            <section className="editorial content-wrap">
              <div className="editorial-head">
                <h2>
                  {t("The chemistry matters.", "化学过程很重要。")}
                  <br />
                  <em>{t("So does what remains.", "残留物同样重要。")}</em>
                </h2>
                <p>
                  {t(
                    "The team proposes sediment-specific formulations and controlled dosing. Reagent residues, oxygen demand, floc stability and ecotoxicity must be tested alongside particle removal.",
                    "团队提出面向不同沉积物的配方与受控投加方案。除颗粒去除外，还必须测试药剂残留、耗氧、絮体稳定性与生态毒性。",
                  )}
                </p>
              </div>
              <a className="primary-link" href={href("validation")}>
                {t("See the validation agenda", "查看验证计划")}
                <ScanLine size={17} />
              </a>
            </section>
          </>
        ) : view === "system" ? (
          <>
            <section className="system-intro content-wrap">
              <p className="kicker">
                {t("OUR SYSTEM / SEABED CONCEPT", "处理系统 / 海底部署概念")}
              </p>
              <h1>
                {t("One process.", "一条处理路径。")}
                <br />
                <em>{t("Built in modules.", "以模块，连接。")}</em>
              </h1>
              <p>
                {t(
                  "A proposed treatment skid positioned near the seabed collection area. Inspect its modules and the interfaces between them.",
                  "拟议的模块化处理平台位于海底采集作业区附近，探索各功能模块及其连接关系。",
                )}
              </p>
            </section>
            <section className="system-studio">
              <div className="system-world">
                {scene}
                <div className="model-instruction">
                  <Move size={14} />
                  {t(
                    "Drag to orbit · Scroll to zoom · Select a module",
                    "拖动旋转 · 滚动缩放 · 点击模块",
                  )}
                </div>
                <div className="system-toolbar">
                  <button
                    onClick={() => setExplode(!explode)}
                    aria-pressed={explode}
                  >
                    <Layers3 size={16} />
                    {t("Explode", "展开结构")}
                  </button>
                  <button
                    onClick={() => setCutaway(!cutaway)}
                    aria-pressed={cutaway}
                  >
                    <ScanLine size={16} />
                    {t("Cutaway", "剖视")}
                  </button>
                  {controls}
                </div>
              </div>
              <aside className="module-panel">
                <p className="kicker">
                  {t("EXPLORE THE ASSEMBLY", "探索装配结构")}
                </p>
                {processes.slice(0, 3).map((p, i) => (
                  <button
                    className={selected === i ? "selected" : ""}
                    aria-pressed={selected === i}
                    key={i}
                    onClick={() => setSelected(i)}
                  >
                    <span>{c(p.name)}</span>
                    <Plus size={17} />
                  </button>
                ))}
                <h2>{c(processes[selected].title)}</h2>
                <p>{c(processes[selected].body)}</p>
                <p className="small-print">
                  {t(
                    "Illustrative structure. Pressure rating, dimensions, deployment method and separator configuration have not been validated.",
                    "结构示意。耐压等级、尺寸、部署方式和分离器构型尚未验证。",
                  )}
                </p>
              </aside>
            </section>
            <section className="system-context content-wrap">
              <p className="kicker">
                {t("A LOCAL TREATMENT PATHWAY", "局部处理路径")}
              </p>
              <h2>
                {t("The work happens", "处理发生在，")}
                <br />
                <em>
                  {t("where the disturbance begins.", "扰动开始的地方。")}
                </em>
              </h2>
              <div className="flow-path">
                {processes.map((p) => (
                  <div key={p.name[0]}>
                    <span />
                    {c(p.name)}
                  </div>
                ))}
              </div>
              <p>
                {t(
                  "The proposed system operates locally at the seabed, close to collection. Intake configuration, solids handling, pressure compatibility and the final water-release pathway remain engineering questions to validate.",
                  "拟议系统在海底采集区附近进行局部处理。入口构型、固体处置、压力适配与最终水体释放路径，仍需通过工程研究和试验验证。",
                )}
              </p>
            </section>
          </>
        ) : view === "simulation" ? (
          <>
            <section className="simulation-intro content-wrap">
              <p className="kicker">
                {t("THE SIMULATION LAB", "交互模拟实验室")}
              </p>
              <h1>
                {t("Same seabed.", "同一片海床。")}
                <br />
                <em>{t("Two particle pathways.", "两种颗粒路径。")}</em>
              </h1>
              <p>
                {t(
                  "Move the divider to compare dispersion with a conceptual treatment pathway. Both views share the same camera, current and particle seeds.",
                  "移动分界线，对比扩散路径与概念处理路径。两侧使用相同镜头、水流设置和颗粒种子。",
                )}
              </p>
            </section>
            <section className="comparison">
              <div className="compare-world">
                {scene}
                <div className="compare-labels">
                  <span>{t("WITHOUT SOURCE TREATMENT", "无源头处理")}</span>
                  <span>{t("WITH THE PROPOSED APPROACH", "拟议处理方案")}</span>
                </div>
                <div className="compare-line" style={{ left: `${split}%` }}>
                  <span>↔</span>
                </div>
                <label className="compare-slider">
                  <span className="sr-only">
                    {t("Comparison divider", "对比分界线")}
                  </span>
                  <input
                    aria-label={t("Comparison divider", "对比分界线")}
                    type="range"
                    min="5"
                    max="95"
                    value={split}
                    onChange={(e) => setSplit(+e.target.value)}
                  />
                </label>
                <div className="scene-footer">
                  <span>{conceptNote}</span>
                  {controls}
                </div>
              </div>
              <div className="simulation-controls">
                <label>
                  {t("Illustrative current", "示意水流强度")}
                  <input
                    type="range"
                    min="0.3"
                    max="2"
                    step="0.1"
                    value={flow}
                    aria-label={t("Current strength", "水流强度")}
                    onChange={(e) => setFlow(+e.target.value)}
                  />
                  <span>
                    {t("Gentle", "较弱")} — {t("Stronger", "较强")}
                  </span>
                </label>
                <div>
                  <p>{t("What changes", "变化在哪里")}</p>
                  <span>
                    {t(
                      "Some particles enter the capture path, cluster and remain in the solids collection area. Others continue to disperse.",
                      "部分颗粒进入捕集路径，聚集并保留在固体收集区，其他颗粒继续扩散。",
                    )}
                  </span>
                </div>
                <button
                  className="text-link"
                  onClick={() => {
                    setSplit(50);
                    setFlow(1);
                    setPaused(false);
                  }}
                >
                  <RotateCcw size={15} />
                  {t("Reset comparison", "重置对比")}
                </button>
              </div>
            </section>
            <section className="simulation-explainer content-wrap">
              <div>
                <p className="kicker">
                  {t("READ THE VISUALIZATION", "理解可视化")}
                </p>
                <h2>
                  {t("An explanation.", "一种解释。")}
                  <br />
                  <em>{t("Not a prediction.", "不是预测。")}</em>
                </h2>
              </div>
              <div>
                <p>
                  {t(
                    "Particle routes and aggregation are deterministic visual illustrations, not a calibrated hydrodynamic or chemical solver. The fraction entering treatment is chosen for visibility, not derived from measured efficiency.",
                    "颗粒路径与聚集过程是确定性的视觉示意，不是经过标定的水动力或化学求解器。进入处理路径的比例为便于观察而设置，并非来自实测效率。",
                  )}
                </p>
                <p>
                  {t(
                    "No removal percentage, discharge compliance or ecological outcome can be inferred. Current, sediment, dose and pressure-dependent effects need experimental data.",
                    "不能据此推断去除率、排放合规性或生态结果。水流、沉积物、投加量和压力相关效应都需要实验数据支持。",
                  )}
                </p>
                <a className="text-link" href={href("validation")}>
                  {t("What needs to be measured", "哪些指标需要测量")}
                  <Plus size={16} />
                </a>
              </div>
            </section>
          </>
        ) : view === "validation" ? (
          <>
            <section className="detail-intro validation-intro content-wrap">
              <p className="kicker">
                {t("RESEARCH & VALIDATION", "研究与验证")}
              </p>
              <h1>
                {t("Evidence before", "先有证据，")}
                <br />
                <em>{t("claims.", "再谈成效。")}</em>
              </h1>
              <p>
                {t(
                  "A treatment concept becomes credible through transparent testing. These are the questions the team needs to answer—not results already achieved.",
                  "透明的试验让处理概念更可信。以下是团队需要回答的问题，而非已经实现的成果。",
                )}
              </p>
              <div className="validation-status">
                <span className="status-pill">
                  {t("CONCEPT & VALIDATION PLANNING", "概念与验证规划阶段")}
                </span>
                <span>
                  {t("No measured dataset supplied", "尚未提供实测数据集")}
                </span>
              </div>
            </section>
            <section className="metrics content-wrap">
              <div className="metrics-head">
                <span>{t("RESEARCH QUESTION", "研究问题")}</span>
                <span>{t("PROPOSED MEASUREMENT", "拟议测量方式")}</span>
                <span>{t("STATUS", "状态")}</span>
              </div>
              {metrics.map((m, i) => (
                <details key={i} className="metric-row">
                  <summary>
                    <div>
                      <h2>{c(m.name)}</h2>
                      <p>{c(m.question)}</p>
                    </div>
                    <p className="metric-method">{c(m.method)}</p>
                    <span className="metric-status">
                      {t("To validate", "待验证")}
                      <Plus size={15} />
                    </span>
                  </summary>
                  <div className="metric-detail">
                    <p>{c(m.method)}</p>
                    {t(
                      "The Lean Canvas identifies this metric as a validation priority. Test protocols, controls, representative sediment samples and acceptance criteria still need to be defined. No measured result or validated target is published here.",
                      "Lean Canvas 将此指标列为验证重点。试验方案、对照组、代表性沉积物样品和验收标准仍需确定。此处不发布未经测量的结果或未经验证的目标。",
                    )}
                  </div>
                </details>
              ))}
            </section>
            <section className="roadmap content-wrap">
              <p className="kicker">
                {t("PROPOSED RESEARCH PATH", "拟议研究路径")}
              </p>
              <div className="story-grid">
                {[
                  [
                    t("Characterise", "表征"),
                    t(
                      "Understand sediment and seawater conditions. Establish a meaningful baseline.",
                      "了解沉积物与海水条件，建立有意义的基线。",
                    ),
                  ],
                  [
                    t("Test", "测试"),
                    t(
                      "Evaluate formulation, mixing, separation, residues and ecotoxicity in controlled studies.",
                      "在受控研究中评估配方、混合、分离、残留和生态毒性。",
                    ),
                  ],
                  [
                    t("Integrate", "集成"),
                    t(
                      "Only after evidence supports it, investigate module integration and a representative pilot.",
                      "在证据支持的前提下，再研究模块集成与代表性试点。",
                    ),
                  ],
                ].map(([a, b]) => (
                  <article key={a}>
                    <ScanLine size={21} />
                    <h3>{a}</h3>
                    <p>{b}</p>
                  </article>
                ))}
              </div>
            </section>
            <Sources lang={lang} />
          </>
        ) : (
          <>
            <section className="partnership-hero">
              <div className="partnership-world">{scene}</div>
              <div className="page-scene-shade" />
              <div className="page-hero-copy">
                <p className="kicker">
                  {t("APPLICATION & PARTNERSHIP", "应用与合作")}
                </p>
                <h1>
                  {t("A deeper challenge.", "更深处的挑战。")}
                  <br />
                  <em>{t("A shared endeavour.", "需要共同探索。")}</em>
                </h1>
                <p>
                  {t(
                    "From sediment characterisation to a testable system. We are seeking conversations with researchers, marine engineers and prospective operators.",
                    "从沉积物表征到可验证的系统。我们期待与研究人员、海洋工程团队和潜在运营方展开交流。",
                  )}
                </p>
                <a className="primary-link" href="#collaborate">
                  {t("Explore a collaboration", "探索合作方向")}
                  <Plus size={17} />
                </a>
              </div>
              <div className="scene-footer">
                <span>{conceptNote}</span>
                {controls}
              </div>
            </section>
            <section className="applications content-wrap">
              <p className="kicker">
                {t("WHERE THE CONCEPT COULD FIT", "概念方案的潜在应用")}
              </p>
              <div className="story-grid">
                {[
                  [
                    t("Seabed operations", "海底作业"),
                    t(
                      "Prospective licensed developers evaluating nodule collection and sediment management.",
                      "面向评估结核采集和沉积物管理的潜在持证开发方。",
                    ),
                  ],
                  [
                    t("Marine engineering", "海洋工程"),
                    t(
                      "Contractors exploring integration, materials, pumping and separation at depth.",
                      "与工程承包方共同探索深水集成、材料、泵送与分离。",
                    ),
                  ],
                  [
                    t("Environmental research", "环境研究"),
                    t(
                      "Researchers and consultants helping define tests, baselines and environmental assessment.",
                      "与研究人员及顾问共同设计试验、基线调查和环境评估。",
                    ),
                  ],
                ].map(([a, b]) => (
                  <article key={a}>
                    <h3>{a}</h3>
                    <p>{b}</p>
                  </article>
                ))}
              </div>
            </section>
            <section className="business content-wrap">
              <div>
                <p className="kicker">
                  {t("PROPOSED COLLABORATION MODEL", "拟议合作模式")}
                </p>
                <h2>
                  {t("Start with a study.", "从研究开始。")}
                  <br />
                  <em>{t("Earn the next step.", "以证据，走向下一步。")}</em>
                </h2>
              </div>
              <div>
                <p>
                  {t(
                    "The Lean Canvas proposes paid feasibility studies and pilots, followed by modular equipment and integration. Longer-term possibilities include reagent supply, maintenance, leasing and technology licensing.",
                    "Lean Canvas 提出以付费可行性研究和试点为起点，逐步探索模块设备与系统集成；长期可能包括药剂供应、维护、租赁和技术许可。",
                  )}
                </p>
                <p className="small-print">
                  {t(
                    "These are proposed business pathways. No signed customer, operating installation or commercial performance is claimed.",
                    "以上为拟议商业路径，不代表已签约客户、投运设备或实际商业业绩。",
                  )}
                </p>
              </div>
            </section>
            <section id="collaborate" className="collaborate content-wrap">
              <div>
                <p className="kicker">
                  {t("BEGIN A CONVERSATION", "开启对话")}
                </p>
                <h2>
                  {t("What could we", "我们可以，")}
                  <br />
                  <em>{t("explore together?", "共同探索什么？")}</em>
                </h2>
                <p>
                  {t(
                    "Prepare a short collaboration brief. A public team contact has not yet been provided, so this form downloads a local draft for you to share through an existing contact.",
                    "整理一份简短的合作提纲。团队尚未提供公开联系方式，此表单将下载本地草稿，供你通过已有渠道分享。",
                  )}
                </p>
              </div>
              <form ref={form} onSubmit={download}>
                <label>
                  {t("Name / Organisation", "姓名 / 机构")}
                  <input
                    name="name"
                    required
                    maxLength={120}
                    autoComplete="organization"
                  />
                </label>
                <label>
                  {t("Email", "邮箱")}
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={180}
                    autoComplete="email"
                  />
                </label>
                <label>
                  {t("Area of interest", "关注方向")}
                  <select name="area">
                    <option>
                      {t("Research & sediment testing", "研究与沉积物测试")}
                    </option>
                    <option>{t("Engineering integration", "工程集成")}</option>
                    <option>{t("Pilot collaboration", "试点合作")}</option>
                    <option>
                      {t("Education & other enquiries", "教育及其他交流")}
                    </option>
                  </select>
                </label>
                <label>
                  {t("What would you like to explore?", "希望探索哪些问题？")}
                  <textarea name="message" rows={4} required maxLength={3000} />
                </label>
                <button className="primary-link" type="submit">
                  {sent ? <Check size={17} /> : <Download size={17} />}{" "}
                  {t("Download collaboration brief", "下载合作提纲")}
                </button>
                <p className="form-status" role="status">
                  {sent
                    ? t(
                        "Draft downloaded. Nothing has been sent.",
                        "草稿已下载，未发送任何信息。",
                      )
                    : t(
                        "Your entries stay on this device. No information is submitted.",
                        "填写内容仅留在当前设备，不会提交。",
                      )}
                </p>
              </form>
            </section>
            <section className="team-section content-wrap">
              <p className="kicker">{t("TEAM 深海", "TEAM 深海")}</p>
              <h2>
                {t("Engineering a better way", "探索更好的工程方法，")}
                <br />
                <em>{t("for the deep.", "为深海。")}</em>
              </h2>
              <p>
                {t(
                  "A Conrad Challenge team in Energy & Environment, bringing together the questions of sediment treatment, engineering integration and environmental compatibility.",
                  "一支参与康莱德挑战赛能源与环境赛道的团队，聚焦沉积物处理、工程集成和环境适配之间的问题。",
                )}
              </p>
            </section>
          </>
        )}
      </main>
      <footer className="site-footer content-wrap">
        <div className="footer-main">
          <a href={href("home")} className="footer-brand">
            DRUNKEAST<span>TEAM 深海</span>
          </a>
          <p>
            {t("From the abyss to the source.", "自深海而来，向源头而去。")}
            <br />
            <em>
              {t(
                "Engineering a better way for the deep.",
                "以工程创新，探索深海未来。",
              )}
            </em>
          </p>
        </div>
        <div className="footer-nav">
          {views
            .filter((v) => v !== "home")
            .map((v) => (
              <a key={v} href={href(v)}>
                {c(titles[v])}
              </a>
            ))}
        </div>
        <div className="footer-legal">
          <span>© 2026 TEAM 深海 · DRUNKEAST</span>
          <span>
            {t(
              "Concept in development · Illustrations are not performance claims",
              "概念研发阶段 · 可视化不代表性能承诺",
            )}
          </span>
          <button onClick={() => setLang(lang === "en" ? "zh" : "en")}>
            EN / 中文
          </button>
        </div>
      </footer>
    </div>
  );
}
function WavesIcon() {
  return (
    <svg
      width="26"
      height="24"
      viewBox="0 0 26 24"
      fill="none"
      stroke="currentColor"
    >
      <path d="M0 6Q6 0 13 6T26 6M0 12Q6 6 13 12T26 12M0 18Q6 12 13 18T26 18" />
    </svg>
  );
}
function Sources({ lang }: { lang: Lang }) {
  return (
    <section className="sources content-wrap">
      <p className="kicker">
        {lang === "en" ? "RESEARCH CONTEXT" : "研究背景"}
      </p>
      <p>
        {lang === "en"
          ? "Independent studies inform the problem context. They do not validate this team’s proposed system."
          : "独立研究用于理解问题背景，不构成对本团队拟议系统的验证。"}
      </p>
      <a
        href="https://www.nature.com/articles/s41467-025-56311-0"
        target="_blank"
        rel="noreferrer"
      >
        Nature Communications · Monitoring benthic plumes (2025)
        <ExternalLink size={14} />
      </a>
      <a
        href="https://www.nature.com/articles/s41598-020-61837-y"
        target="_blank"
        rel="noreferrer"
      >
        Scientific Reports · Measurement and modelling of deep-sea sediment
        plumes (2020)
        <ExternalLink size={14} />
      </a>
    </section>
  );
}
