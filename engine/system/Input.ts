import { getDirection, getMagnitude, type Vector } from "../lib/Vector.ts";
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
  self.addEventListener("gamepadconnected", (event: GamepadEvent) => {
    gamepad = event.gamepad;
    onGamepadConnected(event);
  });

  self.addEventListener("gamepaddisconnected", (event: GamepadEvent) => {
    gamepad = self.navigator.getGamepads()[0];
    onGamepadDisconnected(event);
  });

  return gamepad;
}

export type ActionKeys = {
  up: number;
  down: number;
  left: number;
  right: number;
};

const actionKeys: ActionKeys = {
  up: 0,
  down: 0,
  left: 0,
  right: 0,
};

function onKeyDown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowUp":
    case "w":
      actionKeys.up = 1;
      break;
    case "ArrowDown":
    case "s":
      actionKeys.down = 1;
      break;
    case "ArrowLeft":
    case "a":
      actionKeys.left = 1;
      break;
    case "ArrowRight":
    case "d":
      actionKeys.right = 1;
      break;
  }
}

function onKeyUp(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowUp":
    case "w":
      actionKeys.up = 0;
      break;
    case "ArrowDown":
    case "s":
      actionKeys.down = 0;
      break;
    case "ArrowLeft":
    case "a":
      actionKeys.left = 0;
      break;
    case "ArrowRight":
    case "d":
      actionKeys.right = 0;
      break;
  }
}

export function useKeyboard() {
  return {
    listen(): void {
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);
    },
    unlisten(): void {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    },
  };
}

export function getActionKeys(): ActionKeys {
  return actionKeys;
}

export type PointerState = {
  isDown: boolean;
  position: Vector;
};

const pointerState: PointerState = {
  isDown: false,
  position: { x: 0, y: 0 },
};

function onMouseDown(event: MouseEvent): void {
  pointerState.isDown = true;
  pointerState.position.x = event.clientX;
  pointerState.position.y = event.clientY;
}

function onTouchStart(event: TouchEvent): void {
  pointerState.isDown = true;
  pointerState.position.x = event.touches[0].clientX;
  pointerState.position.y = event.touches[0].clientY;
}

function onMouseMove(event: MouseEvent): void {
  pointerState.position.x = event.clientX;
  pointerState.position.y = event.clientY;
}

function onTouchMove(event: TouchEvent): void {
  pointerState.position.x = event.touches[0].clientX;
  pointerState.position.y = event.touches[0].clientY;
}

function onMouseUp(): void {
  pointerState.isDown = false;
}

function onTouchEnd(): void {
  pointerState.isDown = false;
}

export function usePointer() {
  return {
    listen(): void {
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("touchstart", onTouchStart);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("touchend", onTouchEnd);
    },
    unlisten(): void {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchend", onTouchEnd);
    },
  };
}

export function getPointerState(): PointerState {
  return pointerState;
}

const touchControls = {
  dPad: {
    position: {
      x: 64,
      y: self.innerHeight - 64,
    },
    radius: 48,
    stickPosition: {
      x: 64,
      y: self.innerHeight - 64,
    },
    stickRadius: 32,
  },
  a: {
    position: {
      x: self.innerWidth - 88,
      y: self.innerHeight - 40,
    },
    radius: 24,
  },
  b: {
    position: {
      x: self.innerWidth - 40,
      y: self.innerHeight - 88,
    },
    radius: 24,
  },
};

function renderTouchControls(ctx: CanvasRenderingContext2D): void {
  ctx.beginPath();
  ctx.arc(
    touchControls.dPad.position.x,
    touchControls.dPad.position.y,
    touchControls.dPad.radius,
    0,
    2 * Math.PI,
  );
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    touchControls.dPad.stickPosition.x,
    touchControls.dPad.stickPosition.y,
    touchControls.dPad.stickRadius,
    0,
    2 * Math.PI,
  );
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    touchControls.a.position.x,
    touchControls.a.position.y,
    touchControls.a.radius,
    0,
    2 * Math.PI,
  );
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    touchControls.b.position.x,
    touchControls.b.position.y,
    touchControls.b.radius,
    0,
    2 * Math.PI,
  );
  ctx.stroke();
  ctx.fill();
}

function processTouchControls(actionKeys: ActionKeys): void {
  if (pointerState.isDown) {
    const relativePosition = {
      x: pointerState.position.x - touchControls.dPad.position.x,
      y: pointerState.position.y - touchControls.dPad.position.y,
    };

    const magnitude = getMagnitude(relativePosition);
    if (
      magnitude <= touchControls.dPad.radius &&
      magnitude >= touchControls.dPad.radius - touchControls.dPad.stickRadius
    ) {
      const direction = getDirection(relativePosition);
      const dx = Math.cos(direction);
      const dy = Math.sin(direction);

      actionKeys.right = dx;
      actionKeys.left = -dx;
      actionKeys.down = dy;
      actionKeys.up = -dy;

      touchControls.dPad.stickPosition.x = pointerState.position.x;
      touchControls.dPad.stickPosition.y = pointerState.position.y;
    } else {
      actionKeys.right = 0;
      actionKeys.left = 0;
      actionKeys.down = 0;
      actionKeys.up = 0;

      touchControls.dPad.stickPosition.x = touchControls.dPad.position.x;
      touchControls.dPad.stickPosition.y = touchControls.dPad.position.y;
    }
  } else {
    touchControls.dPad.stickPosition.x = touchControls.dPad.position.x;
    touchControls.dPad.stickPosition.y = touchControls.dPad.position.y;
  }
}

export function useTouchControls() {
  return {
    renderTouchControls,
    processTouchControls,
  };
}
