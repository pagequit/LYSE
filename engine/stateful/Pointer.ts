import { type Vector } from "../lib/Vector.ts";
import { canvas } from "./View.ts";
import { game } from "./Game.ts";

export type Pointer = {
  isDown: boolean;
  position: Vector;
};

export const pointer: Pointer = {
  isDown: false,
  position: { x: 0, y: 0 },
};

function adjustPointerPosition(
  pointer: Pointer,
  eventX: number,
  eventY: number,
): void {
  pointer.position.x =
    (eventX - canvas.offsetLeft + game.scene.viewport.origin.x) /
    game.settings.scale;
  pointer.position.y =
    (eventY - canvas.offsetTop + game.scene.viewport.origin.y) /
    game.settings.scale;
}

function onMouseDown(event: MouseEvent): void {
  pointer.isDown = event.button === 0 ? true : pointer.isDown;
}

function onTouchStart(event: TouchEvent): void {
  adjustPointerPosition(
    pointer,
    event.touches[0].clientX,
    event.touches[0].clientY,
  );
  pointer.isDown = true;
}

function onMouseMove(event: MouseEvent): void {
  adjustPointerPosition(pointer, event.clientX, event.clientY);
}

function onTouchMove(event: TouchEvent): void {
  adjustPointerPosition(
    pointer,
    event.touches[0].clientX,
    event.touches[0].clientY,
  );
}

function onMouseUp(event: MouseEvent): void {
  pointer.isDown = event.button === 0 ? false : pointer.isDown;
}

function onTouchEnd(event: TouchEvent): void {
  pointer.isDown = event.touches.length === 0 ? false : pointer.isDown;
}

export function applyPointer(): void {
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("touchstart", onTouchStart);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("touchmove", onTouchMove);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("touchend", onTouchEnd);
}

export function removePointer(): void {
  canvas.removeEventListener("mousedown", onMouseDown);
  canvas.removeEventListener("touchstart", onTouchStart);
  canvas.removeEventListener("mousemove", onMouseMove);
  canvas.removeEventListener("touchmove", onTouchMove);
  canvas.removeEventListener("mouseup", onMouseUp);
  canvas.removeEventListener("touchend", onTouchEnd);
}
