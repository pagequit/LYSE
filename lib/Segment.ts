import type { Vector } from "./Vector.ts";
import { lerp } from "./lerp.ts";

export type Segment = [Vector, Vector];

export type SegmentIntersection = {
  position: Vector;
  offset: number;
};

export function getSegmentIntersection(
  a: Segment,
  b: Segment,
): SegmentIntersection | null {
  const bottom =
    (b[1].y - b[0].y) * (a[1].x - a[0].x) -
    (b[1].x - b[0].x) * (a[1].y - a[0].y);

  if (bottom === 0) {
    return null;
  }

  const tTop =
    (b[1].x - b[0].x) * (a[0].y - b[0].y) -
    (b[1].y - b[0].y) * (a[0].x - b[0].x);
  const uTop =
    (b[0].y - a[0].y) * (a[0].x - a[1].x) -
    (b[0].x - a[0].x) * (a[0].y - a[1].y);

  const t = tTop / bottom;
  const u = uTop / bottom;

  if (t < 0 || t > 1 || u < 0 || u > 1) {
    return null;
  }

  return {
    position: {
      x: lerp(a[0].x, a[1].x, t),
      y: lerp(a[0].y, a[1].y, t),
    },
    offset: t,
  };
}
