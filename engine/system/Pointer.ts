import { type Vector } from "../lib/Vector.ts";
import { camera } from "./View.ts";

export type Pointer = {
  isDown: boolean;
  position: Vector;
};

export const pointer: Pointer = {
  isDown: false,
  position: { x: 0, y: 0 },
};

function onMouseDown(event: MouseEvent): void {
  pointer.position.x = event.clientX + camera.position.x;
  pointer.position.y = event.clientY + camera.position.y;
  pointer.isDown = true;
}

function onTouchStart(event: TouchEvent): void {
  pointer.position.x = event.touches[0].clientX + camera.position.x;
  pointer.position.y = event.touches[0].clientY + camera.position.y;
  pointer.isDown = true;
}

function onMouseMove(event: MouseEvent): void {
  pointer.position.x = event.clientX + camera.position.x;
  pointer.position.y = event.clientY + camera.position.y;
}

function onTouchMove(event: TouchEvent): void {
  pointer.position.x = event.touches[0].clientX + camera.position.x;
  pointer.position.y = event.touches[0].clientY + camera.position.y;
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
