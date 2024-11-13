export type Vector = {
  x: number;
  y: number;
};

export function direction(vector: Vector): number {
  return Math.atan2(vector.y, vector.x);
}

export function magnitude(vector: Vector): number {
  return Math.hypot(vector.x, vector.y);
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

export function add(vector: Vector, other: Vector): void {
  vector.x += other.x;
  vector.y += other.y;
}

export function subtract(vector: Vector, other: Vector): void {
  vector.x -= other.x;
  vector.y -= other.y;
}

export function dot(vector: Vector, other: Vector): number {
  return vector.x * other.x + vector.y * other.y;
}

export function isZero(vector: Vector): boolean {
  return vector.x === 0 && vector.y === 0;
}

export function equals(vector: Vector, other: Vector): boolean {
  return vector.x === other.x && vector.y === other.y;
}

export function copy(vector: Vector): Vector {
  return { x: vector.x, y: vector.y };
}
