export function seed(index: number, salt?: number): number;
export function particlePosition(
  index: number,
  time: number,
  flow?: number,
  treated?: boolean,
): { x: number; y: number; z: number; phase: number; caught: boolean };
export function microPosition(
  index: number,
  time: number,
  stage: number,
  aggregation?: number,
): { x: number; y: number; z: number };
