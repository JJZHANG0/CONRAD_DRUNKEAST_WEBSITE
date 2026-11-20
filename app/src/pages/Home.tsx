import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  Box,
  Waves,
  ScanLine,
  Pause,
  Play,
  RotateCcw,
  Maximize2,
  X,
  Menu,
  Globe2,
  Download,
  Plus,
  Minus,
  Move,
  Layers3,
  Compass,
} from "lucide-react";
import type { SceneMode } from "../components/OceanScene";
import "../App.css";
const OceanScene = lazy(() => import("../components/OceanScene"));
type Language = "en" | "zh";
const sections = ["vision", "engineering", "approach", "team"];

export default function Home() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return localStorage.getItem("drunkeast-language") === "zh" ? "zh" : "en";
    } catch {
      return "en";
    }
  });
  const [menu, setMenu] = useState(false);
  const [mode, setMode] = useState<SceneMode>("surface");
  const [paused, setPaused] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [expanded, setExpanded] = useState(false);
  const [reset, setReset] = useState(0);
  const [active, setActive] = useState("");
  const [focusPart, setFocusPart] = useState(0);
  const [downloaded, setDownloaded] = useState(false);
  const studio = useRef<HTMLDivElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const t = (en: string, zh: string) => (language === "en" ? en : zh);
  useEffect(() => {
    document.documentElement.lang = language === "en" ? "en" : "zh-CN";
    try {
      localStorage.setItem("drunkeast-language", language);
    } catch {
      /* Storage is optional. */
    }
  }, [language]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    const background = document.querySelectorAll<HTMLElement>(
      "header, footer, .hero-copy, .hero-topline, .hero-bottom, main > section:not(#home)",
    );
    background.forEach((element) => {
      element.inert = true;
    });
    document.body.style.overflow = "hidden";
    studio.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
      if (event.key !== "Tab") return;
      const buttons = Array.from(
        studio.current?.querySelectorAll<HTMLButtonElement>("button") || [],
      );
      if (event.shiftKey && document.activeElement === buttons[0]) {
        event.preventDefault();
        buttons.at(-1)?.focus();
      } else if (!event.shiftKey && document.activeElement === buttons.at(-1)) {
        event.preventDefault();
        buttons[0]?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      background.forEach((element) => {
        element.inert = false;
      });
      document.removeEventListener("keydown", onKey);
      expandButton.current?.focus();
    };
  }, [expanded]);
  function downloadBrief() {
    const content = t(
      "DRUNKEAST · Partnership conversation\n\nName / organization:\nContact:\nArea of interest: research / engineering / education\nProject or question:\nAvailable resources:\nSuggested next step:\n\nThis brief is saved locally. It has not been sent to the team.",
      "DRUNKEAST · 合作交流提纲\n\n姓名 / 机构：\n联系方式：\n关注方向：研究 / 工程 / 教育\n项目或问题：\n可提供的资源：\n建议的下一步：\n\n此提纲仅保存在本地，尚未发送给团队。",
    );
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + content], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "DRUNKEAST-partnership-brief.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }
  const parts = [
    {
      name: t("The connection", "连接结构"),
      text: t(
        "Bolted flanges make the interfaces visible. Explore the collars, fasteners and concentric geometry that define this industrial module.",
        "螺栓法兰让连接方式清晰可见。探索端部接口、紧固件与同心结构，理解这一工业模块的构成。",
      ),
      tag: t("FLANGES & FASTENERS", "法兰与紧固件"),
    },
    {
      name: t("The core", "核心管体"),
      text: t(
        "A continuous, open pipe sits at the center. The 3D view reveals the relationship between its inner passage and surrounding assembly.",
        "连续的中空管体位于中心。通过三维视角，观察内部通道与外围组件之间的空间关系。",
      ),
      tag: t("CONTINUOUS PIPE", "连续中空管体"),
    },
    {
      name: t("The assembly", "整体装配"),
      text: t(
        "Bands and tie rods form a layered exterior. Separate the components in the 3D studio to look more closely at the construction.",
        "加强环与拉杆组成层次分明的外部结构。在 3D 展厅中展开组件，进一步观察装配关系。",
      ),
      tag: t("BANDS & TIE RODS", "加强环与拉杆"),
    },
  ];
  return (
    <>
      <a className="skip-link" href="#main">
        {t("Skip to content", "跳转到正文")}
      </a>
      <header className="header">
        <a className="brand" href="#home" aria-label="DRUNKEAST home">
          <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M6 7h13c19 0 19 26 0 26H6V7Z" />
            <path d="M13 14h6c9 0 9 12 0 12h-6V14Z" />
          </svg>
          <span>
            DRUNK<span className="brand-light">EAST</span>
            <small>{t("BEYOND THE SURFACE", "向深处，见未来")}</small>
          </span>
        </a>
        <nav
          className={menu ? "navigation is-open" : "navigation"}
          aria-label={t("Main navigation", "主导航")}
        >
          {sections.map((id, i) => (
            <a
              key={id}
              className={active === id ? "active" : ""}
              href={`#${id}`}
              onClick={() => setMenu(false)}
            >
              {
                [
                  t("Our vision", "我们的愿景"),
                  t("Engineering", "工程设计"),
                  t("Our approach", "探索路径"),
                  t("The team", "关于团队"),
                ][i]
              }
            </a>
          ))}
          <a
            className="mobile-contact"
            href="#contact"
            onClick={() => setMenu(false)}
          >
            {t("Connect with us", "合作交流")}
          </a>
        </nav>
        <div className="header-actions">
          <button
            className="language-button"
            onClick={() => setLanguage(language === "en" ? "zh" : "en")}
            aria-label={t("切换为中文", "Switch to English")}
          >
            <Globe2 size={16} />
            <span>{language === "en" ? "中文" : "EN"}</span>
          </button>
          <a className="contact-link" href="#contact">
            {t("Let’s connect", "合作交流")}
          </a>
          <button
            className="menu-button icon-button"
            aria-label={t("Toggle menu", "切换菜单")}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main">
        <section className="hero" id="home">
          <div className="hero-topline">
            <span>
              {t(
                "DEEP-SEA EXPLORATION · A NEW PERSPECTIVE",
                "深海探索 · 全新视角",
              )}
            </span>
            <span className="topline-right">CONRAD CHALLENGE / 2026</span>
          </div>
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="line" />
              {t("CURIOSITY GOES DEEPER", "以好奇心，探索更深处")}
            </p>
            <h1>
              {t("From the abyss.", "自深海而来。")}
              <br />
              <span>{t("To the source.", "向本源而去。")}</span>
            </h1>
            <p className="hero-description">
              {t(
                "A new perspective beneath the surface. We’re exploring the intersection of ocean discovery and thoughtful engineering.",
                "在海面之下，发现全新视角。我们探索海洋发现与工程设计的交汇，让深处的想象逐步成为可能。",
              )}
            </p>
            <div className="hero-ctas">
              <a className="button button-light" href="#engineering">
                {t("Explore the concept", "探索工程概念")}
                <Box size={17} />
              </a>
              <button
                className="button button-text"
                ref={expandButton}
                onClick={() => setExpanded(true)}
              >
                <Maximize2 size={16} />
                {t("Enter 3D studio", "进入 3D 展厅")}
              </button>
            </div>
            <div className="hero-signature">
              <span />
              <p>
                {t(
                  "Built on curiosity. Shaped by engineering.",
                  "以好奇心出发，以工程思维塑造。",
                )}
              </p>
            </div>
          </div>
          <div
            ref={studio}
            className={expanded ? "scene-stage expanded" : "scene-stage"}
            role={expanded ? "dialog" : undefined}
            aria-modal={expanded || undefined}
            aria-label={t("Interactive 3D studio", "交互式 3D 展厅")}
          >
            {expanded && (
              <div className="studio-header">
                <span>
                  DRUNKEAST{" "}
                  <span className="muted">/ {t("3D STUDIO", "3D 展厅")}</span>
                </span>
                <button
                  className="icon-button"
                  aria-label={t("Close 3D studio", "关闭 3D 展厅")}
                  onClick={() => setExpanded(false)}
                >
                  <X />
                </button>
              </div>
            )}
            <Suspense
              fallback={
                <div className="scene-message">
                  {t("Preparing the deep", "正在潜入深海")}
                </div>
              }
            >
              <OceanScene
                mode={mode}
                paused={paused}
                expanded={expanded}
                reset={reset}
                language={language}
              />
            </Suspense>
            <div className="scene-caption">
              <span className="caption-cross">+</span>
              <div>
                <span>{t("ENGINEERING CONCEPT", "工程概念展示")}</span>
                <strong>{t("Industrial pipe module", "工业管道模块")}</strong>
              </div>
            </div>
            <div className="scene-hint">
              <Move size={14} />
              {t("Drag to orbit", "拖动旋转")}
              {expanded && t(" · Scroll to zoom", " · 滚动缩放")}
            </div>
            <div
              className="scene-toolbar"
              aria-label={t("3D view controls", "3D 视图控制")}
            >
              <div className="view-modes">
                {(["surface", "structure", "blueprint"] as SceneMode[]).map(
                  (value, i) => (
                    <button
                      key={value}
                      aria-pressed={mode === value}
                      onClick={() => setMode(value)}
                    >
                      {i === 0 ? (
                        <Box size={15} />
                      ) : i === 1 ? (
                        <Layers3 size={15} />
                      ) : (
                        <ScanLine size={15} />
                      )}
                      <span>
                        {
                          [
                            t("Surface", "材质"),
                            t("Exploded", "展开"),
                            t("Wireframe", "线框"),
                          ][i]
                        }
                      </span>
                    </button>
                  ),
                )}
              </div>
              <span className="toolbar-separator" />
              <button
                className="icon-button"
                onClick={() => setPaused(!paused)}
                aria-label={
                  paused
                    ? t("Resume motion", "继续动画")
                    : t("Pause motion", "暂停动画")
                }
                aria-pressed={paused}
              >
                {paused ? <Play size={15} /> : <Pause size={15} />}
              </button>
              <button
                className="icon-button"
                aria-label={t("Reset view", "重置视角")}
                onClick={() => {
                  setMode("surface");
                  setReset(reset + 1);
                }}
              >
                <RotateCcw size={15} />
              </button>
            </div>
            {expanded && (
              <p className="studio-note">
                {t(
                  "Concept visualization. Component separation is illustrative; no depth or pressure rating is implied.",
                  "概念可视化。组件展开仅用于结构展示，不代表深度或耐压等级。",
                )}
              </p>
            )}
          </div>
          <div className="hero-bottom">
            <a href="#vision">
              <span className="scroll-marker" />
              {t("SCROLL TO DISCOVER", "向下，探索更多")}
            </a>
            <span>
              {t("OCEAN THINKING. ENGINEERING MINDSET.", "海洋视野 · 工程思维")}
            </span>
            <span>DRUNKEAST © 2026</span>
          </div>
        </section>
        <section id="vision" className="vision section-pad">
          <div className="section-label">
            <span className="line" />
            {t("OUR VISION", "我们的愿景")}
          </div>
          <div className="vision-content">
            <h2>
              {t("The next perspective", "下一个视角，")}
              <br />
              <span className="muted">
                {t("lies beneath.", "在海面之下。")}
              </span>
            </h2>
            <div className="vision-bottom">
              <p>
                {t(
                  "The ocean invites us to ask better questions. To look closer. To connect the unknown with something we can understand—and eventually build.",
                  "海洋让我们提出更好的问题，观察更细微的变化，将未知与可理解、可构建的未来连接起来。",
                )}
              </p>
              <p>
                {t(
                  "DRUNKEAST is a Conrad Challenge team exploring deep-sea ideas through engineering and design. This is the beginning of that journey.",
                  "DRUNKEAST 是一支参与康莱德挑战赛的队伍，以工程与设计探索深海方向。这是我们探索旅程的开始。",
                )}
              </p>
            </div>
          </div>
          <div className="values-strip">
            <div>
              <Waves />
              <span>{t("Ocean-led curiosity", "以海洋激发好奇")}</span>
            </div>
            <div>
              <Box />
              <span>{t("Engineering-led thinking", "以工程引导思考")}</span>
            </div>
            <div>
              <Compass />
              <span>{t("Exploration with purpose", "以目标驱动探索")}</span>
            </div>
          </div>
        </section>
        <section id="engineering" className="engineering section-pad">
          <div className="section-heading">
            <div>
              <p className="section-label">
                {t("INSIDE THE CONCEPT", "深入工程概念")}
              </p>
              <h2>
                {t("Every detail.", "每一处细节。")}
                <br />
                <span className="muted">
                  {t("Part of a bigger idea.", "都是整体的一部分。")}
                </span>
              </h2>
            </div>
            <p>
              {t(
                "Get closer to the geometry. Explore the construction behind our visual concept, one component at a time.",
                "靠近结构本身，逐一观察组件，探索视觉概念背后的装配关系。",
              )}
            </p>
          </div>
          <div className="engineering-grid">
            <div className={`technical-art part-${focusPart}`}>
              <div className="art-grid" />
              <div className="art-orbit orbit-one" />
              <div className="art-orbit orbit-two" />
              <img
                src={`${import.meta.env.BASE_URL}model-preview.svg`}
                alt={t(
                  "Exploded schematic showing pipe, flanges, bands and tie rods",
                  "展示管体、法兰、加强环与拉杆的结构示意图",
                )}
              />
              <span className="art-tag">{parts[focusPart].tag}</span>
              <span className="art-footnote">
                {t("STRUCTURAL STUDY / ILLUSTRATIVE", "结构研究 / 示意展示")}
              </span>
            </div>
            <div className="component-list">
              {parts.map((part, index) => (
                <article
                  key={index}
                  className={
                    focusPart === index ? "component selected" : "component"
                  }
                >
                  <h3>
                    <button
                      aria-expanded={focusPart === index}
                      aria-controls={`part-${index}`}
                      onClick={() => setFocusPart(index)}
                    >
                      {part.name}
                      {focusPart === index ? (
                        <Minus size={20} />
                      ) : (
                        <Plus size={20} />
                      )}
                    </button>
                  </h3>
                  <div id={`part-${index}`} hidden={focusPart !== index}>
                    <p>{part.text}</p>
                    <button
                      className="text-link"
                      onClick={() => {
                        setMode(index === 2 ? "structure" : "surface");
                        setExpanded(true);
                      }}
                    >
                      {t("Inspect in 3D", "在 3D 中查看")}
                      <Maximize2 size={15} />
                    </button>
                  </div>
                </article>
              ))}
              <p className="small-note">
                {t(
                  "A visual engineering concept. Materials and assembly views do not represent validated product specifications.",
                  "工程视觉概念。材质与装配展示不代表已验证的产品技术参数。",
                )}
              </p>
            </div>
          </div>
        </section>
        <section id="approach" className="approach section-pad">
          <p className="section-label">{t("THE WAY FORWARD", "探索路径")}</p>
          <div className="section-heading">
            <h2>
              {t("Ideas go deeper", "让想法深入，")}
              <br />
              <span className="muted">
                {t("when we question them.", "从提出问题开始。")}
              </span>
            </h2>
            <p>
              {t(
                "A clear path from a question to a concept worth testing. Our approach keeps discovery and engineering in the same conversation.",
                "从一个问题，走向值得验证的概念。让探索与工程始终处于同一场对话中。",
              )}
            </p>
          </div>
          <div className="approach-grid">
            {[
              [
                t("Discover", "发现"),
                t("Start with the environment.", "从环境出发。"),
                t(
                  "Explore the context, listen to different perspectives and define the question that matters.",
                  "理解场景，倾听不同视角，找到真正值得解决的问题。",
                ),
              ],
              [
                t("Design", "设计"),
                t("Make the idea tangible.", "让想法可感知。"),
                t(
                  "Use models and visual studies to examine structure, connections and possible directions.",
                  "通过模型与视觉研究，观察结构、连接方式与可能的方向。",
                ),
              ],
              [
                t("Validate", "验证"),
                t("Let evidence guide the next step.", "以证据决定下一步。"),
                t(
                  "Define what must be tested before moving from an engineering concept to a real-world application.",
                  "明确从工程概念走向实际应用之前，哪些假设需要经过测试。",
                ),
              ],
            ].map(([name, title, body], i) => (
              <article key={name}>
                <div className="approach-symbol">
                  {i === 0 ? <Compass /> : i === 1 ? <Layers3 /> : <ScanLine />}
                  <span>{name}</span>
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="team" className="team section-pad">
          <div className="team-visual" aria-hidden="true">
            <div className="sonar sonar-one" />
            <div className="sonar sonar-two" />
            <div className="sonar sonar-three" />
            <div className="sonar-line" />
            <span className="ocean-word">
              DEEPER
              <br />
              <i>TOGETHER.</i>
            </span>
            <span className="team-coordinate">
              DRUNKEAST / CONRAD CHALLENGE
            </span>
          </div>
          <div className="team-copy">
            <p className="section-label">
              {t("THE PEOPLE BEHIND THE PERSPECTIVE", "视角背后，是我们")}
            </p>
            <h2>
              {t("Different minds.", "不同的思维。")}
              <br />
              <span className="muted">
                {t("One deeper ambition.", "共同的深海志向。")}
              </span>
            </h2>
            <p>
              {t(
                "We are DRUNKEAST. A team brought together by a shared interest in what lies beyond the familiar—and what engineering might make possible.",
                "我们是 DRUNKEAST。一群因好奇心相聚的探索者，关注熟悉边界之外的世界，也关注工程能够带来的可能。",
              )}
            </p>
            <p>
              {t(
                "Our Conrad Challenge journey is an opportunity to connect research, design and communication around a shared idea.",
                "康莱德挑战赛是我们的契机，让研究、设计与表达围绕一个共同的想法连接起来。",
              )}
            </p>
            <a className="text-link" href="#contact">
              {t("Be part of the conversation", "加入这场对话")}
              <Plus size={16} />
            </a>
          </div>
        </section>
        <section id="contact" className="contact section-pad">
          <p className="section-label">{t("THE NEXT CHAPTER", "下一个篇章")}</p>
          <h2>
            {t("Great discoveries", "伟大的发现，")}
            <br />
            {t("start with a conversation.", "始于一次对话。")}
          </h2>
          <div className="contact-bottom">
            <p>
              {t(
                "Interested in ocean research, engineering or education? Shape a conversation around the questions we could explore together.",
                "关注海洋研究、工程设计或教育？从我们可以共同探索的问题开始，开启交流。",
              )}
            </p>
            <div>
              <button className="button button-dark" onClick={downloadBrief}>
                {t("Prepare a collaboration brief", "准备合作交流提纲")}
                <Download size={17} />
              </button>
              <p className="contact-note" role="status">
                {downloaded
                  ? t(
                      "Brief downloaded. It has not been sent.",
                      "提纲已下载，尚未发送。",
                    )
                  : t(
                      "A local download to help you start. No information is sent.",
                      "下载一份本地提纲，整理你的想法；不会发送信息。",
                    )}
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-top">
          <a className="footer-wordmark" href="#home">
            DRUNKEAST
          </a>
          <p>
            {t("From the abyss.", "自深海而来。")}
            <br />
            {t("To the source.", "向本源而去。")}
          </p>
        </div>
        <div className="footer-bottom">
          <span>© 2026 DRUNKEAST</span>
          <span>
            {t(
              "Conrad Challenge team · Concept in development",
              "康莱德挑战赛队伍 · 概念探索阶段",
            )}
          </span>
          <button onClick={() => setLanguage(language === "en" ? "zh" : "en")}>
            EN / 中文
          </button>
          <a href="#home">{t("Back to the surface", "返回海面")}</a>
        </div>
      </footer>
    </>
  );
}
