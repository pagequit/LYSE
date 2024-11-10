export type Vector = {
  x: number;
  y: number;
};

/**
 * Returns the magnitude of the given vector.
 */
export function magnitude(vector: Vector): number {
  return Math.hypot(vector.x, vector.y);
}

/**
 * Scales the given vector by the given scalar.
 */
export function scale(vector: Vector, scalar: number): void {
  vector.x *= scalar;
  vector.y *= scalar;
}

/**
 * Normalizes the given vector ({ x: 0, y: 0 } remains unchanged).
 */
export function normalize(vector: Vector): void {
  const scalar = 1 / Math.hypot(vector.x, vector.y);
  if (scalar !== Infinity) {
    vector.x *= scalar;
    vector.y *= scalar;
  }
}
