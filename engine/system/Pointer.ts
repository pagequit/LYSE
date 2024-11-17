import { type Vector } from "../lib/Vector.ts";

export type Pointer = {
  isDown: boolean;
  position: Vector;
};

export const pointer: Pointer = {
  isDown: false,
  position: { x: 0, y: 0 },
};

function onMouseDown(event: MouseEvent): void {
  pointer.isDown = true;
  pointer.position.x = event.clientX;
  pointer.position.y = event.clientY;
}

function onTouchStart(event: TouchEvent): void {
  pointer.isDown = true;
  pointer.position.x = event.touches[0].clientX;
  pointer.position.y = event.touches[0].clientY;
}

function onMouseMove(event: MouseEvent): void {
  pointer.position.x = event.clientX;
  pointer.position.y = event.clientY;
}

function onTouchMove(event: TouchEvent): void {
  pointer.position.x = event.touches[0].clientX;
  pointer.position.y = event.touches[0].clientY;
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
