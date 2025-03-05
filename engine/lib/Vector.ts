export type Vector = {
  x: number;
  y: number;
};

export function fromPolar(direction: number, magnitude: number): Vector {
  return {
    x: Math.cos(direction) * magnitude,
    y: Math.sin(direction) * magnitude,
  };
}

export function getDirection(vector: Vector): number {
  return Math.atan2(vector.y, vector.x);
}

export function getMagnitude(vector: Vector): number {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

export function getDistance(a: Vector, b: Vector): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}

export function setDistanceNormal(normal: Vector, a: Vector, b: Vector): void {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 0) {
    normal.x = dx / distance;
    normal.y = dy / distance;
  }
}

export function getDotProduct(a: Vector, b: Vector): number {
  return a.x * b.x + a.y * b.y;
}

export function scale(vector: Vector, scalar: number): void {
  vector.x *= scalar;
  vector.y *= scalar;
}

export function normalize(vector: Vector): void {
  const scalar = 1 / Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  if (scalar !== Number.POSITIVE_INFINITY) {
    vector.x *= scalar;
    vector.y *= scalar;
  }
}

export function isZero(vector: Vector): boolean {
  return vector.x === 0 && vector.y === 0;
}
