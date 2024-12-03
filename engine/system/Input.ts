import { normalize, type Vector } from "../lib/Vector.ts";
import { applyKeyboard, keyboardInput, removeKeyboard } from "./Keyboard";
import { touchControls } from "../gui/TouchControls.ts";
import { applyPointer, removePointer } from "./Pointer";

export type Input = {
  up: number;
  down: number;
  left: number;
  right: number;
  axes: [number, number];
  vector: Vector;
};

export const input: Input = {
  up: 0,
  down: 0,
  left: 0,
  right: 0,
  axes: [0, 0],
  vector: { x: 0, y: 0 },
};

export function processInputs() {
  input.up = keyboardInput.arrowUp;
  input.down = keyboardInput.arrowDown;
  input.left = keyboardInput.arrowLeft;
  input.right = keyboardInput.arrowRight;

  input.axes = touchControls.axes;

  input.vector.x = input.right - input.left + input.axes[0];
  input.vector.y = input.down - input.up + input.axes[1];

  normalize(input.vector);
}

export function applyInputs(): void {
  applyPointer();
  applyKeyboard();
}

export function removeInputs(): void {
  removePointer();
  removeKeyboard();
}
