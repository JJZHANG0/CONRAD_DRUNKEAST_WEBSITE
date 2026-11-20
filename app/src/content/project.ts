export type Lang = "en" | "zh";
export type Copy = [string, string];
export const titles: Record<string, Copy> = {
  home: ["Home", "首页"],
  challenge: ["The challenge", "环境挑战"],
  technology: ["Our technology", "核心技术"],
  system: ["Our system", "处理系统"],
  simulation: ["Simulation", "交互模拟"],
  validation: ["Validation", "研究验证"],
  partnership: ["Partnership", "应用与合作"],
};
export const chapters: { label: Copy; title: Copy; body: Copy }[] = [
  {
    label: ["THE OCEAN SURFACE", "海洋表面"],
    title: ["FROM THE ABYSS.\nTO THE SOURCE.", "自深海而来。\n向源头而去。"],
    body: [
      "Engineering a better approach to deep-sea sediment plume control.",
      "以工程创新，探索深海沉积物羽流的源头控制。",
    ],
  },
  {
    label: ["DESCENDING INTO THE ABYSS", "下潜至深处"],
    title: ["A vast world.\nA delicate balance.", "广阔的世界。\n微妙的平衡。"],
    body: [
      "Beneath the surface lies an environment that demands a different kind of engineering. One shaped by the ecosystem around it.",
      "海面之下的环境，需要一种不同的工程思维——以周围生态系统为设计前提。",
    ],
  },
  {
    label: ["WHERE THE PLUME BEGINS", "羽流产生的地方"],
    title: ["The disturbance\nbegins here.", "扰动，\n从这里开始。"],
    body: [
      "As a collector works across the seabed, disturbed sediments enter the water. The smallest particles can move beyond the immediate operation.",
      "采集设备在海床作业时，扰动的沉积物进入水体。细小颗粒可能离开直接作业区，随水流扩散。",
    ],
  },
  {
    label: ["A PROBLEM WE CAN SEE", "看见问题本身"],
    title: [
      "Predict the plume.\nThen address its source.",
      "理解羽流。\n更要直面源头。",
    ],
    body: [
      "Monitoring helps us understand dispersion. Our question is what happens next: can we capture suspended particles closer to where the disturbance begins?",
      "监测帮助我们理解扩散。我们进一步追问：能否在扰动发生的位置附近，捕集水中的悬浮颗粒？",
    ],
  },
  {
    label: ["TREATMENT AT THE SOURCE", "在源头处理"],
    title: [
      "Closer to the source.\nBuilt around the process.",
      "靠近源头。\n围绕过程设计。",
    ],
    body: [
      "A conceptual seabed system brings particle capture, bio-based flocculation and solid–liquid separation into one modular treatment pathway.",
      "概念性海底系统，将颗粒捕集、生物基絮凝和固液分离连接为模块化处理路径。",
    ],
  },
  {
    label: ["FROM DISPERSION TO CONTROL", "从扩散走向控制"],
    title: [
      "A different pathway\nfor suspended particles.",
      "为悬浮颗粒，\n探索另一条路径。",
    ],
    body: [
      "Bring fine particles together. Separate the resulting flocs. Retain solids while directing water along a controlled path. The goal is less outward dispersion—not an untouched ocean.",
      "让细颗粒聚集成絮体，随后分离并截留固体，引导水体进入受控路径。目标是减少向外扩散，而不是宣称海洋不受影响。",
    ],
  },
  {
    label: ["ENGINEERING FOR THE DEEP", "为深海而设计"],
    title: ["ENGINEERING\nAT THE SOURCE.", "工程创新，\n始于源头。"],
    body: [
      "A better approach begins with a testable idea. Explore the technology, challenge the assumptions, and help define what comes next.",
      "更好的方法，从一个可验证的想法开始。了解技术，审视假设，共同定义下一步。",
    ],
  },
];
export const processes: {
  name: Copy;
  title: Copy;
  body: Copy;
  detail: Copy;
}[] = [
  {
    name: ["Capture", "捕集"],
    title: ["Bring the particles into the process.", "让颗粒进入处理路径。"],
    body: [
      "A proposed local intake guides sediment-bearing water from the disturbance area toward the treatment modules.",
      "拟议的近场入口，将扰动区域含沉积物的水体引向处理模块。",
    ],
    detail: [
      "The intake geometry and capture zone require hydrodynamic testing. The model does not establish a capture efficiency.",
      "入口几何结构与捕集范围需要水动力试验，本模型不代表已知捕集效率。",
    ],
  },
  {
    name: ["Flocculate", "絮凝"],
    title: ["Small particles. Larger aggregates.", "细小颗粒，聚集成絮。"],
    body: [
      "Bio-based polymers are being considered to help fine suspended particles form larger flocs that can be separated from water.",
      "考虑采用生物基聚合物，帮助细小悬浮颗粒形成更大的絮体，以便与水体分离。",
    ],
    detail: [
      "Formulation, dose, mixing and seawater compatibility remain research variables. Bio-based does not automatically mean ecologically safe.",
      "配方、用量、混合方式与海水适配性仍是研究变量。生物基不等于自动具备生态安全性。",
    ],
  },
  {
    name: ["Separate", "分离"],
    title: [
      "Give solids and water different paths.",
      "让固体与水体，各循其路。",
    ],
    body: [
      "The concept pairs flocculation with a solid–liquid separation stage to retain aggregated sediment.",
      "概念方案将絮凝与固液分离配对，以截留聚集后的沉积物。",
    ],
    detail: [
      "Settling and a separation surface are shown as explanatory mechanisms, not a finalized filter or pressure-vessel design.",
      "沉降与分离面用于解释原理，并非已经定型的过滤或耐压容器设计。",
    ],
  },
  {
    name: ["Direct", "引导"],
    title: ["Controlled pathways. Further validation.", "受控路径，持续验证。"],
    body: [
      "Separated solids and treated water follow distinct local pathways. Residual particles remain visible in the demonstration.",
      "分离后的固体与处理水体沿不同的局部路径流动，演示中保留残余颗粒。",
    ],
    detail: [
      "Final retention, handling and discharge arrangements must follow engineering design and environmental assessment.",
      "最终截留、处置和排放安排，必须依据工程设计与环境评估确定。",
    ],
  },
];
export const metrics: { name: Copy; question: Copy; method: Copy }[] = [
  {
    name: ["Suspended solids reduction", "悬浮固体削减"],
    question: [
      "How does outlet suspended-solids concentration compare with the inlet?",
      "出水与进水的悬浮固体浓度有何差异？",
    ],
    method: [
      "Paired inlet / outlet sampling and gravimetric analysis.",
      "配对采集进出水样，并进行重量法分析。",
    ],
  },
  {
    name: ["Particle removal", "颗粒去除"],
    question: [
      "Which particle-size fractions are captured, and which remain?",
      "哪些粒径组分被捕集，哪些仍然残留？",
    ],
    method: [
      "Particle-size distributions and a solids mass balance.",
      "粒径分布测量与固体质量平衡。",
    ],
  },
  {
    name: ["Treatment throughput", "处理通量"],
    question: [
      "Can the process sustain flow under representative conditions?",
      "能否在代表性工况下保持处理流量？",
    ],
    method: [
      "Flow, pressure loss, blockage and duration logging.",
      "记录流量、压损、堵塞情况与持续运行时间。",
    ],
  },
  {
    name: ["Floc stability", "絮体稳定性"],
    question: [
      "Do aggregates survive mixing and transfer?",
      "絮体能否经受混合与输送过程？",
    ],
    method: [
      "Controlled shear tests and before / after size analysis.",
      "受控剪切试验与前后粒径分析。",
    ],
  },
  {
    name: ["Reagent consumption", "药剂消耗"],
    question: [
      "How much reagent is needed for each sediment condition?",
      "不同沉积物工况需要多少药剂？",
    ],
    method: [
      "Dose-response studies, residual reagent analysis and cost tracking.",
      "剂量响应研究、残留药剂分析与成本记录。",
    ],
  },
  {
    name: ["Energy consumption", "能源消耗"],
    question: [
      "What is the power requirement per treated volume?",
      "单位处理体积需要多少能源？",
    ],
    method: [
      "Measure pump and separation-stage energy alongside flow.",
      "同步测量泵送、分离阶段的能耗与流量。",
    ],
  },
  {
    name: ["Ecotoxicity & oxygen demand", "生态毒性与耗氧"],
    question: [
      "What effects could residual reagents and treated water have?",
      "残留药剂与处理水体可能带来哪些影响？",
    ],
    method: [
      "Relevant ecotoxicity assays, oxygen-demand tests and residual chemistry.",
      "相关生态毒性试验、耗氧试验与残留化学分析。",
    ],
  },
];
