import { test } from "node:test";
import assert from "node:assert/strict";
import {
  particlePosition,
  microPosition,
} from "../src/experience/particle-model.mjs";
test("particle seeds and trajectories are deterministic", () => {
  for (let i = 0; i < 250; i++)
    assert.deepEqual(
      particlePosition(i, 13.4, 1, true),
      particlePosition(i, 13.4, 1, true),
    );
});
test("comparison preserves untreated trajectories and keeps every particle represented", () => {
  let captured = 0,
    residual = 0;
  for (let i = 0; i < 2200; i++) {
    const a = particlePosition(i, 7, 1, false),
      b = particlePosition(i, 7, 1, true);
    if (b.caught) captured++;
    else {
      residual++;
      assert.deepEqual(b, a);
    }
    for (const value of [b.x, b.y, b.z]) assert.ok(Number.isFinite(value));
  }
  assert.equal(captured + residual, 2200);
  assert.ok(captured > 0 && residual > 0);
});
test("higher illustrative flow increases outward travel without changing particle identity", () => {
  for (let i = 0; i < 250; i++) {
    const a = particlePosition(i, 3, 0.3, false),
      b = particlePosition(i, 3, 2, false);
    assert.equal(a.phase, b.phase);
    assert.ok(b.x >= a.x);
  }
});
test("retained particles remain represented in the collection region", () => {
  let seen = 0;
  for (let i = 0; i < 600; i++) {
    const p = particlePosition(i, 9, 1, true);
    if (p.caught && p.phase > 0.72) {
      seen++;
      assert.ok(p.x >= 7.2 && p.x <= 8);
      assert.ok(p.y >= -26.5 && p.y <= -24.8);
    }
  }
  assert.ok(seen > 0);
});
test("all microscopic stages stay finite and capture does not apply aggregation", () => {
  for (let stage = 0; stage < 4; stage++)
    for (let i = 0; i < 360; i++) {
      const p = microPosition(i, 21, stage, 1);
      assert.ok([p.x, p.y, p.z].every(Number.isFinite));
      if (stage === 0) assert.deepEqual(p, microPosition(i, 21, 0, 0));
    }
});
