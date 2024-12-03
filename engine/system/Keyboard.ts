export type KeyboardInput = {
  arrowUp: number;
  arrowDown: number;
  arrowLeft: number;
  arrowRight: number;
};

export const keyboardInput: KeyboardInput = {
  arrowUp: 0,
  arrowDown: 0,
  arrowLeft: 0,
  arrowRight: 0,
};

function onKeyDown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowUp":
      keyboardInput.arrowUp = 1;
      break;
    case "ArrowDown":
      keyboardInput.arrowDown = 1;
      break;
    case "ArrowLeft":
      keyboardInput.arrowLeft = 1;
      break;
    case "ArrowRight":
      keyboardInput.arrowRight = 1;
      break;
  }
}

function onKeyUp(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowUp":
      keyboardInput.arrowUp = 0;
      break;
    case "ArrowDown":
      keyboardInput.arrowDown = 0;
      break;
    case "ArrowLeft":
      keyboardInput.arrowLeft = 0;
      break;
    case "ArrowRight":
      keyboardInput.arrowRight = 0;
      break;
  }
}

export function applyKeyboard(): void {
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
}

export function removeKeyboard(): void {
  document.removeEventListener("keydown", onKeyDown);
  document.removeEventListener("keyup", onKeyUp);
}
