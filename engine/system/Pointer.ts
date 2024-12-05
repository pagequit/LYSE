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

function onMouseDown(event: MouseEvent): void {
  pointer.position.x =
    event.clientX + game.scene.camera.position.x - canvas.offsetLeft;
  pointer.position.y =
    event.clientY + game.scene.camera.position.y - canvas.offsetTop;
  pointer.isDown = true;
}

function onTouchStart(event: TouchEvent): void {
  pointer.position.x =
    event.touches[0].clientX + game.scene.camera.position.x - canvas.offsetLeft;
  pointer.position.y =
    event.touches[0].clientY + game.scene.camera.position.y - canvas.offsetTop;
  pointer.isDown = true;
}

function onMouseMove(event: MouseEvent): void {
  pointer.position.x =
    event.clientX + game.scene.camera.position.x - canvas.offsetLeft;
  pointer.position.y =
    event.clientY + game.scene.camera.position.y - canvas.offsetTop;
}

function onTouchMove(event: TouchEvent): void {
  pointer.position.x =
    event.touches[0].clientX + game.scene.camera.position.x - canvas.offsetLeft;
  pointer.position.y =
    event.touches[0].clientY + game.scene.camera.position.y - canvas.offsetTop;
}

function onMouseUp(): void {
  pointer.isDown = false;
}

function onTouchEnd(): void {
  pointer.isDown = false;
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
