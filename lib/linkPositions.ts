import { type Vector } from "./Vector";

function linkPositions(a: Vector, b: Vector) {
  const offset = {
    x: a.x - b.x,
    y: a.y - b.y,
  };

  const setA = (x: number, y: number) => {
    a.x = x;
    b.x = x - offset.x;
    a.y = y;
    b.y = y - offset.y;
  };

  const setB = (x: number, y: number) => {
    b.x = x;
    a.x = x + offset.x;
    b.y = y;
    a.y = y + offset.y;
  };

  const setOffset = (x: number, y: number) => {
    offset.x = x;
    offset.y = y;
    a.x = b.x + x;
    a.y = b.y + y;
  };

  return { setA, setB, setOffset };
}
