import { type Node } from "./index.ts";

export type Intersection = {
  x: number;
  y: number;
  offset: number;
};

export function getIntersection(
  a: Node,
  b: Node,
  c: Node,
  d: Node,
): Intersection {
  const intersection = {
    x: 0,
    y: 0,
    offset: 0,
  };

  const tTop = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x);
  const uTop = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y);
  const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);

  if (bottom !== 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      intersection.x = lerp(a.x, b.x, t);
      intersection.y = lerp(a.y, b.y, t);
      intersection.offset = t;
    }
  }

  return intersection;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
