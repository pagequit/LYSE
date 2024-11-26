import { type Vector } from "../lib/Vector.ts";

export type Pointer = {
  isDown: boolean;
  position: Vector;
  offset: Vector;
};

export const pointer: Pointer = {
  isDown: false,
  position: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
};

function onMouseDown(event: MouseEvent): void {
  pointer.isDown = true;
  pointer.position.x = event.clientX + pointer.offset.x;
  pointer.position.y = event.clientY + pointer.offset.y;
}

function onTouchStart(event: TouchEvent): void {
  pointer.isDown = true;
  pointer.position.x = event.touches[0].clientX + pointer.offset.x;
  pointer.position.y = event.touches[0].clientY + pointer.offset.y;
}

function onMouseMove(event: MouseEvent): void {
  pointer.position.x = event.clientX + pointer.offset.x;
  pointer.position.y = event.clientY + pointer.offset.y;
}

function onTouchMove(event: TouchEvent): void {
  pointer.position.x = event.touches[0].clientX + pointer.offset.x;
  pointer.position.y = event.touches[0].clientY + pointer.offset.y;
}

function onMouseUp(): void {
  pointer.isDown = false;
}

function onTouchEnd(): void {
  pointer.isDown = false;
}

export function usePointer(): () => void {
  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("touchstart", onTouchStart);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("touchmove", onTouchMove);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("touchend", onTouchEnd);

  return (): void => {
    document.removeEventListener("mousedown", onMouseDown);
    document.removeEventListener("touchstart", onTouchStart);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("touchend", onTouchEnd);
  };
}
