export type Vector = {
  x: number;
  y: number;
};

export function getDirection(vector: Vector): number {
  return Math.atan2(vector.y, vector.x);
}

export function getMagnitude(vector: Vector): number {
  return Math.hypot(vector.x, vector.y);
}

export function getScalar(a: Vector, b: Vector): number {
  return a.x * b.x + a.y * b.y;
}

export function scale(vector: Vector, scalar: number): void {
  vector.x *= scalar;
  vector.y *= scalar;
}

export function normalize(vector: Vector): void {
  const scalar = 1 / Math.hypot(vector.x, vector.y);
  if (scalar !== Infinity) {
    vector.x *= scalar;
    vector.y *= scalar;
  }
}

export function isZero(vector: Vector): boolean {
  return vector.x === 0 && vector.y === 0;
}
