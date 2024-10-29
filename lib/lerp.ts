export function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

export function lerpPrecice(a: number, b: number, t: number): number {
  return (1 - t) * a + t * b;
}
