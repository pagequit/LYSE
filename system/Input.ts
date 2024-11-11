/*
gamepad standard mapping
0 	3 / A
1 	4 / B
2 	1 / X
3 	2 / Y
4 	L1
5 	R1
6 	L2
7 	R3
8 	Select
9 	Start
10	L3
11	R3
12	Up
13	Down
14	Left
15	Right
*/
// I guess this is crap because null is not passed by reference
let gamepad: Gamepad | null = null;

export function useGamepad(
  onGamepadConnected: (event: GamepadEvent) => void,
  onGamepadDisconnected: (event: GamepadEvent) => void,
) {
  window.addEventListener("gamepadconnected", (event: GamepadEvent) => {
    gamepad = event.gamepad;
    onGamepadConnected(event);
  });

  window.addEventListener("gamepaddisconnected", (event: GamepadEvent) => {
    gamepad = window.navigator.getGamepads()[0];
    onGamepadDisconnected(event);
  });

  return gamepad;
}

const actionKeys: Record<string, number> = {
  arrowUp: 0,
  arrowDown: 0,
  arrowLeft: 0,
  arrowRight: 0,
};

function onKeyDown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowUp":
      actionKeys.arrowUp = 1;
      break;
    case "ArrowDown":
      actionKeys.arrowDown = 1;
      break;
    case "ArrowLeft":
      actionKeys.arrowLeft = 1;
      break;
    case "ArrowRight":
      actionKeys.arrowRight = 1;
      break;
  }
}

function onKeyUp(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowUp":
      actionKeys.arrowUp = 0;
      break;
    case "ArrowDown":
      actionKeys.arrowDown = 0;
      break;
    case "ArrowLeft":
      actionKeys.arrowLeft = 0;
      break;
    case "ArrowRight":
      actionKeys.arrowRight = 0;
      break;
  }
}

export function useKeyboard() {
  return {
    listen: () => {
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);
    },
    unlisten: () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    },
  };
}

export function useActionKeyInput() {
  return {
    getActionKeyUp: () => actionKeys.arrowUp,
    getActionKeyDown: () => actionKeys.arrowDown,
    getActionKeyLeft: () => actionKeys.arrowLeft,
    getActionKeyRight: () => actionKeys.arrowRight,
  };
}
