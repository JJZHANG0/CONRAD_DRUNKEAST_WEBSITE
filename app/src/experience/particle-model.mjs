// Deterministic, uncalibrated visual choreography. Coordinates and rates are not SI measurements.
export function seed(i, salt = 0) {
  const n = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
export function particlePosition(index, time, flow = 1, treated = false) {
  const phase = (time * 0.055 + seed(index, 1)) % 1;
  const spread = seed(index, 2) - 0.5;
  const lateral = seed(index, 3) - 0.5;
  const caught = treated && seed(index, 4) < 0.56;
  let x, y, z;
  if (caught) {
    // Capture -> flocculation -> retention. Particle remains represented at the outlet tray.
    if (phase < 0.38) {
      const p = phase / 0.38;
      x = -5 + p * 9;
      y = -25.6 + Math.sin(p * Math.PI) * 0.7 + spread * 0.7;
      z = -1 + lateral * (1 - p) * 3;
    } else if (phase < 0.72) {
      const p = (phase - 0.38) / 0.34;
      const cluster = Math.floor(index / 12);
      x = 4 + p * 3.6;
      y =
        -24.8 +
        Math.sin(cluster * 1.7 + time * 0.3) * 0.35 +
        spread * (1 - p) * 0.3;
      z = -1 + Math.cos(cluster * 2.1) * 0.38 + lateral * (1 - p) * 0.3;
    } else {
      const p = (phase - 0.72) / 0.28;
      x = 7.6 + spread * 0.7;
      y = -24.8 - Math.min(p * 2.2, 1.7);
      z = -1 + lateral * 0.8;
    }
  } else {
    x = -5 + phase * (12 + flow * 5);
    y =
      -25.8 +
      Math.sin(phase * Math.PI) * (1.2 + flow * 0.7) +
      seed(index, 5) * phase * 2.1;
    z =
      -1 +
      lateral * (0.5 + phase * 8) +
      Math.sin(phase * 5 + time * 0.1) * phase;
  }
  return { x, y, z, phase, caught };
}
export function microPosition(index, time, stage, aggregation = 1) {
  const cluster = Math.floor(index / 10);
  const phase = (time * 0.12 + seed(stage === 0 ? index : cluster, 6)) % 1;
  const drift = Math.sin(time * 0.4 + cluster * 2.3);
  const mix = stage === 0 ? 0 : Math.min(1, phase * 1.8) * aggregation;
  const looseX = (seed(index, 8) - 0.5) * 7;
  const looseY = (seed(index, 9) - 0.5) * 3.7;
  const looseZ = (seed(index, 10) - 0.5) * 3;
  const clusterX = (seed(cluster, 12) - 0.5) * 6;
  const clusterY = (seed(cluster, 13) - 0.5) * 2;
  const clusterZ = (seed(cluster, 14) - 0.5) * 2;
  let x =
    looseX * (1 - mix) + (clusterX + (seed(index, 15) - 0.5) * 0.48) * mix;
  let y =
    looseY * (1 - mix) +
    (clusterY + (seed(index, 16) - 0.5) * 0.48) * mix +
    drift * 0.07;
  let z =
    looseZ * (1 - mix) + (clusterZ + (seed(index, 17) - 0.5) * 0.48) * mix;
  if (stage === 0) {
    x = -4.6 + phase * 9.2;
    y = looseY * (1 - phase * 0.65);
    z = looseZ * (1 - phase * 0.65);
  }
  if (stage >= 2) {
    y -= Math.min(phase * 3, 2.5);
    y = Math.max(y, -2.3 + seed(index, 18) * 0.25);
  }
  if (stage === 3) {
    x *= 0.65;
    z *= 0.65;
  }
  return { x, y, z };
}
